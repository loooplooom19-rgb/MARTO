export type Bilingual = { en: string; ml: string }

export type Category = {
  id: string
  emoji: string
  name: Bilingual
}

export type Product = {
  id: string
  name: Bilingual
  category: Bilingual
  categoryId: string
  price: number
  originalPrice: number | null
  stock: number
  imageUrl: string | null
  emoji: string
  gradient: string
}

export const categories: Category[] = [
  { id: 'fashion', emoji: '👗', name: { en: 'Fashion', ml: 'ഫാഷൻ' } },
  { id: 'home', emoji: '🏠', name: { en: 'Home & Kitchen', ml: 'വീടും അടുക്കളയും' } },
  { id: 'beauty', emoji: '💄', name: { en: 'Beauty', ml: 'ബ്യൂട്ടി' } },
  { id: 'accessories', emoji: '🎧', name: { en: 'Accessories', ml: 'ആക്സസറീസ്' } },
  { id: 'kids', emoji: '🧸', name: { en: 'Kids', ml: 'കുട്ടികൾ' } },
  { id: 'gifts', emoji: '🎁', name: { en: 'Gifts', ml: 'സമ്മാനങ്ങൾ' } },
]

export function getCategory(id: string): Category {
  return categories.find((category) => category.id === id) ?? {
    id,
    emoji: '🛍️',
    name: { en: id, ml: id },
  }
}

export function getProductStyle(categoryId: string) {
  const styles: Record<string, { emoji: string; gradient: string }> = {
    fashion: { emoji: '👗', gradient: 'linear-gradient(135deg,#E8EEFF,#C9D8FF)' },
    home: { emoji: '🏠', gradient: 'linear-gradient(135deg,#EAF7F1,#CDEBDD)' },
    beauty: { emoji: '💄', gradient: 'linear-gradient(135deg,#FFF0F5,#FFD6E5)' },
    accessories: { emoji: '🎧', gradient: 'linear-gradient(135deg,#F1EBFF,#DACBFF)' },
    kids: { emoji: '🎒', gradient: 'linear-gradient(135deg,#FFF3E2,#FFDDB0)' },
    gifts: { emoji: '🎁', gradient: 'linear-gradient(135deg,#FFF0E8,#FFD6C2)' },
  }

  return styles[categoryId] ?? {
    emoji: '🛍️',
    gradient: 'linear-gradient(135deg,#EEF2F7,#DCE4EF)',
  }
}
