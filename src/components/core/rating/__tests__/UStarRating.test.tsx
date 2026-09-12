import { renderWithProviders, screen } from '@/src/test-utils/render';
import UStarRating, { getStarFillPercentage } from '../UStarRating';

describe('getStarFillPercentage', () => {
  it('fills a star completely when the rating reaches it', () => {
    expect(getStarFillPercentage(3, 1)).toBe(1);
    expect(getStarFillPercentage(3, 3)).toBe(1);
  });

  it('leaves a star empty when the rating has not reached it', () => {
    expect(getStarFillPercentage(3, 4)).toBe(0);
    expect(getStarFillPercentage(0, 1)).toBe(0);
  });

  it('fills only part of the star the rating lands inside', () => {
    expect(getStarFillPercentage(2.4, 3)).toBeCloseTo(0.4);
    expect(getStarFillPercentage(4.5, 5)).toBeCloseTo(0.5);
  });

  // Ratings come from an API average, so a negative is possible if the data is bad.
  it('leaves every star empty for a negative rating', () => {
    expect(getStarFillPercentage(-1, 1)).toBe(0);
  });
});

describe('UStarRating', () => {
  it('announces the rating to a screen reader', () => {
    renderWithProviders(<UStarRating rating={4.5} />);

    expect(screen.getByLabelText('Rated 4.5 out of 5 stars')).toBeOnTheScreen();
  });

  // Regression: the fill math used to be memoised with empty deps, so a new rating
  // on an already mounted component was ignored. Happens after a refetch, and on
  // every recycled row in the FlashList of reviews.
  it('updates when the rating changes on an already mounted component', () => {
    const { rerender } = renderWithProviders(<UStarRating rating={0} />);

    rerender(<UStarRating rating={5} />);

    expect(screen.getByLabelText('Rated 5 out of 5 stars')).toBeOnTheScreen();
  });
});
