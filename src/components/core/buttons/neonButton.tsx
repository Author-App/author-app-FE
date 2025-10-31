import { LinearGradient } from '@tamagui/linear-gradient'
import { ActivityIndicator } from 'react-native'
import { Button } from 'tamagui'
import UText from '../text/uText'
import { ButtonProps } from './uButton'
import { StyleProp } from 'react-native'
import { ViewStyle } from 'react-native'

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
            {...props}
            h={56}
            px={24}
            br={9999}
            color="white"
            fontWeight="600"
            borderWidth={1}
            borderColor="#33CFFF55"
            shadowColor="#00BFFF"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.4}
            shadowRadius={10}
            pressStyle={{ opacity: 0.9 }}
            style={style}
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


// import { Button } from 'tamagui'

// export function NeonButton({ children, ...props }) {
//   return (
//     <Button
//       {...props}
//       h={56}
//       px={24}
//       br={9999}
//       bg="linear-gradient(180deg, #1A4D7A 0%, #092038 100%)"
//       shadowColor="#00BFFF"
//       shadowOffset={{ width: 0, height: 2 }}
//       shadowOpacity={0.4}
//       shadowRadius={10}
//       borderWidth={1}
//       borderColor="#33CFFF55"
//       color="white"
//       fontWeight="600"
//       pressStyle={{
//         bg: 'linear-gradient(180deg, #21659B 0%, #0A2542 100%)',
//         shadowOpacity: 0.2,
//       }}
//     >
//       {children}
//     </Button>
//   )
// }