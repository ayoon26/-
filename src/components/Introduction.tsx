import Reveal from './Reveal'
import { introduction } from '../data/content'

export default function Introduction() {
  return (
    <section id="about" className="bg-charcoal py-16 text-ivory md:py-24" aria-labelledby="about-heading">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-brass-light">보성녹돈 소개</p>
          <h2 id="about-heading" className="mt-3 text-2xl font-extrabold md:text-3xl">
            {introduction.heading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ivory/80 md:text-lg">{introduction.body}</p>
        </Reveal>
      </div>
    </section>
  )
}
