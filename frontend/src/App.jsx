import { useState, useEffect } from 'react'
import Header from './components/Header'
import ModelSelector from './components/ModelSelector'
import ChatInterface from './components/ChatInterface'
import SystemMonitor from './components/SystemMonitor'
import { useWebLLM } from './hooks/useWebLLM'

function App() {
  const [selectedModel, setSelectedModel] = useState(null)
  const [availableModels, setAvailableModels] = useState([])
  
  const {
    isLoading,
    isModelLoaded,
    loadingProgress,
    messages,
    sendMessage,
    loadModel,
    error,
  } = useWebLLM()

  useEffect(() => {
    // Fetch available models from backend
    fetch('/api/models')
      .then(res => res.json())
      .then(data => {
        setAvailableModels(data.models || [])
      })
      .catch(err => {
        console.error('Failed to fetch models:', err)
        // Fallback to default models if backend is not available
        setAvailableModels([
          {
            id: 'Llama-3.2-1B-Instruct-q4f16_1-MLC',
            name: 'Llama 3.2 1B Instruct',
            description: 'Small, fast model ideal for quick responses',
            size: '650 MB',
            parameters: '1B',
            tags: ['fast', 'lightweight', 'recommended']
          }
        ])
      })
  }, [])

  const handleModelSelect = async (modelId) => {
    setSelectedModel(modelId)
    await loadModel(modelId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left sidebar - Model Selection */}
          <div className="lg:col-span-1">
            <ModelSelector
              models={availableModels}
              selectedModel={selectedModel}
              onModelSelect={handleModelSelect}
              isLoading={isLoading}
              isModelLoaded={isModelLoaded}
              loadingProgress={loadingProgress}
            />
            
            <div className="mt-6">
              <SystemMonitor isModelLoaded={isModelLoaded} />
            </div>
          </div>
          
          {/* Main content - Chat Interface */}
          <div className="lg:col-span-3">
            <ChatInterface
              messages={messages}
              onSendMessage={sendMessage}
              isLoading={isLoading}
              isModelLoaded={isModelLoaded}
              selectedModel={selectedModel}
              error={error}
            />
          </div>
        </div>
      </main>
      
      <footer className="mt-12 py-6 text-center text-gray-600 text-sm">
        <p>Browser LLM - All inference happens locally in your browser</p>
        <p className="mt-1">No data is sent to external servers</p>
      </footer>
    </div>
  )
}

export default App

