# diandmax

Frontend-only wedding site for Maksym & Diana.

Current phase:

- invitation homepage at `/` and `/en`
- personalized invites at `/invite/[slug]`
- mock-driven live screen at `/live`
- RSVP mock submission via `localStorage`
- Storybook + Chromatic for reusable UI
- Vitest + Playwright for tests and visual regression

## Routes

| Route | Purpose |
|---|---|
| `/` | Ukrainian homepage |
| `/en` | English homepage |
| `/invite/[slug]` | Personalized invite, `noindex` |
| `/live` | Live projector, `noindex` |
| `/live?state=populated|empty|error` | Mock live state switch |

## Local setup

```bash
pnpm install
pnpm setup:browsers
pnpm typecheck
pnpm lint
pnpm test
pnpm test:storybook
pnpm test:e2e
pnpm build
pnpm build-storybook
```

Browser lanes use Playwright under the hood. Run `pnpm setup:browsers` once before `pnpm test:storybook` or `pnpm test:e2e`.

## Repository layout

- `src/` contains the application code in the FSD-hybrid structure: `app → widgets → features → entities → shared`
- `configs/<tool>/` holds canonical tool config
- `e2e/` holds route-level and visual regression specs
- `artifacts/` holds readable generated outputs and reports
- `.cache/` holds local tool state
- root keeps only thin bridge files and the main human-facing docs

## Working docs

- [AGENTS.md](./AGENTS.md) — current frontend contract and repo rules
- [CLAUDE.md](./CLAUDE.md) — mirror of the same contract

## Quality gates

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm test:storybook
pnpm test:e2e
pnpm build
pnpm build-storybook
```

## Storybook and Chromatic

```bash
pnpm storybook
pnpm build-storybook
CHROMATIC_PROJECT_TOKEN=your-token pnpm chromatic
```

The GitHub workflow in `.github/workflows/chromatic.yml` publishes Storybook from `main`, `develop`, and pull requests.
