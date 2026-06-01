import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') ?? 'รู้ความเสี่ยง ก่อนโรครู้จักคุณ'
  const subtitle = searchParams.get('subtitle') ?? 'แพลตฟอร์มนำทางสุขภาพเชิงป้องกัน'
  const type = searchParams.get('type') ?? 'default'

  const bgColor = type === 'disease' ? '#1e1b4b' : '#0f172a'
  const accentColor = type === 'disease' ? '#a78bfa' : '#2dd4bf'
  const sources = ['WHO', 'MOPH Thailand', 'USPSTF', 'GRADE']

  return new ImageResponse(
    (
      <div style={{
        display: 'flex', width: '1200px', height: '630px',
        backgroundColor: bgColor, fontFamily: 'system-ui, sans-serif',
        flexDirection: 'column', justifyContent: 'space-between',
        padding: '60px 80px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: 'linear-gradient(135deg,#2dd4bf,#0891b2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: 'white', fontSize: '28px' }}>+</span>
          </div>
          <span style={{ color: 'white', fontSize: '26px', fontWeight: '700' }}>Health Compass</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            display: 'flex', padding: '6px 16px', borderRadius: '100px',
            border: '1px solid rgba(45,212,191,0.3)', backgroundColor: 'rgba(45,212,191,0.08)',
          }}>
            <span style={{ color: accentColor, fontSize: '15px', fontWeight: '600' }}>
              Thailand-First · Evidence-Based · Free
            </span>
          </div>
          <div style={{
            color: 'white', fontSize: title.length > 35 ? '46px' : '58px',
            fontWeight: '800', lineHeight: '1.15', maxWidth: '960px',
          }}>{title}</div>
          <div style={{ color: '#94a3b8', fontSize: '26px', lineHeight: '1.5' }}>{subtitle}</div>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {sources.map(src => (
            <div key={src} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 14px', borderRadius: '100px',
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <span style={{ color: accentColor, fontSize: '13px' }}>✓</span>
              <span style={{ color: '#cbd5e1', fontSize: '13px', fontWeight: '500' }}>{src}</span>
            </div>
          ))}
          <div style={{ flex: 1 }} />
          <span style={{ color: '#475569', fontSize: '15px' }}>healthcompass.th</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
