<div align="center">

# 🛡️ SecureGuard

**Your Phone. Your Rules. Your Safety.**

A professional, production-grade security app built with React Native + Expo + TypeScript.

</div>

---

## 📱 Features

| Module | Feature | Status |
|--------|---------|--------|
| Module 1 | 🔐 Intruder Detection (photo capture + GPS + SMS alert) | ✅ Complete |
| Module 2 | 🔒 App Lock (PIN/Biometric per-app lock) | 🔜 Coming Soon |
| Module 3 | 📊 App Usage Tracker (screen time, data usage) | 🔜 Coming Soon |
| Module 4 | ⏰ Focus Mode (block distracting apps) | 🔜 Coming Soon |
| Module 5 | 🚶 Fitness Tracker (step counter, rewards) | 🔜 Coming Soon |
| Module 6 | 🚨 SOS / Panic Button | 🔜 Coming Soon |
| Module 7 | 🛡️ Anti-Theft (SIM change alert, remote wipe) | 🔜 Coming Soon |
| Module 8 | 🌐 Network Security Scanner | 🔜 Coming Soon |
| Module 9 | 📋 Clipboard Monitor & Notification Log | 🔜 Coming Soon |
| Module 10 | 👤 Guest Mode / Decoy Mode | 🔜 Coming Soon |

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native + Expo SDK 52 |
| Language | TypeScript (strict mode) |
| Navigation | Expo Router (file-based) |
| State Management | Zustand + AsyncStorage (persist) |
| Backend/Cloud | Firebase (Firestore + Storage + Auth) |
| Camera | expo-camera |
| Location | expo-location |
| SMS | expo-sms |
| Notifications | expo-notifications |
| Secure Storage | expo-secure-store |
| UI Icons | @expo/vector-icons (Ionicons) |
| Animations | react-native-reanimated |
| Date Formatting | date-fns |

---

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli`)
- [Expo Go app](https://expo.dev/go) on your phone

---

## ⚡ Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/basantpd9001/mysecurityOi.git
cd mysecurityOi

# 2. Install dependencies
npm install

# 3. Start the development server
npx expo start

# 4. Scan QR code with Expo Go on your phone
```

---

## 🔧 Firebase Setup (Optional for cloud features)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Add a Web app to get your config
4. Replace placeholder values in `config/firebase.config.ts`
5. Enable **Firestore**, **Storage**, and **Authentication** in Firebase Console

---

## 📁 Project Structure

```
secureguard/
├── app/                          # Expo Router screens
│   ├── _layout.tsx               # Root layout
│   ├── index.tsx                 # App entry (redirects)
│   ├── lock-screen.tsx           # PIN lock screen
│   ├── (tabs)/                   # Bottom tab navigator
│   │   ├── index.tsx             # Dashboard
│   │   ├── security.tsx          # Security hub
│   │   ├── usage.tsx             # Usage tracker (coming soon)
│   │   ├── focus.tsx             # Focus mode (coming soon)
│   │   └── fitness.tsx           # Fitness tracker (coming soon)
│   ├── onboarding/               # First-launch flow
│   │   ├── welcome.tsx
│   │   ├── set-pin.tsx
│   │   ├── emergency-contacts.tsx
│   │   ├── permissions.tsx
│   │   └── complete.tsx
│   └── intruder/                 # Module 1 screens
│       ├── setup.tsx             # Detection settings
│       ├── history.tsx           # Alert history
│       ├── alert-detail.tsx      # Full alert info
│       ├── map-view.tsx          # Intruder location map
│       └── emergency-contacts.tsx
├── components/ui/                # Reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Header.tsx
│   ├── Badge.tsx
│   ├── EmptyState.tsx
│   ├── LoadingScreen.tsx
│   └── PermissionCard.tsx
├── config/                       # App configuration
│   ├── theme.ts                  # Theme system + ThemeProvider
│   └── firebase.config.ts        # Firebase setup
├── services/                     # Business logic layer
│   ├── camera.service.ts
│   ├── location.service.ts
│   ├── sms.service.ts
│   ├── intruder.service.ts
│   └── firebase.service.ts
├── store/                        # Zustand state management
│   ├── useAuthStore.ts
│   ├── useSecurityStore.ts
│   └── useSettingsStore.ts
├── hooks/                        # Custom React hooks
│   ├── useCamera.ts
│   ├── useLocation.ts
│   └── usePermissions.ts
├── types/                        # TypeScript type definitions
│   └── index.ts
├── utils/                        # Helper utilities
│   ├── constants.ts
│   ├── formatters.ts
│   └── permissions.ts
└── assets/                       # Images, fonts
```

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/module-2-app-lock`)
3. Commit changes (`git commit -m 'feat: add App Lock module'`)
4. Push to branch (`git push origin feature/module-2-app-lock`)
5. Open a Pull Request

---

## 📄 License

MIT © SecureGuard Contributors

---

<div align="center">
Built with ❤️ using React Native + Expo
</div>
