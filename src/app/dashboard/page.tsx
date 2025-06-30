"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Header from "@/components/Header"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return // Still loading
    if (!session) {
      router.push('/') // Redirect to landing page if not authenticated
    }
  }, [session, status, router])

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
              Welcome {session.user?.name} !!!
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Ready to transform your content for multiple social media platforms? 
              Get started by selecting your content type and target platforms below.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-500 rounded-lg p-2 mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-blue-900">Content Ready</h3>
                </div>
                <p className="text-blue-800">
                  Upload your blog posts, YouTube transcripts, or social media content to get started.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                <div className="flex items-center mb-4">
                  <div className="bg-green-500 rounded-lg p-2 mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-green-900">AI-Powered</h3>
                </div>
                <p className="text-green-800">
                  Our Mistral 7B model will intelligently adapt your content for each platform.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-500 rounded-lg p-2 mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-purple-900">Multi-Platform</h3>
                </div>
                <p className="text-purple-800">
                  Generate optimized posts for Twitter, Instagram, and LinkedIn simultaneously.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Start</h3>
            <p className="text-gray-600 mb-4">
              Jump right into repurposing your content with our streamlined workflow.
            </p>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200">
              Start Repurposing
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Plan</h3>
            <p className="text-gray-600 mb-4">
              You're currently on the <span className="font-semibold text-blue-600">Free Plan</span>. 
              Upgrade to unlock more features and higher usage limits.
            </p>
            <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 transition-colors duration-200">
              View Plans
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
} 