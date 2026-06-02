// Professional Medical Human Body — Front View
// WebMD/Mayo Clinic quality SVG illustration
// Gender-neutral adult, medical grade, no cartoon elements
// ViewBox: 0 0 300 810

import React from 'react'

interface HumanBodyFrontProps {
  activeRegion: string | null
  hoveredRegion: string | null
  onRegionHover: (id: string | null) => void
  onRegionClick: (id: string) => void
}

const SKIN = '#eae4dc'
const SKIN_SHADOW = '#d5cdc2'
const SKIN_HIGHLIGHT = '#f2ede7'
const MUSCLE_LINE = '#c8bfb4'
const STROKE = '#b8b0a4'
const SW = '0.7'

// Teal highlight for active/hover
const getRegionStyle = (id: string, active: string | null, hovered: string | null) => {
  if (active === id) return { fill: 'rgba(20,184,166,0.32)', stroke: '#14b8a6', strokeWidth: '1.5' }
  if (hovered === id) return { fill: 'rgba(20,184,166,0.16)', stroke: '#14b8a6', strokeWidth: '1' }
  return { fill: 'transparent', stroke: 'transparent', strokeWidth: '0' }
}

const regionProps = (id: string, a: string | null, h: string | null, extra?: React.SVGProps<SVGPathElement | SVGEllipseElement | SVGRectElement>) => ({
  id,
  'data-region': id,
  style: { cursor: 'pointer', transition: 'fill 0.15s, stroke 0.15s' },
  ...getRegionStyle(id, a, h),
  ...extra,
})

export function HumanBodyFront({ activeRegion, hoveredRegion, onRegionHover, onRegionClick }: HumanBodyFrontProps) {
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
      aria-label="Human body front view"
    >
      <defs>
        <radialGradient id="body-grad-f" cx="50%" cy="38%" r="55%">
          <stop offset="0%" stopColor={SKIN_HIGHLIGHT}/>
          <stop offset="100%" stopColor={SKIN_SHADOW}/>
        </radialGradient>
        <radialGradient id="face-grad-f" cx="50%" cy="42%" r="52%">
          <stop offset="0%" stopColor="#f0ebe5"/>
          <stop offset="100%" stopColor={SKIN_SHADOW}/>
        </radialGradient>
        <filter id="soft-shadow" x="-10%" y="-5%" width="120%" height="115%">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.12"/>
        </filter>
      </defs>

      {/* ── BASE BODY SHAPES ─────────────────────────────── */}

      {/* Head */}
      <ellipse cx="150" cy="52" rx="42" ry="50"
        fill="url(#face-grad-f)" stroke={STROKE} strokeWidth={SW}/>

      {/* Neck */}
      <path d="M128 98 C127 104 126 112 126 118 L174 118 C174 112 173 104 172 98 Z"
        fill="url(#body-grad-f)" stroke={STROKE} strokeWidth={SW}/>

      {/* Torso */}
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
      " fill="url(#body-grad-f)" stroke={STROKE} strokeWidth={SW} filter="url(#soft-shadow)"/>

      {/* Left Arm */}
      <path d="
        M 48 148
        C 38 158 26 180 20 205
        C 16 222 16 242 18 260
        C 20 274 22 288 22 302
        C 22 314 20 326 20 338
        C 22 344 26 348 32 346
        C 38 344 40 336 42 326
        C 44 312 44 298 46 284
        C 48 268 52 254 54 238
        C 56 218 60 196 62 176
        C 60 162 54 152 48 148 Z
      " fill="url(#body-grad-f)" stroke={STROKE} strokeWidth={SW}/>

      {/* Left Forearm */}
      <path d="
        M 20 342
        C 16 354 14 370 14 386
        C 14 400 16 412 18 424
        C 20 434 22 444 22 452
        L 42 450
        C 44 440 44 430 44 420
        C 44 408 44 396 44 384
        C 46 368 46 354 44 342
        Z
      " fill="url(#body-grad-f)" stroke={STROKE} strokeWidth={SW}/>

      {/* Left Hand */}
      <path d="
        M 22 452
        C 18 460 16 468 16 476
        C 16 486 20 494 26 496
        C 34 498 44 492 48 482
        C 50 474 50 464 48 456
        L 42 450 Z
      " fill="url(#face-grad-f)" stroke={STROKE} strokeWidth={SW}/>

      {/* Right Arm */}
      <path d="
        M 252 148
        C 262 158 274 180 280 205
        C 284 222 284 242 282 260
        C 280 274 278 288 278 302
        C 278 314 280 326 280 338
        C 278 344 274 348 268 346
        C 262 344 260 336 258 326
        C 256 312 256 298 254 284
        C 252 268 248 254 246 238
        C 244 218 240 196 238 176
        C 240 162 246 152 252 148 Z
      " fill="url(#body-grad-f)" stroke={STROKE} strokeWidth={SW}/>

      {/* Right Forearm */}
      <path d="
        M 280 342
        C 284 354 286 370 286 386
        C 286 400 284 412 282 424
        C 280 434 278 444 278 452
        L 258 450
        C 256 440 256 430 256 420
        C 256 408 256 396 256 384
        C 254 368 254 354 256 342
        Z
      " fill="url(#body-grad-f)" stroke={STROKE} strokeWidth={SW}/>

      {/* Right Hand */}
      <path d="
        M 278 452
        C 282 460 284 468 284 476
        C 284 486 280 494 274 496
        C 266 498 256 492 252 482
        C 250 474 250 464 252 456
        L 258 450 Z
      " fill="url(#face-grad-f)" stroke={STROKE} strokeWidth={SW}/>

      {/* Pelvis / Hip area */}
      <path d="
        M 66 342
        C 62 352 60 366 60 378
        C 60 392 64 404 70 414
        L 132 418
        L 168 418
        L 230 414
        C 236 404 240 392 240 378
        C 240 366 238 352 234 342 Z
      " fill="url(#body-grad-f)" stroke={STROKE} strokeWidth={SW}/>

      {/* Left Thigh */}
      <path d="
        M 70 414
        C 64 424 60 438 58 454
        C 56 468 56 482 58 496
        C 60 508 64 518 68 530
        C 70 540 72 552 72 562
        L 108 558
        C 110 546 112 534 112 522
        C 112 510 110 498 108 486
        C 106 472 104 458 104 444
        C 104 432 106 420 108 410
        L 84 410 Z
      " fill="url(#body-grad-f)" stroke={STROKE} strokeWidth={SW}/>

      {/* Left Knee */}
      <path d="
        M 68 562
        C 64 572 62 582 62 592
        C 62 604 66 614 72 618
        C 78 622 88 622 96 618
        C 104 614 110 604 110 592
        C 110 582 108 572 106 562 Z
      " fill="url(#body-grad-f)" stroke={STROKE} strokeWidth={SW}/>

      {/* Left Lower Leg */}
      <path d="
        M 64 618
        C 60 630 58 644 58 658
        C 58 672 60 686 62 700
        C 64 712 66 724 66 736
        L 104 732
        C 106 720 108 708 110 696
        C 112 682 112 668 110 654
        C 110 640 108 628 106 618 Z
      " fill="url(#body-grad-f)" stroke={STROKE} strokeWidth={SW}/>

      {/* Left Foot */}
      <path d="
        M 66 736
        C 62 744 56 752 52 760
        C 48 770 48 780 54 786
        C 62 792 80 792 96 786
        C 108 782 114 772 112 762
        C 110 752 106 744 104 736 Z
      " fill="url(#face-grad-f)" stroke={STROKE} strokeWidth={SW}/>

      {/* Right Thigh */}
      <path d="
        M 230 414
        C 236 424 240 438 242 454
        C 244 468 244 482 242 496
        C 240 508 236 518 232 530
        C 230 540 228 552 228 562
        L 192 558
        C 190 546 188 534 188 522
        C 188 510 190 498 192 486
        C 194 472 196 458 196 444
        C 196 432 194 420 192 410
        L 216 410 Z
      " fill="url(#body-grad-f)" stroke={STROKE} strokeWidth={SW}/>

      {/* Right Knee */}
      <path d="
        M 232 562
        C 236 572 238 582 238 592
        C 238 604 234 614 228 618
        C 222 622 212 622 204 618
        C 196 614 190 604 190 592
        C 190 582 192 572 194 562 Z
      " fill="url(#body-grad-f)" stroke={STROKE} strokeWidth={SW}/>

      {/* Right Lower Leg */}
      <path d="
        M 236 618
        C 240 630 242 644 242 658
        C 242 672 240 686 238 700
        C 236 712 234 724 234 736
        L 196 732
        C 194 720 192 708 190 696
        C 188 682 188 668 190 654
        C 190 640 192 628 194 618 Z
      " fill="url(#body-grad-f)" stroke={STROKE} strokeWidth={SW}/>

      {/* Right Foot */}
      <path d="
        M 234 736
        C 238 744 244 752 248 760
        C 252 770 252 780 246 786
        C 238 792 220 792 204 786
        C 192 782 186 772 188 762
        C 190 752 194 744 196 736 Z
      " fill="url(#face-grad-f)" stroke={STROKE} strokeWidth={SW}/>

      {/* ── INTERNAL ANATOMICAL LINES (subtle) ───────── */}
      {/* Clavicle hints */}
      <path d="M 128 124 Q 100 128 66 144" stroke={MUSCLE_LINE} strokeWidth="0.5" fill="none" opacity="0.5"/>
      <path d="M 172 124 Q 200 128 234 144" stroke={MUSCLE_LINE} strokeWidth="0.5" fill="none" opacity="0.5"/>
      {/* Sternum line */}
      <line x1="150" y1="128" x2="150" y2="252" stroke={MUSCLE_LINE} strokeWidth="0.4" opacity="0.4"/>
      {/* Waist hint */}
      <path d="M 60 264 Q 150 268 240 264" stroke={MUSCLE_LINE} strokeWidth="0.4" fill="none" opacity="0.4"/>
      {/* Chest contour */}
      <path d="M 80 148 Q 110 168 120 190" stroke={MUSCLE_LINE} strokeWidth="0.4" fill="none" opacity="0.3"/>
      <path d="M 220 148 Q 190 168 180 190" stroke={MUSCLE_LINE} strokeWidth="0.4" fill="none" opacity="0.3"/>
      {/* Groin */}
      <path d="M 100 408 Q 150 416 200 408" stroke={MUSCLE_LINE} strokeWidth="0.4" fill="none" opacity="0.4"/>
      {/* Knee caps */}
      <ellipse cx="87" cy="592" rx="14" ry="12" stroke={MUSCLE_LINE} strokeWidth="0.5" fill="none" opacity="0.4"/>
      <ellipse cx="213" cy="592" rx="14" ry="12" stroke={MUSCLE_LINE} strokeWidth="0.5" fill="none" opacity="0.4"/>
      {/* Elbow hints */}
      <ellipse cx="30" cy="340" rx="9" ry="7" stroke={MUSCLE_LINE} strokeWidth="0.4" fill="none" opacity="0.3"/>
      <ellipse cx="270" cy="340" rx="9" ry="7" stroke={MUSCLE_LINE} strokeWidth="0.4" fill="none" opacity="0.3"/>

      {/* ── FACIAL FEATURES (minimal, clean) ─────────── */}
      <ellipse cx="135" cy="50" rx="5" ry="5.5" fill={SKIN_SHADOW} opacity="0.55"/>
      <ellipse cx="165" cy="50" rx="5" ry="5.5" fill={SKIN_SHADOW} opacity="0.55"/>
      <ellipse cx="135" cy="49" rx="3" ry="3.5" fill="#7a6e66" opacity="0.7"/>
      <ellipse cx="165" cy="49" rx="3" ry="3.5" fill="#7a6e66" opacity="0.7"/>
      <path d="M 138 66 Q 150 72 162 66" stroke={MUSCLE_LINE} strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.6"/>
      <path d="M 144 58 Q 150 56 156 58" stroke={MUSCLE_LINE} strokeWidth="0.6" fill="none" opacity="0.4"/>

      {/* ── INTERACTIVE REGION OVERLAYS ─────────────── */}
      {/* HEAD */}
      <ellipse cx="150" cy="52" rx="42" ry="50"
        {...rp('head')} style={{ cursor: 'pointer', transition: 'fill 0.15s, stroke 0.15s' }}/>
      {/* NECK */}
      <path d="M128 98 C127 104 126 112 126 118 L174 118 C174 112 173 104 172 98 Z"
        {...rp('neck')}/>
      {/* CHEST */}
      <path d="M90 122 L210 122 L238 160 L250 230 L200 250 L100 250 L50 230 L62 160 Z"
        {...rp('chest')}/>
      {/* UPPER ABDOMEN */}
      <path d="M60 248 L100 248 L200 248 L240 248 L238 298 L62 298 Z"
        {...rp('upper-abdomen')}/>
      {/* LOWER ABDOMEN */}
      <path d="M62 298 L238 298 L234 342 L66 342 Z"
        {...rp('lower-abdomen')}/>
      {/* LEFT SHOULDER */}
      <path d="M48 120 L90 120 L90 195 C72 195 40 185 30 162 C24 148 30 130 48 120 Z"
        {...rp('left-shoulder')}/>
      {/* RIGHT SHOULDER */}
      <path d="M252 120 L210 120 L210 195 C228 195 260 185 270 162 C276 148 270 130 252 120 Z"
        {...rp('right-shoulder')}/>
      {/* LEFT UPPER ARM */}
      <path d="M18 195 L62 195 L58 340 L16 336 Z"
        {...rp('left-upper-arm')}/>
      {/* RIGHT UPPER ARM */}
      <path d="M282 195 L238 195 L242 340 L284 336 Z"
        {...rp('right-upper-arm')}/>
      {/* LEFT ELBOW */}
      <ellipse cx="30" cy="340" rx="16" ry="14" {...rp('left-elbow')}/>
      {/* RIGHT ELBOW */}
      <ellipse cx="270" cy="340" rx="16" ry="14" {...rp('right-elbow')}/>
      {/* LEFT FOREARM */}
      <path d="M14 352 L44 350 L44 452 L16 452 Z"
        {...rp('left-forearm')}/>
      {/* RIGHT FOREARM */}
      <path d="M286 352 L256 350 L256 452 L284 452 Z"
        {...rp('right-forearm')}/>
      {/* LEFT HAND */}
      <path d="M16 450 L46 450 L50 496 C40 502 22 498 16 490 Z"
        {...rp('left-hand')}/>
      {/* RIGHT HAND */}
      <path d="M284 450 L254 450 L250 496 C260 502 278 498 284 490 Z"
        {...rp('right-hand')}/>
      {/* LEFT HIP */}
      <path d="M60 342 L148 342 L148 418 L68 418 C60 404 56 386 60 342 Z"
        {...rp('left-hip')}/>
      {/* RIGHT HIP */}
      <path d="M240 342 L152 342 L152 418 L232 418 C240 404 244 386 240 342 Z"
        {...rp('right-hip')}/>
      {/* LEFT THIGH */}
      <path d="M62 418 L134 418 L132 562 L62 558 Z"
        {...rp('left-thigh')}/>
      {/* RIGHT THIGH */}
      <path d="M238 418 L166 418 L168 562 L238 558 Z"
        {...rp('right-thigh')}/>
      {/* LEFT KNEE */}
      <ellipse cx="87" cy="592" rx="28" ry="32" {...rp('left-knee')}/>
      {/* RIGHT KNEE */}
      <ellipse cx="213" cy="592" rx="28" ry="32" {...rp('right-knee')}/>
      {/* LEFT LOWER LEG */}
      <path d="M58 622 L110 622 L110 736 L60 732 Z"
        {...rp('left-lower-leg')}/>
      {/* RIGHT LOWER LEG */}
      <path d="M242 622 L190 622 L190 736 L240 732 Z"
        {...rp('right-lower-leg')}/>
      {/* LEFT FOOT */}
      <path d="M58 734 L110 732 L116 786 C98 798 60 796 50 782 Z"
        {...rp('left-foot')}/>
      {/* RIGHT FOOT */}
      <path d="M242 734 L190 732 L184 786 C202 798 240 796 250 782 Z"
        {...rp('right-foot')}/>
    </svg>
  )
}
