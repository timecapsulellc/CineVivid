<p align="center">
  <img src="assets/logo2.png" alt="SkyReels Logo" width="50%">
</p>

<h1 align="center">CineVivid: AI Video Generation Web Application</h1>

<p align="center">
📑 <a href="https://arxiv.org/pdf/2504.13074">Technical Report</a> · 👋 <a href="https://www.skyreels.ai/home?utm_campaign=github_SkyReels_V2" target="_blank">Playground</a> · 💬 <a href="https://discord.gg/PwM6NYtccQ" target="_blank">Discord</a> · 🤗 <a href="https://huggingface.co/collections/Skywork/skyreels-v2-6801b1b93df627d441d0d0d9" target="_blank">Hugging Face</a> · 🤖 <a href="https://www.modelscope.cn/collections/SkyReels-V2-f665650130b144" target="_blank">ModelScope</a>
</p>

---
Welcome to the **CineVivid** repository! This is a complete web application for AI video generation, built on top of the SkyReels-V2 infinite-length film generative model. The application provides an intuitive interface for text-to-video, image-to-video, lip sync, and other AI-powered video creation tools.


## 🔥🔥🔥 News!!
* Jun 1, 2025: 🎉 We published the technical report, [SkyReels-Audio: Omni Audio-Conditioned Talking Portraits in Video Diffusion Transformers](https://arxiv.org/pdf/2506.00830).
* May 16, 2025: 🔥 We release the inference code for [video extension](#ve) and [start/end frame control](#se) in diffusion forcing model.
* Apr 24, 2025: 🔥 We release the 720P models, [SkyReels-V2-DF-14B-720P](https://huggingface.co/Skywork/SkyReels-V2-DF-14B-720P) and [SkyReels-V2-I2V-14B-720P](https://huggingface.co/Skywork/SkyReels-V2-I2V-14B-720P). The former facilitates infinite-length autoregressive video generation, and the latter focuses on Image2Video synthesis.
* Apr 21, 2025: 👋 We release the inference code and model weights of [SkyReels-V2](https://huggingface.co/collections/Skywork/skyreels-v2-6801b1b93df627d441d0d0d9) Series Models and the video captioning model [SkyCaptioner-V1](https://huggingface.co/Skywork/SkyCaptioner-V1) .
* Apr 3, 2025: 🔥 We also release [SkyReels-A2](https://github.com/SkyworkAI/SkyReels-A2). This is an open-sourced controllable video generation framework capable of assembling arbitrary visual elements.
* Feb 18, 2025: 🔥 we released [SkyReels-A1](https://github.com/SkyworkAI/SkyReels-A1). This is an open-sourced and effective framework for portrait image animation.
* Feb 18, 2025: 🔥 We released [SkyReels-V1](https://github.com/SkyworkAI/SkyReels-V1). This is the first and most advanced open-source human-centric video foundation model.

## 🎥 CineVivid: AI Video Generation Platform

CineVivid is a comprehensive AI-powered video creation platform built on SkyReels-V2, offering professional-grade tools for content creators, marketers, and filmmakers. Transform your ideas into cinematic videos with our suite of AI tools.

### ✨ Key Features

- **🎬 AI Video**: Advanced text-to-video generation with cinematic quality
- **🎭 AI Drama**: Create compelling short dramas and storytelling content
- **🖼️ Generate Image**: Professional image generation from text prompts
- **🎤 Talking Avatar**: Bring characters to life with natural speech synthesis
- **🎪 Generate Drama**: Specialized tool for cinematic short film creation
- **🎨 Train Model**: Custom AI model training for personalized content
- **🎵 Voiceover Integration**: ElevenLabs-powered professional voice synthesis
- **🎯 Prompt Enhancement**: AI-powered prompt optimization using Qwen2.5-32B

### 🎬 Demo Videos
<table>
  <tr>
    <td align="center">
      <video src="https://github.com/user-attachments/assets/f6f9f9a7-5d5f-433c-9d73-d8d593b7ad25" width="100%"></video>
      <br><small>AI Video Generation</small>
    </td>
    <td align="center">
      <video src="https://github.com/user-attachments/assets/0eb13415-f4d9-4aaf-bcd3-3031851109b9" width="100%"></video>
      <br><small>Image-to-Video Animation</small>
    </td>
    <td align="center">
      <video src="https://github.com/user-attachments/assets/dcd16603-5bf4-4786-8e4d-1ed23889d07a" width="100%"></video>
      <br><small>Long-form Video Creation</small>
    </td>
  </tr>
</table>


## 📑 Development Status

### **✅ COMPLETED (100% Functional)**
- [x] **Complete Web Application** - Full-stack implementation with React + FastAPI
- [x] **Database Integration** - PostgreSQL with comprehensive models and CRUD operations
- [x] **Authentication System** - JWT-based auth with user management and credit system
- [x] **Video Generation Pipeline** - Text-to-video and Image-to-video with SkyReels-V2
- [x] **Prompt Enhancement** - AI-powered prompt optimization using Qwen2.5-32B
- [x] **Model Management** - Automatic downloading and caching system for SkyReels-V2 models
- [x] **Error Handling** - Comprehensive error management with 20+ custom exception types
- [x] **Logging System** - Structured JSON logging with security monitoring
- [x] **Test Suite** - End-to-end testing with 479-line comprehensive test coverage
- [x] **Production Setup** - Automated deployment with Docker, monitoring, and SSL
- [x] **API Documentation** - Complete OpenAPI/Swagger docs at `/docs`
- [x] **Frontend-Backend Integration** - Real API calls with authentication and error handling

### **🎯 SkyReels-V2 Model Integration**
- [x] <a href="https://arxiv.org/pdf/2504.13074">Technical Report</a>
- [x] Checkpoints of the 14B and 1.3B Models Series
- [x] Single-GPU & Multi-GPU Inference Code
- [x] <a href="https://huggingface.co/Skywork/SkyCaptioner-V1">SkyCaptioner-V1</a>: A Video Captioning Model
- [x] **Production-Ready Web Platform** with complete UI/UX
- [x] Prompt Enhancer with API integration
- [x] Diffusers integration
- [ ] Checkpoints of the 5B Models Series
- [ ] Checkpoints of the Camera Director Models
- [ ] Checkpoints of the Step & Guidance Distill Model

### **🚀 Platform Features (All Implemented)**
- [x] **User Management** - Registration, login, profile management
- [x] **Credit System** - Usage tracking and billing integration
- [x] **Video Library** - Gallery with preview, download, and sharing
- [x] **Admin Dashboard** - System monitoring and model management
- [x] **API Access** - RESTful API with authentication
- [x] **Real-time Updates** - Live progress tracking for video generation
- [x] **Error Recovery** - Robust error handling with user feedback
- [x] **Production Monitoring** - Prometheus + Grafana setup


## 🎬 CineVivid Web Application

CineVivid is a comprehensive AI-powered video creation platform inspired by SkyReels.ai, built on top of the SkyReels-V2 infinite-length film generative model. Our platform democratizes professional video production with an intuitive web interface and powerful AI tools.

### 🚀 Core Features

#### **🎥 AI Video Generation**
- **Text-to-Video**: Transform any text prompt into cinematic videos
- **Image-to-Video**: Animate static images with natural motion
- **Infinite Length**: Generate videos of any duration using Diffusion Forcing
- **High Resolution**: Support for 540P and 720P video output

#### **🎭 AI Drama & Storytelling**
- **Generate Drama**: Create compelling short dramas with AI assistance
- **Story Templates**: Pre-built templates for different drama genres
- **Character Development**: AI-powered character consistency
- **Scene Planning**: Automated scene composition and transitions

#### **🎨 Creative Tools**
- **Generate Image**: Professional image generation from text prompts
- **Talking Avatar**: Bring characters to life with natural speech synthesis
- **Voiceover Integration**: ElevenLabs-powered professional voice synthesis
- **Lip Sync**: Perfect synchronization between audio and video

#### **🔧 Advanced Features**
- **Train Model**: Custom AI model training for personalized content
- **Prompt Enhancement**: AI-powered prompt optimization using Qwen2.5-32B
- **Batch Processing**: Generate multiple videos simultaneously
- **Style Transfer**: Apply custom artistic styles to generations

#### **💼 Professional Features**
- **Real-time Progress**: Live status updates during generation
- **Video Preview**: Instant playback of generated content
- **Credit System**: Flexible usage tracking and billing
- **API Access**: RESTful API for integration
- **Responsive UI**: Modern React interface with Material-UI

### Web Application Setup

#### Prerequisites
- Python 3.10 or higher
- Node.js 16 or higher
- FFmpeg (for video processing)
- Redis (for background tasks)
- Hugging Face account (for model access)
- ElevenLabs account (for voiceover)

#### Installation

1. **Clone and setup Python environment**
   ```bash
   git clone https://github.com/yourusername/cinevivid-ai.git
   cd cinevivid-ai
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Setup Node.js environment**
   ```bash
   cd src/frontend
   npm install
   cd ../..
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys (see .env.example for details)
   ```

#### API Keys Required

1. **Hugging Face Token**
   - Visit: https://huggingface.co/settings/tokens
   - Create token with "Read" permissions
   - Add to `.env`: `HUGGINGFACE_TOKEN=hf_xxxxxxxxxxxxxxxxx`

2. **ElevenLabs API Key**
   - Visit: https://elevenlabs.io/app/profile
   - Generate API key
   - Add to `.env`: `ELEVENLABS_API_KEY=sk_xxxxxxxxxxxxxxxxx`

#### Running the Application

1. **Start Redis** (if not running)
   ```bash
   redis-server
   ```

2. **Start Backend**
   ```bash
   source .venv/bin/activate
   PYTHONPATH=/path/to/project uvicorn src.backend.app:app --reload --port 8001
   ```

3. **Start Frontend** (in another terminal)
   ```bash
   cd src/frontend
   npm start
   ```

4. **Access Application**
   - Frontend: http://localhost:1234
   - Backend API: http://localhost:8001
   - API Docs: http://localhost:8001/docs

#### Usage

1. Navigate to "All Tools" → "Text to Video"
2. Enter a descriptive prompt
3. Optionally enable voiceover and select voice
4. Click "Generate Video" and monitor progress
5. View your AI-generated video with audio

### Security Notes

- **Never commit `.env` file** to version control
- **API keys are loaded from environment** variables
- **Configure HTTPS** in production
- **Implement rate limiting** for production use

---

## 🐳 Docker Deployment

CineVivid includes complete Docker support for easy deployment and scaling.

### Prerequisites

- **Docker** and **Docker Compose** installed
- **NVIDIA Docker** (for GPU support): `sudo apt install nvidia-docker2`
- **API Keys** configured in `.env` file

### Quick Start with Docker

1. **Clone and setup:**
   ```bash
   git clone https://github.com/timecapsulellc/CineVivid
   cd CineVivid
   cp .env.example .env
   # Edit .env with your actual API keys
   ```

2. **Start the application:**
   ```bash
   # Using the helper script (recommended)
   ./docker-helper.sh start

   # Or manually with docker-compose
   docker-compose up --build
   ```

3. **Access the application:**
   - Backend API: http://localhost:8001
   - API Docs: http://localhost:8001/docs

### Docker Commands

#### Using the Helper Script
```bash
# Start all services
./docker-helper.sh start

# View logs
./docker-helper.sh logs backend
./docker-helper.sh logs celery_worker

# Check health
./docker-helper.sh health

# Test API
./docker-helper.sh test

# Scale workers
./docker-helper.sh scale 3

# Stop services
./docker-helper.sh stop

# Cleanup
./docker-helper.sh cleanup
```

#### Manual Docker Commands
```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Scale workers
docker-compose up -d --scale celery_worker=3

# Stop services
docker-compose down

# Remove volumes (WARNING: deletes data)
docker-compose down -v
```

### Docker Architecture

#### Development Setup (`docker-compose.yml`)
- **Redis**: In-memory database for Celery broker
- **Backend**: FastAPI application with GPU support
- **Celery Worker**: Background video processing
- **Volume Mounts**: Persistent storage for models and videos

#### Production Setup (`docker-compose.prod.yml`)
- **Nginx**: Load balancer and reverse proxy
- **Multiple Workers**: Horizontal scaling
- **Resource Limits**: Memory and GPU constraints
- **Health Checks**: Automatic service monitoring

### GPU Configuration

#### For NVIDIA GPUs:
```bash
# Install NVIDIA Docker
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list

sudo apt-get update && sudo apt-get install -y nvidia-docker2
sudo systemctl restart docker
```

#### Verify GPU Access:
```bash
# In container
docker run --rm --gpus all nvidia/cuda:12.1-base nvidia-smi
```

### Environment Variables

The Docker setup uses the same `.env` file as local development:

```bash
# Required
HUGGINGFACE_TOKEN=hf_xxxxxxxxxxxxxxxxx
ELEVENLABS_API_KEY=sk_xxxxxxxxxxxxxxxxx

# Optional
REDIS_URL=redis://redis:6379/0
BACKEND_PORT=8001
```

### Troubleshooting Docker

#### Common Issues:

**GPU Not Detected:**
```bash
# Check NVIDIA Docker installation
docker run --rm --gpus all nvidia/cuda:12.1-base nvidia-smi

# Check Docker Compose GPU configuration
docker-compose config
```

**Port Conflicts:**
```bash
# Change ports in docker-compose.yml
ports:
  - "8002:8001"  # Host:Container
```

**Memory Issues:**
```bash
# Monitor resource usage
./docker-helper.sh status

# Adjust memory limits in docker-compose.yml
deploy:
  resources:
    limits:
      memory: 64G
```

**Model Download Issues:**
```bash
# Check container logs
docker-compose logs backend

# Verify API keys in .env
cat .env
```

### Production Deployment

For production deployment to cloud platforms:

1. **Build and push images:**
   ```bash
   docker build -t cinevivid/backend:latest .
   docker push cinevivid/backend:latest
   ```

2. **Use production compose file:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **Set up reverse proxy (nginx):**
   ```bash
   # Configure SSL and load balancing
   # See nginx.conf for example configuration
   ```

### Performance Optimization

- **GPU Memory**: Monitor with `nvidia-smi`
- **Worker Scaling**: Add more Celery workers for high load
- **Model Caching**: Use persistent volumes for downloaded models
- **Load Balancing**: Use nginx for multiple backend instances

---

## 🚀 Quickstart

### Web Application Setup

CineVivid includes a complete web application with an intuitive AI-powered interface featuring all video generation tools and components.

#### Frontend Installation
```shell
# Navigate to frontend directory
cd SkyReels-V2/src/frontend

# Install frontend dependencies
npm install

# Start the development server
npm start
```
The frontend will be available at `http://localhost:1234`

#### Backend Installation
```shell
# clone the repository.
git clone https://github.com/SkyworkAI/SkyReels-V2
cd SkyReels-V2
# Install dependencies. Test environment uses Python 3.10.12.
pip install -r requirements.txt
```

#### Running Both Services
```shell
# Terminal 1: Start backend (FastAPI)
cd SkyReels-V2
uvicorn src.backend.app:app --reload

# Terminal 2: Start frontend (React)
cd SkyReels-V2/src/frontend
npm start
```

### Frontend Features

#### 🎨 **Complete CineVivid AI Interface**
- **SkyReels.ai-inspired design** with professional UI/UX
- **Intuitive navigation structure** with comprehensive TOOLS dropdown
- **All major AI tools** implemented and functional
- **Responsive design** optimized for all screen sizes
- **Material-UI components** with custom CineVivid theming

#### 📄 **Implemented Pages & Features**

**🏠 Landing Page (`/`)**
- Hero section highlighting "AI Video" and "AI Drama" capabilities
- Feature showcase with professional video demos
- Navigation header with comprehensive TOOLS dropdown
- Call-to-action buttons linking to all major tools
- Recent creations gallery with video thumbnails

**📚 My Library (`/home/my-library`)**
- Video gallery grid with thumbnails and metadata
- Search and filter functionality (All/Completed/Processing/Failed)
- Video cards with play buttons and status badges
- Action menus (Play, Download, Share, Delete)
- Pagination and sorting options

**🎬 AI Video - Text to Video (`/home/tools/to-video`)**
- Advanced prompt input with multi-line text area
- Generation options: Aspect ratio (16:9, 9:16, 1:1), Duration (5s-15s), Style
- Optional voiceover integration with ElevenLabs
- Real-time progress tracking with animated progress bar
- Prompt suggestions and professional generation tips
- Video preview with download functionality

**🎭 Generate Drama (`/home/generate-drama`)**
- Specialized drama creation with AI assistance
- Drama templates: Love Story, Mystery Thriller, Family Drama, Coming of Age
- Custom settings: Genre, Tone, Setting, Duration
- Three-act structure generation (Opening, Climax, Resolution)
- Professional drama writing tips and guidance
- Video preview and download capabilities

**🖼️ Generate Image (`/home/tools/text2image`)**
- Dual prompt input (positive + negative prompts)
- Advanced settings: Style, Aspect ratio, Quality slider
- Generated images gallery with grid display
- Style presets and professional generation tips
- Aspect ratio guides and recommendations

**🎤 Talking Avatar (`/home/tools/talking-avatar`)**
- Character avatar selection and customization
- Text input for speech synthesis
- Voice selection from ElevenLabs voice library
- Lip sync integration for natural animation
- Preview and download functionality

**🎪 Train Model (`/home/tools/train-model`)**
- Custom AI model training interface
- File upload for training datasets
- Model type selection (LoRA, DreamBooth, Full Fine-tuning)
- Training progress tracking with detailed metrics
- Model download and deployment options

**🎤 Lip Sync (`/home/tools/lip-sync`)**
- Video file upload with drag-and-drop interface
- Audio text input for synchronization
- Voice type selection (Rachel, Drew, Domi, Bella)
- Progress tracking and preview functionality
- Language support and quality optimization

**🎥 Short Film Creator (`/home/short-film`)**
- Film title and genre selection
- Scene-by-scene planning with accordion interface
- Duration tracking and cost estimation
- Scene templates and film statistics
- Save draft and sharing functionality

**📋 All Tools (`/home/tools/all`)**
- Comprehensive tool overview page
- Featured tools section with Popular badges
- Category-based tool organization
- Tool cards with descriptions and direct links
- Quick access to all AI capabilities

#### 🛠️ **Technical Architecture**

**Frontend Stack:**
- **React 19** with TypeScript
- **React Router** for navigation
- **Material-UI (MUI)** for components
- **Parcel** for bundling and development
- **Axios** for API communication

**Backend Integration:**
- **FastAPI** backend with automatic proxy configuration
- **RESTful API** endpoints for all tools
- **Progress tracking** for long-running operations
- **File upload** support for videos and images

**Key Features:**
- **Responsive Design**: Mobile-first approach with breakpoints
- **Real-time Updates**: Progress bars and status indicators
- **Form Validation**: Input validation and error handling
- **State Management**: React hooks for component state
- **API Integration**: Seamless frontend-backend communication

#### 🎯 **Complete URL Structure**
```
/
/home/my-library              # Video library/gallery with search & filters
/home/tools/all              # All tools overview with Popular badges
/home/tools/to-video         # AI Video - Text-to-video generation
/home/generate-drama         # Generate Drama - AI-powered drama creation
/home/tools/text2image       # Generate Image - Professional image generation
/home/tools/talking-avatar   # Talking Avatar - Character animation with speech
/home/tools/train-model      # Train Model - Custom AI model training
/home/tools/lip-sync         # Lip Sync - Audio-video synchronization
/home/short-film             # Short Film Creator - Multi-scene film production
```

### Backend Setup

#### Model Download
You can download our models from Hugging Face:
<table>
  <thead>
    <tr>
      <th>Type</th>
      <th>Model Variant</th>
      <th>Recommended Height/Width/Frame</th>
      <th>Link</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="5">Diffusion Forcing</td>
      <td>1.3B-540P</td>
      <td>544 * 960 * 97f</td>
      <td>🤗 <a href="https://huggingface.co/Skywork/SkyReels-V2-DF-1.3B-540P">Huggingface</a> 🤖 <a href="https://www.modelscope.cn/models/Skywork/SkyReels-V2-DF-1.3B-540P">ModelScope</a></td>
    </tr>
    <tr>
      <td>5B-540P</td>
      <td>544 * 960 * 97f</td>
      <td>Coming Soon</td>
    </tr>
    <tr>
      <td>5B-720P</td>
      <td>720 * 1280 * 121f</td>
      <td>Coming Soon</td>
    </tr>
    <tr>
      <td>14B-540P</td>
      <td>544 * 960 * 97f</td>
      <td>🤗 <a href="https://huggingface.co/Skywork/SkyReels-V2-DF-14B-540P">Huggingface</a> 🤖 <a href="https://www.modelscope.cn/models/Skywork/SkyReels-V2-DF-14B-540P">ModelScope</a></td>
    </tr>
    <tr>
      <td>14B-720P</td>
      <td>720 * 1280 * 121f</td>
      <td>🤗 <a href="https://huggingface.co/Skywork/SkyReels-V2-DF-14B-720P">Huggingface</a> 🤖 <a href="https://www.modelscope.cn/models/Skywork/SkyReels-V2-DF-14B-720P">ModelScope</a></td>
    </tr>
    <tr>
      <td rowspan="5">Text-to-Video</td>
      <td>1.3B-540P</td>
      <td>544 * 960 * 97f</td>
      <td>Coming Soon</td>
    </tr>
    <tr>
      <td>5B-540P</td>
      <td>544 * 960 * 97f</td>
      <td>Coming Soon</td>
    </tr>
    <tr>
      <td>5B-720P</td>
      <td>720 * 1280 * 121f</td>
      <td>Coming Soon</td>
    </tr>
    <tr>
      <td>14B-540P</td>
      <td>544 * 960 * 97f</td>
      <td>🤗 <a href="https://huggingface.co/Skywork/SkyReels-V2-T2V-14B-540P">Huggingface</a> 🤖 <a href="https://www.modelscope.cn/models/Skywork/SkyReels-V2-T2V-14B-540P">ModelScope</a></td>
    </tr>
    <tr>
      <td>14B-720P</td>
      <td>720 * 1280 * 121f</td>
      <td>🤗 <a href="https://huggingface.co/Skywork/SkyReels-V2-T2V-14B-720P">Huggingface</a> 🤖 <a href="https://www.modelscope.cn/models/Skywork/SkyReels-V2-T2V-14B-720P">ModelScope</a></td>
    </tr>
    <tr>
      <td rowspan="5">Image-to-Video</td>
      <td>1.3B-540P</td>
      <td>544 * 960 * 97f</td>
      <td>🤗 <a href="https://huggingface.co/Skywork/SkyReels-V2-I2V-1.3B-540P">Huggingface</a> 🤖 <a href="https://www.modelscope.cn/models/Skywork/SkyReels-V2-I2V-1.3B-540P">ModelScope</a></td>
    </tr>
    <tr>
      <td>5B-540P</td>
      <td>544 * 960 * 97f</td>
      <td>Coming Soon</td>
    </tr>
    <tr>
      <td>5B-720P</td>
      <td>720 * 1280 * 121f</td>
      <td>Coming Soon</td>
    </tr>
    <tr>
      <td>14B-540P</td>
      <td>544 * 960 * 97f</td>
      <td>🤗 <a href="https://huggingface.co/Skywork/SkyReels-V2-I2V-14B-540P">Huggingface</a> 🤖 <a href="https://www.modelscope.cn/models/Skywork/SkyReels-V2-I2V-14B-540P">ModelScope</a></td>
    </tr>
    <tr>
      <td>14B-720P</td>
      <td>720 * 1280 * 121f</td>
      <td>🤗 <a href="https://huggingface.co/Skywork/SkyReels-V2-I2V-14B-720P">Huggingface</a> 🤖 <a href="https://www.modelscope.cn/models/Skywork/SkyReels-V2-I2V-14B-720P">ModelScope</a></td>
    </tr>
    <tr>
      <td rowspan="3">Camera Director</td>
      <td>5B-540P</td>
      <td>544 * 960 * 97f</td>
      <td>Coming Soon</td>
    </tr>
    <tr>
      <td>5B-720P</td>
      <td>720 * 1280 * 121f</td>
      <td>Coming Soon</td>
    </tr>
    <tr>
      <td>14B-720P</td>
      <td>720 * 1280 * 121f</td>
      <td>Coming Soon</td>
    </tr>
  </tbody>
</table>

After downloading, set the model path in your generation commands:


#### Single GPU Inference

- **Diffusion Forcing for Long Video Generation**

The <a href="https://arxiv.org/abs/2407.01392">**Diffusion Forcing**</a> version model allows us to generate Infinite-Length videos. This model supports both **text-to-video (T2V)** and **image-to-video (I2V)** tasks, and it can perform inference in both synchronous and asynchronous modes. Here we demonstrate 2 running scripts as examples for long video generation. If you want to adjust the inference parameters, e.g., the duration of video, inference mode, read the Note below first.

synchronous generation for 10s video
```shell
model_id=Skywork/SkyReels-V2-DF-14B-540P
# synchronous inference
python3 generate_video_df.py \
  --model_id ${model_id} \
  --resolution 540P \
  --ar_step 0 \
  --base_num_frames 97 \
  --num_frames 257 \
  --overlap_history 17 \
  --prompt "A graceful white swan with a curved neck and delicate feathers swimming in a serene lake at dawn, its reflection perfectly mirrored in the still water as mist rises from the surface, with the swan occasionally dipping its head into the water to feed." \
  --addnoise_condition 20 \
  --offload \
  --teacache \
  --use_ret_steps \
  --teacache_thresh 0.3
```

asynchronous generation for 30s video
```shell
model_id=Skywork/SkyReels-V2-DF-14B-540P
# asynchronous inference
python3 generate_video_df.py \
  --model_id ${model_id} \
  --resolution 540P \
  --ar_step 5 \
  --causal_block_size 5 \
  --base_num_frames 97 \
  --num_frames 737 \
  --overlap_history 17 \
  --prompt "A graceful white swan with a curved neck and delicate feathers swimming in a serene lake at dawn, its reflection perfectly mirrored in the still water as mist rises from the surface, with the swan occasionally dipping its head into the water to feed." \
  --addnoise_condition 20 \
  --offload
```

Text-to-video with `diffusers`:
```py
import torch
from diffusers import AutoModel, SkyReelsV2DiffusionForcingPipeline, UniPCMultistepScheduler
from diffusers.utils import export_to_video

vae = AutoModel.from_pretrained("Skywork/SkyReels-V2-DF-14B-540P-Diffusers", subfolder="vae", torch_dtype=torch.float32)

pipeline = SkyReelsV2DiffusionForcingPipeline.from_pretrained(
    "Skywork/SkyReels-V2-DF-14B-540P-Diffusers",
    vae=vae,
    torch_dtype=torch.bfloat16
)
flow_shift = 8.0  # 8.0 for T2V, 5.0 for I2V
pipeline.scheduler = UniPCMultistepScheduler.from_config(pipeline.scheduler.config, flow_shift=flow_shift)
pipeline = pipeline.to("cuda")

prompt = "A cat and a dog baking a cake together in a kitchen. The cat is carefully measuring flour, while the dog is stirring the batter with a wooden spoon. The kitchen is cozy, with sunlight streaming through the window."

output = pipeline(
    prompt=prompt,
    num_inference_steps=30,
    height=544,  # 720 for 720P
    width=960,   # 1280 for 720P
    num_frames=97,
    base_num_frames=97,  # 121 for 720P
    ar_step=5,  # Controls asynchronous inference (0 for synchronous mode)
    causal_block_size=5,  # Number of frames in each block for asynchronous processing
    overlap_history=None,  # Number of frames to overlap for smooth transitions in long videos; 17 for long video generations
    addnoise_condition=20,  # Improves consistency in long video generation
).frames[0]
export_to_video(output, "T2V.mp4", fps=24, quality=8)
```

Image-to-video with `diffusers`:
```py
import numpy as np
import torch
import torchvision.transforms.functional as TF
from diffusers import AutoencoderKLWan, SkyReelsV2DiffusionForcingImageToVideoPipeline, UniPCMultistepScheduler
from diffusers.utils import export_to_video, load_image

model_id = "Skywork/SkyReels-V2-DF-14B-720P-Diffusers"
vae = AutoencoderKLWan.from_pretrained(model_id, subfolder="vae", torch_dtype=torch.float32)
pipeline = SkyReelsV2DiffusionForcingImageToVideoPipeline.from_pretrained(
    model_id, vae=vae, torch_dtype=torch.bfloat16
)
flow_shift = 5.0  # 8.0 for T2V, 5.0 for I2V
pipeline.scheduler = UniPCMultistepScheduler.from_config(pipeline.scheduler.config, flow_shift=flow_shift)
pipeline.to("cuda")

first_frame = load_image("https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/diffusers/flf2v_input_first_frame.png")
last_frame = load_image("https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/diffusers/flf2v_input_last_frame.png")

def aspect_ratio_resize(image, pipeline, max_area=720 * 1280):
    aspect_ratio = image.height / image.width
    mod_value = pipeline.vae_scale_factor_spatial * pipeline.transformer.config.patch_size[1]
    height = round(np.sqrt(max_area * aspect_ratio)) // mod_value * mod_value
    width = round(np.sqrt(max_area / aspect_ratio)) // mod_value * mod_value
    image = image.resize((width, height))
    return image, height, width

def center_crop_resize(image, height, width):
    # Calculate resize ratio to match first frame dimensions
    resize_ratio = max(width / image.width, height / image.height)

    # Resize the image
    width = round(image.width * resize_ratio)
    height = round(image.height * resize_ratio)
    size = [width, height]
    image = TF.center_crop(image, size)

    return image, height, width

first_frame, height, width = aspect_ratio_resize(first_frame, pipeline)
if last_frame.size != first_frame.size:
    last_frame, _, _ = center_crop_resize(last_frame, height, width)

prompt = "CG animation style, a small blue bird takes off from the ground, flapping its wings. The bird's feathers are delicate, with a unique pattern on its chest. The background shows a blue sky with white clouds under bright sunshine. The camera follows the bird upward, capturing its flight and the vastness of the sky from a close-up, low-angle perspective."

output = pipeline(
    image=first_frame, last_image=last_frame, prompt=prompt, height=height, width=width, guidance_scale=5.0
).frames[0]
export_to_video(output, "output.mp4", fps=24, quality=8)
```

> **Note**: 
> - If you want to run the **image-to-video (I2V)** task, add `--image ${image_path}` to your command and it is also better to use **text-to-video (T2V)**-like prompt which includes some descriptions of the first-frame image.
> - For long video generation, you can just switch the `--num_frames`, e.g., `--num_frames 257` for 10s video, `--num_frames 377` for 15s video, `--num_frames 737` for 30s video, `--num_frames 1457` for 60s video. The number is not strictly aligned with the logical frame number for specified time duration, but it is aligned with some training parameters, which means it may perform better. When you use asynchronous inference with causal_block_size > 1, the `--num_frames` should be carefully set.
> - You can use `--ar_step 5` to enable asynchronous inference. When asynchronous inference, `--causal_block_size 5` is recommended while it is not supposed to be set for synchronous generation. REMEMBER that the frame latent number inputted into the model in every iteration, e.g., base frame latent number (e.g., (97-1)//4+1=25 for base_num_frames=97) and (e.g., (237-97-(97-17)x1+17-1)//4+1=20 for base_num_frames=97, num_frames=237, overlap_history=17) for the last iteration, MUST be divided by causal_block_size. If you find it too hard to calculate and set proper values, just use our recommended setting above :). Asynchronous inference will take more steps to diffuse the whole sequence which means it will be SLOWER than synchronous mode. In our experiments, asynchronous inference may improve the instruction following and visual consistent performance.
> - To reduce peak VRAM, just lower the `--base_num_frames`, e.g., to 77 or 57, while keeping the same generative length `--num_frames` you want to generate. This may slightly reduce video quality, and it should not be set too small.
> - `--addnoise_condition` is used to help smooth the long video generation by adding some noise to the clean condition. Too large noise can cause the inconsistency as well. 20 is a recommended value, and you may try larger ones, but it is recommended to not exceed 50.
> - Generating a 540P video using the 1.3B model requires approximately 14.7GB peak VRAM, while the same resolution video using the 14B model demands around 51.2GB peak VRAM.

- **<span id="ve">Video Extention</span>**
```shell
model_id=Skywork/SkyReels-V2-DF-14B-540P
# video extention
python3 generate_video_df.py \
  --model_id ${model_id} \
  --resolution 540P \
  --ar_step 0 \
  --base_num_frames 97 \
  --num_frames 120 \
  --overlap_history 17 \
  --prompt ${prompt} \
  --addnoise_condition 20 \
  --offload \
  --use_ret_steps \
  --teacache \
  --teacache_thresh 0.3 \
  --video_path ${video_path}
```
> **Note**: 
> - When performing video extension, you need to pass the `--video_path  ${video_path}` parameter to specify the video to be extended.

- **<span id="se">Start/End Frame Control</span>**
```shell
model_id=Skywork/SkyReels-V2-DF-14B-540P
# start/end frame control
python3 generate_video_df.py \
  --model_id ${model_id} \
  --resolution 540P \
  --ar_step 0 \
  --base_num_frames 97 \
  --num_frames 97 \
  --overlap_history 17 \
  --prompt ${prompt} \
  --addnoise_condition 20 \
  --offload \
  --use_ret_steps \
  --teacache \
  --teacache_thresh 0.3 \
  --image ${image} \
  --end_image ${end_image}
```
> **Note**:
> - When controlling the start and end frames, you need to pass the `--image  ${image}` parameter to control the generation of the start frame and the `--end_image  ${end_image}` parameter to control the generation of the end frame.

Video extension with `diffusers`:
```py
import numpy as np
import torch
import torchvision.transforms.functional as TF
from diffusers import AutoencoderKLWan, SkyReelsV2DiffusionForcingVideoToVideoPipeline, UniPCMultistepScheduler
from diffusers.utils import export_to_video, load_video

model_id = "Skywork/SkyReels-V2-DF-14B-540P-Diffusers"
vae = AutoencoderKLWan.from_pretrained(model_id, subfolder="vae", torch_dtype=torch.float32)
pipeline = SkyReelsV2DiffusionForcingVideoToVideoPipeline.from_pretrained(
    model_id, vae=vae, torch_dtype=torch.bfloat16
)
flow_shift = 5.0  # 8.0 for T2V, 5.0 for I2V
pipeline.scheduler = UniPCMultistepScheduler.from_config(pipeline.scheduler.config, flow_shift=flow_shift)
pipeline.to("cuda")

video = load_video("input_video.mp4")

prompt = "CG animation style, a small blue bird takes off from the ground, flapping its wings. The bird's feathers are delicate, with a unique pattern on its chest. The background shows a blue sky with white clouds under bright sunshine. The camera follows the bird upward, capturing its flight and the vastness of the sky from a close-up, low-angle perspective."

output = pipeline(
    video=video, prompt=prompt, height=544, width=960, guidance_scale=5.0,
    num_inference_steps=30, num_frames=257, base_num_frames=97#, ar_step=5, causal_block_size=5,
).frames[0]
export_to_video(output, "output.mp4", fps=24, quality=8)
# Total frames will be the number of frames of given video + 257
```

- **Text To Video & Image To Video**

```shell
# run Text-to-Video Generation
model_id=Skywork/SkyReels-V2-T2V-14B-540P
python3 generate_video.py \
  --model_id ${model_id} \
  --resolution 540P \
  --num_frames 97 \
  --guidance_scale 6.0 \
  --shift 8.0 \
  --fps 24 \
  --prompt "A serene lake surrounded by towering mountains, with a few swans gracefully gliding across the water and sunlight dancing on the surface." \
  --offload \
  --teacache \
  --use_ret_steps \
  --teacache_thresh 0.3
```
> **Note**: 
> - When using an **image-to-video (I2V)** model, you must provide an input image using the `--image  ${image_path}` parameter. The `--guidance_scale 5.0` and `--shift 3.0` is recommended for I2V model.
> - Generating a 540P video using the 1.3B model requires approximately 14.7GB peak VRAM, while the same resolution video using the 14B model demands around 43.4GB peak VRAM.

T2V models with `diffusers`:
```py
import torch
from diffusers import (
    SkyReelsV2Pipeline,
    UniPCMultistepScheduler,
    AutoencoderKLWan,
)
from diffusers.utils import export_to_video

# Load the pipeline
# Available models:
# - Skywork/SkyReels-V2-T2V-14B-540P-Diffusers
# - Skywork/SkyReels-V2-T2V-14B-720P-Diffusers
vae = AutoencoderKLWan.from_pretrained(
    "Skywork/SkyReels-V2-T2V-14B-720P-Diffusers",
    subfolder="vae",
    torch_dtype=torch.float32,
)
pipe = SkyReelsV2Pipeline.from_pretrained(
    "Skywork/SkyReels-V2-T2V-14B-720P-Diffusers",
    vae=vae,
    torch_dtype=torch.bfloat16,
)
flow_shift = 8.0  # 8.0 for T2V, 5.0 for I2V
pipe.scheduler = UniPCMultistepScheduler.from_config(pipe.scheduler.config, flow_shift=flow_shift)
pipe = pipe.to("cuda")

prompt = "A cat and a dog baking a cake together in a kitchen. The cat is carefully measuring flour, while the dog is stirring the batter with a wooden spoon. The kitchen is cozy, with sunlight streaming through the window."

output = pipe(
    prompt=prompt,
    num_inference_steps=50,
    height=544,
    width=960,
    guidance_scale=6.0,  # 6.0 for T2V, 5.0 for I2V
    num_frames=97,
).frames[0]
export_to_video(output, "video.mp4", fps=24, quality=8)
```

I2V models with `diffusers`:
```py
import torch
from diffusers import (
    SkyReelsV2ImageToVideoPipeline,
    UniPCMultistepScheduler,
    AutoencoderKLWan,
)
from diffusers.utils import export_to_video
from PIL import Image

# Load the pipeline
# Available models:
# - Skywork/SkyReels-V2-I2V-1.3B-540P-Diffusers
# - Skywork/SkyReels-V2-I2V-14B-540P-Diffusers
# - Skywork/SkyReels-V2-I2V-14B-720P-Diffusers
vae = AutoencoderKLWan.from_pretrained(
    "Skywork/SkyReels-V2-I2V-14B-720P-Diffusers",
    subfolder="vae",
    torch_dtype=torch.float32,
)
pipe = SkyReelsV2ImageToVideoPipeline.from_pretrained(
    "Skywork/SkyReels-V2-I2V-14B-720P-Diffusers",
    vae=vae,
    torch_dtype=torch.bfloat16,
)
flow_shift = 5.0  # 8.0 for T2V, 5.0 for I2V
pipe.scheduler = UniPCMultistepScheduler.from_config(pipe.scheduler.config, flow_shift=flow_shift)
pipe = pipe.to("cuda")

prompt = "A cat and a dog baking a cake together in a kitchen. The cat is carefully measuring flour, while the dog is stirring the batter with a wooden spoon. The kitchen is cozy, with sunlight streaming through the window."
image = Image.open("path/to/image.png")

output = pipe(
    image=image,
    prompt=prompt,
    num_inference_steps=50,
    height=544,
    width=960,
    guidance_scale=5.0,  # 6.0 for T2V, 5.0 for I2V
    num_frames=97,
).frames[0]
export_to_video(output, "video.mp4", fps=24, quality=8)
```

- **Prompt Enhancer**

The prompt enhancer is implemented based on <a href="https://huggingface.co/Qwen/Qwen2.5-32B-Instruct">Qwen2.5-32B-Instruct</a> and  is utilized via the `--prompt_enhancer` parameter. It works ideally for short prompts, while for long prompts, it might generate an excessively lengthy prompt that could lead to over-saturation in the generative video. Note the peak memory of GPU is 64G+ if you use `--prompt_enhancer`. If you want to obtain the enhanced prompt separately, you can also run the prompt_enhancer script separately for testing. The steps are as follows:

```shell
cd skyreels_v2_infer/pipelines
python3 prompt_enhancer.py --prompt "A serene lake surrounded by towering mountains, with a few swans gracefully gliding across the water and sunlight dancing on the surface."
```
> **Note**: 
> - `--prompt_enhancer` is not allowed if using `--use_usp`. We recommend running the skyreels_v2_infer/pipelines/prompt_enhancer.py script first to generate enhanced prompt before enabling the `--use_usp` parameter.


**Advanced Configuration Options**

Below are the key parameters you can customize for video generation:

| Parameter | Recommended Value | Description |
|:----------------------:|:---------:|:-----------------------------------------:|
| --prompt |  | Text description for generating your video |
| --image |  | Path to input image for image-to-video generation |
| --resolution | 540P or 720P | Output video resolution (select based on model type) |
| --num_frames | 97 or 121 | Total frames to generate (**97 for 540P models**, **121 for 720P models**) |
| --inference_steps | 50 | Number of denoising steps |
| --fps | 24 | Frames per second in the output video |
| --shift | 8.0 or 5.0 | Flow matching scheduler parameter (**8.0 for T2V**, **5.0 for I2V**) |
| --guidance_scale | 6.0 or 5.0 | Controls text adherence strength (**6.0 for T2V**, **5.0 for I2V**) |
| --seed |  | Fixed seed for reproducible results (omit for random generation) |
| --offload | True | Offloads model components to CPU to reduce VRAM usage (recommended) |
| --use_usp | True | Enables multi-GPU acceleration with xDiT USP |
| --outdir | ./video_out | Directory where generated videos will be saved |
| --prompt_enhancer | True | Expand the prompt into a more detailed description |
| --teacache | False | Enables teacache for faster inference |
| --teacache_thresh | 0.2 | Higher speedup will cause to worse quality |
| --use_ret_steps | False | Retention Steps for teacache |

**Diffusion Forcing Additional Parameters**
| Parameter | Recommended Value | Description |
|:----------------------:|:---------:|:-----------------------------------------:|
| --ar_step | 0 | Controls asynchronous inference (0 for synchronous mode) |
| --base_num_frames | 97 or 121 | Base frame count (**97 for 540P**, **121 for 720P**) |
| --overlap_history | 17 | Number of frames to overlap for smooth transitions in long videos |
| --addnoise_condition | 20 | Improves consistency in long video generation |
| --causal_block_size | 5 | Recommended when using asynchronous inference (--ar_step > 0) |
--video_path |  | Path to input video for video extension |
--end_image | | Path to input image for end frame control |

#### Multi-GPU inference using xDiT USP

We use [xDiT](https://github.com/xdit-project/xDiT) USP to accelerate inference.  For example, to generate a video with 2 GPUs, you can use the following command:
- **Diffusion Forcing**
```shell
model_id=Skywork/SkyReels-V2-DF-14B-540P
# diffusion forcing synchronous inference
torchrun --nproc_per_node=2 generate_video_df.py \
  --model_id ${model_id} \
  --resolution 540P \
  --ar_step 0 \
  --base_num_frames 97 \
  --num_frames 257 \
  --overlap_history 17 \
  --prompt "A graceful white swan with a curved neck and delicate feathers swimming in a serene lake at dawn, its reflection perfectly mirrored in the still water as mist rises from the surface, with the swan occasionally dipping its head into the water to feed." \
  --addnoise_condition 20 \
  --use_usp \
  --offload \
  --seed 42
```
- **Text To Video & Image To Video**
```shell
# run Text-to-Video Generation
model_id=Skywork/SkyReels-V2-T2V-14B-540P
torchrun --nproc_per_node=2 generate_video.py \
  --model_id ${model_id} \
  --resolution 540P \
  --num_frames 97 \
  --guidance_scale 6.0 \
  --shift 8.0 \
  --fps 24 \
  --offload \
  --prompt "A serene lake surrounded by towering mountains, with a few swans gracefully gliding across the water and sunlight dancing on the surface." \
  --use_usp \
  --seed 42
```
> **Note**: 
> - When using an **image-to-video (I2V)** model, you must provide an input image using the `--image  ${image_path}` parameter. The `--guidance_scale 5.0` and `--shift 3.0` is recommended for I2V model.


## Contents
  - [Abstract](#abstract)
  - [Methodology of SkyReels-V2](#methodology-of-skyreels-v2)
  - [Key Contributions of SkyReels-V2](#key-contributions-of-skyreels-v2)
    - [Video Captioner](#video-captioner)
    - [Reinforcement Learning](#reinforcement-learning)
    - [Diffusion Forcing](#diffusion-forcing)
    - [High-Quality Supervised Fine-Tuning(SFT)](#high-quality-supervised-fine-tuning-sft)
  - [Performance](#performance)
  - [Acknowledgements](#acknowledgements)
  - [Citation](#citation)
---

## Abstract
Recent advances in video generation have been driven by diffusion models and autoregressive frameworks, yet critical challenges persist in harmonizing prompt adherence, visual quality, motion dynamics, and duration: compromises in motion dynamics to enhance temporal visual quality, constrained video duration (5-10 seconds) to prioritize resolution, and inadequate shot-aware generation stemming from general-purpose MLLMs' inability to interpret cinematic grammar, such as shot composition, actor expressions, and camera motions. These intertwined limitations hinder realistic long-form synthesis and professional film-style generation. 

To address these limitations, we introduce SkyReels-V2, the world's first infinite-length film generative model using a Diffusion Forcing framework. Our approach synergizes Multi-modal Large Language Models (MLLM), Multi-stage Pretraining, Reinforcement Learning, and Diffusion Forcing techniques to achieve comprehensive optimization. Beyond its technical innovations, SkyReels-V2 enables multiple practical applications, including Story Generation, Image-to-Video Synthesis, Camera Director functionality, and multi-subject consistent video generation through our <a href="https://github.com/SkyworkAI/SkyReels-A2">Skyreels-A2</a> system.

## Methodology of SkyReels-V2

The SkyReels-V2 methodology consists of several interconnected components. It starts with a comprehensive data processing pipeline that prepares various quality training data. At its core is the Video Captioner architecture, which provides detailed annotations for video content. The system employs a multi-task pretraining strategy to build fundamental video generation capabilities. Post-training optimization includes Reinforcement Learning to enhance motion quality, Diffusion Forcing Training for generating extended videos, and High-quality Supervised Fine-Tuning (SFT) stages for visual refinement. The model runs on optimized computational infrastructure for efficient training and inference. SkyReels-V2 supports multiple applications, including Story Generation, Image-to-Video Synthesis, Camera Director functionality, and Elements-to-Video Generation.

<p align="center">
  <img src="assets/main_pipeline.jpg" alt="mainpipeline" width="100%">
</p>

## Key Contributions of SkyReels-V2

#### Video Captioner

<a href="https://huggingface.co/Skywork/SkyCaptioner-V1">SkyCaptioner-V1</a> serves as our video captioning model for data annotation. This model is trained on the captioning result from the base model <a href="https://huggingface.co/Qwen/Qwen2.5-VL-72B-Instruct">Qwen2.5-VL-72B-Instruct</a> and the sub-expert captioners on a balanced video data. The balanced video data is a carefully curated dataset of approximately 2 million videos to ensure conceptual balance and annotation quality. Built upon the <a href="https://huggingface.co/Qwen/Qwen2.5-VL-7B-Instruct">Qwen2.5-VL-7B-Instruct</a> foundation model, <a href="https://huggingface.co/Skywork/SkyCaptioner-V1">SkyCaptioner-V1</a> is fine-tuned to enhance performance in domain-specific video captioning tasks. To compare the performance with the SOTA models, we conducted a manual assessment of accuracy across different captioning fields using a test set of 1,000 samples. The proposed <a href="https://huggingface.co/Skywork/SkyCaptioner-V1">SkyCaptioner-V1</a> achieves the highest average accuracy among the baseline models, and show a dramatic result in the shot related fields

<p align="center">
<table align="center">
  <thead>
    <tr>
      <th>model</th>
      <th><a href="https://huggingface.co/Qwen/Qwen2.5-VL-7B-Instruct">Qwen2.5-VL-7B-Ins.</a></th>
      <th><a href="https://huggingface.co/Qwen/Qwen2.5-VL-72B-Instruct">Qwen2.5-VL-72B-Ins.</a></th>
      <th><a href="https://huggingface.co/omni-research/Tarsier2-Recap-7b">Tarsier2-Recap-7b</a></th>
      <th><a href="https://huggingface.co/Skywork/SkyCaptioner-V1">SkyCaptioner-V1</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Avg accuracy</td>
      <td>51.4%</td>
      <td>58.7%</td>
      <td>49.4%</td>
      <td><strong>76.3%</strong></td>
    </tr>
    <tr>
      <td>shot type</td>
      <td>76.8%</td>
      <td>82.5%</td>
      <td>60.2%</td>
      <td><strong>93.7%</strong></td>
    </tr>
    <tr>
      <td>shot angle</td>
      <td>60.0%</td>
      <td>73.7%</td>
      <td>52.4%</td>
      <td><strong>89.8%</strong></td>
    </tr>
    <tr>
      <td>shot position</td>
      <td>28.4%</td>
      <td>32.7%</td>
      <td>23.6%</td>
      <td><strong>83.1%</strong></td>
    </tr>
    <tr>
      <td>camera motion</td>
      <td>62.0%</td>
      <td>61.2%</td>
      <td>45.3%</td>
      <td><strong>85.3%</strong></td>
    </tr>
    <tr>
      <td>expression</td>
      <td>43.6%</td>
      <td>51.5%</td>
      <td>54.3%</td>
      <td><strong>68.8%</strong></td>
    </tr>
    <tr>
      <td colspan="5" style="text-align: center; border-bottom: 1px solid #ddd; padding: 8px;"></td>
    </tr>
    <tr>
      <td>TYPES_type</td>
      <td>43.5%</td>
      <td>49.7%</td>
      <td>47.6%</td>
      <td><strong>82.5%</strong></td>
    </tr>
    <tr>
      <td>TYPES_sub_type</td>
      <td>38.9%</td>
      <td>44.9%</td>
      <td>45.9%</td>
      <td><strong>75.4%</strong></td>
    </tr>
    <tr>
      <td>appearance</td>
      <td>40.9%</td>
      <td>52.0%</td>
      <td>45.6%</td>
      <td><strong>59.3%</strong></td>
    </tr>
    <tr>
      <td>action</td>
      <td>32.4%</td>
      <td>52.0%</td>
      <td><strong>69.8%</strong></td>
      <td>68.8%</td>
    </tr>
    <tr>
      <td>position</td>
      <td>35.4%</td>
      <td>48.6%</td>
      <td>45.5%</td>
      <td><strong>57.5%</strong></td>
    </tr>
    <tr>
      <td>is_main_subject</td>
      <td>58.5%</td>
      <td>68.7%</td>
      <td>69.7%</td>
      <td><strong>80.9%</strong></td>
    </tr>
    <tr>
      <td>environment</td>
      <td>70.4%</td>
      <td><strong>72.7%</strong></td>
      <td>61.4%</td>
      <td>70.5%</td>
    </tr>
    <tr>
      <td>lighting</td>
      <td>77.1%</td>
      <td><strong>80.0%</strong></td>
      <td>21.2%</td>
      <td>76.5%</td>
    </tr>
  </tbody>
</table>
</p>

#### Reinforcement Learning
Inspired by the previous success in LLM, we propose to enhance the performance of the generative model by Reinforcement Learning. Specifically, we focus on the motion quality because we find that the main drawback of our generative model is:

- the generative model does not handle well with large, deformable motions. 
- the generated videos may violate the physical law.

To avoid the degradation in other metrics, such as text alignment and video quality, we ensure the preference data pairs have comparable text alignment and video quality, while only the motion quality varies. This requirement poses greater challenges in obtaining preference annotations due to the inherently higher costs of human annotation. To address this challenge, we propose a semi-automatic pipeline that strategically combines automatically generated motion pairs and human annotation results. This hybrid approach not only enhances the data scale but also improves alignment with human preferences through curated quality control. Leveraging this enhanced dataset, we first train a specialized reward model to capture the generic motion quality differences between paired samples. This learned reward function subsequently guides the sample selection process for Direct Preference Optimization (DPO), enhancing the motion quality of the generative model.

#### Diffusion Forcing

We introduce the Diffusion Forcing Transformer to unlock our model’s ability to generate long videos. Diffusion Forcing is a training and sampling strategy where each token is assigned an independent noise level. This allows tokens to be denoised according to arbitrary, per-token schedules. Conceptually, this approach functions as a form of partial masking: a token with zero noise is fully unmasked, while complete noise fully masks it. Diffusion Forcing trains the model to "unmask" any combination of variably noised tokens, using the cleaner tokens as conditional information to guide the recovery of noisy ones. Building on this, our Diffusion Forcing Transformer can extend video generation indefinitely based on the last frames of the previous segment. Note that the synchronous full sequence diffusion is a special case of Diffusion Forcing, where all tokens share the same noise level. This relationship allows us to fine-tune the Diffusion Forcing Transformer from a full-sequence diffusion model.

#### High-Quality Supervised Fine-Tuning (SFT)

We implement two sequential high-quality supervised fine-tuning (SFT) stages at 540p and 720p resolutions respectively, with the initial SFT phase conducted immediately after pretraining but prior to reinforcement learning (RL) stage.This first-stage SFT serves as a conceptual equilibrium trainer, building upon the foundation model’s pretraining outcomes that utilized only fps24 video data, while strategically removing FPS embedding components to streamline thearchitecture. Trained with the high-quality concept-balanced samples, this phase establishes optimized initialization parameters for subsequent training processes. Following this, we execute a secondary high-resolution SFT at 720p after completing the diffusion forcing stage, incorporating identical loss formulations and the higher-quality concept-balanced datasets by the manually filter. This final refinement phase focuses on resolution increase such that the overall video quality will be further enhanced.

## Performance

To comprehensively evaluate our proposed method, we construct the SkyReels-Bench for human assessment and leveraged the open-source <a href="https://github.com/Vchitect/VBench">V-Bench</a> for automated evaluation. This allows us to compare our model with the state-of-the-art (SOTA) baselines, including both open-source and proprietary models.

#### Human Evaluation

For human evaluation, we design SkyReels-Bench with 1,020 text prompts, systematically assessing three dimensions: Instruction Adherence, Motion Quality, Consistency and Visual Quality. This benchmark is designed to evaluate both text-to-video (T2V) and image-to-video (I2V) generation models, providing comprehensive assessment across different generation paradigms. To ensure fairness, all models were evaluated under default settings with consistent resolutions, and no post-generation filtering was applied.

- Text To Video Models

<p align="center">
<table align="center">
  <thead>
    <tr>
      <th>Model Name</th>
      <th>Average</th>
      <th>Instruction Adherence</th>
      <th>Consistency</th>
      <th>Visual Quality</th>
      <th>Motion Quality</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="https://runwayml.com/research/introducing-gen-3-alpha">Runway-Gen3 Alpha</a></td>
      <td>2.53</td>
      <td>2.19</td>
      <td>2.57</td>
      <td>3.23</td>
      <td>2.11</td>
    </tr>
    <tr>
      <td><a href="https://github.com/Tencent/HunyuanVideo">HunyuanVideo-13B</a></td>
      <td>2.82</td>
      <td>2.64</td>
      <td>2.81</td>
      <td>3.20</td>
      <td>2.61</td>
    </tr>
    <tr>
      <td><a href="https://klingai.com">Kling-1.6 STD Mode</a></td>
      <td>2.99</td>
      <td>2.77</td>
      <td>3.05</td>
      <td>3.39</td>
      <td><strong>2.76</strong></td>
    </tr>
    <tr>
      <td><a href="https://hailuoai.video">Hailuo-01</a></td>
      <td>3.0</td>
      <td>2.8</td>
      <td>3.08</td>
      <td>3.29</td>
      <td>2.74</td>
    </tr>
    <tr>
      <td><a href="https://github.com/Wan-Video/Wan2.1">Wan2.1-14B</a></td>
      <td>3.12</td>
      <td>2.91</td>
      <td>3.31</td>
      <td><strong>3.54</strong></td>
      <td>2.71</td>
    </tr>
    <tr>
      <td>SkyReels-V2</td>
      <td><strong>3.14</strong></td>
      <td><strong>3.15</strong></td>
      <td><strong>3.35</strong></td>
      <td>3.34</td>
      <td>2.74</td>
    </tr>
  </tbody>
</table>
</p>

The evaluation demonstrates that our model achieves significant advancements in **instruction adherence (3.15)** compared to baseline methods, while maintaining competitive performance in **motion quality (2.74)** without sacrificing the **consistency (3.35)**. 

- Image To Video Models

<p align="center">
<table align="center">
  <thead>
    <tr>
      <th>Model</th>
      <th>Average</th>
      <th>Instruction Adherence</th>
      <th>Consistency</th>
      <th>Visual Quality</th>
      <th>Motion Quality</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="https://github.com/Tencent/HunyuanVideo">HunyuanVideo-13B</a></td>
      <td>2.84</td>
      <td>2.97</td>
      <td>2.95</td>
      <td>2.87</td>
      <td>2.56</td>
    </tr>
    <tr>
      <td><a href="https://github.com/Wan-Video/Wan2.1">Wan2.1-14B</a></td>
      <td>2.85</td>
      <td>3.10</td>
      <td>2.81</td>
      <td>3.00</td>
      <td>2.48</td>
    </tr>
    <tr>
      <td><a href="https://hailuoai.video">Hailuo-01</a></td>
      <td>3.05</td>
      <td>3.31</td>
      <td>2.58</td>
      <td>3.55</td>
      <td>2.74</td>
    </tr>
    <tr>
      <td><a href="https://klingai.com">Kling-1.6 Pro Mode</a></td>
      <td>3.4</td>
      <td>3.56</td>
      <td>3.03</td>
      <td>3.58</td>
      <td>3.41</td>
    </tr>
    <tr>
      <td><a href="https://runwayml.com/research/introducing-runway-gen-4">Runway-Gen4</a></td>
      <td>3.39</td>
      <td>3.75</td>
      <td>3.2</td>
      <td>3.4</td>
      <td>3.37</td>
    </tr>
    <tr>
      <td>SkyReels-V2-DF</td>
      <td>3.24</td>
      <td>3.64</td>
      <td>3.21</td>
      <td>3.18</td>
      <td>2.93</td>
    </tr>
    <tr>
      <td>SkyReels-V2-I2V</td>
      <td>3.29</td>
      <td>3.42</td>
      <td>3.18</td>
      <td>3.56</td>
      <td>3.01</td>
    </tr>
  </tbody>
</table>
</p>

Our results demonstrate that both **SkyReels-V2-I2V (3.29)** and **SkyReels-V2-DF (3.24)** achieve state-of-the-art performance among open-source models, significantly outperforming HunyuanVideo-13B (2.84) and Wan2.1-14B (2.85) across all quality dimensions. With an average score of 3.29, SkyReels-V2-I2V demonstrates comparable performance to proprietary models Kling-1.6 (3.4) and Runway-Gen4 (3.39).


#### VBench
To objectively compare SkyReels-V2 Model against other leading open-source Text-To-Video models, we conduct comprehensive evaluations using the public benchmark <a href="https://github.com/Vchitect/VBench">V-Bench</a>. Our evaluation specifically leverages the benchmark’s longer version prompt. For fair comparison with baseline models, we strictly follow their recommended setting for inference. 

<p align="center">
<table align="center">
  <thead>
    <tr>
      <th>Model</th>
      <th>Total Score</th>
      <th>Quality Score</th>
      <th>Semantic Score</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="https://github.com/hpcaitech/Open-Sora">OpenSora 2.0</a></td>
      <td>81.5 %</td>
      <td>82.1 %</td>
      <td>78.2 %</td>
    </tr>
    <tr>
      <td><a href="https://github.com/THUDM/CogVideo">CogVideoX1.5-5B</a></td>
      <td>80.3 %</td>
      <td>80.9 %</td>
      <td>77.9 %</td>
    </tr>
    <tr>
      <td><a href="https://github.com/Tencent/HunyuanVideo">HunyuanVideo-13B</a></td>
      <td>82.7 %</td>
      <td>84.4 %</td>
      <td>76.2 %</td>
    </tr>
    <tr>
      <td><a href="https://github.com/Wan-Video/Wan2.1">Wan2.1-14B</a></td>
      <td>83.7 %</td>
      <td>84.2 %</td>
      <td><strong>81.4 %</strong></td>
    </tr>
    <tr>
      <td>SkyReels-V2</td>
      <td><strong>83.9 %</strong></td>
      <td><strong>84.7 %</strong></td>
      <td>80.8 %</td>
    </tr>
  </tbody>
</table>
</p>

The VBench results demonstrate that SkyReels-V2 outperforms all compared models including HunyuanVideo-13B and Wan2.1-14B, With the highest **total score (83.9%)** and **quality score (84.7%)**. In this evaluation, the semantic score is slightly lower than Wan2.1-14B, while we outperform Wan2.1-14B in human evaluations, with the primary gap attributed to V-Bench’s insufficient evaluation of shot-scenario semantic adherence.
 
## Acknowledgements
We would like to thank the contributors of <a href="https://github.com/Wan-Video/Wan2.1">Wan 2.1</a>, <a href="https://github.com/xdit-project/xDiT">XDit</a> and <a href="https://qwenlm.github.io/blog/qwen2.5/">Qwen 2.5</a> repositories, for their open research and contributions.

## Citation

```bibtex
@misc{chen2025skyreelsv2infinitelengthfilmgenerative,
      title={SkyReels-V2: Infinite-length Film Generative Model}, 
      author={Guibin Chen and Dixuan Lin and Jiangping Yang and Chunze Lin and Junchen Zhu and Mingyuan Fan and Hao Zhang and Sheng Chen and Zheng Chen and Chengcheng Ma and Weiming Xiong and Wei Wang and Nuo Pang and Kang Kang and Zhiheng Xu and Yuzhe Jin and Yupeng Liang and Yubing Song and Peng Zhao and Boyuan Xu and Di Qiu and Debang Li and Zhengcong Fei and Yang Li and Yahui Zhou},
      year={2025},
      eprint={2504.13074},
      archivePrefix={arXiv},
      primaryClass={cs.CV},
      url={https://arxiv.org/abs/2504.13074}, 
}
```
