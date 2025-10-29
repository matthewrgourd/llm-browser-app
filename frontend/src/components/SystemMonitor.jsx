import { useState, useEffect } from 'react'

export default function SystemMonitor({ isModelLoaded }) {
  const [systemInfo, setSystemInfo] = useState({
    memory: { used: 0, total: 0 },
    cpu: 0,
    gpu: 'Detecting...',
  })

  useEffect(() => {
    const updateSystemInfo = () => {
      // Memory usage
      if (performance.memory) {
        const used = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)
        const total = Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
        setSystemInfo(prev => ({
          ...prev,
          memory: { used, total }
        }))
      }

      // GPU detection
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
          setSystemInfo(prev => ({
            ...prev,
            gpu: renderer
          }))
        }
      }
    }

    updateSystemInfo()
    const interval = setInterval(updateSystemInfo, 2000)
    return () => clearInterval(interval)
  }, [])

  // Check WebGPU support
  const [webGPUSupported, setWebGPUSupported] = useState(false)
  useEffect(() => {
    if ('gpu' in navigator) {
      setWebGPUSupported(true)
    }
  }, [])

  const memoryPercentage = systemInfo.memory.total 
    ? (systemInfo.memory.used / systemInfo.memory.total) * 100 
    : 0

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        System Monitor
      </h2>

      <div className="space-y-4">
        {/* Memory Usage */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Memory</span>
            <span className="text-xs text-gray-600">
              {systemInfo.memory.used} MB / {systemInfo.memory.total} MB
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all ${
                memoryPercentage > 80 ? 'bg-red-500' : 
                memoryPercentage > 60 ? 'bg-yellow-500' : 
                'bg-green-500'
              }`}
              style={{ width: `${Math.min(memoryPercentage, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* WebGPU Status */}
        <div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">WebGPU</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              webGPUSupported ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {webGPUSupported ? 'Supported' : 'Not Available'}
            </span>
          </div>
          {webGPUSupported && (
            <p className="text-xs text-gray-500 mt-1">
              Hardware acceleration enabled
            </p>
          )}
        </div>

        {/* Model Status */}
        <div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Model Status</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              isModelLoaded ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {isModelLoaded ? 'Loaded' : 'Not Loaded'}
            </span>
          </div>
        </div>

        {/* System Info */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-xs font-medium text-gray-700 mb-2">Browser Info</h3>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Cores:</span>
              <span>{navigator.hardwareConcurrency || 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span>Platform:</span>
              <span className="truncate ml-2">{navigator.platform}</span>
            </div>
            {systemInfo.gpu !== 'Detecting...' && (
              <div className="flex justify-between">
                <span>GPU:</span>
                <span className="truncate ml-2 text-right" title={systemInfo.gpu}>
                  {systemInfo.gpu.length > 20 ? systemInfo.gpu.substring(0, 20) + '...' : systemInfo.gpu}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-xs font-medium text-green-900">Private & Secure</p>
              <p className="text-xs text-green-700 mt-1">
                All processing happens in your browser. No data leaves your device.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

