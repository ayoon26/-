import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 4h3.2l1.3 4.2-2 1.5a12 12 0 0 0 5.3 5.3l1.5-2 4.2 1.3v3.2c0 1-1 1.8-2 1.6-6.6-1.1-11.9-6.4-13-13-.2-1 .6-2 1.5-2Z" />
    </svg>
  )
}

export function MapPinIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 22s7-7.2 7-12.5A7 7 0 0 0 5 9.5C5 14.8 12 22 12 22Z" />
      <circle cx="12" cy="9.5" r="2.6" />
    </svg>
  )
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17" />
    </svg>
  )
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 5l14 14M19 5 5 19" />
    </svg>
  )
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M15 5 8 12l7 7" />
    </svg>
  )
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 5l7 7-7 7" />
    </svg>
  )
}

export function FamilyIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="8" cy="7" r="2.2" />
      <circle cx="16" cy="7" r="2.2" />
      <path d="M3 20v-2a5 5 0 0 1 5-5h0a5 5 0 0 1 5 5v2M13 20v-1a4.5 4.5 0 0 1 4.5-4.5h0A4.5 4.5 0 0 1 21 19v1" />
    </svg>
  )
}

export function GroupIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M3.5 20v-1.5A5.5 5.5 0 0 1 9 13h0a5.5 5.5 0 0 1 5.5 5.5V20M15 14.2A4.5 4.5 0 0 1 20.5 18.5V20" />
    </svg>
  )
}

export function SeatIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 4v9M18 4v9M6 13h12M6 13a2 2 0 0 0-2 2v1M18 13a2 2 0 0 1 2 2v1M5 20l1-4M19 20l-1-4" />
    </svg>
  )
}

export function ParkingIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      <path d="M9.5 16V8h3a2.5 2.5 0 0 1 0 5h-3" />
    </svg>
  )
}

export function ReserveIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" />
      <path d="m8.5 14 2 2 4-4" />
    </svg>
  )
}

export function SpaceIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="4" width="17" height="16" rx="2" />
      <path d="M3.5 10h17M9 10v10" />
    </svg>
  )
}

export function SelectMeatIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 12c0-4 2.5-7 6-7s6 3 6 7-2.5 8-6 8-6-4-6-8Z" />
      <path d="M9 11c1-1.2 2-1.2 3 0M9 15c1 1 2 1 3 0" />
    </svg>
  )
}

export function PrepareIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="10" width="16" height="8" rx="1.5" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3M9 14h.01M12 14h.01M15 14h.01" />
    </svg>
  )
}

export function EnjoyIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="13" r="7" />
      <path d="M12 6V4M9 4h6" />
      <path d="M9 13a3 3 0 0 0 6 0" />
    </svg>
  )
}

export function DirectionsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 11 12 3l9 8M5 10v10h5v-6h4v6h5V10" />
    </svg>
  )
}
