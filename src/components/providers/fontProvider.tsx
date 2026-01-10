import { PropsWithChildren } from 'react';
import { useFonts } from 'expo-font';

const CormorantGaramond = require('@/assets/fonts/cormorantgaramond.ttf');
const Adamina = require('@/assets/fonts/adamina.ttf');
const DMMono = require('@/assets/fonts/dmmono.ttf');
const DMSans = require('@/assets/fonts/dmsans.ttf');
const PlayfairDisplay = require('@/assets/fonts/PlayfairDisplay.ttf');
const PlayfairDisplayItalic = require('@/assets/fonts/PlayfairDisplay-Italic.ttf');
const PlayfairDisplayBold = require('@/assets/fonts/PlayfairDisplay-Bold.ttf');

const FontProvider = ({ children }: PropsWithChildren) => {
  const [fontsLoaded, fontError] = useFonts({
    Adamina,
    DMMono,
    DMSans,
    CormorantGaramond,
    PlayfairDisplay,
    'PlayfairDisplay-Italic': PlayfairDisplayItalic,
    'PlayfairDisplay-Bold': PlayfairDisplayBold,
  });

  if (!fontsLoaded || fontError) {
    return null;
  }
  return <>{children}</>;
};

export default FontProvider;
