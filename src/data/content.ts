import type {
  BranchInfo,
  FacilityFeature,
  GalleryCategory,
  GalleryImage,
  MenuCategory,
  MenuItem,
  UsageStep,
} from '../types/content'

/**
 * Centralized restaurant configuration.
 * Every phone number, address, and business detail on the site is sourced from here —
 * update this single file to change what's shown across the whole site.
 */

export const restaurantName = '보성녹돈'

// TODO(owner): supply the exact Naver Map share URLs for each building.
// Until then these are placeholder search-query links so the buttons still work.
export const NAVER_MAP_MAIN_URL =
  'https://map.naver.com/p/search/울산광역시 남구 대학로 28 보성녹돈 본관'
export const NAVER_MAP_NEW_URL =
  'https://map.naver.com/p/search/울산광역시 남구 대학로 30 보성녹돈 신관'

export const businessHours = {
  display: '11:30–22:00',
  description: '매일 오전 11시 30분부터 오후 10시까지',
  breakTime: '브레이크타임 없이 운영합니다.',
  holidayNote: '설·추석 등 명절에는 영업시간이 달라질 수 있습니다.',
}

export const settingFee = {
  label: '상차림 안내',
  adult: { label: '성인 상차림비', amount: '6,000원' },
  child: { label: '어린이 상차림비', amount: '3,000원' },
  summary: '성인 6,000원 · 어린이 3,000원',
}

export const branches: BranchInfo[] = [
  {
    id: 'main',
    name: '보성녹돈 본관',
    shortName: '본관',
    addressDisplay: '울산광역시 남구 대학로 28',
    addressRoad: '대학로 28',
    contact: {
      label: '본관 예약·문의',
      phoneDisplay: '052-277-9533',
      phoneHref: 'tel:0522779533',
    },
    atmosphere: '오랜 시간 사랑받아 온 편안하고 익숙한 공간',
    recommendedFor: ['가족 외식', '돼지갈비', '편안한 식사', '단체 식사', '오래된 단골 고객'],
    description:
      '보성녹돈 본관은 오랫동안 무거동을 지켜온 편안하고 익숙한 공간입니다. 가족 외식과 단체 식사 모두 부담 없이 즐길 수 있습니다.',
    naverMapUrl: NAVER_MAP_MAIN_URL,
    imageSrc: '/images/branch/main-hall.jpg',
    imageAlt: '보성녹돈 본관 매장 전경',
  },
  {
    id: 'new-1f',
    name: '보성녹돈 신관 1층 식육점',
    shortName: '신관 1층 식육점',
    addressDisplay: '울산광역시 남구 대학로 30',
    addressRoad: '대학로 30',
    contact: {
      label: '신관 1층 식육점',
      phoneDisplay: '052-222-3779',
      phoneHref: 'tel:0522223779',
    },
    atmosphere: '직접 보고 고르는 신선한 한우·한돈 식육점',
    recommendedFor: ['직접 보고 고르는 고기', '한우와 한돈', '신선한 식육 판매', '포장 구매'],
    description:
      '신관 1층은 한우와 한돈을 직접 살펴보고 고를 수 있는 식육 판매 공간입니다. 신선한 고기를 눈으로 확인하고 선택하는 경험을 제공합니다.',
    naverMapUrl: NAVER_MAP_NEW_URL,
    imageSrc: '/images/branch/new-hall.jpg',
    imageAlt: '보성녹돈 신관 1층 식육점 내부',
  },
  {
    id: 'new-2f',
    name: '보성녹돈 신관 2층 식당',
    shortName: '신관 2층 식당',
    addressDisplay: '울산광역시 남구 대학로 30',
    addressRoad: '대학로 30',
    contact: {
      label: '신관 2층 식당',
      phoneDisplay: '052-223-9200',
      phoneHref: 'tel:0522239200',
    },
    atmosphere: '고기를 직접 고르고 즐기는 현대적인 식육식당',
    recommendedFor: ['한우 식사', '가족모임', '회식', '단체모임', '독립적인 식사 공간'],
    description:
      '신관 2층은 1층에서 고른 고기를 조금 더 고급스럽고 현대적인 분위기에서 편안하게 즐길 수 있는 식사 공간입니다.',
    naverMapUrl: NAVER_MAP_NEW_URL,
    imageSrc: '/images/branch/new-hall.jpg',
    imageAlt: '보성녹돈 신관 2층 식당 내부',
  },
]

export const mainBranch = branches[0]
export const newBranchButcherShop = branches[1]
export const newBranchRestaurant = branches[2]

export const menuCategories: MenuCategory[] = [
  { id: 'all', label: '전체 메뉴' },
  { id: 'main', label: '본관' },
  { id: 'new', label: '신관' },
  { id: 'hanwoo', label: '한우' },
  { id: 'handon', label: '한돈' },
  { id: 'meal', label: '식사류' },
]

/**
 * Placeholder menu data. Prices/items below are illustrative only — the owner has not
 * yet supplied the final menu list. Replace `price` and `description` per item once
 * confirmed; leave `isPlaceholder: true` until real data is entered so it stays easy
 * to find every item that still needs confirming.
 */
export const menuItems: MenuItem[] = [
  {
    id: 'hanwoo-deungsim',
    name: '한우 등심',
    categories: ['new', 'hanwoo'],
    price: null,
    unit: '1인분',
    description: '신관 1층 식육점에서 직접 고르는 한우 등심',
    isPlaceholder: true,
  },
  {
    id: 'hanwoo-chadolbaegi',
    name: '한우 차돌박이',
    categories: ['new', 'hanwoo'],
    price: null,
    unit: '1인분',
    description: '깔끔하고 담백한 한우 차돌박이',
    isPlaceholder: true,
  },
  {
    id: 'handon-samgyeopsal',
    name: '한돈 삼겹살',
    categories: ['main', 'new', 'handon'],
    price: null,
    unit: '1인분',
    description: '본관·신관에서 모두 즐길 수 있는 대표 한돈 메뉴',
    isPlaceholder: true,
  },
  {
    id: 'dwaeji-galbi',
    name: '돼지갈비',
    categories: ['main', 'handon'],
    price: null,
    unit: '1인분',
    description: '본관의 오랜 인기 메뉴',
    isPlaceholder: true,
  },
  {
    id: 'mokssal',
    name: '한돈 목살',
    categories: ['main', 'new', 'handon'],
    price: null,
    unit: '1인분',
    description: '부드럽고 든든한 한돈 목살',
    isPlaceholder: true,
  },
  {
    id: 'naengmyeon',
    name: '냉면',
    categories: ['main', 'new', 'meal'],
    price: null,
    unit: '1그릇',
    description: '식사류 대표 메뉴',
    isPlaceholder: true,
  },
  {
    id: 'doenjang-jjigae',
    name: '된장찌개',
    categories: ['main', 'new', 'meal'],
    price: null,
    unit: '1인분',
    description: '식사 마무리로 좋은 구수한 된장찌개',
    isPlaceholder: true,
  },
  {
    id: 'gomtang',
    name: '곰탕',
    categories: ['new', 'meal', 'hanwoo'],
    price: null,
    unit: '1그릇',
    description: '한우로 우려낸 든든한 한 그릇',
    isPlaceholder: true,
  },
]

export const fullMenuImage = {
  src: '/images/menu/full-menu.jpg',
  alt: '보성녹돈 전체 메뉴판',
}

export const galleryCategories: GalleryCategory[] = [
  { id: 'all', label: '전체' },
  { id: 'signature', label: '대표 메뉴' },
  { id: 'hanwoo', label: '한우' },
  { id: 'handon', label: '한돈' },
  { id: 'main', label: '본관' },
  { id: 'new', label: '신관' },
  { id: 'interior', label: '매장 내부' },
  { id: 'butcher', label: '식육점' },
  { id: 'group', label: '단체 공간' },
  { id: 'parking', label: '주차장' },
]

/**
 * Placeholder gallery list. Replace `src` with real photo files placed at the same
 * path (see public/images/README.md) and adjust captions as needed — everything else
 * (lightbox, categories, lazy loading) works automatically once the files exist.
 */
export const galleryImages: GalleryImage[] = [
  { id: 'g1', src: '/images/gallery/signature-01.jpg', alt: '보성녹돈 대표 메뉴 상차림', caption: '보성녹돈 대표 상차림', category: 'signature' },
  { id: 'g2', src: '/images/gallery/hanwoo-01.jpg', alt: '신선한 한우 고기', caption: '신선한 한우', category: 'hanwoo' },
  { id: 'g3', src: '/images/gallery/handon-01.jpg', alt: '신선한 한돈 고기', caption: '신선한 한돈', category: 'handon' },
  { id: 'g4', src: '/images/gallery/main-01.jpg', alt: '보성녹돈 본관 외부 전경', caption: '보성녹돈 본관', category: 'main' },
  { id: 'g5', src: '/images/gallery/main-02.jpg', alt: '보성녹돈 본관 내부 좌석', caption: '본관 내부 좌석', category: 'main' },
  { id: 'g6', src: '/images/gallery/new-01.jpg', alt: '보성녹돈 신관 외부 전경', caption: '보성녹돈 신관', category: 'new' },
  { id: 'g7', src: '/images/gallery/new-02.jpg', alt: '보성녹돈 신관 2층 식당 내부', caption: '신관 2층 식당', category: 'new' },
  { id: 'g8', src: '/images/gallery/interior-01.jpg', alt: '보성녹돈 매장 내부 전경', caption: '매장 내부', category: 'interior' },
  { id: 'g9', src: '/images/gallery/butcher-01.jpg', alt: '신관 1층 식육점 진열대', caption: '신관 1층 식육점', category: 'butcher' },
  { id: 'g10', src: '/images/gallery/group-01.jpg', alt: '단체 손님을 위한 넓은 공간', caption: '단체 모임 공간', category: 'group' },
  { id: 'g11', src: '/images/gallery/parking-01.jpg', alt: '매장 앞 주차 공간', caption: '주차장', category: 'parking' },
]

export const usageSteps: UsageStep[] = [
  {
    step: 1,
    title: '1층 식육점에서 고기를 고릅니다.',
    description: '신관 1층 식육점에서 한우와 한돈을 직접 살펴보고 원하는 부위를 고를 수 있습니다.',
    icon: 'select',
  },
  {
    step: 2,
    title: '선택한 고기를 준비해 드립니다.',
    description: '고른 고기를 손질하여 2층 식당에서 바로 드실 수 있도록 준비해 드립니다.',
    icon: 'prepare',
  },
  {
    step: 3,
    title: '2층 식당에서 편안하게 구워 드세요.',
    description: '신관 2층의 편안하고 독립적인 공간에서 여유롭게 식사를 즐기실 수 있습니다.',
    icon: 'enjoy',
  },
]

export const facilityFeatures: FacilityFeature[] = [
  { label: '가족 외식', icon: 'family' },
  { label: '회식', icon: 'group' },
  { label: '단체모임', icon: 'group' },
  { label: '넓은 식사 공간', icon: 'space' },
  { label: '편안한 좌석', icon: 'seat' },
  { label: '주차 가능', icon: 'parking' },
  { label: '예약 가능', icon: 'reserve' },
]

export const introduction = {
  heading: '고기를 잘 아는 보성녹돈',
  body: '보성녹돈은 한우와 한돈을 직접 살펴보고 선택해 즐길 수 있는 무거동 식육식당입니다. 본관과 신관은 서로 다른 분위기와 메뉴 구성을 갖추고 있어 가족 외식, 회식, 단체모임 등 방문 목적에 맞춰 선택할 수 있습니다.',
}

export const heroContent = {
  headline: ['좋은 고기를 고르는 순간부터', '보성녹돈의 식사는 시작됩니다.'],
  subtext:
    '한우와 한돈을 직접 보고 고르는 식육식당.\n본관과 신관에서 가족 외식부터 단체모임까지 편안하게 즐겨보세요.',
  primaryCta: { label: '메뉴 보기', href: '#menu' },
  secondaryCta: { label: '본관·신관 안내', href: '#branches' },
}

export const phoneContactNote =
  '본관과 신관은 메뉴와 분위기가 조금 다르므로 원하시는 매장으로 직접 문의해 주세요.'

export const siteMeta = {
  title: '보성녹돈 | 울산 무거동 한우·돼지갈비 식육식당',
  description:
    '울산 무거동 보성녹돈 본관·신관. 한우와 한돈을 직접 고르고 즐기는 식육식당으로 가족 외식, 회식, 단체모임, 예약 및 주차가 가능합니다.',
}
