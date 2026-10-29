import { memo } from 'react';

import UText from '@/src/components/core/text/uText';

interface AuthLinkProps {
  children: string;
  onPress: () => void;
}

/** Cyan text link for the secondary routes off an auth screen. */
const AuthLink = ({ children, onPress }: AuthLinkProps) => (
  <UText
    variant="link"
    color="$accentCyan"
    // 44pt touch target around 20pt of text
    py={12}
    onPress={onPress}
    accessibilityRole="link"
  >
    {children}
  </UText>
);

export default memo(AuthLink);
