import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import TrustBar from './components/TrustBar'
import Categories from './components/Categories'
import ProductCard from './components/ProductCard'
import Footer from './components/Footer'
import { dict, type Lang } from './i18n'
import { sampleProducts } from './data'

function loadLang(): Lang {
  try {
    return localStorage.getItem('marto-lang') === 'ml' ? 'ml' : 'en'
  } catch {
    return 'en'
  }
}

export default function App() {
  const [lang, setLang] = useState<Lang>(loadLang)
  const [query, setQuery] = useState('')
  const [cart, setCart] = useState<number[]>([])
  const [wish, setWish] = useState<number[]>([])
  const t = dict[lang]

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem('marto-lang', lang)
    } catch {
      /* ignore */
    }
  }, [lang])

  const products = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return sampleProducts
    return sampleProducts.filter((p) => p.name.en.toLowerCase().includes(q) || p.name.ml.includes(query.trim()))
  }, [query])

  const toggleWish = (id: number) =>
    setWish((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]))

  return (
    <>
      <Header
        t={t}
        lang={lang}
        onLang={setLang}
        query={query}
        onQuery={setQuery}
        cartCount={cart.length}
        wishCount={wish.length}
      />
      <main>
        <Hero t={t} />
        <TrustBar t={t} />
        <Categories t={t} lang={lang} />
        <section id="featured" className="section section-soft">
          <div className="container">
            <div className="section-head">
              <h2>{t.featuredTitle}</h2>
              <p className="muted">{t.featuredNote}</p>
            </div>
            {products.length === 0 ? (
              <p className="muted">{t.empty}</p>
            ) : (
              <div className="product-grid">
                {products.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    lang={lang}
                    t={t}
                    wished={wish.includes(p.id)}
                    onWish={() => toggleWish(p.id)}
                    onAdd={() => setCart((c) => [...c, p.id])}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer t={t} />
    </>
  )
}
