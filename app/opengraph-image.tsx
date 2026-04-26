import { ImageResponse } from 'next/og'

export const alt = 'JunkBranding - 茨城・東京・神奈川のブランディング & Web制作'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background:
            'linear-gradient(135deg, #faf9fb 0%, #f2edf5 42%, #efe8dc 100%)',
          color: '#17131d',
          padding: '72px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 28,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#7c4d6f',
          }}
        >
          <span>JunkBranding</span>
          <span>Ibaraki / Tokyo / Kanagawa</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div
            style={{
              fontSize: 92,
              lineHeight: 1,
              fontWeight: 800,
              letterSpacing: '-0.06em',
              maxWidth: 980,
            }}
          >
            Brand Identity into Results.
          </div>
          <div
            style={{
              fontSize: 34,
              lineHeight: 1.5,
              color: '#5f5667',
              maxWidth: 860,
            }}
          >
            Branding & Web Design Studio for Ibaraki, Tokyo and Kanagawa
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            fontSize: 30,
            color: '#17131d',
          }}
        >
          <div
            style={{
              width: 72,
              height: 2,
              background: '#b86b9b',
            }}
          />
          <span>Web Design / Branding / Development</span>
        </div>
      </div>
    ),
    size
  )
}

