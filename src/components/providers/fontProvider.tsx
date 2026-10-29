import { PropsWithChildren } from 'react';
import { useFonts } from 'expo-font';

const CormorantGaramond = require('@/assets/fonts/cormorantgaramond.ttf');
const Adamina = require('@/assets/fonts/adamina.ttf');
const DMMono = require('@/assets/fonts/dmmono.ttf');
const DMSans = require('@/assets/fonts/dmsans.ttf');
const PlayfairDisplay = require('@/assets/fonts/PlayfairDisplay.ttf');
const PlayfairDisplayItalic = require('@/assets/fonts/PlayfairDisplay-Italic.ttf');
const PlayfairDisplayBold = require('@/assets/fonts/PlayfairDisplay-Bold.ttf');
const OrbitronBold = require('@/assets/fonts/Orbitron-Bold.ttf');
const OrbitronBlack = require('@/assets/fonts/Orbitron-Black.ttf');
const JuraBold = require('@/assets/fonts/Jura-Bold.ttf');
const InterRegular = require('@/assets/fonts/Inter-Regular.ttf');
const InterMedium = require('@/assets/fonts/Inter-Medium.ttf');
const InterSemiBold = require('@/assets/fonts/Inter-SemiBold.ttf');
const InterBold = require('@/assets/fonts/Inter-Bold.ttf');

const FontProvider = ({ children }: PropsWithChildren) => {
  const [fontsLoaded, fontError] = useFonts({
    Adamina,
    DMMono,
    DMSans,
    CormorantGaramond,
    PlayfairDisplay,
    'PlayfairDisplay-Italic': PlayfairDisplayItalic,
    'PlayfairDisplay-Bold': PlayfairDisplayBold,
    'Orbitron-Bold': OrbitronBold,
    'Orbitron-Black': OrbitronBlack,
    'Jura-Bold': JuraBold,
    Inter: InterRegular,
    'Inter-Medium': InterMedium,
    'Inter-SemiBold': InterSemiBold,
    'Inter-Bold': InterBold,
  });

  if (!fontsLoaded || fontError) {
    return null;
  }
  return <>{children}</>;
};

export default FontProvider;
