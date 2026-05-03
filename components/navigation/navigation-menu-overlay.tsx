'use client'

import { useMemo, useRef } from 'react'
import { ArrowUpRight, Mail, Phone } from 'lucide-react'
import { TransitionLink } from '@/components/transition-link'
import { ScatterText } from '@/components/scatter-text'
import { clamp01, createScatterValue, seededRandom } from '@/lib/scatter'
import { navItems, rainbowColors } from './nav-config'
import type { NavigationMenuOverlayProps } from '@/types/component-props'

export function NavigationMenuOverlay({
  assembleProgress,
  closeMenu,
  hoveredItem,
  isLeanMotion = false,
  isMobile,
  isOpen,
  pathname,
  setHoveredItem,
}: NavigationMenuOverlayProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLLIElement | null)[]>([])

  // Generate scatter positions for background panels
  const bgPanelScatter = useMemo(() => {
    if (isLeanMotion) return []

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
  }, [isLeanMotion])

  return (
    <div
      id="site-navigation-menu"
      ref={menuRef}
      role="dialog"
      aria-modal={isOpen}
      aria-label="サイトメニュー"
      className={`fixed inset-0 z-40 overflow-hidden transition-opacity duration-500 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden={!isOpen}
      inert={!isOpen ? true : undefined}
    >
      {/* Background fragments that assemble from scattered positions */}
      <div className="absolute inset-0 hidden overflow-visible pointer-events-none md:block">
        {!isLeanMotion && bgPanelScatter.map((panel, i) => {
          const adjustedProgress = clamp01((assembleProgress - panel.delay) / (1 - panel.delay))
          const inverseProgress = 1 - adjustedProgress
          const panelScale = panel.scale ?? 1

          return (
            <div
              aria-hidden="true"
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
        aria-hidden="true"
        className="absolute inset-0 bg-[oklch(0.08_0.02_280)]"
        style={{
          opacity: assembleProgress * 0.85,
        }}
      />

      {/* Floating particles that also assemble */}
      <div className="absolute inset-0 hidden overflow-visible pointer-events-none md:block">
        {!isLeanMotion && [...Array(40)].map((_, i) => {
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
              aria-hidden="true"
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
                ref={(el) => {
                  itemsRef.current[itemIndex] = el
                }}
                className="border-b border-white/10"
                onMouseEnter={() => !isMobile && setHoveredItem(item.href)}
                onMouseLeave={() => !isMobile && setHoveredItem(null)}
              >
                <TransitionLink
                  href={item.href}
                  className={`group flex items-center justify-between py-3 md:py-4 transition-all duration-500 ${
                    pathname === item.href ? 'text-white' : 'text-white'
                  }`}
                  aria-current={pathname === item.href ? 'page' : undefined}
                  onClick={() => closeMenu()}
                >
                  <span className="sr-only">
                    {item.labelJa}ページへ移動
                  </span>
                  {/* Left: Number + Assembling Label */}
                  <div className="flex items-baseline gap-3 md:gap-5">
                    <span
                      aria-hidden="true"
                      className="text-xs font-mono transition-all duration-500"
                      style={{
                        color: rainbowColors[itemIndex % rainbowColors.length],
                        opacity: assembleProgress,
                        transform: `translateX(${(1 - assembleProgress) * -20}px)`,
                      }}
                    >
                      {item.num}
                    </span>

                    {/* Label assembles with Canvas scatter to avoid one DOM node per character. */}
                    <ScatterText
                      as="span"
                      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display uppercase tracking-tight"
                      distance={520}
                      scatterProgress={isMobile || !isOpen ? 0 : 1 - assembleProgress}
                      ariaHidden
                      deferUntilActive
                      style={{
                        transform: isMobile
                          ? 'none'
                          : `translate(${(1 - assembleProgress) * (itemIndex % 2 === 0 ? -120 : 120)}px, ${(1 - assembleProgress) * 40}px) scale(${0.92 + assembleProgress * 0.08})`,
                        opacity: assembleProgress,
                        color: !isMobile && hoveredItem === item.href
                          ? rainbowColors[itemIndex % rainbowColors.length]
                          : 'white',
                        transition: isMobile ? 'none' : 'color 0.3s ease',
                        filter: isMobile || isLeanMotion ? 'none' : `blur(${(1 - assembleProgress) * 8}px)`,
                      }}
                    >
                      {item.label}
                    </ScatterText>
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
                      aria-hidden="true"
                      className={`hidden md:block text-xs transition-all duration-500 ${
                        !isMobile && hoveredItem === item.href
                          ? 'opacity-100 translate-x-0'
                          : 'opacity-0 translate-x-4'
                      }`}
                      style={{ color: rainbowColors[itemIndex % rainbowColors.length] }}
                    >
                      {item.labelJa}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`w-8 h-8 md:w-9 md:h-9 rounded-full border flex items-center justify-center transition-all duration-500 ${
                        !isMobile && hoveredItem === item.href
                          ? 'scale-110'
                          : 'scale-100'
                      }`}
                      style={{
                        borderColor: !isMobile && hoveredItem === item.href
                          ? rainbowColors[itemIndex % rainbowColors.length]
                          : 'rgba(255,255,255,0.2)',
                        backgroundColor: !isMobile && hoveredItem === item.href
                          ? rainbowColors[itemIndex % rainbowColors.length]
                          : 'transparent',
                        color: !isMobile && hoveredItem === item.href ? 'black' : 'white',
                      }}
                    >
                      <ArrowUpRight
                        className={`w-3 h-3 md:w-4 md:h-4 transition-transform duration-500 ${
                          !isMobile && hoveredItem === item.href ? 'rotate-45' : 'rotate-0'
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
              aria-label="電話番号 080-9155-0426"
            >
              <Phone size={14} className="group-hover:text-[hsl(350,65%,72%)] transition-colors" aria-hidden="true" />
              <span className="hidden sm:inline">080-9155-0426</span>
            </a>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Mail size={14} className="text-[hsl(200,60%,72%)]" aria-hidden="true" />
              <span className="hidden sm:inline">hello@junkbranding.com</span>
            </div>
          </div>
          <div className="text-xs text-white/40">
            &copy; 2024 JunkBranding
          </div>
        </div>
      </nav>
    </div>
  )
}
