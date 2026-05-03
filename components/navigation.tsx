'use client'

import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { NavigationMenuOverlay } from '@/components/navigation/navigation-menu-overlay'
import { navItems } from '@/components/navigation/nav-config'
import { useMenuAssembleAnimation } from '@/components/navigation/use-menu-assemble-animation'
import { useTransition } from '@/contexts/transition-context'
import { useIsMobile } from '@/hooks/use-mobile'
import { shouldUseFastStart } from '@/lib/performance-mode'

export function Navigation() {
  const pathname = usePathname()
  const [hasMounted, setHasMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [isLeanMotion, setIsLeanMotion] = useState(false)
  const { prefetchRoute } = useTransition()
  const isMobile = useIsMobile()

  useEffect(() => {
    setHasMounted(true)
    setIsLeanMotion(shouldUseFastStart())
  }, [])

  const prefetchMenuRoutes = useCallback(() => {
    navItems.forEach((item) => prefetchRoute(item.href))
    prefetchRoute('/privacy')
  }, [prefetchRoute])

  const {
    assembleProgress,
    closeMenu,
    isAnimating,
    openMenu,
  } = useMenuAssembleAnimation({
    isOpen,
    setIsOpen,
    isMobile,
    onOpen: prefetchMenuRoutes,
  })

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
        aria-controls="site-navigation-menu"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        {/* Rainbow gradient background */}
        <span
          aria-hidden="true"
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
            animation: isMobile || isLeanMotion ? 'none' : 'rainbow-flow 4s linear infinite',
          }}
        />
        
        {/* Hamburger lines with rainbow gradient */}
        <span className="relative w-7 h-5 flex flex-col justify-between" aria-hidden="true">
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
        <NavigationMenuOverlay
          assembleProgress={assembleProgress}
          closeMenu={closeMenu}
          hoveredItem={hoveredItem}
          isMobile={isMobile}
          isLeanMotion={isLeanMotion}
          isOpen={isOpen}
          pathname={pathname}
          setHoveredItem={setHoveredItem}
        />
      )}
    </>
  )
}
