# Volunteer Side Redesign & Requirements Plan

Please review each section below. You can add your comments directly or approve the plan to proceed with implementation.

---

## 1. Top Section: "Track My Green Achievement"
*Replaces previous "Pending actions"*

- **Section Heading**: `Track My Green Achievement`
- **Cards & Data (3 Distinct Soft Pastel Cards: Blue, Sage, Lime)**:
  - **Card 1 (Pastel Blue `#DBE8F0`)**:
    - Stat: `2`
    - Label: `Assigned to me` (Requests currently assigned to this volunteer)
  - **Card 2 (Pastel Sage `#CDE1D2`)**:
    - Stat: `2`
    - Label: `Hydration due today` (Active saplings needing care)
  - **Card 3 (Pastel Lime `#EBF29D`)**:
    - Stat: `98%`
    - Label: `Sapling survival rate` (Field performance)
- **Behavior**: Non-clickable display cards (`activeOpacity={1}`), keeping it consistent with the Citizen dashboard.

> **Your Comments on Section 1:**
> [ Add comments here ]

---

## 2. Quick Actions: "Quick Steps"
*Replaces previous "Quick actions" — "Active Req" button removed*

- **Section Heading**: `Quick Steps`
- **Action Buttons (4 Circular Lime Buttons `#E8F29E`)**:
  1. **Take New Step**
     - Icon: `plant`
     - Action: Navigates to `/(volunteer)/available` (Discover and accept new verified plantation requests)
  2. **Active Challenges**
     - Icon: `sun` (or `award`)
     - Action: Navigates to `/pages/active-challenges` (Volunteer community challenges: e.g., *Hydration Streak*, *Weekend Squad Drive*, *Tree Guard Patrol*)
  3. **Update Log Care**
     - Icon: `water`
     - Action: Navigates to `/pages/log-nurturing` (Log water, compost, photo updates for planted saplings)
  4. **My Contribution**
     - Icon: `bookmark` (or `profile`)
     - Action: Navigates to `/pages/my-contribution` (Unified volunteer green impact, score & badges)
- *Note*: Removed the confusing redundant "Active Req" button from Quick Steps.

> **Your Comments on Section 2:**
> [ Add comments here ]

---

## 3. Platform Overview: Community KPIs (Same as Citizen Side)
*Provides unified platform transparency*

- **Section Heading**: `Platform overview`
- **KPI Cards (Non-clickable, display only)**:
  1. **Active Volunteers**: `140+` (`+12% in Dadar`) — Pastel Blue (`#DBE8F0`)
  2. **Total Trees Planted**: `1,280+` (`Canopy Growing`) — Pastel Sage (`#CDE1D2`)
  3. **Total Requests**: `126+` (`All-time city submissions across Mumbai`) — Pastel Lime (`#EBF29D`)

> **Your Comments on Section 3:**
> [ Add comments here ]

---

## 4. Home Screen Cleanup (Sections Removed)
- **Removed**: Completely remove the `"Priority Nurturing Alerts"` section.
- **Removed**: Completely remove the `"Active Requests in Dadar"` feed section from the home screen.
- *Result*: The Volunteer Home Screen becomes clean, light, focused, and free of duplicate feeds.

> **Your Comments on Section 4:**
> [ Add comments here ]

---

## 5. Requests Page: Compact Card Layout (`app/(volunteer)/available.tsx`)
*Fixing the oversized card issue where 1 request consumed the entire screen*

- **Problem Identified**: The current card height is ~400px due to a huge 140px vertical banner image, multiple lines of text, and oversized action buttons.
- **Redesigned Compact Card (~135-145px height)**:
  - **Horizontal Split Layout**:
    - **Left Side**: Square thumbnail (84x84px) with rounded corners and a small distance badge (`1.2 km`).
    - **Right Side**:
      - Top: Request Code (`#REQ-8794`) & Bookmark icon.
      - Middle: Title (1 bold line) and Location (📍 1 line).
      - Bottom: Quick action buttons: `"View details"` and compact `"Accept request"` button.
  - **Screen Density**: **2.5 to 3 requests will be visible simultaneously** on standard phone screens without forced scrolling!
- **Filter Tabs**:
  - **Remove**: `"Nearest"` filter tab removed completely.
  - **Tabs Kept**: Strictly **`All Req`** and **`Newest`**.

> **Your Comments on Section 5:**
> [ Add comments here ]

---

## 6. Volunteer Notifications Overhaul (`app/pages/notifications.tsx`)
*Replacing generic/invalid requests with realistic volunteer domain notifications*

- **New Realistic Notifications**:
  1. 🌿 **Plantation Scheduled**:
     *Title*: *"Planting Slot Confirmed"*
     *Body*: *"Your plantation drive for Saturday morning at Shivaji Park Outer Ring has been confirmed by Admin. Tools are allocated."*
     *Time*: *"2 hours ago"* · *Urgent*
  2. 💧 **Urgent Field Alert**:
     *Title*: *"Hydration Needed: Dadar TT Circle"*
     *Body*: *"Saplings at Dadar TT Circle median require water replenishment due to midday heat. Log your care visit once completed."*
     *Time*: *"5 hours ago"*
  3. 🎖️ **Plantation Photo Verified**:
     *Title*: *"Site Photos Approved by Admin"*
     *Body*: *"Admin approved your plantation photos for Five Gardens Green Canopy. 5 native saplings added to the official count."*
     *Time*: *"Yesterday"*
  4. 🏆 **Milestone Achieved**:
     *Title*: *"Badge Unlocked: Urban Forester 🌿"*
     *Body*: *"Congratulations! You have completed 25+ tree care and planting activities in Mumbai."*
     *Time*: *"3 days ago"*

> **Your Comments on Section 6:**
> [ Add comments here ]

---

## 7. Flow Consistency & WhatsApp Polish
*Reviewing flows to ensure logical navigation without dead ends or confusing duplicates*

1. **Accept Request Sequence**:
   - The obsolete "Collect Sapling & Tools" step is bypassed: clicking "Accept & Schedule" moves directly into scheduling date/time, then adds the task into the volunteer's active assigned work list.
2. **Distinct Button Actions**:
   - "Schedule Request" only shows when a request is unscheduled.
   - "Upload Photos" only shows when a request is scheduled but not yet planted.
   - "Log Care" only shows after saplings are planted and require ongoing nurturing.
3. **Dedicated Challenges Screen**:
   - Create `app/pages/active-challenges.tsx` for the new "Active Challenges" Quick Step button.

> **Your Comments on Section 7:**
> [ Add comments here ]
