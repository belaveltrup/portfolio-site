import { Link } from 'react-router-dom'

/**
 * Accessible link back to the homepage — the name is already set large in
 * the Intro directly below, so there's no visible wordmark here.
 */
export default function Header() {
  return (
    <header className="site-header">
      <Link to="/" className="wordmark" aria-label="Béla Veltrup — home" />
    </header>
  )
}
