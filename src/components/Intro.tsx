import LineWarp from './LineWarp'
import Sunburst from './Sunburst'

/**
 * The homepage's one poster-title moment: the big name, a smaller role
 * subtitle, and a short proof-of-craft lede, paired with the Sunburst (the
 * site's one logo mark, also used in the header and the footer) given room
 * to be large and unaccompanied. The header next to it carries only the
 * logo now, not the name again — this is the one place the name is set big.
 * A faint LineWarp sits behind everything — the same field of parallel
 * warped lines the Timeline uses, so the motif reads as a site-wide
 * material rather than something built once for one section. Fixed
 * width/height (not measured) is fine here, unlike the Timeline: `.intro`
 * doesn't resize with dynamic content the way the Timeline's scroll height
 * does, so a stretched fixed-aspect pattern (`preserveAspectRatio="none"`)
 * looks identical to a measured one.
 */
export default function Intro() {
  return (
    <section className="intro">
      <LineWarp
        className="intro-linewarp"
        width={1200}
        height={260}
        lineCount={9}
        opacity={0.08}
      />
      <div className="intro-copy">
        <h1>Béla Veltrup</h1>
        <p className="intro-role">Computer Science Master&rsquo;s Student</p>
        <p className="intro-lede">
          
        </p>
      </div>
      <Sunburst className="intro-sunburst" />
    </section>
  )
}
