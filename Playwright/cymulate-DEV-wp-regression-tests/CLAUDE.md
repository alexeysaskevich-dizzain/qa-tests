# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
npm install

# Run all visual regression tests (compare against snapshots)
npm run regression:test
# or: npx playwright test

# Update baseline snapshots (after intentional UI changes)
npm run regression:baseline
# or: npx playwright test --update-snapshots

# Run a single test by name (URL slug)
npx playwright test --grep "home"
npx playwright test --grep "about-us"

# Run tests for a specific viewport project only
npx playwright test --project=desktop
npx playwright test --project=tablet
npx playwright test --project=mobile

# Open the HTML report after a test run
npm run regression:report
# or: npx playwright show-report

# Run in headed mode (visible browser)
npx playwright test --headed
```

## Architecture

This is a Playwright visual regression test suite for the Cymulate DEV WordPress site hosted at `marketingblogs.wpenginepowered.com`.

**Key files:**
- `playwright.config.js` — Playwright configuration: 3 viewport projects (desktop 1440×900, tablet 768×1024, mobile 375×812), parallel execution, 2-minute per-test timeout
- `tests/pages.js` — The list of 30 URLs under test (the single source of truth for which pages are covered)
- `tests/example.spec.js` — The single test spec; iterates over all URLs in `pages.js` and takes a full-page screenshot per viewport

**How tests work:**
1. Each URL in `pages.js` generates one test per viewport project (30 pages × 3 viewports = 90 tests)
2. Test names are derived by stripping the base URL and converting slashes to hyphens (e.g. `about-us`, `cymulate-vs-competitors-pentera`)
3. On each page: cookies are accepted, animations/transitions are disabled via injected CSS, the page is scrolled fully to trigger lazy-load, then a full-page screenshot is taken
4. Screenshots are compared against baseline PNGs stored in `tests/example.spec.js-snapshots/` with a `maxDiffPixelRatio` of `0.002`
5. The `.cy-sticky-post` element is hidden before capture to avoid dynamic content noise

**Snapshot baseline management:**
- Baseline snapshots live in `tests/example.spec.js-snapshots/` named `cymulate-DEV-{name}-{project}-win32.png`
- Run `--update-snapshots` to regenerate baselines after intentional design changes
- To add a new page, add its URL to `tests/pages.js` — no other changes needed

**Adding pages:** Only `tests/pages.js` needs to be edited to add/remove URLs from coverage.
