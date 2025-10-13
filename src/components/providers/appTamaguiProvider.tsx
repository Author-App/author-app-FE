import config from '@/tamagui.config';
import { PropsWithChildren } from 'react';
import { TamaguiProvider } from 'tamagui';

export default ({ children }: PropsWithChildren) => (
  <TamaguiProvider config={config}>
    {children}
  </TamaguiProvider>
)