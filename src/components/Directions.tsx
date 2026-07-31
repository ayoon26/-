import Reveal from './Reveal'
import { DirectionsIcon, PhoneIcon } from './icons'
import { mainBranch, newBranchButcherShop, newBranchRestaurant } from '../data/content'

export default function Directions() {
  return (
    <section id="directions" className="bg-ivory py-16 md:py-24" aria-labelledby="directions-heading">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-brass-dark">오시는 길</p>
          <h2 id="directions-heading" className="mt-3 text-2xl font-extrabold text-charcoal md:text-3xl">
            보성녹돈 찾아오시는 길
          </h2>
          <p className="mt-4 text-base leading-relaxed text-charcoal/70 md:text-lg">
            본관과 신관은 도보로 가까운 거리에 나란히 위치해 있습니다. 네이버 지도로 편하게 길을 확인해 보세요.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="rounded-xl2 bg-white p-7 shadow-card ring-1 ring-black/5">
              <h3 className="text-xl font-extrabold text-charcoal">보성녹돈 본관</h3>
              <p className="mt-2 flex items-start gap-2 text-[15px] text-charcoal/75">
                <DirectionsIcon width={20} height={20} className="mt-0.5 shrink-0 text-brass-dark" />
                {mainBranch.addressDisplay}
              </p>
              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <a
                  href={mainBranch.naverMapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[50px] flex-1 items-center justify-center gap-2 rounded-full bg-charcoal px-4 text-[15px] font-bold text-ivory hover:bg-brown-deep"
                >
                  본관 네이버지도 보기
                </a>
                <a
                  href={mainBranch.contact.phoneHref}
                  className="inline-flex min-h-[50px] flex-1 items-center justify-center gap-2 rounded-full border-2 border-charcoal/15 px-4 text-[15px] font-bold text-charcoal hover:border-brass hover:text-brass-dark"
                >
                  <PhoneIcon width={17} height={17} />
                  본관 전화하기
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-xl2 bg-white p-7 shadow-card ring-1 ring-black/5">
              <h3 className="text-xl font-extrabold text-charcoal">보성녹돈 신관</h3>
              <p className="mt-2 flex items-start gap-2 text-[15px] text-charcoal/75">
                <DirectionsIcon width={20} height={20} className="mt-0.5 shrink-0 text-brass-dark" />
                {newBranchRestaurant.addressDisplay}
              </p>
              <div className="mt-6 flex flex-col gap-2.5">
                <a
                  href={newBranchRestaurant.naverMapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-charcoal px-4 text-[15px] font-bold text-ivory hover:bg-brown-deep"
                >
                  신관 네이버지도 보기
                </a>
                <div className="flex flex-col gap-2.5 sm:flex-row">
                  <a
                    href={newBranchButcherShop.contact.phoneHref}
                    className="inline-flex min-h-[50px] flex-1 items-center justify-center gap-2 rounded-full border-2 border-charcoal/15 px-4 text-[15px] font-bold text-charcoal hover:border-brass hover:text-brass-dark"
                  >
                    <PhoneIcon width={17} height={17} />
                    신관 식육점 전화하기
                  </a>
                  <a
                    href={newBranchRestaurant.contact.phoneHref}
                    className="inline-flex min-h-[50px] flex-1 items-center justify-center gap-2 rounded-full border-2 border-charcoal/15 px-4 text-[15px] font-bold text-charcoal hover:border-brass hover:text-brass-dark"
                  >
                    <PhoneIcon width={17} height={17} />
                    신관 식당 전화하기
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
