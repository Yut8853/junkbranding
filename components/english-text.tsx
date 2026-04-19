'use client'

import { useRef, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

// Custom useInView hook using IntersectionObserver
function useInView(ref: React.RefObject<Element | null>, options?: { once?: boolean; margin?: string }) {
  const [isInView, setIsInView] = useState(false)
  
  useEffect(() => {
    const element = ref.current
    if (!element) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (options?.once) {
            observer.unobserve(element)
          }
        } else if (!options?.once) {
          setIsInView(false)
        }
      },
      {
        rootMargin: options?.margin || '0px',
        threshold: 0.1,
      }
    )
    
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, options?.once, options?.margin])
  
  return isInView
}

// ビッグタイポグラフィラベル - スクロールで左端に向かって縮小
interface EnglishLabelProps {
  children: string
  className?: string
  delay?: number
  align?: 'left' | 'center'
}

export function EnglishLabel({ children, className, delay = 0, align = 'left' }: EnglishLabelProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-5% 0px' })
  const [hasAnimated, setHasAnimated] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isAnimationComplete, setIsAnimationComplete] = useState(false)
  const delayRef = useRef(delay)

  useEffect(() => {
    if (isInView && !hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true)
      }, delayRef.current * 1000)
      return () => clearTimeout(timer)
    }
  }, [isInView, hasAnimated])

  useEffect(() => {
    if (!hasAnimated || isAnimationComplete) return

    const handleScroll = () => {
      if (!ref.current) return
      
      const rect = ref.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementTop = rect.top
      
      const startShrink = windowHeight * 0.85
      const endShrink = windowHeight * 0.5
      
      if (elementTop < startShrink && elementTop > endShrink) {
        const progress = (startShrink - elementTop) / (startShrink - endShrink)
        setScrollProgress(Math.min(1, Math.max(0, progress)))
      } else if (elementTop <= endShrink) {
        setScrollProgress(1)
        setIsAnimationComplete(true)
        window.removeEventListener('scroll', handleScroll)
      } else {
        setScrollProgress(0)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasAnimated, isAnimationComplete])

  const words = children.split(' ')
  
  const scale = 1 - (scrollProgress * 0.6)
  const opacity = 1 - (scrollProgress * 0.3)

  let letterIndex = 0

  return (
    <div
      ref={ref}
      className={cn(
        'relative overflow-visible will-change-transform',
        align === 'center' ? 'flex justify-center' : '',
        className
      )}
    >
      <span
        className="inline-block whitespace-nowrap"
        aria-label={children}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: align === 'center' ? 'center top' : 'left top',
          opacity: opacity,
          transition: isAnimationComplete ? 'none' : 'transform 0.1s linear, opacity 0.1s linear',
        }}
      >
        {words.map((word, wordIndex) => {
          const wordElement = (
            <span key={wordIndex} className="inline-block">
              {word.split('').map((letter) => {
                const currentIndex = letterIndex++
                return (
                  <span
                    key={currentIndex}
                    className="inline-block overflow-hidden"
                  >
                    <span
                      className="inline-block font-display uppercase text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[14rem] tracking-[-0.03em] font-black text-primary leading-[0.85]"
                      style={{
                        transform: hasAnimated ? 'translateY(0) rotate(0deg)' : 'translateY(120%) rotate(8deg)',
                        opacity: hasAnimated ? 1 : 0,
                        transition: `transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.7s ease-out`,
                        transitionDelay: `${currentIndex * 0.035}s`,
                      }}
                    >
                      {letter}
                    </span>
                  </span>
                )
              })}
              {wordIndex < words.length - 1 && (
                <span className="inline-block w-[0.3em]" />
              )}
            </span>
          )
          return wordElement
        })}
      </span>
    </div>
  )
}

// 大きなサービス見出し用 - スクロールで左端に縮小
interface EnglishHeadingProps {
  children: string
  className?: string
  delay?: number
  outline?: boolean
  align?: 'left' | 'center'
}

export function EnglishHeading({ children, className, delay = 0, outline = true, align = 'left' }: EnglishHeadingProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-5% 0px' })
  const [hasAnimated, setHasAnimated] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isAnimationComplete, setIsAnimationComplete] = useState(false)
  const delayRef = useRef(delay)

  useEffect(() => {
    if (isInView && !hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true)
      }, delayRef.current * 1000)
      return () => clearTimeout(timer)
    }
  }, [isInView, hasAnimated])

  useEffect(() => {
    if (!hasAnimated || isAnimationComplete) return

    const handleScroll = () => {
      if (!ref.current) return
      
      const rect = ref.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementTop = rect.top
      
      const startShrink = windowHeight * 0.85
      const endShrink = windowHeight * 0.5
      
      if (elementTop < startShrink && elementTop > endShrink) {
        const progress = (startShrink - elementTop) / (startShrink - endShrink)
        setScrollProgress(Math.min(1, Math.max(0, progress)))
      } else if (elementTop <= endShrink) {
        setScrollProgress(1)
        setIsAnimationComplete(true)
        window.removeEventListener('scroll', handleScroll)
      } else {
        setScrollProgress(0)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasAnimated, isAnimationComplete])

  const words = children.split(' ')
  const scale = 1 - (scrollProgress * 0.55)
  const opacity = 1 - (scrollProgress * 0.25)

  return (
    <div
      ref={ref}
      className={cn(
        'relative overflow-visible will-change-transform',
        align === 'center' ? 'text-center' : 'text-left',
        className
      )}
      style={{
        transform: `scale(${scale})`,
        transformOrigin: align === 'center' ? 'center top' : 'left top',
        opacity: opacity,
        transition: isAnimationComplete ? 'none' : 'transform 0.1s linear, opacity 0.1s linear',
      }}
    >
      <h3
        className="inline-block whitespace-nowrap"
        aria-label={children}
      >
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className="inline-block">
            {word.split('').map((letter, letterIndex) => (
              <span
                key={letterIndex}
                className="inline-block overflow-hidden"
              >
                <span
                  className={cn(
                    'inline-block font-display uppercase text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[11rem] font-black tracking-[-0.03em] leading-[0.85]',
                    outline && !isAnimationComplete ? 'english-stroke text-foreground/30' : 'text-foreground',
                  )}
                  style={{
                    transform: hasAnimated ? 'translateY(0) rotate(0deg) scale(1)' : 'translateY(110%) rotate(5deg) scale(0.9)',
                    opacity: hasAnimated ? 1 : 0,
                    transition: `transform 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out, color 0.4s ease-out, -webkit-text-stroke 0.4s ease-out, -webkit-text-fill-color 0.4s ease-out`,
                    transitionDelay: `${wordIndex * 0.1 + letterIndex * 0.03}s`,
                  }}
                >
                  {letter}
                </span>
              </span>
            ))}
            {wordIndex < words.length - 1 && (
              <span className="inline-block w-[0.25em]" />
            )}
          </span>
        ))}
      </h3>
    </div>
  )
}

// マーキー用テキスト - 巨大アウトライン
interface EnglishMarqueeTextProps {
  children: string
  className?: string
}

export function EnglishMarqueeText({ children, className }: EnglishMarqueeTextProps) {
  return (
    <span
      className={cn(
        'font-display uppercase text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[12rem] font-black tracking-[-0.03em] leading-none',
        'english-stroke text-foreground/15',
        'transition-all duration-700 hover:text-foreground/30',
        className
      )}
    >
      {children}
    </span>
  )
}

// ワード単位のダイナミックリビール（大きな見出し用）- スクロール縮小対応
interface EnglishWordsProps {
  children: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div'
  variant?: 'display' | 'massive'
  className?: string
  delay?: number
  align?: 'left' | 'center'
}

export function EnglishWords({
  children,
  as: Component = 'div',
  variant = 'display',
  className,
  delay = 0,
  align = 'left',
}: EnglishWordsProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-5% 0px' })
  const [hasAnimated, setHasAnimated] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isAnimationComplete, setIsAnimationComplete] = useState(false)
  const delayRef = useRef(delay)

  useEffect(() => {
    if (isInView && !hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true)
      }, delayRef.current * 1000)
      return () => clearTimeout(timer)
    }
  }, [isInView, hasAnimated])

  useEffect(() => {
    if (!hasAnimated || isAnimationComplete) return

    const handleScroll = () => {
      if (!ref.current) return
      
      const rect = ref.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementTop = rect.top
      
      const startShrink = windowHeight * 0.85
      const endShrink = windowHeight * 0.5
      
      if (elementTop < startShrink && elementTop > endShrink) {
        const progress = (startShrink - elementTop) / (startShrink - endShrink)
        setScrollProgress(Math.min(1, Math.max(0, progress)))
      } else if (elementTop <= endShrink) {
        setScrollProgress(1)
        setIsAnimationComplete(true)
        window.removeEventListener('scroll', handleScroll)
      } else {
        setScrollProgress(0)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasAnimated, isAnimationComplete])

  const words = children.split(' ')
  const scale = 1 - (scrollProgress * 0.55)
  const opacity = 1 - (scrollProgress * 0.25)

  const variantStyles = {
    display: 'text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] tracking-[-0.02em] font-black leading-[0.8]',
    massive: 'text-8xl sm:text-9xl md:text-[12rem] lg:text-[16rem] tracking-[-0.04em] font-black leading-[0.75]',
  }

  return (
    <div
      className="relative overflow-visible will-change-transform"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: align === 'center' ? 'center top' : 'left top',
        opacity: opacity,
        transition: isAnimationComplete ? 'none' : 'transform 0.1s linear, opacity 0.1s linear',
      }}
    >
      <Component
        ref={ref as React.RefObject<HTMLDivElement & HTMLParagraphElement & HTMLHeadingElement & HTMLSpanElement>}
        className={cn(
          'font-display uppercase flex flex-wrap gap-x-[0.2em]',
          align === 'center' ? 'justify-center' : 'justify-start',
          variantStyles[variant],
          className
        )}
        aria-label={children}
      >
        {words.map((word, index) => (
          <span
            key={index}
            className="inline-block overflow-hidden"
          >
            <span
              className="inline-block"
              style={{
                transform: hasAnimated ? 'translateY(0) rotate(0deg) scale(1)' : 'translateY(120%) rotate(6deg) scale(0.8)',
                opacity: hasAnimated ? 1 : 0,
                transition: `transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out`,
                transitionDelay: `${index * 0.12}s`,
              }}
            >
              {word}
            </span>
          </span>
        ))}
      </Component>
    </div>
  )
}

// 文字単位のリビール（高度なアニメーション）
interface EnglishTextProps {
  children: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'
  variant?: 'label' | 'heading' | 'display'
  className?: string
  delay?: number
  stagger?: number
  align?: 'left' | 'center'
}

export function EnglishText({
  children,
  as: Component = 'span',
  variant = 'label',
  className,
  delay = 0,
  stagger = 0.025,
  align = 'left',
}: EnglishTextProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-5% 0px' })
  const [hasAnimated, setHasAnimated] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isAnimationComplete, setIsAnimationComplete] = useState(false)
  const delayRef = useRef(delay)

  useEffect(() => {
    if (isInView && !hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true)
      }, delayRef.current * 1000)
      return () => clearTimeout(timer)
    }
  }, [isInView, hasAnimated])

  useEffect(() => {
    if (!hasAnimated || variant === 'label' || isAnimationComplete) return

    const handleScroll = () => {
      if (!ref.current) return
      
      const rect = ref.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementTop = rect.top
      
      const startShrink = windowHeight * 0.85
      const endShrink = windowHeight * 0.5
      
      if (elementTop < startShrink && elementTop > endShrink) {
        const progress = (startShrink - elementTop) / (startShrink - endShrink)
        setScrollProgress(Math.min(1, Math.max(0, progress)))
      } else if (elementTop <= endShrink) {
        setScrollProgress(1)
        setIsAnimationComplete(true)
        window.removeEventListener('scroll', handleScroll)
      } else {
        setScrollProgress(0)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasAnimated, variant, isAnimationComplete])

  const letters = children.split('')
  const scale = variant === 'label' ? 1 : 1 - (scrollProgress * 0.5)
  const opacity = variant === 'label' ? 1 : 1 - (scrollProgress * 0.25)

  const variantStyles = {
    label: 'text-2xl sm:text-3xl md:text-4xl tracking-[0.15em] font-bold text-primary',
    heading: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-[0.05em] font-bold',
    display: 'text-6xl sm:text-7xl md:text-9xl lg:text-[11rem] tracking-[-0.02em] font-black leading-[0.8]',
  }

  return (
    <div
      className={cn(
        'relative overflow-visible will-change-transform inline-block',
        align === 'center' ? 'text-center' : 'text-left'
      )}
      style={{
        transform: `scale(${scale})`,
        transformOrigin: align === 'center' ? 'center top' : 'left top',
        opacity: opacity,
        transition: isAnimationComplete ? 'none' : 'transform 0.1s linear, opacity 0.1s linear',
      }}
    >
      <Component
        ref={ref as React.RefObject<HTMLParagraphElement & HTMLHeadingElement & HTMLSpanElement>}
        className={cn(
          'font-display uppercase inline-flex flex-wrap',
          variantStyles[variant],
          className
        )}
        aria-label={children}
      >
        {letters.map((letter, index) => (
          <span
            key={index}
            className="inline-block overflow-hidden"
            style={{ lineHeight: 'inherit' }}
          >
            <span
              className="inline-block"
              style={{
                transform: hasAnimated ? 'translateY(0) rotate(0deg)' : 'translateY(130%) rotate(10deg)',
                opacity: hasAnimated ? 1 : 0,
                transition: `transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease-out`,
                transitionDelay: `${index * stagger}s`,
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </span>
          </span>
        ))}
      </Component>
    </div>
  )
}
