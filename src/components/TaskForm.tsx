import { useState, type FormEvent } from 'react'

type TaskFormProps = {
  onAdd: (title: string) => void
}

export function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) {
      return
    }
    onAdd(trimmed)
    setTitle('')
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="task-form__input"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="What needs to be done?"
      />
      <button type="submit" className="task-form__submit">
        Add task
      </button>
    </form>
  )
}
