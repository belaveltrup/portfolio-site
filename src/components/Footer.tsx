import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <ul className="contact-list">
        <li>
          <a href="mailto:contact@bela-dev.com">Contact</a>
        </li>
        <li>
          <a href="https://linkedin.com/in/béla-veltrup" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </li>
        <li>
          <Link to="/impressum">Legal Notice (Impressum)</Link>
        </li>
        <li>
          <Link to="/datenschutz">Datenschutzerklärung</Link>
        </li>
      </ul>
    </footer>
  )
}
