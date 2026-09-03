# SECURITY-AUDIT.md — DSA Expression Visualizer

**Audit date:** 2026-09-03
**Project:** React + Vite + Tailwind CSS 4 DSA Expression Conversion Visualizer
**Audit type:** Complete deep security review (client-side SPA, no backend)

---

## 1. Executive Summary

This is a **fully client-side** single-page application (React 19 + Vite 8 + Tailwind 4) that
converts and visualizes mathematical expressions (infix / prefix / postfix). There is no
backend, no API, no authentication, and no database — the entire attack surface is the
browser.

**Overall security status: GOOD.** No exploitable vulnerability was found in the current
state. One **High-severity latent / defense-in-depth** finding (untreated HTML rendering of
user-derived values via `dangerouslySetInnerHTML`) was identified and **fixed** with
output-encoding at the data source. Several lower-severity and informational items were
reviewed and documented.

- `npm audit`: **0 vulnerabilities** across 212 packages — no dependency changes needed.
- XSS: not currently exploitable (input validators reject dangerous characters), and now
  additionally hardened with HTML-escaping on all user value interpolation into rendered HTML.
- No secrets, no `.env` files, no sourcemaps shipped in the production build.
- No server/deployment config exists in the repo; recommended production security headers are
  documented for the deployment layer.

---

## 2. Scope

**In scope:**
- All `src/` source: pages, components, hooks, utils, data, entry files.
- Build configuration: `vite.config.js`, `index.html`, `eslint.config.js`.
- Dependency manifest: `package.json` + `package-lock.json` (via `npm audit`).
- Production build output: `dist/`.

**Out of scope / N/A:**
- Server-side, API, auth, CORS, CSRF, SQLi, SSRF — none of these surfaces exist (client-only).
- Deployment infrastructure (no Nginx/Vercel/Netlify config present in repo) — documented only.

---

## 3. Methodology

1. Read every source file (pages, components, hooks, utils, data).
2. Enumerated dangerous-API usage: `dangerouslySetInnerHTML`, `eval`/`new Function`,
   `innerHTML`, `navigator.clipboard`, `localStorage`/`sessionStorage`, `window.open`,
   `document.write`, `setTimeout`/`setInterval`, external links.
3. Traced the full data flow from user input → validators → conversion algorithms → live
   explanation HTML → render sites.
4. Ran `npm audit --json`, `npm run lint`, and `npm run build`.
5. Inspected `dist/` for sourcemaps and unexpected artifacts.
6. Tested input handling (malicious payloads vs validators) and the new escaping logic.

---

## 4. Findings Table

| # | Severity | Category | Title | Status |
|---|----------|----------|-------|--------|
| 01 | **High** (latent) | XSS | `dangerouslySetInnerHTML` renders user-derived HTML in `LiveExplanationCard.jsx` | **Fixed** |
| 02 | Medium | Client-Side | `navigator.clipboard` requires secure context | Documented (safe fallback present) |
| 03 | Low | Performance | `requestAnimationFrame` loop in `useLenis.js` | Not a leak (verified) |
| 04 | Info | Hygiene | Pre-existing ESLint warnings (non-security) | Documented |
| 05 | Info | Build | Large single JS bundle (~1.3 MB) | Documented (recommendation only) |

---

## 5. Findings — per severity

### 05.1 High — (latent) HTML injection via `dangerouslySetInnerHTML` [FIXED]

**Location:** `src/components/LiveExplanationCard.jsx` lines 169, 174, 256
**Data source:** `src/utils/liveExplanationSteps.js` — all 18 expression generators.

**Description:**
`LiveExplanationCard` renders step text with `dangerouslySetInnerHTML` because the step
`content`/`explanation` strings contain intentional HTML (e.g. `<strong>`, `<em>`,
`<code>`) for richtext formatting. Those strings are built by template literals that
interpolate the user's expression and values derived from it (sub-operands, built
sub-expressions, popped symbols, results).

**Exploitability — currently NOT exploitable:**
Every page gates user input through `validateInfix` / `validatePostfix` / `validatePrefix`
(`src/utils/expressionValidator.js`) before any generator runs. All three validators reject
any character outside `[A-Z+\-*/^()]` (infix) / `[A-Z+\-*/^]` (postfix/prefix). Dangerous
constructs such as `<script>`, `">`, `onerror=`, `javascript:`, `${...}`, and backticks are
rejected outright. So no attacker-controlled HTML can currently reach the render sites.

**Risk:** If the upstream validation were ever relaxed, bypassed, or reused carelessly,
interpolated user text would be interpreted as HTML — a stored/reflected XSS vector. This is
a genuine defense-in-depth weakness.

**Fix applied (smallest safe change, no behavior change):**
- Added `escapeHtml` to `src/utils/visualizationSteps.js` that encodes `& < > " '`.
- Imported it into `src/utils/liveExplanationSteps.js` and wrapped the `clean` input in all
  18 expression generator functions.
- Because `escapeHtml` is the identity function for the validated safe charset
  (A–Z, `+ - * / ^`, parentheses), conversion algorithms and visible output are **unchanged**
  for every valid input (verified via build + `escapeHtml` unit checks).
- It hardens all interpolation paths (including stack-derived substrings and results) against
  any future validation bypass.

**Verification:** `npm run build` passes; production bundle builds cleanly. `escapeHtml`
unit-tested (no-op on safe set; neutralizes `<script>`, tag-breakout, quotes, ampersand).

---

### 05.2 Medium — `navigator.clipboard` requires a secure context

**Location:** `src/components/ResultCard.jsx`

**Description:** Copy-to-clipboard uses `navigator.clipboard.writeText`, which is only
available in a secure context (HTTPS or `localhost`).

**Assessment:** Not a vulnerability. `ResultCard.jsx` already contains a safe fallback
(`document.execCommand('copy')` on a temporary textarea) when the Clipboard API is
unavailable or throws. Functionality degrades gracefully on non-HTTPS deployments. No exposed
secret or persistent data is involved.

**Status:** Documented; no change required.

---

### 05.3 Low — `requestAnimationFrame` loop in `useLenis.js`

**Description:** A `requestAnimationFrame` loop runs continuously while a Lenis (smooth
scroll) instance is alive.

**Assessment:** Verified the hook uses a module-level singleton + `refCount` pattern: exactly
one Lenis instance and one RAF loop is created, and both are destroyed when the last consumer
unmounts. No leak, no runaway loop. This is normal for a scroll library.

**Status:** Documented; no change required.

---

### 05.4 Info — Pre-existing ESLint warnings

`npm run lint` reports warnings unrelated to security: unused imports in
`SkeletonLoader.jsx` / `ControlPanel.jsx`, a `react/no-unknown-property` rule-name issue in
`Antigravity.jsx`, and `setState-in-effect` in `Navbar.jsx` / `useLenis.js`. None affect the
security posture. Left unchanged per audit constraints (smallest safe change).

---

### 05.5 Info — Large single JS bundle

The production bundle is a single ~1.3 MB JS file (349 kB gzipped). This is a performance /
UX consideration, not a security issue. A Content-Security-Policy and code-splitting are
recommended (see §10).

---

## 6. Dependency Security

- Ran `npm audit --json`: **0 vulnerabilities** across 212 packages
  (53 production, 110 development, 50 optional).
- Dependency set reviewed and clean:
  - Runtime: `react` 19, `react-dom` 19, `react-router-dom` 7, `lenis` 1.3,
    `three` 0.185, `@react-three/fiber` 9.7, `react-icons` 5.7, `tailwindcss` 4.
  - Dev: `vite` 8.2, `@vitejs/plugin-react`, `eslint` 10.8, eslint react plugins,
    `@types/react(-dom)`, `globals`.
- No suspicious, abandoned, or deprecated packages. No known CVEs at audit time.
- No change required. (Do **not** use `npm audit fix --force`; nothing to force-fix.)

---

## 7. Input Security

### Validators (the primary XSS shield)

`src/utils/expressionValidator.js` provides `validateInfix`, `validatePostfix`,
`validatePrefix`. All three:
- strip whitespace and uppercase;
- reject any character outside a strict whitelist via regex;
- perform structural balance checks (parentheses and stack-counter for postfix/prefix).

Tested payloads **rejected** by all validators: `<script>alert(1)</script>`,
`"><img src=x onerror=alert(1)>`, `javascript:alert(1)`, `${alert(1)}`, `` `alert(1)` ``,
`a<b`, `a&b`.

Tested **valid** expressions accepted (and untouched by escaping):
`A+B*C`, `(A+B)*C`, `A^(B+C)`, `A-B/C`, `ABC*+`, `+AB`, `*+ABC`, etc.

### Algorithm safety

All six conversion algorithms (`infixToPostfix`, `infixToPrefix`, `postfixToInfix`,
`postfixToPrefix`, `prefixToInfix`, `prefixToPostfix`) are **pure functions that treat input
as data** — no `eval`, no `new Function`, no dynamic code execution anywhere. The expression
is scanned and tokenized only.

### Render safety

- Values rendered as JSX text are automatically escaped by React.
- `dangerouslySetInnerHTML` is limited to 3 sites, all in `LiveExplanationCard.jsx`, and the
  HTML they render now carries **pre-escaped** user data (see finding 01).
- The `StackVisualizer` table rows render stack contents as plain JSX text (safe).

---

## 8. Client-Side Security

| Area | Assessment |
|------|-----------|
| `eval` / `new Function` | None found. |
| `dangerouslySetInnerHTML` | 3 sites (fixed — data escaped at source). |
| `navigator.clipboard` | Secure-context only, but has safe fallback. |
| `localStorage` / `sessionStorage` | `localStorage` only stores theme key `'bb-theme'` = `'dark'\|'light'`; read/written safely; malformed value falls back to light mode. No sensitive data. |
| `document.write` | None. |
| External links (`Footer.jsx`, etc.) | All use `target="_blank"` with `rel="noopener noreferrer"`. No reverse-tabnabbing. |
| Timers (`setTimeout`/`setInterval`) | `useLivePlayer.js` / `usePlayer.js` clean up on unmount; page single `setTimeout` is one-shot on button click; `Home.jsx` hero interval is cleared on unmount. No leaks. |
| `<Link>` navigation | Uses `react-router-dom` `<Link>` (SPA), no `javascript:` hrefs. In-page anchors use `href="#..."` only. |
| 3D scene (`@react-three/fiber` / `three`) | Static decorative content only; no user input enters the scene graph. |

---

## 9. Secrets & Environment Variables

- **No `.env*` files** exist in the repository (verified via glob).
- No secrets, API keys, or tokens are present in source or build output.
- Build uses default Vite config with `build.sourcemap` unset → **sourcemaps are off**; the
  production `dist/` contains only the JS/CSS bundle, favicon, icons, and `index.html`. No
  source maps are shipped.
- **Note for future:** any `VITE_*` env var is bundled into the client and is visible to end
  users. Never store secrets this way. There are currently none.

---

## 10. Security Headers

No deployment configuration (Nginx, Vercel, Netlify, etc.) exists in this repository, so no
headers are defined. For production deployment, the following are recommended at the edge /
reverse-proxy layer:

```
Content-Security-Policy: default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  font-src 'self' data:;
  connect-src 'self';
  object-src 'none';
  base-uri 'self';
  frame-ancestors 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

Notes:
- `style-src 'unsafe-inline'` is required by Tailwind's runtime / inline-style usage.
- `script-src 'self'` is sufficient because this app has no inline scripts in `index.html`
  (Vite emits an external module).

---

## 11. Improvements Made (this audit)

| File | Change |
|------|--------|
| `src/utils/visualizationSteps.js` | Added `escapeHtml` helper (encodes `& < > " '`). |
| `src/utils/liveExplanationSteps.js` | Imported `escapeHtml`; wrapped the `clean` input in all 18 expression generators so every user-derived value interpolated into step HTML is output-encoded. |

No algorithm behavior changed. Valid input rendering is byte-identical (escaping is a no-op
on the validated safe charset). Build verified.

---

## 12. Remaining Recommendations

1. **CSP at deploy time** — add the headers in §10 to the chosen host (Vercel/Netlify `headers`
   config or Nginx) to lock down XSS/clickjacking regardless of any future code change.
2. **Code-splitting** — the single 1.3 MB bundle is a UX concern; lazy-load routes to reduce
   initial payload. Not security-critical.
3. **Consider a render-layer guard** — as a future hardening step, one could render step
   bodies without `dangerouslySetInnerHTML` (e.g., a tiny whitelisted mini-markup renderer).
   Not required now; current fix is sufficient.
4. **Keep dependencies updated** — rerun `npm audit` on a schedule given the single-page
   client-side surface.
5. **Resolve the pre-existing ESLint warnings** when convenient (hygiene only).

---

## 13. Final Security Status

| Dimension | Rating |
|-----------|--------|
| XSS (output encoding) | **Mitigated** (defense-in-depth fix applied) |
| XSS (input validation) | Protected (validators + React escaping) |
| Dependency vulnerabilities | **0** (npm audit) |
| Secrets exposure | None |
| Backend / auth / API / CORS | N/A — no such surface |
| Sourcemap leakage | None shipped |
| Clickjacking / headers | Recommended for deployment layer |

**Conclusion:** The application is safe to use. The one genuine defense-in-depth weakness
(untreated HTML rendering of user-derived data) has been fixed with output-escaping that does
not alter functionality. No critical vulnerabilities remain.
