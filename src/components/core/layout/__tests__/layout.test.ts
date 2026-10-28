import { columns, getSizeClass, paneWidth } from '../layout';

describe('getSizeClass', () => {
  it.each([
    [402, 'compact', 'iPhone 17 Pro'],
    [660, 'compact', 'one point under medium'],
    [661, 'medium', 'the medium boundary'],
    [744, 'medium', 'iPad mini portrait'],
    [1023, 'medium', 'one point under expanded'],
    [1024, 'expanded', 'the expanded boundary'],
    [1376, 'expanded', 'iPad Pro 13 landscape'],
  ])('gives a %i pt window the %s layout (%s)', (width, size) => {
    expect(getSizeClass(width)).toBe(size);
  });
});

describe('columns', () => {
  it.each([
    ['iPad mini', 680, 150, 20, 4],
    ['iPad Pro 13 portrait', 936, 168, 24, 5],
    ['iPad Pro 13 landscape', 1280, 168, 24, 6],
  ])('fits the designed number of covers on an %s', (_device, content, min, gap, expected) => {
    expect(columns(min, content, gap)).toBe(expected);
  });

  it('fits a card that fills the row exactly, since the last card has no gap after it', () => {
    expect(columns(100, 430, 10)).toBe(4);
  });

  it('never drops to zero columns when the window is narrower than one card', () => {
    expect(columns(168, 100, 24)).toBe(1);
  });
});

// The design's $paneDetail: 34% of the content, never under 360
describe('paneWidth', () => {
  it.each([
    ['never narrower than 360 on the smallest expanded iPad', 936, 360],
    ['34% of the content once that is wider', 1280, 435.2],
  ])('is %s', (_case, content, expected) => {
    expect(paneWidth(content)).toBeCloseTo(expected);
  });
});
