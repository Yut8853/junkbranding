export type AudioContextConstructor = typeof AudioContext

export type AudioContextValue = {
  isPlaying: boolean
  toggleSound: () => Promise<void>
  startSound: () => Promise<boolean>
  stopSound: () => void
  hasStarted: boolean
}
