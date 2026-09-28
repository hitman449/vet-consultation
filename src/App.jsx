import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Doctors from './pages/Doctors.jsx'
import Book from './pages/Book.jsx'
import Appointments from './pages/Appointments.jsx'
import Consultation from './pages/Consultation.jsx'
import Pets from './pages/Pets.jsx'

export default function App() {
  return (
    <div className="app-shell">
      <NavBar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/book" element={<Book />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/pets" element={<Pets />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
