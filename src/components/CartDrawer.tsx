import { useState } from 'react'
import type { Product } from '../data'
import type { Lang } from '../i18n'
import { supabase } from '../lib/supabase'

type Props = {
  open: boolean
  onClose: () => void
  products: Product[]
  cartItems: Record<string, number>
  lang: Lang
  onQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
  onOrderPlaced: () => void
}

const money = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

function orderErrorMessage(err: unknown, ml: boolean): string {
  const raw = String((err as { message?: string } | null)?.message ?? '')
  if (raw.includes('phone number')) {
    return ml
      ? 'ഈ ഫോൺ നമ്പറിൽ നിന്ന് ഒരുപാട് ഓർഡറുകൾ ലഭിച്ചു. ദയവായി ഞങ്ങളെ ബന്ധപ്പെടുക.'
      : 'Too many orders were placed from this phone number. Please contact support.'
  }
  if (raw.includes('Too many orders') || raw.includes('many orders right now')) {
    return ml
      ? 'ഇപ്പോൾ ഒരുപാട് ഓർഡറുകൾ ലഭിക്കുന്നു. കുറച്ചു കഴിഞ്ഞ് വീണ്ടും ശ്രമിക്കുക.'
      : 'We are receiving many orders right now. Please try again in a little while.'
  }
  if (raw.includes('Insufficient stock') || raw.includes('Product unavailable')) {
    return ml
      ? 'ചില ഉൽപ്പന്നങ്ങൾ സ്റ്റോക്കിൽ ഇല്ല. പേജ് റിഫ്രഷ് ചെയ്ത് കാർട്ട് പരിശോധിക്കുക.'
      : 'Some items are no longer in stock. Please refresh the page and check your cart.'
  }
  if (raw.includes('Maximum 10')) {
    return ml
      ? 'ഒരു ഉൽപ്പന്നത്തിന്റെ 10 എണ്ണം വരെ മാത്രമേ ഓർഡർ ചെയ്യാനാകൂ.'
      : 'You can order up to 10 of one product.'
  }
  return ml
    ? 'ഓർഡർ പൂർത്തിയാക്കാനായില്ല. ദയവായി വീണ്ടും ശ്രമിക്കുക.'
    : 'Could not place your order. Please try again.'
}

export default function CartDrawer({
  open,
  onClose,
  products,
  cartItems,
  lang,
  onQuantity,
  onRemove,
  onOrderPlaced,
}: Props) {
  const [checkout, setCheckout] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [pincode, setPincode] = useState('')
  const [notes, setNotes] = useState('')
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')
  const [orderId, setOrderId] = useState('')

  if (!open) return null

  const items = Object.entries(cartItems)
    .map(([id, quantity]) => ({
      product: products.find((p) => p.id === id),
      quantity,
    }))
    .filter((item) => item.product)

  const total = items.reduce(
    (sum, item) => sum + item.product!.price * item.quantity,
    0
  )

  const ml = lang === 'ml'

  async function placeOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    if (!items.length) return

    const cleanPhone = phone.replace(/\D/g, '')
    if (cleanPhone.length !== 10) {
      setError(ml ? 'ശരിയായ 10 അക്ക മൊബൈൽ നമ്പർ നൽകുക.' : 'Enter a valid 10-digit mobile number.')
      return
    }

    if (!/^\d{6}$/.test(pincode.trim())) {
      setError(ml ? 'ശരിയായ 6 അക്ക PIN code നൽകുക.' : 'Enter a valid 6-digit PIN code.')
      return
    }

    setPlacing(true)

    try {
      const { data, error: rpcError } = await supabase.rpc('place_cod_order', {
        p_customer_name: customerName.trim(),
        p_phone: cleanPhone,
        p_address: address.trim(),
        p_pincode: pincode.trim(),
        p_items: items.map(({ product, quantity }) => ({
          product_id: product!.id,
          quantity,
        })),
        p_notes: notes.trim() || null,
      })

      if (rpcError) throw rpcError

      setOrderId(String(data))
      onOrderPlaced()
    } catch (err) {
      console.error('MARTO order error:', err)
      setError(orderErrorMessage(err, ml))
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="cart-overlay" onClick={onClose}>
      <aside
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={ml ? 'ഷോപ്പിംഗ് കാർട്ട്' : 'Shopping cart'}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cart-head">
          <div>
            <h2>{orderId ? (ml ? 'ഓർഡർ വിജയിച്ചു!' : 'Order Successful!') : checkout ? (ml ? 'Checkout' : 'Checkout') : (ml ? 'നിങ്ങളുടെ കാർട്ട്' : 'Your Cart')}</h2>
            <p>{orderId ? (ml ? 'നന്ദി! നിങ്ങളുടെ ഓർഡർ ലഭിച്ചു.' : 'Thank you! We received your order.') : `${items.length} ${ml ? 'ഉൽപ്പന്നങ്ങൾ' : 'products'}`}</p>
          </div>
          <button className="cart-close" onClick={onClose} aria-label="Close cart">✕</button>
        </div>

        {orderId ? (
          <div className="cart-empty">
            <span>✅</span>
            <h3>{ml ? 'ഓർഡർ സ്ഥിരീകരിച്ചു' : 'Your order is confirmed'}</h3>
            <p>{ml ? 'ഓർഡർ നമ്പർ:' : 'Order reference:'}</p>
            <strong style={{ wordBreak: 'break-all' }}>{orderId}</strong>
            <p>{ml ? 'പണം സാധനം ലഭിക്കുമ്പോൾ നൽകിയാൽ മതി.' : 'Pay cash when your order is delivered.'}</p>
            <button className="btn btn-primary" onClick={onClose}>
              {ml ? 'തുടരുക' : 'Continue Shopping'}
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="cart-empty">
            <span>🛍️</span>
            <h3>{ml ? 'നിങ്ങളുടെ കാർട്ട് കാലിയാണ്' : 'Your cart is empty'}</h3>
            <p>{ml ? 'ഇഷ്ടപ്പെട്ട ഉൽപ്പന്നങ്ങൾ ചേർക്കൂ' : 'Add products you love to get started.'}</p>
            <button className="btn btn-primary" onClick={onClose}>
              {ml ? 'ഷോപ്പിംഗ് തുടരുക' : 'Continue Shopping'}
            </button>
          </div>
        ) : checkout ? (
          <form className="checkout-form" onSubmit={placeOrder}>
            <button type="button" className="checkout-back" onClick={() => setCheckout(false)}>
              ← {ml ? 'കാർട്ടിലേക്ക് മടങ്ങുക' : 'Back to cart'}
            </button>

            <h3>{ml ? 'ഡെലിവറി വിവരങ്ങൾ' : 'Delivery Details'}</h3>

            <label>
              {ml ? 'പൂർണ്ണ പേര്' : 'Full Name'}
              <input required minLength={2} maxLength={80} value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder={ml ? 'നിങ്ങളുടെ പേര്' : 'Your name'} />
            </label>

            <label>
              {ml ? 'മൊബൈൽ നമ്പർ' : 'Mobile Number'}
              <input required type="tel" inputMode="numeric" maxLength={10} pattern="[0-9]{10}" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile number" />
            </label>

            <label>
              {ml ? 'വിലാസം' : 'Full Address'}
              <textarea required minLength={10} maxLength={500} value={address} onChange={(e) => setAddress(e.target.value)} placeholder={ml ? 'വീട്, സ്ഥലം, സമീപമുള്ള അടയാളം' : 'House, street, locality and landmark'} rows={3} />
            </label>

            <label>
              {ml ? 'PIN Code' : 'PIN Code'}
              <input required inputMode="numeric" maxLength={6} pattern="[0-9]{6}" value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="6-digit PIN code" />
            </label>

            <label>
              {ml ? 'കൂടുതൽ നിർദ്ദേശങ്ങൾ (ഐച്ഛികം)' : 'Delivery Note (Optional)'}
              <textarea maxLength={300} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={ml ? 'ഡെലിവറിക്കുള്ള നിർദ്ദേശങ്ങൾ' : 'Any delivery instructions'} rows={2} />
            </label>

            <div className="cod-info">
              <strong>💵 {ml ? 'Cash on Delivery' : 'Cash on Delivery'}</strong>
              <p>{ml ? 'സാധനം ലഭിക്കുമ്പോൾ പണം നൽകിയാൽ മതി.' : 'Pay cash when you receive your order.'}</p>
            </div>

            <div className="cart-total">
              <span>{ml ? 'ആകെ തുക' : 'Order Total'}</span>
              <strong>{money.format(total)}</strong>
            </div>

            {error && <p className="checkout-error">{error}</p>}

            <button className="btn btn-primary btn-block" type="submit" disabled={placing}>
              {placing ? (ml ? 'ഓർഡർ ചെയ്യുന്നു...' : 'Placing order...') : (ml ? 'ഓർഡർ നൽകുക' : 'Place Order')}
            </button>
          </form>
        ) : (
          <>
            <div className="cart-items">
              {items.map(({ product, quantity }) => {
                if (!product) return null
                return (
                  <div className="cart-item" key={product.id}>
                    <div className="cart-item-image" style={{ background: product.gradient }}>
                      {product.imageUrl ? <img src={product.imageUrl} alt={product.name[lang]} /> : <span>{product.emoji}</span>}
                    </div>
                    <div className="cart-item-info">
                      <h3>{product.name[lang]}</h3>
                      <strong>{money.format(product.price)}</strong>
                      <div className="cart-item-bottom">
                        <div className="quantity-control">
                          <button onClick={() => onQuantity(product.id, quantity - 1)} aria-label="Decrease quantity">−</button>
                          <span>{quantity}</span>
                          <button onClick={() => onQuantity(product.id, quantity + 1)} disabled={quantity >= product.stock} aria-label="Increase quantity">+</button>
                        </div>
                        <button className="cart-remove" onClick={() => onRemove(product.id)}>{ml ? 'നീക്കം ചെയ്യുക' : 'Remove'}</button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="cart-summary">
              <div className="cart-total">
                <span>{ml ? 'ആകെ തുക' : 'Subtotal'}</span>
                <strong>{money.format(total)}</strong>
              </div>
              <p>{ml ? 'ഡെലിവറി ചാർജ് പിന്നീട് അറിയിക്കും.' : 'Delivery charges will be confirmed separately.'}</p>
              <button className="btn btn-primary btn-block" onClick={() => setCheckout(true)}>
                {ml ? 'Checkout തുടരുക' : 'Proceed to Checkout'}
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
