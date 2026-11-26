import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Intro from '../components/Intro'
import ProjectTile from '../components/ProjectTile'
import ViewToggle, { type ViewMode } from '../components/ViewToggle'
import Timeline from '../components/Timeline'
import { projects } from '../data/projects'

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>('projects')

  return (
    <>
      <Header />
      <main>
        <Intro />
        <h2 className="sr-only">Projects and timeline</h2>
        <div className="controls-row">
          <ViewToggle mode={viewMode} onChange={setViewMode} />
        </div>
        {viewMode === 'projects' ? (
          <motion.section layout className="project-grid" id="projects">
            <AnimatePresence>
              {projects.map((project) => (
                <ProjectTile key={project.slug} project={project} />
              ))}
            </AnimatePresence>
          </motion.section>
        ) : (
          <Timeline projects={projects} />
        )}
      </main>
      <Footer />
    </>
  )
}
