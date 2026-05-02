'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'

// Custom useInView hook
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

/**
 * 統一された英語テキストアニメーション
 * - 出現: 各文字が下から回転しながらフェードイン
 * - スタイル: ストローク→塗りへの変化（オプション）
 * - 色変化: ホバーやスクロールで色が変化
 */

interface UnifiedEnglishTextProps {
  children: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div'
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero'
  className?: string
  delay?: number
  stagger?: number
  strokeToFill?: boolean
  isActive?: boolean
  activeColor?: string
  align?: 'left' | 'center' | 'right'
  isLink?: boolean
}

export function UnifiedEnglishText({
  children,
  as: Component = 'span',
  size = 'md',
  className,
  delay = 0,
  stagger = 0.03,
  strokeToFill = true,
  isActive = false,
  activeColor,
  align = 'left',
  isLink = false,
}: UnifiedEnglishTextProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '0px 0px -50px 0px' })
  const [hasAnimated, setHasAnimated] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (isInView && !hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true)
      }, delay * 1000)
      return () => clearTimeout(timer)
    }
  }, [isInView, hasAnimated, delay])

  const letters = children.split('')
  const showFilled = isActive || isHovered

  const sizeStyles = {
    sm: 'text-xl sm:text-2xl md:text-3xl tracking-[0.08em]',
    md: 'text-3xl sm:text-4xl md:text-5xl tracking-[0.04em]',
    lg: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-[0.02em]',
    xl: 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.02em]',
    hero: 'text-[12vw] md:text-[14vw] lg:text-[16vw] tracking-[-0.02em] leading-[0.85]',
  }

  const alignStyles = {
    left: 'justify-start text-left',
    center: 'justify-center text-center',
    right: 'justify-end text-right',
  }

  return (
    <Component
      ref={ref as React.RefObject<HTMLDivElement & HTMLParagraphElement & HTMLHeadingElement & HTMLSpanElement>}
      className={cn(
        'font-display uppercase inline-flex flex-wrap',
        sizeStyles[size],
        alignStyles[align],
        isLink && 'cursor-pointer',
        className
      )}
      onMouseEnter={() => isLink && setIsHovered(true)}
      onMouseLeave={() => isLink && setIsHovered(false)}
      aria-label={children}
    >
      {letters.map((letter, index) => (
        <span
          key={index}
          className="inline-block overflow-hidden"
          style={{ lineHeight: 'inherit' }}
        >
          <span
            className="inline-block will-change-transform"
            style={{
              // 出現アニメーション
              transform: hasAnimated 
                ? 'translateY(0) rotate(0deg)' 
                : 'translateY(110%) rotate(8deg)',
              opacity: hasAnimated ? 1 : 0,
              // ストローク→塗り変化
              WebkitTextStroke: strokeToFill && !showFilled ? '1.5px currentColor' : '0px',
              WebkitTextFillColor: strokeToFill && !showFilled ? 'transparent' : 'currentColor',
              color: showFilled && activeColor ? activeColor : 'inherit',
              // トランジション
              transition: `
                transform 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                opacity 0.6s ease-out,
                -webkit-text-stroke 0.4s ease,
                -webkit-text-fill-color 0.4s ease,
                color 0.4s ease
              `,
              transitionDelay: `${index * stagger}s`,
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </span>
        </span>
      ))}
    </Component>
  )
}

/**
 * セクションタイトル用（大きなストロークテキスト）
 */
interface SectionTitleProps {
  children: string
  subtitle?: string
  className?: string
  delay?: number
}

export function SectionTitle({ children, subtitle, className, delay = 0 }: SectionTitleProps) {
  return (
    <div className={cn('mb-8 md:mb-12', className)}>
      <UnifiedEnglishText
        as="span"
        size="xl"
        delay={delay}
        strokeToFill={true}
        isActive={false}
        className="block text-foreground/60"
      >
        {children}
      </UnifiedEnglishText>
      {subtitle && (
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight gradient-text-animated mt-4">
          {subtitle}
        </h2>
      )}
    </div>
  )
}

/**
 * マーキー用テキスト（ホバーで塗りに変化）
 */
interface MarqueeTextProps {
  children: string
  isHovered?: boolean
  className?: string
}

export function MarqueeText({ children, isHovered = false, className }: MarqueeTextProps) {
  const letters = children.split('')

  return (
    <span
      className={cn(
        'font-display uppercase inline-flex text-4xl md:text-6xl lg:text-7xl xl:text-8xl tracking-wide',
        className
      )}
      aria-label={children}
    >
      {letters.map((letter, index) => (
        <span
          key={index}
          className="inline-block"
          style={{
            WebkitTextStroke: isHovered ? '0px' : '1.5px var(--foreground)',
            WebkitTextFillColor: isHovered ? 'var(--foreground)' : 'transparent',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            transition: `
              -webkit-text-stroke 0.4s ease,
              -webkit-text-fill-color 0.4s ease,
              transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)
            `,
            transitionDelay: `${index * 0.02}s`,
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </span>
      ))}
    </span>
  )
}

/**
 * サービスカード用タイトル（アクティブ時に塗り + 色変化）
 */
interface ServiceTitleProps {
  children: string
  isActive?: boolean
  activeColor?: string
  className?: string
}

export function ServiceTitle({ children, isActive = false, activeColor, className }: ServiceTitleProps) {
  const letters = children.split('')

  return (
    <h3
      className={cn(
        'font-display uppercase inline-flex text-4xl md:text-5xl lg:text-6xl tracking-wide leading-none',
        className
      )}
      aria-label={children}
    >
      {letters.map((letter, index) => (
        <span
          key={index}
          className="inline-block"
          style={{
            WebkitTextStroke: isActive ? '0px' : '1.5px currentColor',
            WebkitTextFillColor: isActive ? 'currentColor' : 'transparent',
            color: isActive && activeColor ? activeColor : 'var(--foreground)',
            transition: `
              -webkit-text-stroke 0.5s cubic-bezier(0.16, 1, 0.3, 1),
              -webkit-text-fill-color 0.5s cubic-bezier(0.16, 1, 0.3, 1),
              color 0.5s ease
            `,
            transitionDelay: `${index * 0.015}s`,
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </span>
      ))}
    </h3>
  )
}
