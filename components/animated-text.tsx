'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'

interface AnimatedTextProps {
  text: string
  className?: string
  delay?: number
  stagger?: number
  type?: 'chars' | 'words' | 'lines'
  animation?: 'fadeUp' | 'fadeIn' | 'slideIn' | 'reveal' | 'wave' | 'elastic' | 'glitch'
  tag?: keyof JSX.IntrinsicElements
  duration?: number
  easing?: string
}

export function AnimatedText({
  text,
  className = '',
  delay = 0,
  stagger = 0.03,
  type = 'chars',
  animation = 'fadeUp',
  tag: Tag = 'span',
  duration = 0.8,
  easing = 'cubic-bezier(0.16, 1, 0.3, 1)',
}: AnimatedTextProps) {
  const containerRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const getHiddenStyles = useCallback(() => {
    switch (animation) {
      case 'fadeUp':
        return {
          opacity: 0,
          transform: 'translate3d(0, 120%, 0) rotate(5deg)',
        }
      case 'fadeIn':
        return {
          opacity: 0,
          transform: 'scale(0.8)',
          filter: 'blur(10px)',
        }
      case 'slideIn':
        return {
          opacity: 0,
          transform: 'translate3d(100%, 0, 0) skewX(-10deg)',
        }
      case 'reveal':
        return {
          opacity: 0,
          transform: 'scaleY(0) translate3d(0, 50%, 0)',
          transformOrigin: 'bottom',
        }
      case 'wave':
        return {
          opacity: 0,
          transform: 'translate3d(0, 100%, 0) rotate(10deg)',
        }
      case 'elastic':
        return {
          opacity: 0,
          transform: 'scale(0) rotate(-180deg)',
        }
      case 'glitch':
        return {
          opacity: 0,
          transform: 'translate3d(-20px, 0, 0)',
          filter: 'blur(5px)',
        }
      default:
        return {
          opacity: 0,
          transform: 'translate3d(0, 100%, 0)',
        }
    }
  }, [animation])

  const getVisibleStyles = useCallback(() => {
    return {
      opacity: 1,
      transform: 'translate3d(0, 0, 0) rotate(0deg) scale(1) skewX(0deg) scaleY(1)',
      filter: 'blur(0px)',
      transformOrigin: 'center',
    }
  }, [])

  const getEasing = useCallback(() => {
    switch (animation) {
      case 'elastic':
        return 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
      case 'wave':
        return 'cubic-bezier(0.34, 1.56, 0.64, 1)'
      case 'glitch':
        return 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      default:
        return easing
    }
  }, [animation, easing])

  const elements = useMemo(() => {
    switch (type) {
      case 'words':
        return text.split(' ').map((word, i, arr) => ({
          content: word,
          index: i,
          hasSpace: i < arr.length - 1,
        }))
      case 'lines':
        return text.split('\n').map((line, i) => ({
          content: line,
          index: i,
          hasSpace: false,
        }))
      case 'chars':
      default:
        return text.split('').map((char, i) => ({
          content: char === ' ' ? '\u00A0' : char,
          index: i,
          hasSpace: false,
        }))
    }
  }, [text, type])

  return (
    <Tag
      ref={containerRef as React.RefObject<HTMLSpanElement>}
      className={`inline-block ${className}`}
      aria-label={text}
    >
      {elements.map((item, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <span
            className="inline-block will-change-transform"
            style={{
              ...(isVisible ? getVisibleStyles() : getHiddenStyles()),
              transition: `all ${duration}s ${getEasing()}`,
              transitionDelay: isVisible ? `${delay + item.index * stagger}s` : '0s',
            }}
          >
            {item.content}
          </span>
          {item.hasSpace && <span className="inline-block w-[0.3em]" />}
        </span>
      ))}
    </Tag>
  )
}

interface TextRevealProps {
  children: string
  className?: string
  delay?: number
  duration?: number
  stagger?: number
}

export function TextReveal({ 
  children, 
  className = '', 
  delay = 0,
  duration = 1,
  stagger = 0.02,
}: TextRevealProps) {
  const containerRef = useRef<HTMLSpanElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <span ref={containerRef} className={`inline-block ${className}`} aria-label={children}>
      {children.split('').map((char, i) => (
        <span
          key={i}
          className="inline-block will-change-transform"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible 
              ? 'translate3d(0, 0, 0) rotate(0deg)' 
              : 'translate3d(0, 100%, 0) rotate(10deg)',
            filter: isVisible ? 'blur(0px)' : 'blur(8px)',
            transition: `all ${duration}s cubic-bezier(0.16, 1, 0.3, 1)`,
            transitionDelay: isVisible ? `${delay + i * stagger}s` : '0s',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}

interface TypewriterTextProps {
  text: string
  className?: string
  speed?: number
  delay?: number
  cursor?: boolean
}

export function TypewriterText({
  text,
  className = '',
  speed = 50,
  delay = 0,
  cursor = true,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isStarted, setIsStarted] = useState(false)
  const containerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setIsStarted(true), delay * 1000)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [delay])

  useEffect(() => {
    if (!isStarted) return

    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(interval)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [isStarted, text, speed])

  return (
    <span ref={containerRef} className={className} aria-label={text}>
      {displayedText}
      {cursor && (
        <span 
          className="inline-block w-[2px] h-[1em] bg-current ml-1 align-middle animate-blink"
        />
      )}
    </span>
  )
}

interface ScrambleTextProps {
  text: string
  className?: string
  delay?: number
  duration?: number
}

export function ScrambleText({
  text,
  className = '',
  delay = 0,
  duration = 1.5,
}: ScrambleTextProps) {
  const [displayedText, setDisplayedText] = useState(text.replace(/./g, ' '))
  const [isStarted, setIsStarted] = useState(false)
  const containerRef = useRef<HTMLSpanElement>(null)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setIsStarted(true), delay * 1000)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [delay])

  useEffect(() => {
    if (!isStarted) return

    const iterations = duration * 60
    const charsPerIteration = text.length / iterations
    let frame = 0
    let rafId: number

    const animate = () => {
      frame++
      const progress = frame / iterations
      const revealedChars = Math.floor(progress * text.length)
      
      let result = ''
      for (let i = 0; i < text.length; i++) {
        if (i < revealedChars) {
          result += text[i]
        } else if (text[i] === ' ') {
          result += ' '
        } else {
          result += chars[Math.floor(Math.random() * chars.length)]
        }
      }
      
      setDisplayedText(result)
      
      if (frame < iterations) {
        rafId = requestAnimationFrame(animate)
      } else {
        setDisplayedText(text)
      }
    }

    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [isStarted, text, duration])

  return (
    <span ref={containerRef} className={`font-mono ${className}`} aria-label={text}>
      {displayedText}
    </span>
  )
}
