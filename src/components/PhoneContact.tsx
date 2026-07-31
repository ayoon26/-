import Reveal from './Reveal'
import { PhoneIcon } from './icons'
import { mainBranch, newBranchButcherShop, newBranchRestaurant, phoneContactNote } from '../data/content'

const cards = [
  { branch: mainBranch, title: '본관 예약·문의', buttonLabel: '본관 전화하기' },
  { branch: newBranchButcherShop, title: '신관 1층 식육점', buttonLabel: '식육점 전화하기' },
  { branch: newBranchRestaurant, title: '신관 2층 식당', buttonLabel: '신관 식당 전화하기' },
]

export default function PhoneContact() {
  return (
    <section id="contact" className="bg-ivory-dark py-16 md:py-24" aria-labelledby="contact-heading">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-brass-dark">예약·문의</p>
          <h2 id="contact-heading" className="mt-3 text-2xl font-extrabold text-charcoal md:text-3xl">
            어느 매장으로 전화하시겠어요?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-charcoal/70 md:text-lg">{phoneContactNote}</p>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {cards.map(({ branch, title, buttonLabel }) => (
            <Reveal key={branch.id}>
              <div className="flex h-full flex-col items-center rounded-xl2 bg-white p-8 text-center shadow-card ring-1 ring-black/5">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brass/12 text-brass-dark">
                  <PhoneIcon width={26} height={26} />
                </div>
                <h3 className="mt-4 text-lg font-extrabold text-charcoal">{title}</h3>
                <a
                  href={branch.contact.phoneHref}
                  className="mt-2 text-2xl font-extrabold tracking-tight text-charcoal hover:text-brass-dark md:text-3xl"
                >
                  {branch.contact.phoneDisplay}
                </a>
                <a
                  href={branch.contact.phoneHref}
                  className="mt-6 inline-flex min-h-[50px] w-full items-center justify-center rounded-full bg-charcoal px-6 text-base font-bold text-ivory hover:bg-brown-deep"
                >
                  {buttonLabel}
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
