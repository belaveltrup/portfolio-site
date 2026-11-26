import type { Project } from './projects'
import { formatProjectDate } from './projects'
import { milestones, type Milestone } from './milestones'

export type TimelineEntry =
  | { kind: 'project'; slug: string; anchorDate: string; data: Project }
  | { kind: 'milestone'; slug: string; anchorDate: string; data: Milestone }

/**
 * Merges the (already tag-filtered) project list with the constant set of life
 * milestones into one chronological path, most recent first. Milestones are
 * never filtered by project tag — they're the constant spine of the path, not
 * a project category.
 */
export function buildTimeline(filteredProjects: Project[]): TimelineEntry[] {
  const projectEntries: TimelineEntry[] = filteredProjects.map((p) => ({
    kind: 'project',
    slug: p.slug,
    anchorDate: p.date,
    data: p,
  }))
  const milestoneEntries: TimelineEntry[] = milestones.map((m) => ({
    kind: 'milestone',
    slug: m.slug,
    // Placed on the path by when the chapter began, not when it finished —
    // the life-path reading the user wants (you "arrive" at a station when
    // it starts), not a CV's most-recent-first convention. The visible label
    // still always shows the full start–end range regardless of this key.
    anchorDate: m.dateStart,
    data: m,
  }))
  return [...projectEntries, ...milestoneEntries].sort((a, b) =>
    a.anchorDate < b.anchorDate ? 1 : a.anchorDate > b.anchorDate ? -1 : 0,
  )
}

/** "2022-10", "2026-07" -> "OCT 2022 – JUL 2026"; no end -> "OCT 2026 – PRESENT" */
export function formatMilestoneRange(start: string, end?: string): string {
  const startLabel = formatProjectDate(start)
  return end ? `${startLabel} – ${formatProjectDate(end)}` : `${startLabel} – PRESENT`
}
