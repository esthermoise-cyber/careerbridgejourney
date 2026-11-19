# CareerBridge Journey — Handoff for the Managing Agent

Snapshot: November 19, 2026. Owner: Esther Moise.
Repo: `esthermoise-cyber/careerbridgejourney`, branch `claude/ecstatic-tesla-hfuvmj` (no pull request opened; `main` holds only the initial commit).

## 1. Status in one paragraph

A complete rebuild of the app exists in this repo and passes an end-to-end browser test, but **it is not deployed**. The old app (compiled files only, source lost) is still what runs at the public QR address. The rebuild has never run against a real Supabase database: all testing used a browser-only practice database. Deployment is blocked on Supabase access to the correct project (section 6). There is an event where people will scan the QR code and sign up; treat everything in section 7 as time-critical.

## 2. Hard rules from the owner

- **Keep the QR address working:** `https://moving-forward-pathways-demo.netlify.app/join`. It is printed and in a video.
- **Preview first.** Nothing replaces the live site until Esther approves a private preview.
- **Preserve existing accounts and saved data** from the old app.
- **Free to members, near-zero monthly cost.** No per-use paid APIs. Do not activate paid plans, buy anything, or send invitations without her approval.
- **No secrets in chat, source code, or the public bundle.** Tokens go through the secure credential form only.
- **No fabricated facts.** Never hard-code wages, tuition, deadlines, approval status or outcomes. No guarantees of admission, licensure, jobs or income.
- **Marketing consent is opt-in and separate from sign-up**, stored with version, time and source.
- **Branding:** CareerBridge Journey throughout; healthcare emphasized slightly more than other careers; **pure white page background** (her explicit request).
- **Community posting should be live**, with moderation tools working and tested.

## 3. Accounts and identifiers

| Thing | Value |
| --- | --- |
| Netlify site | `moving-forward-pathways-demo`, ID `19b731e1-799e-44b7-b3ff-debaa5ccb615`, team slug `esthermoise` |
| Netlify published deploy (old app) | `6afcd97bcd3cc8a398eed178` — keep this ID for rollback |
| Netlify custom domain | none yet |
| Supabase project the old app uses (per ChatGPT handoff) | `xdutmdveirirrvwnpwhv` ("Moving Forward Pathways") — **not reachable with the saved token** |
| Supabase project the saved token can reach | `fxqtoqemkviabjukvqwd` (a Frontline Nurse Staffing account project) — not inspected, not modified |
| Domain | `careerbridgejourney.com`, bought at GoDaddy for one year; DNS not connected |
| Mailbox | `support@careerbridgejourney.com` (Microsoft 365 Email Essentials via GoDaddy); creation pending. It does not send the app's emails. |
| Cloud environment | `careerbridgejourney` (`env_017941YErsdz81hbQ9qrDTB7`), allows `api.netlify.com`, `api.supabase.com`, `xdutmdveirirrvwnpwhv.supabase.co`, `moving-forward-pathways-demo.netlify.app`, `careerbridgejourney.com`. Netlify and Supabase tokens are saved on it as network secrets; the proxy injects them, so call the APIs with no Authorization header. |

Netlify draft-deploy hosts (`<deploy-id>--moving-forward-pathways-demo.netlify.app`) are not on the allow-list; test a production build locally against the real database instead, or ask the owner to open the preview.

## 4. What the old app is

- Deployed by CLI with no linked repo. Five serverless functions (`auth`, `contact`, `identity`, `member`, `workspace`) proxy to Supabase; the browser never held a Supabase key.
- Its routes: `/join`, `/signin`, `/nursing`, `/explore`, `/business`, `/privacy`, `/recover`, `/discover`.
- The original handoff archive (compiled client, manifests, earlier prototype, brand guide) was supplied as a zip and is **not in this repo**. Ask the owner for `CareerBridge_Claude_Handoff_2026-11-17.zip` if needed.
- Netlify site environment variables list came back empty, so the old functions' Supabase keys are not recoverable from there.
- Its database tables and how saved plans are stored are **unknown**. Inspect before promising data migration.

## 5. What the new app is

### Stack
React 19 + TypeScript + Vite single-page app. `@supabase/supabase-js` talks to Supabase directly from the browser; all protection is row level security. No serverless functions. Fonts are self-hosted (`@fontsource-variable`), icons are `lucide-react`.

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

`npm run build` type-checks then builds to `dist/`. There is no unit test suite. The end-to-end browser script used during the build lived in a temporary folder and was not committed (see section 9).

### Configuration
Two build-time variables, both public values (see `.env.example`): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.

`src/lib/backend.ts` picks the data layer:
- both variables set → live Supabase
- missing, in `npm run dev` → `localBackend.ts`, a localStorage practice database (an email starting `owner@` is treated as owner)
- missing, in a production build → the app shows an "Almost ready" notice and nothing else. This is deliberate so a misconfigured deploy never fakes accounts.

### File map
| Path | Purpose |
| --- | --- |
| `src/App.tsx` | Auth state, route guard, public/member switch, old-route redirects |
| `src/lib/types.ts` | `Workspace`, `Profile`, `Backend` interface (the full data API) |
| `src/lib/supabaseBackend.ts` | Live implementation of `Backend` |
| `src/lib/localBackend.ts` | Dev-only implementation |
| `src/lib/store.tsx` | Loads profile + workspace, debounced autosave (700 ms), save indicator, toast |
| `src/lib/progress.ts` | Points, levels, badges, feasibility check, date helpers |
| `src/lib/router.tsx` | Small history-API router |
| `src/data/pathways.ts` | 13 pathways in 3 tracks, each with Explore/Learn/Prepare/Advance steps |
| `src/data/careers.ts` | 36 careers with BLS links, 12-item interest quiz, trusted sources |
| `src/data/learn.ts` | 30 practice questions, 8 guides |
| `src/data/community.ts` | Circles, challenges, partner opportunities, consent definitions, language filter |
| `src/pages/*.tsx` | One file per screen; `Public.tsx` holds landing, sign-up, sign-in, recovery, legal |
| `src/styles.css` | All styling; brand colors are CSS variables at the top |
| `supabase/schema.sql` | Entire database: tables, policies, functions |
| `netlify.toml` | Build command, SPA redirect, security headers |

### Routes
Public: `/`, `/join`, `/signin`, `/recover`, `/reset`, `/privacy`, `/terms`. Member: `/app`, `/app/pathway`, `/app/goals`, `/app/explore`, `/app/learn`, `/app/challenges`, `/app/community`, `/app/opportunities`, `/app/profile`, `/app/admin` (owners only). Old `/nursing`, `/explore`, `/business`, `/discover` redirect to `/join` or `/app`.

### Data model (all objects prefixed `cbj_` so they cannot collide with the old app's tables)
| Table | Holds | Access |
| --- | --- | --- |
| `cbj_profiles` | name, display name, phone, pathway, points, leaderboard opt-in, `consent` JSON, `suspended` | own row; owners read all |
| `cbj_workspaces` | one JSON document per member: plan, milestones, goals, check-ins, quiz, study, challenges, schools | own row only |
| `cbj_circle_members` | circle joins | own rows |
| `cbj_posts` | circle posts | any signed-in member reads (minus authors they blocked); insert requires circle membership; delete own or owner |
| `cbj_cheers`, `cbj_reports`, `cbj_blocks` | reactions, reports, blocks | own rows; owners read reports |
| `cbj_messages` | Contact-us messages | insert own; owners read |
| `cbj_admins` | owner list | no client access at all; SQL editor only |

Functions: `cbj_feed`, `cbj_circle_counts`, `cbj_leaderboard`, `cbj_delete_my_account`, `cbj_is_admin`, `cbj_is_suspended`, and owner-only `cbj_admin_members`, `cbj_admin_reports`, `cbj_admin_messages`, `cbj_admin_set_suspended`.

Safeguards in the database: a trigger stamps post author name from the profile (cannot be spoofed), limits posting to 12 per hour per member, and blocks suspended members; another trigger stops members changing their own `suspended` flag. Profiles are created lazily on first sign-in (`loadProfile`), so accounts that already exist in `auth.users` work without migration.

### Design decisions worth knowing
- **Points are derived, not stored as a ledger.** `points(ws)` recalculates from the workspace; the result is copied to `cbj_profiles.points` for the leaderboard. A member could write a false number there (capped at 100,000). Points have no value, so this was accepted.
- **Workspace saves are last-write-wins.** Two devices editing at once can overwrite each other.
- **Opportunity interest** is stored in both the workspace (`interests`) and `profile.consent.interests` so the owner export can see it.
- **Language filter** in `community.ts` is client-side only and simple. The real control is report + owner moderation.
- **Legal pages** in `Public.tsx` were written by the build agent as plain-language drafts. They have not been reviewed by a lawyer.
- **Logo** is a redrawn SVG approximation (`LogoMark` in `components/ui.tsx`, `public/favicon.svg`). The owner has no vector original; only a small raster crop from the brand guide exists.
- Brand palette: Royal Blue `#1648A4`, Growth Green `#22A745`, Coral `#F0804A`, Sea Glass `#A9D6C9`, Deep Navy `#102A4A`. Headings Montserrat, body Inter.

## 6. The blocker

The Supabase access token saved on the environment belongs to an account that can only see project `fxqtoqemkviabjukvqwd`. Calls to `xdutmdveirirrvwnpwhv` return "does not have the necessary privileges". The owner was asked to choose:

1. Sign in to Supabase with whichever login owns "Moving Forward Pathways", generate a token there, and replace the saved one (keeps existing accounts), or
2. Start fresh in the Frontline project (old accounts and saved plans do not carry over).

**She has not answered yet.** Do not query or change the Frontline project unless she picks option 2; an attempt to inspect it without her say-so was correctly refused.

## 7. Launch runbook (once Supabase access works)

1. **Inspect, read-only.** List `public` tables, row-level-security status, `auth.users` count, and auth config (`GET /v1/projects/{ref}/config/auth`). Work out where the old app stored saved plans.
2. **Apply `supabase/schema.sql`** via `POST /v1/projects/{ref}/database/query`. It is idempotent and has never been executed on real Postgres, so read any error carefully. Then confirm every `cbj_` table shows row level security enabled.
3. **Auth settings.** Turn off email confirmation (`mailer_autoconfirm: true`) so sign-up is instant at the event; the built-in mailer sends only a few emails per hour. Set `site_url` and add redirect URLs for both `https://moving-forward-pathways-demo.netlify.app/**` and `https://careerbridgejourney.com/**`. Check `password_min_length`: the old app required 12 characters, the new form enforces 8, so align them.
4. **Get the public keys** (`GET /v1/projects/{ref}/api-keys`), build with the two `VITE_` variables, and also save them as Netlify site environment variables.
5. **Test against the real database** with two throwaway accounts: sign-up, sign-out, sign-in, wrong password, pathway save and reload, second account cannot read the first's data, join circle, post, cheer, report, block, owner removes post and pauses a member, data export, account deletion. Delete the test accounts afterwards.
6. **Draft deploy** to Netlify (zip of `dist/` to `POST /api/v1/sites/{id}/deploys?draft=true`) and send the owner the preview link.
7. **On her approval, publish.** The new deploy has no functions; that is intended. Record the new deploy ID. Rollback is `POST /api/v1/sites/{id}/deploys/6afcd97bcd3cc8a398eed178/restore`.
8. **Owner access:** after she signs in once, insert her user ID into `cbj_admins` (snippet at the bottom of `schema.sql`).
9. **Domain:** add `careerbridgejourney.com` and `www` as the Netlify custom domain and alias, give her the DNS records for GoDaddy, wait for the certificate. DNS can take hours; the event should rely on the existing QR address.
10. **Migrate old saved plans** if step 1 found any, mapping them into `cbj_workspaces.data` (shape: `Workspace` in `src/lib/types.ts`).

## 8. After launch

- Connect a transactional email service (for example Resend's free tier) as Supabase custom SMTP so password resets are reliable. A domain sender needs DNS records at GoDaddy.
- Agree a moderation routine: who checks Owner Tools → Reported posts, and how often.
- Ask her to revoke the Netlify and Supabase tokens when deployment work is finished. An earlier form entry contained her Netlify sign-in details by mistake; it was overwritten by the token, but suggest she change that password.
- She wanted GoDaddy auto-renewal turned off; still pending on her side.
- Consider linking the Netlify site to this repo for automatic deploys, and merging the branch to `main`.
- Resume upload, recruiter features, SMS, and sourced school data are intentionally not built.
- Get the Privacy Policy and Terms reviewed.

## 9. What has and has not been verified

| Area | State |
| --- | --- |
| TypeScript build | Passes |
| Full member flow in a browser, 390 px and 1366 px | Passes against the practice database: sign-up, onboarding, milestone, goals, check-in, quiz, career details, practice question, guide, challenge, leaderboard opt-in, circle join/post/cheer, link filter, opportunity interest, profile, owner tools, reload persistence, sign-out, wrong-password error. No console errors, no horizontal overflow. |
| `supabase/schema.sql` | **Never run** |
| `supabaseBackend.ts` | **Never run against Supabase** |
| Password reset and email-confirmation flows | **Untested** (need real email) |
| Cross-user isolation on the real database | **Untested** |
| Netlify deploy, security headers in production | **Untested** |
| Accessibility audit, older-phone testing | Not done |

The browser test script was temporary and not committed. Recreating it as a committed Playwright test is a worthwhile first task.
