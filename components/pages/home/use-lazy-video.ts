'use client'

import { useEffect, useRef, useState } from 'react'

export function useLazyVideo(rootMargin = '500px 0px') {
  const videoWrapperRef = useRef<HTMLDivElement>(null)
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false)

  useEffect(() => {
    const wrapper = videoWrapperRef.current
    if (!wrapper || shouldLoadVideo) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setShouldLoadVideo(true)
        observer.disconnect()
      },
      { rootMargin }
    )

    observer.observe(wrapper)
    return () => observer.disconnect()
  }, [rootMargin, shouldLoadVideo])

  return { shouldLoadVideo, videoWrapperRef }
}
