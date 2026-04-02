# Finite - Compound Savings Feature Design

## Date: 2026-04-02

## Overview

Add compound interest savings visualization to Finite. Users log daily savings on Today tab, Life Grid shows projected wealth for each future year. Connects "time is finite" with "money compounds over time" — act now.

---

## Tab Structure (4 tabs)

| Position | Tab      | Purpose                              |
|----------|----------|--------------------------------------|
| 1        | Today    | Day countdown + daily savings input  |
| 2        | Life     | Life grid (past) + future projections|
| 3        | Events   | Event countdowns (unchanged)         |
| 4        | Settings | Profile + financial settings         |

Year tab: removed (merged into Today's progress bars).

---

## Today Tab Changes

### Layout (top to bottom, ScrollView)

```
[Hero] Day Countdown HH:MM:SS + CircularRing    ← unchanged
[NEW]  Daily Savings Card                        ← position 2
[KEEP] Awake Time Card
[KEEP] Week Heatmap
[KEEP] Month + Year Progress
[KEEP] Life Progress + NEW "Projected at 65: $XXX"
```

### Daily Savings Card

**State A — Not yet logged today:**

```
┌─────────────────────────────────────┐
│  TODAY'S SAVINGS         🔥 7 days  │  ← streak badge
│                                     │
│  [$5]  [$10]  [$20]  [$50]  [Custom]│  ← quick-amount buttons
│                                     │
│           [ Save ]                  │  ← orange accent button
└─────────────────────────────────────┘
```

- Quick-amount buttons: one tap to log, minimal friction
- [Custom] opens inline TextInput with numeric keyboard
- Haptic feedback on save (expo-haptics, medium impact)

**State B — Already logged today:**

```
┌─────────────────────────────────────┐
│  TODAY'S SAVINGS         🔥 7 days  │
│                                     │
│       $20 saved today               │  ← green text, quieter
│       $340 this month               │
│                                     │
│  [Edit]                             │  ← small link
└─────────────────────────────────────┘
```

- Visually quieter (lower opacity) — feels "completed"
- Card uses green accent color for money throughout app

### Life Progress Bar Update

Add secondary line below existing life progress:

```
YOUR LIFE
[==========--------] 37%  |  23 years left
Projected at 65: $892,400   ← NEW line, green text
```

Updates immediately when savings are logged.

---

## Life Tab Changes

### Layout (top to bottom, ScrollView)

```
[HEADER]  "XX / YY years" + current financial phase badge
[NEW]     Net Worth Summary Card
[CHANGED] Past Years Grid (keep grid, remove life phases, simpler colors)
[NEW]     NOW Divider
[NEW]     Future Years Timeline (scrollable rows)
```

### Financial Milestones (replaces Life Phases)

| Phase          | Age Range     | Color  | Description              |
|----------------|---------------|--------|--------------------------|
| Past           | birth → now   | gray   | Years already lived      |
| Saving Phase   | now → 40      | blue   | Building the foundation  |
| Growth Phase   | 41 → 55       | green  | Compound interest kicks in|
| Harvest Phase  | 56 → end      | orange | Reaping the rewards      |

### Net Worth Summary Card

```
┌─────────────────────────────────────┐
│  PROJECTED NET WORTH                │
│                                     │
│  $892,400                           │  ← big green number
│  at age 65                          │
│                                     │
│  Total saved: $156,000              │
│  Interest earned: $736,400          │
│  ──────────────────────────         │
│  Next milestone: $50K in ~8 months  │  ← micro-milestone
└─────────────────────────────────────┘
```

- Show range for far-future projections (e.g., "$800K - $1M")
- "Next milestone" drives motivation more than distant end goal

### Past Years Grid

- Keep existing small cell grid layout
- Remove life phase labels (childhood, adolescence, etc.)
- Simple treatment: filled = lived, current year = partial fill with glow
- No financial data on past cells

### NOW Divider

```
─────── Age 30 · NOW ───────
       Total saved: $12,400
```

- Orange horizontal line with glow
- Current age + total savings to date
- Clear visual break: past (time) vs future (money)

### Future Years Timeline

Each future year = one full-width row:

```
┌─────────────────────────────────────┐
│  31    $15,200    ▓▓░░░░░░░░░░░░░░ │  Saving Phase
│  32    $28,800    ▓▓▓░░░░░░░░░░░░░ │
│  33    $43,500    ▓▓▓▓░░░░░░░░░░░░ │
│  ...                                │
│  50    $485,200   ▓▓▓▓▓▓▓▓▓▓▓░░░░ │  Growth Phase
│  ...                                │
│  65    $892,400   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │  Harvest Phase
└─────────────────────────────────────┘
```

- Bar width proportional to max projection
- Color matches financial phase
- Text opacity increases as amount grows (visual crescendo = compound growth)
- Tap row → expand to show breakdown:

```
┌─ Age 50 (Year 2046) ───────────────┐
│  Total:        $485,200             │
│  ├─ Saved:     $156,000             │
│  └─ Interest:  $329,200             │
│                                     │
│  Annual return: 7.0%                │
│  vs last year: +$31,400             │
│  ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░ 68% interest │
└─────────────────────────────────────┘
```

### Temporal Gradient

| Distance      | Detail Level                      |
|---------------|-----------------------------------|
| 1-3 years     | Show exact amount per year        |
| 3-10 years    | Show rounded amount per year      |
| 10+ years     | Show range (e.g., "$800K - $1M") |

---

## Feedback Flow: Log → See Impact

1. **Today tab**: User taps quick-amount → saves $20
2. **Immediate**: Card transitions to State B with animation + haptic
3. **Same screen**: Life Progress bar projection updates instantly
4. **Life tab**: Future timeline recalculates with new data
5. **Banner** (if navigated within 30s): "$20 today adds ~$X,XXX by age 65"

---

## Data Model

### New Types (types/index.ts)

```typescript
export interface SavingsEntry {
  id: string;
  date: string;         // 'YYYY-MM-DD'
  amount: number;
  created: string;      // ISO timestamp
}

export interface YearProjection {
  age: number;
  year: number;
  projectedAmount: number;
  totalContributed: number;
  totalInterest: number;
  phase: 'past' | 'saving' | 'growth' | 'harvest';
}
```

### Settings Additions

```typescript
// Add to existing Settings interface
annualReturnRate: number;    // default 7%
currency: string;            // default 'USD'
```

### Storage

- AsyncStorage key: `'finite-savings'`
- Store: `SavingsEntry[]`

---

## New Files

```
components/
  DailySavingsCard.tsx       -- savings input card (2 states)
  QuickAmountButton.tsx      -- preset amount pill button
  NowDivider.tsx             -- current year separator
  FutureYearTimeline.tsx     -- container for future rows
  FutureYearRow.tsx          -- single year row with expand
  NetWorthSummaryCard.tsx    -- projection summary card

contexts/
  SavingsContext.tsx         -- savings CRUD + state

hooks/
  useProjections.ts          -- compound interest calculations

utils/
  projections.ts             -- pure math: compound interest, future value
```

## Modified Files

```
app/(tabs)/_layout.tsx       -- remove Year tab, reorder tabs
app/(tabs)/index.tsx         -- add DailySavingsCard, update Life progress
app/(tabs)/life.tsx          -- replace life phases, add NOW divider + future timeline
components/LifeGrid.tsx      -- simplify: remove life phases, keep past grid only
types/index.ts               -- add SavingsEntry, YearProjection
contexts/SettingsContext.tsx  -- add annualReturnRate, currency
```

---

## Implementation Order

1. **Data layer**: types, SavingsContext, projections.ts, useProjections
2. **Today tab**: DailySavingsCard with quick-amount buttons
3. **Life tab**: Remove life phases, add NowDivider + FutureYearTimeline
4. **Connection**: Update Life progress bar on Today, add impact banner
5. **Tab restructure**: Remove Year tab, reorder to 4 tabs
6. **Settings**: Add annualReturnRate, currency fields
7. **Polish**: Animations, haptics, streak badge, temporal gradient

---

## Out of Scope (Future)

- ETF/stock tracking with real data
- Monthly contribution auto-detect
- Export/share projections
- Multiple savings goals
- Widget for home screen
