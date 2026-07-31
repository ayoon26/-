import Reveal from './Reveal'
import SmartImage from './SmartImage'
import { DirectionsIcon, PhoneIcon } from './icons'
import { mainBranch, newBranchButcherShop, newBranchRestaurant } from '../data/content'

function ActionRow({
  phoneHref,
  phoneLabel,
  mapUrl,
}: {
  phoneHref: string
  phoneLabel: string
  mapUrl: string
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      <a
        href="#menu"
        className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full border-2 border-charcoal/15 px-4 text-sm font-bold text-charcoal transition-colors hover:border-brass hover:text-brass-dark"
      >
        메뉴 보기
      </a>
      <a
        href={phoneHref}
        className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-1.5 rounded-full bg-charcoal px-4 text-sm font-bold text-ivory transition-colors hover:bg-brown-deep"
      >
        <PhoneIcon width={16} height={16} />
        {phoneLabel}
      </a>
      <a
        href={mapUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-1.5 rounded-full border-2 border-charcoal/15 px-4 text-sm font-bold text-charcoal transition-colors hover:border-brass hover:text-brass-dark"
      >
        <DirectionsIcon width={16} height={16} />
        길찾기
      </a>
    </div>
  )
}

export default function BranchSection() {
  return (
    <section id="branches" className="bg-ivory-dark py-16 md:py-24" aria-labelledby="branches-heading">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-brass-dark">본관·신관 안내</p>
          <h2 id="branches-heading" className="mt-3 text-2xl font-extrabold text-charcoal md:text-3xl">
            본관과 신관, 무엇이 다를까요?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-charcoal/70 md:text-lg">
            두 공간 모두 보성녹돈이 정성껏 운영합니다. 원하시는 분위기와 방문 목적에 맞춰 편하게 선택해 주세요.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 md:gap-8">
          {/* 본관 카드 */}
          <Reveal>
            <article className="flex h-full flex-col overflow-hidden rounded-xl2 bg-white shadow-card transition-shadow hover:shadow-card-hover">
              <SmartImage
                src={mainBranch.imageSrc}
                alt={mainBranch.imageAlt}
                label="본관 사진 준비중"
                className="h-52 w-full md:h-64"
                imgClassName="h-full w-full object-cover"
              />
              <div className="flex flex-1 flex-col gap-5 p-6 md:p-8">
                <div>
                  <span className="inline-block rounded-full bg-brown/10 px-3 py-1 text-xs font-bold text-brown-deep">
                    본관
                  </span>
                  <h3 className="mt-3 text-xl font-extrabold text-charcoal md:text-2xl">보성녹돈 본관</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-charcoal/70">{mainBranch.atmosphere}</p>
                </div>

                <dl className="space-y-1.5 text-[15px]">
                  <div className="flex gap-2">
                    <dt className="shrink-0 font-semibold text-charcoal/60">주소</dt>
                    <dd className="text-charcoal">{mainBranch.addressDisplay}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="shrink-0 font-semibold text-charcoal/60">전화</dt>
                    <dd>
                      <a href={mainBranch.contact.phoneHref} className="font-bold text-charcoal underline decoration-brass decoration-2 underline-offset-2">
                        {mainBranch.contact.phoneDisplay}
                      </a>
                    </dd>
                  </div>
                </dl>

                <ul className="flex flex-wrap gap-2">
                  {mainBranch.recommendedFor.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full bg-ivory-dark px-3 py-1 text-xs font-semibold text-charcoal/75"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-2">
                  <ActionRow
                    phoneHref={mainBranch.contact.phoneHref}
                    phoneLabel="전화하기"
                    mapUrl={mainBranch.naverMapUrl}
                  />
                </div>
              </div>
            </article>
          </Reveal>

          {/* 신관 카드 */}
          <Reveal delay={0.08}>
            <article className="flex h-full flex-col overflow-hidden rounded-xl2 bg-white shadow-card transition-shadow hover:shadow-card-hover">
              <SmartImage
                src={newBranchRestaurant.imageSrc}
                alt={newBranchRestaurant.imageAlt}
                label="신관 사진 준비중"
                className="h-52 w-full md:h-64"
                imgClassName="h-full w-full object-cover"
              />
              <div className="flex flex-1 flex-col gap-5 p-6 md:p-8">
                <div>
                  <span className="inline-block rounded-full bg-brass/15 px-3 py-1 text-xs font-bold text-brass-dark">
                    신관
                  </span>
                  <h3 className="mt-3 text-xl font-extrabold text-charcoal md:text-2xl">보성녹돈 신관</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-charcoal/70">
                    고기를 직접 고르고 즐기는 현대적인 식육식당
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[15px]">
                  <span className="font-semibold text-charcoal/60">주소</span>
                  <span className="text-charcoal">{newBranchRestaurant.addressDisplay}</span>
                </div>

                {/* 층별 구분 - 어르신도 한눈에 구분할 수 있도록 카드 형태로 분리 */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3 rounded-xl border-2 border-charcoal/10 bg-ivory-dark/60 p-4">
                    <div>
                      <p className="text-xs font-bold text-brass-dark">1층 · 식육점</p>
                      <p className="mt-0.5 text-sm font-semibold text-charcoal">직접 보고 고르는 고기</p>
                    </div>
                    <a
                      href={newBranchButcherShop.contact.phoneHref}
                      className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full bg-charcoal px-4 text-sm font-bold text-ivory"
                    >
                      <PhoneIcon width={15} height={15} />
                      {newBranchButcherShop.contact.phoneDisplay}
                    </a>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border-2 border-charcoal/10 bg-ivory-dark/60 p-4">
                    <div>
                      <p className="text-xs font-bold text-brass-dark">2층 · 식당</p>
                      <p className="mt-0.5 text-sm font-semibold text-charcoal">편안하게 구워 즐기는 공간</p>
                    </div>
                    <a
                      href={newBranchRestaurant.contact.phoneHref}
                      className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full bg-charcoal px-4 text-sm font-bold text-ivory"
                    >
                      <PhoneIcon width={15} height={15} />
                      {newBranchRestaurant.contact.phoneDisplay}
                    </a>
                  </div>
                </div>

                <ul className="flex flex-wrap gap-2">
                  {newBranchRestaurant.recommendedFor.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full bg-ivory-dark px-3 py-1 text-xs font-semibold text-charcoal/75"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-2">
                  <ActionRow
                    phoneHref={newBranchRestaurant.contact.phoneHref}
                    phoneLabel="신관 전화하기"
                    mapUrl={newBranchRestaurant.naverMapUrl}
                  />
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
