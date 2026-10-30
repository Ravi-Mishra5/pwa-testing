
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'my-todo-tasks'

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    } catch {
      return []
    }
  })

  const [input, setInput] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  function addTask(e) {
    e.preventDefault()

    const title = input.trim()
    if (!title) return

    setTasks((previous) => [
      {
        id: crypto.randomUUID(),
        title,
        completed: false,
        createdAt: new Date().toISOString(),
      },
      ...previous,
    ])

    setInput('')
  }

  function toggleTask(id) {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    )
  }

  function deleteTask(id) {
    setTasks((previous) =>
      previous.filter((task) => task.id !== id)
    )
  }

  function clearCompleted() {
    setTasks((previous) =>
      previous.filter((task) => !task.completed)
    )
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length

  const activeCount = tasks.length - completedCount

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-800 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-3xl text-white shadow-lg shadow-indigo-200">
            ✓
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            My Tasks
          </h1>

          <p className="mt-3 text-slate-500">
            Organize your day, one task at a time.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Works offline
          </div>
        </header>

        <section className="rounded-3xl bg-white p-5 shadow-xl shadow-slate-200/60 sm:p-8">
          <form onSubmit={addTask} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What do you need to do?"
              aria-label="New task"
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />

            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 active:scale-95"
            >
              Add
            </button>
          </form>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <Stat label="Total" value={tasks.length} />
            <Stat label="Active" value={activeCount} />
            <Stat label="Completed" value={completedCount} />
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
              {['all', 'active', 'completed'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium capitalize transition ${filter === item
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                    }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {completedCount > 0 && (
              <button
                type="button"
                onClick={clearCompleted}
                className="text-sm font-medium text-rose-600 hover:text-rose-700"
              >
                Clear completed
              </button>
            )}
          </div>

          <div className="mt-5 space-y-3">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 rounded-xl border border-slate-100 p-4 transition hover:border-indigo-100 hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  aria-label={`Mark ${task.title} as ${task.completed ? 'active' : 'completed'
                    }`}
                  className="h-5 w-5 shrink-0 cursor-pointer accent-indigo-600"
                />

                <div className="min-w-0 flex-1">
                  <p
                    className={`break-words font-medium ${task.completed
                        ? 'text-slate-400 line-through'
                        : 'text-slate-700'
                      }`}
                  >
                    {task.title}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {task.completed ? 'Completed' : 'In progress'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => deleteTask(task.id)}
                  aria-label={`Delete ${task.title}`}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                >
                  Delete
                </button>
              </div>
            ))}

            {filteredTasks.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-12 text-center">
                <div className="text-4xl">
                  {filter === 'completed' ? '🎉' : '📝'}
                </div>

                <p className="mt-3 font-semibold text-slate-700">
                  {tasks.length === 0
                    ? 'No tasks yet'
                    : 'Nothing to show'}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  {tasks.length === 0
                    ? 'Add your first task above to get started.'
                    : `You have no ${filter} tasks right now.`}
                </p>
              </div>
            )}
          </div>

          <footer className="mt-6 border-t border-slate-100 pt-4 text-center text-sm text-slate-400">
            {activeCount === 0 && tasks.length > 0
              ? 'All tasks completed. Great work!'
              : `${activeCount} task${activeCount === 1 ? '' : 's'} left to complete`}
          </footer>
        </section>

        <p className="mt-5 text-center text-sm text-slate-400">
          Your tasks are saved on this device.
        </p>
      </div>
    </main>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-4 text-center">
      <p className="text-2xl font-bold text-indigo-600">{value}</p>
      <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
        {label}
      </p>
    </div>
  )
}

export default App
