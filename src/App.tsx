import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import TrustBar from './components/TrustBar'
import Categories from './components/Categories'
import ProductCard from './components/ProductCard'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import { dict, type Lang } from './i18n'
import { categories, getCategory, getProductStyle, type Product } from './data'
import { supabase } from './lib/supabase'

type ProductRow = {
  id: string
  name_en: string
  name_ml: string | null
  price: number
  original_price: number | null
  image_url: string | null
  category_id: string | null
  stock: number | null
}

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
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('featured')
  const [cart, setCart] = useState<Record<string, number>>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [wish, setWish] = useState<string[]>([])
  const [dbProducts, setDbProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [dbError, setDbError] = useState('')
  const t = dict[lang]
  const cartCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0)

  const addToCart = (id: string) => {
    const product = dbProducts.find((p) => p.id === id)
    if (!product) return

    setCart((current) => {
      const quantity = current[id] ?? 0
      if (quantity >= product.stock) return current
      return { ...current, [id]: quantity + 1 }
    })
  }

  const changeCartQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((current) => {
        const next = { ...current }
        delete next[id]
        return next
      })
      return
    }

    const product = dbProducts.find((p) => p.id === id)
    if (!product) return

    setCart((current) => ({
      ...current,
      [id]: Math.min(quantity, product.stock),
    }))
  }

  const removeFromCart = (id: string) => {
    setCart((current) => {
      const next = { ...current }
      delete next[id]
      return next
    })
  }

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem('marto-lang', lang)
    } catch {
      // Storage unavailable
    }
  }, [lang])

  useEffect(() => {
    let active = true

    async function loadProducts() {
      setLoading(true)
      setDbError('')

      const { data, error } = await supabase
        .from('products')
        .select('id,name_en,name_ml,price,original_price,image_url,category_id,stock')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (!active) return

      if (error) {
        console.error('MARTO products error:', error.message)
        setDbError(
          lang === 'ml'
            ? 'ഉൽപ്പന്നങ്ങൾ ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല. ദയവായി വീണ്ടും ശ്രമിക്കുക.'
            : 'Could not load products. Please try again.'
        )
        setDbProducts([])
        setLoading(false)
        return
      }

      const mapped: Product[] = ((data ?? []) as ProductRow[]).map((row) => {
        const categoryId = row.category_id ?? 'other'
        const productCategory = getCategory(categoryId)
        const style = getProductStyle(categoryId)

        return {
          id: row.id,
          name: {
            en: row.name_en,
            ml: row.name_ml || row.name_en,
          },
          category: productCategory.name,
          categoryId,
          price: Number(row.price),
          originalPrice: row.original_price == null
            ? null
            : Number(row.original_price),
          stock: Number(row.stock ?? 0),
          imageUrl: row.image_url,
          emoji: style.emoji,
          gradient: style.gradient,
        }
      })

      setDbProducts(mapped)
      setLoading(false)
    }

    loadProducts()

    return () => {
      active = false
    }
  }, [lang])

  const products = useMemo(() => {
    const q = query.trim().toLowerCase()

    let result = dbProducts.filter((p) => {
      const matchesSearch =
        !q ||
        p.name.en.toLowerCase().includes(q) ||
        p.name.ml.toLowerCase().includes(q) ||
        p.category.en.toLowerCase().includes(q) ||
        p.category.ml.toLowerCase().includes(q)

      const matchesCategory =
        category === 'all' || p.categoryId === category

      return matchesSearch && matchesCategory
    })

    if (sort === 'low') result = [...result].sort((a, b) => a.price - b.price)
    if (sort === 'high') result = [...result].sort((a, b) => b.price - a.price)
    if (sort === 'name') {
      result = [...result].sort((a, b) =>
        a.name.en.localeCompare(b.name.en)
      )
    }

    return result
  }, [dbProducts, query, category, sort])

  const toggleWish = (id: string) =>
    setWish((w) => w.includes(id) ? w.filter((x) => x !== id) : [...w, id])

  const selectCategory = (id: string) => {
    setCategory(id)
    document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <Header
        t={t}
        lang={lang}
        onLang={setLang}
        query={query}
        onQuery={setQuery}
        cartCount={cartCount}
        wishCount={wish.length}
        onCart={() => setCartOpen(true)}
      />

      <main id="home">
        <Hero t={t} />
        <TrustBar t={t} />

        <Categories
          t={t}
          lang={lang}
          selected={category}
          onSelect={selectCategory}
        />

        <section id="featured" className="section section-soft">
          <div className="container">
            <div className="section-head">
              <h2>{t.featuredTitle}</h2>
              <p className="muted">{t.featuredNote}</p>
            </div>

            <div className="catalog-toolbar">
              <div className="filter-chips">
                <button
                  className={`filter-chip ${category === 'all' ? 'active' : ''}`}
                  onClick={() => setCategory('all')}
                >
                  {t.allProducts}
                </button>

                {categories.map((c) => (
                  <button
                    key={c.id}
                    className={`filter-chip ${category === c.id ? 'active' : ''}`}
                    onClick={() => setCategory(c.id)}
                  >
                    {c.name[lang]}
                  </button>
                ))}
              </div>

              <label className="sort-control">
                <span>{t.sortLabel}</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="featured">{t.sortFeatured}</option>
                  <option value="low">{t.sortLow}</option>
                  <option value="high">{t.sortHigh}</option>
                  <option value="name">{t.sortName}</option>
                </select>
              </label>
            </div>

            <p className="result-count">
              {loading
                ? (lang === 'ml' ? 'ഉൽപ്പന്നങ്ങൾ ലോഡ് ചെയ്യുന്നു...' : 'Loading products...')
                : `${products.length} ${t.productsFound}`}
            </p>

            {loading ? (
              <div className="empty-products">
                <span>⏳</span>
                <h3>{lang === 'ml' ? 'ദയവായി കാത്തിരിക്കൂ' : 'Please wait'}</h3>
              </div>
            ) : dbError ? (
              <div className="empty-products">
                <span>⚠️</span>
                <h3>{dbError}</h3>
                <button
                  className="btn btn-primary"
                  onClick={() => window.location.reload()}
                >
                  {lang === 'ml' ? 'വീണ്ടും ശ്രമിക്കുക' : 'Try again'}
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="empty-products">
                <span>🔎</span>
                <h3>{t.empty}</h3>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setQuery('')
                    setCategory('all')
                    setSort('featured')
                  }}
                >
                  {t.clearFilters}
                </button>
              </div>
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
                    onAdd={() => addToCart(p.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer t={t} />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        products={dbProducts}
        cartItems={cart}
        lang={lang}
        onQuantity={changeCartQuantity}
        onRemove={removeFromCart}
        onOrderPlaced={() => setCart({})}
      />
    </>
  )
}
