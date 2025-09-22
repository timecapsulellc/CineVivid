#!/bin/bash

# CineVivid Docker Helper Script
# Usage: ./docker-helper.sh [command]

set -e

PROJECT_NAME="cinevivid"
DOCKER_COMPOSE_FILE="docker-compose.yml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_requirements() {
    log_info "Checking requirements..."

    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    # Check if Docker Compose is available
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose is not available. Please install Docker Compose."
        exit 1
    fi

    # Check if .env file exists
    if [ ! -f ".env" ]; then
        log_error ".env file not found. Please copy .env.example to .env and fill in your API keys."
        exit 1
    fi

    # Check NVIDIA Docker (optional)
    if command -v nvidia-docker &> /dev/null; then
        log_info "NVIDIA Docker detected - GPU support available"
    else
        log_warning "NVIDIA Docker not detected - GPU acceleration may not work"
    fi

    log_success "Requirements check passed"
}

build_images() {
    log_info "Building Docker images..."
    docker-compose -f $DOCKER_COMPOSE_FILE build --no-cache
    log_success "Images built successfully"
}

start_services() {
    log_info "Starting services..."
    docker-compose -f $DOCKER_COMPOSE_FILE up -d
    log_info "Waiting for services to be healthy..."
    sleep 10
    check_health
}

stop_services() {
    log_info "Stopping services..."
    docker-compose -f $DOCKER_COMPOSE_FILE down
    log_success "Services stopped"
}

check_health() {
    log_info "Checking service health..."

    # Check Redis
    if docker-compose -f $DOCKER_COMPOSE_FILE exec -T redis redis-cli ping | grep -q "PONG"; then
        log_success "Redis is healthy"
    else
        log_error "Redis is not healthy"
    fi

    # Check Backend
    if curl -f http://localhost:8001/health &> /dev/null; then
        log_success "Backend is healthy"
    else
        log_error "Backend is not healthy"
    fi

    # Check Celery
    if docker-compose -f $DOCKER_COMPOSE_FILE exec -T celery_worker celery -A src.backend.celery_tasks inspect ping &> /dev/null; then
        log_success "Celery worker is healthy"
    else
        log_warning "Celery worker health check failed (may be normal during startup)"
    fi
}

view_logs() {
    service=${2:-backend}
    log_info "Viewing logs for $service..."
    docker-compose -f $DOCKER_COMPOSE_FILE logs -f $service
}

test_api() {
    log_info "Testing API endpoints..."

    # Test health endpoint
    if curl -f http://localhost:8001/health &> /dev/null; then
        log_success "Health endpoint working"
    else
        log_error "Health endpoint failed"
        return 1
    fi

    # Test video generation (mock test)
    response=$(curl -s -X POST http://localhost:8001/generate/video \
        -H "Content-Type: application/json" \
        -d '{"prompt": "test prompt", "duration": 5}')

    if echo "$response" | grep -q "task_id"; then
        log_success "Video generation endpoint working"
        task_id=$(echo "$response" | grep -o '"task_id":"[^"]*"' | cut -d'"' -f4)
        log_info "Test task ID: $task_id"
    else
        log_error "Video generation endpoint failed"
        return 1
    fi
}

scale_workers() {
    count=${2:-2}
    log_info "Scaling Celery workers to $count..."
    docker-compose -f $DOCKER_COMPOSE_FILE up -d --scale celery_worker=$count
    log_success "Scaled to $count workers"
}

cleanup() {
    log_info "Cleaning up Docker resources..."
    docker-compose -f $DOCKER_COMPOSE_FILE down -v --remove-orphans
    docker system prune -f
    log_success "Cleanup completed"
}

show_usage() {
    echo "CineVivid Docker Helper Script"
    echo ""
    echo "Usage: $0 [command] [options]"
    echo ""
    echo "Commands:"
    echo "  build          Build Docker images"
    echo "  start          Start all services"
    echo "  stop           Stop all services"
    echo "  restart        Restart all services"
    echo "  logs [service] View logs (default: backend)"
    echo "  health         Check service health"
    echo "  test           Test API endpoints"
    echo "  scale [count]  Scale Celery workers (default: 2)"
    echo "  cleanup        Remove containers, volumes, and prune"
    echo "  status         Show service status"
    echo "  help           Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start          # Start the application"
    echo "  $0 logs backend   # View backend logs"
    echo "  $0 scale 4        # Scale to 4 workers"
    echo "  $0 test           # Test API endpoints"
}

show_status() {
    log_info "Service Status:"
    docker-compose -f $DOCKER_COMPOSE_FILE ps

    echo ""
    log_info "Resource Usage:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"
}

# Main script logic
case "${1:-help}" in
    build)
        check_requirements
        build_images
        ;;
    start)
        check_requirements
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        stop_services
        sleep 2
        start_services
        ;;
    logs)
        view_logs "$@"
        ;;
    health)
        check_health
        ;;
    test)
        test_api
        ;;
    scale)
        scale_workers "$@"
        ;;
    cleanup)
        cleanup
        ;;
    status)
        show_status
        ;;
    help|--help|-h)
        show_usage
        ;;
    *)
        log_error "Unknown command: $1"
        echo ""
        show_usage
        exit 1
        ;;
esac