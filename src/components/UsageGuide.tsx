import Reveal from './Reveal'
import { EnjoyIcon, PrepareIcon, SelectMeatIcon } from './icons'
import { settingFee, usageSteps } from '../data/content'

const iconMap = {
  select: SelectMeatIcon,
  prepare: PrepareIcon,
  enjoy: EnjoyIcon,
}

export default function UsageGuide() {
  return (
    <section id="usage-guide" className="bg-ivory py-16 md:py-24" aria-labelledby="usage-heading">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-brass-dark">이용 안내</p>
          <h2 id="usage-heading" className="mt-3 text-2xl font-extrabold text-charcoal md:text-3xl">
            신관 이용 방법
          </h2>
        </Reveal>

        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {usageSteps.map((step) => {
            const Icon = iconMap[step.icon]
            return (
              <Reveal key={step.step} delay={step.step * 0.06}>
                <li className="flex h-full flex-col items-center rounded-xl2 bg-white p-7 text-center shadow-card ring-1 ring-black/5">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brass/12 text-brass-dark">
                    <Icon width={30} height={30} />
                  </div>
                  <p className="mt-4 text-sm font-bold text-brass-dark">STEP {step.step}</p>
                  <h3 className="mt-1 text-lg font-extrabold text-charcoal">{step.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-charcoal/65">{step.description}</p>
                </li>
              </Reveal>
            )
          })}
        </ol>

        <Reveal delay={0.2}>
          <div className="mx-auto mt-10 max-w-xl rounded-xl2 border-2 border-brass/30 bg-brass/5 p-6 text-center">
            <p className="text-sm font-bold text-brass-dark">상차림비</p>
            <p className="mt-1 text-xl font-extrabold text-charcoal md:text-2xl">{settingFee.summary}</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
