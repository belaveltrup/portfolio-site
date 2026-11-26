import scrapPartsImg from '../assets/games/scrap-parts.png'
import thePlagueImg from '../assets/games/the-plague.png'
import theDeepDarkImg from '../assets/games/the-deep-dark.png'
import slingshotWarsImg from '../assets/games/slingshot-wars.png'
import islandSurvivalImg from '../assets/games/island-survival.png'
import booksImg from '../assets/games/books.png'
import karteiIcon from '../assets/kartei/icon-light.png'

// Game jam screenshots, scraped from each game's itch.io page. Grouped by file-name
// prefix (which doesn't always match the project slug — see below) and sorted by the
// trailing index so the gallery shows them in the same order itch.io does.
const screenshotModules = import.meta.glob('../assets/games/screenshots/*.jpg', {
  eager: true,
  import: 'default',
}) as Record<string, string>

function screenshotsFor(prefix: string): string[] {
  const pattern = new RegExp(`/${prefix}_(\\d+)\\.jpg$`)
  return Object.entries(screenshotModules)
    .flatMap(([path, url]) => {
      const match = path.match(pattern)
      return match ? [{ n: Number(match[1]), url }] : []
    })
    .sort((a, b) => a.n - b.n)
    .map((entry) => entry.url)
}

export interface ProjectLink {
  label: string
  url: string
}

/**
 * Flat color pair used as the tile's hover-state card background (and as the
 * default face for projects with no real thumbnail yet).
 */
export interface Swatch {
  base: string
  ink: string
}

export interface Project {
  slug: string
  title: string
  /** Name of the game jam this was built for — the subtitle is derived from this via jamTagline(), unless `tagline` overrides it. */
  gameJam?: string
  /** Overrides the derived "Game jam entry for X" tile subtitle for a non-game-jam project. */
  tagline?: string
  description: string
  /** Tools/stack used to build it, shown on the project detail page. */
  tech: string[]
  /** True for every entry here; kept as a per-project flag rather than a blanket assumption in case that stops being true. */
  noGenerativeAI?: boolean
  links?: ProjectLink[]
  swatch: Swatch
  /** Real cover image (imported asset). When present, this is the tile's default face instead of the swatch letter-mark. */
  thumbnail?: string
  /** Screenshots scraped from the game's itch.io page, shown as a gallery on the detail page. */
  screenshots?: string[]
  /** "YYYY-MM" — used for timeline ordering and display. */
  date: string
  /** Key of a custom interactive component to render on the detail page (minigames, canvas demos, etc.), registered in components/extras/registry.tsx */
  demo?: string
  /**
   * Opts this project's detail page out of the homepage's visual system entirely.
   * Absent = inherits the default (minimal, homepage-aligned) detail page styling.
   */
  theme?: string
  /**
   * Key of a fully custom detail-page component that replaces ProjectDetail's generic
   * markup entirely, registered in components/extras/registry.tsx. Implies `theme`.
   */
  customPage?: string
}

export const projects: Project[] = [
  {
    slug: 'books',
    title: 'Books - A Wizards Adventure',
    gameJam: 'Alakajam!',
    description:
      'My first game, made in 48 hours. You play a wizard in an old library at night, defeating ghosts to survive — books on the ground unlock new spells.',
    tech: ['Unity', 'C#', 'VS Code'],
    noGenerativeAI: true,
    links: [{ label: 'Play on itch.io', url: 'https://bela-veltrup.itch.io/books' }],
    swatch: { base: '#1f6e73', ink: '#ece6d8' },
    thumbnail: booksImg,
    screenshots: screenshotsFor('books'),
    date: '2019-02',
  },
  {
    slug: 'island-survival',
    title: 'Island Survival',
    gameJam: 'Mini Jam 50: Islands',
    description:
      'Stranded on a tiny island with 72 hours on the clock — gather resources and craft what you need to find food and something to drink.',
    tech: ['Unity', 'C#', 'VS Code'],
    noGenerativeAI: true,
    links: [
      { label: 'Play on itch.io', url: 'https://bela-veltrup.itch.io/island-survival' },
    ],
    swatch: { base: '#d9602e', ink: '#141210' },
    thumbnail: islandSurvivalImg,
    screenshots: screenshotsFor('island-survival'),
    date: '2020-03',
  },
  {
    slug: 'the-deep-dark',
    title: 'The Deep Dark',
    gameJam: 'GMTK Game Jam 2020',
    description:
      'Your oxygen tank is leaking and you\'re stranded in space — fly your damaged spacecraft home before it\'s too late. Built in 48 hours around the theme "Out of Control."',
    tech: ['Unity', 'C#', 'VS Code'],
    noGenerativeAI: true,
    links: [{ label: 'Play on itch.io', url: 'https://bela-veltrup.itch.io/thedeepdark' }],
    swatch: { base: '#e3a325', ink: '#141210' },
    thumbnail: theDeepDarkImg,
    screenshots: screenshotsFor('thedeepdark'),
    date: '2020-07',
  },
  {
    slug: 'slingshot-wars',
    title: 'Slingshot Wars',
    gameJam: 'Triple Trijam 2020',
    description:
      'An unfinished puzzle game built across three separate 3-hour sessions — 9 hours of total development time, the jam\'s signature format.',
    tech: ['Unity', 'C#', 'VS Code'],
    noGenerativeAI: true,
    links: [{ label: 'Play on itch.io', url: 'https://bela-veltrup.itch.io/snowball' }],
    swatch: { base: '#d9718a', ink: '#141210' },
    thumbnail: slingshotWarsImg,
    screenshots: screenshotsFor('snowball'),
    date: '2020-07',
  },
  {
    slug: 'the-plague',
    title: 'The Plague',
    gameJam: 'Acerola Jam 0',
    description:
      'Manage medieval Venice during the Black Death — stop infections and keep the economy running, all while preventing desperate citizens from rioting and overthrowing you. Built over the jam\'s 14-day submission window.',
    tech: ['Unity', 'C#', 'VS Code'],
    noGenerativeAI: true,
    links: [{ label: 'Play on itch.io', url: 'https://bela-veltrup.itch.io/the-plague' }],
    swatch: { base: '#1f6e73', ink: '#ece6d8' },
    thumbnail: thePlagueImg,
    screenshots: screenshotsFor('the-plague'),
    date: '2024-03',
  },
  {
    slug: 'scrap-parts',
    title: 'Scrap Parts',
    gameJam: 'Puls Game Jam 2025',
    description:
      'A first-person platformer made in 48 hours. You play a badly damaged robot in an unearthly environment destined to be melted down — the goal is to escape.',
    tech: ['Unity', 'C#', 'VS Code'],
    noGenerativeAI: true,
    links: [{ label: 'Play on itch.io', url: 'https://bela-veltrup.itch.io/scrap-parts' }],
    swatch: { base: '#d9602e', ink: '#141210' },
    thumbnail: scrapPartsImg,
    screenshots: screenshotsFor('scrap-parts'),
    date: '2025-03',
  },
  {
    slug: 'kartei',
    title: 'Kartei',
    tagline: 'iOS app',
    description:
      'Study five minutes a day instead of cramming: photograph a lecture slide to make a flashcard, give a deck its exam date, and the app paces the rest for you.',
    tech: ['Expo / React Native', 'TypeScript', 'SQLite', 'FastAPI', 'Python'],
    swatch: { base: '#3DDBC8', ink: '#0E0C0A' },
    thumbnail: karteiIcon,
    date: '2026-11',
    theme: 'kartei',
    customPage: 'kartei',
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

/** The displayed subtitle for a project — derived from its game jam name, or `tagline` for a non-game-jam entry. */
export function jamTagline(project: Project): string {
  return project.tagline ?? `Game jam entry for ${project.gameJam}`
}

/** "2024-06" -> "JUN 2024" */
export function formatProjectDate(date: string): string {
  const [year, month] = date.split('-').map(Number)
  const formatted = new Date(year, month - 1, 1).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
  return formatted.toUpperCase()
}

export function byDateDescending(list: Project[]): Project[] {
  return [...list].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}
