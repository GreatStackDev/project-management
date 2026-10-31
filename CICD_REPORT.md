# CI/CD Report — Project Management App

## 1. Introduction to CI/CD
- **Continuous Integration (CI):** every push / pull request automatically installs dependencies, lints and builds the code, so broken changes are caught early.
- **Continuous Deployment (CD):** when CI passes on `main`, the app is automatically deployed to production (Vercel) with no manual steps.
- Benefits: fast feedback, repeatable builds, fewer manual errors, always-live latest version.

## 2. Project overview
A React single-page **project management dashboard** (workspaces, projects, tasks, team, analytics charts, calendar, dark/light theme). Data is local mock data in `src/assets/assets.js` (a `schema.prisma` is included for a future backend). There is no backend and **no automated tests**; CI quality gates are ESLint and the Vite build.

## 3. Architecture and folder structure
```
index.html            HTML shell, loads /src/main.jsx
vite.config.js        Vite + React plugin + Tailwind v4 plugin
eslint.config.js      ESLint 9 flat config (recommended + react-hooks + react-refresh)
vercel.json           SPA rewrite (all routes -> index.html)
.github/workflows/ci-cd.yml   CI + CD pipeline
src/main.jsx          Entry: BrowserRouter > Redux Provider > App
src/App.jsx           Route table (Layout, Dashboard, Team, Projects, ProjectDetails, TaskDetails) + Toaster
src/app/store.js      Redux store (workspace, theme reducers)
src/features/         Redux slices
src/pages/            Route-level pages
src/components/       UI components
src/assets/           Mock data, images, prisma schema
```

## 4. Technologies and dependencies (from package.json)
React ^19.1.1, React Router ^7.8.1, Redux Toolkit ^2.8.2 + react-redux ^9.2.0, Tailwind CSS ^4.1.12, Recharts ^3.1.2, date-fns ^4.1.0, lucide-react ^0.540.0, react-hot-toast ^2.6.0.
Dev: Vite ^7.1.2, @vitejs/plugin-react ^5.0.0, ESLint ^9.33.0, eslint-plugin-react-hooks ^5.2.0, eslint-plugin-react-refresh ^0.4.20, globals ^16.3.0.
Runtime used: Node 22 / npm 10 (Vite 7 needs Node 20.19+).

## 5. Local setup
```bash
npm ci            # clean install from package-lock.json
npm run dev       # dev server (http://localhost:5173)
npm run lint      # ESLint
npm run build     # production build -> dist/
npm run preview   # serve dist/ locally
```

## 6. GitHub Actions workflow explanation (`.github/workflows/ci-cd.yml`)
| Part | Purpose |
|---|---|
| `on: push (main)`, `pull_request (main)`, `workflow_dispatch` | Run on main pushes, PRs into main, and manually |
| `permissions: contents: read` | Least privilege for the `GITHUB_TOKEN` |
| `concurrency` | Cancels superseded runs on the same ref |
| `actions/checkout@v4` | Fetches the code |
| `actions/setup-node@v4` (node 22, `cache: npm`) | Installs Node and caches npm downloads |
| `npm ci` | Reproducible install from the lockfile |
| `npm run lint` / `npm run build` | Quality gates; a non-zero exit fails the job |

## 7. CI implementation
Job `ci` runs on `ubuntu-latest` for every trigger: checkout → setup Node → `npm ci` → lint → build.

## 8. CD implementation
Job `deploy`:
- `needs: ci` — runs only if lint and build succeeded.
- `if: github.event_name == 'push' && github.ref == 'refs/heads/main'` — never on PRs or manual runs.
- Steps: `vercel pull` (fetch project settings) → `vercel build --prod` → `vercel deploy --prebuilt --prod`.
- Secrets (set in GitHub → Settings → Secrets and variables → Actions): `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`. They are passed via `env:`, never hardcoded or echoed.
- `vercel.json` rewrites every path to `index.html` because the app uses `BrowserRouter` (otherwise refreshing `/projects` gives a 404).

### Vercel setup
1. vercel.com → Add New → Project → import the GitHub repository (framework preset: Vite; build `npm run build`; output `dist`).
2. Create a token: Account Settings → Tokens → `VERCEL_TOKEN`.
3. Get IDs: run `npx vercel link` locally, then read `.vercel/project.json` (`orgId` → `VERCEL_ORG_ID`, `projectId` → `VERCEL_PROJECT_ID`). `.vercel` is git-ignored.
4. Optional: disable Vercel's own Git auto-deploy (Project → Settings → Git) so only GitHub Actions deploys.

## 9. Testing and verification
**Executed locally (Windows, Node 22.23.3, npm 10.9.9):**
- `npm ci` — succeeded.
- `npm run lint` — 0 errors, 5 `react-hooks/exhaustive-deps` warnings (do not fail the job).
- `npm run build` — succeeded (2809 modules; chunk-size warning only).
- Workflow YAML parsed successfully with js-yaml.

**NOT executed (need your GitHub/Vercel account):**
1. Push to `main` → Actions shows `ci` then `deploy` green; Vercel shows a Production deployment.
2. Break lint (e.g. add `const unused = 1;` in `src/App.jsx`), push → `ci` fails, `deploy` is skipped.
3. Remove the line, push → both jobs pass again.
4. Open the live Vercel URL, confirm the latest change (e.g. edit the `<title>` in `index.html`) is visible; refresh a deep route like `/projects` to confirm the rewrite works.

Diagnosing failures: Actions tab → run → failed job → expand the red step to read logs; "Re-run jobs" after fixing. Auth errors in deploy usually mean a wrong/missing secret.

## 10. Screenshots checklist
- [ ] Workflow file in GitHub
- [ ] Successful run with `ci` and `deploy` green
- [ ] Expanded logs of lint and build steps
- [ ] Repository secrets page (names only)
- [ ] Failed run with `deploy` skipped
- [ ] Fixed run green again
- [ ] Vercel production deployment
- [ ] Live site in browser (with URL)

## 11. Conclusion and lessons learned
The pipeline automates quality checks and production delivery. Lessons: commit the lockfile and use `npm ci`; gate deployment with `needs`; keep secrets in GitHub Secrets; SPAs with client-side routing need a rewrite rule; add a `.gitignore` so `node_modules` and `dist` are never committed; lint fixes must be committed or CI fails even though local runs pass. Future work: add unit tests (Vitest) as another CI gate.
