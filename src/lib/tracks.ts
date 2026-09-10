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
  {
    id: "celine",
    title: "Celine",
    artist: "Kidd Keo ft. Ghost Killer Track",
    art: "🩶",
    cover: asset("art/celine.jpg"),
    accent: "#5a3fd6", // índigo
    youtubeId: "5M2tSEQsnN4",
    src: asset("music/celine.m4a"),
    duration: 174,
  },
  {
    id: "reproches",
    title: "Reproches",
    artist: "Ayax y Prok",
    art: "🩶",
    cover: asset("art/reproches.jpg"),
    accent: "#6f7c8a", // pizarra
    youtubeId: "tCe7VFfrh6E",
    src: asset("music/reproches.m4a"),
    duration: 274,
  },
  {
    id: "flow-2000",
    title: "Flow 2000 (Remix)",
    artist: "Bad Gyal, Beny Jr",
    art: "💖",
    cover: asset("art/flow-2000.jpg"),
    accent: "#ff5ac8", // fucsia
    youtubeId: "HHI7p558YLs",
    src: asset("music/flow-2000.m4a"),
    duration: 175,
  },
  {
    id: "a-mi",
    title: "A MÍ",
    artist: "Rels B",
    art: "🤍",
    cover: asset("art/a-mi.jpg"),
    accent: "#2fd6c4", // turquesa
    youtubeId: "Q4Js9OEODHM",
    src: asset("music/a-mi.m4a"),
    duration: 233,
  },
  {
    id: "querer-querernos",
    title: "Querer Querernos",
    artist: "Canserbero",
    art: "🤎",
    cover: asset("art/querer-querernos.jpg"),
    accent: "#c46a2f", // cobre
    youtubeId: "8cKvvmPwgP4",
    src: asset("music/querer-querernos.m4a"),
    duration: 239,
  },
  {
    id: "infierno-de-tu-gloria",
    title: "El Infierno de Tu Gloria",
    artist: "Kaydy Cain ft. Marko Italia",
    art: "❤️‍🔥",
    cover: asset("art/infierno-de-tu-gloria.jpg"),
    accent: "#ff4d2f", // brasa
    youtubeId: "sFTyHBYC16w",
    src: asset("music/infierno-de-tu-gloria.m4a"),
    duration: 185,
  },
  {
    id: "ma-jolie",
    title: "Ma Jolie",
    artist: "JuL",
    art: "💙",
    cover: asset("art/ma-jolie.jpg"),
    accent: "#2f4fd6", // azul marino
    youtubeId: "R6QF54ZjOfs",
    src: asset("music/ma-jolie.m4a"),
    duration: 234,
  },
  {
    id: "toto-et-ninetta",
    title: "Toto et Ninetta",
    artist: "JuL",
    art: "🩵",
    cover: asset("art/toto-et-ninetta.jpg"),
    accent: "#2f8fd6", // azul cielo
    youtubeId: "KAaLQhAwaIw",
    src: asset("music/toto-et-ninetta.m4a"),
    duration: 208,
  },
  {
    id: "tu-aroma",
    title: "Tu Aroma",
    artist: "Yung Beef ft. Kaydy Cain",
    art: "💜",
    cover: asset("art/tu-aroma.jpg"),
    accent: "#a02fd6", // púrpura
    youtubeId: "hUBXd7kn5pc",
    src: asset("music/tu-aroma.m4a"),
    duration: 133,
  },
  {
    id: "amor-a-quemarropa",
    title: "Amor a Quemarropa",
    artist: "Yung Beef",
    art: "❤️",
    cover: asset("art/amor-a-quemarropa.jpg"),
    accent: "#d62f3f", // granate
    youtubeId: "PZ82xwVRdsU",
    src: asset("music/amor-a-quemarropa.m4a"),
    duration: 197,
  },
  {
    id: "mi-velero",
    title: "Mi Velero",
    artist: "KINKY BWOY",
    art: "🩵",
    cover: asset("art/mi-velero.jpg"),
    accent: "#2fb6d6", // agua marina
    youtubeId: "_Nd2OWrt2NE",
    src: asset("music/mi-velero.m4a"),
    duration: 232,
  },
  {
    id: "welcome-nikone",
    title: "Welcome",
    artist: "Nikone",
    art: "🖤",
    cover: asset("art/welcome-nikone.jpg"),
    accent: "#7a8a2f", // oliva
    youtubeId: "GRpbs0m2d0A",
    src: asset("music/welcome-nikone.m4a"),
    duration: 150,
  },
  {
    id: "pal-pulmon",
    title: "Pal Pulmón (a capela)",
    artist: "Nikone",
    art: "🤍",
    cover: asset("art/pal-pulmon.jpg"),
    accent: "#8a8f96", // humo
    youtubeId: "jHhlGLB3JSc",
    src: asset("music/pal-pulmon.m4a"),
    duration: 144,
  },
  {
    id: "manos-rotas",
    title: "Manos Rotas",
    artist: "DELLAFUENTE, Morad",
    art: "🩶",
    cover: asset("art/manos-rotas.jpg"),
    accent: "#96a3b0", // acero
    youtubeId: "wgOjjwg74jQ",
    src: asset("music/manos-rotas.m4a"),
    duration: 169,
  },
  {
    id: "flores",
    title: "Flores",
    artist: "Pepe y Vizio, DELLAFUENTE",
    art: "🌸",
    cover: asset("art/flores.jpg"),
    accent: "#ff8ab5", // rosa pálido
    youtubeId: "6vNwmrh0EbU",
    src: asset("music/flores.m4a"),
    duration: 170,
  },
  {
    id: "besos",
    title: "Besos",
    artist: "BandoBoyz ft. Swaggglock, Kidd Keo, Neelo",
    art: "💋",
    cover: asset("art/besos.jpg"),
    accent: "#e02f4f", // rojo beso
    youtubeId: "g1DTXlj4IeI",
    src: asset("music/besos.m4a"),
    duration: 173,
  },
  {
    id: "veneno",
    title: "Veneno",
    artist: "Delaossa",
    art: "💚",
    cover: asset("art/veneno.jpg"),
    accent: "#4fd62f", // verde veneno
    youtubeId: "OXP2N2HAkbA",
    src: asset("music/veneno.m4a"),
    duration: 259,
  },
]

export function formatTime(s: number) {
  if (!Number.isFinite(s) || s < 0) return "0:00"
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`
}
