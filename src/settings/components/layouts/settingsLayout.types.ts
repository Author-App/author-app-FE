import type React from 'react';
import type { SettingsSection, UserData } from '../../types/settings.types';

export interface SettingsLayoutProps {
  user?: UserData | null;
  isError: boolean;
  onRetry: () => void;
  sections: SettingsSection[];
  renderOptionRight: (optionId: string) => React.ReactNode;
}
