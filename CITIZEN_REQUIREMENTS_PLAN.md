# Citizen Side Redesign & Requirements Plan

Please review each section below. You can add your comments directly or tell me your feedback.

---

## 1. Top Section: "Track My Green Movement"
*Replaces previous "Pending actions"*

- **Section Heading**: `Track My Green Movement`
- **Cards & Data**:
  - **Individual KPI Card (My Requests)**:
    - Title: **My Requests**
    - Large Stat: Total number of requests submitted by current user (e.g., `4`)
    - Subtitle / Breakdown: `1 Pending Review` · `2 Verified` · `1 In Progress`
    - Background: Pastel Blue (`#DBE8F0`), Border: `#C5D9E5`
    - **Non-Clickable**: Static display card (`activeOpacity={1}`, no navigation action).
  - *Comment / Note*: All "Completed" state labels removed; replaced by continuous "In Progress / Nurturing".

> **Your Comments on Section 1:**
> [ Add comments here ]

---

## 2. Quick Actions: "Quick Steps"
*Replaces previous "Quick actions"*

- **Section Heading**: `Quick Steps`
- **Action Buttons (3 Items, Circular Lime Buttons `#E8F29E`)**:
  1. **New Tree Request**
     - Replaces: *Request Tree*
     - Icon: `plant`
     - Action: Navigates to `/pages/create-request`
  2. **My Contribution**
     - Replaces: *Settings* (Settings button is removed completely)
     - Icon: `award` (or `bookmark` / `star`)
     - Action: Navigates to `/pages/my-contribution` (personal contribution breakdown: trees adopted, saplings requested, volunteer nurture score)
  3. **Green Event**
     - Replaces: *Events*
     - Icon: `calendar` (or `leaf`)
     - Action: Navigates to the new `/pages/green-events` community tasks screen

> **Your Comments on Section 2:**
> [ Add comments here ]

---

## 3. Platform Overview: Community KPIs (Non-Clickable)
*Retains only the 3 required platform-wide metrics*

- **Section Heading**: `Community overview`
- **KPI Cards (All strictly NON-CLICKABLE, display only)**:
  1. **Active Volunteers**: `140+` (`+12% in Dadar`) — Pastel Blue (`#DBE8F0`)
  2. **Total Trees Planted**: `1,280+` (`Canopy Growing`) — Pastel Sage (`#CDE1D2`)
  3. **Total Requests**: `126+` (`All-time Mumbai`) — Pastel Lime (`#EBF29D`)
- *Note*: Removed duplicate active requests card from this section since individual active work is shown in "Track My Green Movement".

> **Your Comments on Section 3:**
> [ Add comments here ]

---

## 4. Community Guide: "How to use this app"
*Replaces "Spotted an empty space? Request a tree spot"*

- **Card Title**: `How to use this app`
- **Badge**: `VIDEO GUIDE`
- **Description**: *Watch a 2-minute quick walkthrough on how to request a sapling in your neighborhood, track volunteer verification, and participate in green care.*
- **Action Button**: `Watch on YouTube ▷`
  - Opens: `https://www.youtube.com/watch?v=...` via `Linking.openURL` with external browser fallback.

> **Your Comments on Section 4:**
> [ Add comments here ]

---

## 5. Dedicated "Green Event" Screen (`app/pages/green-events.tsx`)
*Opened when citizen taps "Green Event" button*

- **Visual Style**: Clean notification-style task feed matching `notifications.tsx` design.
- **Content**: Actionable community green tasks for citizens:
  1. 💧 **Water the Plants**:
     - *Dadar TT Circle & Shivaji Park Corner saplings need hydration due to summer heat.*
     - Tag: `Urgent Care` · `Dadar`
  2. 🌱 **Change Soil / Add Vermicompost**:
     - *Five Gardens saplings require organic manure and soil aeration.*
     - Tag: `Soil Nutrition` · `Matunga`
  3. 🛡️ **Tree Guard Realignment**:
     - *Inspect and straighten tilted protective wire mesh guards.*
     - Tag: `Protection` · `Wadala`
  4. 🍂 **Mulching & Weed Removal**:
     - *Clear wild weeds around base and spread dry leaf mulch for moisture retention.*
     - Tag: `Maintenance` · `Prabhadevi`
- **Action**: "Mark as Attended" / "View Location on Map".

> **Your Comments on Section 5:**
> [ Add comments here ]

---

## 6. Citizen Requests Screen (`app/(citizen)/requests.tsx`)
*Filter and status cleanup*

- **Filter Tabs (Strictly 4 Tabs)**:
  1. `All`
  2. `Pending` (Pending Review + Clarification Needed)
  3. `Verified` (Verified by Admin/Volunteer)
  4. `Active Req` (Assigned, Scheduled, In Progress, Nurturing)
- **Removal of "Completed" Flow**:
  - The `"Completed"` filter tab is removed.
  - Any request where planting is done continues into active nurturing and maintenance updates instead of a static terminating "completed" status.

> **Your Comments on Section 6:**
> [ Add comments here ]
