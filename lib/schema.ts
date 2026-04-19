import { z } from 'zod'

// 日本語（ひらがな・カタカナ・漢字）が含まれているかチェック
const containsJapanese = (val: string) => /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(val)

// 危険なHTMLタグやスクリプトを検出
const containsDangerousContent = (val: string) => 
  /<script|javascript:|on\w+\s*=|<iframe|<object|<embed/i.test(val)

// 電話番号の形式チェック（日本の電話番号）
const isValidJapanesePhone = (val: string) => {
  if (!val) return true // optional
  const cleaned = val.replace(/[-\s]/g, '')
  return /^(0[789]0\d{8}|0\d{9,10})$/.test(cleaned)
}

// URLが過度に含まれていないかチェック（スパム対策）
const hasExcessiveUrls = (val: string) => {
  const urlPattern = /https?:\/\/[^\s]+/gi
  const matches = val.match(urlPattern)
  return matches && matches.length > 2
}

// サービスオプションのホワイトリスト
const validServices = [
  '', // 未選択
  'Webサイト制作',
  'ランディングページ制作',
  'ECサイト制作',
  'ブランディング',
  'ロゴデザイン',
  'その他',
] as const

// 予算オプションのホワイトリスト
const validBudgets = [
  '', // 未選択
  '〜30万円',
  '30万円〜50万円',
  '50万円〜100万円',
  '100万円〜',
  '未定・相談したい',
] as const

export const ContactSchema = z.object({
  name: z
    .string()
    .min(1, 'お名前は必須です')
    .max(100, 'お名前は100文字以内で入力してください')
    .refine((val) => !containsDangerousContent(val), {
      message: '不正な文字が含まれています',
    }),
  email: z
    .string()
    .email('正しいメールアドレスを入力してください')
    .max(254, 'メールアドレスが長すぎます')
    .refine((val) => !val.includes('+'), {
      message: '「+」を含むメールアドレスは使用できません',
    }),
  company: z
    .string()
    .max(200, '会社名は200文字以内で入力してください')
    .optional(),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || isValidJapanesePhone(val), {
      message: '正しい電話番号を入力してください（例: 090-1234-5678）',
    }),
  service: z
    .string()
    .optional()
    .refine((val) => !val || validServices.includes(val as typeof validServices[number]), {
      message: '不正なサービス選択です',
    }),
  budget: z
    .string()
    .optional()
    .refine((val) => !val || validBudgets.includes(val as typeof validBudgets[number]), {
      message: '不正な予算選択です',
    }),
  message: z
    .string()
    .min(10, 'お問い合わせ内容は10文字以上で入力してください')
    .max(5000, 'お問い合わせ内容は5000文字以内で入力してください')
    .refine(containsJapanese, {
      message: 'お問い合わせ内容は日本語で入力してください（スパム対策）',
    })
    .refine((val) => !containsDangerousContent(val), {
      message: '不正な文字が含まれています',
    })
    .refine((val) => !hasExcessiveUrls(val), {
      message: 'URLの記載が多すぎます',
    }),
  honeypot: z.string().max(0).optional(),
  // 送信時刻チェック用（ボット対策）
  timestamp: z.string().optional(),
})
