# Bug log

Bugs found and fixed during the UI redesign (`feat/ui-redesign`, October 2026). Written to review before interviews.

Each entry has the same parts:

- **Symptom.** What a user saw.
- **Cause.** Why it happened.
- **Fix.** What changed.
- **Say it.** A short answer you can give out loud.
- **Term.** The concept an interviewer will recognise.

**Be honest about status.** Every fix below passes typecheck and the Jest suite. Items marked _(not yet verified on device)_ have not been checked on a real device. See `docs/TODO.md`. Do not claim a fix is proven until you have checked it.

---

## How performance was measured

Every performance entry follows the same loop, so the numbers can be defended:

1. **Pick one action** and do it the same way every time (idle 10 seconds, one pull to refresh, one tab switch).
2. **Baseline:** Perf Monitor for JS and UI fps, React DevTools Profiler for commits, with "Record why each component rendered" on.
   Since 5.9 there is also an automated baseline: `PerfProbe` (`src/components/core/dev/PerfProbe.tsx`) wraps every signed-in screen in `app/(app)/_layout.tsx` and logs `[perf] app js= ui= commits=` once a second in dev. Mobile MCP drives the taps on the simulator, and the lines are read back with `xcrun simctl spawn <device> log show --last 2m --info --predicate 'subsystem == "com.facebook.react.log"'`. It counts commits but does not say why, so the Profiler is still the tool for finding a cause.
3. **Find the cause** from "why did this render": hook changed, props changed, parent rendered, or context changed.
4. **Change one thing**, then repeat the same action in the same build.
5. **Log before and after**, saying which build and which filter, so the comparison is fair.

Dev build numbers are slower than release in absolute terms, but render counts are exact in both, and relative changes hold.

### Baseline, 2026-10-26

`PerfProbe` lines, iPhone 17 Pro simulator, dev build, Mobile MCP doing the taps. Compare future runs against this table.

| Flow | JS fps (lowest) | UI fps (lowest) | Commits | Verdict |
|---|---|---|---|---|
| Home idle | 60 | 60 | about 5 per 4-second banner step | Fine |
| Home scroll, 3 down and 3 up | 60 | 55 | 1 to 3 per second | Fine |
| Any other tab idle (after 5.9) | 60 | 60 | 0 | Fine |
| Fast tab taps, first visit to each tab | 18 | 50 | 20 in one second | Worst number. First mount of each screen. |
| Fast tab taps, all tabs already visited | 57 | 54 | 12 for 6 taps | Fine |
| Explore idle | 60 | 60 | 0 | Fine |
| Explore category chip | 40 (first load of Videos), else 45 to 54 | 56 | 6 to 9 | Fine |
| Explore search, typing 7 characters | 45 | 15 for one second | 10 | The UI dip is the keyboard opening for the first time in the simulator. Check on a device. |
| Explore scroll, 4 down and 2 up | 55 | 57 | 0 to 3 per second | Fine |
| Book detail open from Home | 59 | 59 | 4 to 6 | Fine |
| Book detail idle | 60 | 60 | 0 | Fine |
| Book detail scroll, 3 down and 3 up | 60 | 100 to 115 | 1 to 2 per second | Fine. UI went above 60 because the simulated ProMotion screen runs at 120 Hz while scrolling. |
| Book detail back to Home | 59 | 51 | 2 to 4 | Fine |
| Article scroll (long text) | 60 | 56 | 0 | Fine |
| Audiobook player, playing | 55 | 60 | 6 per second, then 2 after 5.10 | Fixed in 5.10 |
| Audiobook player, paused | 60 | 60 | 0 | Fine |
| Podcast, playing (after 5.10) | 55 | 60 | 2 per second | Fine |
| Video playing | 60 | 60 | 0 per second | Fine. Native controls, no JS clock. |
| Video scroll until it floats, 2 swipes | 60 | 100 | 1 in total | Fine. The float runs on the UI thread. |
| Video float tap, then X | 61 | 49 | 1 each | Fine |
| Related video open (replace) | 55 | 53 | 8 | Fine |
| Back to Explore from a chained video | 58 | 58 | 5 to 7 | Fine. Not blank (4.1), and the list refetched (5.11). |
| Library, first visit | 51 | 57 | 12 | Fine. First mount. |
| Library idle | 60 | 60 | 0 | Fine |
| Library filter chip | 55 | 55 | 6 to 7 | Fine |
| Library scroll, 3 down and 3 up | 53 | 59 | 16 in total | Fine. List cell recycling. |
| Library, open a book and back | 50 | 57 | 12 open, 4 back | Fine |
| Ebook reader open (cached PDF, resume on page 27) | 35 | 57 | 35 in two seconds | Acceptable. One-off: about six state updates in `useEbookReader` plus the native PDF view mounting and jumping to the saved page. Hidden behind the load. |
| Ebook reader idle | 60 | 60 | 0 | Fine |
| Ebook page turn | 56 | 60 | 2 | Fine |
| Ebook tap to hide or show the chrome | 57 | 57 | 1 to 2 | Fine |
| Ebook back to book detail | 60 | 59 | 4 | Fine |
| Edit Profile open | 51 | 51 | 9 | Fine |
| Edit Profile, typing 8 characters | 54 | 61 | 9 | Fine. About one commit per keystroke, the floor for a controlled input. |
| Change Password open | 53 | 54 | 6 | Fine |
| Change Password, 18 characters across two fields | 49 | 50 | 27, with focus changes | Fine |
| Checkout open | 44 | 53 | 8 | Fine |
| Checkout quantity up, 3 fast taps | 57 | 53 | 3 per tap | Fine. The estimated total updates locally. |
| Checkout, typing 7 characters | 45 | 48 | 10 | Acceptable. Each keystroke re-renders the whole form and the order summary. Watch it if the form grows. |
| Any first keyboard open | 58 | 24 | 1 | UI dips for about a second the first time the keyboard opens in the simulator. Seen on Explore search and Edit Profile. Check on a device. |

Until the probe moved to `app/(app)/_layout.tsx`, it only wrapped the tabs, so pushed screens showed 0 commits whatever happened. Rows above Book detail were measured with the tabs-only probe, which is fine because they are all tab screens.

UI fps is frames counted, not a percentage of 60. On a 120 Hz screen the ceiling is 120 during interaction.

## The five best stories

(Strong addition: 5.6, a native crash diagnosed from crash reports, with a before and after.)

Use these first. Each one has a clear cause, a real cost, and a fix you can explain in under a minute.

1. **Checkout charged a different address than the one on screen.** A client-side cache plus hidden state.
2. **Out-of-order quote responses.** A classic race condition with a request id fix.
3. **Podcast autoplay and resume broke in a library migration.** A read-only property after expo-av became expo-audio.
4. **The Explore screen went blank after chaining videos.** Native video memory, fixed by changing push to replace.
5. **The Join button never turned on.** A memoized selector cannot know that time passes.

---

## 1. Money (Checkout)

### 1.1 The order used a different address or quantity than the screen showed

_(not yet verified on device)_

- **Symptom.** Type address A, then B, then go back to A. The screen shows A's price. The order is created for B.
- **Cause.** Two pieces of state disagreed.
  - `useCheckoutForm` kept a client cache of quotes. Going back to A was a cache hit, so the screen showed A.
  - `usePrintCheckout` stores the params of the last quote it *fetched*. That was B. `createOrder` uses those params.
- **Fix.** Deleted the cache. Every change asks the server for a new quote, so the quote on screen is always the one the order uses. `src/checkout/hooks/useCheckoutForm.ts`.
- **Say it.** "The checkout cached quotes on the client, but the order used whatever was fetched last. So on a cache hit, the price on screen and the address on the order could differ. I removed the cache. On a payment screen, one source of truth matters more than saving a request."
- **Term.** Single source of truth. Cache invalidation.

### 1.2 Out-of-order quote responses

_(not yet verified on device)_

- **Symptom.** Tap quantity up quickly, from 1 to 2 to 3. Sometimes the total settles on the price for 2, and the order is placed for 2.
- **Cause.** Each tap sends a request. Network responses do not arrive in order. If the response for 2 arrives after the response for 3, it overwrites the newer one.
- **Fix.** Each request gets an increasing id. A response only updates state if its id is still the newest. `src/hooks/usePrintCheckout.ts`.
  ```ts
  const requestId = ++latestQuoteRequest.current;
  const result = await getPrintQuote(params).unwrap();
  if (requestId !== latestQuoteRequest.current) return null;
  ```
- **Say it.** "Two quote requests were in flight and the older one came back last, so it won. I tagged each request with an id and ignored any response that was not the latest. Debouncing makes this rarer but does not fix it, because the server can still be slow."
- **Term.** Race condition. Stale response. Last-write-wins.
- **Resolved and pinned.** `usePrintCheckout.test.tsx`, "orders the newest quote, even when an older quote lands after it". The test holds the first quote request, lets the second answer, then releases the first, and checks the `POST /print/orders` body carries the newest quantity and amount. Proof: delete the `requestId` guard before `setQuote(quoteData)` and this test goes red.

### 1.3 A failed quote left the old quote payable

_(not yet verified on device)_

- **Symptom.** Change the address to one the print service rejects. The Pay button stays on, with the previous address and price.
- **Cause.** On error, only an error message was set. The previous quote and its params stayed in state.
- **Fix.** A failed quote clears the quote and its params. Pay is disabled while there is a quote error.
- **Say it.** "An error path forgot to clear the previous success. On a payment screen, a failure has to make the old value unusable, not just show a message."
- **Term.** Error state handling. Fail closed.
- **Resolved and pinned.** `usePrintCheckout.test.tsx`, "leaves nothing to pay when a new quote fails": after a good quote then a failed one, `quote` is null, `createOrder` says "Please get a quote first", and no order request is sent. Proof: delete `setQuote(null); setOrderParams(null);` in `getQuote`'s catch and it goes red.

### 1.4 Form errors never showed

_(not yet verified on device)_

- **Symptom.** The Pay button stays grey and nothing says why.
- **Cause.** Formik only shows an error for a field that is `touched`. Nothing ever marked a field as touched, because no input had an `onBlur`.
- **Fix.** Every field calls `setFieldTouched` on blur. `src/checkout/components/ShippingForm.tsx`.
- **Say it.** "Validation ran, but the errors were hidden behind Formik's touched check, and nothing set touched. The user saw a disabled button and no reason."
- **Term.** Form touched state.

### 1.5 "Price has changed" never fetched a new quote

_(not yet verified on device)_

- **Symptom.** After a price-mismatch error, the screen was stuck with no quote.
- **Cause.** The fetch effect only re-runs when its inputs change. After the mismatch, the inputs had not changed.
- **Fix.** A `requoteKey` in the effect's dependencies. It goes up when the server rejects the quote as stale.
- **Term.** Effect dependencies.

### 1.6 The Tax line was guessed

- **Cause.** Tax was shown as total minus subtotal minus the flat shipping rate. That is only right if shipping exactly matches the flat rate.
- **Fix.** Removed the line. The total says "incl. tax". Prices now use `formatPrice` with the quote's currency, not a hard-coded `$`.
- **Say it.** "Never show a number you derived by guessing. If the server does not give you the breakdown, show the total."

### 1.7 A paid order could say "try again"

_(found while walking through the hook before testing; pinned by `usePrintCheckout.test.tsx`)_

- **Symptom.** After the Stripe sheet succeeded, the app polls the server until the order is marked paid. If that poll timed out (15 tries, 2 seconds apart) or the network dropped, the user saw "Connection error. Please check your internet and try again." and stayed on checkout with Pay enabled. Their card was already charged, so trying again meant a second charge.
- **Fix.** Once the sheet succeeds, only a definite `failed` or `cancelled` from the server keeps the user on checkout. A timeout or a network error still clears the quote and leaves checkout, with "Payment received. We're confirming your order." `onSuccess(printOrderId, isConfirmed)` carries the difference. `src/hooks/usePrintCheckout.ts`, `CheckoutScreen.tsx`.
- **Resolved and pinned.** "leaves checkout, unconfirmed, when the card is charged but confirmation times out" (fake timers, 15 polls): `onSuccess('order-1', false)`, no error, quote cleared. Proof: change `isConfirmed = false;` to `throw verifyError;` and it goes red. A definite `failed` still keeps the user on checkout: "keeps the user on checkout with a message when the server reports the payment failed".
- **Say it.** "After the charge, an unknown outcome is not a failure. I only send the user back to Pay when the server says the payment failed; otherwise I tell them we're confirming, so they can never pay twice."
- **Term.** Idempotency risk. Double charge.

### 1.8 Server errors on order creation all said "Order failed"

_(also removed while there: `isProcessing` and `isVerifying` were returned by `usePrintCheckout` but had no caller, Step 0 of the test process)_

- **Cause.** `createPrintOrder(...).unwrap()` rejects with RTK Query's `{ status, data }`, not an `Error`, and the catch block only read `error instanceof Error`. So the server's message was never shown, and a "price changed" rejection never cleared the quote, which is what triggers the re-quote from 1.5.
- **Fix.** Read the message with the existing `extractErrorMessage`, which handles both shapes.
- **Resolved and pinned.** "shows the server's own message when it rejects the order" and "asks for a fresh price when the server says the quote changed". Proof: replace `extractErrorMessage(error)` with `error instanceof Error ? error.message : 'Order failed'` and both go red.
- **Open.** The match for "price changed" is on the words `mismatch`, `quote` or `price changed`. The backend's real error for this case is not confirmed yet.
- **Say it.** "unwrap throws the RTK error object, not an Error. My instanceof check silently swallowed every server message."
- **Term.** `unwrap()`. `FetchBaseQueryError`.

---

## 2. Time and state

### 2.1 The Join button never turned on

_(not yet verified on device)_

- **Symptom.** Open an online event 15 minutes early. The button says "Join opens 10 min before" and never changes, even after 10 minutes.
- **Cause.** The join status came from a memoized selector, `selectJoinStatus`. A memoized selector only runs again when its input changes. Its input is the cached event, which does not change. The clock is not an input.
- **Fix.** The status is computed in the hook, with a 30 second timer that re-renders until the event ends. `src/eventDetail/hooks/useEventDetail.ts`.
  ```ts
  useEffect(() => {
    if (!joinStatus || joinStatus === 'ended') return;
    const id = setInterval(() => setTick((tick) => tick + 1), JOIN_STATUS_TICK_MS);
    return () => clearInterval(id);
  }, [joinStatus]);
  ```
- **Say it.** "The status depended on the current time, but it was memoized on data that never changed. So it was computed once and frozen. Time is an input like any other. If a value depends on it, something has to re-run when time passes."
- **Term.** Memoization. Derived state. `createSelector`.

### 2.2 Events with only `eventStartUtc` were stuck

- **Cause.** The check required `eventDate` and `eventTime`. The helper `getJoinStatus` prefers `eventStartUtc`. So an event that only had `eventStartUtc` had its button disabled forever.
- **Fix.** The check accepts either form.
- **Say it.** "Two pieces of code answered the same question with different rules."

### 2.3 The chat header was frozen at first render

- **Cause.** `useMemo` with an empty dependency array `[]`. The title and image never updated.
- **Fix.** Removed the memo. It was rendering two small elements.
- **Say it.** "An empty dependency list told React the value never changes. It also was not expensive, so the memo had a cost and no benefit."
- **Term.** Stale closure. Premature memoization.

### 2.4 Changing the avatar wiped the name being typed

_(not yet verified on device)_

- **Symptom.** On Edit Profile, change your name, then change your photo. The name goes back to the saved one.
- **Cause.** The photo upload invalidates the `User` cache tag, so `getMe` refetches. A `useEffect` copied the server name into the field every time the user data changed, so the refetch overwrote the edit.
- **Fix.** Prefill the field once, guarded by a ref. Later refetches leave it alone. `src/profile/hooks/useEditProfileData.ts`.
- **Say it.** "An effect synced server data into form state on every change. That is fine on first load, but a refetch from an unrelated mutation then overwrote the user's typing. Form state should be seeded once, not mirrored."
- **Term.** Derived state versus seeded state. Cache invalidation side effects.

### 2.5 Names with two spaces got a leading space

- **Cause.** `fullName.split(' ')` on "John  Doe" gives `['John', '', 'Doe']`, so the last name became " Doe".
- **Fix.** `split(/\s+/)`.

### 2.6 The ebook reader lost your place

_(not yet verified on device)_

- **Symptom.** Read to page 50, swipe back, open the book again. It opens on page 10.
- **Cause.** Two bugs together.
  - Progress was sent to the server only from the back button. Swipe back and the Android back button skipped it, so the server kept page 10.
  - On open, server progress always won over the page saved on the phone. So the stale server page replaced the newer local one.
- **Fix.** Save on unmount as well as on the back button. On open, compare timestamps: the server's `lastReadAt` against the local `updatedAt`. The newest wins. `src/ebookReader/hooks/useEbookReader.ts`.
- **Say it.** "Progress had two copies, one on the device and one on the server, and the rule was 'server always wins'. But the server copy could be stale, because one exit path never saved. I made every exit save, and resolved the conflict by timestamp instead of by source."
- **Term.** Sync conflict resolution. Last-write-wins by timestamp.

---

### 2.7 Event detail showed the day before the list

_(checked in the simulator: Sci-Fi Spotlight now reads Dec 18 on both screens)_

- **Symptom.** Three events showed a date one day earlier on the detail screen than on the Explore card: Dec 17 on detail, Dec 18 on the card. Only Test Event agreed.
- **Cause.** Those events have a date but no start instant: the backend sends `eventDate: "2025-12-18T00:00:00.000Z"` (UTC midnight) with `eventStartUtc: null`. In that branch, `formatEventDisplay` built its two outputs from two different parsers. The card's `badgeDay` came from a regex that read the "2025-12-18" part, so it was right. The detail's `dateLabel` came from `formatDate`, whose date-only regex ends in `$`, so it failed on the full string and fell back to `new Date(...)`: UTC midnight is 7 PM the evening before in Montreal. Test Event was right because it has `eventStartUtc`, which takes the other branch.
- **Fix.** In that branch, `dateLabel` is formatted from the same local calendar date as the badge. `formatDate` itself is unchanged, because article and review dates are real instants and converting those to local time is correct. `src/utils/helper.ts`.
- **Why the old test passed.** Its fixture was `eventDate: '2025-07-15'`, but the backend never sends that shape. The new test uses the real one, `'2025-12-18T00:00:00.000Z'`, and pins `TZ` to America/Toronto, because in UTC (where CI runs) the bug cannot happen.
- **Resolved and pinned.** `helper.test.ts`, "shows the same calendar day on the card and the detail screen". Proof: put back `dateLabel: formatDate(event.eventDate)` and it fails with `Received: "Dec 17, 2025"`.
- **Say it.** "Two functions answered the same question differently. A date-only value from the server is a calendar day, not an instant, but one path parsed it as UTC midnight and converted it to local time. And my test fixture did not match what the backend really sends, so the test was green while the app was wrong."
- **Term.** Date-only versus instant. Timezone offset. Fixture drift.

### 2.8 Events with a date but no time never changed state

_(not yet verified on device)_

- **Symptom.** An online event with a date but no time showed "Join Meeting", greyed out, forever, so the user could not tell whether something was broken. An in-person event with no time kept "Open in Maps" enabled forever, even weeks after its date.
- **Cause.** `useEventDetail` gave these events no join status at all (`null`), because without a time it cannot know when the join window opens. That is right before the day, and wrong after it: nothing ever moved them to "ended".
- **Fix.** A date with no time is now "time to be announced" until that calendar day is over, then "ended". `EventActions` says "Time to be announced" instead of "Join Meeting" for an online event with no time. Product decisions: both. `src/eventDetail/hooks/useEventDetail.ts`, `src/eventDetail/components/EventActions.tsx`. The same change memoizes `selectEvent(eventId)`, which was rebuilt on every render, so its memo never hit.
- **Resolved and pinned.** `useEventDetail.test.tsx`, "has no join status while the time is still to be announced" and "says ended the day after an event that never got a time". The same file also pins 2.1: "turns Join on by itself when the join window opens".
- **Say it.** "A missing value has two meanings over time. Before the day, no time means 'not announced yet'. After the day, it means 'over'. The code only handled the first one, so the button was stuck in a state that never ended."
- **Term.** Missing data versus unknown data. State that never reaches a terminal state.

## 3. Native modules and library migrations

### 3.1 Podcast autoplay and resume broke

- **Symptom.** A podcast did not autoplay and did not resume from the saved position. The log showed `Cannot assign to property 'currentTime' which has only a getter`.
- **Cause.** The 1.0.9 release moved from `expo-av` to `expo-audio` (commit `05c3634`). In `expo-audio`, `player.currentTime` can only be read. Setting it threw an error, so the `play()` call on the next line never ran.
- **Fix.** Wait until `status.isLoaded`, then `await player.seekTo(seconds)`, then `play()`. It runs once per file. `src/components/core/audio/hooks/useAudioPlayer.ts`.
- **Say it.** "It was a regression from a library migration. The new library made a property read-only, and the error stopped the code that started playback. I moved to the library's seek method and waited for the file to load, because a seek before load can be dropped."
- **Term.** Regression. Breaking API change.
- **Note.** `expo-video`'s `currentTime` can still be set, so the video player did not need the same fix.

### 3.2 The status bar stayed hidden after fullscreen video

- **Cause.** Fullscreen hid the status bar. Leaving the screen while in fullscreen only restored the orientation, not the status bar.
- **Fix.** The unmount cleanup restores both.
- **Term.** Effect cleanup.

### 3.3 Video size was read once at module load

- **Cause.** `Dimensions.get('window')` at the top of the file. It runs once, so rotating the device used old values.
- **Fix.** `useWindowDimensions()`, which updates on rotation.

### 3.4 A broken PDF download was cached forever

_(not yet verified on device)_

- **Symptom.** A book fails with "the file may be corrupted", every time, until the app is reinstalled.
- **Cause.** `FileSystem.downloadAsync` wrote straight to the final path, and it does not throw on an HTTP error. An expired signed URL or a dropped connection left an error page or half a PDF at that path. Every later open saw the file existed and reused it. Retry did nothing either, because `refetch` reset a ref but nothing re-ran the load effect.
- **Fix.**
  - Download to a temp file, check for HTTP 200, then move it into place.
  - If the PDF viewer cannot render the file, delete it and the cached URL.
  - Retry now bumps a key in the load effect's dependencies, so it really reloads.
- **Say it.** "Never write a download straight to the path you treat as the cache. Download to a temp file, check the status, then move it. A move is effectively atomic, so the cache only ever holds complete files."
- **Term.** Atomic write. Cache poisoning.

---

## 4. Navigation and memory

### 4.1 The Explore screen went blank

- **Symptom.** Open a video, then a related video, then another. Go back to Explore, then Home, then Explore again. Explore is completely blank, even the search bar.
- **Cause.** Each related tap used `router.push`. Every video screen stayed mounted under the next one, each with its own native video player. Native video memory kept growing. Under memory pressure, iOS throws away views it is not showing.
- **How it was narrowed down.** The search bar and tabs are not inside the list. If only the list had broken, the header would still show. A fully blank screen meant the whole native view was dropped, which pointed to memory, not to list layout.
- **Fix.** Related items open with `router.replace`. The old screen unmounts and frees its player.
- **Say it.** "Pushing kept every video screen alive underneath, each with a native player. Memory grew until iOS dropped views. Replacing the screen frees the player."
- **Term.** Navigation stack. Memory pressure.

### 4.2 The previous episode kept playing under the new one

- **Cause.** Same `push`. The old screen stayed mounted, so its player kept playing while the new one autoplayed.
- **Fix.** Same `router.replace`.

### 4.3 Back from Community About left the community

- **Symptom.** In chat, tap the header to see About, then press back. You leave the community instead of returning to the chat.
- **Cause.** Chat and About are two views of one screen, not two routes. Back called `router.back()`.
- **Fix.** For members, back on About returns to the chat. The "View Discussions" button, which had no handler, does the same.

### 4.4 The home banner opened the wrong screen

- **Cause.** The banner's `article` case routed to the book detail screen (since commit `eb46407`).
- **Fix.** It routes to `/(app)/article/[id]`.

### 4.5 A double tap pushed the same screen twice

_(not yet verified on device)_

- **Symptom.** Tap Read Now, or any card, twice quickly. Two copies of the screen open, so back has to be pressed twice.
- **Cause.** `router.push` always adds a new screen. Two taps before the first transition finishes mean two pushes.
- **Fix.** `dangerouslySingular` on every pushed screen in `app/(app)/_layout.tsx`. Expo Router then gives each screen an id from its route and path params. A push whose id already exists moves to that screen instead of adding another.
- **Why there, not in each button.** There are dozens of `router.push` calls. A guard in each one, like a debounce or an `isNavigating` flag, misses the next button someone adds. One rule on the navigator covers all of them.
- **Say it.** "Double-tap navigation is a common mobile bug. Instead of debouncing every button, I made the navigator itself refuse duplicates: each screen gets an id from its route params, and pushing an id that is already in the stack goes to it instead."
- **Term.** Idempotent navigation. Route identity (`getId`).
- **Side effect.** Opening a book that is already deeper in the stack goes back to it instead of stacking a second copy.

---

## 5. Lists and rendering

### 5.1 The chat jumped to the bottom every 30 seconds

_(not yet verified on device)_

- **Symptom.** Scroll up to read old messages. Within 30 seconds, the list jumps back to the bottom.
- **Cause.** `onContentSizeChange` called `scrollToEnd` every time the content changed. That included the background poll and pull-to-refresh, not only new messages.
- **Fix.** FlashList's chat mode. It opens at the newest message, and only follows new ones while you are near the bottom.
  ```tsx
  maintainVisibleContentPosition={{ startRenderingFromBottom: true, autoscrollToBottomThreshold: 0.2 }}
  ```
- **Say it.** "Auto-scroll fired on every content change, including polls. A chat should only follow new messages when the user is already at the bottom."

### 5.2 Explore cards faded in out of order

- **Cause.** Each card had its own mount animation. FlashList recycles cells, so a recycled cell did not mount again and skipped its animation.
- **Fix.** Animate the list container once per tab, not each card.
- **Term.** Virtualisation. Cell recycling.

### 5.3 A FlashList nested in a ScrollView did not virtualise

- **Cause.** With `scrollEnabled={false}` inside a parent ScrollView, the list cannot know what is on screen, so it renders every row anyway.
- **Fix.** Reviews render with a plain `map`. A `ponytail:` comment says to paginate from the API if a book ever has hundreds of reviews.
- **Say it.** "A virtualised list only helps if it owns the scroll. Nested inside another scroll view, it renders everything and just adds overhead."

### 5.4 A crash on import: `getTokenValue` at module scope

- **Cause.** Calling Tamagui's `getTokenValue` at the top of a file runs before `createTamagui`, so the tokens do not exist yet.
- **Fix.** Call it inside the component.
- **Term.** Module initialisation order.

### 5.5 A gap above the sticky tabs

- **Cause.** A margin on a `stickyHeaderIndices` child sticks with it, and shows as a gap.
- **Fix.** Put the spacing on the element above, as padding.

### 5.6 Native crash: two animation systems writing to the same view tree

_(verified in the iOS simulator, dev build; not yet checked in a release build or in Sentry)_

- **Symptom.** The app closed with no error screen while scrolling Home fast, pulling to refresh, and switching tabs during the refresh. It took 4 to 5 tries to reproduce. The carousel dots also visibly lagged when they changed.
- **Evidence.** Three crash reports, all `EXC_BAD_ACCESS (SIGSEGV)`, "possible pointer authentication failure", which is a read of freed memory. In all three:
  - **UI thread:** Reanimated, `performOperations`, `commitUpdates`, `cloneShadowTreeWithNewProps`, copying a view's props.
  - **JS thread, at the same moment:** `UIManager::setNativeProps_DEPRECATED`, replacing props in the same tree.
- **Cause.** The app ran two animation systems.
  - Reanimated drives our fades, skeletons and sticky bars from the UI thread.
  - Tamagui's `animation="quick"` prop runs on React Native's old `Animated` API (`@tamagui/animations-react-native`). Tamagui only uses the native driver when every style key can be animated natively. Our cards and dots also set width, colour and shadow, so they ran on the JS thread and pushed every frame through `setNativeProps` (`react-native/Libraries/Animated/nodes/AnimatedValue.js`).
  - Two threads cloned the same shadow tree. One freed props the other was still copying.
  - The carousel `PaginationDots` animated width and colour every 4 seconds, with no touch needed, so the collision chance was always there on Home.
- **How it was narrowed down.**
  1. Read the full `.ips` crash report in `~/Library/Logs/DiagnosticReports`, not just its tail.
  2. Compared the threads across three reports: the same pair every time.
  3. Searched for who calls `setNativeProps`: not our code, but React Native `Animated`, used by Tamagui's driver.
  4. First experiment, `animations: undefined` in the Tamagui config, broke the app (`Sheet` needs a driver, and the hook order changed). The lesson: switch off one thing at a time, and only things the app can run without.
  5. Second experiment: removed `animation="quick"` from the six Home and tab bar components only. No crash in about 15 tries, and the dots stopped lagging.
- **Fix.** Removed `animation="quick"` everywhere (19 places). Press styles still apply, instantly. `USwitch`'s thumb slide moved to Reanimated. The Tamagui driver stays configured only because `Sheet` requires it.
- **Measured.** Before: crash in 4 to 5 tries, dots lag visible. After: 0 crashes in about 15 tries, dots smooth.
- **Follow-up, same root cause.** `react-native-toast-message` slid in with React Native `Animated`, and on Android its native driver was off (`Platform.select({ ios: true, default: false })`), so every frame went through `setNativeProps`. The "couldn't refresh" toast appears exactly while Reanimated runs the refresh spinner. Replaced it with our own `Toast` and `ToastHost` on Reanimated layout animations, keeping the same `Toast.show` call shape so the 16 call sites only changed their import. _(Android not yet verified on a device.)_
- **A fake assertion found on the way.** The Home test asserted `queryByRole('alert')` was not on screen. RNTL only matches roles on accessible elements, and the toast container is not one, so that assertion passed no matter what. The tests now find toasts by their text.
- **Say it.** "The app crashed natively under load, with no JS error. The crash reports showed Reanimated cloning the view tree on the UI thread while React Native's old Animated API called setNativeProps on the JS thread. Tamagui's animation prop used that old API. I proved it by removing the prop from just the Home components: the crash stopped and the carousel got smoother. Then I removed it everywhere, so only one animation system touches the view tree."
- **Term.** Use-after-free. Race condition between threads. Native crash report (`.ips`) and symbolicated stack traces. JS-driven versus native-driven animation.

### 5.7 Home re-rendered while nobody touched it

_(measured in the iOS simulator, dev build, React DevTools Profiler)_

- **Symptom.** Home sitting idle for 10 seconds produced 23 commits. The banner only advances every 4 seconds, so about 3 were expected.
- **How it was found.** Profiler with "Record why each component rendered". The top component in most commits was `HeroBanner`, with the reason "Hook 1 changed", which is its `activeIndex` state. The slowest part was a card `YStack` with "Props changed".
- **Cause.** Three problems on top of each other.
  - **Two writers.** The timer set `activeIndex`, and `onViewableItemsChanged` set it again while the list slid to the next card, sometimes passing through the old index first. One step gave 2 or 3 renders.
  - **Each render rebuilt the list.** `contentContainerStyle={{ ... }}` was a new object every render and each card got a new `onPress`, so the `FlatList` and every `BannerCard` re-rendered for what was only a dots change.
  - **A side effect inside a state updater.** The timer scrolled the list inside `setActiveIndex(prev => ...)`. Updaters must be pure, because React may call them more than once.
- **Fix.** `src/components/home/hero/HeroBanner.tsx`.
  - One entry point, `goTo(index)`, which ignores the index it already has. The timer calls it, and a manual swipe calls it once when the swipe settles (`onMomentumScrollEnd`). `onViewableItemsChanged` is gone.
  - The style is a module constant, and the `FlatList` element is memoized, so a dots change re-renders only `HeroBanner` and `PaginationDots`.
  - The index lives in a ref for the timer; the scroll happens outside the updater.
- **Measured.** React DevTools Profiler, iOS simulator, dev build. The "before" numbers were taken with every commit counted, so the fair comparison is the "all commits" column. The second column hides commits under 1 ms, which are too cheap to matter.

  | Scenario | Before (all commits) | After (all commits) | After (commits over 1 ms) |
  |---|---|---|---|
  | Home idle for 10 seconds | 23 | 16 | 3, one per 4-second banner step, about 5 ms each |
  | One pull to refresh | 55 | 18 | 4: refresh starts, banner, new sections, banner step |

  In each banner step only `HeroBanner` and `PaginationDots` render now; the list and its cards stay grey in the Profiler. In a refresh, the sections render once, when the new data arrives.
- **How to quote it honestly.** "Refresh went from 55 commits to 18, and only 4 of those take more than a millisecond." Compare like with like: do not put the filtered 4 next to the unfiltered 55.
- **Say it.** "The Profiler showed the banner re-rendering more than twice per slide while idle. Two places wrote the same state, and every render rebuilt the list because I passed a new style object and new functions. I made one entry point that ignores duplicates, and memoized the list, so a slide costs one 5 ms render that touches only the dots."
- **Term.** Re-render cascade. Referential equality. Single source of truth. Pure state updaters.

### 5.8 Fast tab switching left a tab black

_(verified in the iOS simulator by hand: reproduced before, not reproducible after)_

- **Symptom.** Switching tabs quickly, at random, one tab showed only black with its tab selected.
- **How it was narrowed down.** With the app stuck, the Element Inspector and React DevTools both highlighted the screen's elements: they were mounted but invisible, so something had left them at opacity 0. `UAnimatedView` was the first suspect, but it only fades a screen on its first mount, and already-visited tabs went black too. The one animation that ran on every switch was the tab navigator's own `animation: 'shift'`.
- **Cause (most likely).** `shift` fades each tab scene's opacity between 0 and 1 with React Native `Animated` on the native driver. A fast switch interrupts the running animation, and inactive tabs are detached from the view tree (`detachInactiveScreens`). An update sent to a detached scene can be lost, so it returns with opacity 0.
- **Fix.** Removed `animation: 'shift'` from the tab navigator. Tabs switch instantly, as native iOS tab bars do. `src/navigations/bottomNavTabLayout.tsx`.
- **Measured.** Before: reproduced by hand within a few seconds of fast switching. After: not reproducible.
- **Options not taken.** `detachInactiveScreens={false}`, a newer `@react-navigation/bottom-tabs`, or our own Reanimated transition that snaps to visible when interrupted.
- **Say it.** "Screens went black after fast tab switches. The inspector showed the views were there but invisible. The tab transition animated opacity on the native driver, and an interrupted animation on a detached screen could leave it at zero. I removed the transition, which also matches how native iOS tabs behave."
- **Term.** Native-driven animation. Interrupted animation. Detached inactive screens.

### 5.9 The home banner kept ticking on every other tab

_(measured in the iOS simulator, dev build, with `PerfProbe` and Mobile MCP)_

- **Symptom.** Sitting idle on Library, a screen with no timers, the app still committed every 4 seconds. That is the banner's autoplay interval.
- **How it was found.** The first automated baseline. Mobile MCP tapped through the tabs, `PerfProbe` logged commits per second, and the idle lines on Library showed a commit spike every 4 seconds while every other second was 0.
- **Cause.** Bottom tabs keep a screen mounted after its first visit and only hide it, so scroll position and state survive. `HeroBanner` started its `setInterval` in a `useEffect`. A `useEffect` cleanup only runs on unmount or a dependency change, and switching tabs is neither, so the timer never stopped and kept calling `setActiveIndex` on a screen nobody could see.
- **Fix.** Start and stop autoplay with `useFocusEffect` instead of `useEffect`. Its cleanup runs on blur. `src/components/home/hero/HeroBanner.tsx`. The `HomeScreen` test mocks `expo-router`, so its mock now provides `useFocusEffect` as a plain effect: with no navigator, the screen counts as always focused.
- **Measured.** `PerfProbe` lines, iOS simulator, dev build.

  | Scenario | Before | After |
  |---|---|---|
  | Library idle for 12 seconds | about 5 commits every 4 seconds | 0 commits |
  | Back on Home, idle | about 5 commits every 4 seconds | about 5 commits every 4 seconds (autoplay resumes) |

- **Also.** With the banner paused off Home, the JS thread is idle on the other tabs, which is what Detox synchronisation waits for.
- **Say it.** "Our perf probe showed commits every 4 seconds on a tab with no timers. Bottom tabs keep screens mounted, so the banner's interval in a `useEffect` never got cleaned up. I moved it to `useFocusEffect`, which stops it on blur. Off Home the app went to zero commits."
- **Term.** Screen lifecycle versus component lifecycle. Focus versus mount. Pause on blur.

### 5.10 The audio player re-rendered the whole screen three times per tick

_(measured in the iOS simulator, dev build, with `PerfProbe` and Mobile MCP; audiobook and podcast both checked)_

- **Symptom.** While an audiobook played, the app committed 6 times every second, steadily. Paused, it was 0. The time label only changes once a second.
- **How it was found.** The `PerfProbe` baseline on the audiobook player: playing showed a flat 6 per second, pausing dropped it to 0, so the cause was the playback loop itself.
- **Cause.** Three clocks updated the same progress.
  - `useAudioPlayerStatus` lived in the screen-level hook `useAudioPlayer`, so every expo-audio status event, every 500 ms, re-rendered the whole screen.
  - `ProgressDisplay` ran its own `setInterval(500)` that copied a ref into state. The ref was there "to avoid re-renders on every tick", but the first clock already re-rendered on every tick, so it saved nothing and added a second render.
  - The `Slider`'s `onValueChange` also wrote the same state, and on iOS it can fire when the `value` prop moves, not only when a finger drags.
- **Fix.** One clock, at the leaf. `src/components/core/audio/hooks/useAudioPlayer.ts`, `src/components/core/audio/AudioPlayer.tsx`.
  - The hook listens with `player.addListener('playbackStatusUpdate')` and only sets `isPlaying` and `isLoading`. Setting the same value again is a no-op for React, so a plain tick renders nothing at screen level. Rewind, forward and seek read `player.currentTime` live instead of a captured status.
  - `ProgressDisplay` calls `useAudioPlayerStatus(player)` itself and derives the position. The interval and the ref are gone.
  - The slider keeps a local value only while the thumb is held (`onSlidingStart` to `onSlidingComplete`), and ignores `onValueChange` otherwise.
- **Measured.** `PerfProbe` lines, iOS simulator, dev build.

  | Scenario | Before | After |
  |---|---|---|
  | Audiobook playing, per second | 6 commits, whole screen | 2 commits, `ProgressDisplay` only |
  | Podcast playing, per second | same hook, same 6 | 2 |
  | Paused | 0 | 0 |

  Checked after the fix: resume at the saved position, autoplay, forward 10 seconds, pause, and a slider drag while paused all behave.
- **Seen, not fixed.** After a very short drag, 60 px or less, made by Mobile MCP while paused, the thumb moved but no seek happened. The time label stayed correct, and play snapped the thumb back. Most likely a synthetic swipe too short to count as a slide, so `onSlidingComplete` never fired. _(not yet checked with a finger on a device)_
- **Say it.** "The player re-rendered the whole screen six times a second while playing. Three things updated the same progress: the status hook at screen level, a second interval in the progress bar, and the slider echoing its own value. I moved the status subscription into the progress component and kept only play state at screen level. Two small renders a second, and the screen itself does not re-render."
- **Term.** Colocate state. Subscribe at the leaf. Redundant clock. Controlled input echo.

### 5.11 The podcast and video cards never showed new progress

_(verified in the iOS simulator: podcast card moved from 35% to 74% after a seek, with no manual refresh)_

- **Symptom.** After listening to a podcast and going back, the Explore card's progress bar stayed where it was when the list first loaded. Reopening the podcast resumed at the right place, so the save itself worked. Videos use the same bar.
- **How it was found.** A temporary `console.log` of `data.progress` in `PodcastCard` showed `percentage: 35` while the bar on screen still drew about 71%, the value from the first load. The data was fresh, and the drawing was stale.
- **Cause.** Two problems on top of each other.
  - **The bar read its prop once.** `UProgressBar` keeps the width in `useSharedValue(percentage)`. A shared value, like `useState`, only uses its argument on the first render. With `isAnimate` off, the effect returned early, so a new `percentage` never reached the bar.
  - **The list cache was never told.** `updateMediaProgress` only invalidated `MediaDetail`. The Explore list lives in a different api slice, `exploreApi.getMedia`, and RTK Query tags only reach endpoints in the same `createApi`. So even a working bar would have shown old data until the 5-minute cache expired.
- **Fix.**
  - `src/components/core/display/uProgressBar.tsx`: when not animating, the effect sets `progressWidth.value = percentage` on every change.
  - `src/store/api/mediaApi.ts`: the mutation also invalidates its own `'Media'` lists, and after success dispatches `exploreApi.util.invalidateTags(['Media'])`, the same pattern `libraryApi` already uses for the home feed.
- **Measured.** The podcast was seeked to 24:29 of 33:11 and the screen was left. Before the fix the card stayed at about 71%. After it, the card showed 74% with no manual refresh.
- **Also checked.** The audiobook "time left" on Home did update; my first read was simply before the refetch landed.
- **Say it.** "Progress cards stayed stale after listening. Two bugs: the bar stored its width in a Reanimated shared value, which only reads its initial value, so new props were ignored. And the save mutation invalidated a tag in one API slice while the list lived in another, and tags don't cross slices. I push the new value into the shared value, and invalidate the other slice by hand after the save succeeds."
- **Term.** Initial-value-only hooks (`useState`, `useSharedValue`). Cache invalidation. Tags are scoped to one `createApi`.

---

## 6. Requests and feedback

### 6.1 Sending a chat message fetched twice

- **Cause.** The mutation already invalidates the community's cache tag, which refetches. The code also called `refetch()` by hand.
- **Fix.** Removed the manual `refetch()`.
- **Say it.** "With RTK Query, tag invalidation already refetches. A manual refetch on top just doubles the request."
- **Term.** Cache tags. `invalidatesTags`.

### 6.2 Failures that showed nothing

- **Community send and join:** errors were only logged. Now there is a toast, and a failed message stays in the box so you can retry.
- **Event links:** `Linking.openURL` errors were silent. A live event with no meeting link showed an enabled button that did nothing. Now there is an alert on error, and the button is disabled without a link.
- **Ebook reader:** the loading and downloading screens had no back button. On a large book you were stuck until the download finished. Now both have one, and the download shows a percentage.
- **Profile photo upload:** an upload error was an unhandled promise rejection, with no message. Now there is a toast.
- **Checkout, book load:** a network error showed "Book Not Found". Now it shows the error screen with Retry.

### 6.3 The refresh toast test was flaky

- **Cause.** A real race. `handleRefresh` did not wait for the refetch, so the offline check could run before the request failed.
- **Fix.** `handleRefresh` awaits `refetch()` and checks `result.isError`. The test pulls to refresh with the failure already released.
- **Say it.** "A flaky test is often a real race, not a bad test. This one was right to fail."

### 6.4 Your chat message appeared only after two round trips

_(code done; not yet checked by sending a real message)_

- **Symptom.** Tap send and watch a spinner. The message showed up only after the POST finished and the whole community was fetched again.
- **Cause.** The mutation only invalidated the cache tag, so the screen waited for the refetch before it had anything new to draw.
- **Fix.** An optimistic update in `sendThread`'s `onQueryStarted` (`src/store/api/exploreApi.ts`): `updateQueryData` pushes the message into the cached thread list right away, the tag refetch then swaps in the server's copy, and on failure `patch.undo()` takes it back out. The text stays in the box for a retry, as before.
- **Also.** `ThreadResponse.createdAt` was typed `Date`, but JSON gives a string. It is now `string | null`, so the optimistic message stores an ISO string and Redux never holds a non-serializable `Date`.
- **Say it.** "Sending felt slow because the UI waited for a full refetch. I insert the message into the RTK Query cache optimistically, let the tag refetch reconcile it, and undo the patch if the request fails."
- **Term.** Optimistic update. `updateQueryData`. `patch.undo()`.

### 6.5 The chat polled when nobody was reading it

- **Symptom.** The community refetched every 30 seconds on the About view and before you had joined, where no messages are shown.
- **Fix.** `useCommunityDetail(id, isChatVisible)` polls only when you have joined and the chat is on screen. Whether you have joined comes from the cached result through `useQueryState`, which reads the cache without starting a second request. `src/communityDetail/hooks/useCommunityDetail.ts`.
- **Measured.** A poll that returns no new messages already costs 0 React commits: RTK Query keeps the same data object when the response is deep-equal (structural sharing). So the saving here is network and battery, not rendering.
- **Say it.** "Polling should follow what is on screen. I turn it off on the About view, and read the join state from the cache with useQueryState so the polling flag does not depend on its own subscription."
- **Term.** Polling. Structural sharing. `useQueryState`.

### 6.6 The next account saw the previous account's data

_(not yet verified on device)_

- **Symptom.** Log out, log in as someone else: the home screen still showed the first account's feed (continue reading, owned books). Only killing the app fixed it. Found on the 1.2.0 preview build.
- **Cause.** RTK Query keeps responses in memory, keyed by endpoint and arguments, not by user. Logout cleared the auth slice and the persisted storage, never the API caches, and home, library, user and explore keep data for 300 to 600 seconds. The second login hit a fresh cache entry and never asked the server.
- **Fix.** `src/store/resetCacheOnLogout.ts`: a listener middleware on `logOut` that dispatches `resetApiState()` on every API slice. It listens to the action, not the button, so all four logout paths (Settings, delete account, a bad session at launch, a failed token refresh in `baseQuery`) clear the cache. A token refresh keeps the cache. Test: `src/store/__tests__/resetCacheOnLogout.test.ts`.
- **Say it.** "Our cache keys did not include the user, so after a logout the next account was served the previous account's responses. I reset every API cache from a listener on the logout action, so no logout path can skip it, and wrote a test that a logout forces the next request to the network."
- **Term.** Cache invalidation. Listener middleware. Data leak between sessions.

---

### 6.7 An offline request said "Something went wrong"

- **Symptom.** With the phone offline, any failed request showed "Something went wrong. Please try again." The user was never told it was their connection. Confirmed on a real Android device on a 422 kbps link, where a login hung for 12 seconds and was then killed by a wifi handover.
- **Cause.** RTK Query reports a request that never got an answer as `{ status: 'FETCH_ERROR' }` with no `data` field. `extractErrorMessage` tested for `data` first (an API error), then for an `Error` instance. A plain object with a string in `status` matched neither, so it fell through to the generic fallback.
- **Fix.** An `isTransportError` check runs **before** the API-error check in `src/services/error.service.ts`. `FETCH_ERROR` gives "No internet connection. Please check your network.", `TIMEOUT_ERROR` gives "Request timed out. Please try again." A test had pinned the old wrong text with a comment reading "current behaviour, not desired behaviour"; it went red and was replaced with three tests for the new behaviour.
- **Say it.** "A dropped request and a rejected request look nothing alike in RTK Query: one has a string status and no body, the other has a number and a body. We only handled the second, so every offline failure hit the generic fallback. The order of the checks was the bug."
- **Term.** Transport error. `FetchBaseQueryError`.

---

## 7. Accessibility

Found because RNTL queries by role and label. When the query failed, the app was not accessible.

- **`NeonButton`**, the main button on 12 screens, had a role but not `accessible`. VoiceOver read its text and never said "button".
- **The bottom tab bar** was icons only, with no label and no role. A screen reader announced nothing.
- **`UBackButton`** had no label.
- **Say it.** "My tests query the way a screen reader does, by role and label. When a query failed, that was the app telling me it was not accessible. I fixed the component, never the query."

---

### 7.1 The tab bar was invisible to iOS accessibility

_(found and verified with Maestro's view hierarchy on the simulator; VoiceOver not yet checked by hand)_

- **Symptom.** Maestro could not find any `tab-*` button, though the tab bar was on screen and the same IDs work in Detox. Maestro reads the iOS accessibility tree, the same tree VoiceOver uses, so the tabs were likely unreachable for VoiceOver users too.
- **Cause.** The tab bar's outer wrapper (`UAnimatedView`, for its fade-in) had no size of its own. Every child inside it, the scrim and the tab capsule, was `position: absolute`, so the wrapper measured zero height. iOS accessibility skips the children of a zero-size container.
- **Fix.** The wrapper gets a real box: `pos="absolute" left={0} right={0} bottom={0} h={150}`, with `pointerEvents="box-none"` so the page under it stays touchable. The fade-in is unchanged. `src/navigations/bottomNavbar.tsx`.
- **Measured.** `maestro hierarchy` before: no `tab-*` IDs. After: all five.
- **Say it.** "My UI test tool could not see the tab bar. Its wrapper had zero height because everything inside was absolutely positioned, and iOS accessibility skips children of a zero-size view. Giving it a real size fixed the tests and, more importantly, screen reader access."
- **Term.** Accessibility tree. Zero-size container.

### 7.2 Chips and tabs were not buttons to VoiceOver

_(found with the simulator's accessibility tree through Mobile MCP; VoiceOver not yet checked by hand)_

- **Symptom.** The Explore and Library chips and the book detail tabs never appeared in the accessibility tree. Changing their role to `button` made them appear at once.
- **Cause.** All of them used `accessibilityRole="tab"`. React Native maps `"tab"` to `UIAccessibilityTraitNone` on iOS (`RCTViewManager.m`): iOS has a tab bar trait for the container, but no trait for one tab. So the chip had no trait at all, and VoiceOver would read "Blogs" as plain text, never saying it can be tapped.
- **Fix.** `accessibilityRole="button"` with `accessibilityState={{ selected }}` in `uButtonTabs.tsx` and `TabBar.tsx`. It reads "Blogs, selected, button", the same pattern as a native segmented control.
- **Say it.** "React Native's `tab` role maps to no trait on iOS, so my tabs were silent text to VoiceOver. A selected button is what iOS itself uses."
- **Term.** Accessibility traits. Role mapping.

### 7.3 The selected chip was never announced as selected

- **Cause.** The chip's accessibility props sat on `Animated.createAnimatedComponent(XStack)`. Role and label reached iOS through it; `accessibilityState` did not. `aria-selected` did not help either.
- **Fix.** Press handlers and accessibility props moved to a plain `XStack`; the animated pill sits inside it. `src/components/core/buttons/uButtonTabs.tsx`.
- **Measured.** The tree showed `Button 'Blogs'` before, `Button 'Blogs' [selected]` after.
- **Say it.** "The state got lost through the Reanimated wrapper. I keep accessibility on a plain view and animate a child."

### 7.4 Icon glyphs leaked into labels

- **Symptom.** The Order button read ", ORDER" and Listen Now ", LISTEN NOW". The search field's icon and the podcast hero icon were their own unreadable elements.
- **Cause.** Icon fonts render a `Text` holding a private-use character. React Native builds a button's label by joining its children's labels (`RCTRecursiveAccessibilityLabel`), glyph included. An empty label does not help: the text view falls back to its text when the label is empty.
- **Fix.** Two parts. Every `Ionicons` and `Feather` is hidden from screen readers through `defaultProps` in `app/_layout.tsx`, so a glyph is never its own element. And the four `NeonButton`s with icon-plus-text children (Order, Retry, Submit Review, Join or Maps) pass an explicit `accessibilityLabel`; with a label, React Native never walks the children.
- **Say it.** "Icon fonts are text to the accessibility layer. I hid all icons in one place, and gave icon-plus-text buttons an explicit label."
- **Term.** Recursive accessibility label. Private Use Area glyphs.

### 7.5 One fact, several stops

- **Symptom.** VoiceOver would stop on "DATE", then "Dec 17, 2025"; on a chat bubble's initials, name, text and time separately; and on "Rated 0 out of 5 stars" followed by "No ratings".
- **Fix.** The row is one element with `accessibilityRole="text"` and a full label: `EventInfo` rows ("Date, Dec 17, 2025"), the book hero rating row ("No ratings yet" or "Rated 4.3 out of 5, 12 ratings"), and each chat bubble ("You: Hey, Oct 24, 4:56 PM"). The Push Notifications row hides its text, because the switch carries the label and now the subtitle as its hint.
- **Also.** Every `accessible` view without a role got one (`PaginationDots`, `HomeSkeleton`, `AppLoader`, `ReaderFooter`, rating breakdown rows). The search field and the chat box got real labels instead of placeholders. The welcome modal's message lives only in its picture, so its words are now the label.
- **Say it.** "A screen reader user should hear a fact once, in one stop. I merge label and value into one element, the way a native table row does."

### 7.6 The audio slider could not be read or scrubbed

_(not yet verified with VoiceOver: the tool cannot show sliders)_

- **Fix.** The `Slider` in `ProgressDisplay` has `accessibilityRole="adjustable"`, the label "Playback position", a spoken value ("40:30 of 3:17:34"), and `increment` and `decrement` actions that seek 30 seconds. `src/components/core/audio/AudioPlayer.tsx`.
- **Say it.** "A slider must say where it is and accept swipes. Adjustable role, a spoken value, and increment and decrement actions."
- **Term.** Adjustable. `accessibilityActions`.

### 7.7 The largest text sizes broke headings mid-word

_(checked in the simulator at accessibility-extra-extra-extra-large)_

- **Symptom.** At the largest text size, "CONTINUE EXPLORING" split as "EXPLORIN / G", and the banner title cut to "FRO ZE…".
- **Cause.** Headings, labels and wordmarks are wide, letter-spaced capitals in fixed-width places. Scaled 3x, they cannot wrap.
- **Fix.** `UText` sets `maxFontSizeMultiplier` by variant: 2x for reading text, 1.3x for headings, labels and wordmarks. Body text still grows a lot, which is what larger text is for. `src/components/core/text/uText.tsx`.
- **Say it.** "I support larger text, but cap display type, which can't reflow, and let reading text scale to 2x."
- **Term.** Dynamic Type. `maxFontSizeMultiplier`.

### 7.8 Mobile MCP's element list was not the whole truth

- **What happened.** Elements without a trait, sliders and scroll views never appear in the dump, and every text appears twice (React Native's text view reports a child element with the same label). Some "missing" findings were the tool, not VoiceOver.
- **Lesson.** Use the dump to find candidates, then check the reason in React Native's source or with VoiceOver. Here the source settled it: the `tab` role really has no trait.

## 8. UX bugs

### 8.1 The welcome message came back on every launch

_(not yet verified on device)_

- **Symptom.** The launch welcome modal, shown to the emails in the backend's `welcome_banner` config, appeared again on every app launch.
- **Cause.** Closing it only set local state. The API call that records the dismissal was commented out behind a TODO, so `getMe` kept returning `showWelcomeBanner: true`.
- **Fix.** Call the dismiss endpoint on close. The backend sets `welcomeBannerDismissedAt`, and the `User` tag refetches `getMe`, which then returns false. `app/(app)/_layout.tsx`.
- **Say it.** "A 'show once' flag lived only in component state, which resets on every launch. 'Once' has to be stored somewhere that outlives the session. Here the server already supported it, and the call was just never switched on."
- **Term.** Persisted versus session state.

### 8.0 The notification prompt came back on every launch

_(not yet verified on device)_

- **Symptom.** Tap "Not Now" on the notification sheet, or deny notifications once. The sheet appears again on every single app launch.
- **Cause.** The sheet only checked the system permission. After "Not Now" it is still `undetermined`, and after a denial it stays `denied`, so the check passed every time. Nothing remembered that we had already asked.
- **Fix.** Store when the sheet was last shown, and do not show it again for 7 days. People who change their mind can use the Push Notifications toggle in Settings. `src/notifications/components/NotificationPermissionSheet.tsx`.
- **Say it.** "A permission soft prompt has to remember that it asked. Otherwise 'Not now' means 'ask me again in five seconds', which trains people to deny and can get flagged in App Store review."
- **Term.** Soft prompt or pre-permission prompt. Prompt fatigue.

- **Chat bubbles were reversed.** Your own messages were on the left, which is the opposite of every chat app. They are now on the right.
- **Navy behind every screen.** The root view and the app stack still used the old navy `#132440`. It showed through during screen transitions, under overscroll, and between the splash and the first screen. Both now use the page colour `#020103`, the same as the new splash. _(not yet verified on device)_
- **An ended in-person event** still showed an active "Open in Maps" button. It now says "Event has ended".

### 8.2 The chat input floated above the bottom of the screen

_(checked in the simulator: closed and with the keyboard open)_

- **Symptom.** The "Type a message" bar sat about 68 px above the bottom edge, with an empty band under it. With the keyboard open it floated 34 px above the keyboard.
- **Cause.** The safe area was added twice. `ThreadInput` padded its bottom by the inset, and `UKeyboardAvoidingView` renders a `UKeyboardSpacer` under it whose resting height is also the inset. With the keyboard open, the spacer already covers the keyboard, so the bar's own padding was pure extra.
- **Fix.** `ThreadInput` pads 10 px and leaves the safe area to the spacer. The spacer is painted in the bar's colour (`UKeyboardAvoidingView color={THREAD_BAR_BG}`), so the bar reads as one block down to the screen edge. `src/communityDetail/components/chat/ThreadInput.tsx`, `CommunityChatView.tsx`.
- **Measured.** Gap under the pill: 69 px before, 45 px after (10 px padding plus the 34 px home-indicator area, now in the bar's colour). With the keyboard open, the bar sits directly on the keyboard.
- **Say it.** "Two layers each reserved the safe area. I gave the job to one of them, the keyboard spacer, which already switches between the inset and the keyboard height, and painted it the bar colour."
- **Term.** Safe area insets. Double padding.

### 8.3 Chat details: serif placeholder, no time on messages

- **Serif placeholder.** The chat box used `UInput`'s `dark` variant, which inherited `$cormorantgaramond` from the old design's base style. The variant now sets `$inter`. It is the only user of that variant. `src/components/core/inputs/uInput.tsx`.
- **No time.** Bubbles showed only the date, so every message from one day looked the same. New `formatMessageTime` in `src/utils/helper.ts`: "4:32 PM" today, "Jan 5, 4:32 PM" this year, "Jan 5, 2025, 4:32 PM" before that.

### 8.4 A second "See all" opened the wrong Library filter

_(not yet verified on device)_

- **Symptom.** Tap Audiobooks "See all" on Home: Library opens on Audiobooks. Tap the All chip, go back, tap Audiobooks "See all" again: Library stays on All.
- **Cause.** Library is a tab, so it stays mounted. The filter followed the `tab` route param through a `useEffect`. The second link sent the same value, `'audiobook'`, so the effect's dependency never changed and it never ran.
- **Fix.** Library clears the param once it has used it (`router.setParams({ tab: undefined })`). Every link now changes the param from empty to a value. `src/library/hooks/useLibraryData.ts`. Pinned by `src/library/hooks/__tests__/useLibraryData.test.tsx`, which failed before the fix.
- **Say it.** "A route param is state, not an event. The effect only fires when the value changes, so the same link twice did nothing. I consume the param and clear it, so each navigation is a new change."
- **Term.** Route params as one-shot events. Effect dependencies.

### 8.5 The purple haze stopped short after rotating an iPad

_(checked in the iPad Pro 13 simulator, portrait to landscape)_

- **Symptom.** After rotating to landscape, the purple glow at the top of a tab screen ended in a hard vertical edge at the old portrait width. The right third of the screen had no glow.
- **Cause.** Every tab screen sits on `UScreenLayout`, which draws the glow as an SVG `RadialGradient` with the id `screenHaze`. Tabs stay mounted, so five SVGs used the same id at once. On iOS, react-native-svg resolved the id to a gradient from another screen, measured for the old size. Remounting the SVG on resize did not help, which ruled out a stale size on the SVG itself.
- **Fix.** Two causes, two fixes, both in `src/components/core/layout/UScreenLayout.tsx`. Each screen gets its own id from `useId()`. And the Svg is sized from `useWindowDimensions` and keyed on that size: a tab that was hidden during the rotation never re-laid out its percentage-sized Svg, so the id fix alone still left Profile with the old edge.
- **Say it.** "Two bugs stacked. An SVG id is meant to be unique, like an HTML id, and five mounted tabs shared one, so iOS drew the wrong gradient. Then a tab hidden during a rotation kept its old size. A per-instance id from `useId`, and sizing the SVG from the window with a key on that size, fixed both."
- **Term.** Duplicate SVG ids. `useId`.

### 8.6 The toast jumped in, as if it lagged

_(not yet verified on device)_

- **Symptom.** A toast dropped in from above the screen, went past its spot, bounced back and settled. It read as lag or a glitch.
- **Cause.** The enter animation was `SlideInUp.springify().damping(18)`: a spring over the full toast height, under-damped enough to overshoot.
- **Fix.** `FadeInUp.duration(220)` with an ease-out curve, and `FadeOutUp.duration(160)`: a short move with a fade, no spring. On wide screens the toast is capped at `FORM_WIDTH` and centred instead of spanning the window. `src/components/core/toast/toast.tsx`.
- **Say it.** "A spring overshoots unless it is critically damped, and over a long distance the overshoot is visible. For a status message I used a short timed fade, which arrives and stops."
- **Term.** Spring damping and overshoot. Layout animations (entering, exiting).

---

## 9. CI/CD

### 9.1 Two quick merges could submit the wrong build

_(not yet verified in CI)_

- **Symptom.** Merge two PRs with native changes a few minutes apart. The store could receive build B under the run for A, and the release tag could point at a commit that was not in the store.
- **Cause.** Native builds started on every merge that touched certain paths, with no `concurrency` group, so two builds ran at once. The submit workflow used `eas submit --latest`, which means "the newest build on EAS", not "the build this run made".
- **Fix.** Store releases start only from a `v*` tag, one at a time (`concurrency`), and use `eas build --auto-submit`, which submits the build that command produced. Merges to main only ship OTA, to testers first, then a Promote button copies the same bundle to everyone.
- **Say it.** "The pipeline built and submitted on merge, and the submit step picked 'latest'. With two merges close together, latest could be the other build. I moved store releases behind an explicit tag, made them run one at a time, and submit the exact build. Merges only ship over-the-air, to testers first."
- **Term.** Race condition in CI. Release tagging. Staged rollout.

### 9.2 A native change without a version bump had no guard

- **Cause.** OTA updates reach phones by runtime version, which here is the `app.json` version. If a PR changed native code but not the version, the OTA guard saw "a build with this version exists" and published JS to phones that did not have the new native code.
- **Fix.** `native-check.yml` compares the Expo fingerprint of the PR against its base and fails the PR when native changed and the version did not.
- **Say it.** "OTA safety depended on a human remembering to bump the version. I turned that into a failing PR check by hashing the native layer."
- **Term.** Runtime version. Expo fingerprint.

### 9.4 Every OTA from CI crashed on launch and rolled back

- **Symptom.** The logout fix reached the phone over the air, but the app still showed the old account. Sentry had no "OTA update launched" event. A clean install downloaded the update, then the app crashed on the next open and came back on the built-in bundle.
- **Cause.** `eas update` in `eas-update.yml` ran without `--environment`, so the EAS environment variables were never loaded. `EXPO_PUBLIC_*` values are inlined at bundle time, so the OTA bundle had no API URL. `env.ts` throws on startup when validation fails. expo-updates' error recovery then crashed the app (`ErrorRecovery.crash()`, found in the iPhone's crash report, symbolicated with the dSYM from Sentry) and rolled back to the embedded bundle for good. EAS builds were fine because a build profile loads its environment by name.
- **Fix.** `eas update --branch preview --environment preview`. Checked by grepping the downloaded OTA bundle: the API host was missing from it and present in the build's `main.jsbundle`.
- **Say it.** "The update shipped, but it had no config in it. Env vars are baked in at bundle time, and the update command never loaded them, so the app threw at startup and expo-updates rolled back silently. I found it from the device crash report, not from Sentry, because the crash happens before Sentry starts."
- **Term.** Build-time env inlining. OTA rollback (expo-updates error recovery). Crash symbolication.

### 9.5 The next account opened e-books at the last account's page

_(not yet verified on device)_

- **Symptom.** Found by reading the code, after the logout cache fix. Account A reads a book, logs out, account B logs in on the same phone. B opens the same book at A's page, and leaving the reader saves A's page to B's account. Within 55 minutes of A opening a book, B could also read it without owning it.
- **Cause.** `bookProgress.ts` keys AsyncStorage by book only: `BOOK_PDF_PROGRESS_<id>` and `BOOK_URL_CACHE_<id>`. Nothing cleared them on logout. Local progress wins over the server when it is newer. A cached signed URL plus the PDF on disk opens the reader before the access check.
- **Fix.** `clearAllBookStorage()` removes both prefixes. `resetCacheOnLogout` calls it, so every logout path clears it. The PDF files stay: without a cached URL the reader checks access with the server first.
- **Say it.** "Clearing the Redux cache was not enough, because some user data lived in device storage under keys with no user in them. I cleared it in the same logout listener, so one place covers every way of logging out."
- **Term.** Per-user storage scoping. Logout cleanup.

---

## 10. Toolchain upgrades (Xcode 27, Expo SDK 55)

### 10.1 Xcode 27 refused pods with an old minimum iOS

- **Symptom.** After installing Xcode 27, the local iOS build failed with no code change: `The iOS Simulator deployment target 'IPHONEOS_DEPLOYMENT_TARGET' is set to 9.0, but the range of supported deployment target versions is 15.0 to 27.1.x`. 17 pod targets, among them Stripe's resource bundles, Sentry, SDWebImage and Lottie.
- **Cause.** Those pods still declare iOS 9.0 to 13.4 as their minimum. Xcode 26 only warned. Xcode 27 makes it an error.
- **Fix.** A config plugin, `plugins/withPodsDeploymentTarget.js`, adds a `post_install` step to the Podfile that raises every pod below 15.1 to 15.1, the app's own minimum. A plugin, because `ios/` is regenerated by prebuild and a hand edit would be lost.
- **Say it.** "The new Xcode turned a warning into an error for dependencies with an old deployment target. The native folder is generated, so I wrote a small config plugin that patches the Podfile on every prebuild instead of editing generated files."
- **Term.** Minimum deployment target. Continuous Native Generation (CNG). Config plugin.

### 10.2 Stripe did not compile with Xcode 27

- **Symptom.** `enumeration redeclared with different underlying type 'NSInteger' (aka 'long') (was 'NSUInteger' (aka 'unsigned long'))` for `STPPaymentStatus`.
- **Cause.** `@stripe/stripe-react-native` 0.50.3 forward-declares the enum as `NSUInteger` in `StripeSwiftInterop.h`. Xcode 27's Swift compiler generates it as `NSInteger`. Stripe fixed the header in a later release.
- **Fix.** Upgraded to Expo SDK 55, which pins Stripe 0.63.0. No hand patch.
- **Say it.** "A compiler upgrade exposed a mismatch between a library's hand-written header and the header Swift generates. The library had already fixed it, so the right move was to upgrade rather than patch."
- **Term.** Swift/Objective-C interop. Generated `-Swift.h` header.

### 10.3 expo-router used an iOS 16 API on an iOS 15 target

- **Symptom.** On SDK 55 with Xcode 27: `LinkPreviewNativeActionView.swift:141:20: error: 'subtitle' is only available in iOS 16.0 or newer`.
- **Cause.** expo-router 55.0.18 sets `UIAction.subtitle` without an availability check, while SDK 55 still supports iOS 15.1. From SDK 56 the minimum is iOS 16.4, so the same line compiles there.
- **Fix.** `patches/expo-router@55.0.18.patch` (pnpm `patchedDependencies`) wraps the line in `if #available(iOS 16.0, *)`. On iOS 15 the menu item shows no subtitle. Delete the patch when moving to SDK 56.
- **Say it.** "A dependency called a newer API than its minimum OS allowed. The newer SDK raises the minimum, but this is the last SDK for iOS 15 users, so I kept a one-line patch with an availability check and noted when to remove it."
- **Term.** API availability (`#available`). pnpm patch.

### 10.4 Every Jest suite failed after the SDK 55 upgrade

- **Symptom.** All 21 suites failed before running a test: `[Worklets] Native part of Worklets doesn't seem to be initialized`. Then component suites failed with `Incorrect version of "react-test-renderer" detected. Expected "19.2.0", but found "19.1.0"`.
- **Cause.** `react-native-worklets` 0.7 throws on import when its native module is missing, and Jest has no native side. React went to 19.2.0, and RNTL needs `react-test-renderer` at exactly the same version.
- **Fix.** `jest.mock('react-native-worklets', () => require('react-native-worklets/src/mock'))` before Reanimated loads in `jest.setup-after-env.js`, and `react-test-renderer@19.2.0`.
- **Say it.** "Jest runs JavaScript only, so any library that needs its native half on import has to be mocked at that boundary. And the test renderer is pinned to React's exact version, so every React upgrade moves it too."
- **Term.** Native module mock. Peer dependency.

### 10.5 The splash logo shrank after moving to SDK 56

_(checked on the simulator, not yet on device)_

- **Symptom.** After the SDK 56 upgrade the launch screen showed the logo as a tiny mark in the middle instead of across the screen.
- **Cause.** SDK 56 no longer accepts the top-level `splash` block, so it moved into the `expo-splash-screen` plugin. The old block was read as a full-screen image; the plugin's default is a 100 point square (`imageWidth: 100`).
- **Fix.** `"enableFullScreenImage_legacy": true` in the plugin options. The generated `SplashScreen.storyboard` is back to the old 414 by 736 frame.
- **Say it.** "A config migration kept the same keys but changed what the default meant. I compared the generated native file before and after, instead of trusting that the config looked the same."
- **Term.** Launch screen. Config plugin defaults.

## 11. Monitoring (Sentry)

### 11.1 Every event arrived twice

_(not yet verified on device)_

- **Symptom.** Breadcrumbs and events appeared twice in Sentry, and `[Sentry] Initialized successfully` logged twice in production.
- **Cause.** `initSentry` had no guard against a second call, and the root layout module was evaluated twice in production, so two clients ran at once. Separately, `app.json` listed the Sentry plugin twice: `"@sentry/react-native/expo"` with options and a bare `"@sentry/react-native"`. The bare package's `app.plugin.js` is `module.exports = require('./expo')`, so both entries resolved to the same config plugin and its build-time changes were applied twice.
- **Fix.** A module-level `hasInitialized` flag makes `initSentry` idempotent, which is correct whatever makes the module evaluate twice. The duplicate plugin entry was removed.
- **Say it.** "Two Sentry clients were running, so every event was sent twice. I made init idempotent rather than hunt for why the module evaluated twice, because a guard is right either way, and I found a second cause in app.json where the same config plugin was registered under two names."
- **Term.** Idempotent initialisation. Expo config plugin resolution.

### 11.2 `ignoreErrors` filtered nothing

- **Symptom.** `Sentry.init` listed `'Network request failed'` in `ignoreErrors`, yet offline errors kept arriving.
- **Cause.** `ignoreErrors` matches an event's **final** message. `captureApiError` wraps a plain RTK Query rejection in `new Error('API Error: ' + endpoint)` before Sentry ever sees it, so the original text is already gone by the time the filter runs.
- **Fix.** Filter at the call site instead. `handleApiError` decides what reaches Sentry; `ignoreErrors` now carries a comment saying it only sees the rewritten message.
- **Say it.** "The filter ran after our own code had rewritten the message, so it could never match. A filter is only useful where it can still see what it is filtering."
- **Term.** Event processing order.

### 11.3 One broken endpoint appeared as three issues

- **Symptom.** `API Error: auth/login` existed as three separate Sentry issues with 41, 5 and 1 events. None showed the real count. One of them was attributed to `captureStripeError`, which never touched that request.
- **Cause.** Sentry groups events by stack trace unless told otherwise. The `Error` is constructed inside `SentryService`, so the frames above it change with the calling screen and with how each release was symbolicated.
- **Fix.** An explicit grouping key: `fingerprint: ['api-error', endpoint, String(statusCode ?? 'unknown')]`. One endpoint plus one status is now always exactly one issue.
- **Say it.** "Grouping by stack trace splits one bug across however many places call it. I set the fingerprint to what the error actually is, the endpoint and the status, so the count is real. Changing a fingerprint retires the old issues, so expect a fresh set after the next release."
- **Term.** Fingerprint. Issue grouping.

### 11.4 Sentry was a log file, not an error tracker

- **Symptom.** 15 issues and about 200 events, of which 7 were defects. A genuine Android push failure (`Default FirebaseApp is not initialized`) sat unseen for weeks even though the default email alert fired on it.
- **Cause.** Two habits. Expected outcomes were captured as errors: a wrong password (`401`), a wrong verification code (`401`), a duplicate signup (`409`). And `captureMessage` was used as a logger in `OTAUpdateTracker`, with the update uuid inside the message, so **every OTA update created a permanent new issue**. Five of the fifteen issues were that one call.
- **Fix.** `401`, `403` and `409` no longer reach Sentry; `400` deliberately still does, because it means our client sent something the server rejected, which is a defect (a real one was found this way: `400 "Last name is required"`, a gap in the Yup schema). The OTA `captureMessage` was deleted; the `setTags` and `addBreadcrumb` calls above it already carried the same data in a form that filters real issues. Environment now comes from the EAS channel, so testers and store users are separate. 13 issues archived, 1 resolved in next release.
- **Say it.** "Almost everything in Sentry was expected behaviour, so the one real bug was invisible. The alert was not missing, it fired and I ignored it, because thirteen of fifteen emails were noise. The fix was sending fewer events, not writing a better alert."
- **Term.** Alert fatigue. Signal to noise.

---

## How to add an entry

When a bug is fixed, add it under the right section with the same parts: Symptom, Cause, Fix, Say it, Term. Mark it _(not yet verified on device)_ until you have checked it on a device. Then add it to `docs/TODO.md` if it needs a device check.
