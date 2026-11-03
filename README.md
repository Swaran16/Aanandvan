# Aanandvan — Eco-Plantation & Green Canopy Platform

Aanandvan is an eco-plantation mobile platform built with **React Native (0.88+)**, **Expo SDK 58**, and **TypeScript**. It connects **Citizens**, **Volunteers**, and **Administrators** into a unified, live-updating reforestation ecosystem.

---

## 🚀 Quickstart: Commands to Run the Project

Follow these exact commands in your terminal (PowerShell, Command Prompt, or bash) from the project root:

### 1. Install Dependencies
Run the standard package installation to fetch all React 19 and Expo dependencies:
```bash
npm install
```

### 2. (Optional) Install Vector Icons
If you want to use the optional `@expo/vector-icons` library:
```bash
npx expo install @expo/vector-icons
```
*(Note: The app already has a built-in zero-dependency native Icon system in `src/components/common/Icon.tsx`, so it works right out of the box even without external icon packages!)*

### 3. Verify Project Health & Dependencies
Check for any SDK version mismatches:
```bash
npx expo-doctor
```
If any dependencies need auto-fixing to match your Expo SDK version:
```bash
npx expo install --fix
```

### 4. Start the Development Server
Launch Metro bundler:
```bash
npx expo start
```
Or to clear any bundler cache:
```bash
npx expo start -c
```

---

## 📱 How to View & Test the App

Once you run `npx expo start`, Metro will present options in your terminal:

| Platform | Command / Action | Details |
| :--- | :--- | :--- |
| 🌐 **Web Browser** | Press **`w`** | Opens the app instantly in your default web browser (`http://localhost:8081`). |
| 📲 **Physical Phone (Expo Go)** | Scan the terminal QR Code | • **Android**: Scan using the **Expo Go** app from Google Play Store.<br>• **iOS**: Scan using the default **Camera** app, which will prompt to open in **Expo Go**. |
| 🤖 **Android Emulator** | Press **`a`** | Launches on an active Android Studio emulator. |
| 🍏 **iOS Simulator** | Press **`i`** | Launches on an active Xcode iOS simulator (macOS only). |

---

## 📦 Project Dependencies Reference

All essential dependencies configured in `package.json`:

| Package | Version | Purpose |
| :--- | :--- | :--- |
| `expo` | `~58.0.22` | Core Expo SDK runtime |
| `expo-router` | `~4.1.3` | File-system-based routing for navigation & tab bars |
| `react` | `19.3.0` | React component framework |
| `react-native` | `0.88.1` | Mobile UI primitives |
| `react-native-safe-area-context` | `5.4.0` | Inset management for notches, status bars, and navigation bars |
| `react-native-screens` | `~4.5.0` | Native screen optimization for transitions |
| `expo-status-bar` | `~2.2.3` | Dynamic status bar styling (light/dark) |
| `expo-constants` | `~17.1.6` | App configuration and manifest variables |
| `expo-linking` | `~7.1.5` | Deep linking and URL navigation |
| `typescript` | `~6.0.3` | Static typing and interfaces |

---

## 🛠️ Handy Development Scripts

```bash
# Start dev server
npm start             # or npx expo start

# Run type check
npm run typecheck     # or npx tsc --noEmit

# Run linter
npm run lint          # or npx expo lint

# Start directly for web
npm run web           # or npx expo start --web

# Start directly for Android
npm run android       # or npx expo start --android

# Start directly for iOS
npm run ios           # or npx expo start --ios
```

---

## 👥 Role-Based Access & Preset Demo Credentials

The app features a dynamic login screen at [`app/(auth)/login.tsx`](file:///c:/Users/mitta/Swaran/Aanandvan/app/(auth)/login.tsx) with **1-tap instant demo buttons**:

| Role | Email / ID | Password | Destination Route | Key Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Citizen** | `citizen@aanandvan.in` | `citizen123` | `/(citizen)` | Submit requests (`+` button), monitor admin verification, view assigned volunteer, view impact metrics |
| **Volunteer** | `volunteer@aanandvan.in` | `volunteer123` | `/(volunteer)` | Browse verified requests, accept drives, schedule plantation with checklist, upload before/after photos, log tree watering |
| **Admin** | `admin@aanandvan.in` | `admin123` | `/(admin)` | Verify citizen requests, approve volunteer applicants, confirm scheduled drives, monitor platform telemetry & growth chart |

---

## 🔄 End-to-End Test Workflow

You can test the entire lifecycle across roles within minutes:

1. **Submit Request (Citizen)**:
   - Log in as **Citizen**.
   - Tap the `+` FAB on the Home or Requests tab.
   - Enter details and submit. Request appears with status `Pending`.

2. **Verify Request (Admin)**:
   - Log out from Citizen Profile and log in as **Admin**.
   - Go to **Requests** tab ➔ tap **Review →** on the pending request.
   - Tap **Verify & Send to Volunteers**. Request status becomes `Verified`.

3. **Accept & Schedule (Volunteer)**:
   - Log out and log in as **Volunteer**.
   - Go to **Plant** tab (Available Requests) ➔ Tap **Accept Request**.
   - Tap **Schedule Plantation Drive** ➔ pick Date (`THU 12 Oct`), Time Slot (`Morning 8-11 AM`), check materials checklist, and tap **Confirm Schedule**. Status becomes `Scheduled`.

4. **Confirm Schedule (Admin)**:
   - Switch to **Admin** ➔ Open request ➔ Tap **Approve & Confirm Drive**. Status becomes `In Progress`.

5. **Upload Before/After Photos (Volunteer)**:
   - Switch to **Volunteer** ➔ Open **Upload Plantation Activity**.
   - Upload 3 Before and 3 After photos, set saplings count with stepper `[- 1 +]`, date, notes, and submit. Status becomes `Completed`!

6. **Log Routine Tree Maintenance (Volunteer)**:
   - In **Volunteer** ➔ open **Work** tab.
   - Check urgent alert (`Young White Oak #042 Needs Water`).
   - Tap **Log Watered** to update hydration and record field observations in the growth timeline thread.

---

## 📱 Folder & Navigation Architecture

As specified, **each role group holds ONLY the bottom button screens**, while all detail screens, modals, and sub-flows live in `pages/`:

```
app/
├── _layout.tsx                     # Global Root Provider & Stack Router
├── index.tsx                       # Cold launch splash redirect
├── splash.tsx                      # Branded animated splash screen
├── onboarding.tsx                  # 4-slide onboarding walk-through
│
├── (auth)/                         # Authentication & Role Entry
│   ├── _layout.tsx
│   ├── login.tsx                   # Role switcher (Citizen/Volunteer/Admin) + 1-tap demo
│   ├── register.tsx
│   └── role-select.tsx
│
├── (citizen)/                      # Citizen Bottom Tabs (3 Tabs ONLY)
│   ├── _layout.tsx
│   ├── index.tsx                   # Tab 1: Home Dashboard (Batch 1 - Img 1)
│   ├── requests.tsx                # Tab 2: Plantation Requests (Batch 1 - Img 2)
│   └── profile.tsx                 # Tab 3: Rahul Sharma Profile (Batch 3 - Img 4)
│
├── (volunteer)/                    # Volunteer Bottom Tabs (4 Tabs)
│   ├── _layout.tsx
│   ├── index.tsx                   # Tab 1: Explore Dashboard (Batch 2 - Img 1)
│   ├── available.tsx               # Tab 2: Plant / Available Requests (Batch 2 - Img 2)
│   ├── work.tsx                    # Tab 3: Work / Tree Maintenance (Batch 2 - Img 5)
│   └── profile.tsx                 # Tab 4: Amit Kumar Profile
│
├── (admin)/                        # Admin Bottom Tabs (4 Tabs)
│   ├── _layout.tsx
│   ├── index.tsx                   # Tab 1: Overview Dashboard (Batch 4 - Img 1)
│   ├── requests.tsx                # Tab 2: Requests Management (Batch 4 - Img 4)
│   ├── volunteers.tsx              # Tab 3: Volunteer Management (Batch 4 - Img 2)
│   └── profile.tsx                 # Tab 4: Super Admin Controls & Stats
│
└── pages/                          # Standalone Sub-Pages & Modal Flows
    ├── create-request.tsx          # Citizen Create Request Form
    ├── request-details.tsx         # Universal Dynamic Request Details
    ├── schedule-plantation.tsx     # Volunteer Schedule Drive (Dates, Slots, Checklist)
    ├── upload-activity.tsx         # Volunteer Before/After Activity Form
    ├── volunteer-details.tsx       # Admin Review Volunteer Application (Priya Sharma)
    ├── admin-review-request.tsx    # Admin Verification & Schedule Approval
    ├── maintenance-thread.tsx      # Tree Maintenance Timeline & Hydration Log
    ├── my-assigned-work.tsx        # Volunteer Assigned Work List
    ├── admin-reports.tsx           # Platform Analytics & Reports
    ├── admin-events.tsx            # Community Plantation Drives
    └── admin-settings.tsx          # AI Duplicate Detection & Rules
```

---

## 🔧 Troubleshooting Tips

- **Windows Permission (`EPERM`) Error**:
  If npm throws an `EPERM` error while installing, open your terminal (PowerShell or Command Prompt) as **Administrator** and run `npm install`.
- **Metro Bundler Cache**:
  If UI changes aren't reflecting, restart Metro with cache cleared:
  ```bash
  npx expo start -c
  ```
- **Port Conflict**:
  If port `8081` is already in use by another process:
  ```bash
  npx expo start --port 8082
  ```
- **Node.js Version**:
  Ensure you are using Node.js **18.x or 20.x** (`node -v`).
