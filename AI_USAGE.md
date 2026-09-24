# AI Usage Guide

## Purpose

AI tools may assist with implementation, review, debugging, documentation, and test planning.

The AI should optimize for:

1. Assignment compliance
2. Reliability
3. Small, reviewable changes
4. Low unnecessary complexity

## Recommended Prompt Context

For a normal task, provide:

- Current task ID
- `AGENTS.md`
- Relevant source files
- Relevant section of `TASKS.md`

Only provide larger documents when they are necessary.

## Avoid Context Waste

Do not ask the coding agent to read every `.md` file on every task.

Use this hierarchy:

- Fast context → `AGENTS.md`
- Requirement ambiguity → `docs/PRD.md`
- Architecture decision → `docs/ARCHITECTURE.md`
- Setup issue → `docs/ENVIRONMENT.md`
- Workflow rules → `RULES.md`

## Implementation Prompt Pattern

Use a compact format:

```text
Task: MP2-XX — <name>

Goal:
<one concise goal>

Requirements:
- ...
- ...

Constraints:
- Follow AGENTS.md and RULES.md.
- Do not expand scope.
- Reuse existing architecture.
- Do not introduce new dependencies unless necessary.

Verification:
- ...
- ...

After completion:
- Update TASKS.md.
- Append a Vietnamese entry to CHANGELOG.md.
- Summarize changed files and verification results.
```

## Debugging Prompt Pattern

Do not instruct the AI to blindly fix the issue.

First ask it to:

```text
Analyze the reported behavior.
Inspect the relevant code and runtime evidence.
Identify the most likely cause.
Do not modify code until the cause and minimal safe fix are sufficiently established.
```

Then apply the fix after diagnosis is clear.

## Database / Supabase Usage

Only give Supabase access/context when the current task needs:

- Database schema
- Booking persistence
- Conflict handling
- Realtime subscriptions
- Shared multi-device state

Do not attach database context to UI-only tasks.

## Final Review

Before submission, AI should review against the actual assignment requirements rather than inventing additional product requirements.
