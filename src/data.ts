export type Bilingual = { en: string; ml: string }

export type Category = { id: string; emoji: string; name: Bilingual }

export type Product = {
  id: number
  name: Bilingual
  category: Bilingual
  price: number
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

// SAMPLE products for design preview only. Real products come from the database in Phase 3/4.
export const sampleProducts: Product[] = [
  {
    id: 1,
    name: { en: 'Cotton Everyday Kurti', ml: 'കോട്ടൺ കുർത്തി' },
    category: { en: 'Fashion', ml: 'ഫാഷൻ' },
    price: 499,
    emoji: '👗',
    gradient: 'linear-gradient(135deg,#E8EEFF,#C9D8FF)',
  },
  {
    id: 2,
    name: { en: 'Stainless Steel Bottle', ml: 'സ്റ്റെയിൻലെസ് സ്റ്റീൽ ബോട്ടിൽ' },
    category: { en: 'Home & Kitchen', ml: 'വീടും അടുക്കളയും' },
    price: 349,
    emoji: '🧴',
    gradient: 'linear-gradient(135deg,#EAF7F1,#CDEBDD)',
  },
  {
    id: 3,
    name: { en: 'Wireless Earbuds', ml: 'വയർലെസ് ഇയർബഡ്സ്' },
    category: { en: 'Accessories', ml: 'ആക്സസറീസ്' },
    price: 899,
    emoji: '🎧',
    gradient: 'linear-gradient(135deg,#F1EBFF,#DACBFF)',
  },
  {
    id: 4,
    name: { en: 'Kids School Backpack', ml: 'കുട്ടികളുടെ സ്കൂൾ ബാഗ്' },
    category: { en: 'Kids', ml: 'കുട്ടികൾ' },
    price: 599,
    emoji: '🎒',
    gradient: 'linear-gradient(135deg,#FFF3E2,#FFDDB0)',
  },
]
