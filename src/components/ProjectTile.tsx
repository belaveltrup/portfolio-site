import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { jamTagline, type Project } from '../data/projects'

export default function ProjectTile({ project }: { project: Project }) {
  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Link to={`/projects/${project.slug}`} className="project-tile">
        <div
          className="project-tile-swatch"
          style={
            {
              '--swatch-base': project.swatch.base,
              '--swatch-ink': project.swatch.ink,
            } as CSSProperties
          }
        >
          <span className="project-tile-face project-tile-face-default" aria-hidden="true">
            {project.thumbnail ? (
              <img className="project-tile-thumb" src={project.thumbnail} alt="" />
            ) : (
              project.title.charAt(0)
            )}
          </span>
          <span className="project-tile-face project-tile-face-hover" aria-hidden="true">
            {project.tech.join(' / ')}
          </span>
        </div>
        <h3>{project.title}</h3>
        <p className="project-tile-tags">{jamTagline(project)}</p>
      </Link>
    </motion.div>
  )
}
