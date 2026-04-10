'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, Cookie, Settings, Check } from 'lucide-react'

type CookiePreferences = {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

const COOKIE_CONSENT_KEY = 'junkbranding-cookie-consent'

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  })
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    } else {
      // Load saved preferences
      try {
        const saved = JSON.parse(consent)
        setPreferences(saved)
      } catch {
        // Invalid stored data, show banner
        setIsVisible(true)
      }
    }
  }, [])

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs))
    setPreferences(prefs)
    
    // Apply cookie preferences
    if (prefs.analytics) {
      // Enable analytics (e.g., Google Analytics)
      // window.gtag && window.gtag('consent', 'update', { analytics_storage: 'granted' })
    }
    if (prefs.marketing) {
      // Enable marketing cookies
      // window.gtag && window.gtag('consent', 'update', { ad_storage: 'granted' })
    }
  }

  const handleAcceptAll = () => {
    const allAccepted = { necessary: true, analytics: true, marketing: true }
    savePreferences(allAccepted)
    closeWithAnimation()
  }

  const handleAcceptNecessary = () => {
    const onlyNecessary = { necessary: true, analytics: false, marketing: false }
    savePreferences(onlyNecessary)
    closeWithAnimation()
  }

  const handleSaveSettings = () => {
    savePreferences(preferences)
    closeWithAnimation()
  }

  const closeWithAnimation = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsVisible(false)
      setIsClosing(false)
    }, 300)
  }

  if (!isVisible) return null

  return (
    <div 
      className={`fixed bottom-4 right-4 z-[60] max-w-md transition-all duration-300 ${
        isClosing ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="bg-foreground text-background rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 pb-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <Cookie className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-base">Cookie設定</h3>
                <p className="text-xs text-background/60">プライバシー設定をカスタマイズ</p>
              </div>
            </div>
            <button
              onClick={handleAcceptNecessary}
              className="p-1.5 hover:bg-background/10 rounded-full transition-colors"
              aria-label="閉じる"
            >
              <X className="w-4 h-4 text-background/60" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {!showSettings ? (
            <>
              <p className="text-sm text-background/70 mb-5 leading-relaxed">
                当サイトでは、ユーザー体験の向上とアクセス解析のためにCookieを使用しています。
                <Link href="/privacy" className="text-accent hover:underline ml-1">
                  プライバシーポリシー
                </Link>
              </p>

              {/* Quick action buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleAcceptAll}
                  className="w-full py-3 px-4 bg-accent text-foreground font-medium rounded-xl hover:bg-accent/90 transition-colors text-sm"
                >
                  すべて許可
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={handleAcceptNecessary}
                    className="flex-1 py-2.5 px-4 bg-background/10 text-background font-medium rounded-xl hover:bg-background/20 transition-colors text-sm"
                  >
                    必要なもののみ
                  </button>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 bg-background/10 text-background font-medium rounded-xl hover:bg-background/20 transition-colors text-sm"
                  >
                    <Settings className="w-4 h-4" />
                    設定
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Detailed settings */}
              <div className="space-y-4 mb-5">
                {/* Necessary cookies */}
                <div className="flex items-start justify-between gap-4 p-3 bg-background/5 rounded-xl">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">必須Cookie</h4>
                      <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 bg-accent/20 text-accent rounded">
                        必須
                      </span>
                    </div>
                    <p className="text-xs text-background/60 mt-1">
                      サイトの基本機能に必要です
                    </p>
                  </div>
                  <div className="w-10 h-6 bg-accent rounded-full flex items-center justify-end pr-1">
                    <div className="w-4 h-4 bg-white rounded-full shadow" />
                  </div>
                </div>

                {/* Analytics cookies */}
                <div className="flex items-start justify-between gap-4 p-3 bg-background/5 rounded-xl">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">分析Cookie</h4>
                    <p className="text-xs text-background/60 mt-1">
                      サイトの利用状況を分析します
                    </p>
                  </div>
                  <button
                    onClick={() => setPreferences(prev => ({ ...prev, analytics: !prev.analytics }))}
                    className={`w-10 h-6 rounded-full flex items-center transition-colors ${
                      preferences.analytics ? 'bg-accent justify-end pr-1' : 'bg-background/20 justify-start pl-1'
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full shadow" />
                  </button>
                </div>

                {/* Marketing cookies */}
                <div className="flex items-start justify-between gap-4 p-3 bg-background/5 rounded-xl">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">マーケティングCookie</h4>
                    <p className="text-xs text-background/60 mt-1">
                      パーソナライズされた広告を表示します
                    </p>
                  </div>
                  <button
                    onClick={() => setPreferences(prev => ({ ...prev, marketing: !prev.marketing }))}
                    className={`w-10 h-6 rounded-full flex items-center transition-colors ${
                      preferences.marketing ? 'bg-accent justify-end pr-1' : 'bg-background/20 justify-start pl-1'
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full shadow" />
                  </button>
                </div>
              </div>

              {/* Settings action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 py-2.5 px-4 bg-background/10 text-background font-medium rounded-xl hover:bg-background/20 transition-colors text-sm"
                >
                  戻る
                </button>
                <button
                  onClick={handleSaveSettings}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-accent text-foreground font-medium rounded-xl hover:bg-accent/90 transition-colors text-sm"
                >
                  <Check className="w-4 h-4" />
                  保存
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
