import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
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
          borderRadius: '4px',
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Fern stem */}
          <path
            d="M14 26 C14 22 13.9 18 14 6"
            stroke="#E8E4D9"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Fern fronds - left side */}
          <path d="M14 22 C11 20 8 20.5 6 19" stroke="#E8E4D9" strokeWidth="1.1" strokeLinecap="round" />
          <path d="M14 19 C10.5 17 7 17.5 5 16" stroke="#E8E4D9" strokeWidth="1.1" strokeLinecap="round" />
          <path d="M14 16 C9.5 13.5 6 14 4 12.5" stroke="#E8E4D9" strokeWidth="1.1" strokeLinecap="round" />
          <path d="M14 13 C10 10.5 7 11 5 9" stroke="#E8E4D9" strokeWidth="1.1" strokeLinecap="round" />
          <path d="M14 10 C11 8 8.5 8.5 7 7" stroke="#E8E4D9" strokeWidth="1.1" strokeLinecap="round" />
          {/* Fern fronds - right side */}
          <path d="M14 22 C17 20 20 20.5 22 19" stroke="#E8E4D9" strokeWidth="1.1" strokeLinecap="round" />
          <path d="M14 19 C17.5 17 21 17.5 23 16" stroke="#E8E4D9" strokeWidth="1.1" strokeLinecap="round" />
          <path d="M14 16 C18.5 13.5 22 14 24 12.5" stroke="#E8E4D9" strokeWidth="1.1" strokeLinecap="round" />
          <path d="M14 13 C18 10.5 21 11 23 9" stroke="#E8E4D9" strokeWidth="1.1" strokeLinecap="round" />
          <path d="M14 10 C17 8 19.5 8.5 21 7" stroke="#E8E4D9" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
