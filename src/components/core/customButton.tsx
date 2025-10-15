import React from 'react'
import { Button, Spinner, Text, YStack } from 'tamagui'
import { ICustomButton } from '@/constants/Interfaces'

const CustomButton: React.FC<ICustomButton> = ({
  buttonText,
  disabled = false,
  loading = false,
  onPress,
  buttonType = 'primary',
  color,
  style,
}) => {

  const getButtonStyles = () => {
    switch (buttonType) {
      case 'primary':
        return {
          bg: disabled ? '$neutral3' : '$primary7',
          color: '$white',
        }
      case 'secondary':
        return {
          bg: '$neutral1',
          color: '$primary7',
          borderColor: '$primary7',
          borderWidth: 1,
        }
      default:
        return {
          bg: '$primary7',
          color: '$white',
        }
    }
  }

  const { bg, color: textColor, borderColor, borderWidth } = getButtonStyles()

  return (
    <Button
      disabled={disabled || loading}
      onPress={onPress}
      // backgroundColor={bg}
      bg={bg}
      borderColor={borderColor}
      borderWidth={borderWidth}
      borderRadius={12}
      height={48}
      pressStyle={{ opacity: 0.8, scale: 0.97 }}
      animation="bouncy"
      opacity={disabled ? 0.6 : 1}
      {...style}
    >
      {loading ? (
        <YStack ai="center" jc="center">
          <Spinner color={textColor} />
        </YStack>
      ) : (
        <Text
          color={textColor}
          fontSize={16}
          fontWeight="700"
          textAlign="center"
        >
          {buttonText}
        </Text>
      )}
    </Button>
  )
}

export default CustomButton
