import { Link } from 'react-router-dom'
import Icon from '../components/Icon'

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface">
      <div className="w-full max-w-3xl grid md:grid-cols-2 bg-white border border-line rounded-md overflow-hidden shadow-sm">
        <div className="bg-navy text-white p-10 hidden md:flex flex-col justify-center gap-3">
          <div className="w-10 h-10 rounded bg-accent flex items-center justify-center">
            <Icon name="shield" className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-semibold mt-2">CuCare</h1>
          <p className="text-slate-300">
            Saúde digital, próxima de si. Gestão institucional de processos clínicos, relatórios e documentação médica.
          </p>
        </div>
        <div className="p-10">
          <h2 className="text-lg font-semibold mb-1">Bem-vindo de volta</h2>
          <p className="text-muted mb-6">Aceda à sua conta para continuar</p>
          <form onSubmit={(e) => e.preventDefault()}>
            <label className="block text-xs font-medium text-muted mb-1">Email</label>
            <input className="w-full border border-line rounded px-3 py-2 mb-4 text-sm" defaultValue="carlos.mendes@hospital.ao" />
            <label className="block text-xs font-medium text-muted mb-1">Palavra-passe</label>
            <div className="relative mb-2">
              <Icon name="lock" className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
              <input type="password" className="w-full border border-line rounded pl-8 pr-3 py-2 text-sm" defaultValue="••••••••" />
            </div>
            <div className="flex justify-between items-center text-xs text-muted mb-6">
              <label className="flex items-center gap-1"><input type="checkbox" defaultChecked /> Lembrar sessão</label>
              <Link to="/recuperar-senha" className="text-accent">Esqueceu a palavra-passe?</Link>
            </div>
            <Link to="/dashboard" className="block text-center w-full bg-accent text-white rounded py-2 font-medium hover:bg-blue transition-colors">
              Entrar
            </Link>
          </form>
        </div>
      </div>
    </div>
  )
}
