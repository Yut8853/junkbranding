export type ContactFormData = {
  name: string
  email: string
  company: string
  phone: string
  service: string
  budget: string
  message: string
}

export type ContactFormErrors = Partial<Record<keyof ContactFormData, string>>
