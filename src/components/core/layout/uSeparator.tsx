import { GetProps, View, XStack } from 'tamagui';

interface USeparatorProps extends GetProps<typeof View> {
  isDark?: boolean;
}

const USeparator = ({ isDark, ...props }: USeparatorProps) => {
  return (
    <XStack
      h={1}
      bg={isDark ? '$primary9' : '$primary1'}
      opacity={0.1}
      {...props}
    />
  );
};

export default USeparator;
