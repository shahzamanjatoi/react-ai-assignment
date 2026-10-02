# Prompts used

This file records every prompt I sent to the AI assistant (Cursor) while building the task manager, what the AI produced, and what I reviewed or changed by hand. Manual fixes are described in more detail in [AI_USAGE.md](./AI_USAGE.md).

**Tools:** Cursor (agent mode, Cursor Grok 4.6 Medium) · Vite + React + TypeScript

## Summary

| # | Goal | Status | Manual changes after review |
|---|------|--------|-----------------------------|
| 1 | Plan structure, types and state (no code) | Done | Standardised the filter type name; decided to extract a `useTasks` hook |
| 2 | Build the base components and types | To do | _fill in after running_ |
| 3 | Add filtering, persistence and priority | To do | _fill in after running_ |
| 4 | Polish: empty states, accessibility, error handling | To do | _fill in after running_ |

---

## Prompt 1: Plan the structure (no code)

**Prompt sent:**

> I'm building a task manager in this Vite React TypeScript project. Before writing code, propose a component structure, the TypeScript types for a task, and where state should live. Don't write any code yet.

**What the AI produced:**
- Inspected the existing Vite starter (`App.tsx`, `main.tsx`, React 19, no extra libraries).
- Proposed `src/types/task.ts` and five components in `src/components/`: `TaskManager`, `TaskForm`, `TaskFilters`, `TaskList`, `TaskItem`.
- `Task` type: `id: string`, `title: string`, `completed: boolean`, `createdAt: number`. Filter type: `'all' | 'active' | 'completed'`.
- State: `useState<Task[]>` and `useState<TaskFilter>` in `TaskManager`, with `visibleTasks` derived during render (not stored). The form keeps only its own draft string. Updates flow up through `onAdd`, `onToggle` and `onDelete` callbacks.
- Optional `localStorage` persistence in one place (`TaskManager` or a `useTasks` hook).

**My review notes:**
- The plan used both `TaskStatus` and `TaskFilter` for the same idea. I will use `TaskFilter` everywhere.
- The plan puts all handlers inside `TaskManager`. I will move that logic into a `useTasks` hook so the component stays thin.
- The plan does not cover empty-title handling or task priority. I will check this in the generated code and add a `priority` field myself.

---

## Prompt 2: Build the base components and types

**Prompt sent:**

> Implement the plan you proposed. Create `src/types/task.ts` with the `Task` type and a `TaskFilter` type ('all' | 'active' | 'completed'). Create `TaskManager`, `TaskForm`, `TaskFilters`, `TaskList` and `TaskItem` in `src/components/`. Keep all task state and handlers inside `TaskManager` for now. Functional components, typed props, plain CSS in `App.css`. Remove the Vite starter content from `App.tsx` and render `TaskManager` there. Don't add localStorage or edit mode yet.

**What the AI produced:**
_Fill in after running: files created, anything unexpected._

**What I tested:**
_Add a task, add an empty task, toggle, delete, switch filters. Note what broke._

**What I changed by hand:**
_List each fix with the commit message, for example `fix: block empty task titles`._

---

## Prompt 3: Filtering, persistence and priority

**Prompt sent:**

> Wire up the filters so `TaskList` only shows tasks matching the selected filter, derived during render. Save tasks to `localStorage` and load them on startup, keeping all storage code in one place. Add a `priority` field ('low' | 'medium' | 'high') to `Task`, a select in `TaskForm`, and a small priority label in `TaskItem`.

**What the AI produced:**
_Fill in after running._

**What I changed by hand:**
_Fill in after running. Example areas: handling corrupted `localStorage` data, validating loaded tasks, typing the priority select correctly._

---

## Prompt 4: Polish

**Prompt sent:**

> Improve usability and accessibility: add a clear empty state for each filter, show a count of remaining active tasks, add proper `label` elements and `aria-` attributes to the form and buttons, and make sure everything works with the keyboard.

**What the AI produced:**
_Fill in after running._

**What I changed by hand:**
_Fill in after running._

---

## Notes

- Every prompt above is the exact text I sent.
- I committed AI-generated code and my own fixes as separate commits so the Git history shows which is which.