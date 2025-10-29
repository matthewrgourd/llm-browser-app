# Browser LLM - Local AI in Your Browser

A complete implementation of browser-based large language model inference that runs entirely on client-side hardware. This application demonstrates privacy-preserving AI inference without server-side processing requirements.

## 🚀 Features

- **100% Local Processing**: All AI inference happens in your browser - no data sent to external servers
- **Multiple Models**: Support for various LLMs including Llama, Phi, and Qwen models
- **WebGPU Acceleration**: Hardware-accelerated inference using WebGPU when available
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- **Real-time Monitoring**: System resource monitoring (CPU, Memory, GPU)
- **Streaming Responses**: Token-by-token streaming for better user experience
- **Model Caching**: Models are cached locally using IndexedDB for faster subsequent loads
- **Privacy First**: Complete data privacy - conversations never leave your device

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **Go** 1.21+
- **Modern Browser** with WebGPU support (Chrome 113+, Edge 113+, or similar)
- **Minimum 8GB RAM** (16GB recommended for larger models)

## 🛠️ Installation

### Quick Start

1. **Clone or navigate to the project directory**:
```bash
cd browser-llm-app
```

2. **Install all dependencies**:
```bash
make install
```

Or manually:
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
go mod download
```

3. **Configure environment** (optional):
```bash
cp .env.example .env
# Edit .env if you need to change default settings
```

## 🚀 Running the Application

### Development Mode

Run both frontend and backend simultaneously:
```bash
make dev
```

Or run them separately:

**Terminal 1 - Frontend**:
```bash
cd frontend
npm run dev
# Available at http://localhost:3000
```

**Terminal 2 - Backend**:
```bash
cd backend
go run cmd/server/main.go
# Available at http://localhost:8080
```

### Production Mode

Build and run the production version:
```bash
make build
cd backend
./server
```

The backend will serve the built frontend from the `frontend/dist` directory.

## 📁 Project Structure

```
browser-llm-app/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Header.jsx
│   │   │   ├── ModelSelector.jsx
│   │   │   ├── ChatInterface.jsx
│   │   │   └── SystemMonitor.jsx
│   │   ├── hooks/           # Custom React hooks
│   │   │   └── useWebLLM.js # WebLLM integration
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── backend/                  # Go backend server
│   ├── cmd/
│   │   └── server/
│   │       └── main.go      # Server entry point
│   ├── internal/
│   │   ├── config/          # Configuration management
│   │   ├── handlers/        # HTTP handlers
│   │   ├── middleware/      # HTTP middleware
│   │   └── logger/          # Logging utilities
│   ├── go.mod
│   └── go.sum
├── Makefile                  # Build automation
├── .env.example              # Environment template
└── README.md                 # This file
```

## 🎯 Usage

### First Time Setup

1. **Start the application** using `make dev`
2. **Open your browser** and navigate to `http://localhost:3000`
3. **Select a model** from the left sidebar:
   - Start with **Llama 3.2 1B** for fastest experience
   - First download will take time (models are 650MB - 4GB)
   - Models are cached locally for instant loading next time

### Using the Chat Interface

1. **Wait for model to load** - You'll see a progress bar
2. **Type your message** in the input field at the bottom
3. **Click Send** or press Enter
4. **Watch the response stream** in real-time
5. **Monitor system resources** in the right panel

### Model Selection Guide

| Model | Size | RAM Required | Speed | Use Case |
|-------|------|--------------|-------|----------|
| Llama 3.2 1B | 650 MB | 4-8 GB | Fast | Quick queries, testing |
| Llama 3.2 3B | 1.8 GB | 8-12 GB | Balanced | General purpose |
| Phi 3.5 Mini | 2.3 GB | 8-12 GB | Balanced | Efficient responses |
| Qwen 2.5 7B | 4.2 GB | 12-16 GB | Slower | High quality |

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```bash
# Backend server port
PORT=8080

# Host to bind to
HOST=0.0.0.0

# Environment (development/production)
ENVIRONMENT=development

# CORS allowed origin
CORS_ORIGIN=http://localhost:3000

# Logging level (debug/info/warn/error)
LOG_LEVEL=info

# Static files directory for production
STATIC_DIR=../frontend/dist

# Enable profiling endpoints
ENABLE_PROFILING=false
```

## 🏗️ Architecture

### High-Level Overview

The application follows a three-tier architecture:

1. **Presentation Layer** (React)
   - User interface components
   - State management
   - Real-time system monitoring

2. **Application Layer** (Go/Gin)
   - RESTful API endpoints
   - Static file serving
   - CORS handling
   - Request logging

3. **Inference Layer** (WebLLM)
   - Model loading and management
   - WebAssembly runtime
   - WebGPU acceleration
   - Browser-based inference

### Key Technologies

- **Frontend**: React 18, Vite, Tailwind CSS, WebLLM
- **Backend**: Go 1.21, Gin, Logrus
- **Inference**: WebAssembly, WebGPU, MLC
- **Storage**: IndexedDB (browser cache)

## 🔧 Development

### Available Commands

```bash
make help          # Show all available commands
make install       # Install dependencies
make dev           # Run development servers
make build         # Build for production
make clean         # Clean build artifacts
make test-backend  # Run backend tests
make lint-frontend # Lint frontend code
make check         # Run all checks
```

### Adding New Models

Models are fetched from the backend's model registry. To add new models:

1. Edit `backend/internal/handlers/models.go`
2. Add model info to the `models` slice in `GetModels()` function
3. Ensure the model ID matches a valid WebLLM model identifier

### Browser Compatibility

**Supported Browsers**:
- ✅ Chrome/Edge 113+ (Full WebGPU support)
- ✅ Safari 17+ (WebGPU support in development)
- ⚠️ Firefox (Limited WebGPU support)

**Check WebGPU Support**: Visit https://webgpureport.org/

## 🐛 Troubleshooting

### Model Loading Issues

**Problem**: Model fails to load or loads slowly
- **Solution**: 
  - Check your internet connection (first download)
  - Ensure sufficient RAM is available
  - Try a smaller model
  - Clear browser cache and retry

### Out of Memory Errors

**Problem**: Browser crashes or shows memory errors
- **Solution**:
  - Close other tabs and applications
  - Use a smaller model
  - Increase your browser's memory limit
  - Consider using a device with more RAM

### WebGPU Not Available

**Problem**: WebGPU acceleration not working
- **Solution**:
  - Update your browser to the latest version
  - Enable WebGPU in browser flags (chrome://flags)
  - Check GPU drivers are up to date
  - System will fallback to WebAssembly (slower)

### CORS Errors

**Problem**: API requests blocked by CORS policy
- **Solution**:
  - Ensure backend is running on port 8080
  - Check CORS_ORIGIN in `.env` matches frontend URL
  - Verify both servers are running

## 🔒 Privacy & Security

- **No Data Transmission**: All processing happens locally
- **No Telemetry**: No usage tracking or analytics
- **Open Source**: Complete source code available for inspection
- **Offline Capable**: Works without internet after model download
- **Local Storage Only**: Conversations stored in browser memory only

## 📊 Performance Tips

1. **First Use**: Initial model download takes time - be patient
2. **Subsequent Uses**: Models load instantly from cache
3. **RAM Management**: Close unused tabs to free memory
4. **GPU Acceleration**: Ensure WebGPU is enabled for best performance
5. **Model Selection**: Start with smaller models for faster responses

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Additional model support
- UI/UX enhancements
- Performance optimizations
- Documentation improvements
- Browser compatibility
- Error handling

## 📝 License

This project is provided as-is for educational and experimental purposes.

## 🙏 Acknowledgments

- **WebLLM**: Browser-based LLM inference engine
- **MLC AI**: Machine Learning Compilation project
- **Meta AI**: Llama models
- **Microsoft**: Phi models
- **Alibaba Cloud**: Qwen models

## 📚 Additional Resources

- [WebLLM Documentation](https://github.com/mlc-ai/web-llm)
- [WebGPU Specification](https://www.w3.org/TR/webgpu/)
- [React Documentation](https://react.dev/)
- [Gin Web Framework](https://gin-gonic.com/)

---

**Built with ❤️ for privacy-conscious AI enthusiasts**

For questions or issues, please refer to the troubleshooting section or check the project's issue tracker.

