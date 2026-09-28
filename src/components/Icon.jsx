const PATHS = {
  video: (
    <>
      <rect x="2" y="6" width="13" height="12" rx="3" />
      <path d="M15 10l6-3v10l-6-3z" />
    </>
  ),
  paw: (
    <>
      <circle cx="6" cy="10" r="1.8" />
      <circle cx="10" cy="6" r="1.8" />
      <circle cx="14" cy="6" r="1.8" />
      <circle cx="18" cy="10" r="1.8" />
      <path d="M12 12c-3 0-6 3-6 5.5 0 1.5 1.5 2 3 1.5 1-.3 2-.5 3-.5s2 .2 3 .5c1.5.5 3 0 3-1.5 0-2.5-3-5.5-6-5.5z" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  check: <path d="M5 12l5 5 10-11" />,
  plus: <path d="M12 5v14M5 12h14" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  mic: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </>
  ),
  chat: <path d="M4 5h16v11H9l-5 4z" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  back: <path d="M19 12H5M11 6l-6 6 6 6" />,
}

export default function Icon({ name, size = 20, strokeWidth = 1.8, ...props }) {
  const path = PATHS[name]
  if (!path) return null
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {path}
    </svg>
  )
}
