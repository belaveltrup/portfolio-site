export interface Milestone {
  slug: string
  title: string
  institution: string
  description: string
  /** "YYYY-MM" */
  dateStart: string
  /** "YYYY-MM" — absent means ongoing/present */
  dateEnd?: string
}

export const milestones: Milestone[] = [
  {
    slug: 'abitur',
    title: 'Abitur',
    institution: 'Viktoriaschule Aachen',
    description: 'Secondary school diploma qualifying for university study in Germany.',
    dateStart: '2014-08',
    dateEnd: '2022-06',
  },
  {
    slug: 'bachelor',
    title: 'Bachelor of Science, Computer Science',
    institution: 'RWTH Aachen University',
    description: 'Undergraduate computer science degree.',
    dateStart: '2022-10',
    dateEnd: '2026-07',
  },
  {
    slug: 'master',
    title: 'Master of Science, Computer Science',
    institution: 'Ludwig-Maximilians-Universität München',
    description: 'Graduate computer science degree, in progress.',
    dateStart: '2026-10',
  },
]
