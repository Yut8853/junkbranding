'use client'

import { useRef, useEffect, useState, ReactNode, createElement } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// 1文字ずつふわっと浮かび上がるテキストアニメーション
interface TextRevealProps {
  children?: string
  text?: string
  className?: string
  delay?: number
  stagger?: number
  duration?: number
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'
  once?: boolean
  gradient?: boolean // 「カタチに。」と同じグラデーションを適用
}

export function TextReveal({
  children,
  text,
  className = '',
  delay = 0,
  stagger = 0.03,
  duration = 0.8,
  as: Tag = 'div',
  once = true,
  gradient = false,
}: TextRevealProps) {
  const containerRef = useRef<HTMLElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!containerRef.current) return

    const chars = containerRef.current.querySelectorAll('.char')
    
    if (chars.length === 0) return
    
    gsap.set(chars, {
      opacity: 0,
      y: 40,
      filter: 'blur(8px)',
    })

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top bottom-=50',
      onEnter: () => {
        if (once && hasAnimated.current) return
        hasAnimated.current = true
        
        gsap.to(chars, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: duration,
          stagger: stagger,
          delay: delay,
          ease: 'power3.out',
        })
      },
      onLeaveBack: () => {
        if (!once) {
          gsap.set(chars, {
            opacity: 0,
            y: 40,
            filter: 'blur(8px)',
          })
          hasAnimated.current = false
        }
      },
    })

    return () => {
      trigger.kill()
    }
  }, [delay, stagger, duration, once])

  // 文字を1文字ずつspan要素に分割（改行も保持）
  const displayText = text || children || ''
  const splitText = displayText.split('').map((char, i) => {
    if (char === '\n') {
      return <br key={i} />
    }
    return (
      <span
        key={i}
        className={`char inline-block ${gradient ? 'gradient-text-char animate-gradient-flow' : ''}`}
        style={{ 
          willChange: 'transform, opacity, filter',
          whiteSpace: char === ' ' ? 'pre' : 'normal',
          ['--char-delay' as string]: gradient ? `${i * 0.08}s` : undefined,
        }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    )
  })

  return createElement(Tag, { ref: containerRef, className }, splitText)
}

// セクション全体のふわっとしたフェードイン（統一感のある動き）
interface SectionRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  y?: number
  once?: boolean
}

export function SectionReveal({
  children,
  className = '',
  delay = 0,
  duration = 1,
  y = 60,
  once = true,
}: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (once && hasAnimated.current) return
          hasAnimated.current = true
          setIsVisible(true)

          if (once) {
            observer.disconnect()
          }
          return
        }

        if (!once) {
          hasAnimated.current = false
          setIsVisible(false)
        }
      },
      { rootMargin: '0px 0px -50px 0px' }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [once])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate3d(0,0,0)' : `translate3d(0,${y}px,0)`,
        transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

// 単語単位でふわっと出るアニメーション
interface WordRevealProps {
  children: string
  className?: string
  delay?: number
  stagger?: number
  duration?: number
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'
  once?: boolean
}

export function WordReveal({
  children,
  className = '',
  delay = 0,
  stagger = 0.08,
  duration = 0.9,
  as: Tag = 'div',
  once = true,
}: WordRevealProps) {
  const containerRef = useRef<HTMLElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!containerRef.current) return

    const words = containerRef.current.querySelectorAll('.word')
    
    if (words.length === 0) return
    
    gsap.set(words, {
      opacity: 0,
      y: 30,
      filter: 'blur(6px)',
    })

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top bottom-=50',
      onEnter: () => {
        if (once && hasAnimated.current) return
        hasAnimated.current = true
        
        gsap.to(words, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: duration,
          stagger: stagger,
          delay: delay,
          ease: 'power3.out',
        })
      },
      onLeaveBack: () => {
        if (!once) {
          gsap.set(words, {
            opacity: 0,
            y: 30,
            filter: 'blur(6px)',
          })
          hasAnimated.current = false
        }
      },
    })

    return () => {
      trigger.kill()
    }
  }, [delay, stagger, duration, once])

  // 単語に分割
  const text = children || ''
  const splitWords = text.split(' ').map((word, i) => (
    <span
      key={i}
      className="word inline-block mr-[0.25em]"
      style={{ willChange: 'transform, opacity, filter' }}
    >
      {word}
    </span>
  ))

  return createElement(Tag, { ref: containerRef, className }, splitWords)
}

// 行ごとにふわっと出るアニメーション
interface LineRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  stagger?: number
  duration?: number
  once?: boolean
}

export function LineReveal({
  children,
  className = '',
  delay = 0,
  stagger = 0.15,
  duration = 0.9,
  once = true,
}: LineRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!containerRef.current) return

    const lines = containerRef.current.querySelectorAll('.line')
    
    if (lines.length === 0) return
    
    gsap.set(lines, {
      opacity: 0,
      y: 40,
      filter: 'blur(6px)',
    })

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top bottom-=50',
      onEnter: () => {
        if (once && hasAnimated.current) return
        hasAnimated.current = true
        
        gsap.to(lines, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: duration,
          stagger: stagger,
          delay: delay,
          ease: 'power3.out',
        })
      },
      onLeaveBack: () => {
        if (!once) {
          gsap.set(lines, {
            opacity: 0,
            y: 40,
            filter: 'blur(6px)',
          })
          hasAnimated.current = false
        }
      },
    })

    return () => {
      trigger.kill()
    }
  }, [delay, stagger, duration, once])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}
