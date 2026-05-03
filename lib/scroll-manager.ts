type ScrollUpdate = {
  rect: DOMRect
  viewportHeight: number
  scrollY: number
}

type ScrollSubscriber = {
  element: HTMLElement
  callback: (update: ScrollUpdate) => void
  isActive: boolean
}

const subscribers = new Set<ScrollSubscriber>()
let rafId: number | null = null
let isListening = false
let observer: IntersectionObserver | null = null

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
