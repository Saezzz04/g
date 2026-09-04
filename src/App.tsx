import { useEffect, useState } from "react"
import { Rose3D } from "@/components/Rose3D"
import { Player } from "@/components/Player"
import { DEFAULT_ACCENT, type Track } from "@/lib/tracks"

export default function App() {
  const [playing, setPlaying] = useState(false)
  const [track, setTrack] = useState<Track>()
  const accent = track?.accent ?? DEFAULT_ACCENT

  // el acento de la canción manda también sobre el tema del reproductor
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty("--primary", accent)
    root.style.setProperty("--ring", accent)
  }, [accent])

  return (
    <div className="bg-background flex h-svh flex-col overflow-hidden">
      <main className="relative flex-1">
        {/* halo detrás de la flor */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_50%,color-mix(in_oklch,var(--primary),transparent_78%),transparent_70%)] transition-colors duration-700" />
        <Rose3D beating={playing} accent={accent} />
        {/* viñeta: funde los bordes con el negro */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_50%,transparent_45%,#000_100%)]" />
      </main>

      <Player onPlayingChange={setPlaying} onTrackChange={setTrack} />
    </div>
  )
}
