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
    if (!hasAnimated) return

    const handleScroll = () => {
      if (!ref.current || isAnimationComplete) return
      
      const rect = ref.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementTop = rect.top
      
      const startShrink = windowHeight * 0.9
      const endShrink = windowHeight * 0.45
      
      if (elementTop < startShrink && elementTop > endShrink) {
        const progress = (startShrink - elementTop) / (startShrink - endShrink)
        setScrollProgress(Math.min(1, Math.max(0, progress)))
      } else if (elementTop <= endShrink) {
        setScrollProgress(1)
        setIsAnimationComplete(true)
      } else {
        setScrollProgress(0)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasAnimated, isAnimationComplete])

  const words = children.split(' ')
  
  // スケール: 1.0 → 0.25 へ縮小（最終サイズは元の25%）
  const scale = isAnimationComplete ? 0.25 : 1 - (scrollProgress * 0.75)
  const opacity = isAnimationComplete ? 0.8 : 1 - (scrollProgress * 0.2)

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
                      className="inline-block font-display uppercase text-[10rem] sm:text-[14rem] md:text-[18rem] lg:text-[22rem] xl:text-[28rem] tracking-[0.02em] font-normal text-primary leading-[0.85]"
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
                <span className="inline-block w-[0.4em]" />
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
    if (!hasAnimated) return

    const handleScroll = () => {
      if (!ref.current || isAnimationComplete) return
      
      const rect = ref.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementTop = rect.top
      
      const startShrink = windowHeight * 0.9
      const endShrink = windowHeight * 0.45
      
      if (elementTop < startShrink && elementTop > endShrink) {
        const progress = (startShrink - elementTop) / (startShrink - endShrink)
        setScrollProgress(Math.min(1, Math.max(0, progress)))
      } else if (elementTop <= endShrink) {
        setScrollProgress(1)
        setIsAnimationComplete(true)
      } else {
        setScrollProgress(0)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasAnimated, isAnimationComplete])

  const words = children.split(' ')
  const scale = isAnimationComplete ? 0.3 : 1 - (scrollProgress * 0.7)
  const opacity = isAnimationComplete ? 0.85 : 1 - (scrollProgress * 0.15)

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
                    'inline-block font-display uppercase text-[8rem] sm:text-[12rem] md:text-[16rem] lg:text-[20rem] xl:text-[24rem] font-normal tracking-[0.02em] leading-[0.85]',
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
              <span className="inline-block w-[0.4em]" />
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
        'font-display uppercase text-[12rem] sm:text-[16rem] md:text-[20rem] lg:text-[26rem] xl:text-[32rem] font-normal tracking-[0.02em] leading-none',
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
    if (!hasAnimated) return

    const handleScroll = () => {
      if (!ref.current || isAnimationComplete) return
      
      const rect = ref.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementTop = rect.top
      
      const startShrink = windowHeight * 0.9
      const endShrink = windowHeight * 0.45
      
      if (elementTop < startShrink && elementTop > endShrink) {
        const progress = (startShrink - elementTop) / (startShrink - endShrink)
        setScrollProgress(Math.min(1, Math.max(0, progress)))
      } else if (elementTop <= endShrink) {
        setScrollProgress(1)
        setIsAnimationComplete(true)
      } else {
        setScrollProgress(0)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasAnimated, isAnimationComplete])

  const words = children.split(' ')
  const scale = isAnimationComplete ? 0.3 : 1 - (scrollProgress * 0.7)
  const opacity = isAnimationComplete ? 0.85 : 1 - (scrollProgress * 0.15)

  const variantStyles = {
    display: 'text-[10rem] sm:text-[14rem] md:text-[18rem] lg:text-[22rem] tracking-[0.02em] font-normal leading-[0.8]',
    massive: 'text-[14rem] sm:text-[18rem] md:text-[24rem] lg:text-[32rem] tracking-[0.02em] font-normal leading-[0.75]',
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
    if (!hasAnimated || variant === 'label') return

    const handleScroll = () => {
      if (!ref.current || isAnimationComplete) return
      
      const rect = ref.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementTop = rect.top
      
      const startShrink = windowHeight * 0.9
      const endShrink = windowHeight * 0.45
      
      if (elementTop < startShrink && elementTop > endShrink) {
        const progress = (startShrink - elementTop) / (startShrink - endShrink)
        setScrollProgress(Math.min(1, Math.max(0, progress)))
      } else if (elementTop <= endShrink) {
        setScrollProgress(1)
        setIsAnimationComplete(true)
      } else {
        setScrollProgress(0)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasAnimated, variant, isAnimationComplete])

  const letters = children.split('')
  const scale = variant === 'label' ? 1 : (isAnimationComplete ? 0.3 : 1 - (scrollProgress * 0.7))
  const opacity = variant === 'label' ? 1 : (isAnimationComplete ? 0.85 : 1 - (scrollProgress * 0.15))

  const variantStyles = {
    label: 'text-4xl sm:text-5xl md:text-6xl tracking-[0.1em] font-normal text-primary',
    heading: 'text-6xl sm:text-8xl md:text-[10rem] lg:text-[14rem] tracking-[0.02em] font-normal',
    display: 'text-[10rem] sm:text-[14rem] md:text-[18rem] lg:text-[22rem] tracking-[0.02em] font-normal leading-[0.8]',
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
