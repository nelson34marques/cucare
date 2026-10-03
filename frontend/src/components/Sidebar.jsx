import { NavLink } from 'react-router-dom'
import Icon from './Icon'

const links = [
  { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/pacientes', icon: 'users', label: 'Pacientes' },
  { to: '/relatorios', icon: 'report', label: 'Relatórios' },
  { to: '/exames', icon: 'flask', label: 'Exames' },
  { to: '/prescricoes', icon: 'pill', label: 'Prescrições' },
  { to: '/documentos', icon: 'folder', label: 'Documentos' },
  { to: '/profissionais', icon: 'badge', label: 'Profissionais' },
  { to: '/auditoria', icon: 'shield', label: 'Auditoria' },
  { to: '/configuracoes', icon: 'settings', label: 'Configurações' },
]

export default function Sidebar({ open, onClose, onLogout }) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onClose} />
      )}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-60 bg-navy text-white flex flex-col transform transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-white/10">
          <div className="w-9 h-9 rounded bg-accent flex items-center justify-center">
            <Icon name="shield" className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold leading-tight">CuCare</div>
            <div className="text-[11px] text-slate-300">Gestão Clínica</div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${isActive ? 'bg-accent text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`
              }
            >
              <Icon name={l.icon} className="w-4 h-4 shrink-0" />
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Icon name="logout" className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>
    </>
  )
}
