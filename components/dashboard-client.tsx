'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

interface RepurposedContent {
  inputType: string
  targetPlatforms: string[]
  twitterPosts?: string[]
  linkedinPost?: string
  instagramCaption?: string
}

interface DashboardClientProps {
  user: User
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [contentInput, setContentInput] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [inputType, setInputType] = useState<'text' | 'url'>('text')
  const [contentType, setContentType] = useState('general-content')
  const [repurposedContent, setRepurposedContent] = useState<RepurposedContent | null>(null)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleRepurpose = async () => {
    if (!contentInput && !urlInput) {
      setError('Please provide either text content or a URL')
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      const response = await fetch('/api/repurpose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputType === 'text' ? contentInput : undefined,
          url: inputType === 'url' ? urlInput : undefined,
          inputType: contentType,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to repurpose content')
      }

      const data = await response.json()
      setRepurposedContent(data)
    } catch (err) {
      setError('Failed to repurpose content. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getContentTypeDescription = (type: string) => {
    const descriptions: Record<string, string> = {
      'youtube-transcript': 'YouTube video transcript or video content',
      'linkedin-post': 'Existing LinkedIn post content',
      'twitter-post': 'Existing Twitter/X post content',
      'instagram-post': 'Existing Instagram post content',
      'blog-article': 'Blog post or article content',
      'general-content': 'Any other type of content'
    }
    return descriptions[type] || 'General content'
  }

  const getTargetPlatformsText = (type: string) => {
    const conversions: Record<string, string> = {
      'youtube-transcript': 'Twitter, LinkedIn, and Instagram',
      'linkedin-post': 'Twitter and Instagram',
      'twitter-post': 'LinkedIn and Instagram',
      'instagram-post': 'LinkedIn and Twitter',
      'blog-article': 'Twitter, LinkedIn, and Instagram',
      'general-content': 'Twitter, LinkedIn, and Instagram'
    }
    return conversions[type] || 'Twitter, LinkedIn, and Instagram'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">ContentRepurposer</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Welcome, {user?.email}
            </span>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Input</CardTitle>
                <CardDescription>
                  Specify your content type and provide the content to repurpose
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                {/* Content Type Selection */}
                <div className="space-y-2">
                  <Label htmlFor="contentType">What type of content are you providing?</Label>
                  <select
                    id="contentType"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                  >
                    <option value="general-content">General Content</option>
                    <option value="youtube-transcript">YouTube Video Transcript</option>
                    <option value="blog-article">Blog Post or Article</option>
                    <option value="linkedin-post">LinkedIn Post</option>
                    <option value="twitter-post">Twitter/X Post</option>
                    <option value="instagram-post">Instagram Post</option>
                  </select>
                  <p className="text-sm text-gray-500">
                    Will convert to: <strong>{getTargetPlatformsText(contentType)}</strong>
                  </p>
                </div>

                {/* Input Type Toggle */}
                <div className="flex space-x-2">
                  <Button
                    variant={inputType === 'text' ? 'default' : 'outline'}
                    onClick={() => setInputType('text')}
                    className="flex-1"
                  >
                    Text Input
                  </Button>
                  <Button
                    variant={inputType === 'url' ? 'default' : 'outline'}
                    onClick={() => setInputType('url')}
                    className="flex-1"
                  >
                    URL Input
                  </Button>
                </div>

                {inputType === 'text' ? (
                  <div className="space-y-2">
                    <Label htmlFor="content">Your Content</Label>
                    <textarea
                      id="content"
                      className="w-full h-40 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder={`Paste your ${getContentTypeDescription(contentType).toLowerCase()} here...`}
                      value={contentInput}
                      onChange={(e) => setContentInput(e.target.value)}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="url">Content URL</Label>
                    <Input
                      id="url"
                      type="url"
                      placeholder="https://example.com/your-content"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                    />
                  </div>
                )}

                <Button
                  onClick={handleRepurpose}
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? 'Processing...' : 'Repurpose Content'}
                </Button>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>How Smart Repurposing Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600">
                <p>• <strong>YouTube Transcripts:</strong> Converts to all three platforms</p>
                <p>• <strong>LinkedIn Posts:</strong> Converts to Twitter and Instagram</p>
                <p>• <strong>Twitter Posts:</strong> Converts to LinkedIn and Instagram</p>
                <p>• <strong>Instagram Posts:</strong> Converts to LinkedIn and Twitter</p>
                <p>• <strong>Blog Articles:</strong> Converts to all three platforms</p>
                <p>• Choose the right content type for optimal results!</p>
              </CardContent>
            </Card>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            {repurposedContent ? (
              <>
                {/* Twitter Posts */}
                {repurposedContent.twitterPosts && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-xl">𝕏</span>
                        Twitter Posts
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {repurposedContent.twitterPosts.map((post, index) => (
                        <div key={index} className="relative">
                          <div className="bg-gray-50 p-4 rounded-md border">
                            <p className="text-sm whitespace-pre-wrap">{post}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="absolute top-2 right-2"
                            onClick={() => copyToClipboard(post)}
                          >
                            Copy
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* LinkedIn Post */}
                {repurposedContent.linkedinPost && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-xl">💼</span>
                        LinkedIn Post
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        <div className="bg-gray-50 p-4 rounded-md border">
                          <p className="text-sm whitespace-pre-wrap">{repurposedContent.linkedinPost}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(repurposedContent.linkedinPost)}
                        >
                          Copy
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Instagram Caption */}
                {repurposedContent.instagramCaption && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-xl">📸</span>
                        Instagram Caption
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        <div className="bg-gray-50 p-4 rounded-md border">
                          <p className="text-sm whitespace-pre-wrap">{repurposedContent.instagramCaption}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(repurposedContent.instagramCaption)}
                        >
                          Copy
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <span className="text-4xl">🎯</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Smart Content Repurposing
                  </h3>
                  <p className="text-gray-500">
                    Select your content type and input your content to get platform-optimized posts
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 