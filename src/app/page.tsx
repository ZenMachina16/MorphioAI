"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Logo from "@/components/Logo"
import TypewriterText from "@/components/TypewriterText"
import ContentSplitAnimation from "@/components/ContentSplitAnimation"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showTypewriter, setShowTypewriter] = useState(false)

  useEffect(() => {
    if (session) {
      router.push('/dashboard')
    }
  }, [session, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0e1014] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#6366f1]"></div>
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        duration: 0.6
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e1014] via-[#0e1014] to-[#181a1f] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#6366f1" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 pt-6 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Logo size="lg" />
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/auth/signin')}
              className="px-6 py-2 bg-[#6366f1] text-white rounded-lg font-medium hover:bg-[#5855eb] transition-colors duration-200"
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="pt-16 pb-20"
        >
          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
            {/* Left Column - Text Content */}
            <motion.div variants={itemVariants} className="space-y-8 lg:pr-8">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-200 leading-tight">
                  Repurpose smarter, 
                  <br />
                  <span className="text-[#6366f1]">grow faster.</span>
                </h1>
                
                <div className="text-xl md:text-2xl text-gray-300 leading-relaxed">
                  <TypewriterText
                    text="MorphioAI turns one piece of content into an audience across platforms."
                    speed={40}
                    className="inline"
                  />
          </div>
        </div>
              
              {/* Features list */}
              <motion.div 
                variants={itemVariants}
                className="space-y-4"
              >
                {[
                  "Transform long-form content instantly",
                  "Optimize for Twitter, LinkedIn & Instagram",
                  "Appropriate tone & style adaptation"
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2 + index * 0.2 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-2 h-2 bg-[#6366f1] rounded-full"></div>
                    <span className="text-gray-300">{feature}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Column - 3D Animation */}
            <motion.div 
              variants={itemVariants}
              className="flex justify-center items-center lg:pl-8"
            >
              <div className="w-full max-w-lg">
                <ContentSplitAnimation />
              </div>
            </motion.div>
          </div>

          {/* Centered CTA Button */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3, duration: 0.6 }}
            className="flex justify-center mt-16"
          >
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/auth/signin')}
              className="inline-flex items-center justify-center px-12 py-4 bg-gradient-to-r from-[#6366f1] to-[#e11d48] text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform"
            >
              <span className="mr-2">✨</span>
              Get Started
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="ml-2"
              >
                →
              </motion.span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="pb-20"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-200 mb-4">
              Why Choose MorphioAI?
            </h2>
            
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🔄",
                title: "Platform-Smart Repurposing",
                description: "Turn your content into tailored posts for Twitter/X, LinkedIn, and Instagram, each crafted to fit platform-native tone and length limits.",
                color: "from-[#6366f1]/20 to-[#6366f1]/10",
                borderColor: "border-[#6366f1]/30"
              },
              {
                icon: "⚡",
                title: "Instant Content Rewrites",
                description: "Say goodbye to tedious copy-pasting. Convert a blog, article, or transcript into multiple social-ready captions and hooks instantly.",
                color: "from-green-500/20 to-green-500/10",
                borderColor: "border-green-500/30"
              },
              {
                icon: "🚀",
                title: "Boost Engagement Where It Matters",
                description: "Deliver the right message, in the right format, on the right platform helping your content get noticed and grow faster.",
                color: "from-[#e11d48]/20 to-[#e11d48]/10",
                borderColor: "border-[#e11d48]/30"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-[#181a1f] rounded-xl p-8 shadow-lg border ${feature.borderColor} bg-gradient-to-br ${feature.color} backdrop-blur-sm`}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-200 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="pb-20"
        >
          <div className="bg-gradient-to-r from-[#6366f1]/10 to-[#e11d48]/10 rounded-2xl p-12 border border-gray-700">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-200 mb-4">
                Trusted by Content Creators
              </h2>
          </div>

            <div className="grid md:grid-cols-3 gap-8 text-center">
              {[
                { number: "10x", label: "Faster Content Creation" },
                { number: "3+", label: "Platforms Supported" },
                { number: "∞", label: "Content Possibilities" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="text-4xl font-bold text-[#6366f1] mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-300">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-[#181a1f] border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Logo size="md" />
            <div className="mt-4 md:mt-0 text-center text-gray-300">
              <p>&copy; 2024 MorphioAI. Transform your content with AI-powered repurposing.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
