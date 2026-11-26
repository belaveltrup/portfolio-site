import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Impressum() {
  return (
    <div data-theme="default">
      <Header />
      <motion.main
        className="project-detail legal-page"
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
          Back home
        </Link>
        <h1>Impressum</h1>
        <p className="tagline">Angaben gemäß § 5 DDG</p>

        <section className="legal-section">
          <h2>Diensteanbieter</h2>
          <p>
            Béla Veltrup
            <br />
            Schongauerstraße 35
            <br />
            81377 München
            <br />
            Deutschland
          </p>
        </section>

        <section className="legal-section">
          <h2>Kontakt</h2>
          <p>
            Telefon: <a href="tel:+491726633255">+49 172 6633255</a>
            <br />
            E-Mail: <a href="mailto:contact@bela-dev.com">contact@bela-dev.com</a>
          </p>
        </section>

        <section className="legal-section">
          <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
          <p>
            Béla Veltrup
            <br />
            Schongauerstraße 35
            <br />
            81377 München
          </p>
        </section>

        <section className="legal-section">
          <h2>EU-Streitschlichtung</h2>
          <p>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS)
            bereit:{' '}
            <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noreferrer">
              https://ec.europa.eu/consumers/odr/
            </a>
            . Unsere E-Mail-Adresse finden Sie oben im Impressum.
          </p>
        </section>

        <section className="legal-section">
          <h2>Verbraucherstreitbeilegung/Universalschlichtungsstelle</h2>
          <p>
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </section>
      </motion.main>
      <Footer />
    </div>
  )
}
