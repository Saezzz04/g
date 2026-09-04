import { useEffect, useRef, useState } from "react"
import {
  Heart,
  ListMusic,
  Pause,
  Play,
  Plus,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
  Radio,
} from "lucide-react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { DEFAULT_ACCENT, formatTime, tracks as initialTracks, type Track } from "@/lib/tracks"
import {
  createYouTubePlayer,
  YT_ENDED,
  YT_PAUSED,
  YT_PLAYING,
  type YTPlayer,
} from "@/lib/youtube"

/** Normaliza para emparejar nombres de archivo con títulos: "True Love" == "true-love.mp3". */
const slug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")

/** El archivo local manda sobre YouTube: mejor calidad y funciona sin red. */
const isLocal = (t?: Track) => !!t?.src

/** Barras animadas del track sonando. */
function NowBars() {
  return (
    <span className="flex h-3.5 items-end gap-[2px]">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="bg-primary w-[2px] animate-[bars_0.9s_ease-in-out_infinite] rounded-full"
          style={{ animationDelay: `${i * 0.18}s`, height: "100%" }}
        />
      ))}
    </span>
  )
}

export function Player({
  onPlayingChange,
  onTrackChange,
}: {
  onPlayingChange?: (playing: boolean) => void
  onTrackChange?: (track: Track | undefined) => void
}) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const ytHostRef = useRef<HTMLDivElement>(null)
  const ytRef = useRef<YTPlayer>(null)

  const [queue, setQueue] = useState<Track[]>(initialTracks)
  const [index, setIndex] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  // las canciones de la lista nacen con el corazón dado
  const [liked, setLiked] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(initialTracks.map((t) => [t.id, true])),
  )
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(80)
  const [error, setError] = useState<string | null>(null)

  const current = index >= 0 ? queue[index] : undefined
  const onYouTube = !!current && !isLocal(current) && !!current.youtubeId
  const VolumeIcon = volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2

  // refs para los callbacks de la IFrame API, que viven fuera del ciclo de React
  const stepRef = useRef<(dir: 1 | -1) => void>(null)
  const repeatRef = useRef(repeat)
  repeatRef.current = repeat

  useEffect(() => onPlayingChange?.(playing), [playing, onPlayingChange])
  useEffect(() => onTrackChange?.(current), [current, onTrackChange])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100
    ytRef.current?.setVolume(volume)
  }, [volume])

  // progreso de YouTube: la API no emite eventos de tiempo, hay que sondearla
  useEffect(() => {
    if (!onYouTube || !playing) return
    const id = setInterval(() => {
      const p = ytRef.current
      if (!p) return
      setTime(p.getCurrentTime())
      const d = p.getDuration()
      if (d) {
        setDuration(d)
        setQueue((q) => q.map((t, i) => (i === index ? { ...t, duration: d } : t)))
      }
    }, 250)
    return () => clearInterval(id)
  }, [onYouTube, playing, index])

  const ensureYouTube = async () => {
    if (ytRef.current) return ytRef.current
    const host = ytHostRef.current
    if (!host) throw new Error("sin host para el reproductor de YouTube")
    const player = await createYouTubePlayer(host, (state) => {
      if (state === YT_PLAYING) setPlaying(true)
      else if (state === YT_PAUSED) setPlaying(false)
      else if (state === YT_ENDED) {
        if (repeatRef.current) ytRef.current?.seekTo(0, true)
        else stepRef.current?.(1)
      }
    })
    ytRef.current = player
    player.setVolume(volume)
    return player
  }

  const play = async (i: number) => {
    const audio = audioRef.current
    const track = queue[i]
    if (!audio || !track) return
    setError(null)
    setIndex(i)
    setTime(0)
    setDuration(track.duration ?? 0)

    if (isLocal(track)) {
      ytRef.current?.pauseVideo()
      audio.src = track.src!
      audio.play().catch(() => setError(`Falta el archivo ${track.src}`))
      return
    }
    if (!track.youtubeId) return setError("Esta canción no tiene fuente")

    audio.pause()
    try {
      const player = await ensureYouTube()
      player.loadVideoById(track.youtubeId)
    } catch {
      setError("No se pudo cargar el reproductor de YouTube")
    }
  }

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (index < 0) return play(0)
    if (onYouTube) {
      if (playing) ytRef.current?.pauseVideo()
      else ytRef.current?.playVideo()
      return
    }
    if (audio.paused) audio.play().catch(() => setError("No se pudo reproducir"))
    else audio.pause()
  }

  const step = (dir: 1 | -1) => {
    if (!queue.length) return
    if (shuffle) return play(Math.floor(Math.random() * queue.length))
    play((index + dir + queue.length) % queue.length)
  }
  stepRef.current = step

  const seek = (fraction: number) => {
    if (!duration) return
    const seconds = fraction * duration
    if (onYouTube) ytRef.current?.seekTo(seconds, true)
    else if (audioRef.current) audioRef.current.currentTime = seconds
  }

  const addFiles = (files: FileList | null) => {
    const picked = Array.from(files ?? [])
    if (!picked.length) return

    // Un archivo cuyo nombre coincide con una canción de la lista rellena ESA entrada,
    // así conserva su título y su acento en vez de duplicarse como "archivo local".
    const next = [...queue]
    let firstTouched = -1
    picked.forEach((f, i) => {
      const name = f.name.replace(/\.[^.]+$/, "")
      const slot = next.findIndex((t) => slug(t.title) === slug(name) || slug(t.id) === slug(name))
      const src = URL.createObjectURL(f)
      if (slot >= 0) {
        next[slot] = { ...next[slot], src, duration: undefined }
        if (firstTouched < 0) firstTouched = slot
      } else {
        next.push({
          id: `local-${i}-${slug(name)}`,
          title: name,
          artist: "archivo local",
          art: "🎧",
          accent: DEFAULT_ACCENT,
          src,
        })
        if (firstTouched < 0) firstTouched = next.length - 1
      }
    })

    setQueue(next)
    setTimeout(() => {
      const audio = audioRef.current
      if (!audio || firstTouched < 0) return
      ytRef.current?.pauseVideo()
      setIndex(firstTouched)
      audio.src = next[firstTouched].src!
      audio.play().catch(() => setError("No se pudo reproducir"))
    }, 0)
  }

  return (
    <footer className="relative z-20 border-t border-white/10 bg-black/70 backdrop-blur-2xl">
      <audio
        ref={audioRef}
        loop={repeat}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => !repeat && step(1)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => {
          const d = e.currentTarget.duration
          setDuration(d)
          setQueue((q) => q.map((t, i) => (i === index ? { ...t, duration: d } : t)))
        }}
      />
      {/* reproductor de YouTube: sin vídeo, solo el audio oficial */}
      <div ref={ytHostRef} className="pointer-events-none absolute size-0 overflow-hidden" />

      <div className="mx-auto grid max-w-[1600px] grid-cols-1 items-center gap-4 px-4 py-3 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)] md:px-6">
        {/* sonando ahora */}
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={cn(
              "grid size-14 shrink-0 place-items-center overflow-hidden rounded-lg bg-gradient-to-br from-blue-900/70 to-black text-2xl ring-1 ring-white/10 transition-shadow",
              playing && "shadow-[0_0_30px_-6px_var(--primary)]",
            )}
          >
            {current?.cover ? (
              <img src={current.cover} alt="" className="size-full object-cover" />
            ) : (
              (current?.art ?? "💙")
            )}
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{current?.title ?? "Nada sonando"}</div>
            <div
              className={cn(
                "flex items-center gap-1.5 truncate text-xs",
                error ? "text-destructive" : "text-muted-foreground",
              )}
            >
              {onYouTube && !error && <Radio className="size-3.5 shrink-0" />}
              <span className="truncate">
                {error ?? current?.artist ?? "elige algo de la cola"}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Me gusta"
            disabled={!current}
            onClick={() => current && setLiked((l) => ({ ...l, [current.id]: !l[current.id] }))}
          >
            <Heart className={cn(current && liked[current.id] && "fill-primary text-primary")} />
          </Button>
        </div>

        {/* transporte */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Aleatorio"
              onClick={() => setShuffle((s) => !s)}
            >
              <Shuffle className={cn(shuffle && "text-primary")} />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Anterior" onClick={() => step(-1)}>
              <SkipBack className="fill-current" />
            </Button>
            <Button
              size="icon-lg"
              aria-label={playing ? "Pausa" : "Reproducir"}
              className="mx-1 rounded-full shadow-[0_0_26px_-8px_var(--primary)] transition-transform hover:scale-105"
              onClick={toggle}
            >
              {playing ? <Pause className="fill-current" /> : <Play className="fill-current" />}
            </Button>
            <Button variant="ghost" size="icon" aria-label="Siguiente" onClick={() => step(1)}>
              <SkipForward className="fill-current" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Repetir"
              onClick={() => setRepeat((r) => !r)}
            >
              <Repeat className={cn(repeat && "text-primary")} />
            </Button>
          </div>

          <div className="text-muted-foreground flex w-full max-w-xl items-center gap-3 text-[0.68rem] tabular-nums">
            <span className="w-9 text-right">{formatTime(time)}</span>
            <Slider
              value={[duration ? (time / duration) * 1000 : 0]}
              max={1000}
              step={1}
              aria-label="Progreso"
              onValueChange={([v]) => seek(v / 1000)}
            />
            <span className="w-9">{formatTime(duration)}</span>
          </div>
        </div>

        {/* cola + volumen */}
        <div className="flex items-center justify-end gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Ver cola">
                <ListMusic />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-80 border-white/10 bg-black/90 backdrop-blur-2xl"
            >
              <SheetHeader>
                <SheetTitle className="text-xs tracking-[0.18em] uppercase">Cola</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100svh-9rem)] px-2">
                <div className="flex flex-col gap-0.5 pb-4">
                  {queue.map((t, i) => (
                    <button
                      key={t.id}
                      onClick={() => play(i)}
                      className={cn(
                        "grid grid-cols-[1.25rem_2.25rem_minmax(0,1fr)_auto] items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-white/5",
                        i === index && "bg-primary/10",
                      )}
                    >
                      <span className="text-muted-foreground grid place-items-center text-xs tabular-nums">
                        {i === index && playing ? <NowBars /> : i + 1}
                      </span>
                      <span className="grid size-9 place-items-center overflow-hidden rounded-md bg-gradient-to-br from-blue-900/60 to-black text-base ring-1 ring-white/10">
                        {t.cover ? (
                          <img src={t.cover} alt="" className="size-full object-cover" />
                        ) : (
                          t.art
                        )}
                      </span>
                      <span className="min-w-0">
                        <span
                          className={cn(
                            "block truncate text-sm",
                            i === index && "text-primary font-medium",
                          )}
                        >
                          {t.title}
                        </span>
                        <span className="text-muted-foreground flex items-center gap-1 truncate text-xs">
                          {!isLocal(t) && t.youtubeId && <Radio className="size-3 shrink-0" />}
                          <span className="truncate">{t.artist}</span>
                        </span>
                      </span>
                      <span className="text-muted-foreground text-xs tabular-nums">
                        {t.duration ? formatTime(t.duration) : "--:--"}
                      </span>
                    </button>
                  ))}
                </div>
              </ScrollArea>
              <div className="border-t border-white/10 p-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => fileRef.current?.click()}
                >
                  <Plus data-icon="inline-start" />
                  añadir mis mp3
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Añadir canciones"
            onClick={() => fileRef.current?.click()}
          >
            <Plus />
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="audio/*"
            multiple
            hidden
            onChange={(e) => addFiles(e.target.files)}
          />

          <div className="flex w-28 items-center gap-2">
            <VolumeIcon className="text-muted-foreground size-4 shrink-0" />
            <Slider
              value={[volume]}
              max={100}
              step={1}
              aria-label="Volumen"
              onValueChange={([v]) => setVolume(v)}
            />
          </div>
        </div>
      </div>
    </footer>
  )
}
