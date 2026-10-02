import { useState } from 'react'
import type { Task, TaskFilter } from '../types/task'
import { TaskFilters } from './TaskFilters'
import { TaskForm } from './TaskForm'
import { TaskList } from './TaskList'

function filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
  switch (filter) {
    case 'active':
      return tasks.filter((task) => !task.completed)
    case 'completed':
      return tasks.filter((task) => task.completed)
    default:
      return tasks
  }
}

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<TaskFilter>('all')

  const visibleTasks = filterTasks(tasks, filter)

  function handleAdd(title: string) {
    const trimmed = title.trim()
    if (!trimmed) {
      return
    }
    setTasks((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        title: trimmed,
        completed: false,
        createdAt: Date.now(),
      },
    ])
  }

  function handleToggle(id: string) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  function handleDelete(id: string) {
    setTasks((current) => current.filter((task) => task.id !== id))
  }

  return (
    <div className="task-manager">
      <header className="task-manager__header">
        <h1>Tasks</h1>
        <p className="task-manager__subtitle">Keep track of what you need to do.</p>
      </header>
      <TaskForm onAdd={handleAdd} />
      <TaskFilters filter={filter} onFilterChange={setFilter} />
      <TaskList
        tasks={visibleTasks}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />
    </div>
  )
}
