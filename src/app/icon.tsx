import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Image generation - Simple fern emoji favicon
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 28,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        🌿
      </div>
    ),
    {
      ...size,
    }
  )
}
