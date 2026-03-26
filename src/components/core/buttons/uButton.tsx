import { forwardRef } from 'react';
import { GetProps, styled, Button as TamaguiButton } from 'tamagui';

const StyledButton = styled(TamaguiButton, {
  padding: 0,
});

export const UButton = forwardRef<
  React.ElementRef<typeof TamaguiButton>,
  Omit<GetProps<typeof TamaguiButton>, 'transition'>
>((props, ref) => {
  return <StyledButton ref={ref} {...props} />;
});

export type ButtonProps = Omit<GetProps<typeof UButton>, 'transition'>;
