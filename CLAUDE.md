# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the App
- `bun start` - Start Expo development server
- `bun run android` - Start on Android device/emulator
- Install Expo Go app on phone and scan QR code to test

### Testing
- `bun run e2e` - Run Maestro end-to-end tests (requires app running on simulator)
- `maestro test .maestro/flow.yaml` - Direct Maestro test execution

### Building and Publishing
- `eas build -p android` - Build Android app on Expo cloud
- `eas submit -p android` - Submit build to Google Play Store
- `bunx expo install --check` - Verify dependency compatibility

### Dependency Management
- `bunx expo install expo@latest` - Upgrade Expo to latest version
- `bunx expo install --fix` - Fix dependency versions for current Expo SDK

## Architecture

This is a React Native dream logging app built with Expo, designed as a learning project for Google Play Store publishing.

### Core Structure
- **App.js**: Main application component containing all state management, SQLite database operations, and UI logic
- **components/Log.js**: Reusable component for displaying individual log entries
- **SQLite Database**: Single table `logs` with schema: `(id text primary key, date text, content text)`

### Key Features
- Dream log creation with date and content fields
- SQLite local storage with automatic table creation
- Pull-to-refresh functionality using RefreshControl
- Modal overlay form for adding new entries
- Chronological display (newest first)

### Database Operations
- Database file: "db.db" (opened with `expo-sqlite`)
- Table auto-created on app initialization
- Random string IDs for log entries
- All operations use synchronous SQLite methods (`runSync`, `getAllSync`)

### UI Patterns
- Single-screen app with overlay modal for forms
- FlatList for log display with pull-to-refresh
- Pressable buttons with primary/secondary styling
- Form state managed in main App component

### Testing Setup
- Maestro E2E testing configured in `.maestro/flow.yaml`
- Tests cover log creation and pull-to-refresh functionality
- App ID: `com.abhishandy.dlog`