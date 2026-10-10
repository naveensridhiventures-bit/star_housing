# v5 — "Estate": a new layout system (2026-10-10)

Every feature is unchanged. This is a rebuild of how each page is laid out, not a recolour. No Code.gs change.

- Home: portal layout. Headline and search bar on the left, the mediator-and-globe photo shown whole on the right with live listing cards over it. Market strip, new listings grid, browse by type, role panels, why us, how it works, brand banner, footer
- Sticky site navigation and a full footer on every public page
- Property gallery: filter sidebar on computers (drawer on phones), type tabs, grid/list toggle, active-filter chips, "Spotlight" selector, compact shelf cards, new property cards with photo-cycle on hover
- Property page: photo mosaic, sticky contact card with price/EMI/Book a visit/WhatsApp (pinned bar on phones), spec table, details table
- Forms: split screen on computers with a step tracker; single column on phones
- Admin: left side menu on computers; top bar and tabs on phones
- Palette: iris violet, emerald, amber on cool grey. Fonts: Newsreader (headlines) and Hanken Grotesk (text), self-hosted
- Removed the v4 tile patterns and reveal
- New packages: @fontsource-variable/newsreader, @fontsource-variable/hanken-grotesk (run npm install). Removed bricolage.

# v4 — New look: "Athangudi" (2026-10-10)

Every feature is unchanged. Only the design changed. No Code.gs change in this version.

- Home page shows the mediator-holding-the-globe photo in full (wide on desktop, close-up on phones)
- One-time tile-flip reveal on first visit (skipped for people who prefer reduced motion)
- New palette: peacock teal, bougainvillea pink, indigo on mint white
- New typeface: Bricolage Grotesque (self-hosted, works offline)
- Tile-square buttons that press down; floor-tile strips as section edges; tile-pattern role cards
- Pages wipe in from the top when you move between them
- New package: @fontsource-variable/bricolage-grotesque (run npm install)

# v3 — Star Housing gets every Middle Class Mediator feature (2026-10-10)

Same features as Middle Class Mediator, in the Star Housing look (navy, sky blue, gold).
This needs a Code.gs update (see README, step 1).

- Premium home: search dock, "New on the market" rail, live stats, rotating words, tilt role cards
- Public gallery (/gallery): budget pills, curated shelves, compare, EMI calculator, book a visit, PDF brochure
- Multi-step Seller / Buyer / Mediator forms with progress, saved drafts, success screen
- Admin Command Center (/control/dashboard): Overview, Today queue, Sellers / Buyers / Mediators CRM
  with Cards + Kanban board, Matches, Published listings, Ctrl+K search, deal forecast, CSV + PDF export
- Quick call notes with voice (/quick) and Field visit (/control/field-visit)
- New: Buyers sheet, QuickNotes sheet, lead scoring, WhatsApp templates
