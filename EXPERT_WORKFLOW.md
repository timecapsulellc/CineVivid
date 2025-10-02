# 🎯 CineVivid Expert Development Workflow

**📋 This is the definitive guide for all development work on CineVivid. Use this checklist before any changes, feature additions, or maintenance tasks.**

---

## 🔍 **PRE-CHANGE VERIFICATION (MANDATORY)**

### **System Health Check** ✅
Run these commands before any development work:

```bash
# 1. Verify environment and services
cd SkyReels-V2

# 2. Check system health
curl http://localhost:8001/health | jq '.'

# 3. Verify database connectivity
python -c "from src.backend.db.database import check_database_connection; print(f'✅ Database: {check_database_connection()}')"

# 4. Check GPU availability (for AI features)
python -c "import torch; print(f'✅ GPU Available: {torch.cuda.is_available()}')"

# 5. Verify API keys
python -c "import os; print(f'✅ HuggingFace: {bool(os.getenv(\"HUGGINGFACE_TOKEN\"))}'); print(f'✅ ElevenLabs: {bool(os.getenv(\"ELEVENLABS_API_KEY\"))}')"

# 6. Test core functionality
python -c "
import requests
try:
    response = requests.get('http://localhost:8001/')
    print(f'✅ API Status: {response.status_code}')
except:
    print('❌ API not responding')
"
```

**Expected Results:**
- ✅ Health status: `healthy` or `degraded`
- ✅ Database: `True`
- ✅ GPU: `True` (or `False` if using CPU)
- ✅ API Keys: `True` for both
- ✅ API Status: `200`

### **Code Quality Pre-Check** ✅
```bash
# 1. Run linting
python -m flake8 src/backend/ --max-line-length=100
cd src/frontend && npm run lint && cd ../..

# 2. Type checking
cd src/frontend && npx tsc --noEmit && cd ../..

# 3. Security scan
python -m bandit -r src/backend/ -ll

# 4. Test current functionality
python -m pytest tests/test_api.py -v
```

### **Documentation Status Check** ✅
```bash
# Verify key documentation exists and is current
ls -la README.md SETUP_GUIDE.md DEVELOPMENT_STATUS.md EXPERT_WORKFLOW.md

# Check last update dates
git log --oneline -5
```

---

## 🚀 **EXPERT DEVELOPMENT WORKFLOW**

### **Phase 1: Planning & Preparation** 📋

#### **1.1 Feature Analysis**
- [ ] **Requirements Definition**: Clear user story and acceptance criteria
- [ ] **Impact Assessment**: Effects on existing features and performance
- [ ] **Resource Planning**: GPU memory, storage, API quotas required
- [ ] **Dependency Review**: New packages or model requirements

#### **1.2 Architecture Planning**
- [ ] **Database Changes**: Schema modifications, migrations needed
- [ ] **API Design**: New endpoints, request/response formats
- [ ] **Frontend Impact**: UI/UX changes, new components needed
- [ ] **Security Review**: Authentication, authorization, input validation

#### **1.3 Environment Preparation**
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Ensure clean working directory
git status
```

### **Phase 2: Test-Driven Development** 🧪

#### **2.1 Write Tests First**
```bash
# Add tests to appropriate files
vim tests/test_comprehensive.py

# Run tests (should fail initially)
python -m pytest tests/test_comprehensive.py::TestYourFeature -v

# Document expected behavior
```

#### **2.2 Test Categories to Consider**
- [ ] **Unit Tests**: Individual function testing
- [ ] **Integration Tests**: API endpoint testing
- [ ] **Security Tests**: Input validation, auth bypass attempts
- [ ] **Performance Tests**: Load testing, memory usage
- [ ] **Error Handling Tests**: Edge cases and failure scenarios

### **Phase 3: Implementation** 🛠️

#### **3.1 Backend Development Order**
1. **Database Models** (if needed)
   ```bash
   vim src/backend/db/models.py
   vim src/backend/db/schemas.py
   ```

2. **CRUD Operations** (if needed)
   ```bash
   vim src/backend/db/crud.py
   ```

3. **API Endpoints**
   ```bash
   vim src/backend/app.py
   ```

4. **Error Handling**
   ```bash
   vim src/backend/utils/errors.py  # Add custom exceptions if needed
   ```

#### **3.2 Frontend Development Order**
1. **API Integration**
   ```bash
   vim src/frontend/services/api.ts
   ```

2. **Components/Pages**
   ```bash
   vim src/frontend/pages/YourNewPage.tsx
   ```

3. **Context Updates** (if needed)
   ```bash
   vim src/frontend/contexts/AuthContext.tsx
   ```

#### **3.3 Quality Checks During Development**
```bash
# Run tests frequently
python -m pytest tests/test_comprehensive.py::TestYourFeature -v

# Check code style
python -m flake8 src/backend/ --max-line-length=100

# Frontend type checking
cd src/frontend && npx tsc --noEmit
```

### **Phase 4: Integration & Testing** 🔗

#### **4.1 Local Integration Testing**
```bash
# Start full stack
docker-compose up -d

# Test your feature end-to-end
curl -X POST "http://localhost:8001/your-endpoint" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'

# Frontend testing
open http://localhost:3000
```

#### **4.2 Performance Validation**
```bash
# Monitor resources during testing
docker stats

# Check logs for errors
docker-compose logs backend | grep ERROR

# Memory usage
python -c "
import psutil, torch
print(f'RAM: {psutil.virtual_memory().percent}%')
if torch.cuda.is_available():
    print(f'GPU: {torch.cuda.memory_allocated(0) / torch.cuda.max_memory_allocated(0) * 100:.1f}%')
"
```

### **Phase 5: Documentation & Review** 📚

#### **5.1 Update Documentation**
- [ ] **API Documentation**: Update OpenAPI schemas
- [ ] **README.md**: Update feature list and status
- [ ] **SETUP_GUIDE.md**: Add setup instructions for new features
- [ ] **DEVELOPMENT_STATUS.md**: Update completion status

#### **5.2 Code Review Checklist**
- [ ] **Security**: No hardcoded secrets, proper input validation
- [ ] **Performance**: No memory leaks, efficient algorithms
- [ ] **Error Handling**: Proper exception handling and logging
- [ ] **Testing**: Comprehensive test coverage
- [ ] **Documentation**: Code comments and API docs updated

### **Phase 6: Deployment Preparation** 🚀

#### **6.1 Staging Deployment**
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy to staging
docker-compose -f docker-compose.prod.yml up -d

# Run smoke tests
python -m pytest tests/test_comprehensive.py::TestIntegration -v
```

#### **6.2 Production Readiness Check**
- [ ] **Environment Variables**: All required vars documented in `.env.example`
- [ ] **Database Migrations**: Created and tested
- [ ] **Monitoring**: Metrics and alerts configured
- [ ] **Backup Procedures**: Tested and documented
- [ ] **Rollback Plan**: Prepared and documented

---

## 🎯 **EXPERT QUALITY GATES**

### **Automated Quality Gates** (Must Pass)
```bash
#!/bin/bash
# quality_check.sh - Run this before any commit

echo "🔍 Running Quality Gates..."

# 1. Linting
echo "📝 Code Linting..."
python -m flake8 src/backend/ --max-line-length=100 --count --statistics
cd src/frontend && npm run lint && cd ..

# 2. Type Checking
echo "🎯 Type Checking..."
cd src/frontend && npx tsc --noEmit && cd ..

# 3. Security Scan
echo "🛡️ Security Scan..."
python -m bandit -r src/backend/ -f json -o security_report.json
echo "Security report saved to security_report.json"

# 4. Test Coverage
echo "🧪 Test Coverage..."
python -m pytest tests/ --cov=src --cov-fail-under=80 --cov-report=term-missing

# 5. Build Test
echo "🏗️ Build Test..."
docker-compose build backend frontend

# 6. Integration Test
echo "🔗 Integration Test..."
python -m pytest tests/test_comprehensive.py::TestIntegration -v

echo "✅ Quality Gates Completed!"
```

### **Manual Quality Review** (Expert Validation)
- [ ] **Architecture**: Follows established patterns and conventions
- [ ] **Scalability**: Can handle increased load
- [ ] **Maintainability**: Code is readable and well-documented
- [ ] **User Experience**: Intuitive and error-friendly
- [ ] **Business Logic**: Meets requirements and edge cases

---

## 📊 **EXPERT MONITORING & MAINTENANCE**

### **Daily Health Check Script** 📅
```bash
#!/bin/bash
# daily_health_check.sh

echo "🏥 Daily CineVivid Health Check - $(date)"

# System Health
curl -s http://localhost:8001/health | jq '.'

# Database Status
python -c "from src.backend.db.database import get_database_info; import json; print(json.dumps(get_database_info(), indent=2))"

# Model Cache Status
curl -s -H "Authorization: Bearer $ADMIN_TOKEN" http://localhost:8001/models/cache/stats | jq '.'

# Recent Error Summary
tail -n 100 logs/error.log | grep "$(date +%Y-%m-%d)" | wc -l

# Disk Space Check
df -h | grep -E "(/$|/videos|/models)"

# GPU Status (if available)
if command -v nvidia-smi &> /dev/null; then
    nvidia-smi --query-gpu=memory.used,memory.total,utilization.gpu --format=csv,noheader,nounits
fi

echo "✅ Daily health check completed"
```

### **Performance Monitoring** 📈

#### **Key Metrics to Track**
```python
# metrics_collector.py
import time
import psutil
import torch
from src.backend.db.database import get_db
from src.backend.db import crud

def collect_metrics():
    """Collect system metrics for monitoring"""
    
    metrics = {
        "timestamp": time.time(),
        "system": {
            "cpu_percent": psutil.cpu_percent(),
            "memory_percent": psutil.virtual_memory().percent,
            "disk_usage": psutil.disk_usage('.').percent,
        },
        "application": {},
        "database": {}
    }
    
    # GPU metrics
    if torch.cuda.is_available():
        metrics["gpu"] = {
            "memory_allocated_gb": torch.cuda.memory_allocated(0) / (1024**3),
            "memory_total_gb": torch.cuda.get_device_properties(0).total_memory / (1024**3),
            "utilization_percent": 0  # Would need nvidia-ml-py for real data
        }
    
    # Database metrics
    try:
        db = next(get_db())
        stats = crud.get_system_stats(db)
        metrics["database"] = stats
        db.close()
    except Exception as e:
        metrics["database"] = {"error": str(e)}
    
    return metrics

# Usage: python -c "from metrics_collector import collect_metrics; import json; print(json.dumps(collect_metrics(), indent=2))"
```

### **Alerting Thresholds** 🚨
```yaml
# monitoring/alerting_rules.yml
rules:
  - name: cinevivid_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "High error rate detected"
          
      - alert: GPUMemoryHigh
        expr: gpu_memory_usage_percent > 90
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "GPU memory usage critical"
          
      - alert: DiskSpaceLow
        expr: disk_free_gb < 5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Disk space running low"
```

---

## 🎯 **EXPERT DEVELOPMENT PATTERNS**

### **1. Feature Development Pattern**
```bash
# Standard feature development flow
git checkout main
git pull origin main
git checkout -b feature/new-feature

# Run pre-change verification
bash quality_check.sh

# Develop with TDD
# 1. Write tests
# 2. Implement feature
# 3. Run tests continuously
# 4. Update documentation

# Final validation
bash quality_check.sh
git add .
git commit -m "feat: descriptive commit message"
git push origin feature/new-feature

# Create PR with comprehensive description
```

### **2. Bug Fix Pattern**
```bash
# Bug fix workflow
git checkout -b hotfix/bug-description

# Reproduce bug with test
python -m pytest tests/test_bug_reproduction.py -v

# Fix bug
# Update tests to prevent regression

# Validate fix
python -m pytest tests/ -v
bash quality_check.sh

# Deploy hotfix
git commit -m "fix: bug description and solution"
git push origin hotfix/bug-description
```

### **3. Performance Optimization Pattern**
```bash
# Performance optimization workflow
# 1. Baseline measurement
python -c "from metrics_collector import collect_metrics; import json; print(json.dumps(collect_metrics(), indent=2))" > baseline_metrics.json

# 2. Identify bottlenecks
python -m pytest tests/test_comprehensive.py::TestPerformance -v --durations=0

# 3. Implement optimization

# 4. Measure improvement
python -c "from metrics_collector import collect_metrics; import json; print(json.dumps(collect_metrics(), indent=2))" > optimized_metrics.json

# 5. Compare results
python compare_metrics.py baseline_metrics.json optimized_metrics.json
```

---

## 📋 **EXPERT CHECKLISTS**

### **New Feature Checklist** ✅
- [ ] **Planning Phase**
  - [ ] User story defined with acceptance criteria
  - [ ] Technical requirements documented
  - [ ] Resource requirements estimated
  - [ ] Impact on existing features assessed
  
- [ ] **Design Phase**
  - [ ] API endpoints designed (if applicable)
  - [ ] Database schema changes planned
  - [ ] UI/UX mockups created (if applicable)
  - [ ] Error handling strategy defined
  
- [ ] **Development Phase**
  - [ ] Tests written before implementation
  - [ ] Backend implementation completed
  - [ ] Frontend implementation completed
  - [ ] Error handling implemented
  - [ ] Logging added for debugging
  
- [ ] **Testing Phase**
  - [ ] Unit tests passing (>80% coverage)
  - [ ] Integration tests passing
  - [ ] Security tests passing
  - [ ] Performance tests passing (if applicable)
  - [ ] Manual testing completed
  
- [ ] **Documentation Phase**
  - [ ] Code comments added
  - [ ] API documentation updated
  - [ ] Setup guide updated
  - [ ] Development status updated
  
- [ ] **Deployment Phase**
  - [ ] Environment variables documented
  - [ ] Migration scripts created (if needed)
  - [ ] Production build successful
  - [ ] Staging deployment tested
  - [ ] Rollback plan prepared

### **Bug Fix Checklist** ✅
- [ ] **Investigation**
  - [ ] Bug reproduced locally
  - [ ] Root cause identified
  - [ ] Impact scope determined
  - [ ] Regression test written
  
- [ ] **Resolution**
  - [ ] Fix implemented
  - [ ] Tests updated to prevent regression
  - [ ] Code review completed
  - [ ] Documentation updated
  
- [ ] **Validation**
  - [ ] Bug fix verified
  - [ ] No new bugs introduced
  - [ ] Performance impact assessed
  - [ ] User experience validated

### **Security Update Checklist** 🔒
- [ ] **Vulnerability Assessment**
  - [ ] Security scan completed
  - [ ] Dependencies updated
  - [ ] Configuration reviewed
  - [ ] Access controls verified
  
- [ ] **Mitigation**
  - [ ] Security patches applied
  - [ ] Input validation enhanced
  - [ ] Logging improved
  - [ ] Monitoring alerts updated
  
- [ ] **Verification**
  - [ ] Penetration testing completed
  - [ ] Security tests passing
  - [ ] Compliance requirements met
  - [ ] Team notification sent

---

## 🔧 **EXPERT TOOLS & SCRIPTS**

### **Development Helper Scripts**

#### **Quick Setup Script**
```bash
#!/bin/bash
# quick_setup.sh - Expert development environment setup

echo "🚀 Setting up CineVivid development environment..."

# Check prerequisites
command -v python3 >/dev/null 2>&1 || { echo "❌ Python3 required"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ Node.js required"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "❌ Docker required"; exit 1; }

# Setup Python environment
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Setup frontend
cd src/frontend
npm install
cd ../..

# Setup environment
if [ ! -f .env ]; then
    cp .env.example .env
    echo "⚠️ Please edit .env file with your API keys"
fi

# Initialize database
python -c "from src.backend.db.database import init_database; init_database()"

echo "✅ Development environment ready!"
echo "📚 Next steps:"
echo "1. Edit .env with your API keys"
echo "2. Run: docker-compose up -d"
echo "3. Open: http://localhost:3000"
```

#### **Pre-Commit Hook**
```bash
#!/bin/bash
# .git/hooks/pre-commit - Automatic quality checks

echo "🔍 Running pre-commit quality checks..."

# Run quality checks
bash quality_check.sh

if [ $? -ne 0 ]; then
    echo "❌ Quality checks failed. Commit aborted."
    echo "💡 Fix issues and try again."
    exit 1
fi

echo "✅ Quality checks passed. Proceeding with commit."
```

#### **Deployment Verification Script**
```bash
#!/bin/bash
# verify_deployment.sh - Post-deployment verification

echo "🔍 Verifying deployment..."

# Test API endpoints
curl -f http://localhost:8001/health || exit 1
curl -f http://localhost:3000 || exit 1

# Test authentication
TOKEN=$(curl -s -X POST "http://localhost:8001/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "demo", "password": "demo123"}' \
  | jq -r '.access_token')

if [ "$TOKEN" = "null" ]; then
    echo "❌ Authentication test failed"
    exit 1
fi

# Test video generation API
TASK_RESPONSE=$(curl -s -X POST "http://localhost:8001/generate/text-to-video" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Test video", "num_frames": 25}')

if echo "$TASK_RESPONSE" | jq -e '.task_id' > /dev/null; then
    echo "✅ Video generation API working"
else
    echo "❌ Video generation API failed"
    exit 1
fi

echo "✅ Deployment verification successful"
```

---

## 📈 **EXPERT MONITORING DASHBOARD**

### **Real-time Status Commands**
```bash
# System overview
echo "🖥️ SYSTEM STATUS"
echo "CPU: $(python -c "import psutil; print(f'{psutil.cpu_percent():.1f}%')")"
echo "RAM: $(python -c "import psutil; print(f'{psutil.virtual_memory().percent:.1f}%')")"
echo "Disk: $(python -c "import psutil; print(f'{psutil.disk_usage(\".\").percent:.1f}%')")"

# Service status
echo -e "\n🚀 SERVICES STATUS"
curl -s http://localhost:8001/health | jq -r '.services | to_entries[] | "\(.key): \(.value)"'

# Recent activity
echo -e "\n📊 RECENT ACTIVITY"
echo "Recent videos: $(curl -s -H "Authorization: Bearer $ADMIN_TOKEN" http://localhost:8001/admin/stats | jq '.total_videos')"
echo "Active users: $(curl -s -H "Authorization: Bearer $ADMIN_TOKEN" http://localhost:8001/admin/stats | jq '.active_users')"

# Error summary
echo -e "\n🚨 ERROR SUMMARY (Last 24h)"
grep "$(date +%Y-%m-%d)" logs/error.log | wc -l | xargs echo "Errors today:"
```

### **Performance Analysis**
```python
# performance_analyzer.py
def analyze_performance():
    """Expert-level performance analysis"""
    
    import time
    import requests
    import statistics
    
    # API response time test
    endpoint = "http://localhost:8001/health"
    response_times = []
    
    for i in range(10):
        start = time.time()
        response = requests.get(endpoint)
        duration = time.time() - start
        response_times.append(duration * 1000)  # Convert to ms
    
    print(f"🚀 API Performance Analysis")
    print(f"Average response time: {statistics.mean(response_times):.2f}ms")
    print(f"95th percentile: {sorted(response_times)[int(0.95 * len(response_times))]:.2f}ms")
    print(f"Max response time: {max(response_times):.2f}ms")
    
    # Add more analysis as needed
    return {
        "avg_response_time": statistics.mean(response_times),
        "p95_response_time": sorted(response_times)[int(0.95 * len(response_times))],
        "max_response_time": max(response_times)
    }

# Run: python -c "from performance_analyzer import analyze_performance; analyze_performance()"
```

---

## 🎯 **EXPERT TROUBLESHOOTING GUIDE**

### **Common Issues & Solutions**

#### **1. API Not Responding**
```bash
# Diagnostic steps
docker-compose ps                    # Check container status
docker-compose logs backend         # Check backend logs
curl http://localhost:8001/health   # Test health endpoint

# Solution
docker-compose restart backend
```

#### **2. Frontend Build Failures**
```bash
# Check Node.js version
node --version  # Should be 18+

# Clear cache and rebuild
cd src/frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### **3. Model Loading Issues**
```bash
# Check GPU status
nvidia-smi

# Check model downloads
python -c "from src.utils.model_manager import get_model_manager; manager = get_model_manager(); print(manager.get_cache_stats())"

# Re-download model
python -c "from src.utils.model_manager import get_model_manager; manager = get_model_manager(); manager.download_model_sync('Skywork/SkyReels-V2-T2V-14B-540P')"
```

#### **4. Database Connection Issues**
```bash
# Check database status
python -c "from src.backend.db.database import check_database_connection, get_database_info; print(f'Connected: {check_database_connection()}'); print(get_database_info())"

# Reinitialize database
python -c "from src.backend.db.database import init_database; init_database()"
```

---

## 📚 **EXPERT REFERENCE LINKS**

### **Internal Documentation**
- 📖 [`README.md`](README.md) - Main project documentation
- 🛠️ [`SETUP_GUIDE.md`](SETUP_GUIDE.md) - Complete setup instructions
- 📊 [`DEVELOPMENT_STATUS.md`](DEVELOPMENT_STATUS.md) - Current development status
- 🏗️ [`docker-compose.yml`](docker-compose.yml) - Development infrastructure
- 🚀 [`setup_production.py`](setup_production.py) - Production deployment automation

### **API Documentation**
- 🔗 **Live API Docs**: http://localhost:8001/docs
- 🔗 **ReDoc**: http://localhost:8001/redoc
- 🔗 **Health Check**: http://localhost:8001/health
- 🔗 **Admin Stats**: http://localhost:8001/admin/stats

### **External Resources**
- 🤗 [SkyReels-V2 Models](https://huggingface.co/collections/Skywork/skyreels-v2-6801b1b93df627d441d0d0d9)
- 🎵 [ElevenLabs Voice Library](https://elevenlabs.io/voice-library)
- 🐳 [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- ⚡ [FastAPI Documentation](https://fastapi.tiangolo.com/)
- ⚛️ [Next.js Documentation](https://nextjs.org/docs)

---

**🎬 This workflow ensures consistent, high-quality development and maintenance of the CineVivid platform.**

**💡 Always refer to this guide before making any changes, and update it as the project evolves.**