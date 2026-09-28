import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  fetchDoctors,
  fetchPets,
  fetchAppointments,
  createPet,
  createAppointment,
  cancelAppointment as cancelAppointmentRequest,
} from '../services/api.js'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [doctors, setDoctors] = useState([])
  const [pets, setPets] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    Promise.all([fetchDoctors(), fetchPets(), fetchAppointments()]).then(
      ([doctorsRes, petsRes, appointmentsRes]) => {
        if (cancelled) return
        setDoctors(doctorsRes)
        setPets(petsRes)
        setAppointments(appointmentsRes)
        setLoading(false)
      },
    )
    return () => {
      cancelled = true
    }
  }, [])

  const addPet = useCallback(async (pet) => {
    const saved = await createPet(pet)
    setPets((prev) => [...prev, saved])
    return saved
  }, [])

  const bookAppointment = useCallback(async (appointment) => {
    const saved = await createAppointment(appointment)
    setAppointments((prev) => [...prev, saved])
    return saved
  }, [])

  const cancelAppointment = useCallback(async (appointmentId) => {
    await cancelAppointmentRequest(appointmentId)
    setAppointments((prev) => prev.filter((appt) => appt.id !== appointmentId))
  }, [])

  const getDoctor = useCallback((doctorId) => doctors.find((d) => d.id === doctorId), [doctors])
  const getPet = useCallback((petId) => pets.find((p) => p.id === petId), [pets])

  const upcomingAppointments = useMemo(
    () => appointments.filter((a) => a.status === 'upcoming'),
    [appointments],
  )
  const pastAppointments = useMemo(
    () => appointments.filter((a) => a.status === 'past'),
    [appointments],
  )

  const value = useMemo(
    () => ({
      doctors,
      pets,
      appointments,
      upcomingAppointments,
      pastAppointments,
      loading,
      addPet,
      bookAppointment,
      cancelAppointment,
      getDoctor,
      getPet,
    }),
    [
      doctors,
      pets,
      appointments,
      upcomingAppointments,
      pastAppointments,
      loading,
      addPet,
      bookAppointment,
      cancelAppointment,
      getDoctor,
      getPet,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within an AppProvider')
  return ctx
}
