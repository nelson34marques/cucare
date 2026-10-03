import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import Icon from '../components/Icon'
import { FieldError } from '../components/States'
import { useToast } from '../components/Toast'

export default function RecuperarSenha() {
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [erro, setErro] = useState(null)
  const [submetendo, setSubmetendo] = useState(false)
  const [enviado, setEnviado] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setErro(null)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErro('Indique um email válido.')
      return
    }
    setSubmetendo(true)
    try {
      await api.forgotPassword({ email: email.trim() })
      setEnviado(true)
      toast('Email de recuperação enviado')
    } catch (err) {
      setErro(err.message)
    } finally {
      setSubmetendo(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface">
      <div className="w-full max-w-md bg-white border border-line rounded-md p-8 shadow-sm">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded bg-accent text-white flex items-center justify-center">
            <Icon name="shield" className="w-5 h-5" />
          </div>
          <span className="font-semibold">CuCare</span>
        </div>

        {enviado ? (
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-green-100 text-ok flex items-center justify-center mx-auto">
              <Icon name="check" className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-semibold">Email enviado</h2>
            <p className="text-sm text-muted">
              Se existir uma conta com esse email, receberá um link para redefinir a palavra-passe.
            </p>
            <Link to="/" className="block text-sm text-accent">
              Voltar ao início de sessão
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-semibold mb-1">Recuperar palavra-passe</h2>
            <p className="text-sm text-muted mb-6">
              Indique o email da sua conta para receber o link de recuperação.
            </p>
            <form onSubmit={onSubmit} noValidate>
              <label htmlFor="email" className="block text-xs font-medium text-muted mb-1">
                Email
              </label>
              <div className="relative">
                <Icon
                  name="user"
                  className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@hospital.ao"
                  className="w-full border border-line rounded pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>
              <FieldError>{erro}</FieldError>

              <button
                type="submit"
                disabled={submetendo}
                className="w-full mt-4 bg-accent text-white rounded py-2 font-medium hover:bg-blue transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submetendo && (
                  <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                )}
                {submetendo ? 'A enviar…' : 'Enviar link'}
              </button>
            </form>
            <div className="text-center mt-4">
              <Link to="/" className="text-xs text-accent">
                Voltar ao início de sessão
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}