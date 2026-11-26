import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Datenschutz() {
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
        <h1>Datenschutzerklärung</h1>
        <p className="tagline">
          Gilt für diese Portfolio-Website selbst. Für einzelne hier vorgestellte
          Projekte mit eigenem Produktcharakter (z. B. Apps) gilt diese Erklärung
          nicht — dort finden Sie, falls vorhanden, eine eigene, gesonderte
          Datenschutzerklärung auf der jeweiligen Projektseite.
        </p>

        <section className="legal-section">
          <h2>1. Verantwortlicher</h2>
          <p>
            Béla Veltrup
            <br />
            Schongauerstraße 35
            <br />
            81377 München
            <br />
            Deutschland
            <br />
            E-Mail: <a href="mailto:contact@bela-dev.com">contact@bela-dev.com</a>
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Hosting und Server-Logdaten</h2>
          <p>
            Diese Website wird über GitHub Pages gehostet (GitHub, Inc., 88 Colin P. Kelly
            Jr. Street, San Francisco, CA 94107, USA, ein Unternehmen der Microsoft
            Corporation), ausgeliefert über das Content-Delivery-Netzwerk von Fastly.
            Beim Aufruf dieser Website verarbeitet der Hoster automatisch technische
            Zugriffsdaten, die Ihr Browser übermittelt, insbesondere IP-Adresse, Datum
            und Uhrzeit des Zugriffs, aufgerufene Seite, Referrer-URL, Browsertyp und
            Betriebssystem. Diese Daten sind technisch zur Auslieferung der Website und
            zur Gewährleistung der Serversicherheit erforderlich und werden nicht mit
            anderen Daten zusammengeführt.
          </p>
          <p>
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an
            einem sicheren und funktionsfähigen Betrieb der Website).
          </p>
          <p>
            Da GitHub Pages in den USA betrieben wird, kann es dabei zu einer Übermittlung
            personenbezogener Daten in ein Drittland kommen. Dem liegt entweder ein
            Angemessenheitsbeschluss der EU-Kommission (EU-US Data Privacy Framework) oder
            Standardvertragsklauseln der EU-Kommission zugrunde.
          </p>
        </section>

        <section className="legal-section">
          <h2>3. Cookies und vergleichbare Technologien</h2>
          <p>
            Diese Website setzt keine Cookies und keine vergleichbaren Technologien im
            Sinne von § 25 TTDSG ein. Es findet keine Wiedererkennung über mehrere
            Besuche hinweg statt.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. Keine Analyse- und Trackingtools</h2>
          <p>
            Es werden keine Analyse-, Tracking- oder Werbedienste eingesetzt (z. B. keine
            Webanalyse, kein Social-Media-Tracking). Auch Schriftarten werden nicht von
            externen Servern (etwa Google Fonts) nachgeladen, sondern lokal mit der
            Website ausgeliefert, sodass dabei keine Verbindung zu Drittanbietern
            aufgebaut wird.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. Kontaktaufnahme</h2>
          <p>
            Ein Kontaktformular wird nicht angeboten. Der „Contact"-Link im Footer öffnet
            lediglich Ihr eigenes E-Mail-Programm (mailto-Link); Inhalt und Versand einer
            daraus entstehenden E-Mail liegen allein bei Ihnen. Antworten wir auf eine so
            erhaltene E-Mail, verarbeiten wir Ihre Absenderangaben zur Bearbeitung der
            Anfrage (Art. 6 Abs. 1 lit. f DSGVO) und löschen diese, sobald der
            Schriftwechsel abgeschlossen und keine gesetzliche Aufbewahrungspflicht mehr
            entgegensteht.
          </p>
        </section>

        <section className="legal-section">
          <h2>6. Externe Links</h2>
          <p>
            Der Footer verlinkt auf mein LinkedIn-Profil. Beim Anklicken verlassen Sie
            diese Website; es gilt dann die Datenschutzerklärung von LinkedIn
            (LinkedIn Ireland Unlimited Company). Der Link selbst übermittelt beim
            bloßen Laden dieser Seite keine Daten an LinkedIn, da er nicht als
            eingebundenes Element (z. B. Social-Plugin), sondern als reiner Textlink
            eingebunden ist.
          </p>
        </section>

        <section className="legal-section">
          <h2>7. Speicherdauer</h2>
          <p>
            Die unter Ziffer 2 genannten Server-Logdaten werden automatisiert durch den
            Hoster für einen begrenzten Zeitraum vorgehalten und danach gelöscht oder
            anonymisiert; auf die konkrete Speicherdauer bei GitHub Pages / Fastly habe
            ich keinen Einfluss.
          </p>
        </section>

        <section className="legal-section">
          <h2>8. Ihre Rechte</h2>
          <p>
            Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16
            DSGVO), Löschung (Art. 17 DSGVO), Einschränkung der Verarbeitung (Art. 18
            DSGVO), Datenübertragbarkeit (Art. 20 DSGVO) und Widerspruch gegen die
            Verarbeitung (Art. 21 DSGVO). Eine erteilte Einwilligung können Sie jederzeit
            mit Wirkung für die Zukunft widerrufen. Darüber hinaus steht Ihnen ein
            Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde zu, z. B. beim
            Bayerischen Landesamt für Datenschutzaufsicht (BayLDA).
          </p>
        </section>

        <section className="legal-section">
          <h2>9. Änderungen dieser Erklärung</h2>
          <p>
            Diese Datenschutzerklärung wird angepasst, sobald sich die hier beschriebene
            Datenverarbeitung ändert. Es gilt stets die aktuell unter dieser Adresse
            abrufbare Fassung.
          </p>
        </section>
      </motion.main>
      <Footer />
    </div>
  )
}
