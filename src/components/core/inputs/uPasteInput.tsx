// import { ForwardedRef, forwardRef } from 'react';
// import { TextInput } from 'react-native';
// import RNPasteInput from '@mattermost/react-native-paste-input';
// import { GetProps, styled } from 'tamagui';

// const TamaguiPasteInput = styled(RNPasteInput, {
//   name: 'PasteInputWrapper',
// });

// interface PasteInputWrapperProps extends GetProps<typeof TamaguiPasteInput> {
//   fontSize?: number;
// }

// const UPasteInput = forwardRef(
//   (
//     { fontSize = 14, ...props }: PasteInputWrapperProps,
//     ref: ForwardedRef<TextInput>
//   ) => {
//     const { style = {}, ...restProps } = props;
//     return (
//       <TamaguiPasteInput
//         ref={ref}
//         h={40}
//         borderWidth={0}
//         br={0}
//         returnKeyType="send"
//         multiline={false}
//         minWidth={100}
//         px={16}
//         py={0}
//         style={{
//           fontFamily: 'Adamina',
//           fontSize,
//           ...(style as object),
//         }}
//         onBlur={() => {
//           window.scrollTo?.({ top: 0, left: 0, behavior: 'smooth' });
//         }}
//         disableCopyPaste={false}
//         {...restProps}
//       />
//     );
//   }
// );

// export default UPasteInput;
