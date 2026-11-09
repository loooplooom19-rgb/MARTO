import { useState } from 'react'
import Logo from './Logo'
import Icon from './Icon'
import type { Dict, Lang } from '../i18n'

type Props = {
  t: Dict
  lang: Lang
  onLang: (l: Lang) => void
  query: string
  onQuery: (q: string) => void
  cartCount: number
  wishCount: number
}

export default function Header({ t, lang, onLang, query, onQuery, cartCount, wishCount }: Props) {
  const [open, setOpen] = useState(false)
  const links = [
    { href: '#home', label: t.nav.home },
    { href: '#categories', label: t.nav.categories },
    { href: '#featured', label: t.nav.shop },
    { href: '#why', label: t.nav.why },
    { href: '#contact', label: t.nav.contact },
  ]

  return (
    <>
      <div className="announce">{t.announce}</div>
      <header className="header">
        <div className="container header-inner">
          <button className="icon-btn burger" onClick={() => setOpen(!open)} aria-label={t.menuLabel} aria-expanded={open}>
            <Icon name={open ? 'close' : 'menu'} />
          </button>
          <Logo />
          <nav className="nav" aria-label="Main">
            {links.map((l) => (
              <a key={l.href} href={l.href}>{l.label}</a>
            ))}
          </nav>
          <form className="search" role="search" onSubmit={(e) => e.preventDefault()}>
            <Icon name="search" size={18} />
            <input type="search" value={query} onChange={(e) => onQuery(e.target.value)} placeholder={t.search} aria-label={t.search} />
          </form>
          <div className="actions">
            <button className="lang-btn" onClick={() => onLang(lang === 'en' ? 'ml' : 'en')}>{t.switchLang}</button>
            <button className="icon-btn" aria-label={t.wishLabel}>
              <Icon name="heart" />
              {wishCount > 0 && <span className="count">{wishCount}</span>}
            </button>
            <button className="icon-btn" aria-label={t.cartLabel}>
              <Icon name="cart" />
              {cartCount > 0 && <span className="count">{cartCount}</span>}
            </button>
          </div>
        </div>
        {open && (
          <nav className="mnav" aria-label="Mobile">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
            ))}
          </nav>
        )}
      </header>
    </>
  )
}
