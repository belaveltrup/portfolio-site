import { Fragment, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import type { Project } from '../../data/projects'
import home from '../../assets/kartei/01-home.jpg'
import decks from '../../assets/kartei/02-decks.jpg'
import photo from '../../assets/kartei/03-photo.jpg'
import photoResult from '../../assets/kartei/04-photoResult.jpg'
import race from '../../assets/kartei/05-race.jpg'
import streak from '../../assets/kartei/06-streak.jpg'
import performance from '../../assets/kartei/07-performance.jpg'
import appLock from '../../assets/kartei/08-appLock.jpg'
import ankiImport from '../../assets/kartei/09-ankiImport.jpg'
import './KarteiDetail.css'

/**
 * This page's visual language is pinned, verbatim, to the real asset the product already
 * ships with: the flat color-field App Store screenshot pipeline at app/screenshots/ in the
 * Kartai repo (template.html + run.mjs). Same fields, same type voice, same bare device
 * panel with no bezel art, no gradient, no glow, no grain, no glass — the pipeline's own CSS
 * comments ban exactly these, and this page keeps that ban. Headlines and subtitles below are
 * that pipeline's real marketing copy (captions/en.json), not invented for this page.
 */

type Field = 'teal' | 'ice' | 'sand' | 'green' | 'orange' | 'periwinkle'

interface Shot {
  src: string
  alt: string
}

interface Slide {
  field: Field
  title: string
  subtitle: string
  shots: Shot[]
  /** Render an arrow between paired shots to dramatize an input → output step. */
  process?: boolean
}

const slides: Slide[] = [
  {
    field: 'ice',
    title: 'Photo in, card out',
    subtitle: 'The AI spots the key terms on your slide and covers them automatically.',
    shots: [
      { src: photo, alt: 'Photo of a lecture slide being captured' },
      { src: photoResult, alt: 'Automatically generated flashcard with covered terms' },
    ],
    process: true,
  },
  {
    field: 'green',
    title: 'Everything at a glance',
    subtitle:
      'Deck overview with deadline and progress — plus your streak and where you stand against your study group.',
    shots: [
      { src: decks, alt: 'Overview of all decks with deadlines' },
      { src: race, alt: 'Study-group leaderboard' },
      { src: streak, alt: 'Streak calendar with study days' },
    ],
  },
  {
    field: 'teal',
    title: "What's already sticking",
    subtitle: "See what's sticking and when you study best, before the exam shows you.",
    shots: [{ src: performance, alt: 'Study progress and best study times' }],
  },
  {
    field: 'sand',
    title: 'Study first, scroll later',
    subtitle: "Locks social apps system-wide until today's session is done.",
    shots: [{ src: appLock, alt: 'App lock settings for blocking social apps until studying is done' }],
  },
  {
    field: 'periwinkle',
    title: 'Never retype a card again',
    subtitle: 'Import your Anki deck and keep studying it right in your next session.',
    shots: [{ src: ankiImport, alt: 'Importing a deck from Anki, ready to merge into the app' }],
  },
]

function Phone({ shot }: { shot: Shot }) {
  return (
    <div className="kd-panel">
      <img src={shot.src} alt={shot.alt} loading="lazy" />
    </div>
  )
}

function SlideSection({ slide }: { slide: Slide }) {
  return (
    <section className="kd-slide" style={{ '--field': `var(--kd-${slide.field})` } as CSSProperties}>
      <div className="kd-col">
        <div className="kd-tbox">
          <h2>{slide.title}</h2>
        </div>
        <p>{slide.subtitle}</p>
      </div>
      <div
        className={`kd-shots${slide.shots.length > 1 ? ' kd-shots-pair' : ''}`}
        data-count={slide.shots.length}
      >
        {slide.shots.map((shot, i) => (
          <Fragment key={shot.src}>
            <Phone shot={shot} />
            {slide.process && i === 0 && (
              <span className="kd-arrow" aria-hidden="true">
                →
              </span>
            )}
          </Fragment>
        ))}
      </div>
    </section>
  )
}

export default function KarteiDetail({ project }: { project: Project }) {
  return (
    <div className="kd-root">
      <section className="kd-slide kd-hero" style={{ '--field': 'var(--kd-teal)' } as CSSProperties}>
        <Link to="/" className="kd-back">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M12 7H2M2 7L6.5 2.5M2 7L6.5 11.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          All projects
        </Link>
        <span className="kd-wordmark">Kartai</span>
        <div className="kd-col">
          <div className="kd-tbox">
            <h1>5 minutes a day</h1>
          </div>
          <p>Your study plan until the exam, without you planning a thing.</p>
        </div>
        <div className="kd-shots">
          <Phone shot={{ src: home, alt: 'Study home screen with streak and deadlines' }} />
        </div>
      </section>

      <section className="kd-about">
        <div className="kd-about-inner">
          <p className="kd-about-lede">
            What if studying for an exam took five minutes a day, instead of a cramming marathon
            the week before?
          </p>
          <p>
            No guilt, no all-nighter — just one small step a day. Give a deck its exam date, and
            Kartai works backward from there, scheduling exactly as many cards a day as it
            takes to be ready in time.
          </p>
          <p>
            Cards don't have to be typed out by hand: photograph a lecture slide and it becomes a
            flashcard, key terms covered automatically. Shared decks, streaks and a small
            study-group leaderboard sit on top of that same schedule, so studying with classmates
            stays accountable without turning into busywork.
          </p>
          <ul className="kd-tech">
            {project.tech.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        </div>
      </section>

      {slides.map((slide) => (
        <SlideSection key={slide.title} slide={slide} />
      ))}

      <footer className="kd-footer">
        <Link to="/" className="kd-back kd-back-footer">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M12 7H2M2 7L6.5 2.5M2 7L6.5 11.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          All projects
        </Link>
        <Link to="/projects/kartai/privacy" className="kd-footer-legal">
          Privacy Policy
        </Link>
      </footer>
    </div>
  )
}
