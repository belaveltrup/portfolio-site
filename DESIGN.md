---
name: Béla Veltrup — Portfolio
description: A Bauhaus-exhibition-poster revival — color-blocked project plates and a life-path timeline, on a warm cream ground.
colors:
  cream-ground: "#ece6d8"
  cream-surface: "#e2dbc9"
  warm-ink: "#1b1b18"
  warm-ink-secondary: "#6b6358"
  hairline-tan: "#d8cfb8"
  deep-teal: "#1f6e73"
  deep-teal-shade: "#10474b"
  terracotta: "#d9602e"
  mustard: "#e3a325"
  dusty-pink: "#d9718a"
typography:
  display:
    fontFamily: "Jost, sans-serif"
    fontSize: "56px"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "normal"
  headline:
    fontFamily: "Jost, sans-serif"
    fontSize: "32px"
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: "-0.3px"
  title:
    fontFamily: "Jost, sans-serif"
    fontSize: "15px"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "normal"
  wordmark:
    fontFamily: "Jost, sans-serif"
    fontSize: "18px"
    fontWeight: 800
    letterSpacing: "0.2px"
  hero:
    fontFamily: "Jost, sans-serif"
    fontSize: "clamp(40px, 6.5vw, 72px)"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Jost, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Jost, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    letterSpacing: "0.3px"
rounded:
  pill: "999px"
  tile: "0px"
  mark: "50%"
spacing:
  xs: "8px"
  sm: "14px"
  md: "16px"
  lg: "20px"
  xl: "32px"
components:
  tag-filter-pill:
    backgroundColor: "transparent"
    textColor: "{colors.warm-ink-secondary}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
  tag-filter-pill-active:
    backgroundColor: "{colors.deep-teal}"
    textColor: "{colors.cream-ground}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
  project-tile:
    backgroundColor: "{colors.cream-surface}"
    textColor: "{colors.warm-ink}"
    rounded: "{rounded.tile}"
    padding: "14px 14px 18px"
---

# Design System: Béla Veltrup — Portfolio

## Overview

**Creative North Star: "The Cream Poster Wall"**

The homepage is a Bauhaus-exhibition-poster revival, not archival 1920s primary-color Bauhaus but a contemporary, washed reproduction-poster palette: a warm cream ground holds a small set of flat geometric devices — a radial "sun" and a field of parallel warped lines — each one a deliberate quote of the poster-wall references (plus Anthropic's site, named by the user as a confirming example of the same lineage), never traced from them. The header itself carries no band, no chrome, and — after a user correction — no name text either: just the Sunburst mark sitting directly on the page ground as a home link, doing the identity work a colored bar used to. The name is set large exactly once, in the Intro directly beneath it; the header repeating it in small text read as duplication once the Intro existed. The Sunburst is the site's one logo, repeating across header, Intro, footer, and the browser-tab favicon. **The Arch motif — and the Timeline's scattered-shapes decor and photo-collage layers that used it — were fully retired** after a user correction that the Timeline's "random objects and screenshots... looks very confusing and unorganized"; `Arch.tsx`, `TimelineDecor.tsx`, and `TimelineCollage.tsx` are deleted, not just unused. In their place, `LineWarp.tsx` — a field of parallel lines sharing one smooth warp, quoting the user's pinned "Bauhaus Ausstellung 1923" wave poster directly — is the system's one other motif besides the Sunburst, used as a calm background material (Timeline, Intro) rather than a foreground object. A visitor reads the project grid as a row of color-blocked exhibit plates rather than retail SKUs, and the Timeline view reads as a genuine life path: projects and education milestones share one chronological spine, marked with Kandinsky's own color-shape pedagogy (circle/square) rather than an invented icon system. (Inferred North Star language — not user-confirmed; revise if a different metaphor is preferred.)

This is a full world replacement, not an extension: the prior system (white ground, Archivo, single reserved red, zero-gradient rule) is retired and stands only as anti-reference. The per-project-detail-theme override is unchanged policy carried forward — a project's detail page may opt out of this entire system via an optional `theme` field on `Project` (`src/data/projects.ts`) and a `data-theme` attribute (`src/pages/ProjectDetail.tsx`, scoped in `src/index.css`). No project currently sets one, so every detail page today renders the `default` theme, which inherits this system directly — but the mechanism is real, intentional product architecture (confirmed in `PRODUCT.md`'s Product Principles), not dead code, and a future themed project page departing from this system entirely is expected, not drift.

**Key Characteristics:**
- Warm cream ground and warm near-black ink; four palette roles used boldly at page scale, not as accents
- Deep teal is the dominant, structural, persistent color (the header wordmark's own text color, active toggle state, project-kind timeline markers); terracotta is the secondary, transient hover color (and the education-kind timeline marker)
- Mustard and dusty pink are reserved for custom geometric motifs only (the logomark, tile swatches) — never UI chrome
- One typeface, Jost, varying only by weight, in a deliberate single-alphabet-rationalism lineage
- Flat color fills remain the default material for UI chrome (buttons, pills, text); a gradient is sanctioned only inside the Sunburst (header, Intro, footer, favicon) — never as a page background or chrome fill
- A field of parallel warped lines (`LineWarp.tsx`) is the system's other custom motif, used as a calm background material in the Timeline and the Intro — never scattered as independent foreground objects, which a user correction explicitly rejected (see Do's and Don'ts)
- A faint paper-grain texture sits over the whole page, and project photography is desaturated toward a muted, grayed print rather than a crisp digital screenshot — the "warm vintage, grainy" material the user's pinned poster references (and Anthropic's own site, cited again) share
- The Timeline sorts by each chapter's start date (arrival order — you reach a station when it begins, not a CV's most-recent-first convention) while always labeling the full start–end range — an intentional, previously-corrected rule, not an implementation detail
- A project-detail `theme` override is a sanctioned exception point, unused today but real architecture
- The homepage opens with an Intro: the name set large, a smaller teal role subtitle, and a one-sentence proof-of-craft pitch, paired with an oversized Sunburst standing alone. The header above it carries the logo only, no wordmark text — the name is set large in exactly one place, not two
- The Sunburst is the system's one logo mark, appearing three times (header, Intro, footer) at three different scales, plus the browser-tab favicon
- Project-tile thumbnails are matted, not cropped: each sits inset on its own swatch color with `object-fit: contain`, since the source art (itch.io cover icons/logotypes) was never designed to bleed full-frame at tile size. Two of the six source files have art that touches their own canvas edge (an itch.io export-crop limitation, confirmed by inspecting each PNG's opaque pixel bounding box) — `contain` cannot crop further to hide this without reintroducing the old blow-up problem, so it's accepted as a known source-asset limitation rather than papered over with a mask (a vignette mask was tried and rejected — see Do's and Don'ts)

## Colors

The palette is a washed, four-role Bauhaus-poster set on a warm cream ground — color is used at page scale, but each role has one disciplined job.

### Primary
- **Deep Teal** (`#1f6e73`): the dominant structural color — the header wordmark's own text (the header carries no band or background; teal is the identity color now), the Intro's role line and its section-closing 6px rule, the active state for the Projects/Timeline toggle, focus rings, text selection, and the "project" kind-marker (circle) on the Timeline. A deeper shade, **Teal Shade** (`#10474b`), exists as a token (`--teal-deep`) but currently drives no rendered element — reserved, not an independent UI color.

### Secondary
- **Terracotta** (`#d9602e`): the transient hover/secondary color — link hovers, the back-link hover, contact-list hover, timeline-node-link hover, and the "education milestone" kind-marker (square) on the Timeline. Terracotta never represents a resting or active state; it only ever answers a hover.

### Tertiary
- **Mustard** (`#e3a325`): used only inside custom geometric motifs — the logomark's circle-intersection fill, a project swatch base, and one half of the footer Sunburst's radial gradient. Never used as UI chrome (no button, pill, or link ever takes mustard).
- **Dusty Pink** (`#d9718a`): used only as a project tile swatch base. Never used as UI chrome.

### Neutral
- **Cream Ground** (`#ece6d8`): page background, wordmark text color against the teal header.
- **Cream Surface** (`#e2dbc9`): project tile background (`--surface`).
- **Warm Ink** (`#1b1b18`): primary body text, headings.
- **Warm Ink Secondary** (`#6b6358`): tag labels, taglines, dates, secondary copy, inactive filter pills.
- **Hairline Tan** (`#d8cfb8`): the retained border/divider color — pill borders, tile outlines, grid top rule, timeline rail and tag-chip borders.

### Named Rules
**The Structural/Transient Rule.** Teal is reserved for persistent and structural state — header, active toggle/filter, focus, the project-kind marker. Terracotta is reserved for transient hover state only — link hovers and the education-kind marker. Neither color ever crosses into the other's job; a hover never resolves to teal, and no resting UI element is colored terracotta.

**The Chrome-Free Tertiary Rule.** Mustard and dusty pink exist only inside the logomark and project-tile swatches, both custom geometric motifs. Neither ever appears on a button, pill, link, border, or any other interface chrome element.

## Typography

**Display Font:** Jost (weights 800/900), self-hosted via `@fontsource/jost`, falling back to `sans-serif`
**Body Font:** Jost (weight 400), same stack
**Label Font:** Jost (weight 600), uppercase with tracking, same stack

**Character:** One geometric-sans family carries the entire system end to end, varying only by weight — Jost sits in the Bauhaus-era Erbar/Kabel geometric-sans lineage, and using a single weight-varying alphabet for everything from the display letter-mark to body copy is a deliberate echo of Herbert Bayer's single-alphabet Bauhaus-pedagogy rationalism, not a default pick.

### Hierarchy
- **Hero** (900, `clamp(40px, 6.5vw, 72px)`, line-height 1, letter-spacing -0.02em): the Intro's `h1` — the only type role that scales fluidly with viewport width rather than stepping at the `720px` breakpoint, since it is the one place on the page a fixed size would either crowd a phone or look timid on a wide desktop.
- **Display** (900, 56px, line-height 1): the giant initial-letter mark inside a project tile's default face when no thumbnail exists.
- **Headline** (900, 32px, line-height 1.1, letter-spacing -0.3px): project-detail `h1` in the default theme.
- **Title** (800, 15px): project tile names and timeline node titles.
- **Wordmark** (800, 18px, letter-spacing 0.2px, uppercase): the header link.
- **Body** (400, 16px/1.5): descriptions, taglines, milestone descriptions.
- **Label** (600, 12–13px, uppercase, letter-spacing 0.3px): tag-filter pills, tile tag line, tag-list chips, timeline dates, back-link.

### Named Rules
**The One-Alphabet Rule.** Jost is the only typeface in the system, used at every weight from 400 to 900. Never introduce a second family; a new hierarchy level is a new weight, not a new font.

## Layout

Content is capped at `max-width: 1280px` and centered (`#root`). The homepage opens with the Intro (see Components), closed off by its own 6px teal rule, before the Projects/Timeline toggle and the grid — a deliberate change from the system's earlier no-hero stance, since a portfolio asking "who is this" needs an answer before the proof. The project grid is 2 columns on mobile, promoted to 4 at the `720px` breakpoint — the only breakpoint in the system. Tiles are square (`aspect-ratio: 1` on the swatch) with the title and tag line beneath, read as a row of exhibit plates; the toggle/filter row sits flush left under the Intro rather than right-aligned, so the Intro's text edge, the toggle, and the grid all share one left margin. Spacing is tight and consistent: `20px` horizontal page padding, `16px` vertical rhythm around the filter/toggle row, `14–18px` internal tile padding, `8px` gaps between filter pills and timeline tag chips. The project-detail page (default theme) narrows to a `640px` reading column. The Timeline view replaces the grid in place, scrolling within a fixed-height panel (`60vh` mobile, `70vh` at `720px`+), its top and bottom edges faded with a 36px cream-to-transparent overlay (`.timeline-panel::before`/`::after`) so a card clipped by the hidden scrollbar reads as "more below," not as broken layout. Scroll-snap per node is narrow-mode-only: at `720px`+ it measurably fought the continuous scroll-tied line draw (proximity snap nudges `scrollTop` backward mid-gesture as you scroll past a node, and the teal stroke's dashoffset is driven directly off `scrollTop` every frame, so each nudge visibly yanked the line backward) and is switched off there entirely rather than merely softened.

## Elevation & Depth

Flat by design: no `box-shadow` appears anywhere in the system. Depth and separation come from the retained 1px hairline border/outline (`#d8cfb8`), flat color-block contrast between teal/cream/terracotta surfaces, and gradients standing in for depth illusion rather than a shadow, inside the system's custom motifs. This is an invariant, not an omission.

### Named Rules
**The Gradient-as-Material Rule.** A gradient is sanctioned inside the Sunburst's soft radial gradient (mustard to terracotta) — its one home now that the Arch motif is fully retired (see Shapes → Arch Motif Rule, retired). It is never a page background, never button/pill/link chrome, never gradient text. The system still treats "inside a sanctioned motif" as the standing permission and "as chrome" as the standing ban; the motif itself is just narrower than it once was.

**The Grain Rule.** A faint fractal-noise texture (`body::after`, a tiled SVG `feTurbulence`, 5% opacity, `mix-blend-mode: multiply`) sits fixed over the entire page — the paper-stock quality of a printed poster, not a flat digital surface. Project photography (`.project-tile-thumb`) additionally desaturates toward a muted, grayed print (`grayscale(55%) sepia(8%) contrast(1.05) brightness(0.98)`) rather than running at full camera saturation, echoing both the pinned Bauhaus-building illustration reference and Anthropic's own grainy, desaturated photographic treatment. The grain stays faint enough that body-text contrast is unaffected — it is texture, not a visual event.

## Shapes

Square-cornered throughout for structural surfaces: tiles, header, and footer carry zero radius. The pill (`border-radius: 999px`) is reserved for the Projects/Timeline toggle and tag-list chips. Circles and squares carry specific semantic weight beyond decoration: the Sunburst is a circle (the site's logo, not a kind-marker), and the Timeline's node markers are circles (project) or squares (milestone) per the Kandinsky color-shape pairing — this kind-marker vocabulary is fixed. Hairline borders remain 1px, and tile edges use `outline` with a `-0.5px` offset for crispness, carried forward from the prior world.

### Named Rules
**The Arch Motif Rule (retired).** The arch (formerly `src/components/Arch.tsx`) was the system's second custom-motif shape family alongside the circle — a thick rainbow/doorway form, gradient-filled terracotta-to-mustard, drawn from the user's pinned vintage-Bauhaus-poster references. It went through the header (identity flourish), an Intro hero-scale pairing with the Sunburst (rejected — read as an unexplained overlap, not a composition), and two scattered Timeline-decor instances, before a user correction asked for the Sunburst alone as the site's logo and separately flagged the Timeline's decor scatter (which the Arch was part of) as "confusing and unorganized." With no placement left that the user hadn't corrected away from, the component was deleted outright rather than kept as unused code. **Do not reintroduce the Arch** without a fresh brief for it — the system's current illustrative-motif budget is the Sunburst (identity) and LineWarp (background material), and a third custom shape competing for the same job the first correction already resolved would be relitigating a settled call, not adding variety.

**The Parallel-Line Rule.** `LineWarp.tsx` renders N identical copies of one warped path, stacked at even vertical offsets — never N independently-seeded wiggles. That single constraint is what makes it read as one continuous surface (a "fabric fold," per the pinned wave poster) rather than a pile of unrelated squiggles, the exact failure mode the scattered decor/collage layers it replaced had at the shape level. It is always a background layer (behind the curve, cards, and text; `z-index: 0` or lower, `pointer-events: none`), always low-opacity (`0.08`–`0.1`), and never collision-checked against text the way the retired decor was — being a continuous, faint, full-bleed field rather than discrete objects, it has no individual position that could land "on top of" a card the way a scattered shape could, so the entire collision-avoidance system the old decor needed is correctly just gone, not a corner cut.

## Components

### Intro (signature component)
The homepage's one poster-title moment, sitting between the header and the Projects/Timeline toggle (`src/components/Intro.tsx`). A two-column composition on `720px`+ (text left, the Sunburst right, `justify-content: space-between`), stacking to text-first-mark-above on narrow viewports where the mark shrinks to a small top-right flourish rather than competing with the headline. Copy is three fixed lines, never more: the `h1` name (Hero type, `clamp(40px, 6.5vw, 72px)`), a teal role subtitle (Jost 700, 18px — the system's one other home for the structural teal besides header/toggle/focus/marker), and a single lede sentence in warm-ink-secondary stating the positioning pitch verbatim from `PRODUCT.md` ("the six game-jam projects below are the proof, not résumé bullet points") — never a second paragraph, bullet list, or stat row, which would pull toward the hero-metric template the system otherwise refuses. **The name is set large here, once** — a user correction clarified that the big-name/smaller-subtitle pairing itself was liked and should stay; what read as duplication was the *header* also spelling the name out in text next to its icon, so the header was cut down to the logo alone (see Navigation) rather than the Intro's headline being changed. The mark is the Sunburst alone, not paired with the Arch — an earlier draft nested a Sunburst inside an Arch's opening ("a sun through a doorway"), which read as two shapes accidentally overlapping rather than a deliberate composition and was corrected to a single unaccompanied Sunburst at hero scale. The section closes on a 6px solid teal rule, the page's one heavy structural line and the only border wider than a hairline — a deliberate break from the flat-by-design elevation stance for exactly one seam, marking "introduction ends, proof begins."

### Chips (Projects/Timeline Toggle)
- **Style:** transparent background, 1px hairline border (`#d8cfb8`), full pill radius (999px), uppercase label type, warm-ink-secondary text.
- **State:** the active toggle button fills teal (`#1f6e73`) and flips text to cream.
- **Position:** flush left beneath the Intro (not right-aligned), sharing the page's left margin with the Intro's text block and the grid below it.

### Motifs (Sunburst / LineWarp)
- **Sunburst:** the radial mustard-to-terracotta circle (`src/components/Sunburst.tsx`) — the site's one logo mark. Sized via an optional `className` modifier: `28px` in the header (`.wordmark-mark`), `clamp(110px, 20vw, 180px)` standing alone in the Intro (`.intro-sunburst`), and `56px` at the footer (default, no modifier) — the same shape recurring at three scales rather than three different marks. Also stands in for the browser-tab favicon (`public/favicon.svg`, a flattened non-animated gradient-circle version, since `<link rel="icon">` can't reference a component) — the general-site default, swapped per-project when a project detail page is open (see Navigation → Header).
- **LineWarp:** a field of parallel lines sharing one smooth two-term sine warp (`src/components/LineWarp.tsx`), stroked in teal at low opacity (`0.08`–`0.1`). A background material, not a foreground object — see the Parallel-Line Rule (Shapes). Used in the Timeline (`width`/`height` driven by the real measured curve dimensions, `isWide`-gated) and the Intro (a fixed `1200×260` viewBox stretched via `preserveAspectRatio="none"`, since `.intro` doesn't resize the way the Timeline's scroll height does, so a fixed aspect looks identical to a measured one).
- Both are purely decorative (`aria-hidden`), never a UI control, and never substitute for the Timeline's circle/square kind markers.

### Cards / Containers (Project Tile)
- **Corner Style:** square (tile radius 0px); the swatch inside is also unrounded.
- **Background:** cream-surface tile (`#e2dbc9`) on the cream ground.
- **Shadow Strategy:** none — see Elevation & Depth. Separation is the 1px outline only.
- **Border:** 1px hairline outline, `-0.5px` offset.
- **Internal Padding:** `14px 14px 18px`.
- **Distinctive behavior — color-blocked plate:** each project carries a `Swatch` (`base`/`ink` color pair, cycling through the four palette roles). The swatch base is the default face's background, the fallback letter-mark color when no real thumbnail exists, and the hover-state info-card background (tech-stack copy on hover, desktop/fine-pointer only, 0.25s opacity crossfade). When a thumbnail image exists, it replaces the letter-mark as the default face; the swatch color still drives the hover card.
- **Subtitle (`.project-tile-tags`, Label type):** the jam tagline ("Game jam entry for `{gameJam}`," `jamTagline()` in `src/data/projects.ts`), not the tech stack — a user correction, since the tech stack ("Unity / C# / VS Code") repeats identically across every entry and tells a recruiter nothing about the individual project, where the jam name does. The tech stack moved to the hover-card face instead of being dropped, so it's still one interaction away rather than demoted to the detail page only.
- **Thumbnail framing:** a thumbnail sits on an 11% mat of its own swatch color and scales via `object-fit: contain`, never `cover`. The source covers are itch.io icon- and logotype-style art (a giant stretched letterform, a close pixel-art crop), not photography shot for a full-bleed square crop — matting them turns each into a plate mounted on its color card instead of blowing up art past the scale it was drawn for. The grayscale/sepia filter (Elevation & Depth → The Grain Rule) still applies to the matted image.

### Navigation (Header / Back-link / Footer)
- **Header:** logo only — a small Sunburst (`.wordmark-mark`, 28px) as a named, accessible link (`aria-label="Béla Veltrup — home"`) back to the homepage. No band, no background, no chrome, and — after a user correction — no wordmark text either: the name is already set large in the Intro directly beneath it on the homepage, and repeating it in small text right above read as duplication. `src/components/Header.tsx` renders on every page (including project details), so the logo is the one constant; the name itself lives in the Intro (homepage) and the `h1` (project detail), never in this header.
- **Back-link (project-detail, default theme):** inline SVG chevron + "All projects" label, uppercase label type, warm-ink-secondary, shifts to terracotta on hover.
- **Footer:** hairline top rule, the Sunburst (mustard-to-terracotta radial gradient circle) — the same logo mark as the header and Intro, at its own 56px scale — one line of availability copy, a flat contact list whose links turn terracotta on hover.
- **Mobile treatment:** no distinct mobile nav pattern; header and the filter/toggle row are full-width and stack naturally above the 2-column grid at narrow widths.
- **Browser tab:** the default `<title>` and favicon (`index.html`) are the site's own — "Béla Veltrup — Portfolio" and the Sunburst mark — rather than the unbranded Vite/React scaffold defaults they replaced. Opening a project detail page swaps both to that project's own identity (`ProjectDetail.tsx`, a `useEffect` setting `document.title` to the project's name and the favicon `<link>`'s `href` to its thumbnail), restored to the site defaults on unmount — so a project tab is identifiable in a crowded tab strip or bookmark the same way its own page is, and leaving it (even straight to another project) never leaves a stale tab identity behind.

### Timeline (signature component)
A vertical life-path spine merging projects and education milestones into one chronologically sorted list (`src/data/timeline.ts`). Each node's marker follows Kandinsky's Bauhaus color-shape pairing: project entries render a teal circle, milestone entries a terracotta square; a filled marker signals the node currently nearest the scroll container's top edge (the active/current-position state), an outline marker signals rest — same hue and shape per kind always, fill state alone carries the active signal. The path itself renders as two overlaid strokes sharing one `d`: a faint full-length guide (hairline-tan, always visible — the whole route sketched in from the start, like a printed map) and a bold teal line drawn over it via `stroke-dashoffset` in lockstep with scroll position, round-capped — the spine is the page's one most persistent, structural form, so it earns the structural color outright rather than a gradient. Each marker pops onto the path from a small scale (0.4 → 1) the instant the drawn line reaches it, the clearest signal that scrolling is driving anything at all. **Named Rule — The Arrival-Sort Rule.** Timeline entries sort by each chapter's start date — a milestone's `dateStart`, a project's own date — never by completion, so you "arrive" at a station when it begins rather than ranking by a CV's most-recently-finished convention. The node's visible label always shows the full start–end (or "– PRESENT") range regardless of where the sort places it. This was a deliberate correction away from an earlier completion-date sort; a future "simplification" back to completion-date sort would be a regression, not a cleanup.

**The margin scatter and photo-collage layers are retired.** An earlier round built a scattered-shapes decor layer (`TimelineDecor.tsx` — flat circles, a mustard triangle, concentric rings, the gradient Sunburst and Arch) and a background photo-collage layer (`TimelineCollage.tsx` — duotoned fragments of each project's own itch.io screenshots), both collision-checked per layout pass against the real text-block rects and rendered curve samples so neither ever crossed a card or the line. The engineering held up; the composition didn't. A direct user correction — "the random objects and the screenshots in the timeline, the timeline looks very confusing and unorganized now" — rejected the result outright regardless of how carefully each individual piece was placed: many independently-seeded shapes and photo fragments, each locally non-overlapping, still read as a pile of unrelated clip art at the level of the whole page, which per-item collision avoidance can't fix because it was never the axis the problem was on. Both components, `screenshots.ts`, and `Arch.tsx` (now without any remaining placement — see Shapes → Arch Motif Rule, retired) were deleted outright rather than kept unused. `LineWarp` (see Motifs) replaces both as the one background layer: a single continuous pattern instead of a collection of individually-placed objects, which is a different kind of thing at the composition level, not a quieter version of the same kind of thing — the actual fix, where tuning opacity or reducing the shape count on the old layers would only have been a quieter version of the same clutter. The downloaded screenshot assets themselves (`src/assets/games/screenshots/`) are left on disk, real sourced material rather than code, in case a future direction has use for them.

## Do's and Don'ts

### Do:
- **Do** keep teal (`#1f6e73`) for persistent/structural state only — header, active filter/toggle, focus ring, project-kind marker — and terracotta (`#d9602e`) for transient hover state only — link hovers, education-kind marker.
- **Do** confine mustard (`#e3a325`) and dusty pink (`#d9718a`) to custom geometric motifs (logomark, tile swatches); never promote either to UI chrome.
- **Do** use a gradient freely inside the Sunburst — its one sanctioned home now that the Arch is retired.
- **Do** keep the page-wide grain texture (`body::after`) and the desaturated project-photography filter faint — texture, never a visual event that competes with content.
- **Do** sort Timeline entries by each chapter's start date — arrival order, not CV convention — while always labeling the full start–end range on the node; this was a deliberate correction, not an incidental detail.
- **Do** treat a project-detail page's `theme` field (`src/data/projects.ts`) and its `data-theme` scoping (`src/index.css`) as a sanctioned exception point for a themed project page to depart from this entire system; unused today, but real architecture, not dead code.
- **Do** use Jost at varying weights for every type role; it is the system's one typeface by deliberate Bauhaus-lineage rationale, not a placeholder choice.
- **Do** mat a project thumbnail on its swatch color with `object-fit: contain`; the source art is icon/logotype-scale and a full-bleed `cover` crop blows it up past its own design intent.
- **Do** use the Sunburst, and only the Sunburst, as the site's logo across header/Intro/footer/favicon; the Arch is retired, not merely unused elsewhere.
- **Do** keep LineWarp a single continuous background field (one shared waveform, stacked lines, low opacity) — never multiple independently-placed instances, which would recreate the scattered-decor clutter at a different shape.
- **Do** let the Intro's `h1` be the one place the name is set large; the header stays logo-only (no wordmark text) so the two never say the same thing in two sizes at once.

### Don't:
- **Don't** add a drop shadow anywhere; depth comes from the hairline border, flat color-block contrast, and the two sanctioned gradients only.
- **Don't** put a gradient on a page background, a button, a pill, a link, or any other UI chrome — gradients live inside custom motifs only, never on the controls visitors operate.
- **Don't** introduce a second typeface; a new hierarchy level is a new Jost weight, not a new family.
- **Don't** use mustard or dusty pink on any button, pill, border, or link — they are motif-only colors.
- **Don't** add a kicker, eyebrow, or invented icon-glyph system in place of the Kandinsky circle/square markers — the Timeline's marker vocabulary is the system's one iconography device.
- **Don't** retrofit a themed project-detail page's custom tokens into this DESIGN.md's global system; a themed page belongs to that one project only, per the unchanged override policy.
- **Don't** reintroduce the Arch motif; it was tried in the header, nested with the Sunburst at Intro hero scale, and scattered through Timeline decor, corrected away from all three, and finally deleted outright — see Shapes → Arch Motif Rule (retired).
- **Don't** scatter independently-placed decorative shapes or photo fragments near the Timeline path, however well each one is collision-checked against text; this was shipped, worked mechanically, and was still rejected as "confusing and unorganized" because the problem was the composition, not any individual placement. A single continuous background material (LineWarp) is the corrected pattern.
- **Don't** mask a project-thumbnail's edges with a vignette to hide a source image's own clipped art; tried once (a radial `mask-image`) and it produced a visible dark smudge in the corners of every rectangular (non-edge-touching) cover while barely softening the one defect it targeted — a worse trade than leaving the clipped art as-is. A genuinely clipped source asset needs a better export or a deliberate crop decision, not a blanket fade.
