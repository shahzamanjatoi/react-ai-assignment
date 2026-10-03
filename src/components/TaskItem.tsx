import type { Task } from '../types/task'

type TaskItemProps = {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <li className={task.completed ? 'task-item task-item--completed' : 'task-item'}>
      <label className="task-item__label">
        <input
          type="checkbox"
          className="task-item__checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />
        <span className="task-item__title">{task.title}</span>
      </label>
      <button
        type="button"
        className="task-item__delete"
        aria-label={`Delete "${task.title}"`}
        onClick={() => onDelete(task.id)}
      >
        Delete
      </button>
    </li>
  )
}