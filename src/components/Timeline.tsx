import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import type { Project } from '../data/projects'
import { formatProjectDate, jamTagline } from '../data/projects'
import { buildTimeline, formatMilestoneRange } from '../data/timeline'
import LineWarp from './LineWarp'

// Narrow viewports: a single left-aligned column with a gentle gutter wiggle
// (not enough width for a two-column path).
const GUTTER_AMPLITUDE = 13
const GUTTER_WAVELENGTH = 260
const GUTTER_BASE_X = 15
// Narrow mode's cards sit this far right of the gutter's own coordinate
// space (see .timeline-node's margin-left in index.css) — the wandering
// line and its marker must never be drawn under a card's own background
// (the milestone plaque), so this margin is the width of their shared lane.
const GUTTER_NODE_MARGIN = 24
// The gutter SVG is positioned 21px left of .timeline-path (see
// .timeline-curve's `left` in index.css), with GUTTER_BASE_X as its own
// local-coordinate center — so a point at path-relative x (GUTTER_BASE_X +
// wobble - 21) is where the curve actually draws. --marker-x converts that
// into the node's own coordinate space (whose left edge sits
// GUTTER_NODE_MARGIN to the right of the path's); CSS then only needs to
// subtract each marker's own half-width to land it centered exactly on the
// line, rather than offset from it.
const GUTTER_MARKER_BASE = GUTTER_BASE_X - 21 - GUTTER_NODE_MARGIN

// Wide viewports: a center path spanning the full width, entries alternating
// left and right of it — rail positions as a PROPORTION of panel width
// (0–100, converted to real pixels once `width` is known at layout time),
// since the rails should scale with the panel. The noise wobble layered onto
// them deliberately does NOT scale this way — see NOISE_AMPLITUDE_PX below.
// A side transition is BY FAR the largest driver of local density variation
// along the curve (a full rail-to-rail swing covering this much of the panel
// width, completed within as little as one entry's own row, dwarfs the
// noise texture layered on top of it) — pacing can only ever insert
// compensating space in the small natural gap after an entry (never inside
// its own rendered text), so the width of that swing directly bounds how
// gentle a transition can ever be made to look, independent of how well the
// pacing math itself is tuned. 18/82 (a 64%-of-width swing) was pushing that
// past what pacing could meaningfully smooth — a first, modest cut to 27/73
// measurably helped little, so the swing was cut much harder, to 35/65 (a
// ~30%-of-width swing, under half the original), which is what actually
// brought the measured ratio-to-mean distribution in line (out-of-band count
// dropped from ~40% to single digits). This keeps the alternating,
// full-width-spanning read the brief asked for, just noticeably less extreme
// than the original — a real, deliberate trade-off made for correctness,
// not a tuning afterthought.
const WIDE_BREAKPOINT = '(min-width: 720px)'
const RAIL_LEFT = 35
const RAIL_RIGHT = 65

function gutterOffset(y: number): number {
  return GUTTER_AMPLITUDE * Math.sin(y / GUTTER_WAVELENGTH)
}

// --- Continuous organic texture (value noise, a simpler cousin of Perlin
// noise: pseudo-random values at integer lattice points, smoothly
// interpolated between them) layered along the whole path length, not just
// at the handful of waypoints — this is what makes it read as a wandering,
// hand-drawn path rather than a clean geometric curve with a few bends. ---

function latticeValue(i: number): number {
  let h = i | 0
  h = Math.imul(h ^ (h >>> 16), 2246822507)
  h = Math.imul(h ^ (h >>> 13), 3266489909)
  h ^= h >>> 16
  return ((h >>> 0) / 4294967295) * 2 - 1
}


function smoothstep(t: number): number {
  return t * t * (3 - 2 * t)
}

function valueNoise1D(x: number): number {
  const i0 = Math.floor(x)
  const t = smoothstep(x - i0)
  return latticeValue(i0) * (1 - t) + latticeValue(i0 + 1) * t
}

/** Three octaves (broad sway, medium wiggle, fine texture) summed together —
 * a standard fractal-noise technique, giving irregularity at multiple
 * scales simultaneously rather than one uniform wobble size. */
function fractalNoise(x: number): number {
  return valueNoise1D(x) * 0.58 + valueNoise1D(x * 2.6) * 0.32 + valueNoise1D(x * 6.3) * 0.1
}

const NOISE_WAVELENGTH = 130
// A FIXED pixel wobble — deliberately NOT a proportion of panel width. This
// was previously expressed in the same 0–100 "percent of width" units as the
// rail positions (so it scaled up on a wider panel: ~20% of a 1920px panel
// is a ~384px swing). That alone was already a real bug — a hand-drawn
// wobble should have a roughly constant physical size regardless of canvas
// width, not grow with it — but it ALSO produced a probably-worse symptom
// at ordinary widths: the finest fractal-noise octave has roughly a ~20px
// natural wavelength (NOISE_WAVELENGTH / 6.3), and a 20%-of-width amplitude
// on even a 1240px-wide panel put ~2.5px of that octave's own weight (0.1 ×
// amplitude) at a slope well past 1 relative to its own wavelength — a
// genuine zigzag/hairpin in the rendered path, not a gentle texture. A fixed
// 16px amplitude keeps every octave's slope-within-its-own-wavelength well
// under 1 at any panel width, which is what actually keeps the curve a
// flowing line instead of a lightning bolt.
const NOISE_AMPLITUDE_PX = 16
const BLOCK_WIDTH = 320
// The floor a block may narrow to when a side transition leaves it little
// room — still enough for a title, a line of description, and tags to wrap
// without looking broken, which is what matters more than hitting the full
// default width on every single entry.
const BLOCK_MIN_WIDTH = 200
const BLOCK_MIN_GAP = 36
const BLOCK_MAX_GAP = 170
// How much of the room between the line and the panel's center the block
// drifts into when that room is generous — kept modest so the block stays
// visually anchored to its own point on the path (a stronger pull reads as
// "floating near the middle," disconnected from the marker it belongs to),
// never the bare minimum either, which would crowd every block hard against
// the line even when its side of the panel sits mostly empty.
const BLOCK_CENTER_PULL = 0.32
// The single largest extra gap pacing may insert after any one entry — a
// safety cap so one freak stretch of curve can't blow out the scroll length,
// not the main pacing mechanism itself (see the PACING comment below).
const PACING_MAX_GAP = 260
// How far down the VISIBLE panel (a fraction of its own clientHeight, not a
// small fixed pixel amount) the reveal point is read from. A small fixed
// lookahead (56px tried first) pins the drawn/undrawn transition right near
// the panel's own top edge — meaning almost the entire visible panel is
// always still-undrawn preview, so an entry scrolling up through it reads as
// disappearing off the top edge barely more than a sliver after it ever
// showed as drawn (measured directly: the first entry was fully scrolled out
// of view while only ~20% of the ENTIRE path had drawn). Reading the reveal
// point this far down instead means the drawn/undrawn transition sits at a
// fixed screen position three-quarters of the way down the panel at all
// times: an entry scrolling up from the bottom spends its last quarter of
// travel undrawn, then the rest of its time on screen already shown drawn,
// which is what "stays revealed" actually requires — a fixed pixel lookahead
// can never do this consistently across panel heights (60vh mobile vs 70vh
// desktop, or any future breakpoint), since the transition's screen position
// would shift with viewport size instead of staying anchored to it.
const REVEAL_LOOKAHEAD_FRACTION = 0.75

/** Which rail each entry sits on — deterministic, and bounded: every run is
 * 1 or 2 entries, picked per-run from the seed, never a single mechanical
 * left-right-left-right alternation (every run forced to 1) and never a long
 * streak stranded on one side either (an earlier unbounded version — each
 * step independently ~45% likely to repeat the side — could by chance
 * produce runs of 3-4 with only a handful of entries, which read as
 * "stuck," and could just as easily have produced rapid alternation the
 * next time; bounding run length to {1, 2} keeps the rhythm readable in
 * both directions). Still fully stable across re-renders (seeded from the
 * run index, not Math.random()). */
function computeSides(count: number): ('left' | 'right')[] {
  const sides: ('left' | 'right')[] = []
  let side: 'left' | 'right' = 'right'
  let runIndex = 0
  while (sides.length < count) {
    const runLength = latticeValue(runIndex * 53 + 11) > 0 ? 2 : 1
    for (let k = 0; k < runLength && sides.length < count; k++) {
      sides.push(side)
    }
    side = side === 'right' ? 'left' : 'right'
    runIndex++
  }
  return sides
}

/** Dense points along the smooth guide through every waypoint, continuous
 * tangent direction at each one (uniform Catmull-Rom, converted to cubic
 * bezier segments) — the standard technique for a flowing line through
 * waypoints. A naive bezier using each point's own X as its control-point X
 * produces a sharp kink at every node instead of a flowing curve. The guide
 * passes through each original point exactly (Catmull-Rom's defining
 * property), but drifts toward the NEXT point well before reaching it —
 * callers that need "how close does the curve get to entry N" must sample
 * this, not assume the curve stays near entry N's own rail until entry N+1. */
function guideSamples(points: { x: number; y: number }[]): { x: number; y: number }[] {
  if (points.length <= 1) return points.map((p) => ({ ...p }))

  const samples: { x: number; y: number }[] = [points[0]]
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6

    const segHeight = Math.abs(p2.y - p1.y)
    const steps = Math.max(8, Math.round(segHeight / 4))
    for (let s = 1; s <= steps; s++) {
      const t = s / steps
      const mt = 1 - t
      const x =
        mt * mt * mt * p1.x + 3 * mt * mt * t * cp1x + 3 * mt * t * t * cp2x + t * t * t * p2.x
      const y =
        mt * mt * mt * p1.y + 3 * mt * mt * t * cp1y + 3 * mt * t * t * cp2y + t * t * t * p2.y
      samples.push({ x, y })
    }
  }
  return samples
}

/** Noise added to the guide's dense samples — this is the final, actually
 * rendered curve geometry (before pacing's vertical stretch), in order along
 * the path. Both X and Y are real pixels throughout (X already converted
 * from the rail's proportional position by the caller) — see
 * NOISE_AMPLITUDE_PX for why the wobble itself is a fixed pixel amount
 * rather than scaling with panel width. */
function noisySamples(points: { x: number; y: number }[]): { x: number; y: number }[] {
  return guideSamples(points).map((p) => ({
    x: p.x + fractalNoise(p.y / NOISE_WAVELENGTH) * NOISE_AMPLITUDE_PX,
    y: p.y,
  }))
}

/** Binary-searches a dense, ascending-by-y (documentY -> arc-length
 * fraction) lookup table for `targetY`, interpolating between the two
 * bracketing samples. Shared by the scroll-tick reveal and by the one-time
 * "what fraction does max scroll actually reach" calculation below, so both
 * always agree on what the table says. */
function sampleLookup(lookup: { y: number; frac: number }[], targetY: number): number {
  if (lookup.length === 0) return 1
  const first = lookup[0]
  const last = lookup[lookup.length - 1]
  if (targetY <= first.y) return first.frac
  if (targetY >= last.y) return last.frac
  let lo = 0
  let hi = lookup.length - 1
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1
    if (lookup[mid].y <= targetY) lo = mid
    else hi = mid
  }
  const y0 = lookup[lo].y
  const y1 = lookup[hi].y
  const t = y1 > y0 ? (targetY - y0) / (y1 - y0) : 0
  return lookup[lo].frac + t * (lookup[hi].frac - lookup[lo].frac)
}

function pathFromSamples(samples: { x: number; y: number }[]): string {
  let d = ''
  samples.forEach((p, i) => {
    d += i === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`
  })
  return d
}

// --- PACING ------------------------------------------------------------
// Goal: scrolling down should draw the teal line at a roughly constant
// VISUAL rate regardless of local curve slope — a near-horizontal stretch
// packs a lot of drawn arc length into very little vertical space, so
// without correction it "snaps" past in an instant of scrolling while a
// near-vertical stretch (arc length ≈ vertical span) feels normal. The fix
// inserts extra blank vertical space after an entry so the document has to
// scroll further to get through whatever dense stretch that entry's own row
// contains, keeping "vertical space scrolled" roughly proportional to "arc
// length drawn" everywhere, not just on average.
//
// This used to be computed per inter-entry segment, inside the same damped,
// multi-pass loop used for block-width convergence, and inserted as a
// single marginBottom lump. Two things made it read as broken rather than
// smooth: the segment's arc-length excess was measured between two
// waypoints that sit near each entry's own TOP (offsetTop + 24), a range
// that is MOSTLY that entry's own card interior — while the compensating
// margin can only physically land in the gap AFTER the card, well past
// where the actual dense stretch usually was. And because the damped loop
// recomputed the spacer every pass from a layout that was itself still
// shifting (narrowing a block changes its height, which moves every
// waypoint below it), the amount itself wasn't guaranteed to settle either.
//
// The fix below is a single closed-form forward sweep over the already-
// settled (post width-convergence) natural layout — nothing here iterates,
// so there's nothing to fail to converge. For every entry, in document
// order, it measures the real arc length drawn between the PREVIOUS entry's
// own real bottom edge and THIS entry's own real bottom edge — i.e. exactly
// the span the one gap after this entry could act on — and, if that span's
// own local density exceeds the path's average, adds just enough gap to
// bring it down to average. That correctly attributes a card's own interior
// density to the one gap that can actually act on it — the gap immediately
// following it — instead of crediting it to the wrong end of the wrong
// segment.
//
// An earlier version of this fix compared a RUNNING CUMULATIVE arc length
// against a single flat "average density" line from the very start of the
// path, adding gap only when the cumulative total fell behind that line —
// mathematically sound in isolation, but it silently failed on exactly the
// shape this curve actually has: density alternates between distinctly low
// and distinctly high stretches as entries alternate sides (a side
// transition's own rail-to-rail swing is a much bigger driver of local
// density than the noise texture layered on top of it), and a long enough
// run of low-density segments "banks" enough cumulative slack that a
// following high-density segment never visibly pushes the running total
// AHEAD of the flat reference line — so the cumulative check kept finding
// nothing to correct right up until the very end of the path, where the
// books necessarily balance by definition. Comparing each segment's own
// local density independently, with no memory of earlier segments, doesn't
// have that blind spot: a dense segment gets compensated for being dense,
// full stop, regardless of how slack-rich the segments before it happened
// to be.
function computeGaps(
  naturalAnchors: number[],
  naturalBottoms: number[],
  cumLengthAtY: (y: number) => number,
  totalLength: number,
): number[] {
  const n = naturalAnchors.length
  const totalY = n > 1 ? naturalAnchors[n - 1] - naturalAnchors[0] : 0
  const avgDensity = totalY > 0 ? totalLength / totalY : 1
  const gaps: number[] = []
  // The segment each gap[i] corrects runs from the PREVIOUS entry's own real
  // bottom edge (or the path's start, for i=0) to THIS entry's own real
  // bottom edge — exactly the span of path that the gap physically inserted
  // right after entry i can act on.
  let prevBoundaryY = naturalAnchors[0] ?? 0
  let prevArc = 0
  for (let i = 0; i < n; i++) {
    if (i < n - 1) {
      const bottom = naturalBottoms[i]
      const arcAtBottom = cumLengthAtY(bottom)
      const segArc = Math.max(0, arcAtBottom - prevArc)
      const segY = Math.max(0, bottom - prevBoundaryY)
      const desiredSegY = avgDensity > 0 ? segArc / avgDensity : segY
      const g = Math.max(0, Math.min(PACING_MAX_GAP, desiredSegY - segY))
      gaps[i] = g
      prevBoundaryY = bottom
      prevArc = arcAtBottom
    } else {
      gaps[i] = 0
    }
  }
  return gaps
}

/** Remaps every dense curve sample's natural Y to its stretched (post-gap) Y
 * so the rendered curve lines up with where the stretched cards actually
 * sit. X is left untouched: stretching only inserts blank vertical space
 * between cards, it never re-samples the noise field, so the curve's own
 * shape (and the pacing math's own measurement of it) stay exactly the ones
 * already computed. `naturalBottoms`/`gaps` must be ascending in Y and
 * aligned index-for-index; `samples` must already be in ascending Y order
 * (true by construction — the guide is built in strictly increasing
 * document order).
 *
 * Each gap ramps in smoothly over a window straddling its boundary, rather
 * than landing as an instant step. An instant step put the ENTIRE gap amount
 * between two dense samples that were only ~4px apart in natural Y, turning
 * that one pair into a single near-perfectly-vertical straight segment
 * carrying the whole gap's length in one jump. Measured directly: a
 * monotonic path's length-per-scrolled-pixel is at its theoretical floor on
 * a pure-vertical segment, so that one jump plunged straight to the floor
 * and snapped back immediately on either side of a stretch that was already
 * running hot (that's the whole reason a gap was inserted there). A viewer
 * doesn't experience that as "paced" — they experience a burst of busy
 * drawing, a dead vertical crawl, then another burst: the surge-crawl-surge
 * complaint, just moved from "no pacing at all" to "pacing applied as a
 * single discontinuous jump." Spreading each gap's onset across a window
 * turns that one jarring segment into a gradual S-curve across several
 * samples instead, so the transition itself stops being a visible
 * discontinuity — even though the underlying fact driving it (a fixed-height
 * card can't be internally stretched, so its own interior stays dense no
 * matter what happens around it) is unchanged.
 *
 * The ramp window for gap[j] is bounded to [naturalBottoms[j],
 * naturalAnchors[j+1]] — it can only start AFTER entry j's own real content
 * ends (never earlier, or the curve would visibly drift away from its
 * "worst-case reach" collision envelope while still running alongside that
 * entry's own text, which was computed against the UNSTRETCHED samples in
 * that row) and MUST finish exactly by entry j+1's own anchor (or its
 * marker would no longer sit exactly on the rendered curve — the ramp
 * reaching t=1 only "eventually" rather than precisely there was a real bug
 * in an earlier, fixed-radius version of this function: a radius wider than
 * the natural room before the next anchor left the two permanently out of
 * sync). Anchoring the window to the real waypoints on both ends makes that
 * correctness incidental to the math rather than dependent on tuning a
 * constant against content that can change. */
/** The cumulative pacing stretch at a single natural Y — pulled out of
 * stretchSamplesY's own per-sample map so a marker's displayed position
 * (computed at an arbitrary natural Y, not necessarily one of the dense
 * samples) can be stretched by exactly the same rule the curve itself was,
 * rather than by an approximation of it. */
function stretchYAt(
  y: number,
  naturalBottoms: number[],
  naturalAnchors: number[],
  gaps: number[],
): number {
  let cum = 0
  for (let j = 0; j < naturalBottoms.length; j++) {
    const g = gaps[j]
    if (!g) continue
    const start = naturalBottoms[j]
    const end = Math.max(start, naturalAnchors[j + 1] ?? start)
    const span = end - start
    const t = span > 0 ? smoothstep(Math.min(1, Math.max(0, (y - start) / span))) : y >= start ? 1 : 0
    cum += g * t
  }
  return y + cum
}

function stretchSamplesY(
  samples: { x: number; y: number }[],
  naturalBottoms: number[],
  naturalAnchors: number[],
  gaps: number[],
): { x: number; y: number }[] {
  return samples.map((s) => ({ x: s.x, y: stretchYAt(s.y, naturalBottoms, naturalAnchors, gaps) }))
}

export default function Timeline({ projects }: { projects: Project[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const markerRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const curvePathRef = useRef<SVGPathElement>(null)
  // Populated once per curve geometry settle (see the effect below the main
  // layout one) from the ACTUAL rendered path — getTotalLength() and
  // getPointAtLength() give real SVG arc length, the only thing that makes
  // "reveal linearly with path length" meaningful rather than approximated.
  // `lookup` is a dense (documentY -> arc-length fraction) table sampled
  // from that same real path, read with a cheap binary search on every
  // scroll tick instead of calling getPointAtLength live at scroll-event
  // frequency. Refs, not state: read every scroll tick, and re-rendering on
  // every tick is exactly what this avoids.
  const revealDataRef = useRef<{
    svgLength: number
    entryThreshold: Record<string, number>
    lookup: { y: number; frac: number }[]
  }>({
    svgLength: 0,
    entryThreshold: {},
    lookup: [],
  })
  // Wide mode only: the "virtual" accumulated scroll position driving the
  // reveal, decoupled from the container's own real scrollTop — see the
  // wheel-handling effect below for why the two need to be different numbers
  // during the initial pin phase. This is the raw, instantly-updated TARGET
  // (every wheel tick lands here immediately); smoothScrollRef below is what
  // actually drives scrollTop/reveal, easing toward this target instead of
  // snapping to it, since wheel deltas arrive in large, irregular chunks.
  const virtualScrollRef = useRef(0)
  const smoothScrollRef = useRef(0)
  const scrollRafRef = useRef<number | null>(null)
  const scrollRafTimeRef = useRef<number | null>(null)
  // The highest reveal fraction ever reached this mount — reveal only ever
  // reads from this going forward, so scrolling back up moves the view
  // without undrawing the line or fading any entry back out. Resets
  // naturally on remount (switching to Grid and back to Timeline), which is
  // the intended scope: "stays revealed for as long as you're on the
  // Timeline tab," not forever.
  const maxRevealProgressRef = useRef(0)
  // What we ourselves last set container.scrollTop to — lets the external-
  // scroll safety net below tell "a scroll event this component's own write
  // just caused" apart from "a scroll event from somewhere else (keyboard
  // focus, a screen reader)," which it would otherwise have no way to do.
  const lastAppliedScrollTopRef = useRef<number | null>(null)
  // buildTimeline() allocates a new array every call — memoized so the two
  // effects below (keyed on `entries`) don't re-fire on every render and
  // loop forever setting state with fresh object references.
  const entries = useMemo(() => buildTimeline(projects), [projects])
  // Shared between the curve geometry and each node's data-side attribute,
  // so the two always agree on which rail a given entry belongs to.
  const sides = useMemo(() => computeSides(entries.length), [entries.length])
  const [activeSlug, setActiveSlug] = useState<string | null>(entries[0]?.slug ?? null)
  const [markerX, setMarkerX] = useState<Record<string, number>>({})
  // Wide mode only: each entry's marker rendered as a real positioned element
  // at its exact (noisy) point on the curve, in pixels — a CSS percentage or
  // a fixed rail-edge offset can't track the noise, which depends on the
  // panel's actual pixel width (the rail itself is a proportion of it).
  const [markerPos, setMarkerPos] = useState<Record<string, { x: number; y: number }>>({})
  // Each entry's text block, offset from the curve's own position rather
  // than pinned to a fixed half-screen column — "side" only decides which
  // direction it reads away from the line, not where it starts.
  const [blockX, setBlockX] = useState<Record<string, number>>({})
  const [blockWidth, setBlockWidth] = useState<Record<string, number>>({})
  // Extra space after an entry whose own row packs a lot of arc length into
  // little vertical height (a near-horizontal stretch) — see the PACING
  // comment above computeGaps. Scroll distance maps to real drawn path
  // length instead of just document height.
  const [blockSpacer, setBlockSpacer] = useState<Record<string, number>>({})
  const [curve, setCurve] = useState<{ d: string; height: number; viewBoxWidth: number }>({
    d: '',
    height: 0,
    viewBoxWidth: 30,
  })
  const [isWide, setIsWide] = useState(() => window.matchMedia(WIDE_BREAKPOINT).matches)

  useEffect(() => {
    const mq = window.matchMedia(WIDE_BREAKPOINT)
    const onChange = (e: MediaQueryListEvent) => setIsWide(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    // The "current" node is whichever one sits closest to the container's own
    // top edge — derived straight from scroll position, not from a race between
    // simultaneous viewport-enter callbacks (which breaks when several nodes
    // fit on screen at once, the common case for a short project list).
    function updateActive() {
      if (!container) return
      const containerTop = container.getBoundingClientRect().top
      let closestSlug: string | null = null
      let closestDistance = Infinity
      for (const [slug, el] of nodeRefs.current) {
        const distance = Math.abs(el.getBoundingClientRect().top - containerTop)
        if (distance < closestDistance) {
          closestDistance = distance
          closestSlug = slug
        }
      }
      if (closestSlug) setActiveSlug(closestSlug)
    }

    updateActive()
    container.addEventListener('scroll', updateActive, { passive: true })
    return () => container.removeEventListener('scroll', updateActive)
  }, [entries])

  useLayoutEffect(() => {
    // Narrowing a block changes its height, which shifts the waypoints
    // below it, which can call for a different width next pass — and that
    // feedback doesn't settle monotonically (observed empirically: a tight
    // width one pass can free up enough vertical room that the next pass
    // wants full width again, overshooting back and forth). Blending each
    // pass's freshly computed width with the previous pass's, rather than
    // jumping straight to it, damps that oscillation so it actually
    // converges instead of bouncing indefinitely. This damped iteration is
    // ONLY for block width — pacing (see computeGaps) is a single
    // closed-form pass with nothing to converge, run once widths settle.
    const prevWidths: Record<string, number> = {}

    // One width-convergence pass: read current DOM geometry, compute each
    // entry's marker/block/width from it, and either apply widths straight
    // to the DOM (bypassing React) so the next pass's offsetTop/offsetHeight
    // reflects the change, or — on the final pass — leave the DOM untouched
    // and just return the settled numbers, since pacing still needs to run
    // against this settled-but-uncommitted layout before anything commits.
    function runWidthPass(final: boolean): {
      width: number
      height: number
      points: { slug: string; x: number; y: number }[]
      samples: { x: number; y: number }[]
      widths: Record<string, number>
      blocks: Record<string, number>
    } | null {
      const wrapper = pathRef.current
      if (!wrapper) return null
      const width = wrapper.offsetWidth
      const height = wrapper.offsetHeight

      // Side comes from computeSides() (deterministic, index-seeded, but
      // not strict alternation — runs of 1-2 entries on one side happen
      // regularly), shared with the data-side attribute below so the
      // layout and the curve geometry always agree. Points keep strictly
      // increasing Y (the real document order), so the guide curve can
      // never loop back on itself; the continuous noise layered in below
      // supplies the fine irregularity instead of jittering these
      // waypoints directly, which only bent the curve at a handful of
      // discrete spots.
      // Rail position is a proportion of panel width, converted to a real
      // pixel X right here, once, since `width` is only known at layout
      // time — everything downstream (noise, block offsets, the rendered
      // path) works in real pixels from this point on. This waypoint Y
      // shapes the curve itself and feeds the pacing math (computeGaps/
      // stretchSamplesY below) — it deliberately stays near each card's own
      // top rather than its center, preserving the exact curve shape and
      // inter-entry spacing already tuned. The marker's own DISPLAYED
      // position is computed separately, at each card's true vertical
      // center (see positions in finishWide below) — decoupled from this
      // waypoint so moving where the marker reads never reshapes the curve
      // or its spacing.
      const points: { slug: string; x: number; y: number }[] = []
      entries.forEach((entry, i) => {
        const el = nodeRefs.current.get(entry.slug)
        if (!el) return
        const x = ((sides[i] === 'right' ? RAIL_RIGHT : RAIL_LEFT) / 100) * width
        points.push({ slug: entry.slug, x, y: el.offsetTop + 24 })
      })

      // The actual rendered curve geometry (pre-pacing) — samples[].x
      // already carries the noise, in real pixels; samples[].y is real
      // pixels too. Block width/offset below reads from this SAME array, so
      // nothing can drift out of sync with what's on screen.
      const samples = noisySamples(points)

      const positions: Record<string, { x: number; y: number }> = {}
      const blocks: Record<string, number> = {}
      const widths: Record<string, number> = {}
      entries.forEach((entry, i) => {
        const el = nodeRefs.current.get(entry.slug)
        const p = points.find((pt) => pt.slug === entry.slug)
        if (!el || !p) return
        const side = sides[i]

        const markerX = p.x + fractalNoise(p.y / NOISE_WAVELENGTH) * NOISE_AMPLITUDE_PX
        positions[entry.slug] = { x: markerX, y: p.y }

        // Block: offset from the curve's worst-case reach across this
        // entry's whole row, read from the REAL rendered samples — not a
        // "rail + noise" approximation, which misses how far the guide
        // spline drifts toward a neighboring entry's opposite rail well
        // before reaching it. The block sits INBOARD of the curve (toward
        // the panel's center), so the threat is how CLOSE the curve comes
        // to the block's own side while passing through this row: for a
        // right-side block (sitting left of the curve) that's the curve's
        // smallest x in the row; for a left-side block, its largest x.
        const yStart = el.offsetTop
        const yEnd = el.offsetTop + el.offsetHeight
        let worstPx = p.x
        for (const s of samples) {
          if (s.y < yStart || s.y > yEnd) continue
          worstPx = side === 'right' ? Math.min(worstPx, s.x) : Math.max(worstPx, s.x)
        }

        // Two hard edges bound where the block may legally sit: the curve
        // itself (never crossed, maintaining at least the minimum gap) and
        // the panel's own edge. During a side transition the guide spline
        // can sweep most of the panel's width within a single entry's row,
        // leaving much less than BLOCK_WIDTH of safe room on that entry's
        // nominal side. The block narrows to whatever room is genuinely
        // available (down to a readable floor) instead of ever letting
        // either edge win outright.
        const screenMargin = 8
        const curveEdge = side === 'right' ? worstPx - BLOCK_MIN_GAP : worstPx + BLOCK_MIN_GAP
        const panelEdge = side === 'right' ? screenMargin : width - screenMargin
        const available = side === 'right' ? curveEdge - panelEdge : panelEdge - curveEdge
        const rawWidth = Math.max(BLOCK_MIN_WIDTH, Math.min(BLOCK_WIDTH, available))
        // Damp toward the previous pass's width rather than jumping straight
        // to the fresh one — only mid-iteration, purely to settle the
        // height feedback faster. The final, committed pass always uses the
        // raw width clamped to this pass's own `available`, which is what
        // actually guarantees the curve and panel-edge invariants; a
        // damped value could still exceed `available` while converging.
        const prev = prevWidths[entry.slug]
        const actualWidth = !final && prev != null ? (prev + rawWidth) / 2 : rawWidth
        prevWidths[entry.slug] = actualWidth

        const centerX = width / 2
        const roomToCenter = Math.max(0, side === 'right' ? worstPx - centerX : centerX - worstPx)
        const maxGapRoom = Math.max(0, available - actualWidth)
        const extraGap = Math.min(
          maxGapRoom,
          Math.min(BLOCK_MAX_GAP - BLOCK_MIN_GAP, roomToCenter * BLOCK_CENTER_PULL),
        )
        const gap = BLOCK_MIN_GAP + extraGap
        blocks[entry.slug] = side === 'right' ? worstPx - gap - actualWidth : worstPx + gap
        widths[entry.slug] = actualWidth
      })

      if (!final) {
        entries.forEach((entry) => {
          const el = nodeRefs.current.get(entry.slug)
          const w = widths[entry.slug]
          if (el) el.style.width = w != null ? `${w}px` : ''
        })
      }

      return { width, height, points, samples, widths, blocks }
    }

    // After block widths settle, commit them to the DOM (so offsetTop/
    // offsetHeight below reflect the real final text-wrap) and run pacing —
    // a single closed-form sweep, not another damped loop (see the PACING
    // comment above computeGaps) — then commit everything else in one pass.
    function finishWide() {
      const settled = runWidthPass(true)
      if (!settled) return
      const { width, points, samples, widths, blocks } = settled

      entries.forEach((entry) => {
        const el = nodeRefs.current.get(entry.slug)
        const w = widths[entry.slug]
        if (el) el.style.width = w != null ? `${w}px` : ''
      })

      const naturalBottoms: number[] = points.map((p) => {
        const el = nodeRefs.current.get(p.slug)
        return el ? el.offsetTop + el.offsetHeight : p.y
      })

      // Pixel-space cumulative arc length along the dense (natural, i.e.
      // pre-pacing) sample array — both axes are already real pixels.
      const cumLen: number[] = [0]
      for (let k = 1; k < samples.length; k++) {
        const dx = samples[k].x - samples[k - 1].x
        const dy = samples[k].y - samples[k - 1].y
        cumLen.push(cumLen[k - 1] + Math.hypot(dx, dy))
      }
      const totalLength = cumLen[cumLen.length - 1] ?? 0
      function cumLengthAtY(targetY: number): number {
        for (let k = 1; k < samples.length; k++) {
          if (samples[k].y >= targetY) {
            const y0 = samples[k - 1].y
            const y1 = samples[k].y
            const t = y1 > y0 ? (targetY - y0) / (y1 - y0) : 0
            return cumLen[k - 1] + t * (cumLen[k] - cumLen[k - 1])
          }
        }
        return totalLength
      }

      const gaps = computeGaps(
        points.map((p) => p.y),
        naturalBottoms,
        cumLengthAtY,
        totalLength,
      )

      // The final, STRETCHED curve — same shape (x untouched), vertically
      // expanded exactly where pacing decided it needed to be. Both axes are
      // already real pixels (the viewBox is built to match `width`/height
      // 1:1, not the old non-uniformly-scaled 0–100-X viewBox, whose
      // distortion made getTotalLength()/getPointAtLength() measure a length
      // dominated by Y and barely sensitive to horizontal travel — exactly
      // the travel this whole mechanism cares about). That keeps the
      // browser's own arc-length math screen-accurate, which the
      // reveal-lookup effect below depends on.
      const stretchedSamplesPx = stretchSamplesY(
        samples,
        naturalBottoms,
        points.map((p) => p.y),
        gaps,
      )
      const totalGap = gaps.reduce((a, b) => a + b, 0)
      const stretchedHeight = settled.height + totalGap

      // Each entry's marker is displayed at its own card's true vertical
      // center — a different Y than the near-the-top waypoint that shapes
      // the curve and its pacing above, found by interpolating the SAME
      // dense natural-sample array the rendered path itself connects with
      // straight segments (see pathFromSamples), so the marker lands exactly
      // where the drawn line is at that height, not an approximation of it,
      // then stretched by the exact same pacing rule (stretchYAt) every
      // other point on the curve was. Reading the curve at an independent Y
      // like this — rather than moving the waypoint itself to each card's
      // center — is what keeps this purely a display choice: the curve's
      // shape and the spacing it produces for every card stay exactly what
      // they already were.
      function curveXAtNaturalY(targetY: number): number {
        for (let k = 1; k < samples.length; k++) {
          if (samples[k].y >= targetY) {
            const y0 = samples[k - 1].y
            const y1 = samples[k].y
            const t = y1 > y0 ? (targetY - y0) / (y1 - y0) : 0
            return samples[k - 1].x + t * (samples[k].x - samples[k - 1].x)
          }
        }
        return samples[samples.length - 1]?.x ?? 0
      }
      const naturalAnchors = points.map((p) => p.y)
      const positions: Record<string, { x: number; y: number }> = {}
      points.forEach((p) => {
        const el = nodeRefs.current.get(p.slug)
        const centerY = el ? el.offsetTop + el.offsetHeight / 2 : p.y
        positions[p.slug] = {
          x: curveXAtNaturalY(centerY),
          y: stretchYAt(centerY, naturalBottoms, naturalAnchors, gaps),
        }
      })

      // Commit marginBottom (the pacing gap) and transform (the block's X
      // offset) directly to the DOM here, mirroring how `width` is already
      // committed directly above — rather than relying solely on React's own
      // re-render. This fixes a real, reproduced bug: React diffs a new
      // render's style prop against what IT last recorded setting, not
      // against the live DOM. `measure()` resets these same two properties
      // via direct DOM mutation before every remeasurement (needed so
      // "natural," pre-stretch positions aren't read with a previous pass's
      // gap already baked in) — and on a resize that recomputes to the SAME
      // final values as before (the common case: nothing about the content
      // actually changed), React saw its new props equal its old props,
      // skipped touching the DOM, and permanently stranded the live DOM at
      // the mid-measurement reset value. The collision math above then
      // validated positions against geometry that matched what React
      // (correctly) computed but never (incorrectly) applied — exactly how a
      // card could pass every collision check here and still visually
      // overlap text once rendered. Setting it directly, the same way width
      // already is, makes the DOM correct regardless of what React's own
      // diffing decides. This must run AFTER naturalBottoms is computed above
      // (which depends on reading each entry's still-natural, pre-margin
      // offsetTop) — applying margin to an earlier entry shifts
      // every later entry's own offsetTop, so doing this any earlier would
      // corrupt exactly the measurements it's meant to stop corrupting.
      points.forEach((p, i) => {
        const el = nodeRefs.current.get(p.slug)
        if (!el) return
        el.style.marginBottom = `${gaps[i] ?? 0}px`
        const bx = blocks[p.slug]
        el.style.transform = bx != null ? `translateX(${bx}px)` : ''
      })

      setCurve({ d: pathFromSamples(stretchedSamplesPx), height: stretchedHeight, viewBoxWidth: width })
      setMarkerX({})
      setMarkerPos(positions)
      setBlockX(blocks)
      setBlockWidth(widths)
      setBlockSpacer(Object.fromEntries(points.map((p, i) => [p.slug, gaps[i] ?? 0])))
    }

    function runNarrow() {
      const wrapper = pathRef.current
      if (!wrapper) return
      const height = wrapper.offsetHeight
      const offsets: Record<string, number> = {}
      for (const [slug, el] of nodeRefs.current) {
        offsets[slug] = GUTTER_MARKER_BASE + gutterOffset(el.offsetTop)
      }
      setMarkerX(offsets)

      const steps = Math.max(2, Math.round(height / 12))
      let d = ''
      for (let i = 0; i <= steps; i++) {
        const y = (height * i) / steps
        const x = GUTTER_BASE_X + gutterOffset(y)
        d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`
      }
      setCurve({ d, height, viewBoxWidth: 30 })
    }

    function measure() {
      const wrapper = pathRef.current
      if (!wrapper) return
      if (!isWide) {
        runNarrow()
        return
      }
      // Reset every style this component itself drives via React's inline
      // `style` prop — width, marginBottom (pacing's gap), and transform
      // (the block's X offset) — before re-measuring. This effect reads
      // `el.offsetTop`/`offsetHeight` to compute "natural" (i.e. pre-stretch)
      // positions; on a resize, these elements can still carry whatever
      // marginBottom/transform was applied before (inline styles persist on
      // the DOM across re-renders until something changes them), and reading
      // "natural" positions that already have a previous pass's stretch
      // baked in corrupts the pacing and collision math the same way
      // measuring with a ruler that's already been stretched would. `width`
      // was the only one reset here before this was caught — see the
      // direct-DOM commit of marginBottom/transform in finishWide() below
      // for the other half of this fix (resetting here alone isn't enough;
      // React can decline to re-apply a style that matches what it last
      // computed, even when the live DOM doesn't currently match it).
      for (const el of nodeRefs.current.values()) {
        el.style.width = ''
        el.style.marginBottom = ''
        el.style.transform = ''
      }
      // Damped (see runWidthPass) but still not strictly monotonic, so a
      // handful of passes rather than just two or three — cheap relative to
      // the cost of a visible crossing, and still bounded rather than an
      // unbounded loop driven by live DOM measurements.
      const WIDTH_PASSES = 6
      for (let pass = 0; pass < WIDTH_PASSES - 1; pass++) {
        runWidthPass(false)
      }
      finishWide()
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [entries, sides, isWide])

  // Once the curve geometry settles, read the ACTUAL rendered path's own
  // arc length (getTotalLength/getPointAtLength) rather than approximating
  // it again, and build the dense reveal lookup from those same real
  // samples — the only way "reveal linearly with path length" means what it
  // says rather than what a second, slightly different calculation thinks
  // it means. Each entry's own reveal threshold is where its marker sits as
  // a fraction of that real length, found by binary search since the curve
  // is Y-monotonic by construction (waypoints are built in strictly
  // increasing document order, so Y never doubles back).
  useEffect(() => {
    const pathEl = curvePathRef.current
    if (!pathEl) return
    let svgLength = 0
    try {
      svgLength = pathEl.getTotalLength()
    } catch {
      svgLength = 0
    }
    const entryThreshold: Record<string, number> = {}
    const lookup: { y: number; frac: number }[] = []
    if (svgLength > 0) {
      const STEPS = 400
      for (let i = 0; i <= STEPS; i++) {
        const len = (i / STEPS) * svgLength
        let y = 0
        try {
          y = pathEl.getPointAtLength(len).y
        } catch {
          y = 0
        }
        lookup.push({ y, frac: i / STEPS })
      }
      for (const entry of entries) {
        const pos = markerPos[entry.slug]
        if (!pos) continue
        let lo = 0
        let hi = svgLength
        for (let iter = 0; iter < 20; iter++) {
          const mid = (lo + hi) / 2
          const y = pathEl.getPointAtLength(mid).y
          if (y < pos.y) lo = mid
          else hi = mid
        }
        entryThreshold[entry.slug] = (lo + hi) / 2 / svgLength
      }
    }
    revealDataRef.current = { svgLength, entryThreshold, lookup }
    pathEl.style.strokeDasharray = svgLength > 0 ? `${svgLength}` : ''
  }, [curve.d, markerPos, entries])

  // Drives two things straight on the DOM (no setState, so this tracks at
  // full frame rate instead of fighting React's render cycle): how much of
  // the line is drawn in, via stroke-dashoffset in the path's own real
  // arc-length units, and which entries/markers have been reached yet,
  // toggled by comparing that same reveal progress against each one's own
  // threshold from the effect above. Takes the raw "virtual scroll" value
  // directly rather than reading container.scrollTop itself — see the wheel
  // handler below for why those two numbers are deliberately different
  // during the initial pin phase.
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    function updateRevealFrom(virtualScroll: number) {
      if (!container) return
      const { svgLength, entryThreshold, lookup } = revealDataRef.current
      const pathEl = curvePathRef.current

      let revealProgress = 1
      // Only a real, data-backed reading is allowed to feed the monotonic
      // ratchet below — the `= 1` default above is a placeholder for the
      // brief window before the curve's real arc-length data exists (right
      // after mount, before the geometry-settle effect above has run), used
      // only so that one frame doesn't flash as "nothing drawn" while that
      // settles. Letting a placeholder ratchet in permanently was a real,
      // reproduced bug: it made the very first call on every load lock the
      // high-water mark at 1 before any real scroll position was even read,
      // which looked like "the whole path starts fully revealed on every
      // page load" — exactly backwards from the ratchet's actual purpose.
      let hasRealReveal = false
      if (svgLength > 0 && lookup.length > 1) {
        hasRealReveal = true
        // maxRevealFrac is what the lookup says the reveal point reaches
        // once scrolled all the way to the bottom — almost never exactly 1
        // (the lookahead means the reveal point sits ahead of the
        // container's own top edge, which falls short of the document's
        // real end once there's no more room left to scroll into).
        // Dividing by it rescales every reading so the line is guaranteed to
        // finish fully drawn, and every entry's marker guaranteed revealed,
        // exactly at max scroll — otherwise the last stretch of content a
        // user can never scroll past would stay permanently undrawn/hidden.
        //
        // Recomputed fresh on every tick (reading scrollHeight/clientHeight
        // live) rather than cached once when the geometry settles: caching
        // it once raced against the browser's own late, small layout
        // settling (observed directly: scrollHeight read a few pixels
        // larger at the moment this effect first ran than it read a moment
        // later, for reasons upstream of this component — sub-pixel font
        // metrics, scrollbar-gutter accounting, etc.) — a permanent few
        // pixels of mismatch between the cached value and reality, which
        // this component has no real way to detect or invalidate from the
        // outside. Computing it live costs one extra cheap binary search per
        // scroll tick and makes the guarantee exact by construction instead
        // of "exact at the instant it was cached."
        const lookahead = container.clientHeight * REVEAL_LOOKAHEAD_FRACTION
        const maxScroll = Math.max(0, container.scrollHeight - container.clientHeight)
        const maxVirtualScroll = maxScroll + lookahead
        const targetY = Math.min(virtualScroll, maxVirtualScroll)
        const maxRevealFrac = maxVirtualScroll > 0 ? sampleLookup(lookup, maxVirtualScroll) : 1
        revealProgress = sampleLookup(lookup, targetY) / (maxRevealFrac > 0 ? maxRevealFrac : 1)
      }
      revealProgress = Math.min(1, Math.max(0, revealProgress))
      // Monotonic: once reveal has reached a point, scrolling back up (which
      // would otherwise compute a smaller revealProgress here) never undraws
      // the line or fades an entry back out — the view just moves, the same
      // way a normal, un-animated page would. Only ever ratchets forward,
      // and only once there's real data behind the reading (see above).
      if (hasRealReveal) {
        revealProgress = Math.max(revealProgress, maxRevealProgressRef.current)
        maxRevealProgressRef.current = revealProgress
      }

      if (pathEl && svgLength > 0) {
        pathEl.style.strokeDashoffset = `${svgLength * (1 - revealProgress)}`
      }

      // A plain attribute, not a class: className here is React-controlled
      // (it also carries is-active), so React resets the WHOLE string on
      // any re-render that touches a node for an unrelated reason — e.g.
      // the active entry changing as you scroll — silently wiping out a
      // class toggled on imperatively. React never touches an attribute it
      // didn't itself set via JSX, so this survives those re-renders.
      for (const [slug, el] of nodeRefs.current) {
        const threshold = entryThreshold[slug]
        el.toggleAttribute('data-revealed', threshold == null || revealProgress >= threshold)
      }
      for (const [slug, el] of markerRefs.current) {
        const threshold = entryThreshold[slug]
        el.toggleAttribute('data-revealed', threshold == null || revealProgress >= threshold)
      }
    }

    if (!isWide) {
      // Narrow mode: native scroll drives reveal directly, same as before —
      // no pin phase here. The gutter-wiggle layout is simple enough not to
      // need it, and touch swipe (the actual input here, not a mouse wheel)
      // doesn't fire the wheel events the pin phase depends on anyway.
      function updateRevealNarrow() {
        if (!container) return
        updateRevealFrom(container.scrollTop)
      }
      updateRevealNarrow()
      container.addEventListener('scroll', updateRevealNarrow, { passive: true })
      return () => container.removeEventListener('scroll', updateRevealNarrow)
    }

    // Wide mode: decouple the wheel from the container's own native scroll
    // so the panel can "pin" — absorbing scroll input into the reveal alone,
    // with every entry staying exactly where it is on screen — until the
    // drawing frontier has reached the threshold fraction down the viewport.
    // This is the common "pin, animate, then release" pattern (e.g. Apple's
    // product pages): initially, scrolling the wheel draws the path in
    // without moving any entry out of view at all; only once the frontier
    // has caught up to the threshold does further scrolling start actually
    // moving content, at which point it behaves exactly like the steady
    // state already in place (the frontier staying pinned at that same
    // fraction down the panel while content scrolls underneath it).
    //
    // `virtualScrollRef` is the single source of truth driving BOTH the
    // reveal and (once past the pin phase) the container's real scrollTop —
    // the two are deliberately NOT the same number during the pin phase
    // (scrollTop stays at 0 the whole time; the virtual value keeps
    // climbing from 0 to the lookahead distance), which is exactly why
    // reveal can no longer be read off the container's native scrollTop the
    // way narrow mode still does above.
    // `scrollTop` alone can't tell us what the virtual value should be here:
    // scrollTop === 0 is ambiguous between "haven't scrolled at all yet"
    // (virtual should start at 0, pin phase not yet begun) and "already past
    // the pin phase, currently scrolled back up to the very top" (virtual
    // should already be at the lookahead distance) — the clamp in onWheel
    // below maps a whole range of virtual values down to the same
    // scrollTop===0. Only scrollTop > 0 resolves unambiguously (it can only
    // happen once the virtual value has passed the pin phase), so that's the
    // only case resynced here; otherwise the ref is left exactly as it was —
    // 0 from useRef's own initial value on a true first mount, or wherever
    // an in-progress pin phase already had it if this effect is merely
    // re-running from an unrelated layout change (e.g. a resize).
    const initialLookahead = container.clientHeight * REVEAL_LOOKAHEAD_FRACTION
    if (container.scrollTop > 0) {
      virtualScrollRef.current = container.scrollTop + initialLookahead
    }
    // No easing needed for this initial sync — it's a hard reset (first
    // mount, or a resize re-running this effect), not a response to input,
    // so the smoothed value starts already equal to the target rather than
    // animating toward it from 0.
    smoothScrollRef.current = virtualScrollRef.current

    function applySmoothScroll(value: number) {
      if (!container) return
      const lookahead = container.clientHeight * REVEAL_LOOKAHEAD_FRACTION
      const maxScroll = Math.max(0, container.scrollHeight - container.clientHeight)
      const nextScrollTop = Math.max(0, Math.min(maxScroll, value - lookahead))
      // Recorded even when the write below is skipped (scrollTop already
      // equals nextScrollTop) — either way, this is the value a 'scroll'
      // event arriving right now should be attributed to US, not treated as
      // external input by the safety net below.
      lastAppliedScrollTopRef.current = nextScrollTop
      if (container.scrollTop !== nextScrollTop) container.scrollTop = nextScrollTop
      updateRevealFrom(value)
    }
    applySmoothScroll(smoothScrollRef.current)

    // Mouse-wheel deltas arrive in large, irregular chunks (OS- and
    // device-dependent acceleration curves, not a continuous signal) —
    // applying them straight to scrollTop/reveal made the whole thing step
    // rather than glide. `virtualScrollRef` (the target, above) still
    // updates instantly on every tick so input never feels laggy; this loop
    // is what actually moves scrollTop/reveal, closing a fraction of the
    // remaining gap each frame rather than jumping to the target outright.
    // Framerate-independent (an exponential approach scaled by the real
    // elapsed time, not a fixed per-frame step), so it eases at the same
    // rate regardless of display refresh rate.
    const EASE_HALF_LIFE_MS = 80
    function tick(now: number) {
      scrollRafRef.current = null
      const last = scrollRafTimeRef.current ?? now
      const dt = Math.max(0, now - last)
      const target = virtualScrollRef.current
      const current = smoothScrollRef.current
      const diff = target - current
      if (Math.abs(diff) < 0.5) {
        smoothScrollRef.current = target
        applySmoothScroll(target)
        scrollRafTimeRef.current = null
        return // settled — stop looping until the next wheel tick wakes it
      }
      const alpha = 1 - Math.pow(0.5, dt / EASE_HALF_LIFE_MS)
      const next = current + diff * alpha
      smoothScrollRef.current = next
      applySmoothScroll(next)
      scrollRafTimeRef.current = now
      scrollRafRef.current = requestAnimationFrame(tick)
    }
    function ensureAnimating() {
      if (scrollRafRef.current == null) {
        scrollRafTimeRef.current = null
        scrollRafRef.current = requestAnimationFrame(tick)
      }
    }

    function onWheel(e: WheelEvent) {
      if (!container || e.deltaY === 0) return
      // Once reveal has permanently finished (the monotonic ratchet above
      // is at 1), there is no more reveal state left for this interception
      // to protect — every further scroll, in either direction, can only
      // ever re-show what's already drawn. Stepping aside entirely here
      // hands scrolling back to the browser's own native, already-optimized
      // handling (with whatever OS-level momentum/smoothing it applies)
      // instead of still running it through the eased virtual-scroll
      // pipeline, which was adding a real, noticeable ~80ms response delay
      // to ordinary navigation that no longer had any animation to justify
      // it — exactly the "laggy once completely revealed" complaint this
      // fixes. By the time reveal reaches exactly 1 (see the maxRevealFrac
      // rescaling above), scrollTop is already at its own true max too, so
      // handing off here never leaves content stranded mid-transition.
      if (maxRevealProgressRef.current >= 1) return
      const lookahead = container.clientHeight * REVEAL_LOOKAHEAD_FRACTION
      const maxScroll = Math.max(0, container.scrollHeight - container.clientHeight)
      const maxVirtualScroll = maxScroll + lookahead
      // Boundary checks read the SMOOTHED (visually current) position, not
      // the instantly-updated target — otherwise the target could already
      // sit at the boundary while the eased animation is still mid-flight,
      // handing off to native page-scroll chaining a beat before the
      // panel's own motion has actually finished, which would read as a
      // skip rather than a smooth arrival.
      const current = smoothScrollRef.current
      const atStart = current <= 0
      const atEnd = current >= maxVirtualScroll
      // At either true end, step aside and let the browser handle the event
      // natively — this is what lets it chain to scrolling the page itself
      // above/below the panel, exactly the way plain overflow scrolling
      // already does at a real scroll boundary.
      if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return
      e.preventDefault()
      virtualScrollRef.current = Math.max(
        0,
        Math.min(maxVirtualScroll, virtualScrollRef.current + e.deltaY),
      )
      ensureAnimating()
    }

    // Safety net for scroll arriving some way other than this wheel handler
    // (keyboard focus-into-view, a screen reader's own navigation) — without
    // this, such a scroll would move content while the virtual tracker (and
    // so the reveal) stayed frozen wherever the last wheel tick left it.
    // Only ever moves the tracker forward to match, never backward, so it
    // can't fight the wheel handler's own authoritative writes. Applied
    // immediately, not eased — the content has already physically jumped via
    // the browser's own native scroll-into-view, so the tracker needs to
    // match reality now, not lag behind it animating.
    function onNativeScroll() {
      if (!container) return
      // A 'scroll' event our own applySmoothScroll just caused, not new
      // external input — there's nothing to sync. Without this check, the
      // easing loop's own writes get misread as the content having moved
      // further than the tracker expected: a real, reproduced bug where
      // scrolling up crossed a frame where the container's scrollTop (set a
      // moment ago, before the target dropped) read as briefly higher than
      // the new, lower target, snapping the target straight back up to that
      // stale value and stopping the animation dead on the very first frame.
      if (
        lastAppliedScrollTopRef.current != null &&
        Math.abs(container.scrollTop - lastAppliedScrollTopRef.current) < 1
      ) {
        return
      }
      const lookahead = container.clientHeight * REVEAL_LOOKAHEAD_FRACTION
      const implied = container.scrollTop + lookahead
      if (implied > virtualScrollRef.current) {
        virtualScrollRef.current = implied
        smoothScrollRef.current = implied
        updateRevealFrom(implied)
      }
    }

    container.addEventListener('wheel', onWheel, { passive: false })
    container.addEventListener('scroll', onNativeScroll, { passive: true })
    return () => {
      container.removeEventListener('wheel', onWheel)
      container.removeEventListener('scroll', onNativeScroll)
      if (scrollRafRef.current != null) cancelAnimationFrame(scrollRafRef.current)
    }
  }, [entries, curve.d, isWide])

  return (
    <div className="timeline-panel">
      <div className="timeline-scroll" ref={scrollRef}>
        <div className="timeline-path" ref={pathRef}>
          {isWide && curve.height > 0 && (
            <LineWarp
              className="timeline-linewarp"
              width={curve.viewBoxWidth}
              height={curve.height}
            />
          )}
          {curve.height > 0 && (
            <svg
              className="timeline-curve"
              style={{ height: curve.height }}
              viewBox={`0 0 ${curve.viewBoxWidth} ${curve.height}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {/* The whole path's shape is visible immediately, faint — a
                  printed map of where the story goes — so scrolling reads as
                  tracing an already-sketched route rather than drawing on a
                  blank void. */}
              <path
                d={curve.d}
                fill="none"
                stroke="var(--border)"
                strokeWidth={isWide ? 1.5 : 1.25}
                vectorEffect="non-scaling-stroke"
              />
              {/* The lived portion: a confident teal line (the Structural/
                  Transient Rule's persistent color, fitting for the path's
                  own spine) drawn in over the guide via stroke-dashoffset as
                  you scroll — the one moment this component animates. */}
              <path
                ref={curvePathRef}
                className="timeline-curve-live"
                d={curve.d}
                fill="none"
                stroke="var(--teal)"
                strokeWidth={isWide ? 3.5 : 2.5}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          )}
          {isWide &&
            entries.map((entry) => {
              const pos = markerPos[entry.slug]
              if (!pos) return null
              return (
                <div
                  key={`marker-${entry.slug}`}
                  ref={(el) => {
                    if (el) markerRefs.current.set(entry.slug, el)
                    else markerRefs.current.delete(entry.slug)
                  }}
                  className={
                    entry.slug === activeSlug ? 'timeline-marker is-active' : 'timeline-marker'
                  }
                  data-kind={entry.kind}
                  style={{ left: pos.x, top: pos.y }}
                  aria-hidden="true"
                />
              )
            })}
          {entries.map((entry, i) => (
            <div
              key={entry.slug}
              ref={(el) => {
                if (el) nodeRefs.current.set(entry.slug, el)
                else nodeRefs.current.delete(entry.slug)
              }}
              data-kind={entry.kind}
              data-side={sides[i]}
              className={
                entry.slug === activeSlug ? 'timeline-node is-active' : 'timeline-node'
              }
              style={
                {
                  '--marker-x': `${markerX[entry.slug] ?? 0}px`,
                  transform:
                    isWide && blockX[entry.slug] != null
                      ? `translateX(${blockX[entry.slug]}px)`
                      : undefined,
                  width: isWide && blockWidth[entry.slug] != null ? blockWidth[entry.slug] : undefined,
                  marginBottom:
                    isWide && blockSpacer[entry.slug] != null ? blockSpacer[entry.slug] : undefined,
                } as CSSProperties
              }
            >
              {entry.kind === 'project' ? (
                <Link to={`/projects/${entry.data.slug}`} className="timeline-node-link">
                  <span className="timeline-date">{formatProjectDate(entry.data.date)}</span>
                  <h3>{entry.data.title}</h3>
                  <p>{jamTagline(entry.data)}</p>
                  <ul className="tag-list">
                    {entry.data.tech.map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>
                </Link>
              ) : (
                <div className="timeline-node-link timeline-milestone">
                  <span className="timeline-date">
                    {formatMilestoneRange(entry.data.dateStart, entry.data.dateEnd)}
                  </span>
                  <h3>{entry.data.title}</h3>
                  <p className="timeline-milestone-institution">{entry.data.institution}</p>
                  <p>{entry.data.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
