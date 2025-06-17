import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-indigo-600">
          ContentRepurposer
        </div>
        <div className="space-x-4">
          <Link href="/auth/login">
            <Button variant="outline">Sign In</Button>
          </Link>
          <Link href="/auth/login">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Transform Long-Form Content into
            <span className="text-indigo-600"> Social Media Gold</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Repurpose your blogs, articles, and content into engaging posts for X (Twitter), 
            LinkedIn, and Instagram with the power of AI. Save hours of content creation time.
          </p>
          <Link href="/auth/login">
            <Button size="lg" className="text-lg px-8 py-4">
              Start Creating Content
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose ContentRepurposer?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                AI-Powered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Uses advanced GPT-4 to understand your content and create platform-specific posts 
                that maintain your voice and message.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                Lightning Fast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Transform any blog post or article into multiple social media posts 
                in seconds, not hours.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                Multi-Platform
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Create optimized content for X (Twitter), LinkedIn, and Instagram 
                with platform-specific formatting and tone.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Input Your Content</h3>
              <p className="text-gray-600">
                Paste your article text or provide a URL to any blog post or article.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Magic Happens</h3>
              <p className="text-gray-600">
                Our AI analyzes your content and creates platform-optimized social media posts.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Copy & Share</h3>
              <p className="text-gray-600">
                Get ready-to-post content for X, LinkedIn, and Instagram. Just copy and share!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to 10x Your Content Creation?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of content creators who are saving time and increasing engagement.
          </p>
          <Link href="/auth/login">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-2xl font-bold mb-4">ContentRepurposer</div>
          <p className="text-gray-400 mb-4">
            Transform your content. Amplify your reach.
          </p>
          <p className="text-gray-500 text-sm">
            © 2024 ContentRepurposer. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
