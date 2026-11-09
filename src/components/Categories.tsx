import { categories } from '../data'
import type { Dict, Lang } from '../i18n'

export default function Categories({ t, lang }: { t: Dict; lang: Lang }) {
  return (
    <section id="categories" className="section">
      <div className="container">
        <div className="section-head"><h2>{t.categoriesTitle}</h2></div>
        <div className="cat-grid">
          {categories.map((c) => (
            <a key={c.id} href="#featured" className="cat">
              <span className="cat-emoji" aria-hidden="true">{c.emoji}</span>
              <span>{c.name[lang]}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
