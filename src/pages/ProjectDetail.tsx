import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Gallery from '../components/Gallery'
import { getProjectBySlug, jamTagline } from '../data/projects'
import { demoRegistry, customPageRegistry } from '../components/extras/registry'

const DEFAULT_TITLE = 'Béla Veltrup — Portfolio'
const DEFAULT_FAVICON = '/favicon.svg'

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? getProjectBySlug(slug) : undefined

  // The browser tab identifies whichever project is open (name + its own
  // cover as the favicon) instead of staying on the site-wide default —
  // restored on unmount so leaving the page (even to another project,
  // which re-runs this before the next effect) never leaves a stale tab.
  useEffect(() => {
    if (!project) return
    document.title = project.title
    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (favicon && project.thumbnail) favicon.href = project.thumbnail
    return () => {
      document.title = DEFAULT_TITLE
      if (favicon) favicon.href = DEFAULT_FAVICON
    }
  }, [project])

  if (!project) return <Navigate to="/" replace />

  const CustomPage = project.customPage ? customPageRegistry[project.customPage] : undefined
  if (CustomPage) return <CustomPage project={project} />

  const DemoComponent = project.demo ? demoRegistry[project.demo] : undefined
  const isDefaultTheme = !project.theme

  return (
    <div data-theme={project.theme ?? 'default'}>
      {isDefaultTheme && <Header />}
      <motion.main
        className="project-detail"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
      >
        <Link to="/" className="back-link">
          <svg
            className="back-arrow"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
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
        <h1>{project.title}</h1>
        <p className="tagline">{jamTagline(project)}</p>
        <ul className="tag-list">
          {project.tech.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
        {project.noGenerativeAI && (
          <p className="ai-disclosure">No generative AI was used in making this game.</p>
        )}
        <p className="description">{project.description}</p>

        {project.screenshots && <Gallery images={project.screenshots} alt={project.title} />}

        {project.links && (
          <ul className="link-list">
            {project.links.map((link) => (
              <li key={link.url}>
                <a href={link.url} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}

        {DemoComponent && <DemoComponent />}
      </motion.main>
      {isDefaultTheme && <Footer />}
    </div>
  )
}
