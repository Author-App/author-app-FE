import React, { useMemo, useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { Text, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { YStack } from 'tamagui';
import { UInputVariant } from '@/src/components/core/types/input/inputVariants';

interface DropdownItem {
  label: string;
  value: string | number;
  id?: string | number;
}

interface UDropdownProps {
  variant?: UInputVariant;
  items: DropdownItem[];
  value: string | number | null;
  name?: string;
  label?: string;
  required?: boolean;
  labelStyle?: any;
  placeholder?: string;
  disabled?: boolean;
  zIndex?: number;
  zIndexInverse?: number;
  onSelectItem?: (item: DropdownItem) => void;
  style?: any;
}

const getVariantStyle = (variant: UInputVariant = 'primary') => {
  const baseStyle = {
    borderWidth: 1,
    borderRadius: 10,
    fontFamily: '$cormorantgaramond',
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
    // borderColor: '#ccc',
    borderColor: '#eaeaeaff',

  };

  switch (variant) {
    case 'primary':
      return {
        ...baseStyle,
        backgroundColor: '#fff',
        color: '#333',
        // borderColor: '#000',
      };
    case 'secondary':
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        color: '#fff',
        borderColor: '#777',
      };
    case 'tertiary':
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        color: '#fff',
        borderColor: '#555',
      };
    default:
      return baseStyle;
  }
};

const UDropdown: React.FC<UDropdownProps> = ({
  variant = 'primary',
  items,
  value,
  name,
  label,
  required,
  labelStyle,
  placeholder = 'Select...',
  disabled = false,
  zIndex = 1000,
  zIndexInverse = 999,
  onSelectItem,
  style,
}) => {
  const [open, setOpen] = useState(false);

  const styles = useMemo(() => getVariantStyle(variant), [variant]);

  return (
    <YStack gap={2} style={[
      // { width: '100%', zIndex, elevation: zIndex, overflow: 'visible' },
      { width: '100%' }, 
      style]}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        // listMode="SCROLLVIEW" 
        listMode="SCROLLVIEW"  
        dropDownDirection="AUTO"
        placeholder={placeholder}
        disabled={disabled}
        onSelectItem={onSelectItem}
        zIndex={zIndex}
        zIndexInverse={zIndexInverse}
        // style={{
        //   backgroundColor: styles.backgroundColor,
        //   borderColor: styles.borderColor,
        //   borderWidth: styles.borderWidth,
        //   borderRadius: styles.borderRadius,
        //   minHeight: 48,
        // }}
        // textStyle={{
        //   color: styles.color,
        //   fontFamily: styles.fontFamily,
        //   fontSize: styles.fontSize,
        // }}
        // dropDownContainerStyle={{
        //   // backgroundColor: styles.backgroundColor,
        //   backgroundColor: 'red',
        //   // borderColor: styles.borderColor,
        //   borderColor: 'pink',
        //   // height: 500,

        //   zIndex: 2000, // 👈 make this higher
        //   elevation: 10, // 👈 for Android
        // }}
        // containerStyle={{
        //   zIndex: 3000, // 👈 very important for iOS
        // }}
        // placeholderStyle={{
        //   color: '#888',
        //   fontFamily: styles.fontFamily,
        // }}
        // disabledStyle={{ opacity: 0.5 }}

      style={{
        backgroundColor: styles.backgroundColor,
        borderColor: styles.borderColor,
        borderWidth: styles.borderWidth,
        borderRadius: styles.borderRadius,
        minHeight: 48,
      }}
      textStyle={{
        color: styles.color,
        fontFamily: styles.fontFamily,
        fontSize: styles.fontSize,
      }}
      dropDownContainerStyle={{
        backgroundColor: styles.backgroundColor,
        borderColor: styles.borderColor,
        zIndex,
      }}
      placeholderStyle={{
        color: '#888',
        fontFamily: styles.fontFamily,
      }}
      disabledStyle={{ opacity: 0.5 }}
      />
    </YStack>

  );
};

export default UDropdown;
