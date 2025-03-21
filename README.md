# Dlog

This app is to learn the publishing process on Google Play

## Dependencies

1. Bun: https://bun.sh/docs
2. Expo: https://docs.expo.dev/

### How to

1. Upgrade Expo
    1. `bunx expo install expo@latest`
    2. `bunx expo install --fix`
2. Start the app
    1. Install Expo Go app on your phone
    2. `bun start`
    3. Scan the QR code using the Expo Go app
3. Build the app on cloud
    1. `eas build -p android`
4. Check the dependencies
    1. `bunx expo install --check`
5. Install Maestro
    1. `brew tap mobile-dev-inc/tap`
    2. `brew install maestro`
6. Run end-to-end tests:
    1. Run app on simulator
    1. `maestro test .maestro/flow.yaml`