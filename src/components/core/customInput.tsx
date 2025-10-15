import React, { useState } from 'react'
import { Input, XStack, YStack, Text, Button } from 'tamagui'
import { Eye, EyeOff } from '@tamagui/lucide-icons'
import { Phone } from '@tamagui/lucide-icons'
import { ICustomInputProps } from '@/constants/Interfaces'

const CustomInput: React.FC<ICustomInputProps> = ({
  label,
  required,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType,
  error,
  isPhone = false,
}) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <YStack 
    mb={6}
    // mb={12}
    >
      {label && (
        <XStack 
        mb={6} 
        px={15}
        ai="center">
          <Text fontSize={14} fontWeight="600">
            {label}
          </Text>
          {required && <Text color="red">*</Text>}
        </XStack>
      )}

      <XStack
        ai="center"
        borderWidth={1}
        borderColor={error ? 'red' : '$neutral4'}
        borderRadius={12}
        height={48}
        px={1}
        bg="white"
      >
        {isPhone && (
          <XStack ai="center" mr={8}>
            <Phone size={18} color="gray" />
            <Text ml={4}>+1</Text>
          </XStack>
        )}

        <Input
          flex={1}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType as any}
          borderWidth={0}
          bg="transparent"
        />

        {secureTextEntry && (
          <Button
            chromeless
            position="absolute"
            right={10}
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff size={20} color="gray" />
            ) : (
              <Eye size={20} color="gray" />
            )}
          </Button>
        )}
      </XStack>

      {error && (
        <Text px={16} mt={6} fontSize={12} color="red">
          {error}
        </Text>
      )}
    </YStack>
  )
}

export default CustomInput
