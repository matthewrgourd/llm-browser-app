# Architecture Documentation

This document provides a technical overview of the Browser LLM application architecture.

## System Overview

Browser LLM implements a three-tier architecture optimized for client-side machine learning inference:

```
┌─────────────────────────────────────────────────────────┐
│                     Browser Client                       │
├─────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────┐  │
│  │         React Presentation Layer                   │  │
│  │  - UI Components (Chat, Models, Monitor)          │  │
│  │  - State Management (Hooks, Context)              │  │
│  │  - User Interactions                              │  │
│  └───────────────────────────────────────────────────┘  │
│                         ↕                                │
│  ┌───────────────────────────────────────────────────┐  │
│  │         WebLLM Inference Engine                    │  │
│  │  - Model Loading & Management                      │  │
│  │  - Tokenization                                    │  │
│  │  - Inference Execution                             │  │
│  └───────────────────────────────────────────────────┘  │
│                         ↕                                │
│  ┌───────────────────────────────────────────────────┐  │
│  │    WebAssembly + WebGPU Runtime                    │  │
│  │  - WASM Linear Memory                              │  │
│  │  - GPU Compute Shaders                             │  │
│  │  - Hardware Acceleration                           │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           ↕
                    HTTP/REST API
                           ↕
┌─────────────────────────────────────────────────────────┐
│                  Go Backend Server                       │
├─────────────────────────────────────────────────────────┤
│  - RESTful API (Gin Framework)                          │
│  - Model Registry & Configuration                       │
│  - Static File Serving                                  │
│  - CORS & Middleware                                    │
│  - Logging & Monitoring                                 │
└─────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Components

#### 1. App Component (`App.jsx`)
- **Role**: Root component and application orchestrator
- **Responsibilities**:
  - Global state management
  - Component composition
  - Model list fetching
  - Error boundary
- **State**: Model selection, availability, loading status

#### 2. Header Component (`Header.jsx`)
- **Role**: Application header and branding
- **Responsibilities**:
  - Display application title
  - Show privacy status indicator
  - Responsive layout

#### 3. Model Selector Component (`ModelSelector.jsx`)
- **Role**: Model selection interface
- **Responsibilities**:
  - Display available models
  - Show model metadata (size, parameters)
  - Handle model selection
  - Display loading progress
  - Show model status indicators
- **Props**: models, selectedModel, onModelSelect, isLoading, loadingProgress

#### 4. Chat Interface Component (`ChatInterface.jsx`)
- **Role**: Main conversation interface
- **Responsibilities**:
  - Display message history
  - Handle user input
  - Stream AI responses
  - Render markdown content
  - Auto-scroll to latest message
- **Features**:
  - Streaming response rendering
  - Markdown support (code blocks, lists, etc.)
  - Message role differentiation
  - Loading indicators

#### 5. System Monitor Component (`SystemMonitor.jsx`)
- **Role**: Real-time system resource monitoring
- **Responsibilities**:
  - Track memory usage
  - Detect GPU/WebGPU support
  - Display system information
  - Show privacy indicators
- **Metrics**: Memory (JS Heap), CPU cores, GPU info, WebGPU status

### Custom Hooks

#### useWebLLM Hook (`useWebLLM.js`)
- **Role**: WebLLM engine integration and management
- **Responsibilities**:
  - Initialize and manage WebLLM engine
  - Load and unload models
  - Handle inference requests
  - Stream responses
  - Manage conversation state
- **State Management**:
  - `isLoading`: Model loading state
  - `isModelLoaded`: Model ready state
  - `loadingProgress`: Loading percentage
  - `messages`: Conversation history
  - `error`: Error messages
- **Methods**:
  - `loadModel(modelId)`: Load a specific model
  - `sendMessage(userMessage)`: Send message and get response
  - `clearMessages()`: Clear conversation
  - `resetEngine()`: Unload model and reset

### Backend Architecture

#### Server Structure (`cmd/server/main.go`)
- **Framework**: Gin Web Framework
- **Routes**:
  - `GET /api/health`: Health check endpoint
  - `GET /api/models`: Available models list
  - `GET /`: Serve frontend (production)
  - `Static /assets`: Serve static assets

#### Configuration (`internal/config/config.go`)
- Environment-based configuration
- Supports: Port, Host, CORS, Logging, Static files
- Default values with override capability

#### Handlers (`internal/handlers/`)
- **health.go**: System health and status
- **models.go**: Model registry and metadata

#### Middleware (`internal/middleware/`)
- **logging.go**: Request/response logging
- CORS handling (via gin-contrib/cors)

#### Logger (`internal/logger/logger.go`)
- Structured JSON logging
- Configurable log levels
- Request tracing

## Data Flow

### Model Loading Flow

```
User Selects Model
    ↓
App.handleModelSelect()
    ↓
useWebLLM.loadModel(modelId)
    ↓
WebLLM Engine Creation
    ↓
Check Browser Cache (IndexedDB)
    ├─ Cached: Load from IndexedDB
    └─ Not Cached: Download from CDN
        ↓
    Store in IndexedDB
    ↓
Compile WebGPU Shaders
    ↓
Load Model Weights
    ↓
Model Ready (setIsModelLoaded = true)
```

### Inference Request Flow

```
User Sends Message
    ↓
ChatInterface.handleSubmit()
    ↓
useWebLLM.sendMessage(message)
    ↓
Add user message to state
    ↓
Prepare API messages
    ↓
engine.chat.completions.create()
    ↓
Stream Response Loop:
    ├─ Receive token chunk
    ├─ Accumulate to response
    ├─ Update UI with partial response
    └─ Repeat until complete
    ↓
Final message displayed
```

## Memory Management

### Browser Memory Spaces

1. **JavaScript Heap**
   - React components and state
   - Message history
   - UI state
   - Limit: ~4GB (browser dependent)

2. **WASM Linear Memory**
   - Model weights
   - Intermediate computations
   - Managed by WebLLM

3. **GPU Memory**
   - Activation tensors
   - KV cache
   - Compute shader buffers

4. **IndexedDB**
   - Persistent model cache
   - Configuration
   - Limit: Several GB (browser dependent)

### Optimization Strategies

- **Model Quantization**: 4-bit weights reduce memory by 8x
- **KV Cache**: Reuse context for multi-turn conversations
- **Streaming**: Token-by-token generation reduces latency
- **Progressive Loading**: Load models in chunks
- **Cache Management**: Persistent storage for quick reload

## Performance Characteristics

### Model Loading Times (First Load)

| Model Size | Download Time* | Initialization | Total Time |
|-----------|----------------|----------------|------------|
| 1B params | 30-60s | 5-10s | 35-70s |
| 3B params | 60-120s | 10-15s | 70-135s |
| 7B params | 180-300s | 20-40s | 200-340s |

*Depends on network speed (assumes 10 Mbps)

### Inference Performance

| Hardware Config | Tokens/Second | First Token Latency |
|----------------|---------------|---------------------|
| 4-core, 8GB, iGPU | 8-12 | 800-1200ms |
| 8-core, 16GB, dGPU | 18-25 | 400-600ms |
| 12-core, 32GB, dGPU | 25-35 | 300-500ms |

## Security Architecture

### Client-Side Security

1. **Data Privacy**
   - No data transmission to external servers
   - All processing local to browser
   - Conversation stored in memory only

2. **Content Security**
   - Input sanitization
   - XSS prevention in markdown rendering
   - CSP headers (production)

3. **Dependency Security**
   - Regular npm audit
   - Go module verification
   - Subresource integrity (CDN)

### Backend Security

1. **CORS Configuration**
   - Whitelist-based origins
   - Credential control

2. **Request Validation**
   - Input validation
   - Rate limiting (optional)

3. **Logging & Monitoring**
   - Structured logging
   - Error tracking
   - Health endpoints

## Scalability Considerations

### Horizontal Scaling

- **Client-Side**: Naturally distributed (each browser independent)
- **Backend**: Stateless API enables load balancing
- **CDN**: Model distribution via edge locations

### Vertical Scaling

- **Memory**: More RAM = larger models
- **CPU**: More cores = better initialization
- **GPU**: Better GPU = faster inference

## Browser Compatibility

### Required Features

- **WebAssembly**: Universal support (all modern browsers)
- **WebGPU**: Chrome/Edge 113+, Safari 17+ (experimental), Firefox (in development)
- **IndexedDB**: Universal support
- **ES Modules**: Universal support in modern browsers

### Fallback Strategy

1. WebGPU available → Hardware acceleration
2. WebGPU unavailable → WASM-only mode (slower but functional)
3. Insufficient memory → Suggest smaller model

## Extension Points

### Adding New Models

1. Update `backend/internal/handlers/models.go`
2. Add model metadata to `GetModels()` function
3. Ensure model ID matches WebLLM registry

### Adding New Features

1. **Custom Prompts**: Extend `useWebLLM.js` with system prompts
2. **Conversation Export**: Add export function to chat state
3. **Model Comparison**: Load multiple models simultaneously
4. **Advanced Settings**: Temperature, top-p, max tokens controls

### API Extensions

1. Add handlers in `backend/internal/handlers/`
2. Register routes in `cmd/server/main.go`
3. Update frontend to consume new endpoints

## Technology Stack Summary

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.8
- **Styling**: Tailwind CSS 3.3.6
- **ML Engine**: WebLLM 0.2.79
- **Markdown**: react-markdown 9.0.1

### Backend
- **Runtime**: Go 1.21+
- **Framework**: Gin 1.9.1
- **Logging**: Logrus 1.9.3
- **CORS**: gin-contrib/cors 1.5.0

### Infrastructure
- **Storage**: IndexedDB (client-side)
- **Acceleration**: WebGPU + WebAssembly
- **Distribution**: CDN for models

## Future Enhancements

1. **Multi-Model Support**: Compare responses from different models
2. **Fine-Tuning**: Browser-based model adaptation
3. **P2P Distribution**: Share models via WebRTC
4. **Service Workers**: Complete offline functionality
5. **Mobile Optimization**: Efficient inference on mobile devices
6. **Advanced Caching**: Predictive model pre-loading
7. **Conversation Management**: Save/load conversations
8. **Plugin System**: Extensible architecture for custom features

