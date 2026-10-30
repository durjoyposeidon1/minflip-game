# MindFlip: Original 2D Brain & Logic Puzzle Game

> **“Think Different. Solve Everything.”**

A complete, production-quality casual brain and logic puzzle game built with React, TypeScript, Vite, Tailwind CSS, and Capacitor-ready mobile architecture. Suitable for children, teenagers, and adults.

---

## 🎮 Game Modes

1. **Tricky Puzzle**: Question assumptions, spot lateral traps, interact with physical scenes (e.g. blocking the sun, uncoupling cables, finding disguises).
2. **Math & Logic**: Matchstick equations, missing number series, Archimedes balance scales, and probability paradoxes.
3. **Visual Puzzle**: Camouflaged chameleons, cast shadows, Stroop effects, rotating isometric cubes, and mirror reflections.
4. **Memory Challenge**: Gemstone sequence recall, reverse animal parades, and memory card matching.
5. **Daily Challenge**: Date-seeded unique riddle every day with bonus coins and daily streak tracking.

---

## 📚 100 Playable Levels Across 5 Chapters

- **Chapter 1: Beginner Brain** (Levels 1 – 20) — Foundation puzzles & lateral thinking basics.
- **Chapter 2: Observation Master** (Levels 21 – 40) — Spot the difference, camouflage, and spatial geometry.
- **Chapter 3: Logic Expert** (Levels 41 – 60) — Knights & Knaves, truth tables, and water-jug deductions.
- **Chapter 4: Math Genius** (Levels 61 – 80) — Fibonacci patterns, matchstick arithmetic, and combinatorics.
- **Chapter 5: Ultimate Mind** (Levels 81 – 100) — Multi-step lateral enigmas and the Grandmaster Finale.

Every level includes:
- Unique question and instructions
- Interactive answering (choice cards, odd-one-out grids, number pads, sequence ordering, card flipping, interactive scenes)
- Full answer validation
- Detailed "Why It Works" explanation
- 3-tier progressive hint system (gentle nudge, deduction clue, core trick)

---

## 💰 Economy & Rewards

- **Coins**: Earn coins by completing levels (+30 to +50 coins) and claiming daily streak bonuses. Spend coins on 3-tier hints or level skips.
- **Stars (★)**: Earn 1 to 3 stars based on hints used and attempts.
- **7-Day Login Streak**: Progressive rewards from Day 1 to Day 7 Super Chest.
- **12 Achievement Badges**: Claim bonus coins as you hit milestones like "First Spark", "Century Mind", and "Pure Intellect".
- **Safe Local Storage**: Automatic state persistence in `localStorage` with a safe reset confirmation option in Settings.

---

## 🎵 Sound & Haptics

- **Procedural Web Audio API Synthesizer**: Zero external audio downloads. Instant, crisp wood pops, celebratory arpeggios, wrong buzzes, coin dings, and calming ambient synth chords.
- **Haptic Vibration**: Native tactile vibration where supported via `navigator.vibrate`.

---

## 🚀 Running the Project Locally

```bash
# 1. Install dependencies
npm install

# 2. Run development server (Port 3000)
npm run dev

# 3. Build production bundle
npm run build
```

---

## 📱 Capacitor Android Setup & APK/AAB Build

### 1. Install Capacitor CLI & Android Platform
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
```

### 2. Build Web Assets & Initialize Android
```bash
npm run build
npx cap add android
npx cap sync android
```

### 3. Open in Android Studio
```bash
npx cap open android
```

### 4. Build Signed APK / Android App Bundle (AAB)
Inside Android Studio:
1. Select **Build** > **Generate Signed Bundle / APK...**
2. Choose **Android App Bundle (AAB)** for Google Play Store upload or **APK** for direct testing on devices.
3. Select your keystore and release build variant.
4. Your release `.aab` / `.apk` will be generated in `android/app/release/`.

---

## 🛡️ Monetization Preparation (AdMob)

Pre-wired `admobService.ts` is configured with test ad unit IDs for:
- Rewarded video ads (granting +50 coins or free hints)
- Interstitial ads (triggered only every 5 levels to preserve gameplay flow)
- 100% playable offline without any forced ads or paywalls.
