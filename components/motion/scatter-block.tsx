'use client'

import { useEffect, useRef, useState, type MouseEvent } from 'react'
import Link from 'next/link'
import { useTransition } from '@/contexts/transition-context'
import { useIsMobile } from '@/hooks/use-mobile'
import type { ScatterBlockProps } from '@/types/component-props'

export function ScatterBlock({
  children,
  className = '',
  href,
  onClick,
}: ScatterBlockProps) {
  const { navigateWithTransition, isTransitioning, prefetchRoute } = useTransition()
  const ref = useRef<HTMLElement>(null)
  const isVisibleRef = useRef(false)
  const [isVisible, setIsVisible] = useState(false)
  const isMobile = useIsMobile()

  // CTAブロックは表示時だけ組み上げ、スクロールで散らばらないようにする。
  useEffect(() => {
    const element = ref.current
    if (!element) return

    if (isMobile) {
      isVisibleRef.current = true
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || isVisibleRef.current) return
        isVisibleRef.current = true
        setIsVisible(true)
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [isMobile])

  // 表示状態に応じた最小限のstyleを返す。
  const getStyles = () => {
    return {
      transform: isMobile || isVisible ? 'translate3d(0,0,0) scale(1)' : 'translate3d(0,24px,0) scale(0.98)',
      opacity: isMobile || isVisible ? 1 : 0,
      transition: isMobile ? 'none' : 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
    }
  }

  const blockStyle = {
    ...getStyles(),
    cursor: href ? 'pointer' : undefined,
  }

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    onClick?.()

    if (!href) return

    if (
      e.defaultPrevented ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0 ||
      !href.startsWith('/') ||
      isTransitioning
    ) {
      return
    }

    e.preventDefault()
    navigateWithTransition(href)
  }

  if (href && href.startsWith('/')) {
    return (
      <Link
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={className}
        style={blockStyle}
        onClick={handleClick}
        onMouseEnter={() => href.startsWith('/') && prefetchRoute(href)}
        onFocus={() => href.startsWith('/') && prefetchRoute(href)}
      >
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={className}
        style={blockStyle}
        onClick={handleClick}
      >
        {children}
      </a>
    )
  }

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      style={blockStyle}
      onClick={handleClick}
    >
      {children}
    </div>
  )
}
