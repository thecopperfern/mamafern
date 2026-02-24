import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#4A6741', // Fern green
          borderRadius: '36px',
        }}
      >
        <svg
          width="140"
          height="140"
          viewBox="0 0 140 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Fern stem */}
          <path
            d="M70 130 C70 110 69.5 90 70 30"
            stroke="#E8E4D9"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Fern fronds - left side */}
          <path d="M70 120 C55 110 40 112 28 105" stroke="#E8E4D9" strokeWidth="4" strokeLinecap="round" />
          <path d="M70 105 C52 95 35 97 23 90" stroke="#E8E4D9" strokeWidth="4" strokeLinecap="round" />
          <path d="M70 90 C47 78 30 80 18 72" stroke="#E8E4D9" strokeWidth="4" strokeLinecap="round" />
          <path d="M70 75 C50 63 35 65 25 57" stroke="#E8E4D9" strokeWidth="4" strokeLinecap="round" />
          <path d="M70 60 C55 50 42 52 32 45" stroke="#E8E4D9" strokeWidth="4" strokeLinecap="round" />
          <path d="M70 45 C58 37 48 39 40 33" stroke="#E8E4D9" strokeWidth="4" strokeLinecap="round" />
          {/* Fern fronds - right side */}
          <path d="M70 120 C85 110 100 112 112 105" stroke="#E8E4D9" strokeWidth="4" strokeLinecap="round" />
          <path d="M70 105 C88 95 105 97 117 90" stroke="#E8E4D9" strokeWidth="4" strokeLinecap="round" />
          <path d="M70 90 C93 78 110 80 122 72" stroke="#E8E4D9" strokeWidth="4" strokeLinecap="round" />
          <path d="M70 75 C90 63 105 65 115 57" stroke="#E8E4D9" strokeWidth="4" strokeLinecap="round" />
          <path d="M70 60 C85 50 98 52 108 45" stroke="#E8E4D9" strokeWidth="4" strokeLinecap="round" />
          <path d="M70 45 C82 37 92 39 100 33" stroke="#E8E4D9" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
