import {
  businessHours,
  mainBranch,
  newBranchButcherShop,
  newBranchRestaurant,
  restaurantName,
} from '../data/content'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-charcoal py-12 text-ivory/80" aria-label="사이트 정보">
      <div className="container-page">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-lg font-extrabold text-ivory">{restaurantName}</p>
            <p className="mt-2 text-sm leading-relaxed">
              {businessHours.description}
              <br />
              {businessHours.breakTime}
            </p>
            <p className="mt-2 text-xs text-ivory/40">{businessHours.holidayNote}</p>
          </div>

          <div className="text-sm leading-relaxed">
            <p className="font-bold text-ivory">본관</p>
            <p>{mainBranch.addressDisplay}</p>
            <a href={mainBranch.contact.phoneHref} className="underline decoration-brass/50 underline-offset-2">
              {mainBranch.contact.phoneDisplay}
            </a>
            <a
              href={mainBranch.naverMapUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-1 block underline decoration-brass/50 underline-offset-2"
            >
              네이버지도 보기
            </a>
          </div>

          <div className="text-sm leading-relaxed">
            <p className="font-bold text-ivory">신관</p>
            <p>{newBranchRestaurant.addressDisplay}</p>
            <p className="mt-1">
              1층 식육점{' '}
              <a href={newBranchButcherShop.contact.phoneHref} className="underline decoration-brass/50 underline-offset-2">
                {newBranchButcherShop.contact.phoneDisplay}
              </a>
            </p>
            <p>
              2층 식당{' '}
              <a href={newBranchRestaurant.contact.phoneHref} className="underline decoration-brass/50 underline-offset-2">
                {newBranchRestaurant.contact.phoneDisplay}
              </a>
            </p>
            <a
              href={newBranchRestaurant.naverMapUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-1 block underline decoration-brass/50 underline-offset-2"
            >
              네이버지도 보기
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-ivory/10 pt-6 text-xs text-ivory/50">
          <p>© {year} {restaurantName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
