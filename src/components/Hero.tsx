import Icon from './Icon'
import type { Dict } from '../i18n'

export default function Hero({ t }: { t: Dict }) {
  return (
    <section id="home" className="hero">
      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">{t.hero.eyebrow}</p>
          <h1>{t.hero.title}</h1>
          <p className="hero-text">{t.hero.text}</p>
          <div className="hero-actions">
            <a href="#featured" className="btn btn-light">{t.hero.cta} <Icon name="arrow" size={18} /></a>
            <a href="#categories" className="btn btn-outline-light">{t.hero.cta2}</a>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="tile t1">🛍️</div>
          <div className="tile t2">🎧</div>
          <div className="tile t3">👗</div>
          <div className="tile t4">🏠</div>
        </div>
      </div>
    </section>
  )
}
