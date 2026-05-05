'use client'

import type { HomeAscentSectionProps } from '@/types/home-page'

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
