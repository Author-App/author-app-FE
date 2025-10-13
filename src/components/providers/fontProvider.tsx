import { PropsWithChildren } from 'react';
import { useFonts } from 'expo-font';

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
  });

  if (!fontsLoaded || fontError) {
    return null;
  }
  return <>{children}</>;
};

export default FontProvider;
