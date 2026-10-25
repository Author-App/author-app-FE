# CI/CD: the three lanes

JS reaches users over the air (OTA). Native code reaches them only through a store release. Every change goes down exactly one lane.

```
 LANE 1  Pull request ─── type check, tests, "does this change native code?"
            │ merge
            ▼
 LANE 2  Main ─────────── update goes to TESTERS ─── you try it ─── Promote ─── EVERYONE
            │
 LANE 3  You push a tag ─ build iOS + Android ─── submit to stores ─── you press Release
```

## Which lane is my change?

```
        Did I change native stuff?
  (library with native code, permissions, app.json
   plugins, splash, icon, expo SDK upgrade)
                 │
        ┌────────┴────────┐
       NO                 YES
        │                  │
     Lane 2             Lane 3
   OTA, minutes       store release, days
```

You do not have to guess: the **Native Check** comment on every PR tells you.

## Workflows

| File | Lane | Runs on | Does |
|---|---|---|---|
| `pr-check.yml` | 1 | PR, push | type check, tests, coverage |
| `test.yml` | 1 | PR, push | tests |
| `native-check.yml` | 1 | PR to main | compares the Expo fingerprint of the PR and its base, comments, **fails** if native changed without a version bump |
| `eas-update.yml` | 2 | push to main | publishes the update to the `preview` branch (testers only) |
| `eas-promote.yml` | 2 | button | copies the latest `preview` update to `production` (everyone), same bundle |
| `eas-build.yml` | 3 | `v*` tag, button | checks tag = app.json version, builds both platforms, submits those exact builds, builds the matching tester binary |
| `e2e.yml` | | nightly 06:00 UTC, button | Detox on an iOS simulator |

## How testers-first works

Two kinds of the app exist on phones. They are identical except for one setting: which **channel** they listen to for updates.

```
 Your phone:    preview build      listens to channel "preview"      ◄── every merge lands here
 Store users:   production build   listens to channel "production"   ◄── only Promote lands here
```

- A merge publishes to `preview`. Only phones with the preview build get it.
- You open the app on your phone, it downloads the update (close and reopen once if it does not show).
- Looks good: **Actions > EAS Promote > Run workflow**. The same update is copied to `production`.
- Something is broken: do nothing. Fix it in a new PR. Store users never saw it.

An update only reaches a phone whose app version matches. If `app.json` says `1.1.0` and no tester phone has a `1.1.0` preview build, `eas-update.yml` fails and tells you to build one.

## Doing a store release (Lane 3)

1. In the PR: bump `version` in `app.json` (for example `1.1.0`). Native Check reminds you.
2. Merge. Lane 2 will fail its guard for this merge, because no `1.1.0` tester build exists yet. That is expected.
3. On an up-to-date main:
   ```sh
   git tag v1.1.0
   git push --tags
   ```
4. `eas-build.yml` builds, submits to App Store Connect and the Play internal track, and builds a `1.1.0` preview binary for your phone.
5. Install the new preview build on your phone (link in the EAS dashboard).
6. In App Store Connect and Play Console, send the build for review and release it.

The tag also marks exactly what is in the stores, so a hotfix can start from it.

## Hotfix for the live version

```
 JS only?  ── yes ─► git checkout -b hotfix v1.1.0 ─► fix ─► merge to main ─► testers ─► Promote
           └─ no ──► Lane 3 with version 1.1.1
```

## First-time setup

1. **Secrets** (repo settings): `EXPO_TOKEN`, `GOOGLE_SERVICE_ACCOUNT_JSON`. iOS submission uses the App Store Connect API key stored in EAS.
2. **A tester build for the current version.** Run **Actions > EAS Build** with profile `preview`, install it on your phone. iOS internal builds need your device registered: `eas device:create`.
3. Until a preview build of the current version exists, `eas-update.yml` fails on every merge. That is the guard working.

## Required secrets

| Secret | Used by |
|---|---|
| `EXPO_TOKEN` | every EAS workflow |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Play submission in `eas-build.yml` |
| `EXPO_PUBLIC_API_BASE_URL`, `EXPO_PUBLIC_STRIPE_*`, `E2E_EMAIL`, `E2E_PASSWORD` | `e2e.yml` |
