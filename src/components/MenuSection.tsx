import { useMemo, useState } from 'react'
import Reveal from './Reveal'
import Modal from './Modal'
import SmartImage from './SmartImage'
import { fullMenuImage, menuCategories, menuItems, settingFee } from '../data/content'
import type { MenuCategoryId } from '../types/content'

export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState<MenuCategoryId>('all')
  const [fullMenuOpen, setFullMenuOpen] = useState(false)

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return menuItems
    return menuItems.filter((item) => item.categories.includes(activeCategory))
  }, [activeCategory])

  return (
    <section id="menu" className="bg-ivory py-16 md:py-24" aria-labelledby="menu-heading">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-brass-dark">메뉴</p>
          <h2 id="menu-heading" className="mt-3 text-2xl font-extrabold text-charcoal md:text-3xl">
            보성녹돈 메뉴
          </h2>
          <p className="mt-4 text-base leading-relaxed text-charcoal/70 md:text-lg">
            정확한 최종 메뉴와 가격은 매장에서 확인해 주세요. 아래 목록은 대표 메뉴 구성입니다.
          </p>
        </Reveal>

        {/* Segmented category tabs — large touch targets, simple for elderly users */}
        <div
          role="tablist"
          aria-label="메뉴 카테고리"
          className="mt-10 flex flex-wrap justify-center gap-2"
        >
          {menuCategories.map((cat) => {
            const active = cat.id === activeCategory
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveCategory(cat.id)}
                className={`min-h-[46px] rounded-full px-5 text-[15px] font-bold transition-colors ${
                  active
                    ? 'bg-charcoal text-ivory'
                    : 'bg-white text-charcoal/70 ring-1 ring-charcoal/10 hover:ring-brass'
                }`}
              >
                {cat.label}
              </button>
            )
          })}
        </div>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <li
              key={item.id}
              className="rounded-xl bg-white p-5 shadow-card ring-1 ring-black/5"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-bold text-charcoal">{item.name}</h3>
                <span className="shrink-0 text-base font-extrabold text-brass-dark">
                  {/* Prices are not yet confirmed by the owner — show a clear "문의" placeholder instead of a fake number */}
                  {item.price ?? '가격 문의'}
                  {item.unit && <span className="ml-1 text-xs font-medium text-charcoal/50">/ {item.unit}</span>}
                </span>
              </div>
              {item.description && (
                <p className="mt-2 text-sm leading-relaxed text-charcoal/65">{item.description}</p>
              )}
            </li>
          ))}
        </ul>

        {/* Table setting fee — kept prominent per business requirement, never tiny text */}
        <div className="mx-auto mt-10 max-w-xl rounded-xl2 border-2 border-brass/30 bg-brass/5 p-6 text-center">
          <p className="text-sm font-bold text-brass-dark">{settingFee.label}</p>
          <p className="mt-1 text-xl font-extrabold text-charcoal md:text-2xl">{settingFee.summary}</p>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setFullMenuOpen(true)}
            className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-charcoal px-8 text-base font-bold text-ivory transition-colors hover:bg-brown-deep"
          >
            전체 메뉴 보기
          </button>
        </div>
      </div>

      <Modal open={fullMenuOpen} onClose={() => setFullMenuOpen(false)} title="보성녹돈 전체 메뉴">
        <h3 className="mb-4 pr-10 text-lg font-bold text-charcoal">보성녹돈 전체 메뉴</h3>
        <SmartImage
          src={fullMenuImage.src}
          alt={fullMenuImage.alt}
          label="전체 메뉴판 이미지 준비중"
          className="max-h-[70vh] w-full rounded-lg"
          imgClassName="h-auto w-full rounded-lg object-contain"
        />
        <p className="mt-3 text-sm text-charcoal/60">
          화면을 손가락으로 벌려 확대해서 보실 수 있습니다.
        </p>
      </Modal>
    </section>
  )
}
