# Testing notes

Every Jest and React Native Testing Library function used in this repo, what it does, and why it is there. Written from the questions asked while building these tests.

RNTL is short for React Native Testing Library.

---

## 1. Rendering

### `render`

Puts a component into a fake tree so you can look at it and interact with it. No screen, no device.

```tsx
render(<SectionHeader title="Featured Books" />);
```

### `renderWithProviders`

Our own wrapper in `src/test-utils/render.tsx`. It calls `render` but first wraps the component in the providers the app needs: Redux, SafeArea and Tamagui.

```tsx
renderWithProviders(<HomeScreen />, { store });
```

Without it a component that reads Redux or Tamagui throws before it renders anything.

It has exactly three providers. Each one was added only after a test failed and named it. Do not add a fourth speculatively.

### `renderHook`

A hook cannot run on its own. React hooks only work inside a component. `renderHook` builds a throwaway component whose only job is to call your hook and hand back what it returns.

```tsx
const { result } = renderHook(() => useHomeData(), { wrapper });
```

### `wrapper`

Anything that has to sit above the component being rendered. For a hook test this is how you supply the Redux Provider.

```tsx
wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
```

### `result.current`

The hook's return value from its most recent render. It updates as the hook re-renders.

Read it fresh every time. Never copy it into a variable, or you will be looking at a stale value.

```tsx
expect(result.current.isLoading).toBe(true);
```

### `rerender`

Renders the **same** component instance again with new props. This is the only way to catch a bug where a component ignores updates.

```tsx
const { rerender } = renderWithProviders(<UStarRating rating={0} />);
rerender(<UStarRating rating={5} />);
```

Mounting a second component would not catch it, because each instance gets its own closure. The bug only appears when one instance lives longer than its props.

---

## 2. Finding things on screen

### `screen`

Where RNTL keeps the last thing you rendered. Saves destructuring the queries out of `render`.

```tsx
screen.getByText('Featured Books');
```

### The three prefixes

| Prefix | Not found | Use it for |
|---|---|---|
| `getBy` | throws | proving something exists |
| `queryBy` | returns `null` | proving something is absent |
| `findBy` | returns a promise, retries | something that appears later |

Using `getBy` to prove absence gives you a thrown error instead of a clean failed assertion. Use `queryBy`.

### The query types

| Query | Finds |
|---|---|
| `getByText` | text a user can read |
| `getByPlaceholderText` | a `TextInput` by its placeholder |
| `getByLabelText` | an element by its `accessibilityLabel` |
| `getByRole` | an element by its role, and only if it is marked accessible |

These are the same things a screen reader sees. That is deliberate. If you cannot find an element this way, the app is usually not accessible, and the fix is app code, not a cleverer query.

`getAllBy...` returns every match instead of one. Useful for counting.

### A trap with `getByRole`

An element can render `role="button"` and still not be found. `getByRole` only matches elements that are also marked `accessible`. Tamagui sets `role` but not `accessible`.

The fix was app code: `UBackButton` got `accessible` and `accessibilityLabel="Go back"`. An icon-only button with no label was broken for a screen reader anyway.

Never route around this with `UNSAFE_getByType` or a `testID` added just for the test. The failing query is the signal.

---

## 3. Doing things

### `fireEvent.press`

Simulates a tap.

```tsx
fireEvent.press(screen.getByLabelText('Go back'));
```

### `fireEvent.changeText`

Simulates typing into a `TextInput`.

```tsx
fireEvent.changeText(screen.getByPlaceholderText('Search...'), 'dune');
```

For a controlled input, assert the **callback**, not the field value. The field only changes when the parent passes a new value down.

### What `fireEvent` does not do

`fireEvent.press` calls the handler directly. It ignores some things that would stop a real finger.

Example: Tamagui disables a button with `pointerEvents: 'none'`. That stops a real tap. `fireEvent.press` can still reach the handler in some cases, so a test asserting "the press did nothing" can pass or fail for the wrong reason.

Two lessons from this:
- Assert what a screen reader is told (`toBeDisabled`) rather than what the press did.
- If a guard matters, put it in JavaScript, not only in a style. Then it is testable.

---

## 4. Waiting

### Synchronous versus asynchronous

Synchronous: you do something, the result is there on the next line.

```tsx
fireEvent.changeText(input, 'dune');
expect(onSearchChange).toHaveBeenCalledWith('dune');   // already true
```

Asynchronous: you do something, the result arrives later.

```tsx
renderHome(store);                                      // request starts
expect(screen.getByText('Dune')).toBeOnTheScreen();     // fails, not there yet
```

That is the whole difference. Async testing means the app is still working when your next line runs.

### `waitFor`

Runs an assertion over and over until it passes or the timeout runs out. A polling loop.

```tsx
await waitFor(() => expect(screen.getByText('Dune')).toBeOnTheScreen());
```

You need it because you do not have a handle on the promise. It lives inside RTK Query. And even after it resolves, React needs a few more ticks to re-render. So you watch for the result instead of awaiting a specific promise.

**Trap:** never put a `fireEvent` inside `waitFor`. It retries the whole callback, so you fire the press four or five times.

```tsx
// wrong
await waitFor(() => {
  fireEvent.press(button);
  expect(thing).toBeOnTheScreen();
});

// right
fireEvent.press(button);
await waitFor(() => expect(thing).toBeOnTheScreen());
```

Only the assertion goes inside.

### What counts as asynchronous

A network request, a debounce or throttle, a `useEffect` that sets state, an animation finishing, `AsyncStorage` or `SecureStore`.

If the value under test can change without you touching it, the test is asynchronous.

### `act`

`waitFor` is about **time**. `act` is about **React knowing**.

React queues state updates and effects, then flushes them when it is ready. `act(fn)` means: run this, then finish every re-render and effect it caused, then give me control back.

**When you need it:** you cause a state update yourself and assert on the very next line, with no `await` in between.

```tsx
act(() => result.current.increment());
expect(result.current.count).toBe(1);   // without act, still 0
```

**When you do not:** when `await waitFor(...)` comes next. `waitFor` already flushes React work on every retry.

`render` and `fireEvent` already wrap themselves in `act`.

**Measured in this repo:** the `useHomeData` tests had seven `act` calls. With them: 88 warnings, 8 passing. Without them: 88 warnings, 8 passing. Identical. Every `release()` was followed by a `waitFor`, so `act` was doing nothing. They were removed.

Short version: **`act` is only for when you refuse to wait.**

---

## 5. Mocking

### The one rule

Mock only the boundary you do not own. Native modules, the network, third-party SDKs. Never a file from `src/`.

Mocking your own file means that if you break that file, the test still passes.

This was caught once in this repo: `src/utils/haptics.ts` was mocked. That is our code. The correct mock was `react-native-haptic-feedback` underneath it.

### Where a mock lives

| How many test files need it | Where it goes |
|---|---|
| several | `jest.setup-after-env.js` |
| one | that test file |

A mock that is also the **assertion target** usually belongs in the one file that asserts on it.

```tsx
const mockBack = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ back: mockBack }) }));
```

A global version would need an exported handle for every file to reach, which is more machinery than one line.

### `jest.fn()`

A fake function that records how it was called.

```tsx
const onPress = jest.fn();
expect(onPress).toHaveBeenCalledTimes(1);
expect(onPress).toHaveBeenCalledWith('dune');
expect(onPress).not.toHaveBeenCalled();
```

### `clearMocks` and `restoreMocks`

Both on in `jest.config.js`. Call history is wiped between tests, and spies go back to the real function. So a mock implementation does not survive from one test into the next.

### Mocking `fetch`

The lowest boundary in the app. Replace it and everything above it runs for real: `baseQuery`, `prepareHeaders`, the 401 refresh logic, the Zod validators in `transformResponse`, the RTK Query cache, the selectors, the hooks, the components.

Mock a query hook instead and none of that runs. You would be testing four lines and pretending you tested forty.

### Holding a request in flight

`mockFetchJson` in `src/test-utils/homeStore.ts` returns a `release`. The request hangs until you call it.

```tsx
const { release } = mockFetchJson(buildHomeFeed());
renderHome(store);

expect(screen.getByText(/* loader */)).toBeOnTheScreen();   // still loading

release();
await waitFor(() => expect(screen.getByText('Dune')).toBeOnTheScreen());
```

Without this the request resolves instantly and the loading state is impossible to observe.

Order matters: fake `fetch` **before** rendering, because rendering is what starts the request.

### When not to call `release`

Only call it when a request actually goes out and you need the response to land.

| Does a request go out? | Call `release()` |
|---|---|
| yes, and you need the response | yes |
| no, validation blocked it | no |

In the login validation tests the form never submits, so nothing is in flight and there is nothing to release.

Set the mock up anyway. Two reasons:

- **It is a guard.** `global.fetch` is now a `jest.fn()`, so if validation ever broke and a request slipped through, `expect(fetchMock).not.toHaveBeenCalled()` catches it.
- **It stays stuck.** A request that should never have been sent hangs forever instead of resolving and quietly changing state halfway through the test.

### Assert the thing that should not happen

When a test's point is that something should **not** happen, say so out loud.

```tsx
await waitFor(() => expect(screen.getByText('Invalid email format')).toBeOnTheScreen());
expect(fetchMock).not.toHaveBeenCalled();
```

"The error message appeared" and "no request was sent" are two different claims. Validation could show the message and still fire the request. Only the second assertion catches that.

---

## 6. Redux and RTK Query

### A real store, never a mock

```ts
export const makeHomeStore = () =>
  configureStore({
    reducer: { auth: authSlice, [homeApi.reducerPath]: homeApi.reducer },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(homeApi.middleware),
  });
```

**A test store needs every slice the code path reads**, not just the one you are asserting on.

That cost seven failing tests once. The error was:

```
TypeError: Cannot read properties of undefined (reading 'token')
    at prepareHeaders (src/store/api/baseQuery.ts:15:49)
```

`prepareHeaders` reads `getState().auth.token`. The store had no `auth` slice, so `fetch` was never reached.

No `redux-persist` in the test store. It only adds storage, and storage is not what these tests are about.

### `upsertQueryData`

Writes a response into the RTK Query cache as if a request had succeeded. For tests that need data present but do not care about the request.

```ts
store.dispatch(homeApi.util.upsertQueryData('getHomeFeed', undefined, response));
```

Better than hand-writing a state object, which would couple the test to RTK Query's internal shape.

### `resetApiState`

```ts
afterEach(() => { store.dispatch(homeApi.util.resetApiState()); });
```

`keepUnusedDataFor: 300` leaves a 300 second timer on cached data. Jest waits for timers, so without this line the test run hangs.

Do not reach for `--forceExit`. That hides leaks instead of fixing them.

### A fresh store per test

```ts
beforeEach(() => { store = makeHomeStore(); });
```

Otherwise the second test reads the first test's cached data and passes for the wrong reason.

---

## 7. Matchers used here

| Matcher | Checks |
|---|---|
| `toBe` | exact equality, for primitives |
| `toEqual` | deep equality, for objects and arrays |
| `toBeCloseTo` | floating point numbers |
| `toHaveLength` | array or string length |
| `toContain` / `not.toContain` | an item in an array |
| `toBeNull` | null |
| `toBeOnTheScreen` | an element is rendered (RNTL) |
| `toBeDisabled` | announces itself as disabled (RNTL) |
| `toHaveBeenCalledWith` | a mock got these arguments |
| `toHaveBeenCalledTimes` | how many times |
| `expect.objectContaining({...})` | an object has at least these fields |

RNTL has **no** `toBeEditable`. Assert the behaviour instead: typing on a disabled field calls nothing. That also survives a matcher rename.

There is no `toBeInTheDocument` either. That is web. React Native has no DOM.

---

## 8. Test structure

```tsx
describe('UBackButton', () => {          // groups related tests
  beforeEach(() => { ... });             // runs before each test in the group
  afterEach(() => { ... });              // runs after each test in the group

  it('goes back when pressed', () => {   // one behaviour
    ...
  });
});
```

Name each `it` after the behaviour, not the code. "says Completed on the last page", not "tests formatPagesLeft".

Nest a `describe` when several tests share setup or a topic.

---

## 9. The proof step

A green test proves nothing. Only a red one does.

For every non-trivial test, break the line in the source it is supposed to cover and confirm that specific test goes red. Then put it back.

If it stays green, one of two things is true and you must find out which:
1. The test is fake.
2. You broke the wrong line.

Both happened while writing these tests.

**Two fake tests this caught:**

`getAllByText(/./)` counted text nodes with at least one character. An empty `<Text>` holds none, so a broken conditional was invisible to it. Replaced with `getAllByRole('text')`, which counts elements regardless of content.

An `isRefreshing` assertion that only looked during a refetch. `isFetching` and `isFetching && !isLoading` behave identically there, because `isLoading` is already false. The missing half only matters on the first load, so a line was added to check that moment.

---

## 10. Kinds of test in this repo

| Kind | Renders | Async | Example |
|---|---|---|---|
| unit, pure function | nothing | no | `currency`, `error.service` |
| component | one component | no | `SectionHeader`, `uSearchbar` |
| unit against a real store | nothing | no | `homeSelectors` |
| hook | a hook, no UI | yes | `useHomeData` |
| integration | a whole screen | yes | `HomeScreen` |

The mocking rule does not change between them. What changes is **how much of the app is running**.

"Real logic, fake data" is the phrase. The API response is a fixture. Redux, RTK Query, selectors, hooks, components and navigation logic are all real.

---

## 11. Debugging a failing test

| Error says | Fix in |
|---|---|
| `Unexpected token 'import'` or `'export'` | `transformIgnorePatterns` in `jest.config.js` |
| `Cannot find module 'react-native-x'` | a mock in `jest.setup-after-env.js` |
| `Missing tamagui config`, `Could not find "store"`, `No safe area value available` | the wrapper in `src/test-utils/render.tsx` |
| `Unable to find an element with text` | the query, or the component |
| `Unable to find an element with role` on something that has a role | the element is not marked `accessible`. App code fix. |
| the run hangs | a timer is still alive. Usually RTK Query's `keepUnusedDataFor`. |

`screen.debug()` prints the rendered tree. First thing to reach for when a query fails.
