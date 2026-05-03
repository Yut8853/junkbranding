'use client'

import type { ReactNode } from 'react'

type HomeAscentSectionProps = {
  children: ReactNode
  label: string
}

export function HomeAscentSection({
  children,
  label,
}: HomeAscentSectionProps) {
  return (
    <div
      className="home-ascent-section"
      data-ascent-label={label}
    >
      {children}
    </div>
  )
}
