import { memo } from 'react';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { getTokenValue } from 'tamagui';

import UText, { UTextProps } from '@/src/components/core/text/uText';

// The brand's purple gradient text (website .text-gradient-purple, 135deg).
// The text is drawn twice: once as the mask, once invisible to give the gradient its size.
const UGradientText = (props: UTextProps) => {
  const colors = [
    getTokenValue('$textPrimary', 'color'),
    getTokenValue('$magentaGlow', 'color'),
    getTokenValue('$glowPurple', 'color'),
  ] as const;

  return (
    <MaskedView maskElement={<UText {...props} />}>
      <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <UText {...props} opacity={0} />
      </LinearGradient>
    </MaskedView>
  );
};

export default memo(UGradientText);
