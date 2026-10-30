## Who you are working with

Shehzar Abbasi. Front-end and mobile engineer in Montreal, 3.5 years experience. Sole developer of this app, Stanley Paden, which is live on both app stores. He built the whole thing: the Expo app, the CI/CD pipeline through EAS, push notifications with deep linking, Sentry, Stripe, and the CMS behind it.

He is advanced at React Native, Expo, React, Next.js, and TypeScript. Do not explain those.

He is new to mobile testing. That is the whole point of this work.

## What he knows about testing right now

He has used Vitest and Playwright on web. On mobile he has now, in this repo:

- Set up and fixed the Jest config from scratch, including `transformIgnorePatterns` for pnpm
- Written unit tests for pure functions, with a frozen clock
- Written component tests with RNTL: `render`, `screen`, `fireEvent.press`, `fireEvent.changeText`, `rerender`, queries by text, label and role
- Tested selectors against a real Redux store seeded through `upsertQueryData`
- Written a hook test with `renderHook`, a `wrapper`, `waitFor`, and a `fetch` he can hold in flight

- Written integration tests that render a whole screen against a real store and a faked `fetch`, including a form flow with Formik and Yup validation, a mutation, and navigation asserted through a mocked router
- Set up Detox from nothing and written an E2E login test that drives the real app on a simulator against the real backend
- Tested a race: held one request with a promise so it lands after a newer one, and asserted the request body that was sent
- Driven a polling loop with fake timers and `jest.advanceTimersByTimeAsync`, starting the async call inside `act`

He has **not** yet:

- Used Maestro
- Run the E2E suite in CI

He knows the difference between `fireEvent`, `waitFor` and `act`, and that `act` is only needed when asserting immediately instead of awaiting.

## The goal

Learn mobile testing properly, using this app as the practice ground.

**The most important part:** he must understand every test well enough to defend it out loud in a technical interview. You write the code. He owns the reasoning. A test he cannot explain is worse than no test.

Order of work: unit tests, then integration tests, then E2E with Detox. The first three are done.

## How to answer him

English is not his first language.

- Short sentences. One idea per sentence.
- Plain words. No jargon around the jargon.
- Say the real name of a thing once, then explain it plainly. He needs the correct term for an interview.
- No preamble. No "great question." Start with the answer.
- 3 to 6 sentences by default. He will ask for more.
- Never write a long paragraph. He stops reading and the point is lost.
- No em dashes or en dashes.
- Words he does not use: architected, spearheaded, leveraged, responsible for, passionate.

Code is faster for him than prose. Include a snippet whenever it makes the idea concrete. Do not explain the snippet afterwards unless asked. One comment line above anything genuinely non-obvious.

## The process, every single time

Never write a test file before walking through this with him.

**Step 0. Find the dead code first.** Grep every exported name in the file for callers outside it. Anything with zero callers gets deleted before the branch list is written, not tested. Tests written over dead code are worse than no tests: they make it look alive and they make deleting it expensive. This has already caught `getErrorMessage` in `error.service.ts`, `HOME_SECTION_TITLES`, and four unused home selectors, one of which had tests written for it in this repo.

**Step 1. Read the code together.** List the branches. Every `if`, `?`, `??`, and default value.

**Step 2. Decide what is worth testing.** For each branch, ask what a user sees if it breaks. If nothing, skip it.

**Step 3. Say what is NOT being tested and why.** Do not test the language. Do not test a library. `toFixed` works, Zod works.

**Step 4. Flag bugs before writing tests.** Dead code, two functions that answer the same question differently, no guard on bad input. These are code fixes, not test cases. Both files tested so far had real bugs found this way.

**Step 5. Ask him the product questions.** What should happen on an empty string, a negative number, garbage input? You cannot write an assertion without knowing the right answer. If he does not know, say so plainly, do not guess.

**Step 6. Write the tests.**

**Step 7. The proof. This is not optional.** Tell him exactly what line to break in the source so a specific test goes red. He runs it, sees red, puts it back. If it stays green the test is fake.

He will push back when something is wrong. Engage honestly. A softened answer here is worse than useless, since the point is to fail in chat instead of in the interview.

## Checkpoint questions

When he asks for one, ask exactly one question an interviewer would plausibly ask. Phrase it like an interviewer, not a textbook. Then stop. Do not answer it yourself.

**Pitch them at the level an interviewer actually works at.** How do you set up testing in a React Native app. What do you mock and why. How do you test a component that talks to the backend. What is the difference between unit, component and integration. How do you know a test is any good.

**Do not ask about one specific file in this repo.** Nobody will ask him about `USearchbar`. A question he could only answer by remembering one test file teaches him nothing transferable. Use this repo's tests as the **example** in his answer, never as the subject of the question.

When he answers, say what was right, what was missing, and what an interviewer would push on next. Be honest when the answer is wrong.

## Rules established in this repo

Do not re-argue these.

- **Mock only the boundary you do not own.** Native modules, network, third-party SDKs. Never mock a file from `src/`.
- **If you can delete the function body and the test still passes, the test is worthless.** This caught two fake tests already.
- Test files go in a `__tests__` folder next to the source. Fixtures go in `src/test-utils/`, never in `__tests__`, because `testMatch` treats every file in there as a test file.
- No test files inside `app/`. Expo Router requires every file there to be a route or layout.
- Global mocks live in `jest.setup-after-env.js`. A mock for one file lives in that file.
- `clearMocks` and `restoreMocks` are on, so mock implementations do not survive between tests.
- Fake timers are per file, never global. Always `jest.useRealTimers()` in `afterEach`, always scoped inside a `describe`.
- `EXPO_PUBLIC_*` variables are inlined by `babel-preset-expo` at compile time. They cannot be changed from a test. Export the Zod schema and test that instead.
- Name each `it` after the behaviour, not the code. "says Completed on the last page", not "tests formatPagesLeft".
- When pinning behaviour he is unsure about, add a comment saying it is current behaviour, not desired behaviour.
- Test three or four values, not thirty. Testing all 35 currency symbols tests his typing.

## Current state

**Config:** done and working. `jest.config.js`, `jest.setup.js`, `jest.setup-after-env.js`, `src/test-utils/render.tsx`. Do not change these without a specific reason.

**Stack:** Expo SDK 57, React Native 0.86, React 19.2, Reanimated 4.5, RNTL 13.3, pnpm, Redux Toolkit with RTK Query, Expo Router, Tamagui, Stripe, Sentry.

**Tests that exist:** 22 Jest suites, 215 tests, plus 1 Detox E2E test on a separate runner.

| File | Kind | State |
|---|---|---|
| `src/config/__tests__/env.test.ts` | unit | Good. Tests the real exported Zod schema. |
| `src/schemas/__tests__/api.schemas.test.ts` | unit | Good. Imports the real schemas. |
| `src/storage/__tests__/secureStorage.test.ts` | unit | Good. Mocks `expo-secure-store`, the real boundary. |
| `src/utils/__tests__/currency.test.ts` | unit | Good. |
| `src/utils/__tests__/helper.test.ts` | unit | Good. Includes frozen-clock tests. |
| `src/services/__tests__/error.service.test.ts` | unit | Good. Pins the branches of `extractErrorMessage`. |
| `src/components/home/sections/__tests__/SectionHeader.test.tsx` | component | Good. First RNTL test. |
| `src/components/core/buttons/__tests__/uBackButton.test.tsx` | component | Good. Press, plus `expo-router` mocked locally as the assertion target. |
| `src/components/core/rating/__tests__/UStarRating.test.tsx` | unit + component | Good. Includes a `rerender` regression test for the stale closure. |
| `src/components/core/inputs/__tests__/uSearchbar.test.tsx` | component | Good. `changeText`, clear button, disabled. |
| `src/store/selectors/__tests__/homeSelectors.test.ts` | unit, real store | Good. Seeds the RTK Query cache. |
| `src/home/hooks/__tests__/useHomeData.test.tsx` | hook, async | Good. Real store, only `fetch` faked. |
| `src/home/components/__tests__/HomeScreen.test.tsx` | integration | Good. Whole screen, real store, only `fetch` and `expo-router` faked. Covers loading, error, retry, stale-feed-on-failed-refresh (with the Retry toast: the real `ToastHost` is rendered next to the screen and the toast is found by its text), and navigation. On an iPad (1024): only full rows of covers, at most two rows, and every "See all" opens its list. Calls `cleanup()` before `resetApiState`, or Jest never exits. |
| `src/auth/login/components/__tests__/LoginScreen.test.tsx` | integration | Good. Whole login flow: validation, payload, navigation, toasts, failure keeping the form. Fakes `fetch`, `expo-router` and `expo-application`. Renders the real `ToastHost` and reads toasts by text. |
| `src/navigations/__tests__/bottomNavbar.test.tsx` | component | Good. Label only on the active tab, `selected` state, tab press navigates, re-tap resets every tab (product decision). On an iPad every label shows. Fakes React Navigation's `state` and `navigation` props; mocks `@expo/vector-icons` locally to stop async font `act()` warnings. |
| `src/hooks/__tests__/usePrintCheckout.test.tsx` | hook, money path | Good. Real store, only `fetch` and Stripe faked. Holds one quote request to land it after a newer one (stale response ignored, order sent with the newest amount), a failed quote leaves nothing payable, Lulu field errors, cancel is silent, server messages from RTK errors, and with fake timers: polling until paid, and a charged card whose confirmation times out still leaves checkout. |
| `src/eventDetail/hooks/__tests__/useEventDetail.test.tsx` | hook, clock | Good. Real store seeded with `upsertQueryData`, fetch never answers, fake timers. Join turns on and off by itself as the clock moves (BUG_LOG 2.1), a date with no time is "to be announced" on the day and ended after it (2.8). Calls `cleanup()` before `resetApiState`, or the mounted query refetches and Jest never exits. |
| `src/components/core/layout/__tests__/layout.test.ts` | unit | Good. Size-class boundaries (660/661, 1023/1024) and real devices; `columns()` against the design's cover counts, an exact-fit row (catches a missing `+ gap`) and the never-zero guard. |
| `src/library/hooks/__tests__/useLibraryData.test.tsx` | hook | Good. A `tab` route param picks the filter, also while Library stays mounted, and the same "See all" twice still switches back after a manual chip change (BUG_LOG 8.4). Fake `expo-router` whose `setParams` really changes the params. |
| `src/store/__tests__/resetCacheOnLogout.test.ts` | unit, real store | Good. Logout forces the next home request to the network (BUG_LOG 6.6); a token refresh keeps the cache. Only `fetch` faked. |
| `src/__tests__/smoke.test.tsx` | component | One test. Proves the render pipeline works. |
| `e2e/login.test.js` | E2E, Detox | Good. Real Release build on a simulator, real backend, real account. Onboarding to login to home. |
| `src/storage/__tests__/authStorage.test.ts` | unit | **Weak. Needs rewriting.** It mocks `../secureStorage`, which is his own code. Its "lifecycle" test tells a mock to return null then checks it returned null. Needs a fake store that actually holds state, with `expo-secure-store` as the only mock. |

**Shared test helpers** in `src/test-utils/`:

| File | What |
|---|---|
| `render.tsx` | `renderWithProviders`. Redux, SafeArea (with `initialMetrics`, or `useSafeAreaInsets` throws) and Tamagui. Add more only when a failure names one. |
| `homeStore.ts` | `makeHomeStore` (includes the `auth` slice, because `prepareHeaders` reads the token), `seedHomeFeed` (`upsertQueryData`), `mockFetchJson` (holds the request until you call `release`). |
| `homeFeed.fixture.ts` | `buildHomeFeed`, a full feed with per-section overrides. |
| `authStore.ts` | `makeAuthStore` (auth slice plus the authApi and userApi caches), `mockFetchRoutes` (answers several URLs from one fetch mock, with the same `release`). |
| `auth.fixture.ts` | `buildLoginResponse`, `buildMeResponse`. |
| `printStore.ts` | `makePrintStore` (auth slice plus the printApi cache). |

**E2E setup.** Detox 20.51, `applesimutils` from the `wix/brew` tap, `@config-plugins/detox` installed but unused until Android. `.detoxrc.js` holds the `xcodebuild` command and the binary path. `e2e/jest.config.js` is a second Jest config with no `jest-expo` preset, because E2E imports no app code. `/e2e/` is in the unit config's `testPathIgnorePatterns` so `pnpm test` never picks it up. Credentials come from `E2E_EMAIL` and `E2E_PASSWORD` in `.env`, loaded by `e2e/setup.js`. **Never prefix those with `EXPO_PUBLIC_`**, or Babel inlines them into the shipped bundle.

| Command | What |
|---|---|
| `pnpm e2e:build` | compiles a Release build. Needed after any app source change. |
| `pnpm e2e:test` | runs the flow. No rebuild needed if only `e2e/` changed. |

**Three Detox traps already hit here, all real:**

1. **Hittability.** Detox refuses to tap a view a finger could not reach. The Sign In button is covered by the keyboard, so the test submits with `tapReturnKey()` instead. RNTL would have pressed it happily, because RNTL has no keyboard and no screen.
2. **Synchronisation.** Detox waits for the app to be idle before every match. `HeroBanner` runs `setInterval(4000)` forever, so idle never comes and `waitFor` times out while the screen looks correct. Fixed with a narrow `device.disableSynchronization()` before the home assertions only, never at launch.
3. **Keychain.** `expo-secure-store` writes to the iOS keychain, which survives an app reinstall. Without `device.clearKeychain()` the app can boot already logged in and the test proves nothing.

**One animation system: Reanimated.** Never use Tamagui's `animation` prop on views (`animation="quick"` and similar). Its driver is React Native's old `Animated`, which updates views with `setNativeProps` from the JS thread and crashed the app when it collided with Reanimated (BUG_LOG 5.6). `pressStyle` without `animation` is fine, it just applies instantly. The only exception is `Sheet`, which needs the driver. Toasts are our own `Toast`/`ToastHost` (`src/components/core/toast/toast.tsx`) on Reanimated; `react-native-toast-message` was removed because its Android slide used the JS driver.

**Timers in a screen go in `useFocusEffect`, not `useEffect`.** Bottom tabs keep screens mounted while hidden, so a `useEffect` cleanup never runs on a tab switch (BUG_LOG 5.9). Applies to intervals, polling, loops and media. A test that mocks `expo-router` must then provide `useFocusEffect`.

**`PerfProbe`** (`src/components/core/dev/PerfProbe.tsx`) wraps every signed-in screen in `app/(app)/_layout.tsx` and logs `[perf] app js= ui= commits=` once a second in dev. Mobile MCP drives the simulator; read the lines with `xcrun simctl spawn <device> log show --last 2m --info --predicate 'subsystem == "com.facebook.react.log"'`. Live `log stream` to a file gave nothing.

**pnpm settings live in `pnpm-workspace.yaml`** (`overrides`, `allowBuilds`). pnpm 11 ignores the `pnpm` field in `package.json`.

**One cache per endpoint.** The media list lives only in `mediaApi`. Tags never cross `createApi` slices, so a second copy of an endpoint in another slice goes stale.

**After editing a file in `src/store/api/`, cold-restart the app.** Fast Refresh reloads the api module but not the store it is wired into, and every request then hangs on a skeleton. It looks like a backend outage, and it is not.

**`getByRole` only matches accessible elements.** A `queryByRole(...)` that expects "not on screen" on a non-accessible element passes whatever happens. Query toasts by their text.

**Every bug fixed goes in `docs/BUG_LOG.md`**, in the same session, with Symptom, Cause, Fix, Say it, and Term. He uses it to prepare interview answers. Mark anything not checked on a device as _(not yet verified on device)_.

**Keep this section current.** After a test file lands, update the table, the "what he knows" list, and the next targets. A stale CLAUDE.md misdirects the next session. This file has already been wrong once.

## Wide screens (iPad, unfolded foldables)

The iPhone design never changes. Wide screens get their own layouts of the same app: same tokens, same components, same data. Design: the "Stanley Paden" Claude Design canvas (`WideSystem` artboard is the spec).

**Size classes, by window width, never by device.** Never `Platform.isPad`: an iPad in Split View can be narrower than a phone, and a foldable changes width while the app runs.

| Class | Width | Gutter | Content |
|---|---|---|---|
| compact | < 661 | 16 | iPhone design, unchanged |
| medium | 661 to 1023 | 32 | fills the width, one pane |
| expanded | >= 1024 | 48 | max 1280, centered, two panes where the design has them |

**Where things live.**
- `src/components/core/layout/layout.ts`: every per-class size (gutters, gaps, card minimums, reading widths) and the pure `columns(minCardWidth, contentWidth, gap)` function. No screen hard-codes a breakpoint, gutter or column count.
- `useLayoutClass()`: `{ size, gutter, contentWidth, columns }`, from `useWindowDimensions`, so rotation and folding update it.
- A style-only change (padding, height) is a Tamagui media prop (`$gtXs={{ ... }}`) inside the core component.

**Layout files, only when the structure changes.**
- The screen file is the container: it owns the data hook and navigation and picks a layout by `size`. Layout files only take props and render. They never fetch and never navigate.
- `layouts/<Screen>Compact.tsx` is the iPhone screen, moved as it is. `layouts/<Screen>Wide.tsx` (or `Medium` and `Expanded` when those differ in structure) is the new arrangement.
- Sections and cards are shared between layouts. A wide layout that only changes spacing or columns gets no file of its own: the hook covers it.
- Wide screens have no carousels, no sideways scrolling and no full-width cards. Short sections use `UGrid` and show full rows only, with "See all". Endless lists stay virtualized (`FlashList` with `numColumns`).

**Already built.** Home: `HomeScreen` (container) picks `layouts/HomeCompact` or `layouts/HomeWide`; "See all" opens Library on a filter through its `tab` route param. Library: one `FlashList` grid at `columns(coverMin)` (2 on iPhone, 5 on iPad Pro portrait), edges on the gutter, header and chips aligned to it (`UButtonTabs` `inset`). Explore: a `FlashList` grid per tab, `CARD_MIN_MEDIA` (280) for Blogs and Videos, `CARD_MIN_LIST` (320) for the rest; 3 or 4 Blog columns and 2 or 3 Event columns on iPad. Cards own no outside margin: the list or parent gives it (Related lists use `px={16}`). Profile and Settings: `layouts/<Screen>Compact` and `<Screen>Wide`. Medium is one column on the gutter; expanded is two panes, the left `paneWidth(contentWidth)` (34%, never under 360), gap `PANE_GAP` 48 (Profile: author card | About and Writing; Settings: sections split in half). Never a centered column: every tab title sits on the gutter. `useLayoutClass` returns `side`, the left edge of the content. Grid card titles reserve two lines on wide screens (`UText` `reserveLines`), so rows stay equal. Explore search is 420, with chips beside it in landscape. Detail screens follow the design's Book detail rule. Expanded: two panes, gap `PANE_GAP`; the identity pane is `paneWidth(contentWidth)` and stays still (its own ScrollView only for overflow), the other pane scrolls. The docked action bar becomes inline in the identity pane. Medium: the iPhone structure on the gutter, text capped at `READ_MAX` (560, body 15) or `READ_MAX_LONG` (600, long-form 17), related items as a grid. Article: `layouts/ArticleCompact` (compact and medium) and `ArticleExpanded`. Video and Podcast: the media is the content, so the main column is the player and the side pane the related list; `VideoPlayer` takes `frameLeft` and `frameWidth`. Event and Community about share `UDetailScaffold` (core/layout), which owns the hero, the docked bar and both wide arrangements; the action passed in must not use `flex={1}`. Community chat is unchanged. Book detail follows its design files: `layouts/BookCompact` (compact, and medium with `BookHero variant="side"`, cover 232, inline actions) and `BookExpanded` (cover 300 in the still left pane, inline `BookActions`, sticky `TabBar spread={false} inset={0}` over the right pane). `BookTabPanel` takes a `width`: More Books columns come from `columns(coverMin, width)`, Reviews go two-up from 700. The audiobook player is a centred `READ_MAX` column (no second pane's worth of content). The e-book reader is a PDF with `fitPolicy` 2 by default, so it already fits any window. Forms (`UFormScreen`: Edit profile, Change password) put the fields and CTA on one `FORM_PANEL` card at `FORM_WIDTH` (440) on the gutter on wide screens; the auth screens use the same two constants from `layout.ts`. Checkout: `layouts/CheckoutCompact` (docked Pay) and `CheckoutExpanded` (form left; book, summary and Pay inline in the still right pane), fed section slots by the screen. Subscription (the live coming-soon screen): text capped at `READ_MAX`, features two to a row. Bottom sheets (`NotificationPermissionSheet`) float on wide screens: `$gtXs` caps the frame at `FORM_WIDTH`, centred, rounded on all sides, 24 off the bottom. The sheet only opens on a real device, so check it by forcing `setIsOpen(true)` temporarily. Tab bar: 600 wide and centered with every label on wide screens (`wide` prop on `TabItem`). Auth screens: one centered 440 column (`COLUMN_WIDTH` in `AuthLayout`) on a `$glassDeep` card, CTA under the form. `UText` grows `display-xl/l/m` and `wordmark` by `WIDE_DISPLAY_SCALE` (1.25); `NeonButton` 52 to 56, `UInput` 50 to 54. Body text, labels and links keep their size, as iOS does.

**Tests.** React Native's Jest `Dimensions` mock is 750 wide, which is the medium class. The default test window is pinned to an iPhone (390) in `jest.setup-after-env.js`; a wide test sets its own width.

## Component test setup, and how to debug it

Five parts. Nothing else.

1. **Packages.** `jest`, `jest-expo`, `@testing-library/react-native`, `react-test-renderer` (version must match React exactly), `@types/jest`. No jsdom. RN has no DOM.
2. **`preset: 'jest-expo'`.** Does most of the work.
3. **`transformIgnorePatterns`.** RN packages ship untranspiled. Writing this key replaces the preset's list, it does not merge. pnpm writes scopes with `+` not `/`, so patterns use `[/+]`.
4. **Two setup files.** `jest.setup.js` runs before Jest exists (env vars, polyfills only). `jest.setup-after-env.js` runs after (global mocks).
5. **A custom `render`** in `src/test-utils/render.tsx` that supplies providers.

When a component test fails, the error names which part is wrong:

| Error says | Fix in |
|---|---|
| `Unexpected token 'import'` or `'export'` | `transformIgnorePatterns` |
| `Cannot find module 'react-native-x'` | a mock in `jest.setup-after-env.js` |
| `Could not find X context`, `useX must be used within` | the wrapper in `render.tsx` |
| `Unable to find an element with text` | the query, or the component |

## Fixing app code while testing

The app was built fast. Core components are missing accessibility props. That is fine, but it must not turn test work into an audit.

**Rule: fix app code when a test cannot be written without it.** RNTL queries by role and label. When `getByRole` or `getByLabelText` fails on an element that clearly has a role, the app is not accessible and the fix is app code, not a cleverer query.

- `UBackButton` had no `accessible` or `accessibilityLabel`. Query failed. Fixed, correctly.
- Anything found but not blocking goes in the list below, not into the current change.

Never reach for `UNSAFE_getByType` or a `testID` to route around a missing label. The failing query is the signal.

- `NeonButton`, the primary CTA on 12 screens, rendered `role="button"` without `accessible`, so VoiceOver read its text alone and never said "button". Found when `getByRole('button', { name: 'Sign In' })` failed. Fixed with `accessible`, `accessibilityRole` and `accessibilityState={{ busy }}`.
- The bottom tab bar was icon-only with no label and no role, so a screen reader announced nothing. Fixed while adding `testID` for Detox: `accessible`, `accessibilityRole`, `accessibilityLabel`, `accessibilityState={{ selected }}`. A dead `accessibilityLabel` prop on `TabItem` was deleted at the same time.

### Accessibility rules (from the app-wide pass, BUG_LOG 7.2 to 7.7)

- **Never `accessibilityRole="tab"`.** React Native maps it to `UIAccessibilityTraitNone` on iOS, so VoiceOver never says the chip is tappable. Use `"button"` with `accessibilityState={{ selected }}`; it reads "Blogs, selected, button". `tablist` on the container is fine.
- **Every `accessible` view needs a role.** Information rows use `"text"`. Without a role the view has no trait at all.
- **Icons are hidden globally** (`app/_layout.tsx`, `Ionicons` and `Feather` `defaultProps`). Icon fonts render a private-use glyph that VoiceOver cannot speak. So a button whose children are an icon plus text needs an explicit `accessibilityLabel`: React Native builds a parent label by joining every child's label, glyph included (", ORDER").
- **No accessibility props on a Reanimated `createAnimatedComponent` wrapper.** The selected state never reached iOS through it. Put them on a plain parent view (`uButtonTabs`).
- **A label and its value are one element**: `accessible accessibilityRole="text" accessibilityLabel="Date, Dec 17, 2025"` on the row (`EventInfo`, `BookHero` rating row, chat bubbles).
- **A placeholder is not a label.** Every input gets `accessibilityLabel`.
- **Larger Text.** `UText` caps `maxFontSizeMultiplier`: 2x for reading variants (`body`, `text-*`, `link`, `playfair-*`), 1.3x for headings, labels and wordmarks, which are wide capitals that cannot wrap. Test with `xcrun simctl ui <device> content_size accessibility-extra-extra-extra-large`, then relaunch the app, then `content_size large` to reset.
- **The Mobile MCP dump is not VoiceOver.** `mobilecli dump ui --device <id>` filters element types: no ScrollView, Slider, or trait-less view ever appears, and every `StaticText` has a same-label child (how React Native's text view reports itself, not a double read). Absence in the dump does not prove VoiceOver cannot reach it. Use Xcode's Accessibility Inspector or VoiceOver for the final word.

### Accessibility, still to check by hand

- VoiceOver on a device: the audio slider (should read "Playback position, 40:30 of 3:17:34", swipe up or down skips 30 s), the chips, the welcome modal, and the chat bubbles.
- Android TalkBack has not been checked at all.

### Layout debt found, not yet fixed

- None open. All six auth screens now dock their CTA above the keyboard through `AuthLayout` (`src/auth/components/`). The Detox login test still submits with `tapReturnKey()`, which keeps working.

## How to pick which components to test

Do not test every component. Test a component when it has a **decision** in it: a conditional render, a branch on a prop, a formatted value, a press handler with logic. A component that only takes props and lays them out has nothing to assert beyond "React works".

Skip: pure layout wrappers, spacers, style-only components, anything with zero branches.

## Explaining things to him

He liked this shape. Keep it.

- Numbered parts, one idea per part.
- Name the real term, then one plain sentence.
- A short table when there is a lookup (error to fix, input to output).
- End with the rule he can use on his own next time.

## Known open risks

- **E-books and audiobooks are sold through Stripe inside the app**, which breaks App Review Guideline 3.1.1 (digital content must use In-App Purchase). Printed books on Stripe are fine. Options and the EU trader-status question are in `docs/IN_APP_PURCHASES.md`. Waiting on a client decision.
- EAS build servers default to Node 20, and pnpm 11 needs Node 22.13 or newer. Every profile in `eas.json` pins `node`. Bump it together with `packageManager`.
- `render.tsx` imports the real app store, so `persistStore` starts a timer on import. A file run alone then prints "Jest did not exit" (seen in `bottomNavbar.test.tsx`). The full suite still finishes. Not fixed yet.
- `formatEventDisplay` in `helper.ts` uses `Intl.DateTimeFormat` with a `timeZone` option. Node has full ICU so it works under Jest. Hermes on device may not. Tests could be green while the app is wrong. Unconfirmed on a real device.
- `renderWithProviders` now has Redux, SafeAreaProvider and Tamagui. The real root in `app/_layout.tsx` also has GestureHandlerRootView, Stripe, PersistGate and FontProvider. A screen that needs one of those will fail and name it. **Do not add them pre-emptively.**
- The E2E logs into the real backend with a real account. It is not hermetic. A backend outage fails it, and it writes real session data. This is why it must not run on every PR.
- Onboarding, Login and every auth CTA now run endless Reanimated loops (the wordmark glitch and the `NeonButton scan` sweep). They pause on blur, but the screen under test is never idle. The Detox login flow has not been rerun since. If it times out on a screen that looks right, this is the cause: disable synchronisation for that step.
- Only the elements the login flow touches carry a `testID`: `onboarding-login`, `login-email`, `login-password`, `home-screen`, `tab-*`. Add one only when an E2E actually needs it. Never add a `testID` to route around a missing accessibility label in a component test.

## Next targets, in order

1. A GitHub Actions workflow for the E2E suite. `macos-latest`, `workflow_dispatch` plus a nightly `schedule`, never on `pull_request`. Needs `brew install applesimutils`, `expo prebuild`, and `EXPO_PUBLIC_API_BASE_URL`, `E2E_EMAIL`, `E2E_PASSWORD` as repo secrets. The existing `test.yml` and `pr-check.yml` need no edits.
2. Rewrite `authStorage.test.ts` against the real boundary.

Do not start any of these without walking through the seven steps above first.