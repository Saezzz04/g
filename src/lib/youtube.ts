/**
 * Carga perezosa de la IFrame Player API de YouTube: reproducción oficial, sin descargar nada.
 * Una sola instancia por página; la promesa se comparte entre llamadas.
 */
export type YTPlayer = {
  loadVideoById(id: string): void
  playVideo(): void
  pauseVideo(): void
  seekTo(seconds: number, allowSeekAhead: boolean): void
  setVolume(v: number): void
  getCurrentTime(): number
  getDuration(): number
  destroy(): void
}

declare global {
  interface Window {
    YT?: { Player: new (el: HTMLElement, opts: unknown) => YTPlayer }
    onYouTubeIframeAPIReady?: () => void
  }
}

/** Estados de la IFrame API que nos importan. */
export const YT_ENDED = 0
export const YT_PLAYING = 1
export const YT_PAUSED = 2

let apiPromise: Promise<NonNullable<Window["YT"]>> | undefined

function loadApi() {
  if (apiPromise) return apiPromise
  apiPromise = new Promise((resolve) => {
    if (window.YT?.Player) return resolve(window.YT)
    const previous = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      previous?.()
      resolve(window.YT!)
    }
    const script = document.createElement("script")
    script.src = "https://www.youtube.com/iframe_api"
    document.head.appendChild(script)
  })
  return apiPromise
}

/** Crea el reproductor dentro de `host` (un div oculto: solo se usa el audio). */
export async function createYouTubePlayer(
  host: HTMLElement,
  onState: (state: number) => void,
): Promise<YTPlayer> {
  const YT = await loadApi()
  return new Promise((resolve) => {
    const player = new YT.Player(host, {
      height: "0",
      width: "0",
      playerVars: { playsinline: 1, controls: 0, disablekb: 1 },
      events: {
        onReady: () => resolve(player),
        onStateChange: (e: { data: number }) => onState(e.data),
      },
    })
  })
}
