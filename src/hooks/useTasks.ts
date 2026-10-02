import { useState } from 'react'
import type { Task, TaskFilter } from '../types/task'

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

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<TaskFilter>('all')

  const visibleTasks = filterTasks(tasks, filter)

  function addTask(title: string) {
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

  function toggleTask(id: string) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  function deleteTask(id: string) {
    setTasks((current) => current.filter((task) => task.id !== id))
  }

  return { tasks, visibleTasks, filter, setFilter, addTask, toggleTask, deleteTask }
}