import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { SectionReveal } from '@/components/motion/text-reveal'

export function ContactInfoSection() {
  return (
    <SectionReveal className="lg:col-span-1">
      <div className="space-y-10 lg:space-y-12">
        <div>
          <h2 className="type-card-title text-lg md:text-xl mb-4">お問い合わせ先</h2>
          <p className="type-body-compact text-sm text-muted-foreground">
            フォームまたはお電話にてお気軽にご連絡ください。1営業日以内にご返信いたします。
          </p>
        </div>

        <div className="space-y-6">
          <a
            href="mailto:hello@junkbranding.com"
            className="flex items-center gap-4 group"
          >
            <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
              <Mail size={16} className="text-muted-foreground" />
            </div>
            <div>
              <p className="type-label text-muted-foreground">
                Email
              </p>
              <p className="text-sm font-medium group-hover:text-foreground transition-colors">hello@junkbranding.com</p>
            </div>
          </a>

          <a
            href="tel:08091550426"
            className="flex items-center gap-4 group"
          >
            <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
              <Phone size={16} className="text-muted-foreground" />
            </div>
            <div>
              <p className="type-label text-muted-foreground">
                Phone
              </p>
              <p className="type-readable-number text-sm group-hover:text-foreground transition-colors">080-9155-0426</p>
            </div>
          </a>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center shrink-0">
              <MapPin size={16} className="text-muted-foreground" />
            </div>
            <div>
              <p className="type-label text-muted-foreground">
                Address
              </p>
              <p className="text-sm font-medium">〒300-0410</p>
              <p className="type-body-compact text-xs text-muted-foreground">茨城県稲敷郡美浦村みどり台767-43</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center">
              <Clock size={16} className="text-muted-foreground" />
            </div>
            <div>
              <p className="type-label text-muted-foreground">
                Business Hours
              </p>
              <p className="text-sm font-medium">平日 10:00 - 18:00</p>
            </div>
          </div>
        </div>
      </div>
    </SectionReveal>
  )
}
