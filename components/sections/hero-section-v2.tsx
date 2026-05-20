'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ScatterText } from '@/components/motion/scatter-text'
import { useIsMobile } from '@/hooks/use-mobile'

export function HeroSectionV2() {
  const containerRef = useRef<HTMLElement>(null)
  const titleWrapperRef = useRef<HTMLDivElement>(null)
  const bottomBarRef = useRef<HTMLDivElement>(null)
  const sideTextRef = useRef<HTMLDivElement>(null)
  const photoRefs = useRef<(HTMLDivElement | null)[]>([])
  const cornerRefs = useRef<(HTMLDivElement | null)[]>([])
  
  const [isLoaded, setIsLoaded] = useState(false)
  const [shouldRenderDesktopPhotos, setShouldRenderDesktopPhotos] = useState(false)
  const [heroScatterProgress, setHeroScatterProgress] = useState(0)
  const rafRef = useRef<number | null>(null)
  const isMobile = useIsMobile()
  const targetMousePos = useRef({ x: 0, y: 0 })
  const currentMousePos = useRef({ x: 0, y: 0 })
  const lastHeroScrollProgress = useRef(0)
  const isMouseAnimatingRef = useRef(false)

  // HEROで表示するテキスト。ロゴはScatterTextが扱いやすいよう1文字列にまとめる。
  const line1 = 'JUNK'
  const line2 = 'BRANDING'
  const logoText = `${line1}${line2}`
  const line3 = '茨城のホームページ制作とWeb制作を、らしく。'

  const applyPhotoParallax = useCallback(() => {
    photoRefs.current.forEach((el, index) => {
      if (!el) return

      const direction = index === 0 ? -1 : 1
      const mouseX = currentMousePos.current.x * (index === 0 ? 24 : -30)
      const mouseY = currentMousePos.current.y * (index === 0 ? 16 : -20)
      const scrollX = direction * lastHeroScrollProgress.current * (index === 0 ? 78 : 96)
      const scrollY = lastHeroScrollProgress.current * (index === 0 ? -76 : -92)
      const rotate = direction * (lastHeroScrollProgress.current * 5 + currentMousePos.current.x * 1.8)

      el.style.transform = `translate3d(${mouseX + scrollX}px, ${mouseY + scrollY}px, 0) rotate(${rotate}deg)`
    })
  }, [])

  useEffect(() => {
    if (isMobile) return

    const handleMouseMove = (e: MouseEvent) => {
      targetMousePos.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      }

      if (!isMouseAnimatingRef.current) {
        isMouseAnimatingRef.current = true
        rafRef.current = requestAnimationFrame(updateMousePosition)
      }
    }

    let lastFrameTime = 0
    const updateMousePosition = (currentTime: number) => {
      if (currentTime - lastFrameTime >= 33) {
        lastFrameTime = currentTime
        currentMousePos.current.x += (targetMousePos.current.x - currentMousePos.current.x) * 0.08
        currentMousePos.current.y += (targetMousePos.current.y - currentMousePos.current.y) * 0.08

        if (titleWrapperRef.current) {
          titleWrapperRef.current.style.transform = `translate3d(${currentMousePos.current.x * -15}px, ${currentMousePos.current.y * -15}px, 0)`
        }

        applyPhotoParallax()
      }

      const dx = targetMousePos.current.x - currentMousePos.current.x
      const dy = targetMousePos.current.y - currentMousePos.current.y
      if (dx * dx + dy * dy < 0.0001) {
        isMouseAnimatingRef.current = false
        rafRef.current = null
        return
      }

      rafRef.current = requestAnimationFrame(updateMousePosition)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [applyPhotoParallax, isMobile])

  // 初期表示のフェードイン開始タイミングを少しだけ遅らせる。
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)')
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const updatePhotoVisibility = () => {
      setShouldRenderDesktopPhotos(mediaQuery.matches && !motionQuery.matches)
    }

    updatePhotoVisibility()
    mediaQuery.addEventListener('change', updatePhotoVisibility)
    motionQuery.addEventListener('change', updatePhotoVisibility)

    return () => {
      mediaQuery.removeEventListener('change', updatePhotoVisibility)
      motionQuery.removeEventListener('change', updatePhotoVisibility)
    }
  }, [])

  // GSAPを使わず、HEROの画面内位置から散らばりと写真の視差を直接更新する。
  useEffect(() => {
    if (!containerRef.current || !isLoaded || isMobile) return

    const otherElements = [
      bottomBarRef.current,
      sideTextRef.current,
      ...cornerRefs.current.filter(Boolean),
    ].filter(Boolean)
    let rafId = 0
    let isScheduled = false
    let lastScatterProgress = -1
    let lastPhotoProgress = -1

    const updateHeroMotion = () => {
      isScheduled = false
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      // TOPページでは親がtransformで動くため、window scrollではなく画面内位置を直接見る。
      const photoProgress = Math.min(Math.max((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0), 1)
      const scatterProgress = Math.min(Math.max(-rect.top / 350, 0), 1)

      if (Math.abs(photoProgress - lastPhotoProgress) >= 0.003) {
        lastPhotoProgress = photoProgress
        lastHeroScrollProgress.current = photoProgress
        applyPhotoParallax()
      }

      if (Math.abs(scatterProgress - lastScatterProgress) >= 0.01) {
        lastScatterProgress = scatterProgress
        setHeroScatterProgress(scatterProgress)

        if (titleWrapperRef.current) {
          titleWrapperRef.current.style.opacity = '1'
          titleWrapperRef.current.style.filter = ''
        }

        otherElements.forEach((el) => {
          if (el) (el as HTMLElement).style.opacity = String(1 - scatterProgress)
        })
      }

    }

    const scheduleUpdate = () => {
      if (isScheduled) return
      isScheduled = true
      rafId = requestAnimationFrame(updateHeroMotion)
    }

    scheduleUpdate()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate, { passive: true })

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [applyPhotoParallax, isLoaded, isMobile])

  return (
    <section 
      ref={containerRef}
      className="relative h-[100svh] md:h-[110vh]"
    >
      {/* スクロール中に画面へ留まるHEROコンテナ */}
      <div className="relative h-[100svh] w-full overflow-hidden md:sticky md:top-0 md:h-screen">
        {shouldRenderDesktopPhotos && (
          <div className="pointer-events-none absolute inset-0 z-[8] hidden md:block" aria-hidden="true">
            <div
              ref={(el) => { photoRefs.current[0] = el }}
              className="absolute left-[5vw] top-[14vh] h-[42vh] w-[23vw] will-change-transform overflow-hidden rounded-[2rem] opacity-[0.64] mix-blend-normal shadow-[0_24px_60px_rgba(0,0,0,0.22)]"
              style={{
                transition: isLoaded ? 'opacity 1.6s ease 0.35s' : 'none',
                opacity: isLoaded ? 0.64 : 0,
              }}
            >
              <img
                src="/images/hero-parallax-junk-letter-j.jpg"
                alt=""
                className="h-full w-full scale-105 object-cover saturate-[1.08] contrast-[1.12]"
                decoding="async"
                fetchPriority="low"
                loading="lazy"
              />
            </div>

            <div
              ref={(el) => { photoRefs.current[1] = el }}
              className="absolute bottom-[12vh] right-[5vw] h-[44vh] w-[23vw] will-change-transform overflow-hidden rounded-[2rem] opacity-[0.66] mix-blend-normal shadow-[0_24px_64px_rgba(0,0,0,0.22)]"
              style={{
                transition: isLoaded ? 'opacity 1.6s ease 0.55s' : 'none',
                opacity: isLoaded ? 0.66 : 0,
              }}
            >
              <img
                src="/images/hero-parallax-junk-letter-b.jpg"
                alt=""
                className="h-full w-full scale-105 object-cover saturate-[1.16] contrast-[1.14]"
                decoding="async"
                fetchPriority="low"
                loading="lazy"
              />
            </div>
          </div>
        )}

        {/* メインタイポグラフィ */}
        <div 
          ref={titleWrapperRef}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
        >
          <div className="overflow-visible">
            <ScatterText
              as="h1"
              className="font-display text-[clamp(3.2rem,16vw,14rem)] font-normal uppercase tracking-[0.02em] whitespace-nowrap"
              distance={900}
              gradient
              scatterProgress={heroScatterProgress}
              deferUntilActive
            >
              {logoText}
            </ScatterText>
          </div>

          {/* 日本語タグライン */}
          <div className="overflow-visible mt-[3vw]">
            <ScatterText
              as="p"
              className="type-section-title max-w-[18rem] text-[clamp(1rem,5vw,1.4rem)] font-semibold leading-[1.45] md:max-w-none md:text-[2.2vw] md:leading-[1.08] md:whitespace-nowrap"
              distance={650}
              gradient
              scatterProgress={heroScatterProgress}
              deferUntilActive
            >
              {line3}
            </ScatterText>
          </div>
        </div>

        {/* 下部情報バー */}
        <div 
          ref={bottomBarRef}
          className="absolute bottom-6 left-0 right-0 z-30 flex items-end justify-between px-6 md:bottom-0 md:px-12 md:pb-8"
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
            transition: isMobile ? 'none' : 'opacity 1s cubic-bezier(0.77, 0, 0.175, 1) 1s, transform 1s cubic-bezier(0.77, 0, 0.175, 1) 1s',
          }}
        >
          {/* 左側の所在地表示 */}
          <div className="flex flex-col gap-1">
            <ScatterText
              as="span"
              className="type-label text-foreground/40"
              scrollStart={50}
              scrollEnd={350}
              distance={180}
            >
              Based in
            </ScatterText>
            <ScatterText
              as="span"
              className="type-body-compact text-sm md:text-base text-foreground/80"
              scrollStart={50}
              scrollEnd={350}
              distance={220}
            >
              Ibaraki, Japan
            </ScatterText>
          </div>

          </div>

        {/* 左側の縦書きテキスト */}
        <div 
          ref={sideTextRef}
          className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-30 hidden lg:block"
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateY(-50%)' : 'translateY(-50%) translateX(-20px)',
            transition: isMobile ? 'none' : 'opacity 1s cubic-bezier(0.77, 0, 0.175, 1) 1.2s, transform 1s cubic-bezier(0.77, 0, 0.175, 1) 1.2s',
          }}
        >
          <ScatterText
            as="span"
            className="text-[10px] tracking-[0.4em] text-foreground/30 uppercase"
            scrollStart={50}
            scrollEnd={350}
            distance={220}
          >
            Creative Studio / Est. 2020
          </ScatterText>
        </div>

        {/* 角のアクセント */}
        <div 
          ref={(el) => { cornerRefs.current[0] = el }}
          className="absolute top-8 right-8 w-16 h-16 z-30"
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: isMobile ? 'none' : 'opacity 1s ease-out 1.4s',
          }}
        >
          <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-l from-primary/40 to-transparent" />
          <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-primary/40 to-transparent" />
        </div>

        <div 
          ref={(el) => { cornerRefs.current[1] = el }}
          className="absolute bottom-8 left-8 w-16 h-16 z-30"
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: isMobile ? 'none' : 'opacity 1s ease-out 1.4s',
          }}
        >
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-primary/40 to-transparent" />
          <div className="absolute bottom-0 left-0 w-[1px] h-full bg-gradient-to-t from-primary/40 to-transparent" />
        </div>
      </div>
    </section>
  )
}
