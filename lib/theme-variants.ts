// Theme variants for Refined and Experimental modes
// Defines class names, color schemes, and visual effects for each mode

export const themeVariants = {
  refined: {
    // Background colors
    pageBg: 'bg-white',
    sectionBg: 'bg-gradient-to-br from-white via-slate-50/50 to-white',
    sectionAlt: 'bg-slate-50/80',
    cardBg: 'bg-white/70 backdrop-blur-xl border border-slate-200/50',
    
    // Text colors
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600',
    textMuted: 'text-slate-500',
    textAccent: 'text-navy-800',
    
    // Accent colors
    accentPrimary: 'bg-navy-900 text-white',
    accentSecondary: 'bg-slate-100 text-slate-900',
    
    // Effects
    glowEffect: 'shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)]',
    hoverGlow: 'hover:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.12)]',
    
    // Border
    border: 'border-slate-200/60',
    borderAccent: 'border-navy-900/20',
    
    // Animation classes
    animation: 'transition-all duration-500 ease-out',
  },
  
  experimental: {
    // Background colors - dark cyber theme
    pageBg: 'bg-[#0a0a0f]',
    sectionBg: 'bg-gradient-to-br from-[#0a0a0f] via-[#0f0f18] to-[#0a0a0f]',
    sectionAlt: 'bg-[#0f0f18]/80',
    cardBg: 'bg-black/40 backdrop-blur-xl border border-white/10',
    
    // Text colors
    textPrimary: 'text-white',
    textSecondary: 'text-white/70',
    textMuted: 'text-white/50',
    textAccent: 'text-cyan-400',
    
    // Accent colors
    accentPrimary: 'bg-white text-black',
    accentSecondary: 'bg-white/10 text-white',
    
    // Effects
    glowEffect: 'shadow-[0_0_40px_-10px_rgba(100,200,255,0.3)]',
    hoverGlow: 'hover:shadow-[0_0_60px_-10px_rgba(100,200,255,0.5)]',
    
    // Border
    border: 'border-white/10',
    borderAccent: 'border-cyan-400/30',
    
    // Animation classes
    animation: 'transition-all duration-300 ease-out',
  },
} as const

export type ThemeVariant = keyof typeof themeVariants

// CSS custom properties for each mode
export const modeCssVars = {
  refined: {
    '--mode-bg': '#ffffff',
    '--mode-bg-alt': '#f8fafc',
    '--mode-text': '#0f172a',
    '--mode-text-secondary': '#475569',
    '--mode-accent': '#1e3a5f',
    '--mode-border': 'rgba(148, 163, 184, 0.3)',
    '--mode-glow': 'rgba(0, 0, 0, 0.08)',
    '--mode-refraction': 'rgba(200, 220, 255, 0.15)',
  },
  experimental: {
    '--mode-bg': '#0a0a0f',
    '--mode-bg-alt': '#0f0f18',
    '--mode-text': '#ffffff',
    '--mode-text-secondary': 'rgba(255, 255, 255, 0.7)',
    '--mode-accent': '#00d4ff',
    '--mode-border': 'rgba(255, 255, 255, 0.1)',
    '--mode-glow': 'rgba(100, 200, 255, 0.3)',
    '--mode-refraction': 'rgba(255, 100, 200, 0.2)',
  },
} as const
