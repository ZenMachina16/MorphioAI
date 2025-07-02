interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  message?: string
}

export default function LoadingSpinner({ size = 'medium', message }: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  }

  return (
    <div className="min-h-screen bg-[#0e1014] flex flex-col items-center justify-center">
      <div className="mb-6">
        <div className="bg-[#181a1f] border border-gray-700 p-8 rounded-2xl">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className={`animate-spin rounded-full border-4 border-gray-600 border-t-[#6366f1] ${sizeClasses[size]}`}></div>
              <div className="absolute inset-0 rounded-full bg-[#6366f1]/20 animate-pulse"></div>
            </div>
            
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-[#6366f1] rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-[#6366f1] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-[#6366f1] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
      
      {message ? (
        <p className="text-gray-300 text-center">
          {message}
        </p>
      ) : (
        <div className="text-center">
          <p className="text-gray-300 mb-2">
            Loading your content studio...
          </p>
          <p className="text-gray-400 text-sm">
            Preparing AI-powered tools
          </p>
        </div>
      )}
    </div>
  )
} 