import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import SmartImage from './SmartImage'
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from './icons'
import type { GalleryImage } from '../types/content'

interface LightboxProps {
  images: GalleryImage[]
  index: number
  onClose: () => void
  onNavigate: (nextIndex: number) => void
}

export default function Lightbox({ images, index, onClose, onNavigate }: LightboxProps) {
  const touchStartX = useRef<number | null>(null)
  const image = images[index]

  const goPrev = () => onNavigate((index - 1 + images.length) % images.length)
  const goNext = () => onNavigate((index + 1) % images.length)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  if (!image) return null

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex flex-col bg-charcoal/95"
        role="dialog"
        aria-modal="true"
        aria-label={`${image.caption} 사진 크게 보기`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return
          const delta = e.changedTouches[0].clientX - touchStartX.current
          if (delta > 50) goPrev()
          else if (delta < -50) goNext()
          touchStartX.current = null
        }}
      >
        <div className="flex items-center justify-between p-4">
          <p className="text-sm font-medium text-ivory/70">
            {index + 1} / {images.length}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-ivory/10 text-ivory hover:bg-ivory/20"
          >
            <CloseIcon width={22} height={22} />
          </button>
        </div>

        <div className="relative flex flex-1 items-center justify-center px-2 pb-4">
          <button
            type="button"
            onClick={goPrev}
            aria-label="이전 사진"
            className="absolute left-1 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/10 text-ivory hover:bg-ivory/20 sm:flex md:left-4"
          >
            <ChevronLeftIcon width={26} height={26} />
          </button>

          <figure className="flex max-h-full max-w-full flex-col items-center gap-3">
            <SmartImage
              src={image.src}
              alt={image.alt}
              label="사진 준비중"
              className="max-h-[65vh] max-w-full rounded-lg"
              imgClassName="max-h-[65vh] w-auto rounded-lg object-contain"
              loading="eager"
            />
            <figcaption className="text-center text-base font-medium text-ivory/90">{image.caption}</figcaption>
          </figure>

          <button
            type="button"
            onClick={goNext}
            aria-label="다음 사진"
            className="absolute right-1 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/10 text-ivory hover:bg-ivory/20 sm:flex md:right-4"
          >
            <ChevronRightIcon width={26} height={26} />
          </button>
        </div>

        <div className="flex justify-center gap-3 pb-6 sm:hidden">
          <button
            type="button"
            onClick={goPrev}
            aria-label="이전 사진"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-ivory/10 text-ivory"
          >
            <ChevronLeftIcon width={24} height={24} />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="다음 사진"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-ivory/10 text-ivory"
          >
            <ChevronRightIcon width={24} height={24} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  )
}
