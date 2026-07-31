import { businessHours } from '../data/content'

export default function BusinessHoursBar() {
  return (
    <div className="bg-brass/10 py-4" aria-label="영업시간 안내">
      <div className="container-page flex flex-col items-center justify-center gap-1.5 text-center sm:flex-row sm:gap-3">
        <p className="text-lg font-extrabold text-charcoal md:text-xl">
          영업시간 <span className="text-brass-dark">{businessHours.display}</span>
        </p>
        <span className="hidden text-charcoal/30 sm:inline">·</span>
        <p className="text-[15px] font-semibold text-charcoal/70">{businessHours.breakTime}</p>
      </div>
    </div>
  )
}
