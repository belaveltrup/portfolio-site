import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './KarteiDetail.css'
import './KarteiPrivacy.css'

const DEFAULT_TITLE = 'Béla Veltrup — Portfolio'

/**
 * Privacy policy for the Kartei app only — distinct from the portfolio site's
 * own Datenschutzerklärung at /datenschutz (German, § 5 DDG legal-notice
 * requirement, covers the website itself). Content reflects the app's actual
 * data flows (server/app/models.py, config.py, mailer.py, notify.py,
 * DEPLOY.md) rather than a generic template — update it here first if those
 * change.
 */
export default function KarteiPrivacy() {
  useEffect(() => {
    document.title = 'Privacy Policy — Kartei'
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
          <h1>Privacy Policy — Kartei app</h1>
          <p className="kd-legal-meta">
            Covers only the Kartei iOS/Android app · Last updated: November 2026
          </p>
          <p className="kd-legal-meta">
            Looking for this website's own privacy policy instead?{' '}
            <Link to="/datenschutz">Datenschutzerklärung (Website)</Link>.
          </p>

          <section>
            <h2>1. Controller</h2>
            <p>
              The controller responsible for data processing in the Kartei app is:
              <br />
              Béla Veltrup
              <br />
              Schongauerstraße 35
              <br />
              81377 Munich, Germany
              <br />
              Email: <a href="mailto:contact@bela-dev.com">contact@bela-dev.com</a>
            </p>
          </section>

          <section>
            <h2>2. Overview</h2>
            <p>
              Kartei is offline-first: your flashcards and study progress live first on
              your device (SQLite) and are synced with our server so they're available
              across devices and don't get lost. Beyond that, we process data for your
              account, for optional features such as photos of study material, friends,
              shared decks and reminders, and for the "Kartei+" subscription. The
              details are below.
            </p>
          </section>

          <section>
            <h2>3. Account and sign-up</h2>
            <p>
              Creating an account requires an email address and a password (stored by us
              only as a hash, never in plain text), or you can sign in with "Sign in with
              Apple" or your Google account. When you sign in via Apple or Google, we
              receive a unique identifier from that provider — one that can't be derived
              from your name — and, if you allow it, the associated email address, so we
              can create and recognize your account. You can also set a username and a
              profile picture or avatar.
            </p>
            <p>Legal basis: Art. 6(1)(b) GDPR (performance of the user relationship).</p>
          </section>

          <section>
            <h2>4. Study content and progress</h2>
            <p>
              Your flashcards (text and images), decks, and your per-card progress
              (mastery stage, interval, next due date), along with your study sessions and
              statistics, are stored on your device and synced with our server so nothing
              is lost and multiple devices stay in sync. Your progress on a deck shared
              with others is not currently shared with the other members of that deck.
            </p>
            <p>Legal basis: Art. 6(1)(b) GDPR.</p>
          </section>

          <section>
            <h2>5. Creating cards from a photo or document</h2>
            <p>
              When you photograph a slide or upload a document to automatically generate
              flashcards from it, that file is sent to an AI model to detect the card type,
              text, image regions, and possible occlusions. Depending on configuration,
              this uses Google Gemini, Groq, or a model from another provider routed
              through OpenRouter. The uploaded image is kept for as long as it's needed
              for the card it produced. How often you can use this feature per day is
              limited; for that we only count the number of uses per account per day.
            </p>
            <p>
              Legal basis: Art. 6(1)(b) GDPR for the processing itself (you actively
              trigger the feature) and Art. 6(1)(f) GDPR (legitimate interest in
              economically sustainable operation) for the usage count. See section 12 on
              transfers to the US.
            </p>
          </section>

          <section>
            <h2>6. Friends, shared decks, and reminders</h2>
            <p>
              You become friends with someone via an invite link; we store who is friends
              with whom and whether that connection was confirmed. Friends can see
              whether you've studied today and your study streak — for that we need your
              time zone so "today" is calculated correctly. Shared decks are joined via a
              link or QR code that expires automatically after a short time; we store the
              member list of such a deck (up to 30 members) and each member's individual
              study deadline. Any comparison of your progress with friends or group
              members (e.g. a streak ranking) is based on this same data. You can disable
              reminders from friends in settings at any time.
            </p>
            <p>Legal basis: Art. 6(1)(b) GDPR, and additionally Art. 6(1)(a) GDPR for reminders.</p>
          </section>

          <section>
            <h2>7. Push notifications</h2>
            <p>
              For reminders and similar notices, we send push notifications via the Expo
              Push Service (650 Industries, Inc., USA), which forwards them to Apple's or
              Google's push service. For this we store a push token assigned by your
              device. You can disable push notifications at any time in your device
              settings or in the app.
            </p>
            <p>Legal basis: Art. 6(1)(a) GDPR.</p>
          </section>

          <section>
            <h2>8. Advertising and tracking</h2>
            <p>
              The app shows ads via Google AdMob (Google Ireland Limited, with
              infrastructure operated in part by Google LLC, USA). On iOS, before any ad
              is personalized using your device's advertising identifier, we ask for your
              permission via Apple's App Tracking Transparency framework. If you decline,
              or haven't been asked yet, you still see ads, but non-personalized ones,
              shown without that identifier. AdMob may set its own identifiers and process
              data according to Google's privacy policy
              (<a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">policies.google.com/privacy</a>).
            </p>
            <p>
              Legal basis: Art. 6(1)(a) GDPR (consent via the App Tracking Transparency
              prompt) for personalized ads; Art. 6(1)(f) GDPR (legitimate interest in
              funding a free app) for non-personalized ads shown without that identifier.
            </p>
          </section>

          <section>
            <h2>9. "Kartei+" subscription</h2>
            <p>
              Payments for the subscription are handled exclusively by the App Store
              (Apple) or Google Play; we never receive your payment or card details. To
              check server-side whether a subscription is active, we use the service
              RevenueCat, Inc. (USA), which reports the subscription status for your
              account back to us.
            </p>
            <p>Legal basis: Art. 6(1)(b) GDPR.</p>
          </section>

          <section>
            <h2>10. Sending emails</h2>
            <p>
              To confirm your email address and to reset your password, we send emails
              via IONOS SE (Germany), our email provider. This processes your email
              address and the necessary content of that email.
            </p>
            <p>Legal basis: Art. 6(1)(b) GDPR.</p>
          </section>

          <section>
            <h2>11. Hosting and server location</h2>
            <p>
              Our server runs on Google Cloud in a data center in Frankfurt am Main
              (Germany, EU). We have a data processing agreement with this hosting
              provider under Art. 28 GDPR.
            </p>
          </section>

          <section>
            <h2>12. Log and device data</h2>
            <p>
              Operating the app technically produces additional data: your IP address
              (briefly, to detect abuse and limit requests over time), a device identifier
              generated by your device, device name, and the time of your last activity.
              If you report a card, deck, or user (e.g. for inappropriate content), we
              store who reported what and why, so we can act on the report.
            </p>
            <p>Legal basis: Art. 6(1)(f) GDPR (legitimate interest in secure, functioning operation).</p>
          </section>

          <section>
            <h2>13. Transfers to third countries</h2>
            <p>
              Some of the providers named above — including Google (Gemini, AdMob), Groq,
              OpenRouter, RevenueCat, and Expo/650 Industries — are based, or run
              servers, (in part) in the USA. Where personal data is transferred to a
              country outside the EU/EEA as a result, we rely on the European
              Commission's Standard Contractual Clauses or, where applicable, an
              adequacy decision (e.g. the EU-US Data Privacy Framework).
            </p>
          </section>

          <section>
            <h2>14. Retention period</h2>
            <p>
              We keep account, study, and social data until you delete your account.
              Login tokens expire automatically (access tokens after 15 minutes, refresh
              tokens after 60 days at the latest), and email confirmation codes and deck
              invite links after a short, fixed validity period. We keep database backups
              for up to 14 days, after which they are automatically overwritten.
            </p>
          </section>

          <section>
            <h2>15. Deleting your account</h2>
            <p>
              You can request deletion of your account at any time by emailing{' '}
              <a href="mailto:contact@bela-dev.com">contact@bela-dev.com</a>. We will then
              delete or anonymize your personal data, unless a legal retention
              obligation prevents this.
            </p>
          </section>

          <section>
            <h2>16. Recipients at a glance</h2>
            <ul>
              <li>Hosting: Google Cloud (data center in Frankfurt am Main)</li>
              <li>AI processing of photos/documents: Google (Gemini), Groq, Inc., OpenRouter, Inc.</li>
              <li>Advertising: Google AdMob (Google Ireland Limited / Google LLC)</li>
              <li>Sign-in: Apple Inc., Google LLC</li>
              <li>Push notifications: Expo / 650 Industries, Inc.</li>
              <li>Subscription check: RevenueCat, Inc.</li>
              <li>Email delivery: IONOS SE (Germany)</li>
            </ul>
          </section>

          <section>
            <h2>17. Your rights</h2>
            <p>
              You have the right to access (Art. 15 GDPR), rectification (Art. 16 GDPR),
              erasure (Art. 17 GDPR), restriction of processing (Art. 18 GDPR), data
              portability (Art. 20 GDPR), and objection to processing (Art. 21 GDPR). You
              can withdraw any consent you've given at any time, with effect for the
              future. You also have the right to lodge a complaint with a data
              protection supervisory authority, e.g. the Bavarian State Office for Data
              Protection Supervision (Bayerisches Landesamt für Datenschutzaufsicht).
            </p>
          </section>

          <section>
            <h2>18. Use by children</h2>
            <p>
              Kartei is not specifically directed at children under 16. We are not
              aware of children under 16 submitting personal data to us without the
              consent of a parent or guardian.
            </p>
          </section>

          <section>
            <h2>19. Changes to this policy</h2>
            <p>
              We update this privacy policy whenever the data processing it describes
              changes. You'll always find the current version at this address.
            </p>
          </section>

          <section>
            <h2>20. Contact</h2>
            <p>
              For privacy-related questions, please contact{' '}
              <a href="mailto:contact@bela-dev.com">contact@bela-dev.com</a>.
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
