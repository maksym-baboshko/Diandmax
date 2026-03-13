# Big Day — Wedding Invitation Site

Wedding invitation website for Maksym & Diana. June 28, 2026, Grand Hotel Terminus, Bergen, Norway.

> **Cross-tool context:** `AGENTS.md` and `GEMINI.md` mirror this file for Copilot/Antigravity/Gemini.
> When updating — edit `AGENTS.md`, then copy its content here and into `GEMINI.md`.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS v4 + CSS variables |
| Animation | Framer Motion 12 |
| i18n | next-intl 4 |
| Forms | react-hook-form + zod + @hookform/resolvers |
| Icons | lucide-react (available but barely used) |
| Utilities | clsx + tailwind-merge via `cn()` |

---

## Project Structure

FSD-inspired architecture:

```
src/
├── app/
│   ├── [locale]/         # Next.js App Router — layout + main page
│   └── api/rsvp/         # RSVP API route handler
├── features/             # Self-contained interactive features
│   ├── countdown/        # Live countdown timer (useSyncExternalStore singleton)
│   ├── language-switcher/ # uk/en toggle (useTransition + hydration-safe)
│   └── theme-switcher/   # Dark/light mode (Context + localStorage + system pref)
├── shared/
│   ├── config/           # All wedding data (dates, venue, couple, dress code, guests)
│   ├── i18n/             # next-intl setup + messages/uk.json + messages/en.json
│   ├── lib/              # cn(), fonts
│   └── ui/               # Reusable primitive components
└── widgets/              # Full page sections (one per page block)
    ├── splash/            # Animated envelope intro screen
    ├── navbar/            # Sticky nav with language + theme toggles
    ├── hero/              # Names + countdown
    ├── our-story/         # Couple portraits + narrative
    ├── timeline/          # Day schedule
    ├── location/          # Venue info + Google Maps embed
    ├── dress-code/        # Color palettes for guests
    ├── gifts/             # Gift registry info
    ├── rsvp/              # RSVP form (react-hook-form + zod)
    └── footer/            # Copyright + back-to-top
```

> **No `entities/` layer** — intentionally absent. This project has no domain models that need cross-feature sharing. Trigger to add it: dynamic guest invite pages (`/[locale]/invite/[slug]`), backend RSVP persistence, or shared data-transformation logic.

All layers use barrel `index.ts` exports — always import from the barrel, never from the file directly.

---

## Shared UI Components (`@/shared/ui`)

| Component | Purpose |
|---|---|
| `SectionWrapper` | Layout container with padding, optional alternate bg, `id` anchor |
| `SectionHeading` | Heading + italic subtitle + gold rule divider |
| `AnimatedReveal` | Framer Motion scroll-reveal wrapper. Directions: `up/down/left/right/up-left/up-right/down-left/down-right`. Has `blur` prop (expensive — use only when justified) |
| `Ornament` | Decorative SVG botanical corner element (`top-left/top-right/bottom-left/bottom-right`, sizes `sm/md/lg`) |
| `Button` | Polymorphic button. Variants: `primary/secondary/outline/ghost`. Sizes: `sm/md/lg` |
| `Input` | Styled input with `error?: boolean` prop |
| `Textarea` | Same as Input |
| `Label` | Form label with optional `required` prop (adds asterisk) |

---

## Styling Conventions

### Design tokens (CSS variables in `globals.css`)

All colors go through CSS variables — never hardcode hex in components.

**Light mode (`:root`):** `--bg-primary`, `--bg-secondary`, `--text-primary`, `--text-secondary`, `--accent`, `--accent-hover`, `--accent-soft`

**Dark mode (`.dark`):** same names, different values

Tailwind consumes them via `@theme inline` — use classes like `bg-bg-primary`, `text-accent`, `border-accent/20`.

### Typography

- Headings: `className="heading-serif"` or `"heading-serif-italic"` (Playfair Display)
- Cinzel numerals/time: `className="font-cinzel"` (Tailwind v4 canonical)
- Script accents: `font-[family-name:var(--font-vibes)]`
- Body: Inter (default, set on `<body>`)

### House easing curve

`[0.22, 1, 0.36, 1]` — use this for all Framer Motion transitions unless there's a specific reason not to.

---

## Internationalization

- **Default locale:** Ukrainian (`uk`), no URL prefix (`/`)
- **English:** `/en` prefix
- **Messages:** `src/shared/i18n/messages/uk.json` and `en.json` — must always be in sync (same keys)
- **Client navigation:** use `Link`, `useRouter`, `usePathname` from `@/shared/i18n/navigation` (not from `next/navigation`)
- **Translations in components:** `useTranslations("SectionName")` → `t("key")`

---

## Wedding Data (`@/shared/config`)

Single source of truth for all static data.

- `WEDDING_DATE` — `new Date("2026-06-28T12:00:00+02:00")`. Always import this when you need the date/time — never hardcode it elsewhere.
- `VENUE` — name, address, Google Maps embed URL, coordinates
- `COUPLE` — groom/bride names in `{ uk, en }` format
- `DRESS_CODE` — color palettes for ladies and gentlemen with hex + bilingual names
- `guests` array in `guests.ts` — guest list with Ukrainian vocative case, seat count, slug. `getGuestBySlug()` and `getAllGuestSlugs()` are ready for future guest-specific pages

---

## Theme System

- `ThemeProvider` wraps the entire app in `layout.tsx`
- `useTheme()` hook from `@/features/theme-switcher/ThemeProvider`
- Theme class applied to `document.documentElement` (`.dark`)
- Anti-FOUC inline script in `<head>` reads `localStorage` before first paint
- Dark mode in Tailwind: standard `dark:` variant

---

## Hydration Patterns

Several components handle SSR/client carefully — don't break these:

- **Countdown:** Uses `useSyncExternalStore` with `getServerSnapshot` returning zeros. A global singleton `setInterval` runs once in the browser. Don't refactor to `useEffect`/`useState` — it will cause hydration mismatch.
- **Splash:** Uses `useSyncExternalStore` to detect client mount, then checks `sessionStorage`. Shows once per session.
- **LanguageSwitcher:** Uses `useSyncExternalStore` for mount detection to avoid hydration diff on the locale label.
- **ThemeProvider:** Uses `queueMicrotask` to defer state updates, avoiding React 19 warnings.

---

## RSVP Form

Built with `react-hook-form` + `zod`. Schema is defined at module level (`schema` const). Fields: `name` (min 2 chars), `attending` (enum `"yes"/"no"`), `guests` (number, coerced), `dietary` (optional), `message` (optional).

The `attending` field uses custom buttons — set its value via `setValue("attending", "yes/no", { shouldValidate: true })`, not via `register()`.

**Backend not yet implemented.** `onSubmit` currently only sets `submitted: true`. When connecting to an API, replace the body of `onSubmit` — the form structure is ready.

---

## What's Not Built Yet

- **RSVP API endpoint** — form collects and validates data but doesn't persist it (`src/app/api/rsvp/route.ts` is a stub)
- **Guest-specific pages** — `getGuestBySlug()` / `getAllGuestSlugs()` exist in config and are ready for dynamic routes like `/[locale]/invite/[slug]`

---

## Key Rules

- **Never hardcode the wedding date** — always import `WEDDING_DATE` from `@/shared/config`
- **Never hardcode colors** — use CSS variable-based Tailwind classes (`bg-accent`, `text-text-primary`, etc.)
- **All new text must be in both `uk.json` and `en.json`** — keys must be identical
- **Tailwind v4 canonical classes** — prefer `bg-linear-to-b` over `bg-gradient-to-b`, `font-cinzel` over `font-[family-name:var(--font-cinzel)]`, etc.
- **`"use client"` only when necessary** — default to server components, add directive only for interactivity/hooks
- **Images:** always include `sizes` prop when using `fill` layout
- **Decorative images:** use `alt=""` (empty string), not descriptive text

---

## Claude Code Notes

- Run `npx tsc --noEmit` to type-check without building
- Dev server: `npm run dev` or `pnpm dev`
- Both `package-lock.json` (npm) and `pnpm-lock.yaml` exist — project uses pnpm primarily
- Path alias `@/*` maps to `src/*`
