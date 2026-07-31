import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import SmartImage from './SmartImage'
import { DirectionsIcon, PhoneIcon } from './icons'
import { heroContent, mainBranch, newBranchButcherShop, newBranchRestaurant } from '../data/content'

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, 90])

  const quickActions = [
    { label: '본관 전화', href: mainBranch.contact.phoneHref, icon: PhoneIcon },
    { label: '신관 식육점 전화', href: newBranchButcherShop.contact.phoneHref, icon: PhoneIcon },
    { label: '신관 식당 전화', href: newBranchRestaurant.contact.phoneHref, icon: PhoneIcon },
    { label: '길찾기', href: mainBranch.naverMapUrl, icon: DirectionsIcon, external: true },
  ]

  return (
    <section id="top" ref={ref} className="relative overflow-hidden bg-charcoal" aria-label="보성녹돈 소개 인트로">
      <div className="absolute inset-0">
        <motion.div style={{ y }} className="h-[112%] w-full">
          <SmartImage
            src="/images/hero/hero-main.jpg"
            alt="보성녹돈에서 정성껏 준비한 고기 상차림"
            label="대표 사진 준비중"
            className="h-full w-full object-cover"
            imgClassName="h-full w-full object-cover"
            loading="eager"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-charcoal/30" />
      </div>

      <div className="container-page relative flex min-h-[560px] flex-col justify-end gap-8 py-16 md:min-h-[680px] md:justify-center md:py-24">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-extrabold leading-tight text-ivory md:text-5xl md:leading-tight">
            {heroContent.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-5 whitespace-pre-line text-base leading-relaxed text-ivory/85 md:text-lg">
            {heroContent.subtext}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={heroContent.primaryCta.href}
              className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-brass px-7 text-base font-bold text-charcoal transition-transform hover:scale-[1.03] hover:bg-brass-light"
            >
              {heroContent.primaryCta.label}
            </a>
            <a
              href={heroContent.secondaryCta.href}
              className="inline-flex min-h-[52px] items-center justify-center rounded-full border-2 border-ivory/70 px-7 text-base font-bold text-ivory transition-colors hover:bg-ivory/10"
            >
              {heroContent.secondaryCta.label}
            </a>
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-2.5 md:max-w-xl md:grid-cols-4">
          {quickActions.map(({ label, href, icon: Icon, external }) => (
            <li key={label}>
              <a
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer' : undefined}
                className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-ivory/10 px-3 text-center text-sm font-semibold text-ivory backdrop-blur-sm transition-colors hover:bg-ivory/20"
              >
                <Icon width={18} height={18} className="shrink-0" />
                <span>{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
