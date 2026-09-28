// ---------------------------------------------------------------------------
// This is the seam where a real backend plugs in.
//
// Right now every function here just resolves against the local mock data
// (see src/data/mockData.js) after a short simulated delay, and AppContext
// calls these instead of touching mock data directly. When the backend
// exists, rewrite the bodies below to call it — e.g.
//
//   export async function fetchDoctors() {
//     const res = await fetch(`${API_BASE_URL}/doctors`)
//     if (!res.ok) throw new Error('Failed to load doctors')
//     return res.json()
//   }
//
// — and nothing in AppContext.jsx or the pages needs to change, since they
// only depend on these function signatures.
// ---------------------------------------------------------------------------

import { initialDoctors, initialPets, initialAppointments } from '../data/mockData.js'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

const LATENCY_MS = 250
const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS))

export async function fetchDoctors() {
  return delay(initialDoctors)
}

export async function fetchPets() {
  return delay(initialPets)
}

export async function fetchAppointments() {
  return delay(initialAppointments)
}

export async function createPet(pet) {
  const saved = { ...pet, id: pet.id || `pet-${Date.now()}` }
  return delay(saved)
}

export async function createAppointment(appointment) {
  const saved = { ...appointment, id: appointment.id || `appt-${Date.now()}`, status: 'upcoming' }
  return delay(saved)
}

export async function cancelAppointment(appointmentId) {
  return delay({ id: appointmentId, cancelled: true })
}
