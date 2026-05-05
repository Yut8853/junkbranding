'use client'

import { useRef, useState, type MouseEvent } from 'react'
import Link from 'next/link'
import { useTransition } from '@/contexts/transition-context'
import type { MagneticButtonProps } from '@/types/component-props'

export function MagneticButton({
  children,
  href,
  className = '',
  strength = 0.3,
  onClick,
  'data-cursor': dataCursor,
  type = 'button',
  disabled = false,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const { navigateWithTransition, isTransitioning, prefetchRoute } = useTransition()

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return

    const rect = buttonRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const distanceX = (e.clientX - centerX) * strength
    const distanceY = (e.clientY - centerY) * strength

    setPosition({ x: distanceX, y: distanceY })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.()

    if (
      e.defaultPrevented ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0 ||
      !href?.startsWith('/') ||
      isTransitioning
    ) {
      return
    }

    e.preventDefault()
    navigateWithTransition(href)
  }

  const style = {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
  }

  const baseClassName = `relative inline-flex items-center justify-center transition-transform duration-300 ease-out ${className}`

  if (href) {
    return (
      <Link
        ref={buttonRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={baseClassName}
        style={style}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => href.startsWith('/') && prefetchRoute(href)}
        onFocus={() => href.startsWith('/') && prefetchRoute(href)}
        onClick={handleLinkClick}
        data-cursor={dataCursor}
      >
        {children}
      </Link>
    )
  }

  return (
    <button
      ref={buttonRef as React.RefObject<HTMLButtonElement>}
      className={baseClassName}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      data-cursor={dataCursor}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  )
}


