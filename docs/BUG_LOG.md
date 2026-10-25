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

## The five best stories

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

### 1.3 A failed quote left the old quote payable

_(not yet verified on device)_

- **Symptom.** Change the address to one the print service rejects. The Pay button stays on, with the previous address and price.
- **Cause.** On error, only an error message was set. The previous quote and its params stayed in state.
- **Fix.** A failed quote clears the quote and its params. Pay is disabled while there is a quote error.
- **Say it.** "An error path forgot to clear the previous success. On a payment screen, a failure has to make the old value unusable, not just show a message."
- **Term.** Error state handling. Fail closed.

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

---

## 7. Accessibility

Found because RNTL queries by role and label. When the query failed, the app was not accessible.

- **`NeonButton`**, the main button on 12 screens, had a role but not `accessible`. VoiceOver read its text and never said "button".
- **The bottom tab bar** was icons only, with no label and no role. A screen reader announced nothing.
- **`UBackButton`** had no label.
- **Say it.** "My tests query the way a screen reader does, by role and label. When a query failed, that was the app telling me it was not accessible. I fixed the component, never the query."

---

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

---

## How to add an entry

When a bug is fixed, add it under the right section with the same parts: Symptom, Cause, Fix, Say it, Term. Mark it _(not yet verified on device)_ until you have checked it on a device. Then add it to `docs/TODO.md` if it needs a device check.
