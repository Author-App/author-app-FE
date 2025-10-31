import { PropsWithChildren } from 'react';
import { useFonts } from 'expo-font';

const CormorantGaramond = require('@/assets/fonts/cormorantgaramond.ttf');
const TrajanPro = require('@/assets/fonts/trajanpro.ttf');
const Cinzel = require('@/assets/fonts/cinzel.otf');
const Adamina = require('@/assets/fonts/adamina.ttf');
const SFProDisplay = require('@/assets/fonts/sfpro.ttf');
const DMMono = require('@/assets/fonts/dmmono.ttf');
const DMSans = require('@/assets/fonts/dmsans.ttf');

const FontProvider = ({ children }: PropsWithChildren) => {
  const [fontsLoaded, fontError] = useFonts({
    Adamina,
    SFProDisplay,
    DMMono,
    DMSans,
    Cinzel,
    TrajanPro,
    CormorantGaramond
  });

  if (!fontsLoaded || fontError) {
    return null;
  }
  console.log('Fonts loaded:', fontsLoaded);
  return <>{children}</>;
};

export default FontProvider;
