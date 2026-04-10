import { z } from 'zod'

// 日本語（ひらがな・カタカナ）が含まれているかチェックする関数
const containsJapanese = (val: string) => /[\u3040-\u309F\u30A0-\u30FF]/.test(val);

export const ContactSchema = z.object({
  name: z.string().min(1, 'お名前は必須です'),
  email: z.string().email('正しいメールアドレスを入力してください'),
  company: z.string().optional(),
  phone: z.string().optional(),
  service: z.string().optional(),
  budget: z.string().optional(),
  message: z.string()
    .min(10, 'お問い合わせ内容は10文字以上で入力してください')
    .refine(containsJapanese, {
      message: 'お問い合わせ内容は日本語で入力してください（スパム対策）',
    }),
  honeypot: z.string().max(0).optional(),
})