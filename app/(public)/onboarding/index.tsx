import assets from '@/assets/images';
import { NeonButton } from '@/src/components/core/buttons/neonButton';
import UTextButton from '@/src/components/core/buttons/uTextButton';
import { useRouter } from 'expo-router';
import { Image, ImageBackground, View } from 'react-native';
import { YStack, Text } from 'tamagui';

export default function OnboardingScreen() {
  const router = useRouter();
  return (
    <ImageBackground
      source={assets.images.authBackgroundImage2}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,

      }}>
        <Image
          source={assets.images.mainLogo}
          style={{
            // width: '100%',
            // height: '40%',
            // flex:0.01,
            flex: 0.45
          }}
          resizeMode='contain'
        />
        <NeonButton
          onPress={() => router.push('/(public)/login')}
          width={'80%'}
        >
          Log In
        </NeonButton>
        <NeonButton
          onPress={() => router.push('/(public)/signup')}
          mt={15} width={'80%'}
        >
          Sign Up
        </NeonButton>
        {/* <UTextButton
          onPress={() => router.push('/(public)/login')}
          variant='secondary-md'
          width={'80%'}
        >
          Log In
        </UTextButton>
        <UTextButton
          onPress={() => router.push('/(public)/signup')}
          variant='secondary-md'
          mt={15} width={'80%'}
        >
          Sign Up
        </UTextButton> */}
      </View>

    </ImageBackground>
  );
}
