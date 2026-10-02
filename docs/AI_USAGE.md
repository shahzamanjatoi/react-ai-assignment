# How AI assisted this project

This document explains how I used an AI assistant (Cursor) to build a task manager in React, and which parts I reviewed, corrected or refactored by hand. The exact prompts are listed in [PROMPTS.md](http://PROMPTS.md).

**Stack:** Vite · React · TypeScript · plain CSS **AI tool:** Cursor (agent mode) **Workflow:** one prompt at a time → run the app → read the generated code → fix what is wrong → commit AI output and my own fixes as separate commits.

## Summary

AI did most of the first-draft work: it proposed the architecture, wrote the types and components, and styled the interface. I used it as a fast first-draft generator and treated every output as code to review, not code to trust. I tested each result in the browser and read the source before committing, and I made my own changes where the output was incomplete or could be better structured, mainly around accessibility, validation feedback and code organisation.

### Where AI helped


| Stage                            | What AI did                                                                                                                                                                                                                                     | Prompt |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Planning                         | Inspected the Vite starter and proposed a component tree (`TaskManager`, `TaskForm`, `TaskFilters`, `TaskList`, `TaskItem`), the `Task` type, and where state should live (one owner, filtered list derived at render time, no extra libraries) | 1      |
| Scaffolding and components       | Created `src/types/task.ts`, five components, a new `App.tsx` and a full stylesheet in `App.css`, replacing the Vite starter content (8 files in one commit)                                                                                    | 2      |
| Filtering, persistence, priority | *Fill in after Prompt 3*                                                                                                                                                                                                                        | 3      |
| Polish                           | *Fill in after Prompt 4*                                                                                                                                                                                                                        | 4      |


### What worked well

- The plan kept state in one place and derived the visible list instead of storing a second copy, which avoids a common source of bugs.
- `TaskForm` already trimmed the title and ignored empty submissions.
- The stylesheet already included a visible keyboard focus style for the delete button.
- Splitting the work into small prompts made each result easy to review.

### Where AI fell short

- The plan used two names (`TaskStatus` and `TaskFilter`) for the same idea.
- The form input had only a placeholder, with no accessible label.
- An empty submission failed silently, with no message for the user.
- All state logic was placed inside one component, which makes it harder to reuse and extend.
- *Add anything else you find while testing Prompts 3 and 4.*

## Manual improvements

Each improvement below was made after reading the generated code and testing it in the browser. Each one is a separate commit.

### 1. Accessible label and validation feedback in `TaskForm`

**Files:** `src/components/TaskForm.tsx`, `src/App.css` **Commit:** `fix: add input label and empty-title feedback to task form`

**What the AI wrote:** The form trimmed the title and ignored empty submissions, but the input relied on a placeholder and had no label. Pressing "Add task" with an empty field did nothing, with no message. There was no length limit.

**Before:**

```tsx
<input
  type="text"
  className="task-form__input"
  value={title}
  onChange={(event) => setTitle(event.target.value)}
  placeholder="What needs to be done?"
/>

```

**After:**

```tsx
<label htmlFor="task-title" className="visually-hidden">Task title</label>
<input
  id="task-title"
  type="text"
  className="task-form__input"
  value={title}
  maxLength={MAX_TITLE_LENGTH}
  onChange={(event) => {
    setTitle(event.target.value)
    if (error) setError('')
  }}
  placeholder="What needs to be done?"
  aria-invalid={error ? true : undefined}
  aria-describedby={error ? 'task-title-error' : undefined}
/>
{error && (
  <p id="task-title-error" className="task-form__error" role="alert">{error}</p>
)}

```

**What I changed:** Added a visually hidden `<label>` linked to the input, an `error` state that shows a message with `role="alert"`, `aria-invalid` and `aria-describedby`, and `maxLength={100}`. The error clears as soon as the user types.

**What I caught while testing:** In the browser the label appeared as visible text and the error message was unstyled, because the `.visually-hidden` and `.task-form__error` rules were missing from `App.css`. I added both rules and re-tested.

**Why it matters:** A placeholder disappears when the user types and is not a reliable label for screen readers. A silent failure is confusing for every user, and especially for people using assistive technology.

### 2. Extract task logic into a `useTasks` hook

**Files:** `src/hooks/useTasks.ts` (new), `src/components/TaskManager.tsx` **Commits:** `refactor: extract useTasks hook from TaskManager` (adds the hook) and `refactor: use useTasks hook in TaskManager` (switches the component over)

**What the AI wrote:** `TaskManager` was a 68-line component that held the task state, the filter state, the `filterTasks` function and the add, toggle and delete handlers, together with the page markup.

**What I changed:** Moved the state, `filterTasks` and the three handlers into a `useTasks` custom hook (`addTask`, `toggleTask`, `deleteTask`, plus `visibleTasks`, `filter` and `setFilter`). `TaskManager` now only calls the hook and renders the layout (about 26 lines), and the child components' props did not change.

**Before:**

```tsx
export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<TaskFilter>('all')
  const visibleTasks = filterTasks(tasks, filter)
  function handleAdd(title: string) { /* ... */ }
  function handleToggle(id: string) { /* ... */ }
  function handleDelete(id: string) { /* ... */ }
  return ( /* markup */ )
}

```

**After:**

```tsx
export function TaskManager() {
  const { visibleTasks, filter, setFilter, addTask, toggleTask, deleteTask } =
    useTasks()
  return ( /* same markup */ )
}

```

**Mistake I caught:** My first commit added only the hook file. `git status` showed `TaskManager.tsx` had not been modified, so the component was still using its own state and the hook was unused. I switched the component over and committed that separately. `npm run lint` and `npm run build` had passed both times, which showed me that passing checks do not prove the code is wired up.

**Verification:** `npm run lint` and `npm run build` (which type-checks) both pass, and I re-tested adding, toggling, deleting and filtering in the browser.

**Why it matters:** It separates logic from presentation, lets the logic be reused or tested without rendering UI, and gives persistence (`localStorage`) one clear place to live.

### 3. Accessible names for task buttons

**Files:** `src/components/TaskItem.tsx` **Commit:** *fill in after committing*

*Check* `TaskItem.tsx` *first. If the delete button or the checkbox does not name the task it acts on, add an* `aria-label` *such as* `Delete "Buy milk"`*. If it already does, remove this section and do not log it as a fix.*

### 4. Further improvements

*Add one or two more from testing Prompts 3 and 4. Ideas: handling corrupted* `localStorage` *data, validating loaded tasks, typing the priority select correctly, removing unused CSS left over from the Vite starter.*

## What I learned

- AI output looks finished before it is. The label and error message worked in code, but only browser testing showed the missing CSS.
- Passing lint and build does not mean the code is wired up. My first refactor commit added a hook that nothing used, and only `git status` showed it.
- A clear plan before any code made the later prompts shorter and the results easier to check.
- Committing AI output separately from my own changes keeps the history honest and makes my contribution visible.
- *Add a final reflection after Prompt 4.*

