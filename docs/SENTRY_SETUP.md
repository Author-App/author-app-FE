# Sentry

How this app is monitored in production, and how to use it.

Org `swift-reflex`, project `stanley-paden`.

---

## 1. The mental model

Sentry gives you four separate things. Most people use only the first and then
wonder why it is too noisy to read.

| Signal | Answers | Where in Sentry |
|---|---|---|
| **Issues** | What broke, for whom, with what trail before it | Issues |
| **Release health** | Is the build I just shipped worse than the last one | Releases |
| **Tracing** | What is slow, and on which screen | Insights |
| **Alerts** | Tells you, so you do not have to go and look | Alerts |

All four depend on one rule:

> **An event is something you would change code to prevent.**

Everything else is a breadcrumb, a tag, or a product metric.

Before this rule was applied, the project held 200 events and 7 of them were
defects. The other 193 were users typing wrong passwords and the app logging its
own boot. That is not monitoring. That is a log file nobody reads.

---

## 2. What goes to Sentry, and what does not

The decision lives in one place: `handleApiError` in
`src/services/error.service.ts`.

| Situation | Status | Sent? | Why |
|---|---|---|---|
| No network, socket dropped, DNS fail | `FETCH_ERROR` | No | The phone's problem. The toast says "No internet connection." |
| Request timed out | `TIMEOUT_ERROR` | No | Same. Nothing in the code to fix. |
| Wrong password | `401` | No | The product worked. The server said no. |
| No permission | `403` | No | Same. |
| Email already registered | `409` | No | Expected outcome of signing up twice. |
| **Client sent a bad payload** | `400` | **Yes** | Our validation let something through. A defect. |
| **Not found** | `404` | **Yes** | Usually a bad id built by our code. |
| **Server broke** | `5xx` | **Yes** | Backend or infra. Someone must know. |

Real evidence for the `400` row, from this project:

```
STANLEY-PADEN-Q   400   "Last name is required"   auth/signup
```

The Yup schema let an empty last name reach the server. That is exactly the kind
of bug this tool exists to catch, and it would have been filtered away if the
rule had been "ignore all 4xx".

### Severity

Set in `captureApiError`:

```ts
level: statusCode && statusCode >= 500 ? 'error' : 'warning',
```

So an alert can say "page me on `error`, not on `warning`".

---

## 3. The flow

```
  user taps something
        │
        ├──────────────► breadcrumb                (trail, never an event)
        │                navigation, payment step, OTA boot
        │
   request fires
        │
   ┌────┴──────────────────────────────────┐
   │                                       │
 no answer                           server answered
 FETCH_ERROR / TIMEOUT_ERROR               │
   │                      ┌────────────────┼────────────────┐
   │                 401 / 403 / 409    400 / 404          5xx
   │                      │                │                │
   ▼                      ▼                ▼                ▼
"No internet."        toast only        WARNING           ERROR
toast only            no event           issue             issue
no event                                  │                 │
                                          └────────┬────────┘
                                                   │
                  every issue carries:             │
                    release   1.3.0+21             │
                    dist      21                   │
                    env       preview | production │
                    user      id, email            │
                    tags      ota.update_id, endpoint, status_code
                    fingerprint  api-error : endpoint : status
                    breadcrumbs  last 100          │
                                                   ▼
                                              Alert fires
```

---

## 4. Where to check what

| You want to know | Go to | Filter / field |
|---|---|---|
| Did the release I just shipped break something | **Releases** → the version | crash-free sessions, crash-free users |
| What is broken right now | **Issues** | `is:unresolved environment:production` |
| Is this real users or just me | **Issues** | switch `environment` between `preview` and `production` |
| Which OTA update introduced it | an issue → **Tags** | `ota.update_id` |
| Did checkout fail | **Issues** | `type:payment_error` or `type:stripe_error` |
| Which endpoint is failing | **Issues** | `type:api_error endpoint:<name>` |
| Which screen is slow | **Insights** → Mobile Screens | |
| What the user did before it broke | an issue → **Breadcrumbs** | |
| Is a bug one person or everyone | an issue header | events vs **users** |

---

## 5. Environments

The environment is the **EAS channel**, not `__DEV__`.

```ts
function resolveEnvironment(): string {
  if (__DEV__) return 'development';
  try {
    return Updates.channel || 'unknown';
  } catch {
    return 'unknown';
  }
}
```

| Channel | Environment | Who |
|---|---|---|
| `preview` | `preview` | testers, internal builds |
| `production` | `production` | store users |

This matters because a preview build is **not** `__DEV__`. Before this change
every tester error landed in `production` and there was no way to tell a real
user's crash from your own.

The `try/catch` is not decoration. `OTAUpdateTracker` records a crash caused by
module-level native access during OTA bundle load. `initSentry` runs even
earlier, so it must not be able to throw.

### Trace sampling

```ts
tracesSampleRate: environment === 'production' ? 0.2 : 1.0,
```

Few testers, so keep everything from them. Production is sampled to stay inside
quota.

---

## 6. Grouping, and why fingerprints matter

Sentry groups events by **stack trace** unless told otherwise. The stack changes
with the caller, so the same broken endpoint became several issues:

```
API Error: auth/login   →  STANLEY-PADEN-3   (41 events)
API Error: auth/login   →  STANLEY-PADEN-Z   (1 event)
API Error: auth/login   →  STANLEY-PADEN-R   (5 events)
```

One bug, three rows, none of them showing the real count. Fixed by setting the
grouping key explicitly in `captureApiError`:

```ts
fingerprint: ['api-error', endpoint, String(statusCode ?? 'unknown')],
```

Now one endpoint plus one status is always exactly one issue, whoever called it.

**Note:** changing a fingerprint retires the old issues. They can never receive a
new event again. Expect a fresh set of issues after the next release.

---

## 7. Breadcrumbs vs events

A breadcrumb is free and attaches to whatever error comes next. An event is a
row in your inbox forever.

The mistake this project made: `OTAUpdateTracker` called `captureMessage` with
the update uuid inside the message. Unique message means unique issue, so **every
OTA update created a new issue, permanently**. Five of fifteen issues were that
one line.

The thirty lines above it already did the right thing:

```ts
sentryService.setTags({ 'ota.update_id': context.updateId, ... });
sentryService.setContext('ota_update', context);
sentryService.addBreadcrumb({ category: 'ota', message: 'App launched', ... });
```

A tag lets you filter real issues by which update introduced them. An event just
sits there. The `captureMessage` was deleted.

**Rule:** before adding a `captureMessage` or `captureError`, ask what code change
the event would cause. If there is no answer, it is a breadcrumb or a tag.

---

## 8. Operating it

### Triage workflow

| Action | When | What Sentry does |
|---|---|---|
| **Resolve** | you shipped a fix | closes it |
| **Resolve in next release** | you shipped a fix | closes it, and **reopens it as a regression** if it comes back |
| **Archive** | nothing to fix, or dead history | hides it, no regression tracking |
| leave unresolved | you still owe it a look | stays in the inbox |

Always prefer **Resolve in next release** over plain Resolve. It is the only one
that catches a fix that did not hold.

The inbox must be reachable to zero. An inbox you cannot empty is an inbox you
stop reading. The term is **alert fatigue**.

### Alert rules

Sentry's default rule emails on every new issue, and it is on.

It did not help. The Firebase push bug raised an issue, sent an email, and still
sat unseen for weeks, because 13 of the 15 issues were OTA boot logs and wrong
passwords. An alert that fires on noise trains you to ignore the alert. The fix
was never a better rule, it was sending fewer events.

Worth adding once there is real traffic: a rule for an issue affecting more than
10 users in an hour, routed somewhere louder than email.

---

## 9. Source maps

Without these, every stack frame in production reads `index.android.bundle:1:48221`.

Two separate paths, and both must work:

| Bundle | Uploaded by | Where |
|---|---|---|
| Native build | the Sentry Expo plugin, during EAS Build | `app.json` plugin block, `uploadSourceMaps: true` |
| OTA update | the workflow, after `eas update` | `.github/workflows/eas-update.yml` |

`eas update` does **not** upload source maps. Without the workflow step, every
crash that arrives through an OTA is minified while native-build crashes look
fine. The step:

```yaml
- name: Upload source maps to Sentry
  env:
    SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
  run: pnpm exec sentry-expo-upload-sourcemaps dist
```

Org and project come from the `app.json` plugin block, so only the token is needed.

The prerequisite is `getSentryExpoConfig` in `metro.config.js`. That is what
writes the debug IDs matching a bundle to its map.

**Never set `release` manually in `Sentry.init`.** The SDK sets it from the build
(`com.swiftreflex.stanleypaden@1.3.0+21`) and that exact string is what the
uploaded maps are filed under. Overriding it silently breaks symbolication.

---

## 10. Files

| File | What |
|---|---|
| `src/services/sentry/initSentry.ts` | `Sentry.init`, environment, sampling, filters |
| `src/services/sentry/SentryService.ts` | the singleton every caller uses |
| `src/services/sentry/SentryErrorBoundary.tsx` | catches React render errors |
| `src/services/sentry/SentryNavigationTracker.tsx` | registers the nav container so traces start |
| `src/services/sentry/SentryUserSync.tsx` | `setUser` on login, `clearUser` on logout |
| `src/services/error.service.ts` | **the send / do-not-send decision** |
| `src/components/providers/OTAUpdateTracker.tsx` | OTA tags and context on every event |

Wired in `app/_layout.tsx`: `initSentry()` at module scope, root wrapped in
`sentryWrap` and `SentryErrorBoundary`, the three tracker components inside.

### Service methods, and who calls them

| Method | Calls outside `sentry/` |
|---|---|
| `addBreadcrumb` | 19 |
| `trackPaymentStep` | 14 |
| `captureError` | 6 |
| `captureStripeError` | 4 |
| `capturePaymentError` | 3 |
| `setContext` | 2 |
| `setTags` | 1 |
| `captureApiError` | 1 (`error.service.ts`) |
| `setUser` / `clearUser` | `SentryUserSync` |

Anything that drops to zero callers gets deleted. `useSentry.ts` (202 lines),
`startTransaction`, `withPerformance`, `trackNavigation` and `captureMessage`
were all removed this way.

`trackNavigation` was not just unused, it was a **duplicate**: the Sentry React
Navigation integration already writes a `navigation` breadcrumb on every route
change.

---

## 11. Config reference

```ts
Sentry.init({
  dsn: SENTRY_DSN,
  environment,                                     // EAS channel
  tracesSampleRate: environment === 'production' ? 0.2 : 1.0,
  sendDefaultPii: true,
  integrations: [navigationIntegration],
  beforeSend,                                      // strips Authorization headers
  beforeBreadcrumb,                                // drops touch breadcrumbs
  ignoreErrors: [...],
});
```

**`sendDefaultPii: true`** only controls IP inference (`infer_ip: 'auto'`).
Turning it off looks more private but breaks "users affected" counts on crashes
from people who are not logged in, which is the number that tells you whether a
bug hit one person or everyone. Sentry's server-side scrubbing already filters
sensitive fields; payloads arrive showing `"message":"[Filtered]"`.

**`beforeBreadcrumb`** drops `category: 'touch'`. React Native touch breadcrumbs
name the rendered element, never the label, so a trail reads
`ExpoLinearGradient, ExpoLinearGradient, TextInput` and tells you nothing.

**`ignoreErrors`** only matches an event's **final** message. `captureApiError`
rewrites errors to `API Error: <endpoint>` before Sentry sees them, so network
errors could never be caught by that list. They are filtered at the call site in
`handleApiError` instead.

**`initSentry` is idempotent.** The root layout module was evaluated twice in
production, starting two clients and sending every breadcrumb twice. A
module-level `hasInitialized` guard fixes it regardless of cause.

**Not enabled, on purpose:**

- `attachScreenshot`, `attachViewHierarchy` — both touch native, and Session
  Replay already had to be disabled for crashing under the New Architecture. Add
  when there is a crash that cannot be explained without them.
- Session Replay — see above.
- `enableLogs` — nothing uses `Sentry.logger`.

To send events from a local build, flip `ENABLE_IN_DEV` in `initSentry.ts`.

---

## 12. Known state

Cleaned up on 2026-10-31: 13 issues archived, 1 resolved in next release, 1 left
open.

| Issue | State | Why |
|---|---|---|
| `STANLEY-PADEN-N` | resolved in next release | `Default FirebaseApp is not initialized`. Android push silently dead. Fixed by `googleServicesFile` in `app.json`, which is native config, so it only reaches users through a store release. |
| `STANLEY-PADEN-Q` | **open** | `400 "Last name is required"` on signup. Client validation gap, still needs a look. |
| 13 others | archived | OTA boot logging and expected auth rejections. Dead history. |

---

## 13. Verifying a change to this setup

After the next build ships, in order:

1. The environment dropdown offers **preview** and **production** as two choices.
2. Type a wrong password on purpose. **No new event appears.**
3. Ship an OTA. **No new "OTA update launched" issue.** Instead open any issue
   and find `ota.update_id` under Tags.
4. Insights shows a non-zero trace count.
5. Force a crash in an OTA build and confirm the stack shows real file paths, not
   `index.android.bundle`.
