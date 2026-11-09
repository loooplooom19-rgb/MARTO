import Icon from './Icon'
import type { Product } from '../data'
import type { Dict, Lang } from '../i18n'

const money = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

type Props = {
  product: Product
  lang: Lang
  t: Dict
  wished: boolean
  onWish: () => void
  onAdd: () => void
}

export default function ProductCard({
  product,
  lang,
  t,
  wished,
  onWish,
  onAdd,
}: Props) {
  return (
    <article className="card">
      <div className="card-img" style={{ background: product.gradient }}>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name[lang]}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <span className="card-emoji" aria-hidden="true">
            {product.emoji}
          </span>
        )}

        <span className="badge">MARTO</span>

        <button
          className={`wish ${wished ? 'on' : ''}`}
          onClick={onWish}
          aria-label={t.wishLabel}
          aria-pressed={wished}
        >
          <Icon
            name="heart"
            size={18}
            fill={wished ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      <div className="card-body">
        <p className="card-cat">{product.category[lang]}</p>
        <h3>{product.name[lang]}</h3>

        <p className="price">{money.format(product.price)}</p>

        {product.originalPrice && product.originalPrice > product.price && (
          <p className="muted" style={{ textDecoration: 'line-through' }}>
            {money.format(product.originalPrice)}
          </p>
        )}

        <button
          className="btn btn-primary btn-block"
          onClick={onAdd}
          disabled={product.stock <= 0}
        >
          {product.stock <= 0
            ? (lang === 'ml' ? 'സ്റ്റോക്ക് ഇല്ല' : 'Out of stock')
            : t.addToCart}
        </button>
      </div>
    </article>
  )
}
