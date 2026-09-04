export type Track = {
  id: string
  title: string
  artist: string
  /** Emoji de respaldo cuando no hay carátula. */
  art: string
  /** Carátula real: `public/art/…`. Manda sobre `art`. */
  cover?: string
  /** Color de la rosa y del tema mientras suena esta canción. */
  accent: string
  /** Reproducción oficial vía YouTube embebido. */
  youtubeId?: string
  /** Archivo local: `public/music/…` o un mp3 que sueltes en el reproductor. Tiene prioridad. */
  src?: string
  duration?: number
}

/** Antepone la base del despliegue: en GitHub Pages la app cuelga de /<repo>/. */
const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`

/** Acento por defecto (nada sonando) y para los archivos que arrastre el usuario. */
export const DEFAULT_ACCENT = "#2f6bff"

export const tracks: Track[] = [
  {
    id: "true-love",
    title: "True Love",
    artist: "Carrion Godble$$, Saske",
    art: "💗",
    cover: asset("art/true-love.jpg"),
    accent: "#ff2f76", // rosa
    youtubeId: "hS_Csan5EIg",
    src: asset("music/true-love.m4a"),
    duration: 358,
  },
  {
    id: "rosas-azules",
    title: "Rosas Azules",
    artist: "Yung Beef",
    art: "💙",
    cover: asset("art/rosas-azules.jpg"),
    accent: "#2f6bff", // azul
    youtubeId: "_VevN4HuxrE",
    src: asset("music/rosas-azules.m4a"),
    duration: 230,
  },
  {
    id: "por-ti",
    title: "POR TI",
    artist: "Natos ft. Denom",
    art: "🖤",
    cover: asset("art/por-ti.jpg"),
    accent: "#8f2fff", // violeta
    youtubeId: "umNuOE_T0H8",
    src: asset("music/por-ti.m4a"),
    duration: 185,
  },
]

export function formatTime(s: number) {
  if (!Number.isFinite(s) || s < 0) return "0:00"
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`
}
