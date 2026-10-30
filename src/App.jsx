import { useEffect, useState } from 'react'

const STORAGE_KEY = 'my-todo-tasks'

function App() {
  const [tasks, setTasks] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
  })
  const [input, setInput] = useState('')
  const [inputError, setInputError] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)), [tasks])

  function addTask(e) {
    e.preventDefault()
    const title = input.trim()
    if (!title) { setInputError('Please enter a task before adding it.'); return }
    setTasks((previous) => [{ id: crypto.randomUUID(), title, completed: false }, ...previous])
    setInput('')
    setInputError('')
  }

  function toggleTask(id) {
    setTasks((previous) => previous.map((task) => task.id === id ? { ...task, completed: !task.completed } : task))
  }

  function deleteTask(id) { setTasks((previous) => previous.filter((task) => task.id !== id)) }

  const completedCount = tasks.filter((task) => task.completed).length
  const activeCount = tasks.length - completedCount
  const filteredTasks = tasks.filter((task) => filter === 'active' ? !task.completed : filter === 'completed' ? task.completed : true)

  return (
    <div className="site-shell">
      <header className="topbar">
        <nav className="nav-wrap" aria-label="Main navigation">
          <a className="brand" href="#home" aria-label="Daymark home"><span className="brand-mark">d.</span><span>daymark</span></a>
          <div className="nav-links">
            <a href="#home">Home</a><a href="#planner">Planner</a><a href="#features">Features</a><a href="#about">About</a>
          </div>
          <a className="nav-cta" href="#planner">Get organized <span aria-hidden="true">↗</span></a>
        </nav>
      </header>

      <main>
        <section className="hero-section" id="home">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> A little more focused, every day</div>
            <h1>Make room for<br /><span>what matters.</span></h1>
            <p className="hero-description">A calmer way to plan your day. Capture your to-dos, find your focus, and celebrate the little wins along the way.</p>
            <div className="hero-actions"><a className="button button-primary" href="#planner">Start planning <span aria-hidden="true">→</span></a><a className="text-link" href="#features">Explore the features <span aria-hidden="true">↓</span></a></div>
            <div className="hero-note"><span className="note-check">✓</span> Free to use <i /> Works offline <i /> Your tasks stay private</div>
          </div>
          <div className="hero-art" aria-label="Illustration of a daily planner">
            <div className="art-sun" />
            <div className="art-card">
              <div className="art-card-top"><span>YOUR DAY, IN VIEW</span><span className="art-date">MON · 09</span></div>
              <div className="art-heading">A fresh start<span className="art-sparkle">✳</span></div>
              <div className="art-progress"><span /><span /><span /></div>
              <div className="art-task"><b className="art-tick">✓</b><span>Plan the week ahead</span><small>9:00</small></div>
              <div className="art-task"><b className="art-tick empty" /><span>Make time for a walk</span><small>11:30</small></div>
              <div className="art-task"><b className="art-tick empty" /><span>Finish the important thing</span><small>2:00</small></div>
              <div className="art-footer"><span>YOU'VE GOT THIS</span><span>✦</span></div>
            </div>
            <div className="art-sticker sticker-one">one thing<br />at a time</div><div className="art-sticker sticker-two">✦</div>
            <div className="art-plant"><span /><span /><span /><span /><b /></div>
          </div>
        </section>

        <section className="planner-section" id="planner">
          <div className="section-heading"><div><div className="eyebrow">YOUR PERSONAL PLANNER</div><h2>Start with one thing.</h2></div><p>Small steps add up. Write down what’s on your mind and take it from there.</p></div>
          <div className="planner-layout">
            <div className="todo-panel">
              <div className="todo-panel-heading"><div><span className="panel-icon">✳</span><div><h3>Today’s list</h3><p>{activeCount === 0 && tasks.length ? 'Everything is checked off. Nice work!' : `${activeCount} thing${activeCount === 1 ? '' : 's'} left to do`}</p></div></div><span className="today-label">TODAY</span></div>
              <form onSubmit={addTask} className="task-form">
                <input type="text" value={input} onChange={(e) => { setInput(e.target.value); if (e.target.value.trim()) setInputError('') }} placeholder="Add something to your day..." aria-label="New task" aria-invalid={Boolean(inputError)} aria-describedby={inputError ? 'task-input-error' : undefined} />
                <button type="submit" aria-label="Add task">＋</button>
              </form>
              {inputError && <p id="task-input-error" role="alert" className="input-error">{inputError}</p>}
              <div className="task-toolbar"><div className="task-filters">{['all', 'active', 'completed'].map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={filter === item ? 'selected' : ''}>{item}</button>)}</div><span>{tasks.length} total</span></div>
              <div className="task-list">
                {filteredTasks.map((task) => <div className="task-row" key={task.id}><input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} aria-label={`Mark ${task.title} as ${task.completed ? 'active' : 'completed'}`} /><span className={task.completed ? 'task-title completed' : 'task-title'}>{task.title}</span><button className="delete-task" type="button" onClick={() => deleteTask(task.id)} aria-label={`Delete ${task.title}`}>×</button></div>)}
                {filteredTasks.length === 0 && <div className="empty-state"><span>{filter === 'completed' ? '✦' : '☀'}</span><b>{tasks.length === 0 ? 'A clean slate.' : 'Nothing here just yet.'}</b><p>{tasks.length === 0 ? 'Add your first task above and make today yours.' : `Your ${filter} list will show up here.`}</p></div>}
              </div>
              <div className="task-summary"><span><b>{completedCount}</b> completed</span><span><b>{activeCount}</b> still to go</span></div>
            </div>
            <aside className="planner-aside"><div className="quote-mark">“</div><blockquote>You don’t have to do it all. You just have to begin.</blockquote><div className="quote-rule" /><p>A gentle reminder from daymark</p><div className="aside-scribble">✳</div></aside>
          </div>
        </section>

        <section className="features-section" id="features">
          <div className="features-head"><div className="eyebrow">A TOOL THAT GETS OUT OF YOUR WAY</div><h2>Simple by design.<br /><span>Helpful by nature.</span></h2></div>
          <div className="feature-grid">
            <article className="feature-card"><span className="feature-icon peach">↗</span><h3>Find your focus</h3><p>Keep your next steps in one clear, friendly place. Less mental clutter, more room to think.</p></article>
            <article className="feature-card"><span className="feature-icon sage">◷</span><h3>Keep your rhythm</h3><p>Make a little progress whenever you can. Your list is ready when you are, at your own pace.</p></article>
            <article className="feature-card"><span className="feature-icon lavender">☁</span><h3>Take it anywhere</h3><p>Your tasks are saved on this device and your planner works offline, wherever the day takes you.</p></article>
          </div>
        </section>

        <section className="closing-section" id="about"><div className="closing-mark">d.</div><div><div className="eyebrow">A NOTE FROM DAYMARK</div><h2>Progress can be peaceful.</h2><p>Daymark is a small, simple space to help you move through your day with a little more clarity. No pressure to do it all. Just a place to begin.</p></div><a className="button button-light" href="#planner">Make a plan <span aria-hidden="true">→</span></a></section>
      </main>
      <footer className="site-footer"><a className="brand footer-brand" href="#home"><span className="brand-mark">d.</span><span>daymark</span></a><span>A softer way to get things done.</span><a href="#home">Back to top ↑</a></footer>
    </div>
  )
}

export default App
