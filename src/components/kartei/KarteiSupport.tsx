import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './KarteiDetail.css'
import './KarteiPrivacy.css'

const DEFAULT_TITLE = 'Béla Veltrup — Portfolio'

/**
 * Support page for the Kartei app: the URL Apple's App Store Connect "Support URL"
 * field points to. Shown publicly on the App Store listing, so keep it accurate:
 * update the in-app paths below (Settings, Report) if those screens move.
 */
export default function KarteiSupport() {
  useEffect(() => {
    document.title = 'Support — Kartei'
    return () => {
      document.title = DEFAULT_TITLE
    }
  }, [])

  return (
    <div className="kd-root">
      <section className="kd-legal">
        <Link to="/projects/kartei" className="kd-back kd-back-legal">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M12 7H2M2 7L6.5 2.5M2 7L6.5 11.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Kartei
        </Link>

        <div className="kd-legal-inner">
          <h1>Support</h1>
          <p className="kd-legal-meta">
            For the Kartei app · Looking for the{' '}
            <Link to="/projects/kartei/privacy">Privacy Policy</Link> or the{' '}
            <Link to="/impressum">Impressum</Link> instead?
          </p>

          <section>
            <h2>Contact</h2>
            <p>
              Email <a href="mailto:contact@bela-dev.com">contact@bela-dev.com</a> for
              anything about the app: a bug, a question, or a problem with your
              account. Kartei is built and supported by one person, so please allow a
              few business days for a reply.
            </p>
          </section>

          <section>
            <h2>Delete your account</h2>
            <p>
              In the app: Settings → Manage account → Delete account. This removes
              your account and personal data immediately. If you can't access the
              app, email the address above and we'll do it for you.
            </p>
          </section>

          <section>
            <h2>Report a user or shared deck</h2>
            <p>
              Open the "⋯" menu on a friend or on a member of a shared deck and choose
              "Report". If it's about something you can't reach that way, email the
              address above with as much detail as you can.
            </p>
          </section>

          <section>
            <h2>Kartei+ subscription and billing</h2>
            <p>
              Subscriptions are billed and managed entirely through the App Store, not
              by us. Use "Restore Purchases" in Settings → Kartei+ if a purchase
              didn't apply, or manage/cancel it directly in your iPhone's Settings →
              your name → Subscriptions. For billing disputes or refunds, Apple
              handles those, not us; for anything else about the subscription, email
              the address above.
            </p>
          </section>

          <section>
            <h2>Something else</h2>
            <p>
              Email <a href="mailto:contact@bela-dev.com">contact@bela-dev.com</a> and
              describe what's happening. Screenshots help. We read every message.
            </p>
          </section>
        </div>
      </section>

      <footer className="kd-footer">
        <Link to="/projects/kartei" className="kd-back kd-back-footer">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M12 7H2M2 7L6.5 2.5M2 7L6.5 11.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Kartei
        </Link>
      </footer>
    </div>
  )
}
