# VetLink — project notes for Claude Code

React + Vite SPA (JavaScript, not TypeScript). No UI framework — plain CSS in
`src/index.css` using custom properties for the design system (colors, fonts,
radii). `react-router-dom` for routing, six pages under `src/pages/`.

See `README.md` for the full structure and the plan for adding a backend.

Key seam: all data reads/writes flow through `src/services/api.js`, which
`src/context/AppContext.jsx` calls. That file's functions currently resolve
against `src/data/mockData.js`. When building the backend, rewrite the
function bodies in `api.js` to call it — the function signatures are the
contract, keep them stable so the pages and context don't need to change.

Conventions:
- One component per file, `.jsx`, functional components with hooks only.
- Icons: `src/components/Icon.jsx`, a `name` prop into an inline SVG set —
  add new icons there rather than pulling in an icon library.
- Styling: class names in `index.css`, not inline styles or CSS-in-JS, except
  for one-off layout tweaks (flex/grid on a wrapping `<div>`) where adding a
  whole new class would be overkill.
- Design tokens (`--cream`, `--green`, `--terracotta`, etc.) are defined once
  at the top of `index.css` — reuse them rather than hardcoding hex values.
