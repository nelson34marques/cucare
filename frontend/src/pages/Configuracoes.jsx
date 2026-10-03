import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import useResource from '../hooks/useResource'
import { useAuth } from '../context/AuthContext'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import Icon from '../components/Icon'
import { LoadingBlock, FieldError } from '../components/States'
import { useToast } from '../components/Toast'

export default function Configuracoes() {
  const toast = useToast()
  const { user } = useAuth()

  const perfil = useResource(() => api.me(), [])
  const preferencias = useResource(() => api.getPreferencias(), [])

  const [form, setForm] = useState(null)
  const [erros, setErros] = useState({})
  const [aGuardar, setAGuardar] = useState(false)

  useEffect(() => {
    if (perfil.data) {
      setForm({
        nome: perfil.data.nome ?? '',
        email: perfil.data.email ?? '',
        especialidade: perfil.data.especialidade ?? '',
        registoProfissional: perfil.data.registoProfissional ?? '',
      })
    }
  }, [perfil.data])

  const set = (campo) => (e) => {
    setForm({ ...form, [campo]: e.target.value })
    setErros((atual) => ({ ...atual, [campo]: undefined }))
  }

  function validar() {
    const found = {}
    if (!form.nome.trim()) found.nome = 'Indique o nome.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) found.email = 'Email inválido.'
    setErros(found)
    return Object.keys(found).length === 0
  }

  async function guardar() {
    if (!validar()) return
    setAGuardar(true)
    try {
      await api.updatePerfil({
        nome: form.nome.trim(),
        email: form.email.trim(),
        especialidade: form.especialidade.trim(),
        registoProfissional: form.registoProfissional.trim(),
      })
      perfil.reload()
      toast('Configurações guardadas')
    } catch (err) {
      toast(err.message)
      if (err.details) setErros(err.details)
    } finally {
      setAGuardar(false)
    }
  }

  if (perfil.loading || preferencias.loading || !form) {
    return (
      <div className="space-y-4 max-w-2xl">
        <PageHeader title="Configurações" subtitle="Preferências da conta e do sistema" />
        <Card>
          <LoadingBlock label="A carregar definições…" />
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <PageHeader title="Configurações" subtitle="Preferências da conta e do sistema">
        <span className="text-xs text-muted">{user?.email}</span>
      </PageHeader>

      <Card className="p-5">
        <h2 className="font-semibold mb-1">Perfil</h2>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <Campo id="nome" label="Nome" value={form.nome} onChange={set('nome')} erro={erros.nome} />
          <Campo
            id="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={set('email')}
            erro={erros.email}
          />
          <Campo
            id="especialidade"
            label="Especialidade"
            value={form.especialidade}
            onChange={set('especialidade')}
          />
          <Campo
            id="registo"
            label="Registro profissional"
            value={form.registoProfissional}
            onChange={set('registoProfissional')}
          />
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="font-semibold mb-1">Notificações</h2>
        {preferencias.error ? (
          <p className="text-xs text-bad mt-3">{preferencias.error.message}</p>
        ) : (
          <div className="divide-y divide-line mt-2">
            <Toggle
              label="Novos relatórios"
              description="Notificar quando um relatório for finalizado"
              campo="novosRelatorios"
              preferencias={preferencias.data}
              onGuardar={preferencias.setData}
              toast={toast}
            />
            <Toggle
              label="Exames pendentes"
              description="Alertas de exames por validar"
              campo="examesPendentes"
              preferencias={preferencias.data}
              onGuardar={preferencias.setData}
              toast={toast}
            />
            <Toggle
              label="Email semanal"
              description="Resumo semanal de atividade"
              campo="emailSemanal"
              preferencias={preferencias.data}
              onGuardar={preferencias.setData}
              toast={toast}
            />
          </div>
        )}
      </Card>

      <Card className="p-5">
        <h2 className="font-semibold mb-1">Segurança</h2>
        <div className="divide-y divide-line mt-2">
          <Toggle
            label="Autenticação de dois fatores"
            description="Proteção extra no início de sessão"
            campo="doisFatores"
            preferencias={preferencias.data}
            onGuardar={preferencias.setData}
            toast={toast}
          />
          <AlterarPalavraPasse />
        </div>
      </Card>

      <button
        onClick={guardar}
        disabled={aGuardar || perfil.loading}
        className="bg-accent text-white text-sm px-4 py-2 rounded font-medium hover:bg-blue transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 self-start"
      >
        {aGuardar && (
          <span className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
        )}
        <Icon name="settings" className="w-4 h-4" />
        {aGuardar ? 'A guardar…' : 'Guardar alterações'}
      </button>
    </div>
  )
}

function Campo({ id, label, value, onChange, erro, type = 'text' }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-muted mb-1">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full border border-line rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
      />
      <FieldError>{erro}</FieldError>
    </div>
  )
}

function Toggle({ label, description, campo, preferencias, onGuardar, toast }) {
  const [on, setOn] = useState(preferencias?.[campo] ?? false)
  const [aGuardar, setAGuardar] = useState(false)

  useEffect(() => {
    setOn(preferencias?.[campo] ?? false)
  }, [preferencias, campo])

  async function alternar() {
    const novo = !on
    setOn(novo)
    setAGuardar(true)
    try {
      const actualizado = await api.updatePreferencias({ [campo]: novo })
      onGuardar(actualizado)
    } catch (err) {
      setOn(!novo)
      toast(err.message)
    } finally {
      setAGuardar(false)
    }
  }

  return (
    <div className="flex items-center justify-between py-3 gap-3">
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-xs text-muted">{description}</div>
      </div>
      <button
        onClick={alternar}
        disabled={aGuardar}
        aria-pressed={on}
        aria-label={label}
        className={`w-10 h-5.5 rounded-full relative transition-colors shrink-0 disabled:opacity-60 ${
          on ? 'bg-accent' : 'bg-line'
        }`}
      >
        <span
          className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-all ${
            on ? 'left-5' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  )
}

function AlterarPalavraPasse() {
  const toast = useToast()
  const [aberto, setAberto] = useState(false)
  const [form, setForm] = useState({ atual: '', nova: '', confirmacao: '' })
  const [erros, setErros] = useState({})
  const [submetendo, setSubmetendo] = useState(false)

  const set = (campo) => (e) => {
    setForm({ ...form, [campo]: e.target.value })
    setErros((atual) => ({ ...atual, [campo]: undefined }))
  }

  async function onSubmit(event) {
    event.preventDefault()
    const found = {}
    if (!form.atual) found.atual = 'Indique a palavra-passe atual.'
    if (form.nova.length < 8) found.nova = 'Use pelo menos 8 caracteres.'
    if (form.nova !== form.confirmacao) found.confirmacao = 'As palavras-passe não coincidem.'
    setErros(found)
    if (Object.keys(found).length) return

    setSubmetendo(true)
    try {
      await api.changePassword({ atual: form.atual, nova: form.nova })
      setForm({ atual: '', nova: '', confirmacao: '' })
      setAberto(false)
      toast('Palavra-passe alterada')
    } catch (err) {
      setErros(err.details || { atual: err.message })
    } finally {
      setSubmetendo(false)
    }
  }

  return (
    <div className="py-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-medium">Palavra-passe</div>
          <div className="text-xs text-muted">Alterar palavra-passe</div>
        </div>
        <button onClick={() => setAberto((a) => !a)} className="text-sm text-accent shrink-0">
          {aberto ? 'Cancelar' : 'Alterar'}
        </button>
      </div>

      {aberto && (
        <form onSubmit={onSubmit} noValidate className="mt-3 space-y-3">
          <CampoSenha id="atual" label="Palavra-passe atual" value={form.atual} onChange={set('atual')} erro={erros.atual} />
          <CampoSenha id="nova" label="Nova palavra-passe" value={form.nova} onChange={set('nova')} erro={erros.nova} />
          <CampoSenha
            id="confirmacao"
            label="Confirmar nova palavra-passe"
            value={form.confirmacao}
            onChange={set('confirmacao')}
            erro={erros.confirmacao}
          />
          <button
            type="submit"
            disabled={submetendo}
            className="bg-accent text-white text-sm px-4 py-2 rounded font-medium hover:bg-blue transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submetendo && (
              <span className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            )}
            Confirmar alteração
          </button>
        </form>
      )}
    </div>
  )
}

function CampoSenha({ id, label, value, onChange, erro }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-muted mb-1">
        {label}
      </label>
      <input
        id={id}
        type="password"
        autoComplete="new-password"
        value={value}
        onChange={onChange}
        className="w-full border border-line rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
      />
      <FieldError>{erro}</FieldError>
    </div>
  )
}