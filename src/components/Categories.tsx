import { categories } from '../data'
import type { Dict, Lang } from '../i18n'

type Props = {
  t: Dict
  lang: Lang
  selected: string
  onSelect: (id: string) => void
}

export default function Categories({ t, lang, selected, onSelect }: Props) {
  return (
    <section id="categories" className="section">
      <div className="container">
        <div className="section-head">
          <h2>{t.categoriesTitle}</h2>
        </div>

        <div className="cat-grid">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`cat ${selected === c.id ? 'selected' : ''}`}
              onClick={() => onSelect(c.id)}
              aria-pressed={selected === c.id}
            >
              <span className="cat-emoji" aria-hidden="true">{c.emoji}</span>
              <span>{c.name[lang]}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
