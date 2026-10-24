/**
 * Settings Types
 *
 * Type definitions for settings screen components.
 * User types are now imported from central types.
 */

// Re-export UserData from central types for backwards compatibility
export type { UserData, GetMeResponse as GetMeResponseData, DeleteAccountResponse } from '@/src/types/api/user.types';

// Icon tile tint. danger also turns the label red.
export type SettingsOptionTone = 'purple' | 'cyan' | 'gold' | 'muted' | 'danger';

// Settings option item
export interface SettingsOption {
  id: string;
  label: string;
  icon: string; // Ionicons name
  tone: SettingsOptionTone;
  onPress: () => void;
  showArrow?: boolean;
  subtitle?: string;
}

// Settings section with grouped options
export interface SettingsSection {
  id: string;
  title: string;
  options: SettingsOption[];
}
