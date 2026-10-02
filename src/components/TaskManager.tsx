import { useTasks } from '../hooks/useTasks'
import { TaskFilters } from './TaskFilters'
import { TaskForm } from './TaskForm'
import { TaskList } from './TaskList'

export function TaskManager() {
  const { visibleTasks, filter, setFilter, addTask, toggleTask, deleteTask } =
    useTasks()

  return (
    <div className="task-manager">
      <header className="task-manager__header">
        <h1>Tasks</h1>
        <p className="task-manager__subtitle">Keep track of what you need to do.</p>
      </header>
      <TaskForm onAdd={addTask} />
      <TaskFilters filter={filter} onFilterChange={setFilter} />
      <TaskList
        tasks={visibleTasks}
        onToggle={toggleTask}
        onDelete={deleteTask}
      />
    </div>
  )
}