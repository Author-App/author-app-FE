import React from 'react';
import { YStack } from 'tamagui';

import SettingsSection from './SettingsSection';
import SettingsOptionItem from './SettingsOptionItem';
import type { SettingsSection as SettingsSectionType } from '../types/settings.types';

interface SettingsSectionListProps {
  sections: SettingsSectionType[];
  renderOptionRight: (optionId: string) => React.ReactNode;
  // Keeps the entrance stagger running on across two panes
  delayOffset?: number;
}

const SettingsSectionList = ({ sections, renderOptionRight, delayOffset = 0 }: SettingsSectionListProps) => (
  <>
    {sections.map((section, sectionIndex) => {
      const isDangerZone = section.id === 'danger';
      return (
        <SettingsSection
          key={section.id}
          section={section}
          animationDelay={200 + (delayOffset + sectionIndex) * 100}
          isDangerZone={isDangerZone}
        >
          {section.options.map((option, optionIndex) => (
            <React.Fragment key={option.id}>
              <SettingsOptionItem
                option={option}
                isDangerZone={isDangerZone}
                rightComponent={renderOptionRight(option.id)}
              />
              {optionIndex < section.options.length - 1 && (
                <YStack h={1} bg={isDangerZone ? 'rgba(255,60,60,0.2)' : '$glassBorder'} />
              )}
            </React.Fragment>
          ))}
        </SettingsSection>
      );
    })}
  </>
);

export default SettingsSectionList;
