import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'

export default function DoctorCard({ doctor, as = 'h3' }) {
  const Heading = as
  return (
    <article className="doctor-card">
      <div className="doctor-card__head">
        <div className="avatar" style={{ width: 64, height: 64, fontSize: 22 }}>
          {doctor.initials}
        </div>
        <div>
          <Heading>{doctor.name}</Heading>
          <div className="doctor-card__spec">{doctor.specialty}</div>
        </div>
      </div>
      <div className="doctor-card__tags">
        {doctor.species.map((tag) => (
          <span key={tag} className="chip">
            {tag}
          </span>
        ))}
      </div>
      <div className="doctor-card__langs">Speaks {doctor.languages}</div>
      <div className="doctor-card__next">
        <Icon name="clock" size={18} />
        Next: {doctor.nextSlotLabel}
      </div>
      <Link to="/book" state={{ doctorId: doctor.id }} className="btn btn--primary btn--full">
        <Icon name="video" size={20} />
        Book video consult
      </Link>
    </article>
  )
}
