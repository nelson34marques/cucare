import { statusColor } from '../lib/enums'

export default function Badge({ children }) {
  return (
    <span className={`inline-block text-[11px] px-2 py-0.5 rounded font-semibold ${statusColor(children)}`}>
      {children}
    </span>
  )
}
