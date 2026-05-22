import type { DirecOSPlannedStackItem } from '@/types/works-page'

export const DIRECOS_CODE_SOURCE = `
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

export const DIRECOS_CODE_LINES = DIRECOS_CODE_SOURCE.trim().split('\n')

export const DIRECOS_TYPING_INTERVAL_MS = 14
export const DIRECOS_TYPING_CHUNK_SIZE = 2
export const DIRECOS_LINE_HOLD_MS = 70
export const DIRECOS_LOOP_PAUSE_MS = 1100

export const DIRECOS_PLANNED_STACK: DirecOSPlannedStackItem[] = [
  {
    label: 'Front',
    value: 'Next.js / TypeScript / Tailwind CSS / TanStack Query',
  },
  {
    label: 'Back',
    value: 'Hono / PostgreSQL / Drizzle ORM / Zod',
  },
  {
    label: 'Infra',
    value: 'AWS ECS Fargate / RDS / ElastiCache / Cloudflare R2',
  },
  {
    label: 'Env',
    value: 'Docker Compose / pnpm workspace / GitHub Actions',
  },
  {
    label: 'Test',
    value: 'Vitest / Playwright / API Integration Test',
  },
]