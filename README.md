# diandmax

Frontend-only wedding invitation and event-hub foundation for Maksym & Diana.

Current phase:

- invitation homepage at `/` and `/en`
- personalized invites at `/invite/[slug]`
- mock-driven live screen at `/live`
- RSVP mock submission via `localStorage`
- Storybook + Chromatic for reusable UI
- Vitest unit tests + Storybook browser tests + Playwright visual regression baselines

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
pnpm typecheck
pnpm lint
pnpm test
pnpm test:storybook
pnpm test:e2e
pnpm build
pnpm build-storybook
```

Browser-based lanes use Playwright under the hood. Install Chromium once if your machine does not
already have it:

```bash
pnpm exec playwright install chromium
```

## Repository layout

- `configs/<tool>/` is the canonical home for real config content.
- root keeps only machine entrypoints and high-signal docs.
- `docs/architecture.md` is the deeper architecture reference.
- `.cache/` stores private local/build state.
- `artifacts/` stores readable generated outputs and reports.
- `components.json` stays in root as the shadcn project manifest.
- `.next/` remains a deliberate Next.js runtime exception because nested `distDir` breaks generated type validators.
- `tsconfig.json` stays in root as a thin shell because TS Server/editor discovery and relative path resolution are root-sensitive.
- `biome.json` stays in root as a thin shell because CLI/editor discovery is more predictable from the repository root.
- Vitest and Playwright load their canonical configs via `package.json` scripts, so they do not need root config files.

### Storybook

```bash
pnpm storybook
pnpm build-storybook
```

### Chromatic

Add the repo secret:

```text
CHROMATIC_PROJECT_TOKEN
```

Then the workflow in `.github/workflows/chromatic.yml` can publish Storybook builds.

## Current architecture

- FSD hybrid: `app → widgets → features → entities → shared`
- `entities/guest` owns personalized invite fixtures and lookups
- `entities/event` owns `/live` mock snapshots and state contracts
- `features/rsvp` owns the submission contract and mock adapter
- `shared/config` contains only true global site constants
- canonical configs live under `configs/`
- root bridge files preserve normal tool discovery without root clutter

The deleted backend stack is not part of the current runtime. Future server work must plug into the
existing frontend contracts instead of reintroducing direct DB/API logic into UI layers. That
means `drizzle.config.ts`, schema folders, migrations, backend env contracts, and backend-only
dependencies stay out of the repo until the backend phase is reintroduced on purpose.

## Test topology

- `pnpm test` runs colocated unit and pure-logic tests through the `unit` Vitest project.
- `pnpm test:storybook` runs Storybook-driven browser component tests through the `storybook` Vitest project.
- `pnpm test:e2e` runs route-level Playwright flows and screenshot baselines from `e2e/`.
- `pnpm test:coverage` collects the current unit-test coverage baseline into `artifacts/vitest/coverage/`.
- `src/testing/` is reserved for shared test mocks and helpers only. Tests themselves stay colocated with source files.
- Storybook stories stay in the default test lane; opt out later with `tags: ["!test"]` only for intentionally decorative or unstable stories.

## Hooks and CI

- `pre-commit` runs `lint-staged` only.
- `pre-push` runs `pnpm typecheck` and `pnpm test`.
- CI is layered into `quality`, `unit`, `build`, `storybook-build`, `storybook-tests`, `e2e`, and the separate `chromatic` workflow.
