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
  {
    id: "si-estoy-contigo",
    title: "SI ESTOY CONTIGO",
    artist: "KINKY BWOY",
    art: "🧡",
    cover: asset("art/si-estoy-contigo.jpg"),
    accent: "#ff7a2f", // naranja
    youtubeId: "g05pXTEb2O0",
    src: asset("music/si-estoy-contigo.m4a"),
    duration: 164,
  },
  {
    id: "con-los-dos-en-la-cabeza",
    title: "Con Los Dos En La Cabeza",
    artist: "Pedro Guerra, Cruzzi",
    art: "💚",
    cover: asset("art/con-los-dos-en-la-cabeza.jpg"),
    accent: "#2fd6a8", // verde agua
    youtubeId: "O9825iugYPM",
    src: asset("music/con-los-dos-en-la-cabeza.m4a"),
    duration: 234,
  },
  {
    id: "pensando-en-ti",
    title: "Pensando en Ti",
    artist: "Nickzzy, Cano",
    art: "🩵",
    cover: asset("art/pensando-en-ti.jpg"),
    accent: "#2fc4ff", // cian
    youtubeId: "6kCtPdgodsQ",
    src: asset("music/pensando-en-ti.m4a"),
    duration: 183,
  },
  {
    id: "mood-swings",
    title: "MOOD SWINGS",
    artist: "POP SMOKE ft. Lil Tjay",
    art: "💛",
    cover: asset("art/mood-swings.jpg"),
    accent: "#e8c62f", // ambar
    youtubeId: "YrlByJi9uKc",
    src: asset("music/mood-swings.m4a"),
    duration: 215,
  },
  {
    id: "love-hardgz",
    title: "LOVE",
    artist: "HARD GZ",
    art: "❤️",
    cover: asset("art/love-hardgz.jpg"),
    accent: "#ff2f2f", // rojo
    youtubeId: "JKUgyvkEhMc",
    src: asset("music/love-hardgz.m4a"),
    duration: 209,
  },
  {
    id: "alegria-de-vivir",
    title: "Alegría de Vivir",
    artist: "Ray Heredia",
    art: "💛",
    cover: asset("art/alegria-de-vivir.jpg"),
    accent: "#9ad62f", // verde lima
    youtubeId: "lTFt_5CjkYs",
    src: asset("music/alegria-de-vivir.m4a"),
    duration: 230,
  },
  {
    id: "solo-pienso-en-ti",
    title: "SOLO PIENSO EN TI",
    artist: "DENOM ft. Camin, Cano, Fernando Costa",
    art: "🤍",
    cover: asset("art/solo-pienso-en-ti.jpg"),
    accent: "#c9d6df", // gris perla
    youtubeId: "VzUQy37cyBY",
    src: asset("music/solo-pienso-en-ti.m4a"),
    duration: 303,
  },
  {
    id: "si-tu-quieres",
    title: "Si Tu Quieres",
    artist: "Morad",
    art: "💜",
    cover: asset("art/si-tu-quieres.jpg"),
    accent: "#e02fd6", // magenta
    youtubeId: "CIMg6NVuUA8",
    src: asset("music/si-tu-quieres.m4a"),
    duration: 190,
  },
  {
    id: "siempre-preguntando",
    title: "Siempre Preguntando",
    artist: "DELLAFUENTE",
    art: "💙",
    cover: asset("art/siempre-preguntando.jpg"),
    accent: "#2f9ed6", // azulejo
    youtubeId: "BedjLNZbC7E",
    src: asset("music/siempre-preguntando.m4a"),
    duration: 169,
  },
  {
    id: "sola",
    title: "Sola",
    artist: "DELAOSSA",
    art: "🤎",
    cover: asset("art/sola.jpg"),
    accent: "#a8734a", // tierra
    youtubeId: "Y5j9SbyGrNg",
    src: asset("music/sola.m4a"),
    duration: 243,
  },
  {
    id: "el-patio",
    title: "El Patio",
    artist: "Pepe y Vizio, Delaossa",
    art: "🤍",
    cover: asset("art/el-patio.jpg"),
    accent: "#d6b32f", // dorado
    youtubeId: "OOec5Ci3LVQ",
    src: asset("music/el-patio.m4a"),
    duration: 235,
  },
  {
    id: "bandido-remix",
    title: "Bandido Remix",
    artist: "Cyril Kamer, RVFV, Cano",
    art: "🖤",
    cover: asset("art/bandido-remix.jpg"),
    accent: "#d62f5a", // carmín
    youtubeId: "e8VHYp4Oojk",
    src: asset("music/bandido-remix.m4a"),
    duration: 236,
  },
]

export function formatTime(s: number) {
  if (!Number.isFinite(s) || s < 0) return "0:00"
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`
}
