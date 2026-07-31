export interface ContactPoint {
  label: string
  phoneDisplay: string
  phoneHref: string
}

export interface BranchInfo {
  id: 'main' | 'new-1f' | 'new-2f'
  name: string
  shortName: string
  addressDisplay: string
  addressRoad: string
  contact: ContactPoint
  atmosphere: string
  recommendedFor: string[]
  description: string
  naverMapUrl: string
  imageSrc: string
  imageAlt: string
}

export type MenuCategoryId = 'all' | 'main' | 'new' | 'hanwoo' | 'handon' | 'meal'

export interface MenuCategory {
  id: MenuCategoryId
  label: string
}

export interface MenuItem {
  id: string
  name: string
  categories: MenuCategoryId[]
  price: string | null
  unit?: string
  description?: string
  isPlaceholder: boolean
}

export type GalleryCategoryId =
  | 'all'
  | 'signature'
  | 'hanwoo'
  | 'handon'
  | 'main'
  | 'new'
  | 'interior'
  | 'butcher'
  | 'group'
  | 'parking'

export interface GalleryCategory {
  id: GalleryCategoryId
  label: string
}

export interface GalleryImage {
  id: string
  src: string
  alt: string
  caption: string
  category: Exclude<GalleryCategoryId, 'all'>
}

export interface UsageStep {
  step: number
  title: string
  description: string
  icon: 'select' | 'prepare' | 'enjoy'
}

export interface FacilityFeature {
  label: string
  icon: 'family' | 'group' | 'seat' | 'parking' | 'reserve' | 'space'
}
