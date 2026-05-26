'use client'

import { useDirecOSCodeTyping } from '@/hooks/use-direcos-code-typing'
import type { WorkCodePanelProps } from '@/types/works-page'

const DEFAULT_FOOTER_ITEMS = ['board sync', 'task graph', 'right dock', 'live status']

export function WorkCodePanel({
  title,
  label,
  lines,
  footerItems = DEFAULT_FOOTER_ITEMS,
}: WorkCodePanelProps) {
  const { scrollRef, renderedLines, lineIndex, isPausing } = useDirecOSCodeTyping(lines)

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
            {footerItems.map((item) => (
              <div
                key={item}
                className="rounded-xl border border-white/8 bg-white/4 px-3 py-2"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
