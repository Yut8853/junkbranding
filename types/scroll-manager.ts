// ScrollManagerが購読者へ渡す、1フレーム内で共有するスクロール情報。
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
