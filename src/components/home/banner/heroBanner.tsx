import React, { useMemo } from 'react';
import { HeroBannerData } from '../../../types/banner/bannerTypes';
import EventBanner from './variants/eventBanner';
import PromoBanner from './variants/promoBanner';
import BookBanner from './variants/bookBanner';
import AudiobookBanner from './variants/audiobookBanner';
import { XStack, XStackProps } from 'tamagui';

interface HeroBannerProps extends XStackProps{
  data: HeroBannerData;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ data, ...props }) => {
  const renderBannerByType = useMemo(() => {
    switch (data.bannerType) {
      case 'event':
        return <EventBanner data={data} />;
      
      case 'promo':
        return <PromoBanner data={data} />;
      
      case 'book':
        return <BookBanner data={data} />;
      
      case 'audiobook':
        return <AudiobookBanner data={data} />;
      
      default:
        // Fallback component or error handling
        console.warn('Unknown banner type')
        return null;
    }
  },[data]);

  return (
    <XStack w="100%" key={data.id} {...props}>
      {renderBannerByType}
    </XStack>
  )
};

export default HeroBanner;

