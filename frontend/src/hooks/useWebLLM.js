import { useState, useCallback, useRef } from 'react'
import * as webllm from '@mlc-ai/web-llm'

export function useWebLLM() {
  const [isLoading, setIsLoading] = useState(false)
  const [isModelLoaded, setIsModelLoaded] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [messages, setMessages] = useState([])
  const [error, setError] = useState(null)
  
  const engineRef = useRef(null)
  const currentModelRef = useRef(null)

  const loadModel = useCallback(async (modelId) => {
    setIsLoading(true)
    setLoadingProgress(0)
    setError(null)

    try {
      // If engine exists and model is different, reload
      if (engineRef.current && currentModelRef.current !== modelId) {
        await engineRef.current.unload()
        engineRef.current = null
      }

      // Create new engine if it doesn't exist
      if (!engineRef.current) {
        engineRef.current = await webllm.CreateMLCEngine(
          modelId,
          {
            initProgressCallback: (progress) => {
              const percentage = Math.round(progress.progress * 100)
              setLoadingProgress(percentage)
              console.log(`Loading: ${progress.text} (${percentage}%)`)
            },
          }
        )
      }

      currentModelRef.current = modelId
      setIsModelLoaded(true)
      setLoadingProgress(100)
      console.log('Model loaded successfully:', modelId)
    } catch (err) {
      console.error('Failed to load model:', err)
      setError(err.message || 'Failed to load model')
      setIsModelLoaded(false)
      engineRef.current = null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const sendMessage = useCallback(async (userMessage) => {
    if (!engineRef.current || !isModelLoaded) {
      setError('Model not loaded. Please select a model first.')
      return
    }

    setError(null)
    
    // Add user message
    const newMessages = [...messages, { role: 'user', content: userMessage }]
    setMessages(newMessages)

    try {
      // Prepare messages for the API
      const apiMessages = newMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      // Create a placeholder for assistant response
      const assistantMessageIndex = newMessages.length
      setMessages([...newMessages, { role: 'assistant', content: '' }])

      let fullResponse = ''

      // Stream the response
      const completion = await engineRef.current.chat.completions.create({
        messages: apiMessages,
        stream: true,
        temperature: 0.7,
        max_tokens: 2048,
      })

      for await (const chunk of completion) {
        const delta = chunk.choices[0]?.delta?.content || ''
        fullResponse += delta
        
        // Update the assistant message with accumulated response
        setMessages(prevMessages => {
          const updatedMessages = [...prevMessages]
          updatedMessages[assistantMessageIndex] = {
            role: 'assistant',
            content: fullResponse
          }
          return updatedMessages
        })
      }

      console.log('Response completed')
    } catch (err) {
      console.error('Error generating response:', err)
      setError(err.message || 'Failed to generate response')
      
      // Remove the empty assistant message on error
      setMessages(newMessages)
    }
  }, [messages, isModelLoaded])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  const resetEngine = useCallback(async () => {
    if (engineRef.current) {
      try {
        await engineRef.current.unload()
      } catch (err) {
        console.error('Error unloading engine:', err)
      }
      engineRef.current = null
    }
    currentModelRef.current = null
    setIsModelLoaded(false)
    setMessages([])
  }, [])

  return {
    isLoading,
    isModelLoaded,
    loadingProgress,
    messages,
    error,
    loadModel,
    sendMessage,
    clearMessages,
    resetEngine,
  }
}

