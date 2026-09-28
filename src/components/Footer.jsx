export default function Footer() {
  return (
    <footer className="footer">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: 16 }}>
        <span className="footer__brand">VetLink</span>
        <span>Video consultations are not for emergencies. If your pet is in distress, go to your nearest clinic.</span>
      </div>
    </footer>
  )
}
