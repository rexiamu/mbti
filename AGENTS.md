# Repository Guidelines

## Project Structure & Module Organization
This is a Next.js App Router project using TypeScript.
- `app/`: routes, layout, global styles, and metadata files (for example `app/page.tsx`, `app/layout.tsx`, `app/sitemap.ts`).
- `components/`: UI and feature components. Reusable primitives are under `components/ui/`; step flows are under `components/steps/`.
- `lib/`: business logic, utilities, type definitions, local storage helpers, and static data (`lib/data`, `lib/questions`).
- `public/`: static assets served directly.
- `docs/`: project documentation and reference notes.
Use the `@/*` import alias from `tsconfig.json` instead of long relative paths.

## Build, Test, and Development Commands
- `pnpm install`: install dependencies.
- `pnpm dev`: start local development server at `http://localhost:3000`.
- `pnpm build`: create production build (checks compile-time issues).
- `pnpm start`: run the production build locally.
- `pnpm lint`: run ESLint with Next.js core-web-vitals + TypeScript rules.

## Coding Style & Naming Conventions
- Language: TypeScript + React function components.
- Formatting style in existing code: 2-space indentation, semicolons, single quotes.
- Components and type names: `PascalCase` (for example `WelcomeStep`, `MBTIType`).
- Variables/functions: `camelCase`; constants may use `UPPER_SNAKE_CASE` when appropriate.
- Keep shared UI in `components/ui`; keep domain logic in `lib/` to avoid route-component bloat.

## Testing Guidelines
No test framework is currently configured in `package.json`, and no repo test files are present.
When adding tests:
- Prefer Vitest + React Testing Library for unit/component tests.
- Place tests as `*.test.ts`/`*.test.tsx` near source or under a `__tests__/` folder.
- Add a `test` script to `package.json` and document any coverage target in this file.

## Commit & Pull Request Guidelines
Git history is not available in this workspace snapshot (no `.git` directory), so no existing commit convention can be inferred.
Use Conventional Commits by default (for example `feat: add quick-result summary`, `fix: guard null testLength on result step`).
PRs should include:
- clear summary and scope,
- linked issue/task,
- screenshots or short recordings for UI changes,
- confirmation that `pnpm lint` and `pnpm build` pass.
