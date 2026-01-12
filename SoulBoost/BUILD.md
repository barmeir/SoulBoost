# Building and Running Soul Boost

## Quick Start

### Development Mode

1. Start Metro bundler:
```bash
npm start
```

2. In a new terminal, run the app:
```bash
npm run android
```

## Building APK for Installation

### Debug Build (for testing)
```bash
cd android
./gradlew assembleDebug
```
The APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release Build (for distribution)
```bash
cd android
./gradlew assembleRelease
```
The APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

## Installing on Physical Device

### Via USB (ADB)
1. Enable USB debugging on your Android device
2. Connect device via USB
3. Run: `adb install android/app/build/outputs/apk/debug/app-debug.apk`

### Via File Transfer
1. Copy the APK file to your device
2. Open the APK file on your device
3. Allow installation from unknown sources if prompted
4. Tap "Install"

## Troubleshooting

### Metro Bundler Issues
```bash
npm start -- --reset-cache
```

### Clean Build
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Permission Errors
Make sure your AndroidManifest.xml includes:
- `android.permission.POST_NOTIFICATIONS`
- `android.permission.SCHEDULE_EXACT_ALARM`
- `android.permission.USE_EXACT_ALARM`

## First Launch

1. The app will show an onboarding walkthrough
2. Grant notification permissions when prompted
3. Complete the onboarding to reach the home screen
4. Daily notifications will be scheduled for 8:00 AM

## Testing Features

- **JFT Content**: Pull down to refresh on home screen to fetch today's content
- **Gratitude**: Tap the gratitude card to enter 4 items
- **Goal**: Tap the goal card to set today's intention
- **Wish**: Tap the wish card to express your desire
- **History**: Tap "View Your Journey" to see past entries
- **Notifications**: Will trigger at 8:00 AM daily
