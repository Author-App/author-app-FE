import { memo, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { GetProps } from 'tamagui';

import IconArrowLeft from '@/assets/icons/iconArrowLeft';
import UIconButton from '@/src/components/core/buttons/uIconButtonVariants';
import haptics from '@/src/utils/haptics';

const UBackButton = ({ variant = 'quaternary-sm', onPress, ...props }: GetProps<typeof UIconButton>) => {
  const router = useRouter();

  const navigateBack = useCallback(() => {
    haptics.light();
    router.back();
  }, [router]);

  return (
    <UIconButton
      variant={variant}
      icon={IconArrowLeft}
      onPress={navigateBack}
      {...props}
    />
  );
};

export default memo(UBackButton);
