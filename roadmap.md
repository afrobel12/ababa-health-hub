# Roadmap

## In progress: Screen 07 — Hospital Application & Supporting Pages (frontend only)
- [ ] /for-hospitals landing (hero, capabilities, onboarding, eligibility, FAQ, CTA)
- [ ] /for-hospitals/apply four-step wizard (hospital, representative, review, demo complete)
- [ ] /about, /contact (demo inquiry), /privacy and /terms drafts
- [ ] Header/footer links wired; tests; responsive + keyboard checks


## Done: Screen 06 — Hospital Details (frontend only)
- [x] Hospital information, departments, fictional doctors, location and unknown-slug state
- [x] Synchronized appointment selections and explicitly non-booking preview
- [x] Directory navigation and return context (URL filters, sort, view and pagination; router scroll restoration)
- [x] 17 new tests, 75 total passing; compilation clean; eight widths checked; representative screenshots inspected; keyboard, dialog focus and shortcut checked

## Done: Screen 02 — Patient Registration (frontend only)
- [x] `/register` route with four-step wizard (personal, identity, account + demo phone verification, success)
- [x] Homepage Register / Create Account buttons navigate to `/register`
- [x] Validation tests added; all 22 tests pass; typecheck clean
- [x] Verified end-to-end in browser (desktop 1280px, mobile 375px, no overflow)

## Deferred (per brief)
- Patient dashboard, hospital search, backend, real SMS/OTP, real auth

## Done: Screen 03 — Unified Login (frontend only)
- [x] /login with demo workspace previews

## Done: Screen 04 — Account Recovery (frontend only)
- [x] `/forgot-password` route with four-stage flow (phone, demo OTP, new password, complete)
- [x] Login "Forgot password?" link navigates to `/forgot-password`
- [x] 10 validation tests added; all 37 tests pass
- [x] Verified end-to-end in browser (desktop 1280px, mobile 320/375/768px, no overflow)

## Done: Screen 05 — Public Hospital Directory (frontend only)
- [x] `/hospitals` route, public, with URL-synced filters (city, type, department, name)
- [x] 24 fictional hospitals, filter/sort/pagination utilities in `src/data/hospitals.ts`
- [x] Desktop filter sidebar + mobile filter drawer (draft/apply), List/Map toggle, schematic SVG map with markers and preview
- [x] Load More pagination (6 per page), empty state, dev-only loading/error previews
- [x] Homepage search navigates to `/hospitals` with selected filters; header highlights Find Hospitals
- [x] View Details now navigates to Screen 06 from list cards, map previews and map text results
- [x] Verified end-to-end in browser; all 58 tests pass; build clean
