import React from 'react';
import { YStack } from 'tamagui';
import { HeroBanner } from './index';
import { EventBannerData, PromoBannerData, BookBannerData, AudiobookBannerData } from '../../../types/banner/bannerTypes';

// Sample data for each banner type
const sampleEventData: EventBannerData = {
  id: '1',
  bannerType: 'event',
  image: 'https://example.com/event-image.jpg',
  title: 'Author Reading: The Future of Fiction',
  description: 'Join bestselling author for an exclusive reading session',
  date: 'Dec 15, 2024',
  time: '7:00 PM',
  location: 'Downtown Library',
  attendeeCount: 127,
  organizerName: 'Literary Society',
  organizerAvatar: 'https://example.com/organizer-avatar.jpg',
  badges: ['Free', 'Live'],
};

const samplePromoData: PromoBannerData = {
  id: '2',
  bannerType: 'promo',
  image: 'https://example.com/promo-image.jpg',
  title: 'Holiday Book Sale',
  subtitle: 'Get your favorite books at amazing prices',
  description: 'Limited time offer on bestselling books',
  discountPercentage: 50,
  originalPrice: 29.99,
  discountedPrice: 14.99,
  validUntil: 'Dec 31, 2024',
  badges: ['Limited Time', 'Hot Deal'],
};

const sampleBookData: BookBannerData = {
  id: '3',
  bannerType: 'book',
  image: 'https://example.com/book-cover.jpg',
  title: 'The Silent Observatory',
  author: 'Sarah Chen',
  genre: 'Science Fiction',
  publishedDate: '2024-10-15',
  rating: 4.7,
  totalRatings: 1542,
  pageCount: 324,
  readingProgress: 0.35,
  badges: ['Bestseller', 'New Release'],
};

const sampleAudiobookData: AudiobookBannerData = {
  id: '4',
  bannerType: 'audiobook',
  image: 'https://example.com/audiobook-cover.jpg',
  title: 'Mindful Leadership',
  author: 'Dr. Michael Torres',
  narrator: 'James Patterson',
  genre: 'Self-Help',
  duration: '8h 45m',
  listenedProgress: 0.62,
  currentChapter: 'Chapter 7: Building Trust',
  totalChapters: 12,
  badges: ['New Release', 'Popular'],
};

const HeroBannerSamples: React.FC = () => {
  return (
    <YStack space="$4" p="$4">
      {/* Event Banner */}
      <HeroBanner data={sampleEventData} />
      
      {/* Promo Banner */}
      <HeroBanner data={samplePromoData} />
      
      {/* Book Banner */}
      <HeroBanner data={sampleBookData} />
      
      {/* Audiobook Banner */}
      <HeroBanner data={sampleAudiobookData} />
    </YStack>
  );
};

export default HeroBannerSamples;