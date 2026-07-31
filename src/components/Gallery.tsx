import { useMemo, useState } from 'react'
import Reveal from './Reveal'
import SmartImage from './SmartImage'
import Lightbox from './Lightbox'
import { galleryCategories, galleryImages } from '../data/content'
import type { GalleryCategoryId } from '../types/content'

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategoryId>('all')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const filtered = useMemo(
    () =>
      activeCategory === 'all'
        ? galleryImages
        : galleryImages.filter((img) => img.category === activeCategory),
    [activeCategory],
  )

  return (
    <section id="gallery" className="bg-ivory-dark py-16 md:py-24" aria-labelledby="gallery-heading">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-brass-dark">매장사진</p>
          <h2 id="gallery-heading" className="mt-3 text-2xl font-extrabold text-charcoal md:text-3xl">
            보성녹돈을 사진으로 만나보세요
          </h2>
        </Reveal>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {galleryCategories.map((cat) => {
            const active = cat.id === activeCategory
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                aria-pressed={active}
                className={`min-h-[40px] rounded-full px-4 text-sm font-semibold transition-colors ${
                  active ? 'bg-charcoal text-ivory' : 'bg-white text-charcoal/70 ring-1 ring-charcoal/10'
                }`}
              >
                {cat.label}
              </button>
            )
          })}
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((img, i) => (
            <li key={img.id} className="group">
              <button
                type="button"
                onClick={() => setLightboxIndex(i)}
                className="block w-full overflow-hidden rounded-xl focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brass"
                aria-label={`${img.caption} 사진 크게 보기`}
              >
                <SmartImage
                  src={img.src}
                  alt={img.alt}
                  label="사진 준비중"
                  className="aspect-[4/3] w-full"
                  imgClassName="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </button>
              <p className="mt-2 text-sm font-medium text-charcoal/70">{img.caption}</p>
            </li>
          ))}
        </ul>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={filtered}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </section>
  )
}
