"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Header from "@/components/Header"
import LoadingSpinner from "@/components/LoadingSpinner"

interface GeneratedResults {
  [key: string]: string
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // Form state
  const [content, setContent] = useState("")
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [results, setResults] = useState<GeneratedResults | null>(null)
  const [error, setError] = useState<string | null>(null)

  const platforms = [
    { id: 'twitter', name: 'Twitter/X', icon: '𝕏', color: 'from-gray-800 to-black' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: 'from-blue-600 to-blue-800' },
    { id: 'instagram', name: 'Instagram', icon: '📸', color: 'from-pink-500 to-purple-600' }
  ]

  useEffect(() => {
    if (status === "loading") return // Still loading
    if (!session) {
      router.push('/') // Redirect to landing page if not authenticated
    }
  }, [session, status, router])

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim()) {
      setError("Please enter some content to repurpose")
      return
    }
    
    if (selectedPlatforms.length === 0) {
      setError("Please select at least one platform")
      return
    }

    setIsGenerating(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch('/api/repurpose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          platforms: selectedPlatforms
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to repurpose content')
      }

      setResults(data.results)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  if (status === "loading") {
    return <LoadingSpinner size="large" message="Loading your dashboard..." />
  }

  if (!session) {
    return null // This will briefly show while redirecting
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome {session.user?.name}!
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Transform your content for multiple social media platforms using AI. 
              Paste your YouTube transcript, blog post, or any content below.
            </p>
          </div>
        </div>

        {/* Content Repurposing Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Content Repurposer</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Content Input */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Original Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your YouTube transcript, blog post, articles, or any content here... No character limits!"
                className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-y focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isGenerating}
              />
              <p className="text-sm text-gray-500 mt-1">
                {content.length} characters • No limits - paste as much content as needed
              </p>
            </div>

            {/* Platform Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Platforms
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {platforms.map((platform) => (
                  <div
                    key={platform.id}
                    className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 ${
                      selectedPlatforms.includes(platform.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handlePlatformToggle(platform.id)}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedPlatforms.includes(platform.id)}
                        onChange={() => handlePlatformToggle(platform.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        disabled={isGenerating}
                      />
                      <div className="ml-3 flex items-center">
                        <span className="text-2xl mr-2">{platform.icon}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {platform.name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isGenerating || !content.trim() || selectedPlatforms.length === 0}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Content...
                  </>
                ) : (
                  'Repurpose Content'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        {results && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Generated Content</h3>
            {Object.entries(results).map(([platform, content]) => {
              const platformInfo = platforms.find(p => p.id === platform)
              return (
                <div key={platform} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">{platformInfo?.icon}</span>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {platformInfo?.name}
                      </h4>
                    </div>
                    <button
                      onClick={() => copyToClipboard(content)}
                      className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-800 whitespace-pre-wrap">{content}</p>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {content.length} characters
                  </p>
                </div>
              )
            })}
          </div>
        )}

        {/* Feature Overview */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-500 rounded-lg p-2 mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
              <h3 className="text-lg font-semibold text-blue-900">Smart Adaptation</h3>
                </div>
                <p className="text-blue-800">
              AI automatically adapts your content's tone, length, and style for each platform's unique audience.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                <div className="flex items-center mb-4">
                  <div className="bg-green-500 rounded-lg p-2 mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
              <h3 className="text-lg font-semibold text-green-900">Mistral 7B Powered</h3>
                </div>
                <p className="text-green-800">
              Powered by advanced Mistral 7B language model for high-quality, contextually aware content generation.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-500 rounded-lg p-2 mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
              <h3 className="text-lg font-semibold text-purple-900">One-Click Copy</h3>
            </div>
            <p className="text-purple-800">
              Easily copy generated content with one click and paste directly into your social media platforms.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
} 