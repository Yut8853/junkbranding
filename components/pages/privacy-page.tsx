'use client';

import { ArrowLeft, Mail, ShieldCheck } from 'lucide-react';
import { SectionReveal } from '@/components/motion/text-reveal';
import { ScatterText } from '@/components/motion/scatter-text';
import { ScatterBlock } from '@/components/motion/scatter-block';
import { privacyContactItems, privacySections } from '@/content/privacy-page';

export default function PrivacyPageClient() {
  return (
    <div className="relative z-10 min-h-screen overflow-hidden">
      <main className="container mx-auto px-6 md:px-14 lg:px-20 py-28 md:py-36 lg:py-44">
        <div className="mx-auto max-w-6xl">
          {/* ヒーロー */}
          <section className="relative mb-20 lg:mb-28">
            <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-primary/10 blur-[90px]" />
            <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-accent/10 blur-[100px]" />

            <div className="relative rounded-[2rem] rainbow-border px-6 py-10 md:px-10 md:py-14 lg:px-14 lg:py-16">
              <div className="type-label mb-8 inline-flex items-center gap-3 rounded-full border border-white/20 px-4 py-2 text-xs text-white/70">
                <ShieldCheck className="h-4 w-4 text-white/70" />
                <ScatterText as="span" scrollStart={50} scrollEnd={350} distance={160}>
                  Legal / Privacy
                </ScatterText>
              </div>

              <div className="mb-6 lg:mb-8">
                <ScatterText
                  as="span"
                  className="type-eyebrow text-[clamp(3.4rem,10vw,8rem)] block"
                  scrollStart={50}
                  scrollEnd={350}
                  distance={500}
                  style={{
                    color: '#000',
                    WebkitTextStroke: '1px rgba(255,255,255,0.9)',
                    WebkitTextFillColor: '#000',
                  }}
                >
                  Privacy Policy
                </ScatterText>
              </div>

              <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-end">
                <div>
                  <ScatterText
                    as="h1"
                    className="type-hero-title mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
                    scrollStart={50}
                    scrollEnd={350}
                    distance={380}
                    gradient
                  >
                    個人情報の取り扱いについて
                  </ScatterText>
                  <ScatterText
                    as="p"
                    className="type-body max-w-2xl text-sm text-white/80 md:text-base"
                    scrollStart={50}
                    scrollEnd={350}
                    distance={280}
                  >
                    お客様からお預かりする情報を、どのように扱い、保護し、利用するかを明確にするためのポリシーです。制作やご相談を安心して進められるよう、取り扱いの考え方をできるだけわかりやすくまとめています。
                  </ScatterText>
                </div>

                <div className="rounded-3xl p-5 rainbow-border">
                  <ScatterText
                    as="p"
                    className="type-label mb-2 text-white/65"
                    scrollStart={50}
                    scrollEnd={350}
                    distance={180}
                  >
                    Last Updated
                  </ScatterText>
                  <ScatterText
                    as="p"
                    className="type-eyebrow text-3xl"
                    scrollStart={50}
                    scrollEnd={350}
                    distance={220}
                    gradient
                  >
                    2026.04.01
                  </ScatterText>
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-14">
            {/* 目次 */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 rounded-3xl rainbow-border p-6">
                <ScatterText
                  as="p"
                  className="type-label mb-6 text-white/65"
                  scrollStart={50}
                  scrollEnd={350}
                  distance={180}
                >
                  Contents
                </ScatterText>
                <div className="space-y-4">
                  {privacySections.map((section) => (
                    <div key={section.id} className="flex items-center gap-3">
                      <span className="font-mono text-xs text-foreground/30">{section.id}</span>
                      <ScatterText
                        as="span"
                        className="text-xs font-medium text-white/70"
                        scrollStart={50}
                        scrollEnd={350}
                        distance={160}
                      >
                        {section.titleEn}
                      </ScatterText>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* 本文セクション */}
            <div className="space-y-6 lg:space-y-8">
              {privacySections.map((section, index) => (
                <SectionReveal key={section.id} delay={0.06 + index * 0.03}>
                  <section className="group relative overflow-hidden rounded-[2rem] rainbow-border p-6 md:p-8 lg:p-10">
                    <div className="type-display absolute right-6 top-4 text-[5rem] text-white/[0.06] md:text-[7rem]">
                      {section.id}
                    </div>
                    <div className="relative z-10">
                      <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl rainbow-border">
                            <section.icon className="h-5 w-5 text-white/75" />
                          </div>
                          <div>
                            <ScatterText
                              as="p"
                              className="type-label mb-1 text-white/65"
                              scrollStart={50}
                              scrollEnd={350}
                              distance={180}
                            >
                              {section.titleEn}
                            </ScatterText>
                            <ScatterText
                              as="h2"
                              className="type-card-title text-xl md:text-2xl"
                              scrollStart={50}
                              scrollEnd={350}
                              distance={280}
                              gradient
                            >
                              {section.title}
                            </ScatterText>
                          </div>
                        </div>
                      </div>

                      <ScatterText
                        as="p"
                        className="type-body max-w-3xl text-sm text-white/82 md:text-base"
                        scrollStart={50}
                        scrollEnd={350}
                        distance={260}
                      >
                        {section.body}
                      </ScatterText>

                      {section.items && (
                        <div className="mt-7 grid gap-3 sm:grid-cols-2">
                          {section.items.map((item, itemIndex) => (
                            <div key={item} className="rounded-2xl px-4 py-3 rainbow-border">
                              <div className="flex items-start gap-3">
                                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/45" />
                                <ScatterText
                                  as="p"
                                  className="type-body-compact text-xs text-white/78 md:text-sm"
                                  scrollStart={50}
                                  scrollEnd={350}
                                  distance={200}
                                >
                                  {item}
                                </ScatterText>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {section.id === '06' && (
                        <div className="mt-8 rounded-3xl p-5 md:p-6 rainbow-border">
                          <div className="mb-5 flex items-center gap-3">
                            <Mail className="h-4 w-4 text-white/65" />
                            <ScatterText
                              as="p"
                              className="type-label text-white/65"
                              scrollStart={50}
                              scrollEnd={350}
                              distance={180}
                            >
                              Contact Detail
                            </ScatterText>
                          </div>
                          <div className="space-y-3">
                            {privacyContactItems.map((item, contactIndex) => (
                              <ScatterText
                                key={item}
                                as="p"
                                className={contactIndex === 0 ? 'type-card-title text-sm text-white' : 'type-body-compact text-xs text-white/76 md:text-sm'}
                                scrollStart={50}
                                scrollEnd={350}
                                distance={220}
                                gradient={contactIndex === 0}
                              >
                                {item}
                              </ScatterText>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                </SectionReveal>
              ))}
            </div>
          </div>

          {/* 戻るリンク */}
          <div className="mt-14 lg:mt-20">
            <ScatterBlock
              className="cta-primary type-cta inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm transition-all duration-300"
              scrollEnd={350}
              distance={300}
              seed={50}
              href="/"
            >
              <ArrowLeft className="w-4 h-4" />
              <ScatterText as="span" className="inline-block" scrollStart={50} scrollEnd={350} distance={180}>
                トップページに戻る
              </ScatterText>
            </ScatterBlock>
          </div>
        </div>
      </main>
    </div>
  );
}
