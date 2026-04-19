'use server'

import { ContactSchema } from '@/lib/schema'
import { headers } from 'next/headers'
import { Resend } from 'resend'

// 環境変数チェック（本番事故防止）
if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set')
}

const resend = new Resend(process.env.RESEND_API_KEY)

// シンプルなインメモリレート制限（本番ではRedis推奨）
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1分
const RATE_LIMIT_MAX = 3 // 1分間に3回まで

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false
  }

  record.count++
  return true
}

// 古いレート制限レコードを定期的にクリーンアップ
setInterval(() => {
  const now = Date.now()
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip)
    }
  }
}, 60 * 1000)

export async function sendEmail(formData: FormData) {
  // 0. レート制限チェック
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0] || 
             headersList.get('x-real-ip') || 
             'unknown'

  if (!checkRateLimit(ip)) {
    return { error: '送信回数の上限に達しました。しばらく経ってから再度お試しください。' }
  }

  // 1. データ抽出（型安全寄りに）
  const rawData = {
    name: formData.get('name')?.toString().trim() || '',
    email: formData.get('email')?.toString().trim().toLowerCase() || '',
    company: formData.get('company')?.toString().trim() || '',
    phone: formData.get('phone')?.toString().trim() || '',
    service: formData.get('service')?.toString() || '',
    budget: formData.get('budget')?.toString() || '',
    message: formData.get('message')?.toString().trim() || '',
    honeypot: formData.get('honeypot')?.toString() || '',
    timestamp: formData.get('timestamp')?.toString() || '',
  }

  // 2. タイムスタンプチェック（ボット対策：3秒未満での送信はボットの可能性が高い）
  if (rawData.timestamp) {
    const submissionTime = parseInt(rawData.timestamp, 10)
    const now = Date.now()
    const timeDiff = now - submissionTime
    
    if (timeDiff < 3000) { // 3秒未満
      console.warn(`Suspicious fast submission: ${timeDiff}ms from IP: ${ip}`)
      return { success: true } // ボットには成功したように見せる
    }
  }

  // 3. バリデーション
  const validatedFields = ContactSchema.safeParse(rawData)

  if (!validatedFields.success) {
    const errorMessage =
      validatedFields.error.errors[0]?.message || '入力内容に不備があります。'
    return { error: errorMessage }
  }

  const data = validatedFields.data

  // 4. スパム対策（ハニーポット）
  if (data.honeypot) {
    console.warn(`Spam detected via honeypot from IP: ${ip}`)
    return { success: true }
  }

  try {
    // =========================
    // ① 管理者通知メール
    // =========================
    const adminResponse = await resend.emails.send({
      from: 'JunkBranding Contact <hello@junkbranding.com>',
      to: ['hello@junkbranding.com'],
      bcc: ['factory0611@gmail.com'],
      replyTo: data.email,
      subject: `【HPお問合せ】${data.name}様`,
      text: `
【お客様情報】
お名前: ${data.name}
メール: ${data.email}
会社名: ${data.company || '未記入'}
お電話: ${data.phone || '未記入'}

【ご相談内容】
ご依頼内容: ${data.service || '未選択'}
ご予算: ${data.budget || '未選択'}

メッセージ:
${data.message}

---
このメールは JunkBranding 公式サイトのフォームから送信されました。
      `,
    })

    if (adminResponse.error) {
      console.error(
        'Resend Admin Error:',
        JSON.stringify(adminResponse.error, null, 2)
      )
      return { error: 'メール送信に失敗しました（管理者通知）' }
    }

    // =========================
    // ② 自動返信メール（UX強化）
    // =========================
    const userResponse = await resend.emails.send({
      from: 'JunkBranding <hello@junkbranding.com>',
      to: [data.email],
      subject: 'お問い合わせありがとうございます',
      text: `
${data.name}様

この度はお問い合わせいただきありがとうございます。
内容を確認のうえ、木崎よりご連絡させていただきます。

▼送信内容
----------------------
${data.message}
----------------------

JunkBranding

〒300-0410
茨城県稲敷郡美浦村みどり台767-43

TEL：080-9155-0426（お急ぎの場合お気軽にお電話ください）
Email：hello@junkbranding.com
Web：https://junkbranding.com

営業時間：平日 10:00〜19:00

----------------------------------------
※本メールは自動送信です。
本メールに心当たりがない場合は破棄してください。
----------------------------------------
      `,
    })

    if (userResponse.error) {
      console.error(
        'Resend User Error:',
        JSON.stringify(userResponse.error, null, 2)
      )
      // ※ユーザー返信は失敗しても全体は成功扱いでもOK
    }

    return { success: true }
  } catch (error) {
    console.error('Server Error:', error)
    return {
      error: '接続エラーが発生しました。時間をおいて再度お試しください。',
    }
  }
}
