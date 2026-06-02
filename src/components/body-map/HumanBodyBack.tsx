// Professional Medical Human Body — Back View
// ViewBox: 0 0 300 810

import React from 'react'

interface HumanBodyBackProps {
  activeRegion: string | null
  hoveredRegion: string | null
  onRegionHover: (id: string | null) => void
  onRegionClick: (id: string) => void
}

const SKIN = '#eae4dc'
const SKIN_SHADOW = '#d5cdc2'
const SKIN_HIGHLIGHT = '#f0ebe5'
const MUSCLE_LINE = '#c4bbb0'
const STROKE = '#b8b0a4'
const SW = '0.7'

const getRegionStyle = (id: string, active: string | null, hovered: string | null) => {
  if (active === id) return { fill: 'rgba(20,184,166,0.32)', stroke: '#14b8a6', strokeWidth: '1.5' }
  if (hovered === id) return { fill: 'rgba(20,184,166,0.16)', stroke: '#14b8a6', strokeWidth: '1' }
  return { fill: 'transparent', stroke: 'transparent', strokeWidth: '0' }
}

export function HumanBodyBack({ activeRegion, hoveredRegion, onRegionHover, onRegionClick }: HumanBodyBackProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rp = (id: string): any => ({
    id,
    'data-region': id,
    style: { cursor: 'pointer', transition: 'fill 0.15s, stroke 0.15s' },
    ...getRegionStyle(id, activeRegion, hoveredRegion),
    onMouseEnter: () => onRegionHover(id),
    onMouseLeave: () => onRegionHover(null),
    onClick: () => onRegionClick(id),
  })

  return (
    <svg
      viewBox="0 0 300 810"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full select-none"
      aria-label="Human body back view"
    >
      <defs>
        <radialGradient id="body-grad-b" cx="50%" cy="38%" r="55%">
          <stop offset="0%" stopColor={SKIN_HIGHLIGHT}/>
          <stop offset="100%" stopColor={SKIN_SHADOW}/>
        </radialGradient>
        <filter id="soft-shadow-b" x="-10%" y="-5%" width="120%" height="115%">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.12"/>
        </filter>
      </defs>

      {/* ── BASE SHAPES ─────────────────────────────── */}

      {/* Head (back) */}
      <ellipse cx="150" cy="52" rx="42" ry="50"
        fill="url(#body-grad-b)" stroke={STROKE} strokeWidth={SW}/>
      {/* Hair texture hint */}
      <path d="M 110 30 Q 150 15 190 30" stroke={MUSCLE_LINE} strokeWidth="0.5" fill="none" opacity="0.4"/>

      {/* Neck */}
      <path d="M128 98 C127 104 126 112 126 118 L174 118 C174 112 173 104 172 98 Z"
        fill="url(#body-grad-b)" stroke={STROKE} strokeWidth={SW}/>

      {/* Back Torso */}
      <path d="
        M 126 118
        C 106 120 64 130 46 150
        C 32 165 28 188 30 210
        C 32 228 42 240 46 258
        C 50 272 52 288 56 302
        C 58 314 62 326 66 342
        L 234 342
        C 238 326 242 314 244 302
        C 248 288 250 272 254 258
        C 258 240 268 228 270 210
        C 272 188 268 165 254 150
        C 236 130 194 120 174 118
        Z
      " fill="url(#body-grad-b)" stroke={STROKE} strokeWidth={SW} filter="url(#soft-shadow-b)"/>

      {/* Left Arm */}
      <path d="
        M 48 148 C 38 158 26 180 20 205
        C 16 222 16 242 18 260 C 20 274 22 288 22 302
        C 22 314 20 326 20 338 C 22 344 26 348 32 346
        C 38 344 40 336 42 326 C 44 312 44 298 46 284
        C 48 268 52 254 54 238 C 56 218 60 196 62 176
        C 60 162 54 152 48 148 Z
      " fill="url(#body-grad-b)" stroke={STROKE} strokeWidth={SW}/>
      <path d="M20 342 C16 354 14 370 14 386 C14 400 16 412 18 424 C20 434 22 444 22 452 L42 450 C44 440 44 430 44 420 C44 408 44 396 44 384 C46 368 46 354 44 342 Z"
        fill="url(#body-grad-b)" stroke={STROKE} strokeWidth={SW}/>
      <path d="M22 452 C18 460 16 468 16 476 C16 486 20 494 26 496 C34 498 44 492 48 482 C50 474 50 464 48 456 L42 450 Z"
        fill="#e8e2d8" stroke={STROKE} strokeWidth={SW}/>

      {/* Right Arm */}
      <path d="
        M 252 148 C 262 158 274 180 280 205
        C 284 222 284 242 282 260 C 280 274 278 288 278 302
        C 278 314 280 326 280 338 C 278 344 274 348 268 346
        C 262 344 260 336 258 326 C 256 312 256 298 254 284
        C 252 268 248 254 246 238 C 244 218 240 196 238 176
        C 240 162 246 152 252 148 Z
      " fill="url(#body-grad-b)" stroke={STROKE} strokeWidth={SW}/>
      <path d="M280 342 C284 354 286 370 286 386 C286 400 284 412 282 424 C280 434 278 444 278 452 L258 450 C256 440 256 430 256 420 C256 408 256 396 256 384 C254 368 254 354 256 342 Z"
        fill="url(#body-grad-b)" stroke={STROKE} strokeWidth={SW}/>
      <path d="M278 452 C282 460 284 468 284 476 C284 486 280 494 274 496 C266 498 256 492 252 482 C250 474 250 464 252 456 L258 450 Z"
        fill="#e8e2d8" stroke={STROKE} strokeWidth={SW}/>

      {/* Glutes */}
      <path d="M66 342 C60 356 58 374 60 392 C62 406 68 418 80 422 L148 424 L152 424 L220 422 C232 418 238 406 240 392 C242 374 240 356 234 342 Z"
        fill="url(#body-grad-b)" stroke={STROKE} strokeWidth={SW}/>

      {/* Left Leg */}
      <path d="M72 422 C66 436 62 452 62 468 C62 484 66 498 70 512 C74 524 78 538 80 552 L116 548 C118 534 118 520 116 506 C114 492 112 478 112 464 C112 450 114 436 116 422 Z"
        fill="url(#body-grad-b)" stroke={STROKE} strokeWidth={SW}/>
      <ellipse cx="87" cy="590" rx="28" ry="32"
        fill="url(#body-grad-b)" stroke={STROKE} strokeWidth={SW}/>
      <path d="M60 620 L112 620 L110 734 L62 730 Z"
        fill="url(#body-grad-b)" stroke={STROKE} strokeWidth={SW}/>
      <path d="M62 732 L112 732 L118 784 C100 796 62 794 52 780 Z"
        fill="#e8e2d8" stroke={STROKE} strokeWidth={SW}/>

      {/* Right Leg */}
      <path d="M228 422 C234 436 238 452 238 468 C238 484 234 498 230 512 C226 524 222 538 220 552 L184 548 C182 534 182 520 184 506 C186 492 188 478 188 464 C188 450 186 436 184 422 Z"
        fill="url(#body-grad-b)" stroke={STROKE} strokeWidth={SW}/>
      <ellipse cx="213" cy="590" rx="28" ry="32"
        fill="url(#body-grad-b)" stroke={STROKE} strokeWidth={SW}/>
      <path d="M240 620 L188 620 L190 734 L238 730 Z"
        fill="url(#body-grad-b)" stroke={STROKE} strokeWidth={SW}/>
      <path d="M238 732 L188 732 L182 784 C200 796 238 794 248 780 Z"
        fill="#e8e2d8" stroke={STROKE} strokeWidth={SW}/>

      {/* ── BACK ANATOMY LINES ────────────────────── */}
      {/* Spine */}
      <line x1="150" y1="118" x2="150" y2="340" stroke={MUSCLE_LINE} strokeWidth="0.6" strokeDasharray="3,3" opacity="0.6"/>
      {/* Scapulae */}
      <path d="M 86 128 Q 88 168 96 188 Q 108 196 116 184 Q 122 166 116 140 Q 110 124 98 122 Z"
        stroke={MUSCLE_LINE} strokeWidth="0.6" fill="none" opacity="0.45"/>
      <path d="M 214 128 Q 212 168 204 188 Q 192 196 184 184 Q 178 166 184 140 Q 190 124 202 122 Z"
        stroke={MUSCLE_LINE} strokeWidth="0.6" fill="none" opacity="0.45"/>
      {/* Erector muscles */}
      <path d="M 138 122 Q 135 200 136 340" stroke={MUSCLE_LINE} strokeWidth="0.5" fill="none" opacity="0.35"/>
      <path d="M 162 122 Q 165 200 164 340" stroke={MUSCLE_LINE} strokeWidth="0.5" fill="none" opacity="0.35"/>
      {/* Glute crease */}
      <path d="M 88 420 Q 150 428 212 420" stroke={MUSCLE_LINE} strokeWidth="0.5" fill="none" opacity="0.45"/>
      {/* Inter-gluteal */}
      <line x1="150" y1="340" x2="150" y2="440" stroke={MUSCLE_LINE} strokeWidth="0.5" opacity="0.4"/>
      {/* Calf hints */}
      <path d="M 70 640 Q 84 660 78 690" stroke={MUSCLE_LINE} strokeWidth="0.5" fill="none" opacity="0.3"/>
      <path d="M 230 640 Q 216 660 222 690" stroke={MUSCLE_LINE} strokeWidth="0.5" fill="none" opacity="0.3"/>
      {/* Back of neck */}
      <path d="M 130 98 Q 150 94 170 98" stroke={MUSCLE_LINE} strokeWidth="0.5" fill="none" opacity="0.4"/>

      {/* ── INTERACTIVE OVERLAYS ─────────────────── */}
      {/* HEAD BACK */}
      <ellipse cx="150" cy="52" rx="42" ry="50" {...rp('head')}/>
      {/* NECK BACK */}
      <path d="M128 98 C127 104 126 112 126 118 L174 118 C174 112 173 104 172 98 Z" {...rp('neck')}/>
      {/* LEFT SHOULDER BACK */}
      <path d="M48 120 L90 120 L90 195 C72 195 40 185 30 162 C24 148 30 130 48 120 Z" {...rp('left-shoulder')}/>
      {/* RIGHT SHOULDER BACK */}
      <path d="M252 120 L210 120 L210 195 C228 195 260 185 270 162 C276 148 270 130 252 120 Z" {...rp('right-shoulder')}/>
      {/* SCAPULAR */}
      <path d="M 80 122 L 220 122 L 240 240 L 60 240 Z" {...rp('scapular-area')}/>
      {/* UPPER BACK */}
      <path d="M 70 122 L 230 122 L 245 240 L 55 240 Z" {...rp('upper-back')}/>
      {/* MID BACK */}
      <path d="M 58 240 L 242 240 L 244 318 L 56 318 Z" {...rp('mid-back')}/>
      {/* LOWER BACK */}
      <path d="M 56 318 L 244 318 L 242 342 L 58 342 Z" {...rp('lower-back')}/>
      {/* LEFT UPPER ARM */}
      <path d="M18 195 L62 195 L58 340 L16 336 Z" {...rp('left-upper-arm')}/>
      {/* RIGHT UPPER ARM */}
      <path d="M282 195 L238 195 L242 340 L284 336 Z" {...rp('right-upper-arm')}/>
      {/* LEFT ELBOW */}
      <ellipse cx="30" cy="340" rx="16" ry="14" {...rp('left-elbow')}/>
      {/* RIGHT ELBOW */}
      <ellipse cx="270" cy="340" rx="16" ry="14" {...rp('right-elbow')}/>
      {/* LEFT FOREARM */}
      <path d="M14 352 L44 350 L44 452 L16 452 Z" {...rp('left-forearm')}/>
      {/* RIGHT FOREARM */}
      <path d="M286 352 L256 350 L256 452 L284 452 Z" {...rp('right-forearm')}/>
      {/* LEFT HAND */}
      <path d="M16 450 L46 450 L50 496 C40 502 22 498 16 490 Z" {...rp('left-hand')}/>
      {/* RIGHT HAND */}
      <path d="M284 450 L254 450 L250 496 C260 502 278 498 284 490 Z" {...rp('right-hand')}/>
      {/* LEFT BUTTOCK */}
      <path d="M60 342 L148 342 L148 424 L62 422 C56 406 56 368 60 342 Z" {...rp('left-buttock')}/>
      {/* RIGHT BUTTOCK */}
      <path d="M240 342 L152 342 L152 424 L238 422 C244 406 244 368 240 342 Z" {...rp('right-buttock')}/>
      {/* LEFT THIGH BACK */}
      <path d="M62 422 L134 422 L130 552 L60 548 Z" {...rp('left-thigh')}/>
      {/* RIGHT THIGH BACK */}
      <path d="M238 422 L166 422 L170 552 L240 548 Z" {...rp('right-thigh')}/>
      {/* LEFT KNEE BACK */}
      <ellipse cx="87" cy="590" rx="28" ry="32" {...rp('left-knee')}/>
      {/* RIGHT KNEE BACK */}
      <ellipse cx="213" cy="590" rx="28" ry="32" {...rp('right-knee')}/>
      {/* LEFT CALF */}
      <path d="M60 622 L112 622 L110 734 L62 730 Z" {...rp('left-calf') as React.SVGProps<SVGPathElement>}
        onMouseEnter={() => onRegionHover('left-lower-leg')}
        onClick={() => onRegionClick('left-lower-leg')}/>
      {/* RIGHT CALF */}
      <path d="M240 622 L188 622 L190 734 L238 730 Z" {...rp('right-calf') as React.SVGProps<SVGPathElement>}
        onMouseEnter={() => onRegionHover('right-lower-leg')}
        onClick={() => onRegionClick('right-lower-leg')}/>
      {/* LEFT FOOT BACK */}
      <path d="M62 730 L112 732 L118 784 C100 796 62 794 52 780 Z" {...rp('left-foot')}/>
      {/* RIGHT FOOT BACK */}
      <path d="M238 730 L188 732 L182 784 C200 796 238 794 248 780 Z" {...rp('right-foot')}/>
    </svg>
  )
}
