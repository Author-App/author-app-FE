import { PropsWithChildren } from 'react';
import { TextArea as TamaguiTextArea, TextAreaProps } from 'tamagui';

interface UTextAreaProps extends PropsWithChildren<TextAreaProps> {}

const UTextArea = (props: UTextAreaProps) => {
  return (
    <TamaguiTextArea
      minHeight={100}
      fontSize={14}
      lineHeight={1.5 * 14}
      borderWidth={0}
      br={0}
      returnKeyType="default"
      minWidth={100}
      px={16}
      py={12}
      style={{
        fontFamily: 'Adamina',
        textAlignVertical: 'top',
      }}
      onBlur={() => {
        window.scrollTo?.({ top: 0, left: 0, behavior: 'smooth' });
      }}
      {...props}
    >
      {props.children}
    </TamaguiTextArea>
  );
};

export default UTextArea;
