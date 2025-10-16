import { GetProps, Button as TamaguiButton } from 'tamagui';

import { ButtonVariant } from '@/src/components/core/types/button/buttonVariant';

export interface BaseButtonType
  extends Omit<GetProps<typeof TamaguiButton>, 'variant' | 'size' | 'color'> {
  variant?: ButtonVariant;
}
