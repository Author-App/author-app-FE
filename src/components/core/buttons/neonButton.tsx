import { LinearGradient } from 'expo-linear-gradient'
import { ActivityIndicator,StyleProp, ViewStyle } from 'react-native'
import { Button } from 'tamagui'
import UText from '@/src/components/core/text/uText'
import { ButtonProps } from '@/src/components/core/buttons/uButton'

type NeonButtonProps = ButtonProps & {
    loading?: boolean
    style?: StyleProp<ViewStyle>
    children?: React.ReactNode
}

export function NeonButton({
    children,
    style,
    loading,
    ...props }: NeonButtonProps) {
    return (
        <Button
            h={56}
            px={24}
            br={9999}
            color="white"
            backgroundColor={'#1A4D7A'}
            fontWeight="600"
            borderWidth={1}
            borderColor="#33CFFF55"
            shadowColor="#00BFFF"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.4}
            shadowRadius={10}
            pressStyle={{ opacity: 0.9 }}
            style={style}
            {...props}
        >
            <LinearGradient
                colors={['#1A4D7A', '#092038']}
                start={[0, 0]}
                end={[0, 1]}
                style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    borderRadius: 9999,
                }}
            />
            {loading ? (
                <ActivityIndicator size="small" color={'#fff'} />
            ) : (
                <UText variant='text-sm' color="white">
                    {children}
                </UText>
            )}
        </Button>
    )
}