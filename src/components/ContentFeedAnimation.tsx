"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

const contentSteps = [
  {
    id: 'blog',
    title: 'Blog Post',
    icon: '📝',
    content: 'Long-form article about AI trends...',
    color: 'from-blue-500 to-blue-600',
    width: 'w-80',
    height: 'h-40'
  },
  {
    id: 'tweet',
    title: 'Twitter/X',
    icon: '𝕏',
    content: 'AI is revolutionizing content creation! #AI #ContentMarketing',
    color: 'from-gray-700 to-black',
    width: 'w-64',
    height: 'h-24'
  },
  {
    id: 'instagram',
    title: 'Instagram',
    icon: '📸',
    content: '✨ AI-powered content creation is here! 🚀 Transform your strategy...',
    color: 'from-pink-500 to-purple-600',
    width: 'w-64',
    height: 'h-32'
  },
  {
    id: 'linkedin',
    title: 'LinkedIn',
    icon: '💼',
    content: 'Professional insight: AI content transformation is changing how we...',
    color: 'from-blue-600 to-blue-800',
    width: 'w-72',
    height: 'h-36'
  }
]

export default function ContentFeedAnimation() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep((prev) => (prev + 1) % contentSteps.length)
        setIsAnimating(false)
      }, 500)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const currentContent = contentSteps[currentStep]

  return (
    <div className="relative w-full max-w-md mx-auto h-48 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentContent.id}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className={`relative ${currentContent.width} ${currentContent.height}`}
        >
          {/* Card */}
          <div className={`w-full h-full bg-gradient-to-br ${currentContent.color} rounded-lg shadow-xl p-4 flex flex-col`}>
            {/* Header */}
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-2xl">{currentContent.icon}</span>
              <span className="text-white font-semibold text-sm">
                {currentContent.title}
              </span>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-hidden">
              <p className="text-white text-sm leading-relaxed">
                {currentContent.content}
              </p>
            </div>
            
            {/* Bottom indicator */}
            <div className="mt-2 flex justify-between items-center">
              <div className="flex space-x-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-1 h-1 bg-white/30 rounded-full" />
                ))}
              </div>
              <span className="text-white/70 text-xs">AI Generated</span>
            </div>
          </div>
          
          {/* Transformation indicator */}
          {isAnimating && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-[#6366f1] rounded-full flex items-center justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5, ease: "linear" }}
                className="text-white text-xs"
              >
                ✨
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Step indicator */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {contentSteps.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              index === currentStep ? 'bg-[#6366f1]' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  )
} 