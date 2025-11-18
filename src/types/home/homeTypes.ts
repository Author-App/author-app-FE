import { ImageSourcePropType } from 'react-native';

export interface HeroData {
  image: ImageSourcePropType; // ✅ changed from string
  eyebrow?: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  badge?: 'New' | 'Live' | 'Free' | string;
  progress?: number;
  tint?: string;
  icon?: string;
  blurViewIntensity?: number;
}

export interface CarouselItem {
  id: number;
  cover: ImageSourcePropType; // ✅ changed from string
  title: string;
  author?: string;
  narrator?: string;
  duration?: string;
}

export interface CarouselData {
  title: string;
  subtype: 'books' | 'audiobooks';
  data: CarouselItem[];
}

export type HomeItem =
  | {
      id: string;
      type: 'hero';
      subtype?: 'book' | 'audiobook' | 'event' | 'promo';
      data?: HeroData;
    }
  | {
      id: string;
      type: 'carousel';
      title: string;
      subtype: 'books' | 'audiobooks' | 'articles';
      data: CarouselItem[];
    };


