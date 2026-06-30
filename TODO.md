# MIGRON — Task Board

## Done

- [x] Full English conversion — all page components stripped of Turkish UI text
- [x] First 48 Hours page deleted (redirect to `/`)
- [x] Salary Guide removed from Settlement nav
- [x] Centrelink page — complete rewrite, 9 payment cards, NARWP table, eligibility by visa
- [x] Certificates page — 51 certs, 11 categories, live search, English-only
- [x] Visa Programs — expanded 9 → 32 subclasses (PERMANENT / PROVISIONAL / TEMPORARY / CLOSED)
- [x] Traffic page — Google Maps traffic layer, all 9 Australian cities, no NSW-only title
- [x] Traffic ACTIVE INCIDENTS encoding error — fixed (removed NSW Transport API)
- [x] Contact form — POST endpoint via Resend (`api/contact.js`)
- [x] Tax Calculator `/tax-calculator` — 2025-26 ATO rates, LITO, Medicare, HECS
- [x] Super Calculator `/super-calculator` — compound projector, SGC 11.5%, year-by-year table
- [x] Navbar TOOLS — Tax + Super Calculator in desktop + mobile menus
- [x] New API routes — abs-suburb, bom, nbn-check, contact
- [x] New pages — ProcessingTimesPage, SuburbExplorerPage
- [x] SEO fixes — ProcessingTimesPage SEOHead fixed, broken hreflang removed
- [x] Sitemap — all routes updated, correct priorities
- [x] Site tagline — English

---

## To Do

### Requires action (Vercel / external)
- [ ] Add `RESEND_API_KEY` to Vercel env vars → contact form sends emails to migron@mtive.tech

### Code cleanup
- [ ] `AustraliaNewsSlider.jsx` — remove unused `useLanguage` import (no Turkish renders, dead code)
- [ ] `BentoGrid.jsx` — remove remaining `lang === 'tr'` conditionals (fall through to English, nothing visible)

### Features
- [ ] NBN Checker page — `api/nbn-check.js` exists, needs a UI page at `/nbn-check`
- [ ] Weather widget — `api/bom.js` exists, needs a UI component
- [ ] Cost of living comparison tool
- [ ] More visa subclass detail pages beyond 189 / 190 / 491 / 482
- [ ] Article search / tag filtering improvements
- [ ] Mobile nav: VISA PROGRAMS section missing Processing Times link
