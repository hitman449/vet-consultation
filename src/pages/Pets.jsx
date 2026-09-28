import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { useApp } from '../context/AppContext.jsx'

const EMPTY_FORM = { name: '', species: 'Dog', breed: '', dob: '', sex: 'Female', weightKg: '', notes: '' }

export default function Pets() {
  const { pets, addPet, loading } = useApp()
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [savedName, setSavedName] = useState('')

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    setSavedName('')
    await addPet({
      name: form.name.trim(),
      species: form.species,
      breed: form.breed.trim() || form.species,
      age: form.dob ? ageFromDob(form.dob) : 'Age not set',
      sex: form.sex,
      weightKg: form.weightKg ? Number(form.weightKg) : null,
      tags: [form.weightKg ? `${form.weightKg} kg` : null, form.sex].filter(Boolean),
      notes: form.notes.trim(),
    })
    setSaving(false)
    setSavedName(form.name.trim())
    setForm(EMPTY_FORM)
  }

  return (
    <section className="container">
      <div className="page-header" style={{ marginBottom: 32 }}>
        <h1 className="page-title">My pets</h1>
        <p className="page-subtitle">
          Keep each pet&rsquo;s details current. Doctors read this before your call.
        </p>
      </div>

      <div className="pets-layout">
        <div className="pets-main">
          {!loading &&
            pets.map((pet) => (
              <article className="pet-card" key={pet.id}>
                <div className="pet-card__head">
                  <div className="avatar" style={{ width: 72, height: 72 }}>
                    <Icon name="paw" size={34} />
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <h2>{pet.name}</h2>
                    <div className="pet-card__meta">
                      {pet.breed} &middot; {pet.age} &middot; {pet.sex}
                    </div>
                  </div>
                </div>
                <div className="doctor-card__tags">
                  {pet.tags.map((t) => (
                    <span className="chip" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
                {pet.notes && <p style={{ margin: 0, fontSize: 15, color: 'var(--muted)' }}>{pet.notes}</p>}
                <div className="pet-card__foot">
                  <span className="pet-card__foot-note">Profile ready for your next visit</span>
                  <Link to="/book" state={{ petId: pet.id }} className="btn btn--primary btn--small">
                    <Icon name="video" size={18} />
                    Book consult
                  </Link>
                </div>
              </article>
            ))}
        </div>

        <form className="pet-form" onSubmit={handleSubmit}>
          <h2>Add a pet</h2>
          {savedName && <div className="form-toast">{savedName} was added.</div>}
          <div className="field">
            <label htmlFor="pet-name">Name</label>
            <input id="pet-name" type="text" value={form.name} onChange={update('name')} required />
          </div>
          <div className="field">
            <label htmlFor="pet-species">Species</label>
            <select id="pet-species" value={form.species} onChange={update('species')}>
              <option>Dog</option>
              <option>Cat</option>
              <option>Bird</option>
              <option>Rabbit</option>
              <option>Other</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="pet-breed">Breed</label>
            <input id="pet-breed" type="text" value={form.breed} onChange={update('breed')} />
          </div>
          <div className="pet-form__row">
            <div className="field">
              <label htmlFor="pet-dob">Date of birth</label>
              <input id="pet-dob" type="date" value={form.dob} onChange={update('dob')} />
            </div>
            <div className="field">
              <label htmlFor="pet-sex">Sex</label>
              <select id="pet-sex" value={form.sex} onChange={update('sex')}>
                <option>Female</option>
                <option>Male</option>
                <option>Unknown</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="pet-weight">Weight (kg)</label>
            <input id="pet-weight" type="number" step="0.1" value={form.weightKg} onChange={update('weightKg')} />
          </div>
          <div className="field">
            <label htmlFor="pet-notes">Notes for the doctor</label>
            <textarea id="pet-notes" rows={3} value={form.notes} onChange={update('notes')} />
          </div>
          <button type="submit" className="btn btn--primary btn--full" disabled={saving}>
            <Icon name="plus" size={20} />
            {saving ? 'Saving…' : 'Save pet'}
          </button>
        </form>
      </div>
    </section>
  )
}

function ageFromDob(dob) {
  const birth = new Date(dob)
  if (Number.isNaN(birth.getTime())) return 'Age not set'
  const years = (Date.now() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  if (years < 1) return `${Math.max(1, Math.round(years * 12))} months`
  return `${Math.floor(years)} years`
}
