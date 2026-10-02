const paths = {
  dashboard: <><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></>,
  users: <><circle cx="9" cy="8" r="3" /><path d="M2 21c0-4 3-6 7-6s7 2 7 6" /><circle cx="17" cy="8" r="2.5" /><path d="M16 15c3 0 6 1.5 6 6" /></>,
  report: <><path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" /><path d="M14 3v5h5" /><path d="M9 13h6M9 17h6M9 9h2" /></>,
  folder: <path d="M3 7a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7z" />,
  flask: <><path d="M9 2h6M10 2v6l-6 11a1 1 0 0 0 1 1.5h14a1 1 0 0 0 1-1.5L14 8V2" /><path d="M7 15h10" /></>,
  pill: <><rect x="3" y="10" width="18" height="6" rx="3" transform="rotate(-45 12 12)" /><line x1="8.5" y1="8.5" x2="15.5" y2="15.5" /></>,
  badge: <><circle cx="12" cy="8" r="5" /><path d="M8 13l-2 8 6-3 6 3-2-8" /></>,
  shield: <><path d="M12 3l7 3v6c0 5-3 8-7 9-4-1-7-4-7-9V6z" /><path d="M9 12l2 2 4-4" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.2-1.6l2-1.6-2-3.4-2.3.9a7 7 0 0 0-2.7-1.6L13.4 2h-2.8l-.4 2.7a7 7 0 0 0-2.7 1.6l-2.3-.9-2 3.4 2 1.6A7 7 0 0 0 5 12c0 .5 0 1 .2 1.6l-2 1.6 2 3.4 2.3-.9a7 7 0 0 0 2.7 1.6l.4 2.7h2.8l.4-2.7a7 7 0 0 0 2.7-1.6l2.3.9 2-3.4-2-1.6c.2-.5.2-1 .2-1.6z" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>,
  bell: <><path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" /><path d="M10 20a2 2 0 0 0 4 0" /></>,
  menu: <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>,
  logout: <><path d="M9 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4" /><path d="M16 17l5-5-5-5" /><line x1="21" y1="12" x2="9" y2="12" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.5 3.5-7 8-7s8 2.5 8 7" /></>,
  plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
  back: <><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></>,
  lock: <><rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
}

export default function Icon({ name, className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  )
}
