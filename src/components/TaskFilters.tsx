import type { TaskFilter } from '../types/task'

type TaskFiltersProps = {
  filter: TaskFilter
  onFilterChange: (filter: TaskFilter) => void
}

const FILTERS: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
]

export function TaskFilters({ filter, onFilterChange }: TaskFiltersProps) {
  return (
    <div className="task-filters" role="group" aria-label="Filter tasks">
      {FILTERS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          className={
            filter === value
              ? 'task-filters__button task-filters__button--active'
              : 'task-filters__button'
          }
          aria-pressed={filter === value}
          onClick={() => onFilterChange(value)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
