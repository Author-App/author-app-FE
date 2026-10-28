import {
  selectHeroBanners,
  selectHomeBanner,
  selectHomeFeedError,
  selectHomeSections,
} from '../homeSelectors';
import { buildHomeFeed } from '@/src/test-utils/homeFeed.fixture';
import { makeHomeStore, seedHomeFeed, type HomeStore } from '@/src/test-utils/homeStore';
import { homeApi } from '@/src/store/api/homeApi';

describe('home selectors', () => {
  let store: HomeStore;

  beforeEach(() => {
    store = makeHomeStore();
  });

  // keepUnusedDataFor is 300 seconds, so a cached entry leaves a timer that
  // keeps the Jest worker alive. Clearing the cache clears the timer.
  afterEach(() => {
    store.dispatch(homeApi.util.resetApiState());
  });

  describe('before the feed has loaded', () => {
    it('hands every list selector an empty array instead of undefined', () => {
      const state = store.getState();

      expect(selectHomeSections(state)).toEqual([]);
      expect(selectHeroBanners(state)).toEqual([]);
    });

    it('has no banner and no error', () => {
      const state = store.getState();

      expect(selectHomeBanner(state)).toBeNull();
      expect(selectHomeFeedError(state)).toBeNull();
    });
  });

  describe('once the feed has loaded', () => {
    it('builds one section per kind of content', async () => {
      await seedHomeFeed(store, buildHomeFeed());

      expect(selectHomeSections(store.getState()).map((s) => s.type)).toEqual([
        'books',
        'articles',
        'audiobooks',
        'continueReading',
      ]);
    });

    it('puts the API items inside their section', async () => {
      await seedHomeFeed(store, buildHomeFeed());

      const sections = selectHomeSections(store.getState());
      const books = sections.find((s) => s.type === 'books');

      expect(books?.data).toEqual([
        { id: 'b1', title: 'Book b1', price: 9.99, currency: 'USD' },
      ]);
    });

    it('skips a section the API returned empty', async () => {
      await seedHomeFeed(store, buildHomeFeed({ articles: [] }));

      const types = selectHomeSections(store.getState()).map((s) => s.type);

      expect(types).not.toContain('articles');
      expect(types).toContain('books');
    });

    it('skips a section the API left out entirely', async () => {
      await seedHomeFeed(
        store,
        buildHomeFeed({ continueReading: undefined as never })
      );

      expect(selectHomeSections(store.getState()).map((s) => s.type)).not.toContain(
        'continueReading'
      );
    });

    it('returns no sections at all when every list is empty', async () => {
      await seedHomeFeed(
        store,
        buildHomeFeed({
          trendingBooks: [],
          articles: [],
          audioBooks: [],
          continueReading: [],
        })
      );

      expect(selectHomeSections(store.getState())).toEqual([]);
    });

    it('reads the banner straight from the cache', async () => {
      await seedHomeFeed(store, buildHomeFeed());

      expect(selectHomeBanner(store.getState())).toEqual({ title: 'Welcome back' });
    });
  });
});
