import { Dimensions } from 'react-native';

export const HORIZONTAL_PADDING = 20;
export const CARD_GAP = 16;
export const CARD_HEIGHT = 200;
export const IMAGE_WIDTH = 140;

// Responsive card sizing based on screen width
export const getCardWidth = () => {
  const screenWidth = Dimensions.get('window').width;
  const maxWidth = 380;
  
  return Math.min(screenWidth - HORIZONTAL_PADDING * 2, maxWidth);
};
