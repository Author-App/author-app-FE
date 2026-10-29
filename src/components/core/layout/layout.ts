type SizeClass = 'compact' | 'medium' | 'expanded';

const BREAKPOINT_MEDIUM = 661;
const BREAKPOINT_EXPANDED = 1024;

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
export const CARD_MIN_MEDIA = 280;

export const getSizeClass = (width: number): SizeClass =>
  width >= BREAKPOINT_EXPANDED ? 'expanded' : width >= BREAKPOINT_MEDIUM ? 'medium' : 'compact';

// The design's clamp(360, 34%, 440): content stops at 1280, so the 440 cap can never apply
export const paneWidth = (contentWidth: number): number => Math.max(360, contentWidth * 0.34);
export const PANE_GAP = 48;

// Forms on wide screens (auth, edit profile, change password): one column on a glass card
export const FORM_WIDTH = 440;
export const FORM_PANEL = {
  p: 28,
  br: 24,
  bg: '$glassDeep',
  borderWidth: 1,
  borderColor: '$glassBorder',
} as const;
// Reading widths: about 70 characters a line at body 15 and at long-form 17
export const READ_MAX = 560;
export const READ_MAX_LONG = 600;

export const columns = (minCardWidth: number, contentWidth: number, gap: number): number =>
  Math.max(1, Math.floor((contentWidth + gap) / (minCardWidth + gap)));
