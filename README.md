# Author App

A modern React Native application built with Expo, featuring a beautiful tab-based navigation system and elegant design with custom typography.

## 🚀 Features

- **Custom Tab Navigation** - Beautiful bottom navigation bar with smooth animations
- **Modern UI** - Built with Tamagui for consistent, performant styling
- **Custom Typography** - Adamina serif font as the default with additional custom fonts (SF Pro, DM Sans, DM Mono)
- **Custom Color Palette** - Carefully crafted color system with primary sage green palette and neutral tones
- **Cross-Platform** - Works seamlessly on iOS, Android, and Web

## 📱 App Structure

The app includes five main sections:
- **Home** - Featured content and updates
- **Library** - Your personal collection
- **Media** - Audio and video content
- **Store** - Browse and purchase
- **Profile** - User settings and information

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) ~54.0
- **Router**: [Expo Router](https://docs.expo.dev/router/introduction/) v6
- **UI Library**: [Tamagui](https://tamagui.dev/) v1.135
- **Language**: TypeScript
- **Package Manager**: pnpm

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (v10 or higher)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

For mobile development:
- iOS: [Xcode](https://developer.apple.com/xcode/) (Mac only)
- Android: [Android Studio](https://developer.android.com/studio)

Or use [Expo Go](https://expo.dev/client) app on your mobile device for quick testing.

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd author-app
```

2. Install dependencies:
```bash
pnpm install
```

### Running the App

#### Development Server
Start the Expo development server:
```bash
pnpm start
```

This will open the Expo developer tools in your terminal. From here you can:
- Press `i` to open iOS simulator
- Press `a` to open Android emulator
- Scan the QR code with Expo Go app on your device

#### Platform-Specific Commands

**iOS** (Mac only):
```bash
pnpm ios
```

**Android**:
```bash
pnpm android
```

**Web**:
```bash
pnpm web
```

### Clear Cache

If you encounter any issues, try clearing the cache:
```bash
pnpm expo start --clear
```

Or manually remove caches:
```bash
rm -rf node_modules/.cache .expo
pnpm expo start --clear
```

## 📁 Project Structure

```
author-app/
├── app/                    # Expo Router file-based routing
│   ├── (app)/             # Authenticated app routes
│   │   └── (tabs)/        # Tab navigation screens
│   │       ├── (home)/    # Home tab
│   │       ├── library/   # Library tab
│   │       ├── media/     # Media tab
│   │       ├── store/     # Store tab
│   │       └── profile/   # Profile tab
│   ├── (public)/          # Public routes (onboarding)
│   ├── events/            # Events screens
│   ├── library/           # Library detail screens
│   ├── members/           # Members screens
│   ├── notifications/     # Notifications screens
│   └── _layout.tsx        # Root layout
├── src/
│   ├── components/        # Reusable components
│   │   └── providers/     # Context providers
│   └── navigations/       # Navigation components
│       ├── bottomNavbar.tsx        # Custom bottom tab bar
│       └── bottomNavTabLayout.tsx  # Tab navigation layout
├── assets/                # Images, fonts, icons
│   ├── fonts/            # Custom font files
│   ├── icons/            # App icons
│   └── images/           # Images and graphics
├── constants/            # App constants
├── tamagui.config.ts     # Tamagui configuration
└── package.json          # Dependencies and scripts

```

## 🎨 Customization

### Colors
The app uses a custom color palette defined in `tamagui.config.ts`. The primary color is sage green (`primary7: #465A54`).

### Fonts
Custom fonts are loaded via `src/components/providers/fontProvider.tsx`:
- **Adamina** - Default serif font
- **SF Pro Display** - System font
- **DM Sans** - Sans-serif font
- **DM Mono** - Monospace font

### Theme
Tamagui theme configuration is in `tamagui.config.ts` with support for light/dark modes.

## 🧪 Development

### Key Dependencies
```json
{
  "expo": "~54.0.13",
  "expo-router": "~6.0.11",
  "react-native": "0.81.4",
  "tamagui": "^1.135.2",
  "@tamagui/babel-plugin": "^1.135.2"
}
```

### Build Configuration
The app uses:
- **Babel** with Tamagui plugin for optimized styling
- **TypeScript** for type safety
- **Expo Router** for file-based routing

## 📝 Available Scripts

- `pnpm start` - Start the development server
- `pnpm android` - Run on Android device/emulator
- `pnpm ios` - Run on iOS simulator (Mac only)
- `pnpm web` - Run in web browser

## 🐛 Troubleshooting

### Metro Bundler Cache Issues
```bash
rm -rf node_modules/.cache .expo
pnpm expo start --clear
```

### Font Loading Issues
Ensure fonts are properly loaded before rendering:
- Check `src/components/providers/fontProvider.tsx`
- Verify font files exist in `assets/fonts/`

### Navigation Issues
If screens aren't found:
- Clear Metro cache
- Ensure file structure matches Expo Router conventions
- Check that all `_layout.tsx` files are properly configured

## 📄 License



## 👥 Contributing



## 📧 Contact


---

Built with ❤️ using Expo and Tamagui

