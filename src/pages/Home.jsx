import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import DoctorCard from '../components/DoctorCard.jsx'
import { useApp } from '../context/AppContext.jsx'

const STEPS = [
  {
    num: '1',
    title: 'Add your pet',
    body: 'Species, breed, age and any notes, saved once and reused for every visit.',
  },
  {
    num: '2',
    title: 'Pick a doctor and a time',
    body: 'Filter by species and specialty, then choose an open slot that suits you.',
  },
  {
    num: '3',
    title: 'Meet on video',
    body: 'Join from your phone or laptop. Notes from the visit stay on your pet’s profile.',
  },
]

const FEATURES = [
  'Visit history and doctor notes in one place',
  'Weight, diet and vaccination details you can update anytime',
  'The doctor reads the profile before the call starts',
]

const CONCERNS = [
  'Skin and coat',
  'Diet and weight',
  'Vaccination advice',
  'Behaviour',
  'Senior pet care',
  'Second opinion',
  'Post-surgery follow-up',
  'Not sure? Ask a doctor',
]

export default function Home() {
  const { doctors, pets, loading } = useApp()

  return (
    <>
      <section className="container hero">
        <div className="hero__copy">
          <span className="hero__eyebrow">Video consultations with vets</span>
          <h1 className="hero__title">See a vet on video, from your sofa.</h1>
          <p className="hero__lede">
            Pick a doctor, choose a time, and meet face to face on screen. Every pet you own keeps
            one profile that the doctor can read before you connect.
          </p>
          <div className="hero__actions">
            <Link to="/book" className="btn btn--primary">
              Book a video consultation
              <Icon name="arrow" />
            </Link>
            <Link to="/doctors" className="btn btn--secondary">
              Meet the doctors
            </Link>
          </div>
        </div>
        <div className="hero__visual">
          <div className="hero__stage">
            <div className="avatar" style={{ width: 128, height: 128, fontSize: 46 }}>
              AR
            </div>
            <div className="hero__stage-name">Dr. Ananya Rao</div>
          </div>
          <div className="hero__self">
            <Icon name="paw" size={36} />
          </div>
          <div className="hero__card">
            <div>
              <div className="hero__card-title">Bruno &middot; Skin check</div>
              <div className="hero__card-meta">Today, 5:30 PM &middot; Video consultation</div>
            </div>
            <span className="hero__card-join">Join call</span>
          </div>
        </div>
      </section>

      <section className="steps-section">
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          <h2 className="section-title">Three steps to a consultation</h2>
          <div className="grid-3">
            {STEPS.map((step) => (
              <div className="step-card" key={step.num}>
                <div className="step-card__num">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <h2 className="section-title">Doctors who know your kind of pet</h2>
          <Link to="/doctors" className="link-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            See all doctors
            <Icon name="arrow" size={18} />
          </Link>
        </div>
        {!loading && (
          <div className="grid-3">
            {doctors.slice(0, 3).map((doctor) => (
              <DoctorCard doctor={doctor} key={doctor.id} />
            ))}
          </div>
        )}
      </section>

      <section className="band">
        <div className="container band__copy">
          <h2 className="band__title">Every pet, one profile</h2>
          <p className="band__lede">Add each pet once, then book for any of them in a few taps.</p>
          <div className="band__list">
            {FEATURES.map((f) => (
              <div className="band__list-item" key={f}>
                <Icon name="check" size={22} strokeWidth={2.2} />
                {f}
              </div>
            ))}
          </div>
          <Link to="/pets" className="btn btn--on-dark" style={{ alignSelf: 'flex-start' }}>
            Manage your pets
          </Link>
        </div>
        <div className="container mini-pets">
          {!loading &&
            pets.slice(0, 3).map((pet) => (
              <div className="mini-pet" key={pet.id}>
                <div className="avatar" style={{ width: 56, height: 56 }}>
                  <Icon name="paw" size={26} />
                </div>
                <div>
                  <div className="mini-pet__name">{pet.name}</div>
                  <div className="mini-pet__meta">
                    {pet.breed} &middot; {pet.age}
                  </div>
                </div>
                <span className="mini-pet__note">{pet.tags[pet.tags.length - 1]}</span>
              </div>
            ))}
        </div>
      </section>

      <section className="section container">
        <h2 className="section-title">What you can bring to a video consultation</h2>
        <div className="chip-row">
          {CONCERNS.map((c) => (
            <span className="chip" key={c}>
              {c}
            </span>
          ))}
        </div>
        <div className="notice">
          <strong>Emergency?</strong> A video call cannot replace hands-on care. Choking, heavy
          bleeding, seizures or a collapsed pet need a clinic right away.
        </div>
      </section>

      <section className="container">
        <div className="cta-band">
          <h2 className="cta-band__title">Ready when your pet is.</h2>
          <Link to="/book" className="btn btn--primary">
            Book a video consultation
            <Icon name="arrow" />
          </Link>
        </div>
      </section>
    </>
  )
}
