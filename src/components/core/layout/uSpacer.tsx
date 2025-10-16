import { Spacer, SpacerProps } from 'tamagui';

const USpacer = (props: SpacerProps) => {
  return (
    <Spacer
      width={props.width || '100%'}
      height={props.height || 180}
      {...props}
    />
  );
};

export default USpacer;
