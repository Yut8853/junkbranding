import { Metadata } from 'next'
import ContactPageClient from '@/components/pages/contact-page'

export const metadata: Metadata = {
  title: 'お問い合わせ | JunkBranding',
}

export default function ContactPage() {
  return <ContactPageClient />
}