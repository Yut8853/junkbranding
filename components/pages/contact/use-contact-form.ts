'use client'

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { sendEmail } from '@/actions/contact'
import type { ContactFormData, ContactFormErrors, ContactFormFieldElement } from '@/types/contact-page'

const initialFormData: ContactFormData = {
  name: '',
  email: '',
  company: '',
  phone: '',
  service: '',
  budget: '',
  message: '',
}

export function useContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData)
  const [errors, setErrors] = useState<ContactFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [formLoadTime] = useState(() => Date.now())

  useEffect(() => {
    if (isSubmitted) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [isSubmitted])

  const validateForm = (): boolean => {
    const newErrors: ContactFormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'お名前を入力してください'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスを入力してください'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '正しいメールアドレスを入力してください'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'お問い合わせ内容を入力してください'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const form = new FormData(e.currentTarget)
      const res = await sendEmail(form)

      if (res?.error) {
        setSubmitError(res.error)
        return
      }

      setIsSubmitted(true)
    } catch {
      setSubmitError('送信に失敗しました。しばらく経ってから再度お試しください。')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: ChangeEvent<ContactFormFieldElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return {
    errors,
    formData,
    formLoadTime,
    handleChange,
    handleSubmit,
    isSubmitted,
    isSubmitting,
    submitError,
  }
}
