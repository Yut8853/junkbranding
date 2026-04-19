'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, Phone, Mail } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Home', labelJa: 'トップ' },
  { href: '/about', label: 'About', labelJa: '私たちについて' },
  { href: '/works', label: 'Works', labelJa: '実績' },
  { href: '/pricing', label: 'Pricing', labelJa: '料金' },
  { href: '/contact', label: 'Contact', labelJa: 'お問い合わせ' },
]

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled 
            ? 'py-4 bg-background/80 backdrop-blur-xl border-b border-border/50' 
            : 'py-6 bg-transparent'
        }`}
      >
        <nav className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link 
            href="/" 
            className="relative group"
            aria-label="JunkBranding"
          >
            <span className="text-2xl md:text-3xl font-normal tracking-[0.02em] uppercase transition-colors duration-300 group-hover:text-accent font-display">
              JunkBranding
            </span>
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all duration-300 group-hover:w-full" />
          </Link>

          <ul className="hidden md:flex items-center gap-12">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="relative py-2 group"
                  onMouseEnter={() => setHoveredItem(item.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  <span 
                    className={`text-sm uppercase tracking-[0.15em] whitespace-nowrap transition-all duration-500 font-display font-semibold ${
                      pathname === item.href 
                        ? 'text-foreground' 
                        : 'text-muted-foreground group-hover:text-foreground'
                    }`}
                  >
                    {item.label}
                  </span>
                  
                  <span 
                    className={`absolute -bottom-1 left-0 h-[1px] bg-accent transition-all duration-300 ${
                      pathname === item.href 
                        ? 'w-full' 
                        : hoveredItem === item.href 
                        ? 'w-full' 
                        : 'w-0'
                    }`}
                  />
                  
                  <span 
                    className={`absolute top-full left-0 text-[10px] text-muted-foreground transition-all duration-300 ${
                      hoveredItem === item.href 
                        ? 'opacity-100 translate-y-1' 
                        : 'opacity-0 translate-y-0'
                    }`}
                  >
                    {item.labelJa}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative z-50 w-10 h-10 flex items-center justify-center text-foreground"
            aria-label={isOpen ? 'メニューを閉じる' : 'メニューを開く'}
            aria-expanded={isOpen}
          >
            <span className={`transition-all duration-300 ${isOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`}>
              <Menu size={24} />
            </span>
            <span className={`absolute transition-all duration-300 ${isOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`}>
              <X size={24} />
            </span>
          </button>
        </nav>
      </header>

      <div 
        className={`fixed inset-0 z-30 md:hidden transition-all duration-500 ${
          isOpen 
            ? 'opacity-100 pointer-events-auto' 
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div 
          className={`absolute inset-0 bg-background transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] origin-top ${
            isOpen ? 'scale-y-100' : 'scale-y-0'
          }`}
        />

        <nav 
          className="relative h-full flex flex-col items-center justify-center"
          aria-label="モバイルナビゲーション"
        >
          <ul className="flex flex-col items-center gap-8">
            {navItems.map((item, index) => (
              <li 
                key={item.href}
                className={`transition-all duration-500 ${
                  isOpen 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: isOpen ? `${index * 100 + 200}ms` : '0ms' }}
              >
                <Link
                  href={item.href}
                  className="group flex flex-col items-center"
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  <span 
                    className={`text-5xl sm:text-6xl font-black tracking-[-0.02em] transition-all duration-700 font-display uppercase ${
                      pathname === item.href ? 'text-foreground' : 'text-foreground/30 english-stroke group-hover:text-foreground'
                    }`}
                  >
                    {item.label}
                  </span>
                  <span className="text-sm text-muted-foreground mt-1">
                    {item.labelJa}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Contact info in mobile menu */}
          <div 
            className={`absolute bottom-20 flex flex-col items-center gap-4 transition-all duration-500 ${
              isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: isOpen ? '600ms' : '0ms' }}
          >
            <a 
              href="tel:08091550426" 
              className="flex items-center gap-2 text-accent hover:text-foreground transition-colors"
            >
              <Phone size={16} />
              <span>080-9155-0426</span>
            </a>
            <a 
              href="mailto:hello@junkbranding.com" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail size={16} />
              <span>hello@junkbranding.com</span>
            </a>
          </div>

          <div 
            className={`absolute bottom-8 flex items-center gap-4 text-xs text-muted-foreground transition-all duration-500 ${
              isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: isOpen ? '700ms' : '0ms' }}
          >
            <span>JunkBranding</span>
            <span className="w-8 h-[1px] bg-border" />
            <span>茨城 / 東京 / 千葉</span>
          </div>
        </nav>
      </div>
    </>
  )
}
