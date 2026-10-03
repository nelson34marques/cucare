import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Icon from '../components/Icon'
import { FieldError } from '../components/States'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: 'carlos.mendes@hospital.ao',
    password: 'demo1234',
    lembrar: true,
  })
  const [erro, setErro] = useState(null)
  const [erros, setErros] = useState({})
  const [submetendo, setSubmetendo] = useState(false)

  const set = (campo) => (e) =>
    setForm({ ...form, [campo]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  function validar() {
    const found = {}
    if (!form.email.trim()) found.email = 'Indique o email.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) found.email = 'Email inválido.'
    if (!form.password) found.password = 'Indique a palavra-passe.'
    setErros(found)
    return Object.keys(found).length === 0
  }

  async function onSubmit(e) {
    e.preventDefault()
    setErro(null)
    if (!validar()) return
    setSubmetendo(true)
    try {
      await login({ email: form.email.trim(), password: form.password, rememberMe: form.lembrar })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setErro(err.message)
    } finally {
      setSubmetendo(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface">
      <div className="w-full max-w-3xl grid md:grid-cols-2 bg-white border border-line rounded-md overflow-hidden shadow-sm">
        <div className="bg-navy text-white p-10 hidden md:flex flex-col justify-center gap-3">
          <div className="w-10 h-10 rounded bg-accent flex items-center justify-center">
            <Icon name="shield" className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-semibold mt-2">CuCare</h1>
          <p className="text-slate-300">
            Saúde digital, próxima de si. Gestão institucional de processos clínicos, relatórios e
            documentação médica.
          </p>
        </div>

        <form onSubmit={onSubmit} className="p-10" noValidate>
          <h2 className="text-lg font-semibold mb-1">Bem-vindo de volta</h2>
          <p className="text-muted mb-6">Aceda à sua conta para continuar</p>

          {erro && (
            <div
              role="alert"
              className="flex items-start gap-2 bg-red-100 text-bad text-xs px-3 py-2.5 rounded mb-4"
            >
              <Icon name="alert" className="w-4 h-4 shrink-0 mt-px" />
              <span>{erro}</span>
            </div>
          )}

          <label htmlFor="email" className="block text-xs font-medium text-muted mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            value={form.email}
            onChange={set('email')}
            className="w-full border border-line rounded px-3 py-2 mb-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
          <FieldError>{erros.email}</FieldError>

          <label
            htmlFor="password"
            className="block text-xs font-medium text-muted mt-3 mb-1"
          >
            Palavra-passe
          </label>
          <div className="relative">
            <Icon
              name="lock"
              className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={set('password')}
              className="w-full border border-line rounded pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
          <FieldError>{erros.password}</FieldError>

          <div className="flex justify-between items-center text-xs text-muted mt-3 mb-6">
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={form.lembrar}
                onChange={set('lembrar')}
              />
              Lembrar sessão
            </label>
            <Link to="/recuperar-senha" className="text-accent">
              Esqueceu a palavra-passe?
            </Link>
          </div>

          <button
            type="submit"
            disabled={submetendo}
            className="block w-full bg-accent text-white rounded py-2 font-medium hover:bg-blue transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submetendo && (
              <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            )}
            {submetendo ? 'A entrar…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}