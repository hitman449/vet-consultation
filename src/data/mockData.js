// Seed data for the frontend-only prototype.
// Swap these out for calls into src/services/api.js once the backend exists —
// see that file for the seam that's already wired up for it.

export const initialDoctors = [
  {
    id: 'ananya-rao',
    initials: 'AR',
    name: 'Dr. Ananya Rao',
    specialty: 'Small animal medicine',
    species: ['dogs', 'cats'],
    languages: 'Kannada, English, Hindi',
    nextSlotLabel: 'Today, 5:30 PM',
    availableToday: true,
  },
  {
    id: 'rohan-mehta',
    initials: 'RM',
    name: 'Dr. Rohan Mehta',
    specialty: 'Dermatology',
    species: ['dogs', 'cats', 'small'],
    languages: 'English, Hindi',
    nextSlotLabel: 'Tomorrow, 10:00 AM',
    availableToday: false,
  },
  {
    id: 'farah-siddiqui',
    initials: 'FS',
    name: 'Dr. Farah Siddiqui',
    specialty: 'Exotic and avian care',
    species: ['birds', 'small'],
    languages: 'English, Urdu, Hindi',
    nextSlotLabel: 'Today, 7:00 PM',
    availableToday: true,
  },
  {
    id: 'karthik-iyer',
    initials: 'KI',
    name: 'Dr. Karthik Iyer',
    specialty: 'Nutrition and weight',
    species: ['dogs', 'cats'],
    languages: 'Tamil, English',
    nextSlotLabel: 'Tomorrow, 4:00 PM',
    availableToday: false,
  },
  {
    id: 'meera-nair',
    initials: 'MN',
    name: 'Dr. Meera Nair',
    specialty: 'Behaviour',
    species: ['dogs'],
    languages: 'Malayalam, English',
    nextSlotLabel: 'Today, 6:30 PM',
    availableToday: true,
  },
  {
    id: 'sameer-joshi',
    initials: 'SJ',
    name: 'Dr. Sameer Joshi',
    specialty: 'Senior pet care',
    species: ['dogs', 'cats'],
    languages: 'English, Marathi, Hindi',
    nextSlotLabel: 'Sat, 11:00 AM',
    availableToday: false,
  },
]

export const initialPets = [
  {
    id: 'bruno',
    name: 'Bruno',
    species: 'Dog',
    breed: 'Labrador retriever',
    age: '4 years',
    sex: 'Male',
    weightKg: 28,
    tags: ['28 kg', 'Neutered', 'Rabies due Nov 2026'],
    notes: 'Scratches his left ear more than usual this week.',
  },
  {
    id: 'miso',
    name: 'Miso',
    species: 'Cat',
    breed: 'Domestic shorthair',
    age: '2 years',
    sex: 'Female',
    weightKg: 4.1,
    tags: ['4.1 kg', 'Indoor', 'Vaccines up to date'],
    notes: '',
  },
  {
    id: 'pico',
    name: 'Pico',
    species: 'Bird',
    breed: 'Budgerigar',
    age: '1 year',
    sex: 'Unknown',
    weightKg: 0.038,
    tags: ['38 g', 'Seeds and fresh greens'],
    notes: '',
  },
]

export const reasons = [
  'Skin or coat',
  'Check-up',
  'Vaccination advice',
  'Diet and weight',
  'Behaviour',
  'Something else',
]

// Seeded appointments so Appointments.jsx has upcoming + past examples
// before the user books anything themselves.
export const initialAppointments = [
  {
    id: 'appt-seed-1',
    petId: 'miso',
    doctorId: 'rohan-mehta',
    reason: 'Coat check',
    dayLabel: 'Fri 25',
    timeLabel: '10:00 AM',
    status: 'upcoming',
  },
  {
    id: 'appt-seed-2',
    petId: 'bruno',
    doctorId: 'karthik-iyer',
    reason: 'Vaccination advice',
    dayLabel: 'Aug 12',
    timeLabel: '4:30 PM',
    status: 'past',
  },
  {
    id: 'appt-seed-3',
    petId: 'pico',
    doctorId: 'farah-siddiqui',
    reason: 'Check-up',
    dayLabel: 'Jul 03',
    timeLabel: '11:00 AM',
    status: 'past',
  },
]
