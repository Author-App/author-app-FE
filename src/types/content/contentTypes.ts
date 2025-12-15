import { ImageSourcePropType } from 'react-native';
import { AVPlaybackSource } from 'expo-av';

// Blog item type
export interface BlogItem {
  id: number;
  title: string;
  author: string;
  date: string;
  readTime: string;
  avatar: ImageSourcePropType;
  cover: ImageSourcePropType;
  content: string;
}

// Podcast item type
export interface PodcastItem {
  id: number;
  cover: ImageSourcePropType;
  title: string;
  description: string;
  duration: string;
  audioUrl: string;
}

// Video item type
export interface VideoItem {
  id: number;
  cover: ImageSourcePropType;
  title: string;
  duration: string;
  video: AVPlaybackSource;
  description: string;
}

// Event item type
export interface EventItem {
  id: number;
  cover: ImageSourcePropType;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'Online' | 'Offline';
  about: string;
}

// Community item type
export interface CommunityItem {
  id: number;
  cover: ImageSourcePropType;
  title: string;
  threads: number;
  description: string;
}

// Union type for all content items
export type ContentItem = BlogItem | PodcastItem | VideoItem | EventItem | CommunityItem;

// Section types
export interface ExploreSection {
  type: 'carousel';
  id: string;
  title: string;
  subtype: 'blog' | 'podcasts' | 'videos' | 'events' | 'community';
  data: ContentItem[];
}
