'use client'

import { useRef, useState } from 'react'
import { ScatterText } from '@/components/motion/scatter-text'
import { SectionReveal } from '@/components/motion/text-reveal'
import { usePointerTilt } from '@/hooks/use-pointer-tilt'
import type { PricingServiceCardProps } from '@/types/pricing-page'

export function ServiceCard({ service, index }: PricingServiceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  usePointerTilt(cardRef)

  return (
    <SectionReveal delay={index * 0.1} duration={0.8}>
      <div
        ref={cardRef}
        className={`relative p-8 lg:p-10 rounded-3xl glass-card rainbow-border transition-all duration-300 cursor-pointer ${
          isHovered ? 'shadow-[0_30px_80px_rgba(0,0,0,0.08)]' : ''
        }`}
        style={{ transformStyle: 'preserve-3d' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <ScatterText
          as="span"
          className="absolute top-6 right-6 type-display text-5xl text-foreground/[0.05]"
          scrollStart={50}
          scrollEnd={350}
          distance={160}
        >
          {String(index + 1).padStart(2, '0')}
        </ScatterText>

        <ScatterText
          as="h3"
          className="type-card-title text-lg md:text-xl mb-4 gradient-text"
          scrollStart={50}
          scrollEnd={350}
          distance={180}
          gradient
        >
          {service.name}
        </ScatterText>

        <ScatterText
          as="p"
          className="type-readable-number text-3xl md:text-4xl text-foreground mb-4"
          scrollStart={50}
          scrollEnd={350}
          distance={200}
        >
          {service.price}
        </ScatterText>

        <ScatterText
          as="p"
          className="type-body-compact text-sm text-muted-foreground"
          scrollStart={50}
          scrollEnd={350}
          distance={160}
        >
          {service.note}
        </ScatterText>

        <div
          className={`absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-accent/10 transition-opacity duration-500 pointer-events-none ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
    </SectionReveal>
  )
}
