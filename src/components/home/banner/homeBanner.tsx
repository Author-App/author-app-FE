import { YStack, YStackProps } from "tamagui"

interface HomeBannerProps extends YStackProps {
    title: string
    subtitle: string
    image: string
    link: string   
}
const HomeBanner = ({ title, subtitle, image, link, ...props }: HomeBannerProps) => {
    return (
       <YStack {...props}> 


       </YStack>
    )
}

export default HomeBanner