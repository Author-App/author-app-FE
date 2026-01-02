# Potential Crash Issues Found

## 1. `booksApi` Not Registered in Store
**Files affected:**
- `app/(app)/ebookReader/index.tsx`
- `app/(app)/audiobookPlayer/index.tsx`

**Issue:** Both files import `useGetBookDetailQuery` from `@/src/redux2/Apis/Books`, but `booksApi` is **NOT registered** in the Redux store (`src/redux2/Store/index.tsx`). This can cause silent crashes when dispatching/selecting from an unregistered reducer.

**Fix:** Add `booksApi` to store's `rootReducer` and middleware.

---

## 2. Wrong PushToken Slice Import
**File:** `app/_layout.tsx` (line 22)

**Issue:** Imports `setPushToken` from legacy `@/src/redux2/Slice/PushTokenSlice`, but the store uses `@/src/store/slices/pushTokenSlice`. Actions dispatched to the wrong slice won't update state.

**Fix:** Change import to `@/src/store/slices/pushTokenSlice`.

---

## 3. Stale Closure in AudiobookPlayer Cleanup
**File:** `app/(app)/audiobookPlayer/index.tsx` (lines 80-83)

**Issue:** 
```tsx
return () => {
    mounted = false;
    sound?.unloadAsync(); // `sound` from closure may be stale
};
```
The cleanup function captures `sound` from the closure, but `sound` is state that changes. By the time cleanup runs, it might be null or a different instance.

**Fix:** Use a ref for the sound instance instead of state.

---

## 4. expo-av Deprecation Warning
**Files affected:**
- `src/podcastDetail/hooks/useAudioPlayer.ts`
- `src/videoDetail/components/VideoPlayer.tsx`
- `app/(app)/audiobookPlayer/index.tsx`

**Issue:** `expo-av` is deprecated and will be removed in SDK 54. While not causing crashes now, it may have stability issues.

**Fix:** Migrate to `expo-audio` and `expo-video` packages.

---

## Priority After Refactoring
1. **Critical:** Fix #1 (booksApi not registered) - most likely crash cause
2. **High:** Fix #2 (wrong slice import)
3. **Medium:** Fix #3 (stale closure)
4. **Low:** Address #4 (expo-av migration)
