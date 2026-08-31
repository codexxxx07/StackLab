# DSA Expression Visualizer — Stack Lab

An interactive web app that makes Data Structures & Algorithms **visible**. It turns the classic "trace table" explanation of expression conversion into a live, step-by-step animation of a stack — so you can literally watch operands move to the output while operators wait their turn.

Live conversions are fully implemented for **Infix ↔ Postfix ↔ Prefix**, each available in two teaching styles (a **Normal Method** and a **Stack Method**) plus a narrated **Live Explanation** mode.

---

## Overview

- **What it does:** Converts between three expression notations — Infix, Postfix (Reverse Polish) and Prefix (Polish) — and animates every step of the process.
- **Why it was created:** Expression conversion is often the first place students meet a stack doing real work, but it's typically taught as a static wall of trace tables. This project inverts that: the **algorithm generates steps, the UI plays them**, so anyone can see *why* the answer is what it is.
- **What DSA concept it demonstrates:** The **Stack** data structure, with **operator precedence**, **associativity**, and the classic **Shunting Yard** style conversion algorithms.
- **Who it is useful for:** CS students revising for exams, self-learners struggling to visualise stacks, and anyone who wants to trace expression conversion on paper after watching it come alive.

---

## Features

- **Six conversion types**, all fully live (see the table below).
- **Two methods per conversion:**
  - **Method 01 — Normal Method**: the expression is rewritten step by step using operator-precedence rules directly.
  - **Method 02 — Stack Method**: a table showing `Expression | Stack | Output` at every step.
- **Introductions + step-by-step trace** for every conversion.
- **Live Explanation** mode with an auto-playing, narrated walkthrough for both the Normal and the Stack methods.
- **Play / Pause / Next / Prev / Restart / Replay** controls — the explanation never auto-starts; you press **Play** to begin.
- **Input validation** with friendly, human-readable error messages (no crashes on bad input).
- **Example chips** on every page — click one to instantly visualize a pre-built expression.
- **Copy-result** button on the final answer.
- **Fully responsive** UI (mobile, tablet, desktop).
- **Dark / Light mode** toggle, persisted in `localStorage`.
- **Smooth scrolling** via [Lenis](https://github.com/darkroomengineering/lenis).
- Animated **3D particle background** ([React Three Fiber](https://r3f.docs.pmnd.rs/) / [Three.js](https://threejs.org/)) and **click spark** effects.
- **Skeleton loading screen** on app boot.
- Home page with a self-playing **live demo**, a **marquee**, "How it works", a conversion grid, and a "Why stacks?" section.
- An **About** page covering notation theory, precedence rules, and the roadmap.

---

## Supported Conversions

| Conversion | Supported |
|------------|-----------|
| Infix to Postfix | ✅ |
| Postfix to Infix | ✅ |
| Infix to Prefix | ✅ |
| Prefix to Infix | ✅ |
| Postfix to Prefix | ✅ |
| Prefix to Postfix | ✅ |

All six are routed from the homepage, the navigation "Visualizers" dropdown, and the footer.

---

## How It Works

### The notations

- **Infix** places the operator *between* its operands — the way we write math by hand, e.g. `A + B`. It needs precedence rules and parentheses to stay unambiguous.
- **Postfix (Reverse Polish)** places the operator *after* its operands, e.g. `A B +`. No brackets are ever needed.
- **Prefix (Polish)** places the operator *before* its operands, e.g. `+ A B`. Also bracket-free.

### Operands and operators

- **Operands** (single letters `A`–`Z`) never wait in the stack — they go straight to the output.
- **Operators** (`+ - * / ^`) often arrive *before* their right operand has been read, so they are **pushed** onto the stack and only **popped** to the output when a higher-or-equal priority operator comes along, or when the input ends.

### How stack-based conversion works

The core idea is **LIFO** (Last-In, First-Out): an operator is parked on top of the stack and can only be released once everything above it has been finished. Precedence decides the "parking rules":

| Operator | Precedence |
|----------|-----------|
| `^` | 3 (highest) |
| `*` `/` | 2 |
| `+` `-` | 1 |
| `(` `)` | grouping only |

`^` is **right-associative**; all other operators are **left-associative**.

### How the visualizer represents each step

Every conversion algorithm lives in a pure utility module that returns a **list of machine snapshots** (`{ symbol, action, stack, output, reason[] }`). The UI is simply a *player* over that list:

- The **Normal Method** rewrites the expression line by line (precedence applied in order).
- The **Stack Method** renders a row per step: the symbol being read, the current stack contents, and the output built so far.
- The **Live Explanation** replays those same steps automatically with a plain-language narration.

---

## Methods

Each conversion page presents the final answer first, then both methods, each with its own Live Explanation card.

### Method 01 — Normal Method

Applying precedence rules directly, the expression is transformed step by step. The intermediate expression is **updated in place** (a new `=` line per meaningful transformation), never shown as a confusing arrow chain.

For **Infix → Postfix**, `A+B*C` is solved like this:

```text
A+B*C
=A+BC*
=ABC*+
```

Each line is a real re-ordering: first `*` binds tighter than `+`, so `B*C` becomes `BC*`; then `A + (B*C)` becomes `ABC*+`.

For **Postfix → Infix**, the steps rebuild brackets progressively as each operator pairs up its two operands:

```text
ABC*+
=A(B*C)
=(A+(B*C))
```

Here `*` first combines `B*C` into `(B*C)`, then `+` combines `A` and `(B*C)` into `(A+(B*C))`.

### Method 02 — Stack Method

The stack algorithm is presented as a table with three columns — **Expression | Stack | Output** — where the third column is the output built in the destination notation (labelled **Postfix**, **Prefix**, or **Infix** depending on the conversion). Each row shows one symbol as it is processed.

Using the same `A+B*C` example:

| Expression | Stack | Output |
|------------|-------|--------|
| A | | A |
| + | + | A |
| B | + | AB |
| * | + * | AB |
| C | + * | ABC |
| (end) | + | ABC* |
| (end) | | ABC*+ |

Operands (`A`, `B`, `C`) jump straight to the output; operators are pushed; a higher-or-equal precedence operator on the stack top gets popped to the output before the new one is pushed.

---

## Live Explanation

The **Live Explanation** is the heart of the learning experience. An introductory slide or two explains the concept, then the conversion replays step by step.

- **It never auto-runs.** The card opens in an **idle** state with a **Play** button; nothing happens until you start it.
- **Play** begins the walkthrough.
- **Pause** freezes it mid-step; **Resume** continues.
- Steps advance **automatically** (about 1.8 seconds each) while playing.
- **Previous / Next** let you scrub through manually; stepping keeps the current playing/paused state, and if you're playing the timer restarts after each manual step.
- **Restart** returns to the beginning; **Replay** starts over when finished.
- A **Completed** state shows the final answer with a Replay button.
- Every step is narrated in plain English, and the stack method shows a live **Current Token**, a vertical **Stack** (with its `TOP` marked), and the **Output** panel.

This makes the algorithm legible even on first contact: you see each push and pop happen, understand *why* it happened, and can later reproduce the same trace on paper.

> The two cards — one for the Normal Method, one for the Stack Method — each have an independent player.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [React](https://react.dev) (^19.2) | UI framework |
| [Vite](https://vite.dev) (^8.2) | Build tool & dev server |
| [Tailwind CSS](https://tailwindcss.com) (^4.3) | Utility-first styling |
| [react-router-dom](https://reactrouter.com) (^7.18) | Client-side routing |
| [Lenis](https://github.com/darkroomengineering/lenis) (^1.3) | Smooth scrolling |
| [React Icons](https://react-icons.github.io/react-icons) (^5.7) | Icon library |
| [Three.js](https://threejs.org) (^0.185) | 3D rendering |
| [@react-three/fiber](https://r3f.docs.pmnd.rs/) (^9.7) | React renderer for Three.js |
| [ESLint](https://eslint.org) (^10) | Linting |

---

## Project Structure

```text
.
├── index.html                  # Entry HTML (fonts, meta, favicon)
├── vite.config.js              # Vite + React + Tailwind plugins
├── eslint.config.js            # ESLint configuration
├── DESIGN_SYSTEM.md            # Design tokens & visual system reference
├── public/                     # Static assets (favicon, icon sprite)
└── src/
    ├── main.jsx                # React root + StrictMode
    ├── App.jsx                 # Router, global layout, boot/skeleton fade, 3D bg
    ├── index.css               # Tailwind theme, dark mode, animations, components
    ├── data/
    │   └── conversions.js      # Single source of truth for the 6 conversions
    ├── hooks/
    │   ├── usePlayer.js        # Step player (speed, play/pause/next/prev/reset)
    │   ├── useLivePlayer.js    # Live-Explanation player (idle/playing/paused/completed)
    │   └── useLenis.js         # Singleton Lenis smooth-scroll instance
    ├── utils/
    │   ├── visualizationSteps.js     # Precedence, character helpers, cleanExpression
    │   ├── expressionValidator.js    # validateInfix / validatePostfix / validatePrefix
    │   ├── infixToPostfix.js         # Shunting-yard algorithm → { result, steps }
    │   ├── infixToPrefix.js          # Reversed-scan prefix algorithm
    │   ├── postfixToInfix.js         # String-stack algorithm
    │   ├── postfixToPrefix.js        # String-stack algorithm
    │   ├── prefixToInfix.js          # String-stack algorithm
    │   ├── prefixToPostfix.js        # String-stack algorithm
    │   ├── explanations.js           # Normal-Method steps + Stack-Method table builders
    │   └── liveExplanationSteps.js   # Intro + narrated live-step generators per conversion
    ├── components/
    │   ├── Navbar.jsx                # Nav, dropdown, theme toggle, mobile sheet
    │   ├── Footer.jsx                # Brand, conversion links, socials
    │   ├── PageHeader.jsx            # Accent-coloured page title/description
    │   ├── ExpressionInput.jsx       # Validated input + example chips + error box
    │   ├── TwoMethodExplanation.jsx  # Final answer + both methods + live cards
    │   ├── ExplanationCard.jsx       # Numbered card wrapper (Method 01 / 02)
    │   ├── LiveExplanationCard.jsx   # Intro slides + narrated step player
    │   ├── ConversionCard.jsx        # Homepage conversion tile
    │   ├── SkeletonLoader.jsx        # Boot shimmer screen
    │   ├── Antigravity.jsx           # 3D particle background (React Three Fiber)
    │   ├── ClickSpark.jsx            # Canvas click-spark effect
    │   └── ...                        # (Standalone visualizer primitives — see note below)
    └── pages/
        ├── Home.jsx                  # Hero, demo, marquee, how-it-works, grid, CTA
        ├── About.jsx                 # Theory, precedence, roadmap
        └── InfixToPostfix.jsx        # One page per conversion (~identical template)
            PostfixToInfix.jsx
            InfixToPrefix.jsx
            PrefixToInfix.jsx
            PostfixToPrefix.jsx
            PrefixToPostfix.jsx
```

**Important directories/files:**

- `src/utils/` holds all the **pure algorithm code**. Each algorithm returns `{ result, steps }` where every step is a full machine snapshot. This is what makes the UI a thin "player" and the algorithms easy to test in isolation.
- `src/data/conversions.js` is the single source of truth for every conversion (path, title, example, accent colour, status). Adding a future conversion means adding an entry here.
- `src/hooks/usePlayer.js` and `src/hooks/useLivePlayer.js` encapsulate all playback timing logic.
- `DESIGN_SYSTEM.md` documents the visual design language (see below).

> **Note:** `src/components/` also contains several components that are **defined but not currently wired into any page**: standalone visualizer primitives (`ExpressionVisualizer.jsx`, `StackVisualizer.jsx`, `ControlPanel.jsx`, `StepTable.jsx`, `ResultCard.jsx`, `OperationPanel.jsx`, `ExpressionDisplay.jsx`, `OutputDisplay.jsx`) plus `ComingSoonCard.jsx` and `PostfixInfixExplanations.jsx`. The conversion pages render equivalent functionality through `TwoMethodExplanation` and `LiveExplanationCard` instead.

---

## Design System

The UI follows a **"Skewmorphic Modern"** visual language (documented in `DESIGN_SYSTEM.md`), adapted from the project's inherited workshop design system.

- **Skewmorphic feel:** cards, buttons, badges and decorative shapes are subtly tilted (`-rotate-1` / `rotate-1`, occasional `rotate-2`) and straighten on hover, giving a playful, handcrafted identity.
- **Typography:** **Plus Jakarta Sans** for all UI text and **JetBrains Mono** for expressions, code and stack tokens. Weight scale runs from `font-medium` (400–500) up to `font-extrabold` (800) for headings. Tight tracking on headings; wide tracking on uppercase labels.
- **Color system — Light mode:** a cream page background (`#f7f5f0`) with orange/amber as the primary accent, indigo/violet, emerald/teal and rose/pink serving as secondary accents with stone text.
- **Color system — Dark mode (BugBusters palette):** near-black surfaces (`#000000`, `#050505`, cards `#0f172a`) with a signature **cyan → blue → purple** gradient (`#00c6d7`, `#2d5daa`, `#6a5cff`) replacing the orange/amber as the primary accent. Toggled via a navbar button and persisted under `bb-theme` in `localStorage` (applied as a `.dark` class on `<html>`).
- **Gradients:** rich `linear-gradient` accents (orange→amber, indigo→violet, emerald→teal, rose→pink; the BugBusters cyan→blue→purple in dark) used on CTAs, icon tiles and text (via `bg-clip-text`).
- **Shadows:** a layered system of `soft` → `lift` → `glow` (and dark-mode equivalents) creates clear visual hierarchy, with colour-matched glows on primary CTAs.
- **Border radius:** a consistent scale from `rounded-lg` (badges) through `rounded-2xl` (cards, buttons) to `rounded-full` (pills, dots).
- **Cards:** a shared `.card` component with soft shadow, `card-hover` lift and a `card-shimmer` highlight sweep on hover; `.panel`/`.panel-flat` for lighter surfaces.
- **Responsive design:** mobile-first breakpoints (`sm`/`md`/`lg`); single-column layouts collapse to multi-column grids on larger screens; the navbar becomes a hamburger sheet below `lg`.
- **Interactive states:** every interactive element has hover micro-interactions — lift (`-translate-y`), scale, glow, rotation reset, arrow-slide, and a shimmer sweep.
- **Background patterns:** a **grid pattern** overlay on the hero, plus blurred gradient **blobs** and tilted decorative shapes throughout for depth.
- **Smooth scrolling:** **Lenis** smooth scrolling with a 1.2s duration and custom easing; route changes scroll to the top.
- **Motion & accessibility:** CSS keyframe animations (pop-in, marquee, bob, blink, shimmer), and `prefers-reduced-motion` is respected by disabling animation.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (recent LTS, which includes `npm`)
- npm comes bundled with Node.js

### Installation

```bash
git clone <your-repo-url>
cd Visualiser
npm install
```

> Replace `<your-repo-url>` with the actual remote if you have one; none is referenced in the repository.

### Run Development Server

```bash
npm run dev
```

This starts the Vite dev server with HMR. Open the printed local URL (default `http://localhost:5173`).

### Production Build

```bash
npm run build
```

Outputs the optimized bundle to `dist/`. Preview it locally with:

```bash
npm run preview
```

Run the linter with:

```bash
npm run lint
```

---

## Usage

1. **Select a conversion.** From the **Home** page grid, the navbar **Visualizers** dropdown, or the footer.
2. **Enter an expression.** Type one (e.g. `A+B*C`) into the input box, or click any **example chip** to populate and submit it instantly. Incorrect input shows a friendly inline error instead of crashing.
3. **View the final answer** at the top of the results.
4. **Read the Normal Method** — the expression is rewritten line by line, `=` style.
5. **Read the Stack Method** — scan the `Expression | Stack | Output` table to follow each push/pop.
6. **Start the Live Explanation** — press **Play** on either method's card to watch the steps auto-play with narration.
7. **Pause / resume / continue** — use **Pause**, **Resume**, **Previous**, **Next**, **Restart** or **Replay** to move at your own pace.
8. Each step explains what just happened and why — follow along until you can trace it on paper yourself.

---

## DSA Concepts

- **Stack** — LIFO container that parks operators (or partial sub-expressions) until their operands are ready.
- **Operators** — `+ - * / ^`; ranked by precedence and pushed/popped accordingly.
- **Operands** — single letters `A`–`Z`; routed straight to the output.
- **Operator precedence** — `^` (3) > `* /` (2) > `+ -` (1); drives the pop/push decisions.
- **Associativity** — `^` is right-associative, all other operators left-associative.
- **Infix notation** — `A + B * C`.
- **Prefix (Polish) notation** — `+ A * B C`.
- **Postfix (Reverse Polish) notation** — `A B C * +`.
- **Expression conversion** — mechanical translation between the three notations using a stack.

---

## Example

Infix → Postfix for `A+B*C`:

```text
Infix:
A+B*C

Normal Method:
A+B*C
=A+BC*
=ABC*+

Final Postfix:
ABC*+
```

Stack Method (abbreviated) for the same input:

| Expression | Stack | Output |
|------------|-------|--------|
| A | | A |
| + | + | A |
| B | + | AB |
| * | + * | AB |
| C | + * | ABC |
| end | + | ABC* |
| end | | ABC*+ |

---

## Error Handling / Input Limitations

Input is **cleaned before processing**: whitespace is stripped and the expression is converted to **uppercase**. Validation is performed per notation before any algorithm runs.

- **Accepted operands:** single capital letters `A`–`Z`. Lowercase letters are automatically uppercased, and spaces are ignored.
- **Numbers are not supported** (multi-character/numeric operands are out of scope).
- **Operators:** `+ - * / ^` only.
- **Parentheses:** `( )` are accepted for **infix** expressions only; postfix/prefix inputs reject them.
- **Infix validation:** alternates operands/operators, checks balanced parentheses, rejects bare operators / missing operators.
- **Postfix & Prefix validation:** simulate a stack counter and reject inputs whose stack never collapses to exactly one result (i.e. too few/too many operators).
- **Invalid expressions** never crash the app — a specific, human-readable error message is shown in the input form (e.g. `The expression cannot end with a bare operator. Something like "A+" is incomplete.`).
- The input field clears the error as soon as you type again, and clicking an example chip submits it directly.

---

## Responsive Design

The site is mobile-first and adapts across breakpoints:

- **Mobile:** single-column layouts; the navbar collapses to a hamburger menu (below `lg`); the Home hero reduces to smaller title sizes; the hero's auto-playing demo and its decorative blobs are hidden or scaled down.
- **Tablet:** grids open into 2 + columns at `sm`/`md` (e.g. the conversion grid becomes two columns at `md`, many card grids at `sm`).
- **Desktop:** full multi-column layouts (e.g. `md:grid-cols-3`, `lg:grid-cols-2`, footer `md:grid-cols-3`) and the full horizontal navbar.

---

## Performance

- **Lenis smooth scrolling** — a single shared Lenis instance (ref-counted) smooths scroll with custom easing; on route change it resets to the top.
- **Pure-step architecture** — algorithms are pure functions returning a step list ahead of time; React simply renders the current snapshot, keeping rendering straightforward and predictable.
- **Skeleton loading screen** on initial boot (with a fade transition) so the page isn't blank while assets load.
- **Reusable design tokens & CSS components** (Tailwind `@theme`) keep the stylesheet lean.
- **`prefers-reduced-motion`** support disables animations/transitions for users who request it.

No lazy-loading or code-splitting is currently configured.

---

## Future Scope

Ideas that are **not yet implemented** but would be natural next steps:

- **More expression validation** — e.g. warnings for redundant parentheses, or deeper structural checks (current validation is solid but intentionally simple).
- **Numeric / multi-character operands** — currently only single letters `A`–`Z` are supported.
- **More operators** — e.g. unary minus/plus, modulus `%`, or custom precedence levels.
- **Algorithm complexity information** — displaying Big-O notes per conversion.
- **Better accessibility** — richer keyboard navigation and ARIA detail alongside existing labels.
- **Additional visualization modes** — e.g. an expression-tree view or a side-by-side comparison of all three notations.
- **Wiring up the existing standalone visualizer components** (`ExpressionVisualizer`, `StackVisualizer`, `ControlPanel`, `StepTable`, `ResultCard`, `OperationPanel`) into the pages for a character-by-character replay view.

---

## Author

Built by **Krish** (GitHub: [codexxxx07](https://github.com/codexxxx07)) as an academic Data Structures project. Reach out via [LinkedIn](https://www.linkedin.com/in/krishanjit-chakraborty-258a5237a) or [Instagram](https://www.instagram.com/_k_r_i_s_h_x_).

---

## License

This project does not currently include a LICENSE file, so no license is claimed. All rights reserved by default.
