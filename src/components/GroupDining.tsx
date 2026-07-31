import Reveal from './Reveal'
import { FamilyIcon, GroupIcon, ParkingIcon, ReserveIcon, SeatIcon, SpaceIcon } from './icons'
import { facilityFeatures } from '../data/content'

const iconMap = {
  family: FamilyIcon,
  group: GroupIcon,
  seat: SeatIcon,
  parking: ParkingIcon,
  reserve: ReserveIcon,
  space: SpaceIcon,
}

export default function GroupDining() {
  return (
    <section id="group-dining" className="bg-brown-deep py-16 text-ivory md:py-24" aria-labelledby="group-heading">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-brass-light">단체·모임 안내</p>
          <h2 id="group-heading" className="mt-3 text-2xl font-extrabold md:text-3xl">
            가족 외식부터 단체모임까지
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ivory/80 md:text-lg">
            본관과 신관 모두 여러 인원이 함께하는 모임에 적합한 공간을 갖추고 있습니다. 편안한 가족 외식부터 회식,
            단체모임까지 편하게 이용해 주세요.
          </p>
        </Reveal>

        <ul className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
          {facilityFeatures.map(({ label, icon }) => {
            const Icon = iconMap[icon]
            return (
              <li
                key={label}
                className="flex flex-col items-center gap-2.5 rounded-xl2 bg-ivory/5 p-5 text-center ring-1 ring-ivory/10"
              >
                <Icon width={26} height={26} className="text-brass-light" />
                <span className="text-sm font-semibold">{label}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
