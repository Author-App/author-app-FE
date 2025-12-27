// ============================================
// MOTION CONSTANTS — Cinematic + Literary
// Use with Reanimated animations
// ============================================

export const motion = {
  duration: {
    fast: 150,      // Micro-interactions: button press, toggle
    normal: 250,    // Standard transitions: page elements
    slow: 400,      // Emphasis: modals, sheets
    xslow: 600,     // Cinematic: splash, major reveals
  },

  spring: {
    // Snappy — buttons, toggles, small elements
    snappy: { damping: 20, stiffness: 300, mass: 0.8 },

    // Default — cards, list items, standard UI
    default: { damping: 18, stiffness: 180, mass: 1 },

    // Gentle — sheets, modals, overlays
    gentle: { damping: 22, stiffness: 120, mass: 1.2 },

    // Cinematic — hero images, splash, reveals
    cinematic: { damping: 25, stiffness: 80, mass: 1.5 },
  },

  bezier: {
    easeOut: [0.25, 0.1, 0.25, 1] as const,
    easeIn: [0.42, 0, 1, 1] as const,
    easeInOut: [0.42, 0, 0.58, 1] as const,
  },
} as const;

// Type exports for usage
export type SpringPreset = keyof typeof motion.spring;
export type DurationPreset = keyof typeof motion.duration;
