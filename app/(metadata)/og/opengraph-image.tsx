import { ImageResponse } from 'next/og'
 
// Route segment config
export const runtime = 'edge'
 
// Image metadata
export const alt = 'Yuub'
export const size = {
  width: 1200,
  height: 630,
}
 
export const contentType = 'image/png'
 
// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#fff',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '40px',
        }}
      >
        <svg
          viewBox="0 0 24 24"
          width="200"
          height="200"
          fill="#000000"
        >
          <path d="M12,2C8.13,2,5,5.13,5,9c0,1.74,0.5,3.37,1.41,4.84c0.95,1.54,2.2,2.86,3.16,4.4c0.47,0.75,0.81,1.45,1.17,2.26 C11,21.05,11.21,22,12,22c0.79,0,1-0.95,1.25-1.5c0.37-0.81,0.7-1.51,1.17-2.26c0.96-1.53,2.21-2.85,3.16-4.4 C18.5,12.37,19,10.74,19,9C19,5.13,15.87,2,12,2z M15.96,12.83c-0.76,1.23-1.74,2.31-2.54,3.56c-0.35,0.55-0.67,1.13-0.95,1.71 c-0.28-0.58-0.6-1.16-0.95-1.71c-0.8-1.25-1.78-2.33-2.54-3.56C8.39,11.63,8,10.34,8,9c0-2.21,1.79-4,4-4s4,1.79,4,4 C16,10.34,15.61,11.63,15.96,12.83z M11,9c0,0.55,0.45,1,1,1s1-0.45,1-1s-0.45-1-1-1S11,8.45,11,9z M14,9c0,0.55,0.45,1,1,1 s1-0.45,1-1s-0.45-1-1-1S14,8.45,14,9z M9,9c0,0.55,0.45,1,1,1s1-0.45,1-1s-0.45-1-1-1S9,8.45,9,9z"/>
        </svg>
        <div style={{ fontSize: 64, color: '#000', fontFamily: 'sans-serif' }}>Yuub</div>
      </div>
    ),
    {
      ...size,
    }
  )
}
