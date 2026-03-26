import { Dimensions } from 'react-native';

export const ITEM_GAP = 16;
export const HORIZONTAL_PADDING = 20;

// Responsive card sizing based on screen width
// Shows: 2 cards on phones, 3 on small tablets, 4 on large tablets
export const getCardDimensions = () => {
  const screenWidth = Dimensions.get('window').width;
  
  let numCards: number;
  if (screenWidth > 900) {
    numCards = 4; // Large tablets
  } else if (screenWidth > 600) {
    numCards = 3; // Small tablets
  } else {
    numCards = 2; // Phones
  }

  // Calculate card width to fit desired number of cards
  // Account for horizontal padding (20 each side) and gaps between cards
  const totalPadding = HORIZONTAL_PADDING * 2;
  const totalGaps = ITEM_GAP * (numCards - 0.5); // Show partial next card
  const cardWidth = Math.floor((screenWidth - totalPadding - totalGaps) / numCards);
  const imageHeight = Math.floor(cardWidth * 1.5); // 2:3 aspect ratio

  return { cardWidth, imageHeight };
};
