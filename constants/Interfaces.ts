export interface ICustomButton {
  buttonText: string
  disabled?: boolean
  loading?: boolean
  onPress?: () => void
  buttonType?: 'primary' | 'secondary' 
  color?: string
  style?: any
}


export interface ICustomInputProps {
  label?: string
  required?: boolean
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  secureTextEntry?: boolean
  keyboardType?: string
  error?: string
  isPhone?: boolean
}