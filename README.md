# VetLink

A veterinary consultation booking site: find a doctor, book a video consultation,
manage your pets, and see your appointments. This is the frontend, built from the
VetLink design, as a React + Vite single-page app.

## Getting started

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. `npm run build` produces a production build in
`dist/`; `npm run preview` serves that build locally.

## What's here

```
src/
  main.jsx              entry point, wraps the app in the router and AppProvider
  App.jsx                routes
  index.css               all styling — CSS variables + component classes, no framework
  components/
    NavBar.jsx, Footer.jsx
    Icon.jsx               small inline SVG icon set
    DoctorCard.jsx
  pages/
    Home.jsx                landing page
    Doctors.jsx              doctor directory with species + "available today" filters
    Book.jsx                  3-step booking flow (pet -> reason -> day/time)
    Appointments.jsx        upcoming + past appointments
    Consultation.jsx        the video call screen (UI only, no real video yet)
    Pets.jsx                 pet profiles + add-a-pet form
  context/
    AppContext.jsx          shared app state: pets, doctors, appointments
  services/
    api.js                   the seam for a real backend (see below)
  data/
    mockData.js              seed data used until there's a backend
```

Routing is client-side only (`react-router-dom`), six routes matching the six
screens in the design: `/`, `/doctors`, `/book`, `/appointments`,
`/consultation`, `/pets`.

## State, for now

`AppContext` holds `pets`, `doctors` and `appointments` in memory and exposes
`addPet`, `bookAppointment`, `cancelAppointment`, `getDoctor`, `getPet`. Pages
read and write through this context, not through mock data directly — so
booking a consultation on the Book page actually shows up on Appointments and
Consultation, and adding a pet on Pets actually shows up in the Book flow.
None of it persists past a page refresh yet; that's what the backend is for.

## Adding a backend, gradually

Every read/write in `AppContext` already goes through `src/services/api.js`
instead of touching `mockData.js` directly. Each function there
(`fetchDoctors`, `fetchPets`, `fetchAppointments`, `createPet`,
`createAppointment`, `cancelAppointment`) currently just resolves the mock
data after a short delay. To wire up a real backend:

1. Stand up an API (a good default: Node/Express or FastAPI, with Postgres)
   with endpoints matching those six functions.
2. Set `VITE_API_BASE_URL` in a `.env` file to point at it.
3. Rewrite each function body in `api.js` to `fetch()` that endpoint instead
   of resolving mock data. The function names and shapes stay the same, so
   nothing in `AppContext.jsx` or the pages needs to change.

You can do this one endpoint at a time — e.g. wire up `fetchDoctors` for real
while `createPet` still resolves mock data — since each function is
independent.

Not yet built, worth scoping before the backend: real authentication (the
design doesn't currently gate booking behind login), real video (the call
screen is a static mockup — WebRTC or a provider like Twilio/Daily would go
here), and payments (the booking summary shows a `[FEE]` placeholder).

## Design

Colors, type (Figtree for body text, Young Serif for headings) and layout
match the VetLink design artifact. Design tokens live at the top of
`src/index.css` as CSS custom properties on `:root`, so a rebrand is mostly a
matter of editing those.
