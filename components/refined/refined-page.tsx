'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import {
  heroContent,
  aboutContent,
  servicesContent,
  worksContent,
  processContent,
  strengthContent,
  contactContent,
} from '@/content/shared-content'
import {
  RefinedBackground,
  GlassCard,
  RefinedReveal,
  RefractionLightLayer,
  MicroGlitch,
} from '@/components/refined/refined-effects'
import { Footer } from '@/components/layout/footer'

// Hero Section - Refined
function RefinedHero() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 150])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section
      ref={containerRef}
      className="relative min-h-svh flex items-center justify-center overflow-hidden"
    >
      <RefractionLightLayer intensity={0.25} />

      <motion.div
        className="container mx-auto px-6 md:px-12 lg:px-20 text-center relative z-10"
        style={{ y, opacity }}
      >
        <RefinedReveal delay={0.1}>
          <span className="inline-block px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold tracking-wider uppercase mb-8">
            Web Production Studio
          </span>
        </RefinedReveal>

        <RefinedReveal delay={0.2}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 leading-[1.1] mb-6 max-w-4xl mx-auto">
            <MicroGlitch triggerOnHover>{heroContent.mainCopy}</MicroGlitch>
          </h1>
        </RefinedReveal>

        <RefinedReveal delay={0.3}>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto mb-12">
            {heroContent.subCopy}
          </p>
        </RefinedReveal>

        <RefinedReveal delay={0.4}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-full font-semibold text-sm overflow-hidden transition-all duration-300 hover:bg-slate-800 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]"
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10">{heroContent.primaryCta}</span>
              <ArrowRight className="relative z-10 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/works"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white/60 backdrop-blur-sm text-slate-700 rounded-full font-semibold text-sm border border-slate-200/60 transition-all duration-300 hover:bg-white hover:shadow-lg"
            >
              {heroContent.secondaryCta}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </RefinedReveal>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-slate-300 flex justify-center pt-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-1.5 h-3 rounded-full bg-slate-400" />
        </motion.div>
      </motion.div>
    </section>
  )
}

// About Section - Refined
function RefinedAbout() {
  return (
    <section className="py-24 md:py-32 lg:py-40 relative">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <RefinedReveal>
              <span className="text-sm font-semibold tracking-wider uppercase text-slate-500 mb-4 block">
                {aboutContent.eyebrow}
              </span>
            </RefinedReveal>

            <RefinedReveal delay={0.1}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                {aboutContent.title}
              </h2>
            </RefinedReveal>

            <RefinedReveal delay={0.2}>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                {aboutContent.description}
              </p>
            </RefinedReveal>

            <RefinedReveal delay={0.3}>
              <ul className="space-y-4 mb-8">
                {aboutContent.points.map((point, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                      <Check className="w-4 h-4 text-slate-700" />
                    </span>
                    <span className="text-slate-700 font-medium">{point}</span>
                  </li>
                ))}
              </ul>
            </RefinedReveal>

            <RefinedReveal delay={0.4}>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-slate-900 font-semibold hover:gap-4 transition-all duration-300"
              >
                {aboutContent.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </RefinedReveal>
          </div>

          <RefinedReveal delay={0.2}>
            <GlassCard className="aspect-[4/3] p-1">
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-slate-100 via-slate-50 to-white flex items-center justify-center">
                <span className="text-6xl font-bold text-slate-200">JUNK</span>
              </div>
            </GlassCard>
          </RefinedReveal>
        </div>
      </div>
    </section>
  )
}

// Services Section - Refined
function RefinedServices() {
  return (
    <section className="py-24 md:py-32 lg:py-40 relative bg-slate-50/50">
      <RefractionLightLayer intensity={0.15} />

      <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <div className="text-center mb-16">
          <RefinedReveal>
            <span className="text-sm font-semibold tracking-wider uppercase text-slate-500 mb-4 block">
              {servicesContent.eyebrow}
            </span>
          </RefinedReveal>

          <RefinedReveal delay={0.1}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900">
              {servicesContent.title}
            </h2>
          </RefinedReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesContent.items.map((service, i) => (
            <RefinedReveal key={service.id} delay={0.1 * (i + 1)}>
              <GlassCard className="p-8 h-full">
                <span className="text-xs font-semibold tracking-wider uppercase text-slate-400 block mb-3">
                  {service.titleEn}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {service.description}
                </p>
              </GlassCard>
            </RefinedReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// Works Section - Refined
function RefinedWorks() {
  return (
    <section className="py-24 md:py-32 lg:py-40 relative">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <div>
            <RefinedReveal>
              <span className="text-sm font-semibold tracking-wider uppercase text-slate-500 mb-4 block">
                {worksContent.eyebrow}
              </span>
            </RefinedReveal>

            <RefinedReveal delay={0.1}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                {worksContent.title}
              </h2>
            </RefinedReveal>

            <RefinedReveal delay={0.2}>
              <p className="text-lg text-slate-600 max-w-xl">
                {worksContent.description}
              </p>
            </RefinedReveal>
          </div>

          <RefinedReveal delay={0.3} className="mt-6 md:mt-0">
            <Link
              href="/works"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full font-semibold text-sm hover:bg-slate-800 transition-colors"
            >
              {worksContent.cta}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </RefinedReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {worksContent.items.map((work, i) => (
            <RefinedReveal key={work.id} delay={0.1 * (i + 1)}>
              <GlassCard className="group overflow-hidden">
                <div className="aspect-[16/10] bg-gradient-to-br from-slate-100 to-slate-50 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold text-slate-200 group-hover:scale-110 transition-transform duration-500">
                      {work.label.split(' ')[0]}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <span className="text-xs font-semibold tracking-wider uppercase text-slate-400 block mb-2">
                    {work.label}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">{work.type}</h3>
                </div>
              </GlassCard>
            </RefinedReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// Process Section - Refined
function RefinedProcess() {
  return (
    <section className="py-24 md:py-32 lg:py-40 relative bg-slate-50/50">
      <RefractionLightLayer intensity={0.12} />

      <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <div className="text-center mb-16">
          <RefinedReveal>
            <span className="text-sm font-semibold tracking-wider uppercase text-slate-500 mb-4 block">
              {processContent.eyebrow}
            </span>
          </RefinedReveal>

          <RefinedReveal delay={0.1}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900">
              {processContent.title}
            </h2>
          </RefinedReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processContent.steps.map((step, i) => (
            <RefinedReveal key={step.num} delay={0.1 * (i + 1)}>
              <div className="relative p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/50">
                <span className="text-5xl font-bold text-slate-100 absolute top-4 right-6">
                  {step.num}
                </span>
                <div className="relative z-10">
                  <span className="text-xs font-semibold tracking-wider uppercase text-slate-400 block mb-2">
                    {step.titleEn}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600">{step.description}</p>
                </div>
              </div>
            </RefinedReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// Strength Section - Refined
function RefinedStrength() {
  return (
    <section className="py-24 md:py-32 lg:py-40 relative">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="text-center mb-16">
          <RefinedReveal>
            <span className="text-sm font-semibold tracking-wider uppercase text-slate-500 mb-4 block">
              {strengthContent.eyebrow}
            </span>
          </RefinedReveal>

          <RefinedReveal delay={0.1}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900">
              {strengthContent.title}
            </h2>
          </RefinedReveal>
        </div>

        <div className="space-y-4">
          {strengthContent.items.map((item, i) => (
            <RefinedReveal key={item.id} delay={0.1 * (i + 1)}>
              <GlassCard className="p-8">
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                  <span className="text-4xl font-bold text-slate-100">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-600">{item.description}</p>
                  </div>
                </div>
              </GlassCard>
            </RefinedReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// Contact Section - Refined
function RefinedContact() {
  return (
    <section className="py-24 md:py-32 lg:py-40 relative bg-slate-900 text-white overflow-hidden">
      {/* Subtle prism effect on dark bg */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(ellipse 50% 40% at 20% 80%, rgba(100, 150, 255, 0.2), transparent 50%),
            radial-gradient(ellipse 40% 30% at 80% 20%, rgba(150, 100, 255, 0.15), transparent 40%)
          `,
        }}
      />

      <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10 text-center">
        <RefinedReveal>
          <span className="text-sm font-semibold tracking-wider uppercase text-slate-400 mb-4 block">
            {contactContent.eyebrow}
          </span>
        </RefinedReveal>

        <RefinedReveal delay={0.1}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 max-w-3xl mx-auto leading-tight">
            {contactContent.title}
          </h2>
        </RefinedReveal>

        <RefinedReveal delay={0.2}>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed">
            {contactContent.description}
          </p>
        </RefinedReveal>

        <RefinedReveal delay={0.3}>
          <Link
            href="/contact"
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-900 rounded-full font-semibold overflow-hidden transition-all duration-300 hover:shadow-[0_20px_50px_-10px_rgba(255,255,255,0.3)]"
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-200 to-transparent -skew-x-12"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
            <span className="relative z-10">{contactContent.cta}</span>
            <ArrowRight className="relative z-10 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </RefinedReveal>
      </div>
    </section>
  )
}

// Main Refined Page Component
export function RefinedPage() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return (
    <div className="refined-mode">
      <RefinedBackground />
      <RefinedHero />
      <RefinedAbout />
      <RefinedServices />
      <RefinedWorks />
      <RefinedProcess />
      <RefinedStrength />
      <RefinedContact />
      <Footer />
    </div>
  )
}
