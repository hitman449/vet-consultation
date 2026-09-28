import { useMemo, useState } from 'react'
import Icon from '../components/Icon.jsx'
import DoctorCard from '../components/DoctorCard.jsx'
import { useApp } from '../context/AppContext.jsx'

const SPECIES = [
  ['all', 'All pets'],
  ['dogs', 'Dogs'],
  ['cats', 'Cats'],
  ['birds', 'Birds'],
  ['small', 'Small mammals'],
]

export default function Doctors() {
  const { doctors, loading } = useApp()
  const [species, setSpecies] = useState('all')
  const [todayOnly, setTodayOnly] = useState(false)

  const filtered = useMemo(
    () =>
      doctors.filter(
        (d) => (species === 'all' || d.species.includes(species)) && (!todayOnly || d.availableToday),
      ),
    [doctors, species, todayOnly],
  )

  return (
    <section className="container">
      <div className="page-header">
        <h1 className="page-title">Find a doctor</h1>
        <p className="page-subtitle">
          Every doctor here sees patients on video. Filter by the kind of pet you have.
        </p>
      </div>

      <div className="filters-row">
        <div className="filters-group" role="group" aria-label="Filter by species">
          {SPECIES.map(([id, label]) => (
            <button
              key={id}
              type="button"
              className="chip-toggle"
              aria-pressed={species === id}
              onClick={() => setSpecies(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="chip-toggle"
          aria-pressed={todayOnly}
          onClick={() => setTodayOnly((v) => !v)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}
        >
          <Icon name="clock" size={18} />
          Available today
        </button>
      </div>

      {!loading && (
        <>
          <div className="results-count">
            {filtered.length === 1 ? '1 doctor' : `${filtered.length} doctors`}
          </div>
          {filtered.length > 0 ? (
            <div className="grid-3" style={{ paddingBottom: 64 }}>
              {filtered.map((doctor) => (
                <DoctorCard doctor={doctor} as="h2" key={doctor.id} />
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ marginBottom: 64 }}>
              No doctors match these filters yet. Try another species or turn off &ldquo;Available
              today&rdquo;.
            </div>
          )}
        </>
      )}
    </section>
  )
}
