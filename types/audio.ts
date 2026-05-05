// AudioContextはSafariのwebkitAudioContextも扱うため、コンストラクタ型を明示しておく。
export type AudioContextConstructor = typeof AudioContext

// Loading画面・SoundToggle・Provider間で共有する音声操作の公開API。
export type AudioContextValue = {
  isPlaying: boolean
  toggleSound: () => Promise<void>
  startSound: () => Promise<boolean>
  stopSound: () => void
  hasStarted: boolean
}
