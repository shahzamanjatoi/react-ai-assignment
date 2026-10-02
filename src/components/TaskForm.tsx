import { useState, type FormEvent } from 'react'

type TaskFormProps = {
  onAdd: (title: string) => void
}

const MAX_TITLE_LENGTH = 100

export function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) {
      setError('Please enter a task title.')
      return
    }
    onAdd(trimmed)
    setTitle('')
    setError('')
  }

  return (
    <>
      <form className="task-form" onSubmit={handleSubmit}>
        <label htmlFor="task-title" className="visually-hidden">
          Task title
        </label>
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
        <button type="submit" className="task-form__submit">
          Add task
        </button>
      </form>
      {error && (
        <p id="task-title-error" className="task-form__error" role="alert">
          {error}
        </p>
      )}
    </>
  )
}