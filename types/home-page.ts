export type HomeAboutPreview = {
  eyebrow: string
  title: string
  description: string
  href: string
  cta: string
}

export type HomeWorksPreview = {
  eyebrow: string
  title: string
  description: string
  note: string
  href: string
  cta: string
}

export type HomeArea = {
  eyebrow: string
  title: string
  area: string
  description: string
}

export type HomeAboutPreviewSectionProps = {
  aboutPreview: HomeAboutPreview
  videoSrc: string
}

export type HomeWorksPreviewSectionProps = {
  worksPreview: HomeWorksPreview
}

export type HomeAreaSectionProps = {
  area: HomeArea
}
