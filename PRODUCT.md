# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recruiters and hiring managers evaluating Béla Veltrup — a computer science master's student aiming to move into software engineering / engineering-management-track roles — for hiring decisions. Primarily viewed on smartphones.

## Product Purpose

A personal developer portfolio ("exposé") that showcases real projects to support a job search into software engineering and engineering-management-direction roles.

## Positioning

An individual's portfolio, not a company or product site. The mechanism is demonstrating actual project craft and technical depth (including interactive pieces like embedded minigames/animations) rather than resume bullet points — the project pages are the proof.

## Operating Context

- Homepage opens with a short poster-title intro (name, role, a one-line proof-of-craft pitch) before listing all projects, with a Projects/Timeline view toggle.
- The Timeline view is a full life path, not just a project list: it interleaves projects with education milestones (Abitur, Bachelor's, Master's) in one chronological sequence. Projects are placed by their single ship date; milestones are placed by when that chapter *started* (not when it ended or whether it's ongoing) — a deliberate user call for a life-path reading ("you arrive at a station when it begins"), not a CV's most-recent-first convention. Each milestone's node label still always shows the full start–end (or "– PRESENT") range regardless of its position on the path.
- Each project has its own individual detail page.
- A project's detail page may adopt a completely different visual theme from the homepage and from other projects — this is intentional, not an inconsistency to fix.
- Primary viewing context is smartphones (recruiters skimming); must also look good on desktop.

## Capabilities and Constraints

- Stack (confirmed, already scaffolded): Vite + React + TypeScript, `react-router-dom` for routing, `framer-motion` for animation.
- Projects are data-driven via `src/data/projects.ts`.
- Per-project custom interactive components (canvas demos, minigames, bespoke animation) are supported through a registry pattern (`src/components/extras/registry.tsx`) so a project page can mount arbitrary interactive content.
- CV will be provided later — do not fabricate work history, education, or employer claims until then.
- Real project content now populated: 6 games from the user's itch.io page (bela-veltrup.itch.io), with real descriptions, dates, and links sourced from each game's itch.io page. No generic placeholder entries remain.

## Brand Commitments

Redesigned (superseding the earlier Supreme-grid direction, which is now evidence/anti-reference only): the homepage and default system now run a **Bauhaus-revival** visual world — washed/desaturated teal, terracotta, mustard, and cream (not archival 1920s saturated primaries), built from flat geometric primitives (overlapping circles, pinstripe fields, radial "sun" gradients) in the style of contemporary Bauhaus-exhibition-poster reproductions. User-pinned via two reference images plus a named example (Anthropic's own site, which shares this same warmed-geometric lineage). Graphics are custom-built (SVG/CSS), never copied from the reference images. Individual project pages remain explicitly free to depart from this system entirely (unchanged policy).

## Evidence on Hand

- No CV yet; none should be fabricated (promised in a later message).
- Real project content: 6 games (Books - A Wizards Adventure, Island Survival, The Deep Dark, Slingshot Wars, The Plague, Scrap Parts) sourced from bela-veltrup.itch.io, with real cover art, descriptions, jam-sourced dates, and itch.io links. Several facts (exact release dates for most jams) came from public jam records, not the game pages themselves, since itch.io doesn't list release dates — do not re-derive different dates without re-checking those sources.
- Real education history (user-supplied, pasted directly from their LinkedIn profile, not scraped — LinkedIn blocks automated fetches): Abitur, Viktoriaschule Aachen (Aug 2014 – Jun 2022); Bachelor of Science in Computer Science, RWTH Aachen University (Oct 2022 – Jul 2026); Master of Science in Computer Science, Ludwig-Maximilians-Universität München (Oct 2026 – ongoing). Stored in `src/data/milestones.ts`.
- No testimonials, press, or employer names exist; none should be fabricated.

## Product Principles

1. Project pages are the actual proof of skill for a hiring audience — treat each as a portfolio artifact free to take whatever identity best shows that specific project off, even if it looks nothing like the homepage.
2. The homepage runs a deliberately committed Bauhaus-revival visual world (see Brand Commitments) — the craft signal comes from navigating into project work and from the homepage's own authored geometric identity, not from generic chrome.
3. Mobile is the primary viewing context — design mobile-first, verify desktop separately rather than scaling a desktop-first layout down.
4. Never fabricate resume facts, testimonials, or employers; education dates are now confirmed (user-supplied from LinkedIn) but employment history still awaits the real CV.

## Accessibility & Inclusion

No standard specified yet.
