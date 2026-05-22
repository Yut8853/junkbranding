'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

const CODE_SOURCE = `
'use client'

import { useEffect, useMemo, useState } from 'react'
import { z } from 'zod'

type ProjectStatus = 'draft' | 'active' | 'blocked' | 'review'

type NextAction = {
  id: string
  title: string
  owner: string
  dueAt: string | null
}

type ProjectSignal = {
  projectId: string
  projectName: string
  status: ProjectStatus
  blockedTasks: number
  inboxCount: number
  unreadMentions: number
  nextAction: NextAction | null
  updatedAt: string
}

const projectSignalSchema = z.object({
  projectId: z.string(),
  projectName: z.string(),
  status: z.enum(['draft', 'active', 'blocked', 'review']),
  blockedTasks: z.number().int().nonnegative(),
  inboxCount: z.number().int().nonnegative(),
  unreadMentions: z.number().int().nonnegative(),
  nextAction: z
    .object({
      id: z.string(),
      title: z.string(),
      owner: z.string(),
      dueAt: z.string().nullable(),
    })
    .nullable(),
  updatedAt: z.string(),
})

const DEFAULT_SIGNAL: ProjectSignal = {
  projectId: 'direcos-alpha',
  projectName: 'DirecOS',
  status: 'active',
  blockedTasks: 4,
  inboxCount: 12,
  unreadMentions: 3,
  nextAction: {
    id: 'next-ship-right-dock',
    title: 'right dock を案件単位の行動ログへ統合',
    owner: 'Yuta',
    dueAt: '2026-05-24T10:00:00.000Z',
  },
  updatedAt: '2026-05-17T21:48:00.000Z',
}

function formatRelativeDate(iso: string) {
  const date = new Date(iso)
  return new Intl.DateTimeFormat('ja-JP', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function buildProjectTabs(signal: ProjectSignal) {
  return [
    { id: 'overview', label: 'Overview', badge: signal.inboxCount },
    { id: 'blocked', label: 'Blocked', badge: signal.blockedTasks },
    { id: 'mentions', label: 'Mentions', badge: signal.unreadMentions },
    { id: 'timeline', label: 'Timeline', badge: 0 },
  ]
}

function getPrimaryPanel(status: ProjectStatus) {
  if (status === 'blocked') return 'blockedTasks'
  if (status === 'review') return 'approvalQueue'
  return 'projectOverview'
}

async function fetchProjectSignal(projectId: string) {
  const response = await fetch('/api/projects/' + projectId + '/signal', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch project signal')
  }

  const json = await response.json()
  return projectSignalSchema.parse(json)
}

export function DirecOSProjectShell() {
  const [signal, setSignal] = useState<ProjectSignal>(DEFAULT_SIGNAL)
  const [activeTab, setActiveTab] = useState('overview')
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function refreshSignal() {
      setIsRefreshing(true)

      try {
        const nextSignal = await fetchProjectSignal(DEFAULT_SIGNAL.projectId)
        if (!cancelled) {
          setSignal(nextSignal)
        }
      } catch {
        if (!cancelled) {
          setSignal(DEFAULT_SIGNAL)
        }
      } finally {
        if (!cancelled) {
          setIsRefreshing(false)
        }
      }
    }

    void refreshSignal()
    const intervalId = window.setInterval(refreshSignal, 30000)

    return () => {
      cancelled = true
      window.clearInterval(intervalId)
    }
  }, [])

  const tabs = useMemo(() => buildProjectTabs(signal), [signal])
  const primaryPanel = useMemo(() => getPrimaryPanel(signal.status), [signal.status])
  const nextActionLabel = signal.nextAction?.title ?? 'No action queued'
  const updatedLabel = formatRelativeDate(signal.updatedAt)

  return (
    <section className="grid gap-4 rounded-3xl border border-white/10 bg-slate-950/80 p-5 text-slate-100">
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/72">Project Signal</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">{signal.projectName}</h2>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300">
          {isRefreshing ? 'Syncing...' : updatedLabel}
        </div>
      </header>

      <nav className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={tab.id === activeTab ? 'is-active-tab' : 'is-idle-tab'}
          >
            <span>{tab.label}</span>
            {tab.badge > 0 && <span>{tab.badge}</span>}
          </button>
        ))}
      </nav>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_320px]">
        <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Primary Panel</p>
          <p className="mt-3 text-lg text-slate-100">{primaryPanel}</p>
          <p className="mt-4 text-sm leading-7 text-slate-300">{nextActionLabel}</p>
        </article>

        <aside className="rounded-2xl border border-cyan-400/20 bg-cyan-400/8 p-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/76">Pinned Action</p>
          <p className="mt-3 text-sm leading-7 text-slate-100">{nextActionLabel}</p>
        </aside>
      </div>
    </section>
  )
}
`

const CODE_LINES = CODE_SOURCE.trim().split('\n')

const TYPING_INTERVAL_MS = 14
const TYPING_CHUNK_SIZE = 2
const LINE_HOLD_MS = 70
const LOOP_PAUSE_MS = 1100

const PLANNED_STACK = [
  {
    label: 'Front',
    value: 'Next.js / TypeScript / Tailwind CSS',
  },
  {
    label: 'Back',
    value: 'Hono / PostgreSQL / Drizzle ORM',
  },
  {
    label: 'Infra',
    value: 'AWS ECS / RDS / Cloudflare R2',
  },
]

type WorkCodePanelProps = {
  title: string
  label: string
}

export function WorkCodePanel({ title, label }: WorkCodePanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isPausing, setIsPausing] = useState(false)

  useEffect(() => {
    if (isPausing) {
      const pauseDuration = lineIndex === CODE_LINES.length - 1 ? LOOP_PAUSE_MS : LINE_HOLD_MS
      const pauseTimer = window.setTimeout(() => {
        setIsPausing(false)

        if (lineIndex === CODE_LINES.length - 1) {
          setLineIndex(0)
          setCharIndex(0)
          return
        }

        setLineIndex((current) => current + 1)
        setCharIndex(0)
      }, pauseDuration)

      return () => window.clearTimeout(pauseTimer)
    }

    const activeLine = CODE_LINES[lineIndex]

    if (charIndex >= activeLine.length) {
      setIsPausing(true)
      return
    }

    const typingTimer = window.setTimeout(() => {
      setCharIndex((current) => Math.min(current + TYPING_CHUNK_SIZE, activeLine.length))
    }, TYPING_INTERVAL_MS)

    return () => window.clearTimeout(typingTimer)
  }, [charIndex, isPausing, lineIndex])

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const activeLine = container.querySelector<HTMLElement>(`[data-line-index="${lineIndex}"]`)
    if (!activeLine) return

    const nextTop = Math.max(activeLine.offsetTop - container.clientHeight * 0.45, 0)
    container.scrollTo({ top: nextTop, behavior: 'smooth' })
  }, [charIndex, lineIndex])

  const renderedLines = useMemo(() => {
    return CODE_LINES.map((line, index) => {
      if (index < lineIndex) return line
      if (index > lineIndex) return ''
      return line.slice(0, charIndex)
    })
  }, [charIndex, lineIndex])

  return (
    <div className="relative overflow-hidden rounded-[1.7rem] border border-border/45 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.94))] p-4 shadow-[0_20px_70px_rgba(15,23,42,0.22)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.12),transparent_28%)]" />
      <div className="relative z-10 mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="type-label text-[10px] uppercase tracking-[0.24em] text-white/45">
            {label}
          </p>
          <p className="type-body-compact mt-2 max-w-[15rem] text-sm leading-6 text-white/82">
            {title}
          </p>
        </div>
        <div className="rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-white/48 backdrop-blur-sm">
          Typing Loop
        </div>
      </div>

      <div className="relative aspect-[16/10] overflow-hidden rounded-[1.35rem] border border-white/10 bg-[linear-gradient(180deg,rgba(2,6,23,0.94),rgba(15,23,42,0.98))] px-4 py-4">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 flex h-10 items-center gap-2 px-4">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        </div>

        <div className="relative z-10 mt-8 flex h-full flex-col justify-between">
          <div className="mb-4 grid gap-2 md:grid-cols-3">
            {PLANNED_STACK.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-white/8 bg-white/4 px-3 py-2.5"
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-200/58">
                  {item.label}
                </p>
                <p className="mt-1 text-[11px] leading-5 text-white/72 md:text-[10px]">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div
            ref={scrollRef}
            className="h-full overflow-y-auto pr-2 font-mono text-[11px] leading-6 text-sky-100/92 [scrollbar-color:rgba(125,211,252,0.35)_transparent] [scrollbar-width:thin] md:text-xs"
          >
            <div className="space-y-1 pb-16">
            {renderedLines.map((line, index) => {
              const isActiveLine = index === lineIndex

              return (
                <div
                  key={String(index)}
                  data-line-index={index}
                  className="flex min-h-6 items-start gap-3 rounded-lg px-2 py-0.5 transition-colors duration-300"
                >
                  <span className="w-8 shrink-0 text-right text-white/25">
                    {String(index + 1).padStart(3, '0')}
                  </span>
                  <div className="flex-1 whitespace-pre text-white/86">
                    {line ? (
                      <>
                        <span className="text-white/86">{line}</span>
                      </>
                    ) : (
                      <span className="text-transparent">.</span>
                    )}
                    {isActiveLine && !isPausing && (
                      <span className="ml-0.5 inline-block h-4 w-[7px] translate-y-[2px] animate-pulse bg-cyan-300/90" />
                    )}
                  </div>
                </div>
              )
            })}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] uppercase tracking-[0.18em] text-white/42">
            <div className="rounded-xl border border-white/8 bg-white/4 px-3 py-2">board sync</div>
            <div className="rounded-xl border border-white/8 bg-white/4 px-3 py-2">task graph</div>
            <div className="rounded-xl border border-white/8 bg-white/4 px-3 py-2">right dock</div>
            <div className="rounded-xl border border-white/8 bg-white/4 px-3 py-2">live status</div>
          </div>
        </div>
      </div>
    </div>
  )
}