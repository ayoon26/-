import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SmartImage from './SmartImage'
import { CloseIcon, MenuIcon, PhoneIcon } from './icons'
import { mainBranch } from '../data/content'

const navItems = [
  { label: '메뉴', href: '#menu' },
  { label: '본관·신관 안내', href: '#branches' },
  { label: '매장사진', href: '#gallery' },
  { label: '오시는 길', href: '#directions' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-black/5 bg-ivory/95 backdrop-blur transition-[padding,box-shadow] duration-300 ${
        scrolled ? 'shadow-card py-1.5' : 'py-3'
      }`}
    >
      <a
        href="#main-content"
        className="sr-only-focusable fixed left-2 top-2 z-[100] rounded bg-charcoal px-4 py-2 text-ivory"
      >
        본문 바로가기
      </a>
      <div className="container-page flex items-center justify-between gap-3">
        <a href="#top" className="flex items-center gap-2.5 shrink-0" aria-label="보성녹돈 홈으로 이동">
          <SmartImage
            src="/images/logo.svg"
            alt="보성녹돈 로고"
            label="LOGO"
            className={`shrink-0 rounded-md transition-all duration-300 ${scrolled ? 'h-9 w-9' : 'h-11 w-11'}`}
            imgClassName="h-full w-full object-contain"
          />
          <span className="text-lg font-bold tracking-tight text-charcoal md:text-xl">보성녹돈</span>
        </a>

        <nav className="hidden items-center gap-7 md:flex" aria-label="주요 메뉴">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[15px] font-medium text-charcoal/80 transition-colors hover:text-brass-dark"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <a
            href={mainBranch.contact.phoneHref}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-charcoal px-5 py-2.5 text-sm font-semibold text-ivory transition-colors hover:bg-brown-deep"
          >
            <PhoneIcon width={18} height={18} />
            전화하기
          </a>
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full text-charcoal transition-colors hover:bg-black/5 md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <CloseIcon width={26} height={26} /> : <MenuIcon width={26} height={26} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 top-0 z-40 bg-charcoal/50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              aria-hidden="true"
            />
            <motion.nav
              id="mobile-nav"
              aria-label="모바일 메뉴"
              className="fixed inset-x-0 top-0 z-50 rounded-b-2xl bg-ivory p-6 pt-24 shadow-card-hover md:hidden"
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <button
                type="button"
                onClick={closeMenu}
                aria-label="메뉴 닫기"
                className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full hover:bg-black/5"
              >
                <CloseIcon width={26} height={26} />
              </button>
              <ul className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={closeMenu}
                      className="flex min-h-[52px] items-center border-b border-black/5 text-lg font-semibold text-charcoal"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href={mainBranch.contact.phoneHref}
                className="mt-6 flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-charcoal text-lg font-semibold text-ivory"
              >
                <PhoneIcon width={20} height={20} />
                전화하기
              </a>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
