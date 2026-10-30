# Roadmap

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

## In progress: Screen 05 — Public Hospital Directory (frontend only)
- [x] `/hospitals` route, public, with URL-synced filters (city, type, department, name)
- [x] 24 fictional hospitals, filter/sort/pagination utilities in `src/data/hospitals.ts`
- [x] Desktop filter sidebar + mobile filter drawer (draft/apply), List/Map toggle, schematic SVG map with markers and preview
- [x] Load More pagination (6 per page), empty state, dev-only loading/error previews
- [x] Homepage search navigates to `/hospitals` with selected filters; header highlights Find Hospitals
- [x] View Details opens "next design phase" notice (no Screen 06)
- [ ] Browser verification + full test run
