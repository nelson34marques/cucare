import { Link } from 'react-router-dom'
import Icon from './Icon'

export default function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex items-start justify-between gap-3 flex-wrap">
      <div>
        <h1 className="text-xl font-semibold">{title}</h1>
        {subtitle && <p className="text-muted text-xs mt-0.5">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}

export function BackLink({ to, children }) {
  return (
    <Link to={to} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy">
      <Icon name="back" className="w-4 h-4" />
      {children}
    </Link>
  )
}