import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { useApp } from '../context/AppContext.jsx'
import { reasons } from '../data/mockData.js'

const TIMES = ['9:00 AM', '9:30 AM', '10:00 AM', '11:30 AM', '4:00 PM', '4:30 PM', '5:30 PM', '7:00 PM']

function buildDays() {
  const days = []
  const today = new Date()
  for (let i = 0; i < 7; i += 1) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    days.push({
      dow: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: String(d.getDate()).padStart(2, '0'),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
    })
  }
  return days
}

export default function Book() {
  const { pets, doctors, getDoctor, getPet, bookAppointment, loading } = useApp()
  const location = useLocation()
  const navigate = useNavigate()

  const days = useMemo(buildDays, [])
  const initialDoctorId = location.state?.doctorId || doctors[0]?.id
  const initialPetId = location.state?.petId || pets[0]?.id

  const [petId, setPetId] = useState(initialPetId)
  const [reason, setReason] = useState(reasons[0])
  const [dayIndex, setDayIndex] = useState(0)
  const [slot, setSlot] = useState(null)
  const [booking, setBooking] = useState(false)

  const doctorId = initialDoctorId
  const doctor = getDoctor(doctorId) || doctors[0]
  const pet = getPet(petId) || pets[0]

  const slots = TIMES.map((t, i) => ({ label: t, disabled: (i + dayIndex) % 4 === 0 }))
  const chosenSlot = slot && slots.find((s) => s.label === slot && !s.disabled)
  const when = chosenSlot ? `${days[dayIndex].dow} ${days[dayIndex].date} ${days[dayIndex].month}, ${slot}` : 'Not chosen yet'

  const handleConfirm = async () => {
    if (!chosenSlot || !pet || !doctor) return
    setBooking(true)
    await bookAppointment({
      petId: pet.id,
      doctorId: doctor.id,
      reason,
      dayLabel: `${days[dayIndex].month} ${days[dayIndex].date}`,
      timeLabel: slot,
    })
    setBooking(false)
    navigate('/appointments')
  }

  if (loading || !pet || !doctor) return null

  return (
    <section className="container">
      <div className="page-header" style={{ marginBottom: 8 }}>
        <Link to="/doctors" className="back-link">
          <Icon name="back" size={18} />
          All doctors
        </Link>
        <h1 className="page-title">Book a video consultation</h1>
      </div>

      <div className="book-layout">
        <div className="book-main">
          <div className="step-block">
            <div className="step-block__head">
              <span className="step-block__num">1</span>
              <h2>Who is this for?</h2>
            </div>
            <div className="pet-picker">
              {pets.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="pet-picker__option"
                  aria-pressed={p.id === pet.id}
                  onClick={() => setPetId(p.id)}
                >
                  <span className="pet-picker__option-name">{p.name}</span>
                  <span className="pet-picker__option-meta">
                    {p.species}, {p.breed}
                  </span>
                </button>
              ))}
              <Link to="/pets" className="pet-picker__add">
                <Icon name="plus" size={20} />
                Add a pet
              </Link>
            </div>
          </div>

          <div className="step-block">
            <div className="step-block__head">
              <span className="step-block__num">2</span>
              <h2>What is it about?</h2>
            </div>
            <div role="group" aria-label="Reason for visit" style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {reasons.map((r) => (
                <button
                  key={r}
                  type="button"
                  className="chip-toggle"
                  aria-pressed={r === reason}
                  onClick={() => setReason(r)}
                >
                  {r}
                </button>
              ))}
            </div>
            <div className="field">
              <label htmlFor="notes">Anything the doctor should know?</label>
              <textarea
                id="notes"
                rows={3}
                placeholder="Since when, what you have noticed, anything you have tried"
              />
            </div>
          </div>

          <div className="step-block">
            <div className="step-block__head">
              <span className="step-block__num">3</span>
              <h2>Pick a time</h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, fontSize: 17 }}>
                {days[0].month} {new Date().getFullYear()}
              </span>
              <span style={{ color: 'var(--muted)', fontSize: 15 }}>Times in IST</span>
            </div>
            <div className="day-grid" role="group" aria-label="Day">
              {days.map((d, i) => (
                <button
                  key={`${d.month}-${d.date}`}
                  type="button"
                  className="day-cell"
                  aria-pressed={i === dayIndex}
                  onClick={() => {
                    setDayIndex(i)
                    setSlot(null)
                  }}
                >
                  <span className="day-cell__dow">{d.dow}</span>
                  <span className="day-cell__date">{d.date}</span>
                </button>
              ))}
            </div>
            <div className="slot-grid" role="group" aria-label="Time">
              {slots.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  className="slot-cell"
                  disabled={s.disabled}
                  aria-pressed={s.label === slot}
                  onClick={() => setSlot(s.label)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <aside className="summary-card" aria-label="Booking summary">
          <div className="summary-doctor">
            <div className="avatar" style={{ width: 56, height: 56, fontSize: 20 }}>
              {doctor.initials}
            </div>
            <div>
              <div className="summary-doctor__name">{doctor.name}</div>
              <div style={{ color: 'var(--muted)', fontSize: 15 }}>{doctor.specialty}</div>
            </div>
          </div>
          <hr className="hr" />
          <dl className="summary-list">
            <div className="summary-list__row">
              <dt>Pet</dt>
              <dd>{pet.name}</dd>
            </div>
            <div className="summary-list__row">
              <dt>Reason</dt>
              <dd>{reason}</dd>
            </div>
            <div className="summary-list__row">
              <dt>When</dt>
              <dd>{when}</dd>
            </div>
            <div className="summary-list__row">
              <dt>Format</dt>
              <dd>Video consultation</dd>
            </div>
            <div className="summary-list__row">
              <dt>Fee</dt>
              <dd>[FEE]</dd>
            </div>
          </dl>
          <hr className="hr" />
          <button
            type="button"
            className="btn btn--primary btn--full"
            disabled={!chosenSlot || booking}
            onClick={handleConfirm}
          >
            {booking ? 'Booking…' : 'Confirm booking'}
          </button>
          <p className="summary-note">
            The video link appears under Appointments shortly before your slot.
          </p>
        </aside>
      </div>
    </section>
  )
}
