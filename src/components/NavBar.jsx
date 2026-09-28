import { NavLink, Link } from 'react-router-dom'
import Icon from './Icon.jsx'

const LINKS = [
  { to: '/doctors', label: 'Find a doctor' },
  { to: '/pets', label: 'My pets' },
  { to: '/appointments', label: 'Appointments' },
]

export default function NavBar() {
  return (
    <header className="navbar">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <Link to="/" className="navbar__brand">
          <span className="navbar__mark">
            <Icon name="paw" size={22} />
          </span>
          <span className="navbar__name">VetLink</span>
        </Link>
        <nav aria-label="Main" className="navbar__links">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
          <Link to="/book" className="btn btn--primary navbar__cta">
            Book a consultation
          </Link>
        </nav>
      </div>
    </header>
  )
}
