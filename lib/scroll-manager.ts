import type { ScrollSubscriber, ScrollUpdate } from '@/types/scroll-manager'

const subscribers = new Set<ScrollSubscriber>()
let rafId: number | null = null
let isListening = false
let observer: IntersectionObserver | null = null

// スクロール監視を1か所へ集約し、複数のScatterTextが個別にscroll listenerを持つ状態を避ける。
const scheduleUpdate = () => {
  if (rafId !== null) return

  rafId = requestAnimationFrame(() => {
    rafId = null
    const viewportHeight = window.innerHeight
    const scrollY = window.scrollY

    subscribers.forEach((subscriber) => {
      if (!subscriber.isActive) return
      subscriber.callback({
        rect: subscriber.element.getBoundingClientRect(),
        viewportHeight,
        scrollY,
      })
    })
  })
}

const ensureObserver = () => {
  if (observer) return observer

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        subscribers.forEach((subscriber) => {
          if (subscriber.element !== entry.target) return
          subscriber.isActive = entry.isIntersecting
        })
      })
      scheduleUpdate()
    },
    // 画面に入る少し前から更新を始め、スクロール演出の立ち上がりを遅らせない。
    { rootMargin: '120% 0px' }
  )

  return observer
}

const ensureListening = () => {
  if (isListening) return
  isListening = true
  window.addEventListener('scroll', scheduleUpdate, { passive: true })
  window.addEventListener('resize', scheduleUpdate, { passive: true })
}

const cleanupListening = () => {
  // 購読者がいなくなったらグローバルリスナーとObserverを止め、ページ遷移後の残留処理を防ぐ。
  if (subscribers.size > 0 || !isListening) return

  isListening = false
  window.removeEventListener('scroll', scheduleUpdate)
  window.removeEventListener('resize', scheduleUpdate)

  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }

  observer?.disconnect()
  observer = null
}

export const subscribeToScrollUpdates = (
  element: HTMLElement,
  callback: (update: ScrollUpdate) => void
) => {
  // 登録側には解除関数だけを返し、各コンポーネントは購読の生存期間だけを管理すればよい形にする。
  const subscriber: ScrollSubscriber = {
    element,
    callback,
    isActive: false,
  }

  subscribers.add(subscriber)
  ensureListening()
  ensureObserver().observe(element)
  scheduleUpdate()

  return () => {
    subscribers.delete(subscriber)
    observer?.unobserve(element)
    cleanupListening()
  }
}
