export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="#home" className={`logo ${light ? 'logo-light' : ''}`} aria-label="MARTO home">
      <svg width="36" height="36" viewBox="0 0 64 64" aria-hidden="true">
        <rect width="64" height="64" rx="16" fill={light ? '#ffffff' : '#0B1F4B'} />
        <path d="M17 46V19l15 17 15-17v27" fill="none" stroke={light ? '#0B1F4B' : '#ffffff'} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="50" cy="14" r="4.5" fill="#2F6BFF" />
      </svg>
      <span className="logo-text">MARTO</span>
    </a>
  )
}
