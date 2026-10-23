import { memo } from 'react';
import { XStack, XStackProps } from 'tamagui';

import UText from '@/src/components/core/text/uText';

// Design system badge tones: E-Book purple, Audio cyan, savings gold, sale red
const TONES = {
  purple: { bg: 'rgba(135,54,247,0.18)', border: 'rgba(192,132,252,0.45)', text: '#E9D5FF' },
  cyan: { bg: 'rgba(0,240,255,0.1)', border: 'rgba(0,240,255,0.35)', text: '#67E8F9' },
  gold: { bg: 'rgba(245,158,11,0.16)', border: 'rgba(245,158,11,0.5)', text: '#FCD34D' },
  red: { bg: 'rgba(248,113,113,0.14)', border: 'rgba(248,113,113,0.5)', text: '#FECACA' },
} as const;

interface UBadgeProps extends XStackProps {
  label: string;
  tone?: keyof typeof TONES;
}

/** Small uppercase pill chip: format, type, savings. */
const UBadge = ({ label, tone = 'purple', ...props }: UBadgeProps) => {
  const colors = TONES[tone];

  return (
    <XStack
      alignSelf="flex-start"
      px={10}
      py={4}
      br={999}
      borderWidth={1}
      bg={colors.bg}
      borderColor={colors.border}
      {...props}
    >
      <UText variant="meta-s" color={colors.text}>
        {label}
      </UText>
    </XStack>
  );
};

export default memo(UBadge);
