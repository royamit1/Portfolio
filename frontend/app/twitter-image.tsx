import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Roy Amit - Interactive Portfolio';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a', // slate-950
          backgroundImage: 'radial-gradient(circle at 25px 25px, #334155 2%, transparent 0%), radial-gradient(circle at 75px 75px, #334155 2%, transparent 0%)',
          backgroundSize: '100px 100px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1e293b', // slate-800
            padding: '40px 80px',
            borderRadius: '20px',
            border: '1px solid #334155',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: 'white',
              marginBottom: 20,
              letterSpacing: '-0.05em',
              background: 'linear-gradient(to bottom right, #fff, #94a3b8)',
              backgroundClip: 'text',
            }}
          >
            Roy Amit
          </div>
          <div
            style={{
              fontSize: 40,
              color: '#94a3b8', // slate-400
              fontWeight: 500,
            }}
          >
            Full-Stack Developer
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 30,
              gap: 20,
            }}
          >
            <div style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', borderRadius: '999px', fontSize: 24 }}>React</div>
            <div style={{ padding: '10px 20px', backgroundColor: '#eab308', color: 'black', borderRadius: '999px', fontSize: 24 }}>Python</div>
            <div style={{ padding: '10px 20px', backgroundColor: '#a855f7', color: 'white', borderRadius: '999px', fontSize: 24 }}>AI</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
