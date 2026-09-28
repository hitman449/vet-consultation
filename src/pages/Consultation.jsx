import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { useApp } from '../context/AppContext.jsx'

export default function Consultation() {
  const { upcomingAppointments, getDoctor, getPet, loading } = useApp()
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState([
    'Hello! I can see you now. Is Bruno still scratching his ear?',
  ])

  if (loading) return null

  const appointment = upcomingAppointments[0]

  if (!appointment) {
    return (
      <section className="container consultation">
        <div className="consultation__empty">
          <h1>No video call to join right now</h1>
          <p style={{ color: 'var(--dark-muted)', margin: 0 }}>
            Book a consultation and it will show up here when it&rsquo;s time to join.
          </p>
          <Link to="/book" className="btn btn--primary">
            Book a consultation
          </Link>
        </div>
      </section>
    )
  }

  const doctor = getDoctor(appointment.doctorId)
  const pet = getPet(appointment.petId)

  const handleSend = (e) => {
    e.preventDefault()
    if (!message.trim()) return
    setSent((prev) => [...prev, message.trim()])
    setMessage('')
  }

  return (
    <section className="container consultation">
      <header className="consultation__header">
        <div className="consultation__title">
          <strong>VetLink</strong>
          <span>
            {pet?.name} &middot; {appointment.reason} with {doctor?.name}
          </span>
        </div>
        <span className="consultation__status">Connected &middot; 12:04</span>
      </header>

      <div className="consultation__body">
        <div className="consultation__stage-col">
          <div className="consultation__stage">
            <div className="avatar" style={{ width: 180, height: 180, fontSize: 64 }}>
              {doctor?.initials}
            </div>
            <span className="consultation__stage-name">{doctor?.name}</span>
            <div className="consultation__self">You</div>
          </div>
          <div className="consultation__controls">
            <button type="button" className="control-btn" aria-label="Mute microphone">
              <Icon name="mic" size={24} />
            </button>
            <button type="button" className="control-btn" aria-label="Turn camera off">
              <Icon name="video" size={24} />
            </button>
            <button type="button" className="control-btn" aria-label="Open chat">
              <Icon name="chat" size={24} />
            </button>
            <Link to="/appointments" className="control-btn control-btn--end" aria-label="Leave call">
              <Icon name="x" size={24} />
            </Link>
          </div>
        </div>

        <aside className="consultation__side">
          <div className="consultation__panel">
            <div className="consultation__pet-head">
              <div className="avatar" style={{ width: 44, height: 44 }}>
                <Icon name="paw" size={22} />
              </div>
              <div>
                <strong style={{ display: 'block' }}>{pet?.name}</strong>
                <span>
                  {pet?.breed} &middot; {pet?.age}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
              {pet?.tags.map((t) => (
                <span className="dark-chip" key={t}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="consultation__panel chat-panel" style={{ flexDirection: 'column', display: 'flex' }}>
            <h2>Chat</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flexGrow: 1 }}>
              {sent.map((m, i) => (
                <div className="chat-bubble" key={i}>
                  {m}
                </div>
              ))}
            </div>
            <form className="chat-input-row" onSubmit={handleSend}>
              <label htmlFor="msg" style={{ position: 'absolute', left: -9999 }}>
                Message
              </label>
              <input
                id="msg"
                type="text"
                placeholder="Type a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button type="submit">Send</button>
            </form>
          </div>
        </aside>
      </div>
    </section>
  )
}
