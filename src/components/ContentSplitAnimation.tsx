"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Lottie from 'lottie-react'
import InstaIcon from '@/assets/ig-icon.json'
import XIcon from '@/assets/x-icon.json'
import LinkedInIcon from '@/assets/linkedin-icon.json'

const ICON_RADIUS = 210 // Increased for more separation
const ICON_SIZE = 120
const CARD_WIDTH = 96
const CARD_HEIGHT = 48

const platformData = [
  {
    id: 'twitter',
    name: 'X',
    lottie: XIcon,
    color: '#000000',
    glow: 'shadow-[0_0_48px_0_rgba(0,0,0,0.5)]',
    orbit: { r: ICON_RADIUS, angle: -90 }, // Top
    floatDelay: 0
  },
  {
    id: 'instagram',
    name: 'Instagram',
    lottie: InstaIcon,
    color: '#E4405F',
    glow: 'shadow-[0_0_48px_0_rgba(228,64,95,0.5)]',
    orbit: { r: ICON_RADIUS, angle: 30 }, // Bottom right
    floatDelay: 0.2
  },
  {
    id: 'linkedin',
    name: 'LinkedIn', 
    lottie: LinkedInIcon,
    color: '#0077B5',
    glow: 'shadow-[0_0_48px_0_rgba(0,119,181,0.5)]',
    orbit: { r: ICON_RADIUS, angle: 150 }, // Bottom left
    floatDelay: 0.4
  }
]

function polarToXY(r: number, angle: number) {
  const rad = (angle * Math.PI) / 180
  return { x: r * Math.cos(rad), y: r * Math.sin(rad) }
}

export default function ContentSplitAnimation() {
  const [animationState, setAnimationState] = useState<'initial' | 'orbit' | 'settle' | 'reset'>('initial')

  useEffect(() => {
    const sequence = async () => {
      setAnimationState('initial')
      await new Promise(res => setTimeout(res, 1200))
      setAnimationState('orbit')
      await new Promise(res => setTimeout(res, 1200))
      setAnimationState('settle')
      await new Promise(res => setTimeout(res, 2000))
      setAnimationState('reset')
      await new Promise(res => setTimeout(res, 600))
      setAnimationState('initial')
    }
    sequence()
    const interval = setInterval(sequence, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-[520px] flex items-center justify-center perspective-1000">
      {/* Animated shimmer/particle background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#181a1f] to-[#0e1014] animate-background-shimmer rounded-2xl opacity-80" style={{filter:'blur(8px)'}} />
        {/* Subtle particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: 10 + Math.random() * 16,
              height: 10 + Math.random() * 16,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(2px)'
            }}
            animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 6 + Math.random() * 4, delay: i * 0.3 }}
          />
        ))}
      </div>

      {/* Central Glassmorphism Content Card (only show in 'initial' and 'reset') */}
      {(animationState === 'initial' || animationState === 'reset') && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotateY: -10 }}
          animate={{
            scale: 1,
            opacity: 1,
            y: [0, -12, 0],
            rotateY: [-5, 5, -5],
            rotateX: [2, -2, 2]
          }}
          transition={{
            y: { repeat: Infinity, duration: 3, ease: [0.45, 0, 0.55, 1] },
            rotateY: { repeat: Infinity, duration: 4, ease: [0.45, 0, 0.55, 1] },
            rotateX: { repeat: Infinity, duration: 3.5, ease: [0.45, 0, 0.55, 1] },
            scale: { duration: 0.4 },
            opacity: { duration: 0.4 }
          }}
          style={{
            transformStyle: 'preserve-3d',
          }}
          className="absolute z-10"
        >
          <div className="relative flex flex-col items-center justify-center w-[384px] h-[192px]">
            {/* Glassmorphism effect */}
            <div className="absolute inset-0 rounded-xl bg-white/10 backdrop-blur-md shadow-2xl border border-white/10" style={{boxShadow: '0 8px 48px 0 rgba(99,102,241,0.18), 0 1.5px 8px 0 rgba(225,29,72,0.12)'}} />
            <div className="absolute inset-0 rounded-xl pointer-events-none" style={{boxShadow: '0 0 48px 12px rgba(99,102,241,0.18) inset'}} />
            <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
              <span className="text-5xl font-bold text-white/90 drop-shadow-lg mb-2 tracking-wide">Content</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Platform Lottie Icons - No Cards */}
      {platformData.map((platform, idx) => {
        // Calculate orbit position
        let pos = { x: 0, y: 0 }
        if (animationState === 'orbit' || animationState === 'settle') {
          pos = polarToXY(platform.orbit.r, platform.orbit.angle)
        }
        // Animate float/wobble - combine base position with float offset
        const floatAnim = animationState === 'settle'
          ? { 
              rotateZ: [0, 5, -5, 0], 
              y: [pos.y, pos.y - 18, pos.y, pos.y + 18, pos.y] 
            }
          : { rotateZ: 0 }
        return (
          <motion.div
            key={platform.id}
            initial={{
              scale: 0.2,
              opacity: 0,
              x: 0,
              y: 0
            }}
            animate={{
              scale: animationState === 'orbit' || animationState === 'settle' ? 1 : 0.2,
              opacity: animationState === 'orbit' || animationState === 'settle' ? 1 : 0,
              x: pos.x,
              y: animationState === 'settle' ? undefined : pos.y,
              ...floatAnim
            }}
            transition={{
              duration: 0.9,
              delay: animationState === 'orbit' || animationState === 'settle' ? idx * 0.12 : 0,
              ease: [0.45, 0, 0.55, 1]
            }}
            style={{
              width: ICON_SIZE,
              height: ICON_SIZE,
              minWidth: 90,
              minHeight: 90,
              filter: `drop-shadow(0 0 32px ${platform.color}80)`
            }}
            className={`absolute z-20 flex items-center justify-center ${platform.glow}`}
          >
            <Lottie animationData={platform.lottie} loop={animationState === 'settle'} style={{ width: '100%', height: '100%' }} />
            {/* Sparkles */}
            {animationState === 'settle' && [0,1].map(sparkIdx => (
              <motion.div
                key={sparkIdx}
                animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: idx * 0.5 + sparkIdx * 0.7 }}
                className="absolute w-3 h-3 bg-pink-400 rounded-full blur-sm left-1/2 top-1/2"
                style={{
                  left: `${50 + (sparkIdx === 0 ? 30 : -30)}%`,
                  top: `${sparkIdx === 0 ? 10 : 80}%`,
                  zIndex: 30
                }}
              />
            ))}
          </motion.div>
        )
      })}

      {/* Progress Indicator */}
      <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          {['initial', 'orbit', 'settle'].map((state, index) => (
            <div
              key={state}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                ['initial', 'orbit', 'settle'].indexOf(animationState) >= index
                  ? 'bg-[#6366f1] scale-110'
                  : 'bg-gray-600 scale-90'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
} 