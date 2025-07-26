'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion'
import {
  SparklesIcon,
  PlayIcon,
  RectangleStackIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  LanguageIcon,
  CurrencyDollarIcon,
  SwatchIcon,
  MusicalNoteIcon,
  AdjustmentsVerticalIcon,
  CloudArrowUpIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'

const navigationItems = [
  { 
    name: 'Studio Home', 
    href: '/', 
    icon: SparklesIcon,
    gradient: 'from-purple-500 to-pink-500',
    description: 'Your creative dashboard'
  },
  { 
    name: 'Content Library', 
    href: '/content', 
    icon: PlayIcon,
    gradient: 'from-blue-500 to-cyan-500',
    description: 'Manage your videos'
  },
  { 
    name: 'Playlists', 
    href: '/playlists', 
    icon: RectangleStackIcon,
    gradient: 'from-green-500 to-emerald-500',
    description: 'Organize content'
  },
  { 
    name: 'Analytics', 
    href: '/analytics', 
    icon: ChartBarIcon,
    gradient: 'from-orange-500 to-red-500',
    description: 'Performance insights'
  },
  { 
    name: 'Comments', 
    href: '/comments', 
    icon: ChatBubbleLeftRightIcon,
    gradient: 'from-teal-500 to-blue-500',
    description: 'Community engagement'
  },
  { 
    name: 'Subtitles', 
    href: '/subtitles', 
    icon: LanguageIcon,
    gradient: 'from-indigo-500 to-purple-500',
    description: 'Accessibility & translation'
  },
  { 
    name: 'Monetization', 
    href: '/monetization', 
    icon: CurrencyDollarIcon,
    gradient: 'from-yellow-500 to-orange-500',
    description: 'Earnings & revenue'
  },
  { 
    name: 'Customization', 
    href: '/customization', 
    icon: SwatchIcon,
    gradient: 'from-pink-500 to-rose-500',
    description: 'Brand & appearance'
  },
  { 
    name: 'Audio Library', 
    href: '/audio-library', 
    icon: MusicalNoteIcon,
    gradient: 'from-violet-500 to-purple-500',
    description: 'Music & sound effects'
  },
  { 
    name: 'Settings', 
    href: '/settings', 
    icon: AdjustmentsVerticalIcon,
    gradient: 'from-gray-500 to-gray-600',
    description: 'Account & preferences'
  },
]

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [timeOfDay, setTimeOfDay] = useState('')
  const pathname = usePathname()
  const navRef = useRef<HTMLDivElement>(null)
  const controls = useAnimationControls()

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setTimeOfDay('morning')
    else if (hour < 17) setTimeOfDay('afternoon')
    else setTimeOfDay('evening')
  }, [])

  // Floating animation for logo
  const floatingAnimation = {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }

  // Organic blob background patterns
  const blobVariants = {
    animate: {
      scale: [1, 1.1, 1],
      rotate: [0, 5, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 text-white overflow-hidden font-afacad relative">
      {/* Organic Background Elements */}
      <motion.div 
        variants={blobVariants}
        animate="animate"
        className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-xl"
      />
      <motion.div 
        variants={blobVariants}
        animate="animate"
        style={{ animationDelay: '2s' }}
        className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-xl"
      />
      
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        transition={{ 
          duration: 0.4, 
          ease: [0.23, 1, 0.32, 1] // Custom spring curve
        }}
        className="relative flex flex-col backdrop-blur-xl bg-white/5 border-r border-white/10"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        }}
      >
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        
        {/* Logo/Brand */}
        <div className="relative h-20 px-6 flex items-center border-b border-white/10">
          <div className="flex items-center gap-4">
            <motion.div 
              animate={floatingAnimation}
              className="relative"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center shadow-2xl">
                <motion.span 
                  className="text-lg font-bold text-white"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  F
                </motion.span>
              </div>
              {/* Shine effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
            
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                    Fabl Studio
                  </h1>
                  <p className="text-sm text-white/60 font-medium">
                    Good {timeOfDay}, creator ✨
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Toggle Button */}
          <motion.button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto p-2 rounded-xl hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {sidebarOpen ? (
              <XMarkIcon className="w-5 h-5 text-white/70" />
            ) : (
              <Bars3Icon className="w-5 h-5 text-white/70" />
            )}
          </motion.button>
        </div>

        {/* Quick Stats (Only when expanded) */}
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="px-6 py-4 border-b border-white/10"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl p-3 border border-green-500/30">
                <p className="text-xs text-green-300 font-medium">Views Today</p>
                <p className="text-lg font-bold text-white">2.4K</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl p-3 border border-blue-500/30">
                <p className="text-xs text-blue-300 font-medium">Revenue</p>
                <p className="text-lg font-bold text-white">$89</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-6 overflow-y-auto">
          <div ref={navRef} className="space-y-2 px-4">
            {navigationItems.map((item, index) => {
              const isActive = pathname === item.href
              const isHovered = hoveredItem === item.name
              
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                  }}
                >
                  <Link
                    href={item.href}
                    className="block group"
                    onMouseEnter={() => setHoveredItem(item.name)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <motion.div
                      className={`
                        relative flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300
                        ${isActive
                          ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-500/50 shadow-lg shadow-purple-500/25'
                          : 'hover:bg-white/10 hover:border-white/20 border border-transparent'
                        }
                      `}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Gradient background for active state */}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl"
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                      
                      {/* Icon with gradient */}
                      <motion.div
                        className={`
                          relative z-10 p-2 rounded-xl
                          ${isActive || isHovered 
                            ? `bg-gradient-to-br ${item.gradient}` 
                            : 'bg-white/10'
                          }
                        `}
                        animate={{
                          rotate: isHovered ? [0, -3, 3, 0] : 0,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <item.icon className="w-5 h-5 text-white" />
                      </motion.div>
                      
                      <AnimatePresence>
                        {sidebarOpen && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="flex-1 relative z-10"
                          >
                            <p className={`
                              text-sm font-semibold transition-colors
                              ${isActive ? 'text-white' : 'text-white/80 group-hover:text-white'}
                            `}>
                              {item.name}
                            </p>
                            <p className="text-xs text-white/50 font-medium">
                              {item.description}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {/* Active indicator */}
                      {isActive && sidebarOpen && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-2 h-2 bg-white rounded-full relative z-10"
                        />
                      )}
                    </motion.div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </nav>

        {/* Upload Button */}
        <div className="px-4 pb-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/upload"
              className="relative overflow-hidden flex items-center justify-center gap-3 w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-2xl text-sm font-bold transition-all duration-300 shadow-xl shadow-purple-500/25"
            >
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 hover:opacity-100 transition-opacity duration-300"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              <CloudArrowUpIcon className="w-5 h-5 relative z-10" />
              {sidebarOpen && (
                <span className="relative z-10">Create Content</span>
              )}
              
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 3
                }}
              />
            </Link>
          </motion.div>
        </div>
        
        {/* Channel Info */}
        <div className="px-4 py-4 border-t border-white/10">
          <motion.div 
            className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                <span className="text-sm font-bold text-white">A</span>
              </div>
              {/* Online indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-950" />
            </div>
            
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-sm font-semibold text-white truncate">Alex Creator</p>
                  <p className="text-xs text-white/60 truncate">@alexcreates • 142K followers</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Top bar with glassmorphism */}
        <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/5 border-b border-white/10">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center gap-4">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
              >
                <input
                  type="text"
                  placeholder="Search your content..."
                  className="w-80 px-4 py-2 pl-10 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500/50 focus:bg-white/15 transition-all"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              </motion.div>
            </div>
            
            <div className="flex items-center gap-3">
              <motion.button
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <BellIcon className="w-5 h-5 text-white/70" />
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Content area */}
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  )
}