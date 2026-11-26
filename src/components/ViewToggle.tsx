export type ViewMode = 'projects' | 'timeline'

interface ViewToggleProps {
  mode: ViewMode
  onChange: (mode: ViewMode) => void
}

export default function ViewToggle({ mode, onChange }: ViewToggleProps) {
  return (
    <div className="view-toggle" role="group" aria-label="View mode">
      <button
        type="button"
        className={mode === 'projects' ? 'tag-filter-pill is-active' : 'tag-filter-pill'}
        onClick={() => onChange('projects')}
      >
        Projects
      </button>
      <button
        type="button"
        className={mode === 'timeline' ? 'tag-filter-pill is-active' : 'tag-filter-pill'}
        onClick={() => onChange('timeline')}
      >
        Timeline
      </button>
    </div>
  )
}
