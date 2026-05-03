import type { ChangeEvent, FormEvent } from 'react'

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

export type ContactFormFieldElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

export type ContactFormProps = {
  budgetOptions: string[]
  errors: ContactFormErrors
  formData: ContactFormData
  formLoadTime: number
  handleChange: (event: ChangeEvent<ContactFormFieldElement>) => void
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
  isSubmitting: boolean
  serviceOptions: string[]
  submitError: string
}
