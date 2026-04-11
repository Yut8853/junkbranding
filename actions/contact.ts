'use server'

import { ContactSchema } from '@/lib/schema'
import { Resend } from 'resend'

// 🔥 環境変数チェック（本番事故防止）
if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set')
}

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail(formData: FormData) {
  // 1. データ抽出（型安全寄りに）
  const rawData = {
    name: formData.get('name')?.toString() || '',
    email: formData.get('email')?.toString() || '',
    company: formData.get('company')?.toString() || '',
    phone: formData.get('phone')?.toString() || '',
    service: formData.get('service')?.toString() || '',
    budget: formData.get('budget')?.toString() || '',
    message: formData.get('message')?.toString() || '',
    honeypot: formData.get('honeypot')?.toString() || '',
  }

  // 2. バリデーション
  const validatedFields = ContactSchema.safeParse(rawData)

  if (!validatedFields.success) {
    const errorMessage =
      validatedFields.error.errors[0]?.message || '入力内容に不備があります。'
    return { error: errorMessage }
  }

  const data = validatedFields.data

  // 3. スパム対策（ハニーポット）
  if (data.honeypot) {
    console.warn('Spam detected via honeypot')
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