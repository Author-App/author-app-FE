import { useWindowDimensions } from 'react-native';

import { SIZES, columns, getSizeClass } from './layout';

export const useLayoutClass = () => {
  const { width } = useWindowDimensions();
  const size = getSizeClass(width);
  const sizes = SIZES[size];
  const contentWidth = Math.min(width - sizes.gutter * 2, sizes.contentMax);

  return {
    size,
    ...sizes,
    contentWidth,
    columns: (minCardWidth: number, availableWidth = contentWidth) =>
      columns(minCardWidth, availableWidth, sizes.gridGap),
  };
};
