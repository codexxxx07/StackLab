# Design System Documentation — Git & GitHub Workshop Website

## 1. Tech Stack & Tools

| Tool | Version | Purpose |
|------|---------|---------|
| React | 19.2.7 | UI Framework |
| Tailwind CSS | 4.3.3 | Utility-first CSS |
| Vite | 8.1.1 | Build tool |
| Lenis | 1.3.26 | Smooth scrolling |
| React Icons | 5.7.0 | Icon library |

---

## 2. Typography

### Font Families

| Token | Font | Usage |
|-------|------|-------|
| `--font-sans` | **Plus Jakarta Sans** (weights: 400, 500, 600, 700, 800) | Primary body font — all UI text |
| `--font-mono` | **JetBrains Mono** (weights: 400, 600) | Code snippets, terminal cards, git hashes |

### Font Sizes & Weights

| Element | Size | Weight | Class |
|---------|------|--------|-------|
| Hero Title (lg) | `text-7xl` (72px) | `font-extrabold` (800) | `Hero.jsx:71` |
| Hero Title (sm) | `text-6xl` (60px) | `font-extrabold` | `Hero.jsx:71` |
| Hero Title (default) | `text-5xl` (48px) | `font-extrabold` | `Hero.jsx:71` |
| Section Titles (sm) | `text-4xl` (36px) | `font-extrabold` | `SectionHeading.jsx:25` |
| Section Titles (default) | `text-3xl` (30px) | `font-extrabold` | `SectionHeading.jsx:25` |
| Card Titles | `text-2xl` (24px) | `font-extrabold` | `Curriculum.jsx:89` |
| Mentor Names (sm) | `text-2xl` (24px) | `font-extrabold` | `Mentors.jsx:119` |
| Mentor Names (default) | `text-xl` (20px) | `font-extrabold` | `Mentors.jsx:119` |
| Subtitle / Lead text (sm) | `text-xl` (20px) | `font-normal` | `Hero.jsx:85` |
| Subtitle / Lead text (default) | `text-lg` (18px) | `font-normal` | `Hero.jsx:85` |
| Body text | `text-base` (16px) | `font-normal` | `About.jsx:51` |
| Small body / descriptions | `text-sm` (14px) | `font-semibold` or `font-medium` | Various |
| Tagline / label | `text-xs` (12px) | `font-bold` | Various |
| Micro text | `text-[11px]` | `font-semibold` | `About.jsx:126` |
| Stat counters | `text-5xl` (48px) | `font-extrabold`, `tabular-nums` | `HowItWent.jsx:50` |
| Footer branding | `text-base` (16px) | `font-extrabold` | `Footer.jsx:55` |

### Font Weights Used

| Weight | Tailwind Class | Usage |
|--------|---------------|-------|
| 400 | `font-normal` | Body paragraphs, descriptions |
| 500 | `font-medium` | Secondary text, git log messages |
| 600 | `font-semibold` | Nav links, list items, labels |
| 700 | `font-bold` | CTAs, badges, chip labels |
| 800 | `font-extrabold` | All headings, titles, stats, card headers |

### Letter Spacing

| Class | Usage |
|-------|-------|
| `tracking-tight` | Headings (hero, section titles) |
| `tracking-wider` | Uppercase tags, small labels |
| `tracking-widest` | Footer section headers, eyebrow labels |
| `tracking-[0.18em]` | Eyebrow chips in SectionHeading |
| `tracking-[0.2em]` | Free workshop pill badge |

---

## 3. Color System

### Light Mode Palette

| Token / Class | Hex | Usage |
|---------------|-----|-------|
| `--color-cream` / `bg-cream` | `#f7f5f0` | Primary page background |
| `--color-cream-dark` / `bg-cream-dark` | `#efede6` | Alternate section backgrounds |
| `text-stone-900` | `#1c1917` | Primary body text |
| `text-stone-700` | — | Secondary text |
| `text-stone-600` | — | Tertiary / description text |
| `text-stone-500` | — | Muted text, labels |
| `text-stone-400` | — | Very muted text |
| `bg-white` | `#ffffff` | Card backgrounds, badges |
| `border-stone-900/5` | — | Light borders |
| `border-stone-900/8` | — | Navbar scroll border |

### Dark Mode Palette

| Token / Class | Hex | Usage |
|---------------|-----|-------|
| `bg-black` | `#000000` | Dark mode body background |
| `bg-[#050505]` | `#050505` | Dark section backgrounds |
| `text-white` | `#ffffff` | Headings in dark mode |
| `text-bugbusters-soft` | `#a0aec0` | Default dark mode body text |
| `text-gray-300` | — | Secondary dark text |
| `text-gray-400` | — | Muted dark text |
| `text-gray-500` | — | Very muted dark text |
| `bg-bugbusters-card` | `#0f172a` | Dark mode card backgrounds |
| `border-white/10` | — | Dark mode borders |
| `bg-white/5` | — | Dark mode subtle bg |
| `bg-white/10` | — | Dark mode hover bg |

### Brand Colors (BugBusters Dark Mode)

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-bugbusters-blue` | `#2d5daa` | Primary brand blue |
| `--color-bugbusters-cyan` | `#00c6d7` | Primary brand cyan |
| `--color-bugbusters-purple` | `#6a5cff` | Primary brand purple |
| `--color-bugbusters-soft` | `#a0aec0` | Soft grey text |
| `--color-bugbusters-card` | `#0f172a` | Card background |

### Accent Colors (used across components)

| Color Family | Light Mode | Dark Mode | Primary Usage |
|-------------|-----------|-----------|---------------|
| **Orange/Amber** | `orange-500`, `amber-500` | `cyan-300`, `cyan-400` | Primary CTA buttons, accent highlights, badges |
| **Indigo/Violet** | `indigo-600`, `violet-500` | `bugbusters-blue`, `bugbusters-purple` | Secondary accents, Day 1 theme |
| **Emerald/Teal** | `emerald-500`, `teal-400` | Same | Success indicators, checkmarks |
| **Rose/Pink** | `rose-500`, `pink-500` | Same | Certificate section, accents |
| **Sky/Cyan** | `sky-500`, `cyan-400` | Same | Q&A support, additional accents |

### Selection Color

| Mode | Color |
|------|-------|
| Light | `rgb(251 146 60 / 0.35)` — orange tint |
| Dark | `rgb(0 198 215 / 0.35)` — cyan tint |

---

## 4. Gradients

### Primary Gradients

| Name | CSS | Usage |
|------|-----|-------|
| **Orange/Amber (CTA)** | `from-orange-500 to-amber-500` | Primary CTA buttons, accent bars |
| **Indigo/Violet** | `from-indigo-600 to-violet-500` | Secondary accent, Day 1 curriculum |
| **Emerald/Teal** | `from-emerald-500 to-teal-400` | Success states, Day 1 check icons |
| **Rose/Pink** | `from-rose-500 to-pink-500` | Certificate badge, session resources |
| **Sky/Cyan** | `from-sky-500 to-cyan-400` | Q&A support card |

### BugBusters Signature Gradient (Dark Mode)

| Class | Gradient | Usage |
|-------|----------|-------|
| `bg-bugbusters` (utility) | `linear-gradient(135deg, #00c6d7, #2d5daa, #6a5cff)` | CTA buttons in dark mode |
| `from-bugbusters-cyan via-bugbusters-blue to-bugbusters-purple` | Same spectrum | Certificate strip, decorative elements |

### Text Gradients (bg-clip-text)

| Location | Gradient |
|----------|----------|
| Hero "Workshop" text (light) | `from-orange-500 via-amber-500 to-orange-600` |
| Hero "Workshop" text (dark) | `from-bugbusters-cyan via-bugbusters-blue to-bugbusters-purple` |
| Mentor role text | `from-orange-500 to-amber-400` / `from-indigo-600 to-violet-400` |
| Curriculum large numbers | Same as day's accent gradient at `opacity-20` |

---

## 5. Shadows

| Token | CSS Value | Usage |
|-------|-----------|-------|
| `shadow-soft` | `0 1px 2px rgb(28 25 23 / 0.05), 0 8px 20px -6px rgb(28 25 23 / 0.10)` | Default card shadow, badges |
| `shadow-lift` | `0 2px 6px rgb(28 25 23 / 0.06), 0 24px 48px -12px rgb(28 25 23 / 0.18)` | Hover state on cards |
| `shadow-glow` | `0 10px 32px -8px rgb(249 115 22 / 0.50), 0 24px 48px -12px rgb(28 25 23 / 0.14)` | Orange glow on CTA hover |
| `shadow-glow-indigo` | `0 10px 32px -8px rgb(99 102 241 / 0.50), ...` | Indigo glow on mentor cards |
| `shadow-bugbusters` | `0 10px 32px -8px rgb(0 198 215 / 0.45), 0 24px 48px -12px rgb(45 93 170 / 0.40)` | Dark mode CTA glow |
| `drop-shadow-md` | Tailwind default | Logo drop shadow |
| Custom (emerald) | `0 10px 30px -8px rgb(16 185 129 / 0.45)` | Umesh card hover |
| Custom (rose) | `0 10px 30px -8px rgb(244 63 94 / 0.45)` | Prachi card hover |

---

## 6. Border Radius

| Class | Size | Usage |
|-------|------|-------|
| `rounded-full` | 9999px | Avatars, dots, social buttons, decorative blobs |
| `rounded-4xl` | 2rem | Outer glow containers |
| `rounded-3xl` | 1.5rem | Cards (About visual, Certificate preview) |
| `rounded-2xl` | 1rem | Primary card radius, badges, CTA buttons, chips |
| `rounded-xl` | 0.75rem | Nav items, topic list items, icon containers |
| `rounded-lg` | 0.5rem | Small badges, terminal bar |
| `rounded-md` | 0.375rem | Git hash badges |
| `rounded-br-3xl` | — | Decorative skewed shapes |
| `rounded-tl-3xl` | — | Decorative skewed shapes |

---

## 7. Effects & Animations

### Transitions

| Property | Duration | Easing | Usage |
|----------|----------|--------|-------|
| `transition-all duration-300` | 300ms | default | Most hover effects, dark mode toggle, nav |
| `transition-all duration-500` | 500ms | default | Mentor card gradient bar expand |
| `transition-colors duration-200` | 200ms | default | Git log row hover, topic hover |
| `transition-colors duration-300` | 300ms | default | Audience card background |
| `transition-transform duration-300` | 300ms | default | Logo hover, arrow icons |
| `transition-opacity duration-300` | 300ms | default | Shimmer effect, inner glow |
| `transition-opacity duration-500` | 500ms | default | Mentor card inner glow |

### Hover Transform Effects

| Effect | Class | Usage |
|--------|-------|-------|
| Lift up | `hover:-translate-y-1.5` | CTA buttons, stat cards, social icons |
| Subtle lift | `hover:-translate-y-1` | Secondary buttons, list items |
| Scale up | `hover:scale-110` | Resource icons, avatar initials |
| Scale subtle | `hover:scale-105` | Mentor avatar |
| Rotation reset | `hover:rotate-0` | Cards with initial tilt |
| Arrow slide | `group-hover:translate-x-1` | Arrow icons in CTAs |
| Arrow slide (larger) | `group-hover/link:translate-x-1.5` | Curriculum resource links |
| Line expand | `group-hover:w-5` | Footer quick link underlines |

### Skew / Tilt Effects (Skewmorphic Design)

| Effect | Class | Usage |
|--------|-------|-------|
| Left tilt | `-rotate-1` | Cards (even index), badges, avatars |
| Right tilt | `rotate-1` | Cards (odd index), badges |
| Skewed background shapes | `-skew-x-6`, `skew-x-3`, `-skew-y-6` | Decorative bg elements |
| Skewed accent bar | `-skew-x-12` | Hero underline under "Workshop" |
| Skewed CTA button | `-rotate-1` / `rotate-1` | Hero buttons |

### Card Shimmer Effect

```css
/* From index.css */
.card-shimmer::after {
  background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%);
  opacity: 0;
  transition: opacity 0.3s;
}
.card-shimmer:hover::after {
  opacity: 1;
}
```

### Background Blur Effects

| Class | Usage |
|-------|-------|
| `backdrop-blur-xl` | Navbar on scroll, mobile dropdown |
| `backdrop-blur-md` | Navbar default state |
| `blur-3xl` | Background decorative blobs |
| `blur-2xl` | Inner glows, background accents |
| `blur-md` | Avatar glow shadows |

### Glow Effects (Pseudo-element based)

- **Inner card glow on hover**: Absolute positioned `rounded-full` gradient divs with `opacity-0 group-hover:opacity-15` + `blur-2xl`
- **Avatar glow**: Absolute gradient behind avatar with `blur-md opacity-0 group-hover:opacity-60`

### CountUp Animation (HowItWent stats)

- Easing: `1 - Math.pow(1 - t, 3)` (cubic ease-out)
- Duration: 1800ms
- Triggered by `IntersectionObserver` at 30% threshold
- Uses `requestAnimationFrame`

---

## 8. Spacing System

### Section Padding

| Section | Vertical Padding |
|---------|-----------------|
| Hero | `pt-36 sm:pt-44 pb-28` |
| Standard sections | `py-24` |
| About section | `py-16 sm:py-24` |
| Footer | `py-16` |

### Max Width

| Container | Width |
|-----------|-------|
| Main content | `max-w-6xl` (1152px) |
| Narrow content | `max-w-5xl` (1024px) |
| Terminal card | `max-w-2xl` (672px) |
| Certificate preview | `max-w-3xl` (768px) |
| Hero title | `max-w-4xl` (896px) |
| Section heading text | `max-w-2xl` (672px) |

### Common Gaps

| Pattern | Gap |
|---------|-----|
| Card grids | `gap-6` (24px) |
| Flex items (badges) | `gap-3` (12px) |
| Navigation links | `gap-7` (28px) |
| Social icons | `gap-3` (12px) |
| Footer columns | `gap-12` (48px) |
| Curriculum card internal | `gap-10` |

---

## 9. Layout Patterns

### Grid Layouts

| Component | Grid |
|-----------|------|
| About section | `lg:grid-cols-2` |
| Stats grid | `grid-cols-2` |
| Resources | `sm:grid-cols-2 lg:grid-cols-3` |
| Audience | `sm:grid-cols-2 lg:grid-cols-3` |
| HowItWent stats | `sm:grid-cols-2 lg:grid-cols-4` |
| Organizers | `sm:grid-cols-2 lg:grid-cols-4` |
| Mentors | `lg:grid-cols-2` |
| Footer | `md:grid-cols-[1.5fr_1fr_1fr]` |
| Certificate info cards | `sm:grid-cols-3` |

### Flex Layouts

- Navbar: `flex items-center justify-between`
- Badges/chips: `inline-flex items-center gap-*`
- SectionHeading decorative bars: `flex items-center gap-2`
- Social icons: `flex items-center gap-3`

---

## 10. Component Patterns

### Card Component (`Card.jsx`)

| Prop | Values | Effect |
|------|--------|--------|
| `tilt` | `"left"`, `"right"`, `"none"` | `-rotate-1` or `rotate-1` |
| `hover` | `boolean` | Adds lift + translate + border change |
| `glow` | `"none"`, `"indigo"`, `"orange"` | Shadow type on hover |

### SectionHeading Component

Pattern: `eyebrow` chip → `title` → optional `subtitle` → decorative gradient bars

### Decorative Bar Pattern (used in dividers + headings)

```
Orange/Amber bar (w-16, -rotate-2) → Indigo/Violet bar (w-7-8, rotate-1) → Emerald/Teal bar (w-3-4, -rotate-2)
```

### Dark Mode Toggle

- Stored in `localStorage` under `bb-theme`
- Applied via `.dark` class on `<html>` element
- Custom variant: `@custom-variant dark (&:where(.dark, .dark *))`

---

## 11. Background Decorative Patterns

### Grid Pattern (Hero)

```css
background-image: linear-gradient(var(--grid-line) 1px, transparent 1px),
                  linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
background-size: 56px 56px;
maskImage: radial-gradient(ellipse 80% 60% at 50% 20%, black, transparent);
opacity: 30%;
```

| Mode | Grid Line Color |
|------|----------------|
| Light | `rgb(28 25 23 / 0.05)` |
| Dark | `rgb(255 255 255 / 0.05)` |

### Blob / Blur Backgrounds

Used in: Hero, Certificate, Mentors
- Large `rounded-full` divs with gradient fills
- `blur-3xl` applied
- Positioned absolutely, `pointer-events-none`

### Skewed Accent Strips

Used in: About, Curriculum, Audience, Resources, Organizers, Mentors, Footer
- `-skew-x-3`, `-skew-x-6`, `skew-x-3`, `-skew-y-6` etc.
- Low opacity gradient fills
- Positioned absolutely on edges

---

## 12. Interactive States

### Link Hover Pattern (Navbar)

```
text-stone-600 → hover:text-orange-500 (light)
text-gray-300 → hover:text-cyan-300 (dark)
```
Underline animation: `after:w-0 → hover:after:w-full` with `bg-orange-500` / `bg-cyan-400`

### Social Icon Hover

- Light: `hover:text-[platform-color]` + `hover:border-orange-400/50` + `hover:shadow-glow`
- Dark: Same with `hover:-translate-y-1.5`

### Footer Quick Links

- Line expands: `w-3 → w-5` + color changes from `stone-600` to `orange-400`

---

## 13. Responsive Design

### Breakpoints Used

| Breakpoint | Width | Usage |
|------------|-------|-------|
| `sm` | 640px | Grid adjustments, font size bumps |
| `md` | 768px | Footer grid, nav visibility |
| `lg` | 1024px | Multi-column layouts |

### Mobile-First Patterns

- Navbar: hamburger menu below `md`, full nav above
- Cards: single column on mobile, multi-column on larger
- Font sizes: smaller defaults with `sm:` overrides
- Padding: smaller on mobile with responsive variants

---

## 14. Scroll Behavior

- **Smooth scroll offset**: `scroll-margin-top: 80px` on all `[id]` elements (for fixed navbar)
- **Lenis smooth scroll**: `lerp: 0.1`, `wheelMultiplier: 1`, `touchMultiplier: 1.5`
- **Overflow**: `overflow-x: hidden` on `html, body`

---

## 15. Icon System

### Libraries

| Library | Icons Used |
|---------|-----------|
| `react-icons/fi` | `FiSun`, `FiMoon`, `FiArrowRight` |
| `react-icons/hi2` | `HiOutline*` — Calendar, Video, Users, Sparkles, CheckCircle, Globe, CodeBracket, LightBulb, BookOpen, Folder, ChatBubble, AcademicCap, RocketLaunch, Trophy, Briefcase, ArrowDownTray, ShieldCheck, CheckBadge, Clock, ArrowRight` |
| `react-icons/fa6` | `FaWhatsapp`, `FaLinkedinIn`, `FaInstagram`, `FaGithub`, `FaArrowUpRightFromSquare` |

### Icon Sizes

| Size | Class | Usage |
|------|-------|-------|
| Large | `text-3xl` | Certificate info icons |
| Medium | `text-2xl` | Resource card icons |
| Standard | `text-lg` | Badge icons, nav toggle |
| Small | `text-sm` | Checkmark in lists, terminal icons |
| Extra small | `text-xs` | Footer social icons |

---

## 16. Selection & Focus

- **Text selection (light)**: `background-color: rgb(251 146 60 / 0.35)` — orange
- **Text selection (dark)**: `background-color: rgb(0 198 215 / 0.35)` — cyan
- **Focus visible**: Uses default browser focus-visible ring (not customized)

---

## Summary of Design Philosophy

The design follows a **"Skewmorphic Modern"** approach:

1. **Tilted/rotated cards** (-1deg / +1deg) create a playful, handcrafted feel
2. **Rich gradient accents** (orange→amber, indigo→violet, cyan→blue→purple) add depth
3. **Layered shadows** (soft → lift → glow) provide clear visual hierarchy
4. **Blurred background blobs** add subtle depth without distraction
5. **Grid pattern overlay** on the hero adds a technical/developer aesthetic
6. **Full dark mode** with brand-specific BugBusters palette (cyan/blue/purple)
7. **Consistent section pattern**: eyebrow chip → title → subtitle → decorative bars → content
8. **Hover micro-interactions**: lift, scale, glow, rotation reset, shimmer

The orange/amber palette is the primary accent in light mode, while the BugBusters cyan/blue/purple palette takes over in dark mode — creating two distinct but cohesive visual identities.
