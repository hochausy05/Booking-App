# Development Rules

## 1. Scope

Implement only what is required by the assignment unless an additional change clearly improves reliability.

Do not expand the project with unrelated features.

## 2. Task Discipline

Work on one task at a time.

Before implementation:

1. Identify the current `MP2-XX` task.
2. Read only the relevant project files.
3. State the files expected to change when useful.

After implementation:

1. Run relevant checks.
2. Verify the feature manually when applicable.
3. Update `TASKS.md`.
4. Append a new entry to `CHANGELOG.md`.

Do not mark a task complete based only on code changes.

## 3. Bug Rule

When a bug or suspicious behavior is reported:

- Do not immediately rewrite large parts of the implementation.
- First inspect and reproduce the issue where possible.
- Identify the likely cause using evidence.
- Apply the smallest safe fix.
- Re-test the affected flow and related completed flows.

If the cause is not sufficiently established, continue diagnosis before producing a fix plan.

## 4. Documentation Rule

Keep documentation concise and useful for future AI/code-agent sessions.

Avoid duplicating the same long explanation in multiple files.

Use:

- `AGENTS.md` for fast agent context.
- `PRD.md` for product requirements.
- `ARCHITECTURE.md` for technical decisions.
- `PLAN.md` for task order.
- `TASKS.md` for status.
- `CHANGELOG.md` for implementation history.

## 5. CHANGELOG Rule

`CHANGELOG.md` is append-only.

- Write entries in Vietnamese.
- Never erase previous entries.
- Never rewrite the whole file just to add one task.
- Add the newest task below existing history unless another ordering has explicitly been established.

Each task entry should include:

- Date
- Task ID
- Status
- Main changes
- Verification performed
- Known limitations if any

## 6. Supabase Rule

Do not require Supabase for every task.

Use or request Supabase only when the task genuinely needs or clearly benefits from:

- Remote schema
- Persistent shared data
- Booking conflict protection
- Multi-device synchronization
- Realtime subscriptions

UI-only tasks should not require database access.

## 7. State Rule

Zustand is the global application state layer required by the assignment.

AsyncStorage is for local persistence, not the authoritative multi-user booking database.

## 8. Booking Safety

Never trust only the currently rendered UI when creating a booking.

Before persisting a booking, confirm that the room/date/slot is still available.

## 9. Code Quality

Prefer:

- Small reusable components
- Explicit TypeScript types
- Simple functions
- Clear names
- Minimal dependencies
- Predictable state flow

Avoid:

- Premature abstraction
- Giant components
- Duplicate booking logic
- Hidden side effects
- Unnecessary dependency additions

## 10. UI Reliability

Every visible interactive control must work.

Do not leave:

- Dead buttons
- Placeholder navigation
- Broken close buttons
- Silent failures
- Unhandled loading/error states in required flows

## 11. Git

Use small, meaningful commits.

Recommended style:

- `feat: ...`
- `fix: ...`
- `refactor: ...`
- `docs: ...`
- `chore: ...`

Do not commit secrets or local `.env` values.

## 12. Definition of Done

The project is complete only when the required flow works on a physical device:

Room discovery → filter/search → room detail → date → slot → booking → QR pass → My Bookings → cancel.

The notification flow must also be tested separately.
