import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { useApp } from '../context/AppContext.jsx'

export default function Appointments() {
  const { upcomingAppointments, pastAppointments, getDoctor, getPet, cancelAppointment, loading } = useApp()

  if (loading) return null

  const [featured, ...restUpcoming] = upcomingAppointments

  return (
    <section className="container">
      <div className="page-header" style={{ marginBottom: 32 }}>
        <h1 className="page-title">Appointments</h1>
      </div>

      <div className="appt-layout">
        <div className="appt-main">
          {featured ? (
            <FeaturedAppointment
              appointment={featured}
              doctor={getDoctor(featured.doctorId)}
              pet={getPet(featured.petId)}
              onCancel={() => cancelAppointment(featured.id)}
            />
          ) : (
            <div className="empty-state">
              No upcoming video calls yet.{' '}
              <Link to="/book" style={{ color: 'var(--green)', fontWeight: 600 }}>
                Book one
              </Link>
              .
            </div>
          )}

          {restUpcoming.length > 0 && (
            <>
              <h2 style={{ margin: '16px 0 0', fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 28 }}>
                Coming up
              </h2>
              {restUpcoming.map((appt) => (
                <AppointmentRow
                  key={appt.id}
                  appointment={appt}
                  doctor={getDoctor(appt.doctorId)}
                  pet={getPet(appt.petId)}
                  action={
                    <button type="button" className="link-btn" onClick={() => cancelAppointment(appt.id)}>
                      Cancel
                    </button>
                  }
                />
              ))}
            </>
          )}

          {pastAppointments.length > 0 && (
            <>
              <h2 style={{ margin: '16px 0 0', fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 28 }}>
                Past visits
              </h2>
              {pastAppointments.map((appt) => (
                <AppointmentRow
                  key={appt.id}
                  appointment={appt}
                  doctor={getDoctor(appt.doctorId)}
                  pet={getPet(appt.petId)}
                  action={
                    <Link to="/pets" className="link-btn">
                      View notes
                    </Link>
                  }
                />
              ))}
            </>
          )}
        </div>

        <aside className="appt-sidebar">
          <h2>Need another visit?</h2>
          <p>Book for any pet on your profile.</p>
          <Link to="/book" className="btn btn--primary btn--full">
            Book a consultation
          </Link>
          <Link to="/doctors" className="btn btn--secondary btn--full">
            Find a doctor
          </Link>
        </aside>
      </div>
    </section>
  )
}

function FeaturedAppointment({ appointment, doctor, pet, onCancel }) {
  return (
    <article className="appt-featured">
      <div className="appt-featured__eyebrow">
        <Icon name="video" size={20} />
        Next up &middot; {appointment.dayLabel}, {appointment.timeLabel} IST
      </div>
      <div>
        <div className="appt-featured__title">
          {pet?.name} &middot; {appointment.reason}
        </div>
        <div className="appt-featured__meta">
          with {doctor?.name}, {doctor?.specialty}
        </div>
      </div>
      <div className="appt-featured__actions">
        <Link to="/consultation" className="btn btn--on-dark">
          <Icon name="video" size={20} />
          Join video call
        </Link>
        <Link to="/book" state={{ petId: pet?.id, doctorId: doctor?.id }} className="btn btn--outline-on-dark">
          Reschedule
        </Link>
        <button type="button" className="link-btn" style={{ color: 'var(--cream)' }} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </article>
  )
}

function AppointmentRow({ appointment, doctor, pet, action }) {
  const [month, day] = appointment.dayLabel.split(' ')
  return (
    <article className="appt-row">
      <div className="appt-row__date">
        <div className="appt-row__dow">{month}</div>
        <div className="appt-row__day">{day}</div>
      </div>
      <div className="appt-row__body">
        <div className="appt-row__title">
          {pet?.name} &middot; {appointment.reason}
        </div>
        <div className="appt-row__meta">
          {appointment.timeLabel} &middot; {doctor?.name}
        </div>
      </div>
      {action}
    </article>
  )
}
