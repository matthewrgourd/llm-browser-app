export default function ModelSelector({ 
  models, 
  selectedModel, 
  onModelSelect, 
  isLoading, 
  isModelLoaded,
  loadingProgress 
}) {
  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
        Select Model
      </h2>
      
      {isLoading && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">Loading Model...</span>
            <span className="text-sm text-blue-700">{loadingProgress}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-blue-600 mt-2">
            First load may take a while. Model will be cached for next time.
          </p>
        </div>
      )}
      
      <div className="space-y-2">
        {models.map((model) => (
          <button
            key={model.id}
            onClick={() => onModelSelect(model.id)}
            disabled={isLoading}
            className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
              selectedModel === model.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-sm text-gray-900">{model.name}</h3>
                <p className="text-xs text-gray-600 mt-1">{model.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                    {model.parameters}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                    {model.size}
                  </span>
                </div>
                {model.tags && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {model.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {selectedModel === model.id && isModelLoaded && (
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>
      
      {models.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">Loading available models...</p>
        </div>
      )}
    </div>
  )
}

