# 🚀 CineVivid Complete Setup Guide

This guide walks you through setting up the complete CineVivid AI video generation platform from development to production.

## 📋 Prerequisites

### System Requirements
- **Python 3.10+** with pip
- **Node.js 18+** with npm
- **Docker & Docker Compose**
- **Redis** (for task queue)
- **PostgreSQL** (for production database)
- **FFmpeg** (for video processing)
- **Git** for version control

### Hardware Requirements
- **Minimum**: 16GB RAM, 50GB disk space
- **Recommended**: 32GB+ RAM, 100GB+ disk space, NVIDIA GPU with 24GB+ VRAM
- **GPU Support**: NVIDIA GPU with CUDA 11.8+ (for AI model inference)

### API Keys Required
- **HuggingFace Token**: [Get here](https://huggingface.co/settings/tokens) - Required for SkyReels-V2 models
- **ElevenLabs API Key**: [Get here](https://elevenlabs.io/app/profile) - Required for voiceover generation
- **Stripe Keys**: [Get here](https://dashboard.stripe.com/apikeys) - Optional for billing

## 🛠️ Development Setup

### 1. Clone and Environment Setup

```bash
# Clone repository
git clone <repository-url>
cd SkyReels-V2

# Create Python virtual environment
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# .venv\Scripts\activate    # Windows

# Install Python dependencies
pip install -r requirements.txt

# Install frontend dependencies
cd src/frontend
npm install
cd ../..
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your actual API keys
nano .env
```

**Required Environment Variables:**
```bash
# API Keys (REQUIRED)
HUGGINGFACE_TOKEN=hf_your_token_here
ELEVENLABS_API_KEY=sk_your_key_here

# Security (CHANGE IN PRODUCTION)
SECRET_KEY=your-very-secure-secret-key-64-chars-minimum

# Database
DATABASE_URL=sqlite:///./cinevivid.db  # Development
# DATABASE_URL=postgresql://user:pass@localhost/cinevivid  # Production

# Application
ENVIRONMENT=development
DEBUG=true
AUTO_INIT_DB=true
```

### 3. Database Setup

```bash
# Initialize database (automatic on first run)
python -c "from src.backend.db.database import init_database; init_database()"

# Or start the backend (will auto-initialize)
uvicorn src.backend.app:app --reload --port 8001
```

### 4. Start Services

#### Terminal 1: Backend
```bash
source .venv/bin/activate
PYTHONPATH=. uvicorn src.backend.app:app --reload --port 8001
```

#### Terminal 2: Frontend
```bash
cd src/frontend
npm run dev
```

#### Terminal 3: Redis (if not using Docker)
```bash
redis-server
```

### 5. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **API Documentation**: http://localhost:8001/docs

## 🐳 Docker Development Setup

```bash
# Copy environment file
cp .env.example .env
# Edit .env with your API keys

# Start all services
docker-compose up --build

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

## 🎯 Model Setup

### Option 1: Auto Download (Recommended)
```bash
# Set environment variables
export HUGGINGFACE_TOKEN=your_token
export MODEL_AUTO_DOWNLOAD=true

# Models will download automatically when first used
```

### Option 2: Manual Download
```bash
# Login to HuggingFace
huggingface-cli login

# Download specific models
python -c "
from src.utils.model_manager import get_model_manager
manager = get_model_manager()

# Download recommended models
manager.download_model_sync('Skywork/SkyReels-V2-T2V-14B-540P')
manager.download_model_sync('Skywork/SkyReels-V2-I2V-14B-540P')
"
```

### Model Storage Requirements
- **1.3B models**: ~3GB each
- **14B models**: ~28GB each
- **Recommended minimum**: Download T2V and I2V 14B-540P models (~56GB total)

## 🔧 Development Usage

### 1. User Registration
```bash
# Create test user via API
curl -X POST "http://localhost:8001/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com", 
    "password": "testpass123"
  }'
```

### 2. Generate Video
```bash
# Login and get token
TOKEN=$(curl -X POST "http://localhost:8001/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass123"}' \
  | jq -r '.access_token')

# Generate video
curl -X POST "http://localhost:8001/generate/text-to-video" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A beautiful sunset over mountains",
    "num_frames": 97,
    "enhance_prompt": true
  }'
```

### 3. Check Status
```bash
# Check task status
curl -X GET "http://localhost:8001/status/TASK_ID" \
  -H "Authorization: Bearer $TOKEN"
```

## 🏭 Production Deployment

### 1. Automated Setup
```bash
# Run production setup script
python setup_production.py --domain your-domain.com

# Or with configuration file
python setup_production.py --config-file production_config.json
```

### 2. Manual Production Setup

#### Update Environment
```bash
# Copy and update production environment
cp .env.example .env.prod

# Edit production values
ENVIRONMENT=production
DEBUG=false
DATABASE_URL=postgresql://user:password@postgres:5432/cinevivid
SECRET_KEY=your-super-secure-64-character-secret-key
DOMAIN=your-domain.com
```

#### Build Frontend
```bash
cd src/frontend
npm run build
cd ../..
```

#### Start Production Services
```bash
# Using production docker-compose
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 3. SSL Setup (Optional)
```bash
# Install certbot
sudo apt-get install certbot

# Generate certificates
sudo certbot certonly --webroot -w ./ssl-challenge -d your-domain.com

# Update nginx configuration with SSL
```

## 🧪 Testing

### Run Tests
```bash
# Backend tests
python -m pytest tests/ -v

# Frontend tests  
cd src/frontend
npm test
cd ../..

# Integration tests
python -m pytest tests/test_comprehensive.py -v

# Performance tests (requires GPU)
python -m pytest tests/test_comprehensive.py::TestPerformance -v -s
```

### Test Coverage
```bash
# Generate coverage report
python -m pytest tests/ --cov=src --cov-report=html
open htmlcov/index.html
```

## 📊 Monitoring & Maintenance

### Health Checks
```bash
# API health
curl http://localhost:8001/health

# Comprehensive system check
curl http://localhost:8001/admin/stats -H "Authorization: Bearer $ADMIN_TOKEN"
```

### Logs
```bash
# Application logs
tail -f logs/cinevivid.log

# Error logs
tail -f logs/error.log

# Docker logs
docker-compose logs -f backend
```

### Monitoring Dashboard
- **Grafana**: http://localhost:3001 (admin/admin)
- **Prometheus**: http://localhost:9090

### Backup
```bash
# Run backup script (created by setup)
./backup.sh

# Manual database backup
docker-compose exec postgres pg_dump -U user cinevivid > backup_$(date +%Y%m%d).sql
```

## 🔧 Configuration Reference

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `HUGGINGFACE_TOKEN` | - | **Required** - HuggingFace API token |
| `ELEVENLABS_API_KEY` | - | **Required** - ElevenLabs API key |
| `SECRET_KEY` | - | **Required** - JWT secret (64+ chars) |
| `DATABASE_URL` | sqlite:///./cinevivid.db | Database connection URL |
| `REDIS_URL` | redis://localhost:6379/0 | Redis connection URL |
| `ENVIRONMENT` | development | Environment (development/production) |
| `DEBUG` | true | Enable debug mode |
| `LOG_LEVEL` | INFO | Logging level |
| `MODEL_AUTO_DOWNLOAD` | true | Auto-download models |
| `MAX_CONCURRENT_GENERATIONS` | 1 | Max parallel video generations |

### Model Configuration

```bash
# Default models (edit in .env)
DEFAULT_T2V_MODEL=Skywork/SkyReels-V2-T2V-14B-540P
DEFAULT_I2V_MODEL=Skywork/SkyReels-V2-I2V-14B-540P
DEFAULT_DF_MODEL=Skywork/SkyReels-V2-DF-14B-540P

# Memory optimization
USE_QUANTIZATION=false  # Set to true for < 24GB VRAM
MODEL_OFFLOAD_CPU=true  # Offload to CPU when not in use
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Import Errors
```bash
# Fix Python path
export PYTHONPATH=.
# Or
PYTHONPATH=. python -m uvicorn src.backend.app:app --reload
```

#### 2. Model Download Fails
```bash
# Check HuggingFace token
huggingface-cli whoami

# Manually download
python -c "
from src.utils.model_manager import get_model_manager
manager = get_model_manager()
manager.download_model_sync('Skywork/SkyReels-V2-T2V-14B-540P')
"
```

#### 3. GPU Not Detected
```bash
# Check NVIDIA drivers
nvidia-smi

# Check PyTorch CUDA
python -c "import torch; print(torch.cuda.is_available())"

# Install NVIDIA Docker (if using Docker)
sudo apt-get install nvidia-docker2
sudo systemctl restart docker
```

#### 4. Database Connection Issues
```bash
# Check PostgreSQL
sudo systemctl status postgresql

# Reset database
python -c "
from src.backend.db.database import drop_tables, init_database
drop_tables()
init_database()
"
```

#### 5. Frontend API Connection Issues
```bash
# Check API URL in frontend
echo $NEXT_PUBLIC_API_URL

# Verify backend is running
curl http://localhost:8001/health

# Check CORS settings in backend
```

### Performance Optimization

#### Memory Usage
```bash
# Monitor GPU memory
nvidia-smi -l 5

# Monitor system memory
htop

# Enable model offloading
export MODEL_OFFLOAD_CPU=true
```

#### Generation Speed
```bash
# Use smaller models for faster generation
DEFAULT_T2V_MODEL=Skywork/SkyReels-V2-T2V-1.3B-540P

# Enable quantization for memory-constrained systems
USE_QUANTIZATION=true

# Adjust concurrent workers
CELERY_WORKER_CONCURRENCY=1
```

## 📈 Scaling for Production

### Horizontal Scaling
```yaml
# docker-compose.prod.yml
services:
  backend:
    deploy:
      replicas: 3
      
  celery_worker:
    deploy:
      replicas: 2
      
  nginx:
    # Load balancer configuration
```

### Resource Limits
```yaml
deploy:
  resources:
    limits:
      memory: 32G
      cpus: '4'
    reservations:
      memory: 16G
      devices:
        - driver: nvidia
          count: 1
          capabilities: [gpu]
```

## 🎯 Feature Roadmap

### ✅ Completed Features
- User authentication and authorization
- Text-to-video generation
- Image-to-video generation
- Prompt enhancement
- Video library management
- Credit system and billing
- Admin dashboard
- Comprehensive error handling
- Model management system
- Database integration
- Docker containerization

### 🔄 In Progress
- Advanced video editing tools
- Batch processing
- Video templates
- Social sharing features

### 📅 Planned Features
- Camera director controls
- Multi-user collaboration
- Video analytics
- Custom model training
- API marketplace integration

## 📞 Support

### Documentation
- API Documentation: `/docs` endpoint
- Model Information: [SkyReels-V2 Repository](https://github.com/SkyworkAI/SkyReels-V2)
- Frontend Components: See `src/frontend/pages/`

### Community
- Discord: [Join Community](https://discord.gg/cinevivid)
- GitHub Issues: Report bugs and feature requests
- Email: support@cinevivid.ai

---

**🎬 Happy Video Creating with CineVivid!**