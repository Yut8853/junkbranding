'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState, type CSSProperties } from 'react'
import { ArrowRight } from 'lucide-react'
import { navItems } from '@/components/navigation/nav-config'
import { TransitionLink } from '@/components/layout/transition-link'
import { useHeaderIntroAnimation } from '@/components/navigation/use-header-intro-animation'
import { useMenuAssembleAnimation } from '@/components/navigation/use-menu-assemble-animation'
import { useTransition } from '@/contexts/transition-context'
import { useIsMobile } from '@/hooks/use-mobile'
import { shouldUseFastStart } from '@/lib/performance-mode'
import { useLoading } from '@/components/loading/loading-provider'

const NavigationMenuOverlay = dynamic(
  () => import('@/components/navigation/navigation-menu-overlay').then((mod) => mod.NavigationMenuOverlay),
  {
    loading: () => null,
    ssr: false,
  },
)

export function Navigation() {
  const pathname = usePathname()
  const [hasMounted, setHasMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [isLeanMotion, setIsLeanMotion] = useState(false)
  const { prefetchRoute } = useTransition()
  const { isLoading } = useLoading()
  const isMobile = useIsMobile()

  useEffect(() => {
    setHasMounted(true)
    setIsLeanMotion(shouldUseFastStart())
  }, [])

  const {
    hasHeaderIntroCompleted,
    showHeaderIntro,
  } = useHeaderIntroAnimation({
    hasMounted,
    isLeanMotion,
    isLoading,
    isMobile,
  })

  const prefetchMenuRoutes = useCallback(() => {
    navItems.forEach((item) => prefetchRoute(item.href))
    prefetchRoute('/privacy')
  }, [prefetchRoute])

  const {
    assembleProgress,
    closeMenu,
    forceCloseMenu,
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

  const shouldRenderMenu = hasMounted && (isOpen || isAnimating || assembleProgress > 0)
  const shouldShowDesktopLinks = hasMounted && !isOpen

  // ページ遷移が確定したら、開いたままのメニューを強制的に閉じる。
  useEffect(() => {
    if (isOpen) {
      forceCloseMenu()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // キーボード操作でもEscapeでメニューを閉じられるようにする。
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeMenu()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeMenu])

  const shouldShowContactPrompt = hasMounted && !showHeaderIntro && pathname !== '/' && pathname !== '/contact'

  return (
    <>
      {shouldShowDesktopLinks && (
        <nav
          className={`fixed right-28 top-8 z-[120] hidden h-16 items-center gap-2 md:right-36 md:top-10 md:flex md:h-20 ${
            showHeaderIntro ? 'global-nav-intro header-link-intro' : 'global-nav-intro'
          }`}
          aria-label="ページリンク"
        >
          {navItems.map((item, index) => (
            <TransitionLink
              key={item.href}
              href={item.href}
              className={`type-label rounded-full px-4 py-2 text-[0.68rem] transition-colors hover:text-foreground ${
                showHeaderIntro ? 'header-link-intro__item' : ''
              } ${
                pathname === item.href ? 'text-foreground' : 'text-muted-foreground'
              }`}
              style={{
                '--intro-index': index,
              } as CSSProperties}
            >
              {item.label}
            </TransitionLink>
          ))}
        </nav>
      )}

      {shouldShowContactPrompt && (
        <TransitionLink
          href="/contact"
          className={`global-nav-contact fixed left-6 top-8 z-[120] inline-flex items-center gap-3 rounded-full border border-white/45 bg-background/80 px-4 py-3 text-xs backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-background md:left-12 md:top-10 md:px-5 md:py-3.5 ${
            isOpen ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
          aria-label="お問い合わせページへ移動"
        >
          <span className="type-label text-[0.65rem] text-muted-foreground md:text-xs">
            Need a website?
          </span>
          <span className="type-cta hidden text-xs gradient-text-soft sm:inline">
            Contact
          </span>
          <ArrowRight className="h-4 w-4 text-foreground/70" aria-hidden="true" />
        </TransitionLink>
      )}

      {/* 虹色へ変化するハンバーガーボタン */}
      <button
        onClick={toggleMenu}
        disabled={isAnimating}
        className="global-nav-toggle header-menu-button fixed top-8 right-8 md:top-10 md:right-12 z-[130] w-16 h-16 md:w-20 md:h-20 flex items-center justify-center group"
        aria-label={isOpen ? 'メニューを閉じる' : 'メニューを開く'}
        aria-controls="site-navigation-menu"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        {/* 虹色グラデーションの背景リング */}
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
              : hasHeaderIntroCompleted
                ? 'linear-gradient(var(--background), var(--background)), linear-gradient(90deg, hsl(350,65%,72%), hsl(30,70%,72%), hsl(60,65%,70%), hsl(150,50%,65%), hsl(200,60%,72%), hsl(280,50%,72%), hsl(350,65%,72%))'
                : 'linear-gradient(var(--background), var(--background)), linear-gradient(var(--foreground), var(--foreground))',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
            backgroundSize: '100% 100%, 300% 100%',
            animation: hasHeaderIntroCompleted && !isMobile && !isLeanMotion ? 'rainbow-flow 4s linear infinite' : 'none',
          }}
        />
        
        {/* 虹色グラデーションのハンバーガー線 */}
        <span className="relative w-7 h-5 flex flex-col justify-between" aria-hidden="true">
          <span
            className={`w-full h-[2px] transition-all duration-500 origin-center ${
              isOpen ? 'rotate-45 translate-y-[9px]' : 'rotate-0 translate-y-0'
            } ${!isOpen && hasHeaderIntroCompleted ? 'animate-rainbow-line' : ''}`}
            style={{
              backgroundImage: isOpen
                ? 'linear-gradient(white, white)'
                : hasHeaderIntroCompleted
                  ? 'linear-gradient(90deg, hsl(350,65%,72%), hsl(60,65%,70%), hsl(200,60%,72%))'
                  : 'linear-gradient(var(--foreground), var(--foreground))',
              backgroundSize: '200% 100%',
            }}
          />
          <span
            className={`w-full h-[2px] transition-all duration-300 ${
              isOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
            } ${!isOpen && hasHeaderIntroCompleted ? 'animate-rainbow-line' : ''}`}
            style={{
              backgroundImage: hasHeaderIntroCompleted
                ? 'linear-gradient(90deg, hsl(60,65%,70%), hsl(150,50%,65%), hsl(280,50%,72%))'
                : 'linear-gradient(var(--foreground), var(--foreground))',
              backgroundSize: '200% 100%',
            }}
          />
          <span
            className={`w-full h-[2px] transition-all duration-500 origin-center ${
              isOpen ? '-rotate-45 -translate-y-[9px]' : 'rotate-0 translate-y-0'
            } ${!isOpen && hasHeaderIntroCompleted ? 'animate-rainbow-line' : ''}`}
            style={{
              backgroundImage: isOpen
                ? 'linear-gradient(white, white)'
                : hasHeaderIntroCompleted
                  ? 'linear-gradient(90deg, hsl(150,50%,65%), hsl(200,60%,72%), hsl(350,65%,72%))'
                  : 'linear-gradient(var(--foreground), var(--foreground))',
              backgroundSize: '200% 100%',
            }}
          />
        </span>
      </button>

      {/* 全画面メニューオーバーレイ */}
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
