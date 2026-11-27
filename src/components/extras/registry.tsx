import type { ComponentType } from 'react'
import type { Project } from '../../data/projects'
import KarteiDetail from '../kartei/KarteiDetail'

/** Maps a Project's `demo` key to the interactive component rendered on its detail page. */
export const demoRegistry: Record<string, ComponentType> = {}

/** Maps a Project's `customPage` key to a component that replaces ProjectDetail's generic markup entirely. */
export const customPageRegistry: Record<string, ComponentType<{ project: Project }>> = {
  kartei: KarteiDetail,
}
