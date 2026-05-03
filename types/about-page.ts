import type { LucideIcon } from 'lucide-react'

export type AboutTeamMember = {
  name: string
  nameEn: string
  role: string
  image: string
  description: string
}

export type AboutValue = {
  icon: LucideIcon
  title: string
  titleEn: string
  description: string
}

export type AboutProcessDetail = {
  title: string
  desc: string
}

export type AboutProcessStep = {
  step: number
  title: string
  titleEn: string
  description: string
  fullDescription: string
  duration: string
  details: AboutProcessDetail[]
  note: string
}

export type AboutTeamSectionProps = {
  team: AboutTeamMember[]
}

export type AboutValuesSectionProps = {
  values: AboutValue[]
}

export type AboutProcessSectionProps = {
  process: AboutProcessStep[]
}
