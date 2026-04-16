import LoginForm from '@/components/forms/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Left panel */}
      <div
        style={{
          width: '60%',
          background: 'var(--espresso)',
          padding: '48px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: -80,
            right: -80,
            width: 280,
            height: 280,
            borderRadius: '50%',
            background: 'var(--terracotta)',
            opacity: 0.12,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -60,
            left: -60,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'var(--amber-soft)',
            opacity: 0.08,
          }}
        />

        {/* Brand */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* <div style={{ width: 8, height: 8, background: "var(--terracotta)", borderRadius: "50%" }} /> */}
            <span
              style={{
                color: 'var(--sand-light)',
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            ></span>
          </div>
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              color: 'var(--sand-light)',
              fontSize: 38,
              lineHeight: 1.2,
              margin: '0 0 16px',
            }}
          >
            Student
            <br />
            <em style={{ color: 'var(--amber-soft)' }}>Registration</em>
            <br />
            Portal
          </h1>
          <p
            style={{
              color: 'var(--muted)',
              fontSize: 14,
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            A unified platform for managing student registrations, academic
            records, and administrative workflows.
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{ width: 24, height: 1, background: 'var(--terracotta)' }}
          />
          <span
            style={{ color: '#6B5C52', fontSize: 12, letterSpacing: '0.05em' }}
          >
            Secure · Fast · Reliable
          </span>
        </div>
      </div>

      {/* Right panel */}
      <div
        style={{
          flex: 1,
          padding: '48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'var(--cream)',
        }}
      >
        <div style={{ maxWidth: '100vw' }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--terracotta)',
              margin: '0 0 10px',
            }}
          >
            Welcome back
          </p>
          <h2
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 30,
              color: 'var(--espresso)',
              margin: '0 0 8px',
              lineHeight: 1.2,
            }}
          >
            Sign in to continue
          </h2>
          <p
            style={{
              fontSize: 14,
              color: 'var(--muted-dark)',
              margin: '0 0 32px',
            }}
          >
            Enter your credentials to access your account
          </p>

          <LoginForm />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              margin: '20px 0',
            }}
          >
            <div style={{ flex: 1, height: 1, background: 'var(--sand)' }} />
            <span style={{ fontSize: 12, color: '#B0A096' }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'var(--sand)' }} />
          </div>

          <p
            style={{
              textAlign: 'center',
              fontSize: 13,
              color: 'var(--muted-dark)',
              margin: 0,
            }}
          >
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              style={{
                color: 'var(--terracotta)',
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              Create one
            </Link>
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 20,
              padding: '10px 14px',
              background: 'var(--sand-light)',
              borderRadius: 8,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect
                x="1"
                y="5"
                width="10"
                height="7"
                rx="2"
                stroke="#8C7B6E"
                strokeWidth="1.2"
              />
              <path
                d="M3 5V3.5a3 3 0 016 0V5"
                stroke="#8C7B6E"
                strokeWidth="1.2"
              />
              <circle cx="6" cy="8.5" r="1" fill="#8C7B6E" />
            </svg>
            <span
              style={{
                fontSize: 11,
                color: 'var(--muted-dark)',
                flex: 1,
                textAlign: 'center',
              }}
            >
              Your session is encrypted and secured with JWT
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
