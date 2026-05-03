'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Phone, Mail, ArrowUpRight } from 'lucide-react'
import { TransitionLink } from '@/components/transition-link'
import { useTransition } from '@/contexts/transition-context'
import { clamp01, createScatterValue, seededRandom } from '@/lib/scatter'

const navItems = [
  { href: '/', label: 'Home', labelJa: 'トップ', num: '01' },
  { href: '/about', label: 'About', labelJa: '私たちについて', num: '02' },
  { href: '/works', label: 'Works', labelJa: '実績', num: '03' },
  { href: '/pricing', label: 'Pricing', labelJa: '料金', num: '04' },
  { href: '/contact', label: 'Contact', labelJa: 'お問い合わせ', num: '05' },
]

// Rainbow colors for menu items
const rainbowColors = [
  'hsl(350, 65%, 72%)',
  'hsl(30, 70%, 72%)',
  'hsl(60, 65%, 70%)',
  'hsl(150, 50%, 65%)',
  'hsl(200, 60%, 72%)',
]

export function Navigation() {
  const pathname = usePathname()
  const [hasMounted, setHasMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [assembleProgress, setAssembleProgress] = useState(0)
  const { prefetchRoute } = useTransition()
  
  const menuRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    setHasMounted(true)
  }, [])

  // Generate scatter positions for each menu item character
  const scatterPositions = useMemo(() => {
    return navItems.map((item, itemIndex) => {
      return item.label.split('').map((_, charIndex) => {
        const seed = itemIndex * 100 + charIndex * 7 + 13
        return createScatterValue({
          seed,
          minDistance: 300,
          distanceRange: 400,
          rotationRange: 540,
          scale: { min: 0.3, range: 0.4 },
        })
      })
    })
  }, [])

  // Generate scatter positions for background panels
  const bgPanelScatter = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const seed = i * 17 + 31
      return {
        ...createScatterValue({
          seed,
          minDistance: 800,
          distanceRange: 600,
          rotationRange: 180,
          scale: { min: 0.2, range: 0.3 },
        }),
        color: rainbowColors[i % rainbowColors.length],
        size: 150 + seededRandom(seed + 6) * 200,
        delay: seededRandom(seed + 7) * 0.3,
      }
    })
  }, [])

  // Animate assembly when menu opens
  useEffect(() => {
    if (!isOpen) {
      setAssembleProgress(0)
      return
    }

    let startTime: number | null = null
    let lastFrameTime = 0
    const duration = 1200 // 1.2 seconds for full assembly

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      if (timestamp - lastFrameTime < 33 && timestamp - startTime < duration) {
        requestAnimationFrame(animate)
        return
      }
      lastFrameTime = timestamp

      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth assembly
      const eased = 1 - Math.pow(1 - progress, 3)
      setAssembleProgress(eased)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    const timeoutId = setTimeout(() => {
      requestAnimationFrame(animate)
    }, 200)

    return () => clearTimeout(timeoutId)
  }, [isOpen])

  const openMenu = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setIsOpen(true)
    navItems.forEach((item) => prefetchRoute(item.href))
    prefetchRoute('/privacy')
    // Disable scroll on both html and body
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    document.documentElement.style.position = 'fixed'
    document.documentElement.style.width = '100%'
    document.documentElement.style.top = `-${window.scrollY}px`
    setTimeout(() => setIsAnimating(false), 1500)
  }, [isAnimating, prefetchRoute])

  const closeMenu = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    
    // Reverse animation - scatter out
    let startTime: number | null = null
    let lastFrameTime = 0
    const duration = 600

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      if (timestamp - lastFrameTime < 33 && timestamp - startTime < duration) {
        requestAnimationFrame(animate)
        return
      }
      lastFrameTime = timestamp

      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = Math.pow(progress, 2)
      
      setAssembleProgress(1 - eased)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        // Restore scroll position
        const scrollY = document.documentElement.style.top
        document.documentElement.style.overflow = ''
        document.body.style.overflow = ''
        document.documentElement.style.position = ''
        document.documentElement.style.width = ''
        document.documentElement.style.top = ''
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
        
        setIsOpen(false)
        setIsAnimating(false)
      }
    }

    requestAnimationFrame(animate)
  }, [isAnimating])

  const toggleMenu = () => {
    if (isOpen) {
      closeMenu()
    } else {
      openMenu()
    }
  }

  const shouldRenderMenu = hasMounted

  // Close on route change
  useEffect(() => {
    if (isOpen) {
      closeMenu()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeMenu()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeMenu])

  return (
    <>
      {/* Rainbow Hamburger Button */}
      <button
        onClick={toggleMenu}
        disabled={isAnimating}
        className="fixed top-8 right-8 md:top-10 md:right-12 z-50 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center group"
        aria-label={isOpen ? 'メニューを閉じる' : 'メニューを開く'}
        aria-expanded={isOpen}
      >
        {/* Rainbow gradient background */}
        <span 
          className={`absolute inset-0 rounded-full transition-all duration-500 ${
            isOpen 
              ? 'bg-white/10 backdrop-blur-md scale-100' 
              : 'bg-background/80 backdrop-blur-sm scale-100 group-hover:scale-110'
          }`}
          style={{
            border: '2px solid transparent',
            backgroundImage: isOpen 
              ? 'linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.1)), linear-gradient(90deg, hsl(350,65%,72%), hsl(30,70%,72%), hsl(60,65%,70%), hsl(150,50%,65%), hsl(200,60%,72%), hsl(280,50%,72%), hsl(350,65%,72%))'
              : 'linear-gradient(var(--background), var(--background)), linear-gradient(90deg, hsl(350,65%,72%), hsl(30,70%,72%), hsl(60,65%,70%), hsl(150,50%,65%), hsl(200,60%,72%), hsl(280,50%,72%), hsl(350,65%,72%))',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
            backgroundSize: '100% 100%, 300% 100%',
            animation: 'rainbow-flow 4s linear infinite',
          }}
        />
        
        {/* Hamburger lines with rainbow gradient */}
        <span className="relative w-7 h-5 flex flex-col justify-between">
          <span 
            className={`w-full h-[2px] transition-all duration-500 origin-center ${
              isOpen ? 'rotate-45 translate-y-[9px]' : 'rotate-0 translate-y-0'
            } ${isOpen ? '' : 'animate-rainbow-line'}`}
            style={{
              backgroundImage: isOpen
                ? 'linear-gradient(white, white)'
                : 'linear-gradient(90deg, hsl(350,65%,72%), hsl(60,65%,70%), hsl(200,60%,72%))',
              backgroundSize: '200% 100%',
            }}
          />
          <span 
            className={`w-full h-[2px] transition-all duration-300 animate-rainbow-line ${
              isOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
            }`}
            style={{
              backgroundImage: 'linear-gradient(90deg, hsl(60,65%,70%), hsl(150,50%,65%), hsl(280,50%,72%))',
              backgroundSize: '200% 100%',
            }}
          />
          <span 
            className={`w-full h-[2px] transition-all duration-500 origin-center ${
              isOpen ? '-rotate-45 -translate-y-[9px]' : 'rotate-0 translate-y-0'
            } ${isOpen ? '' : 'animate-rainbow-line'}`}
            style={{
              backgroundImage: isOpen
                ? 'linear-gradient(white, white)'
                : 'linear-gradient(90deg, hsl(150,50%,65%), hsl(200,60%,72%), hsl(350,65%,72%))',
              backgroundSize: '200% 100%',
            }}
          />
        </span>
      </button>

      {/* Fullscreen Menu Overlay */}
      {shouldRenderMenu && (
      <div
        ref={menuRef}
        className={`fixed inset-0 z-40 overflow-hidden transition-opacity duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!isOpen}
      >
        {/* Background fragments that assemble from scattered positions */}
        <div className="absolute inset-0 overflow-visible pointer-events-none">
          {bgPanelScatter.map((panel, i) => {
            const adjustedProgress = clamp01((assembleProgress - panel.delay) / (1 - panel.delay))
            const inverseProgress = 1 - adjustedProgress
            const panelScale = panel.scale ?? 1
            
            return (
              <div
                key={i}
                className="absolute"
                style={{
                  width: `${80 + (i % 3) * 40}px`,
                  height: `${80 + (i % 3) * 40}px`,
                  left: `${10 + (i % 4) * 22}%`,
                  top: `${10 + Math.floor(i / 4) * 28}%`,
                  backgroundImage: `linear-gradient(135deg, ${panel.color} 0%, ${panel.color}80 100%)`,
                  transform: `translate(${panel.x * inverseProgress}px, ${panel.y * inverseProgress}px) rotate(${panel.rotation * inverseProgress + 45}deg) scale(${panelScale + (1 - panelScale) * adjustedProgress})`,
                  opacity: assembleProgress > 0 ? 0.15 + adjustedProgress * 0.25 : 0,
                  filter: `blur(${inverseProgress * 20 + 10}px)`,
                  borderRadius: '30%',
                }}
              />
            )
          })}
        </div>

        {/* Base dark overlay that fades in */}
        <div 
          className="absolute inset-0 bg-[oklch(0.08_0.02_280)]"
          style={{
            opacity: assembleProgress * 0.85,
          }}
        />

        {/* Floating particles that also assemble */}
        <div className="absolute inset-0 overflow-visible pointer-events-none">
          {[...Array(40)].map((_, i) => {
            const seed = i * 23 + 7
            const scatterX = (seededRandom(seed) - 0.5) * 2000
            const scatterY = (seededRandom(seed + 1) - 0.5) * 2000
            const finalX = seededRandom(seed + 2) * 100
            const finalY = seededRandom(seed + 3) * 100
            const delay = seededRandom(seed + 4) * 0.4
            const adjustedProgress = clamp01((assembleProgress - delay) / (1 - delay))
            const inverseProgress = 1 - adjustedProgress
            const size = 6 + (i % 5) * 8
            
            return (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: rainbowColors[i % rainbowColors.length],
                  left: `${finalX}%`,
                  top: `${finalY}%`,
                  transform: `translate(${scatterX * inverseProgress}px, ${scatterY * inverseProgress}px) scale(${0.2 + 0.8 * adjustedProgress})`,
                  opacity: adjustedProgress * 0.8,
                  filter: `blur(${inverseProgress * 8}px)`,
                  boxShadow: `0 0 ${size * 2}px ${rainbowColors[i % rainbowColors.length]}`,
                }}
              />
            )
          })}
        </div>

        {/* Menu Content */}
        <nav 
          className="relative h-full flex flex-col justify-between px-6 md:px-16 lg:px-24 py-6 md:py-8"
          aria-label="メインナビゲーション"
        >
          {/* Top bar with logo */}
          <div 
            className="shrink-0 transition-all duration-700"
            style={{
              opacity: assembleProgress,
              transform: `translateY(${(1 - assembleProgress) * -40}px)`,
            }}
          >
            <TransitionLink 
              href="/" 
              className="text-xl md:text-2xl font-display uppercase tracking-wide gradient-text-soft"
              onClick={() => isOpen && closeMenu()}
            >
              JunkBranding
            </TransitionLink>
          </div>

          {/* Main navigation items - Characters assemble from scattered positions */}
          <div className="flex-1 flex items-center min-h-0">
            <ul className="w-full max-w-4xl">
              {navItems.map((item, itemIndex) => (
                <li 
                  key={item.href}
                  ref={el => { itemsRef.current[itemIndex] = el }}
                  className="border-b border-white/10"
                  onMouseEnter={() => setHoveredItem(item.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <TransitionLink
                    href={item.href}
                    className={`group flex items-center justify-between py-3 md:py-4 transition-all duration-500 ${
                      pathname === item.href ? 'text-white' : 'text-white'
                    }`}
                    aria-current={pathname === item.href ? 'page' : undefined}
                    onClick={() => closeMenu()}
                  >
                    {/* Left: Number + Assembling Label */}
                    <div className="flex items-baseline gap-3 md:gap-5">
                      <span 
                        className="text-xs font-mono transition-all duration-500"
                        style={{
                          color: rainbowColors[itemIndex % rainbowColors.length],
                          opacity: assembleProgress,
                          transform: `translateX(${(1 - assembleProgress) * -20}px)`,
                        }}
                      >
                        {item.num}
                      </span>
                      
                      {/* Each character assembles from scattered position */}
                      <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display uppercase tracking-tight">
                        {item.label.split('').map((char, charIndex) => {
                          const scatter = scatterPositions[itemIndex]?.[charIndex] || { x: 0, y: 0, rotation: 0, scale: 1 }
                          const charDelay = charIndex * 0.03
                          const adjustedProgress = clamp01((assembleProgress - charDelay) / (1 - charDelay))
                          const inverseAdjusted = 1 - adjustedProgress
                          const scatterScale = scatter.scale ?? 1
                          
                          return (
                            <span
                              key={charIndex}
                              className="inline-block transition-none"
                              style={{
                                transform: `translate(${scatter.x * inverseAdjusted}px, ${scatter.y * inverseAdjusted}px) rotate(${scatter.rotation * inverseAdjusted}deg) scale(${scatterScale + (1 - scatterScale) * adjustedProgress})`,
                                opacity: adjustedProgress,
                                color: hoveredItem === item.href 
                                  ? rainbowColors[(itemIndex + charIndex) % rainbowColors.length]
                                  : 'white',
                                transition: hoveredItem === item.href ? 'color 0.3s ease' : 'color 0.3s ease',
                                filter: `blur(${inverseAdjusted * 8}px)`,
                              }}
                            >
                              {char}
                            </span>
                          )
                        })}
                      </span>
                    </div>

                    {/* Right: Japanese label + Arrow */}
                    <div 
                      className="flex items-center gap-2 md:gap-4 transition-all duration-500"
                      style={{
                        opacity: assembleProgress,
                        transform: `translateX(${(1 - assembleProgress) * 40}px)`,
                      }}
                    >
                      <span 
                        className={`hidden md:block text-xs transition-all duration-500 ${
                          hoveredItem === item.href 
                            ? 'opacity-100 translate-x-0' 
                            : 'opacity-0 translate-x-4'
                        }`}
                        style={{ color: rainbowColors[itemIndex % rainbowColors.length] }}
                      >
                        {item.labelJa}
                      </span>
                      <span 
                        className={`w-8 h-8 md:w-9 md:h-9 rounded-full border flex items-center justify-center transition-all duration-500 ${
                          hoveredItem === item.href 
                            ? 'scale-110' 
                            : 'scale-100'
                        }`}
                        style={{
                          borderColor: hoveredItem === item.href 
                            ? rainbowColors[itemIndex % rainbowColors.length]
                            : 'rgba(255,255,255,0.2)',
                          backgroundColor: hoveredItem === item.href 
                            ? rainbowColors[itemIndex % rainbowColors.length]
                            : 'transparent',
                          color: hoveredItem === item.href ? 'black' : 'white',
                        }}
                      >
                        <ArrowUpRight 
                          className={`w-3 h-3 md:w-4 md:h-4 transition-transform duration-500 ${
                            hoveredItem === item.href ? 'rotate-45' : 'rotate-0'
                          }`}
                        />
                      </span>
                    </div>
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer info */}
          <div 
            className="flex items-center justify-between gap-4 pt-4 border-t border-white/10 shrink-0 transition-all duration-700"
            style={{
              opacity: assembleProgress,
              transform: `translateY(${(1 - assembleProgress) * 40}px)`,
            }}
          >
            <div className="flex items-center gap-6">
              <a 
                href="tel:08091550426" 
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm group"
              >
                <Phone size={14} className="group-hover:text-[hsl(350,65%,72%)] transition-colors" />
                <span className="hidden sm:inline">080-9155-0426</span>
              </a>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Mail size={14} className="text-[hsl(200,60%,72%)]" />
                <span className="hidden sm:inline">hello@junkbranding.com</span>
              </div>
            </div>
            <div className="text-xs text-white/40">
              &copy; 2024 JunkBranding
            </div>
          </div>
        </nav>
      </div>
      )}
    </>
  )
}
