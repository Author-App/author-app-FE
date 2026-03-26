import { router, Href } from 'expo-router';

export type NotificationType =
  | 'new_book'
  | 'new_audiobook'
  | 'new_podcast'
  | 'new_video'
  | 'community_message'
  | 'event_reminder'
  | 'subscription'
  | 'general';

/**
 * Data structure sent in notification payload
 * Backend should include this in the `data` field of the push notification
 */
export interface NotificationData {
  type: NotificationType;
  // Content IDs for navigation
  bookId?: string;
  audiobookId?: string;
  podcastId?: string;
  videoId?: string;
  communityId?: string;
  eventId?: string;
  articleId?: string;
  // Optional custom screen override
  screen?: string;
}

/**
 * Handles navigation when a notification is tapped
 * 
 * @param data - Notification data from the push payload
 */
export const handleNotificationNavigation = (data: NotificationData): void => {
  console.log('📱 [Notification] Handling tap with data:', data);

  // If a custom screen is specified, navigate directly
  if (data.screen) {
    router.push(data.screen as Href);
    return;
  }

  // Navigate based on notification type
  switch (data.type) {
    case 'new_book':
      if (data.bookId) {
        router.push(`/(app)/book/${data.bookId}` as Href);
      }
      break;

    case 'new_audiobook':
      if (data.audiobookId) {
        router.push(`/(app)/audiobookPlayer/${data.audiobookId}` as Href);
      }
      break;

    case 'new_podcast':
      if (data.podcastId) {
        router.push(`/(app)/podcast/${data.podcastId}` as Href);
      }
      break;

    case 'new_video':
      if (data.videoId) {
        router.push(`/(app)/video/${data.videoId}` as Href);
      }
      break;

    case 'community_message':
      if (data.communityId) {
        router.push(`/(app)/community/${data.communityId}` as Href);
      }
      break;

    case 'event_reminder':
      if (data.eventId) {
        router.push(`/(app)/events/${data.eventId}` as Href);
      }
      break;

    case 'subscription':
      router.push('/(app)/subscription' as Href);
      break;

    case 'general':
    default:
      // For general notifications, just open the app (already open)
      // Could navigate to a notifications list screen in the future
      console.log('📱 [Notification] General notification tapped');
      break;
  }
};
