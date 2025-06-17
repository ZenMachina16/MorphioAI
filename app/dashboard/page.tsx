'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

interface RepurposedContent {
  xPosts: string[]
  linkedinPost: string
  instagramCaption: string
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [contentInput, setContentInput] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [inputType, setInputType] = useState<'text' | 'url'>('text')
  const [repurposedContent, setRepurposedContent] = useState<RepurposedContent | null>(null)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
      } else {
        setUser(user)
      }
      setIsLoading(false)
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          router.push('/auth/login')
        } else if (session?.user) {
          setUser(session.user)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
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
                  Provide your content either as text or a URL to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

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
                      placeholder="Paste your blog post, article, or any long-form content here..."
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
                      placeholder="https://example.com/your-article"
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
                <CardTitle>How to Use</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600">
                <p>• <strong>Text Input:</strong> Paste your blog post or article directly</p>
                <p>• <strong>URL Input:</strong> Provide a link to any web article</p>
                <p>• Our AI will create platform-optimized posts for X, LinkedIn, and Instagram</p>
                <p>• Click the copy buttons to easily share your content</p>
              </CardContent>
            </Card>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            {repurposedContent ? (
              <>
                {/* X (Twitter) Posts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-xl">𝕏</span>
                      X (Twitter) Posts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {repurposedContent.xPosts.map((post, index) => (
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

                {/* LinkedIn Post */}
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

                {/* Instagram Caption */}
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
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <span className="text-4xl">🎯</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Ready to Create Content
                  </h3>
                  <p className="text-gray-500">
                    Enter your content on the left to get started with AI-powered repurposing
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