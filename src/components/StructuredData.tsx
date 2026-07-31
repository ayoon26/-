import { useEffect } from 'react'
import {
  mainBranch,
  newBranchButcherShop,
  newBranchRestaurant,
  restaurantName,
  siteMeta,
} from '../data/content'

/** Injects Restaurant/LocalBusiness JSON-LD sourced from the same content.ts config used everywhere else. */
export default function StructuredData() {
  useEffect(() => {
    const data = {
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      name: restaurantName,
      description: siteMeta.description,
      servesCuisine: ['한식', '고깃집', '식육식당'],
      address: [
        {
          '@type': 'PostalAddress',
          name: mainBranch.name,
          streetAddress: mainBranch.addressRoad,
          addressLocality: '남구',
          addressRegion: '울산광역시',
          addressCountry: 'KR',
        },
        {
          '@type': 'PostalAddress',
          name: newBranchRestaurant.name,
          streetAddress: newBranchRestaurant.addressRoad,
          addressLocality: '남구',
          addressRegion: '울산광역시',
          addressCountry: 'KR',
        },
      ],
      telephone: [
        mainBranch.contact.phoneDisplay,
        newBranchButcherShop.contact.phoneDisplay,
        newBranchRestaurant.contact.phoneDisplay,
      ],
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '11:30',
        closes: '22:00',
      },
      hasMap: [mainBranch.naverMapUrl, newBranchRestaurant.naverMapUrl],
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(data)
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  return null
}
