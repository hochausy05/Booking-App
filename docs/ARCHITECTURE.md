# Architecture

## 1. Architecture Goal

Keep the project small, understandable, and reliable while satisfying the assignment requirements.

## 2. Proposed Structure

```text
src/
├── components/
├── screens/
├── navigation/
├── store/
├── services/
├── hooks/
├── types/
├── utils/
└── constants/
```

Recommended responsibilities:

```text
components/   Reusable presentation components
screens/      Route-level UI and orchestration
navigation/   Navigation configuration/types
store/        Zustand global state
services/     Data access and notification APIs
hooks/        Reusable feature logic
types/        Shared TypeScript contracts
utils/        Pure helpers
constants/    Fixed slots/configuration
```

## 3. Main Data Types

### Room

```ts
type Room = {
  id: string;
  name: string;
  building: "A" | "B" | "C" | "V";
  floor: number;
  capacity: number;
  imageUrl: string;
  equipment: Equipment[];
};
```

### Equipment

```ts
type Equipment =
  | "projector"
  | "whiteboard"
  | "highSpecPc"
  | "ac";
```

### Booking

```ts
type Booking = {
  id: string;
  roomId: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "active" | "cancelled" | "completed";
  createdAt: string;
};
```

## 4. State Ownership

### Local component state

Use for temporary UI state such as:

- Modal visibility
- Press state
- Input focus
- Small screen-specific state

### Zustand

Use for cross-screen state such as:

- Demo user/session
- Active filters
- Selected booking context where useful
- Active reservations
- Cancellation actions

### AsyncStorage

Use to persist suitable Zustand state locally.

Examples:

- Demo user
- Filters
- Local booking references/cache where appropriate

Do not treat AsyncStorage as the shared source of truth for multi-user reservations.

## 5. Booking Source of Truth

### Preferred real-time option

Use Supabase PostgreSQL for:

- Rooms
- Bookings

Use Supabase Realtime for booking changes.

Conceptual flow:

```text
Client A
  |
  | create booking
  v
Database
  |
  | realtime event
  +---------------> Client B refreshes slot state
```

## 6. Conflict Strategy

UI disabling is only the first protection layer.

Booking creation flow:

```text
Select date/slot
      |
      v
Confirm booking
      |
      v
Revalidate slot availability
      |
  +---+---+
  |       |
free   occupied
  |       |
create   conflict message
```

The data layer should enforce uniqueness or otherwise prevent duplicate active bookings for the same room/date/slot.

## 7. Room Availability

`Available Now` / `Occupied` should be derived from the current time and active bookings when possible rather than manually duplicated across unrelated state.

## 8. Time Slot Configuration

Keep slots in one centralized constant:

```ts
[
  { start: "07:30", end: "09:30" },
  { start: "09:30", end: "11:30" },
  { start: "13:00", end: "15:00" },
  { start: "15:00", end: "17:00" }
]
```

Avoid hardcoding these independently in multiple screens.

## 9. Performance

Required list optimization:

- `FlatList`
- Stable keys
- `React.memo(RoomCard)`
- Avoid expensive calculations inside every card render
- Memoize filtered results when useful

Do not over-engineer performance beyond the mini-project scope.

## 10. Notification Architecture

After a successful booking:

```text
booking start
    -
15 minutes
    |
    v
expo-notifications
```

Store the scheduled notification identifier if needed so it can be cancelled when the booking is cancelled.

## 11. Navigation

Recommended flow:

```text
Bottom Tabs
├── Rooms
│   ├── Room List
│   └── Room Detail
└── My Bookings
```

Booking confirmation/success and QR can be presented as screens or modals depending on implementation simplicity.

## 12. Error Handling

Data services should surface meaningful errors.

Required UI should not silently fail.

At minimum distinguish:

- Network/data error
- Booking conflict
- Validation error
- Notification permission failure
