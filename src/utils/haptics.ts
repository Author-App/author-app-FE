import ReactNativeHapticFeedback, {
  HapticFeedbackTypes,
} from 'react-native-haptic-feedback';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export type HapticType =
  | 'selection'
  | 'impactLight'
  | 'impactMedium'
  | 'impactHeavy'
  | 'notificationSuccess'
  | 'notificationWarning'
  | 'notificationError'
  | 'rigid'
  | 'soft';


export const haptic = (type: HapticType = 'impactLight') => {
  ReactNativeHapticFeedback.trigger(type as HapticFeedbackTypes, options);
};

// Convenience methods for common use cases
export const haptics = {
  /** Light tap - for selections, toggles, minor interactions */
  selection: () => haptic('selection'),

  /** Light impact - small button taps */
  light: () => haptic('impactLight'),

  /** Medium impact - standard button presses */
  medium: () => haptic('impactMedium'),

  /** Heavy impact - significant actions, confirmations */
  heavy: () => haptic('impactHeavy'),

  /** Success feedback - after successful operations */
  success: () => haptic('notificationSuccess'),

  /** Warning feedback - for warnings or cautions */
  warning: () => haptic('notificationWarning'),

  /** Error feedback - for errors or failures */
  error: () => haptic('notificationError'),

  /** Soft impact - gentle feedback (iOS 13+) */
  soft: () => haptic('soft'),

  /** Rigid impact - firm feedback (iOS 13+) */
  rigid: () => haptic('rigid'),
};

export default haptics;
