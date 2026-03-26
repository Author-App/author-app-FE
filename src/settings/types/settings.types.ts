/**
 * Settings Types
 *
 * Type definitions for settings screen components.
 * User types are now imported from central types.
 */

// Re-export UserData from central types for backwards compatibility
export type { UserData, GetMeResponse as GetMeResponseData, DeleteAccountResponse } from '@/src/types/api/user.types';

// Settings option item
export interface SettingsOption {
  id: string;
  label: string;
  icon: string; // Ionicons name
  iconColor?: string;
  onPress: () => void;
  rightComponent?: React.ReactNode;
  showArrow?: boolean;
  destructive?: boolean;
  subtitle?: string;
}

// Settings section with grouped options
export interface SettingsSection {
  id: string;
  title: string;
  icon?: string;
  options: SettingsOption[];
}
