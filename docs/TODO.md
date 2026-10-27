# TODO

Things deliberately left for later during the UI redesign (`feat/ui-redesign`).

## Verify on a device

These were built and typechecked, but not yet checked on the simulator.

- [ ] **Community chat**
  - In a long chat, scroll up and wait 30s for a poll. The list must not jump to the bottom.
  - Send a message. The list scrolls to it.
  - Tap the chat header to open About, then press back. It returns to the chat, not out of the community.
  - Fail a send (airplane mode). A toast shows and the text stays in the box.
  - Not joined: Join Community works, then the chat opens.
- [ ] **Event detail**
  - An online event opened 15 min early: the Join button turns on by itself at 10 min.
  - An ended event, online or in person: grey "Event has ended" button.
- [ ] **Video detail** (float, float tap and X checked in the simulator with Mobile MCP on 2026-10-26)
  - Fullscreen, then back out.
- [ ] **Podcast and audiobook**
  - Opens at the saved position and autoplays.
  - Mini player slides in once the controls scroll away, and play/pause stays in sync with the big button.
- [ ] **Checkout** (use Stripe test mode)
  - Leave a required field: its error shows once you leave the field, and Pay stays grey.
  - Tap quantity up three times fast. The total settles on the last quantity, and the Stripe sheet charges that amount.
  - Enter an address Lulu rejects. The error shows above the button and Pay is disabled.
  - Change the address back and forth. The total always matches the address on screen.
- [ ] **Edit Profile and Change Password**
  - Type a new name, then change the photo. The typed name stays.
  - Save Changes is grey until the name differs from the saved one.
  - Upload a photo in airplane mode: a toast shows.
  - The keyboard never covers the button, on a small phone too.
- [ ] **Ebook reader**
  - Read a few pages, swipe back, open again: same page. Check Continue Reading on Home shows it too.
  - Airplane mode halfway through a first download: an error with Retry. Retry with network: it downloads fresh.
  - Tap the page: header, footer and status bar hide. Tap again: back. With VoiceOver on, they never hide.
- [ ] **Notification sheet** (real device only, it skips simulators)
  - Fresh install: the sheet shows once. Not Now, kill the app, reopen: it does not show again.
  - Deny in the system popup, relaunch: no sheet for 7 days. Settings toggle still opens system Settings.
  - On a small phone the sheet fits its content and nothing is cut off.
- [ ] **Splash and boot** (needs a native rebuild: `npx expo prebuild --clean` then `pnpm ios`, or an EAS build; app.json changes do not ship over OTA)
  - Cold start: the gradient wordmark on near-black, then the boot screen with the wordmark in the same place and a spinner. No jump, no navy flash.
  - Push and pop a few screens: no navy behind the transition.
- [ ] **Double tap**: tap Read Now, a book card, and a video card twice quickly. Each opens once, and one back press returns. Watch Metro for a "No route named" warning, which would mean a name in `SINGULAR_SCREENS` is wrong.
- [ ] **Detox E2E** before merging. The looping animations on onboarding and login may block synchronisation (see CLAUDE.md).

## CI/CD first run

- [ ] Run **Actions > EAS Build**, profile `preview`, for the current version. Install it on your phone (`eas device:create` first for iOS). Until it exists, `eas-update.yml` fails on every merge.
- [ ] Open a test PR that changes `app.json` plugins without a version bump: Native Check comments and fails. Bump the version: it passes.
- [ ] Merge a JS-only change: the update lands on the preview phone only. Run **EAS Promote**: it reaches a production install.
- [ ] Next release: `git tag vX.Y.Z && git push --tags`, confirm both stores receive the build and a matching preview build appears.

## Features deferred

- [ ] **App-wide mini player.** Keep audio and video playing after leaving the screen, docked above the tab bar, reusable for every media type. Needs the player owned at the app root, not the screen. Progress saving in `useSaveMediaProgress` currently relies on the screen unmounting, so that has to move too. Design it before building it.
- [ ] **Subscription plans go live with RevenueCat.** `SubscriptionPlansScreen` is redesigned to the artboard but not routed. `app/(app)/subscription` still renders the teaser. When RevenueCat is in, wire `handleSubscribe` and `handleManageSubscription` in `useSubscription` (both only `console.log` now) and point the route at the plans screen. To preview it before then, temporarily swap the import in the route.
- [ ] **Play/pause on the floating video.** Needs `isPlaying` back in `useVideoPlayer` (for example with `useEvent(player, 'playingChange')`).

## Open questions from the perf baseline

- [ ] **Taps on Home cards sometimes do nothing.** Twice a Mobile MCP tap on a Home card produced 0 commits and no navigation; the retry worked. The same happened on video detail right after two swipes. Most likely normal iOS behaviour: the first tap during momentum scrolling only stops the scroll. Check with a finger before treating it as a bug.
- [ ] **Does a podcast keep playing after you leave it?** Once, a podcast saved at 9:39 came back at 23:34 about 14 minutes later, as if it had kept playing. It may just have been a missed pause tap. Check by ear: play, press back without pausing, and listen.
- [ ] **Mini player on a short podcast.** The test episode is too short to scroll its controls away, so the mini player could not be checked.

## Community chat, backend work

**Step 1, backend.** Paste this prompt into Claude Code in the backend repo. Review its report before it deploys.

````markdown
# Task: paginated community messages with cursors (Firestore)

## Context
A React Native app (live on both stores) shows a community chat. Today it calls
`GET /communities/:id`, which returns the community plus EVERY message in `threads`,
and it polls that endpoint every 30 seconds. We want: small pages, scroll-up for older
messages, and a cheap poll that returns only new messages. Polling stays (no WebSocket).
Messages are never edited or deleted.

Current message shape the app expects (keep these field names):
{ id: string, userId: string, userName: string, userProfileImage?: string,
  message: string, createdAt: string /* ISO 8601 */ }

## Step 1: read before changing anything
1. Find how messages are stored today: a `threads` array inside the community document,
   or a subcollection. Report which.
2. Find the existing response envelope (e.g. { success, data, message }) and auth rules
   for `GET /communities/:id` and `POST /communities/:id/threads`. Reuse both exactly.

If messages live in an array on the community document: stop and report before migrating.
An array forces reading every message on every request and hits the 1 MB document limit.
The fix is a subcollection `communities/{id}/threads/{threadId}` plus a one-off,
idempotent migration script. I want to approve that plan first.

## Step 2: endpoints
Keep `GET /communities/:id` working exactly as today for old app versions. Add:

1. `GET /communities/:id?includeThreads=false`
   Same response, but without `threads`. Default stays `true`.

2. `GET /communities/:id/threads?limit=30`
   Newest `limit` messages.
3. `GET /communities/:id/threads?before=<cursor>&limit=30`
   The `limit` messages just older than the cursor (scrolling up).
4. `GET /communities/:id/threads?after=<cursor>`
   Messages newer than the cursor (the 30-second poll). Usually empty. Cap at 100.

Response for 2 to 4, inside the existing envelope:
{ threads: Thread[],          // ALWAYS oldest first, within the page
  olderCursor: string | null, // pass as `before` to get the previous page; null = no more
  newestCursor: string | null // pass as `after` on the next poll; null only if no messages at all
}
For `after` with no new messages, return threads: [] and the same cursor back.

5. `POST /communities/:id/threads` must return the created message with its `id` and
   `createdAt`, in the shape above.

## Rules
- Cursor = the message document id, opaque to the client. Query with
  orderBy('createdAt') and startAfter / endBefore on the document snapshot, so two
  messages with the same timestamp still order correctly (Firestore breaks ties by
  document name). Use limitToLast for the newest page.
- createdAt: server timestamp on write, ISO string on read. Never trust a client clock.
- `id` present on every message, every endpoint, including the old `GET /communities/:id`.
- Validate: limit 1 to 50 (default 30); unknown cursor, or a cursor from another
  community, returns 400 with a clear message. `before` and `after` together returns 400.
- Same auth as today's community detail: only what the current endpoint allows.
- Keep `threadCount` on the community correct (FieldValue.increment in the same write
  as the new message), if it is stored rather than counted.
- Add whatever composite index Firestore needs to firestore.indexes.json, if the
  project tracks indexes there.

## Tests
Add tests in this repo's existing test style for: newest page, `before` paging to the
end (olderCursor becomes null), `after` returning only new messages, `after` returning
[] when nothing is new, two messages with the same createdAt not skipped or duplicated
across pages, and the 400 cases.

## When done, report
1. Where messages are stored, and whether a migration was needed.
2. The final request and response for each endpoint, with one real example response.
3. Any index you added.
Do not deploy. I will deploy after reviewing.
````

Why `GET /communities/:id` stays as it is: app versions already in the stores read all messages from `threads`. The new app sends `includeThreads=false` and fetches the first page in parallel, so opening the chat is still one round trip.

**Step 2, app.** After the backend report (seven steps before any test):

- [ ] Fetch the first page and the community info in parallel; poll with `after` and append; load older pages with `before` at the top of the list.
- [ ] Use `id` as the list key once the backend always sends it.
- [ ] Send a real message to check the optimistic insert (BUG_LOG 6.4).
- [ ] `formatMessageTime` deserves a frozen-clock test (seven steps first).

## Found during the accessibility pass, not accessibility

- [ ] **The event list and the event detail disagree by a day.** "Sci-Fi Spotlight" is Dec 18, 7 AM on the Explore card and Dec 17, 7 AM on the detail screen. Two functions answer the same question differently; one is `formatEventDisplay` (see the Hermes timezone risk in CLAUDE.md).
- [ ] **CMS data:** "Sci-Fi Spotlight" is stored as `eventType: 'offline'` with location "Online / Virtual Event", so the badge says In person. Fix the event in the CMS.
- [ ] **CMS data:** some titles end in a space ("Search for Solomon "). Trim in the CMS or at the API.
- [ ] **Podcasts once showed "No podcasts found"** after coming back from a video; pull to refresh fixed it. Possibly the list invalidation from BUG_LOG 5.11 while the Podcasts query was skipped.

## Accessibility pass (whole app, one go)

Done on the simulator: BUG_LOG 7.2 to 7.7, rules in CLAUDE.md. Left:

- [ ] VoiceOver by hand on a device: the audio slider, the chips, the welcome modal, the chat bubbles.
- [ ] Android TalkBack, not checked at all.

## Known gaps

- [ ] Inter Italic is not bundled.
- [ ] Article blockquotes are not 19/30 yet.
- [ ] Remove the Underline button from the CMS editor. The app strips `<u>` tags in `ArticleContent`.
- [ ] `UIconButton` does not forward `disabled` as `accessibilityState` (see CLAUDE.md).

## Perf automation

Find problems by hand (Perf Monitor, React DevTools Profiler). Automate only the guard once fixed.

- [ ] `PerfProbe` (`src/components/core/dev/PerfProbe.tsx`) wraps every signed-in screen in `app/(app)/_layout.tsx` and logs `[perf] app js= ui= commits=` once a second in dev. Mobile MCP drives the taps, Metro shows the numbers. Take a baseline per screen.
- [ ] Reassure render-count tests for the fixed bugs (HeroBanner dots, tab switch), after the seven steps.

## Tests worth writing

Go through the seven steps in CLAUDE.md first.

- [ ] Home banner routing: an `article` banner opens the article, not the book.
- [ ] Audiobook "minutes left" on the Continue Reading card.
- [ ] `useEventDetail`: the join status changes as the clock moves (fake timers).
- [ ] `usePrintCheckout`: an older quote response that arrives after a newer one is ignored, and a failed quote clears the payable quote. This is the money path, so it is the most valuable test on this list.
