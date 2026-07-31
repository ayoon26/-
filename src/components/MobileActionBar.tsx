import { useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CloseIcon, DirectionsIcon, MenuIcon, PhoneIcon } from './icons'
import { mainBranch, newBranchButcherShop, newBranchRestaurant } from '../data/content'

export default function MobileActionBar() {
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <>
      <nav
        aria-label="빠른 메뉴"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-ivory/97 backdrop-blur md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <ul className="grid grid-cols-4">
          <li>
            <a
              href="#menu"
              className="flex min-h-[60px] flex-col items-center justify-center gap-1 text-[13px] font-semibold text-charcoal"
            >
              <MenuIcon width={22} height={22} />
              메뉴
            </a>
          </li>
          <li>
            <a
              href={mainBranch.contact.phoneHref}
              className="flex min-h-[60px] flex-col items-center justify-center gap-1 text-[13px] font-semibold text-charcoal"
            >
              <PhoneIcon width={22} height={22} />
              본관 전화
            </a>
          </li>
          <li>
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={sheetOpen}
              className="flex min-h-[60px] w-full flex-col items-center justify-center gap-1 text-[13px] font-semibold text-charcoal"
            >
              <PhoneIcon width={22} height={22} />
              신관 전화
            </button>
          </li>
          <li>
            <a
              href={mainBranch.naverMapUrl}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-[60px] flex-col items-center justify-center gap-1 text-[13px] font-semibold text-charcoal"
            >
              <DirectionsIcon width={22} height={22} />
              길찾기
            </a>
          </li>
        </ul>
      </nav>

      {createPortal(
        <AnimatePresence>
          {sheetOpen && (
            <>
              <motion.div
                className="fixed inset-0 z-[90] bg-charcoal/60 md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSheetOpen(false)}
              />
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="신관 전화 매장 선택"
                className="fixed inset-x-0 bottom-0 z-[95] rounded-t-2xl bg-ivory p-5 pb-8 shadow-card-hover md:hidden"
                style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)' }}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-lg font-extrabold text-charcoal">신관 전화하기</h2>
                  <button
                    type="button"
                    onClick={() => setSheetOpen(false)}
                    aria-label="닫기"
                    className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-black/5"
                  >
                    <CloseIcon width={22} height={22} />
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  <a
                    href={newBranchButcherShop.contact.phoneHref}
                    className="flex min-h-[56px] items-center justify-between rounded-xl border-2 border-charcoal/10 px-4"
                  >
                    <span>
                      <span className="block text-sm font-semibold text-charcoal/60">신관 1층 식육점</span>
                      <span className="block text-lg font-extrabold text-charcoal">
                        {newBranchButcherShop.contact.phoneDisplay}
                      </span>
                    </span>
                    <PhoneIcon width={22} height={22} className="text-brass-dark" />
                  </a>
                  <a
                    href={newBranchRestaurant.contact.phoneHref}
                    className="flex min-h-[56px] items-center justify-between rounded-xl border-2 border-charcoal/10 px-4"
                  >
                    <span>
                      <span className="block text-sm font-semibold text-charcoal/60">신관 2층 식당</span>
                      <span className="block text-lg font-extrabold text-charcoal">
                        {newBranchRestaurant.contact.phoneDisplay}
                      </span>
                    </span>
                    <PhoneIcon width={22} height={22} className="text-brass-dark" />
                  </a>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}
