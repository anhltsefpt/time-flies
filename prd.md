# Time Flies - Implementation Plan

## Overview
A React Native (Expo) app that visualizes the year's progress as a 365-day calendar grid, helping users feel "motivated urgency" about time passing.

## v1 Features
- **Year Grid:** 52 rows × 7 columns showing all 365 days
- **Visual Style:** Dark & minimal aesthetic
- **Journal:** Tap any past day to add entry with:
  - Text notes (optional)
  - Mood: 5 emoji faces (😢 😕 😐 🙂 😄)
  - Rating: 1-5 stars
- **Stats:** Mood trends graph over time
- **Notifications:** Evening journal prompt at user-configurable time
- **Widget:** Home screen widget showing mini grid + progress %
- **Storage:** Local only (Realm), no accounts

## Tech Stack
- React Native with Expo (managed workflow)
- expo-router for navigation
- Realm for journal data (fast, reactive, schema-based)
- expo-notifications for evening reminders
- expo-widgets for home screen widget
- victory-native or react-native-chart-kit for mood trends graph

## Implementation Steps

### Step 1: Project Setup
- Initialize Expo project with TypeScript
- Configure expo-router
- Set up basic dark theme
- Install dependencies: realm, expo-notifications, expo-widgets, chart library

**Files to create:**
- `app/_layout.tsx` - root layout with dark theme + RealmProvider
- `app/index.tsx` - main screen placeholder
- `app.json` - Expo config

### Step 2: Realm Database Setup
- Define JournalEntry schema (dayNumber, year, text, mood, rating, timestamps)
- Create RealmProvider wrapper
- Build useJournal hook for CRUD operations

**Files to create:**
- `models/JournalEntry.ts` - Realm schema
- `hooks/useRealm.ts` - Realm context setup
- `hooks/useJournal.ts` - journal CRUD hook

### Step 3: Year Grid Component
- Build `YearGrid` component rendering 52×7 grid
- Build `DayBox` component for individual day squares
- Calculate which days are passed vs future vs today
- Style with dark theme (filled=accent color, empty=dark gray, today=highlighted)
- Color-code days based on mood if entry exists

**Files to create:**
- `components/YearGrid.tsx`
- `components/DayBox.tsx`
- `utils/dateUtils.ts` - helpers for day calculations

### Step 4: Main Screen
- Display YearGrid on home screen
- Show progress text: "Day X of 365 (Y%)"
- Handle tap on past days to open journal

**Files to modify:**
- `app/index.tsx`

### Step 5: Journal Modal
- Bottom sheet/modal for viewing/editing day entries
- Mood picker: 5 emoji faces in a row
- Star rating: 1-5 tappable stars
- Text input for notes (optional)
- Auto-save on close

**Files to create:**
- `components/JournalModal.tsx`
- `components/MoodPicker.tsx` - 5 emoji selector
- `components/StarRating.tsx` - 1-5 star input

### Step 6: Stats Screen
- New tab/screen for viewing trends
- Mood trends line graph over time
- Basic stats: entries count, average mood, average rating

**Files to create:**
- `app/stats.tsx` - stats screen
- `components/MoodChart.tsx` - line graph component

### Step 7: Evening Notifications
- Request notification permissions
- Settings screen to configure reminder time
- Schedule daily local notification

**Files to create:**
- `app/settings.tsx` - settings screen with time picker
- `hooks/useNotifications.ts` - notification scheduling logic

### Step 8: Home Screen Widget
- Configure expo-widgets
- Create mini grid widget showing progress %
- Widget tap opens app

**Files to create:**
- `widgets/ios/` - iOS widget (Swift)
- `widgets/android/` - Android widget (Kotlin)
- Widget configuration in `app.json`

### Step 9: Subscription with RevenueCat

**Time Flies Pro - Insights & Analytics**

| Feature | Free | Pro |
|---------|------|-----|
| Year grid visualization | Yes | Yes |
| Journal entries (mood, rating, notes) | Yes | Yes |
| Entry count | Yes | Yes |
| Current streak | Yes | Yes |
| Mood trends graph | No | Yes |
| Weekly/monthly mood patterns | No | Yes |
| Best/worst day analysis | No | Yes |

**Pricing:**
- Weekly: $0.99/week
- Annual: $29.99/year (save 42%)
- 3-day free trial on both plans

**Paywall Trigger:** Stats tab soft paywall - basic stats free, mood graph locked with "Unlock with Pro" overlay

**Implementation:**
- Integrate RevenueCat SDK
- Configure products in App Store Connect / Google Play Console
- Build paywall screen with pricing options
- Gate Pro features based on subscription status

**Files to create:**
- `app/paywall.tsx` - paywall screen with pricing
- `hooks/usePurchases.ts` - RevenueCat integration
- `context/PurchaseContext.tsx` - subscription state provider

### Step 10: Polish & Testing
- Add smooth animations for grid
- Test on iOS and Android
- Ensure notifications work
- Ensure widget works on both platforms
- Test IAP flow

## Verification
1. Run `npx expo start` and test on simulator/device
2. Verify grid shows correct day count for current date
3. Tap a past day → journal modal opens
4. Select mood emoji → persists correctly
5. Set star rating → persists correctly
6. Add notes → close → reopen → all data persists
7. Check stats screen → mood graph displays correctly
8. Set evening reminder → notification fires at correct time
9. Add widget to home screen → shows correct progress
10. Tap widget → app opens

## File Structure
```
time-flies/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── stats.tsx
│   └── settings.tsx
├── components/
│   ├── YearGrid.tsx
│   ├── DayBox.tsx
│   ├── JournalModal.tsx
│   ├── MoodPicker.tsx
│   ├── StarRating.tsx
│   └── MoodChart.tsx
├── models/
│   └── JournalEntry.ts
├── hooks/
│   ├── useRealm.ts
│   ├── useJournal.ts
│   └── useNotifications.ts
├── utils/
│   └── dateUtils.ts
├── widgets/
│   ├── ios/
│   └── android/
└── app.json
```

## Future Versions (Not in v1)
- Photos in journal entries
- Tags/categories for entries
- Milestones/future events on grid
- Cloud sync with user accounts
- Multiple year views (past years)
- Streaks/gamification
- Share progress as image
- Export journal data
