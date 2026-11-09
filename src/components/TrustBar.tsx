import Icon, { type IconName } from './Icon'
import type { Dict } from '../i18n'

const icons: IconName[] = ['shield', 'tag', 'headset', 'return', 'truck', 'card']

export default function TrustBar({ t }: { t: Dict }) {
  return (
    <section id="why" className="section section-soft">
      <div className="container">
        <div className="section-head"><h2>{t.trust.title}</h2></div>
        <div className="trust-grid">
          {t.trust.items.map((item, i) => (
            <div className="trust-item" key={item.title}>
              <span className="trust-icon"><Icon name={icons[i]} size={22} /></span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
