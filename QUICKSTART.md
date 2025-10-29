# Quick Start Guide

Get up and running with Browser LLM in 5 minutes!

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js 18+ installed: `node --version`
- ✅ Go 1.21+ installed: `go version`
- ✅ Modern browser (Chrome 113+ recommended)
- ✅ At least 8GB RAM available

## Installation (3 minutes)

### Step 1: Install Dependencies

```bash
cd browser-llm-app

# Install all dependencies at once
make install

# OR install manually:
cd frontend && npm install
cd ../backend && go mod download
```

### Step 2: Start the Application

**Option A: Quick Start (Recommended)**
```bash
make dev
```

**Option B: Manual Start**

Open two terminal windows:

Terminal 1 (Frontend):
```bash
cd frontend
npm run dev
```

Terminal 2 (Backend):
```bash
cd backend
go run cmd/server/main.go
```

### Step 3: Open Your Browser

Navigate to: **http://localhost:3000**

## First Use (2 minutes)

### 1. Select a Model
- Click on **"Llama 3.2 1B Instruct"** (recommended for first try)
- Wait for the model to download (650 MB - takes 1-2 minutes)
- Progress bar shows download status

### 2. Start Chatting
- Type a message: "Hello! Tell me a short joke."
- Click "Send" or press Enter
- Watch the AI respond in real-time!

### 3. Explore Features
- Try the **System Monitor** panel to see resource usage
- Check different models (larger = better quality, but slower)
- All processing happens locally - no internet required after download!

## Common Issues

### "Model failed to load"
- **Fix**: Check your internet connection and try again
- **Fix**: Ensure you have enough RAM (close other applications)
- **Fix**: Try a smaller model first

### "WebGPU not available"
- **Fix**: Update your browser to the latest version
- **Note**: App will still work, just slower

### Port already in use
- **Fix**: Change port in `.env` file or stop other services
- Default ports: Frontend 3000, Backend 8080

## Tips for Best Experience

1. **Start Small**: Use Llama 3.2 1B for your first try
2. **Be Patient**: First model load takes time - it's worth it!
3. **Stay Local**: After initial download, works offline
4. **Monitor Resources**: Keep an eye on the system monitor
5. **Close Tabs**: Free up RAM for better performance

## What's Next?

- Try different models to compare quality
- Experiment with various types of questions
- Check out the full README.md for advanced features
- Monitor performance with the system monitor

## Need Help?

- Check the **README.md** for detailed documentation
- Review the **Troubleshooting** section
- Verify your browser supports WebGPU: https://webgpureport.org/

---

**Enjoy your private, local AI assistant!** 🚀

