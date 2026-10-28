export type SizeClass = 'compact' | 'medium' | 'expanded';

export const BREAKPOINT_MEDIUM = 661;
export const BREAKPOINT_EXPANDED = 1024;

interface ClassSizes {
  gutter: number;
  contentMax: number;
  sectionGap: number;
  gridGap: number;
  coverMin: number;
}

export const SIZES: Record<SizeClass, ClassSizes> = {
  compact: { gutter: 16, contentMax: Infinity, sectionGap: 24, gridGap: 12, coverMin: 140 },
  medium: { gutter: 32, contentMax: Infinity, sectionGap: 40, gridGap: 20, coverMin: 150 },
  expanded: { gutter: 48, contentMax: 1280, sectionGap: 48, gridGap: 24, coverMin: 168 },
};

export const COVER_MAX = 240;
export const CARD_MIN_LIST = 320;

export const getSizeClass = (width: number): SizeClass =>
  width >= BREAKPOINT_EXPANDED ? 'expanded' : width >= BREAKPOINT_MEDIUM ? 'medium' : 'compact';

export const columns = (minCardWidth: number, contentWidth: number, gap: number): number =>
  Math.max(1, Math.floor((contentWidth + gap) / (minCardWidth + gap)));
