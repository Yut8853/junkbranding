export type ScrollUpdate = {
  rect: DOMRect
  viewportHeight: number
  scrollY: number
}

export type ScrollSubscriber = {
  element: HTMLElement
  callback: (update: ScrollUpdate) => void
  isActive: boolean
}
