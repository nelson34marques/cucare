import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import useResource from '../hooks/useResource'
import useDebounce from '../hooks/useDebounce'
import { formatDate, todayISO } from '../lib/format'
import { SEXOS, PACIENTE_ESTADOS } from '../lib/enums'
import PageHeader from '../components/PageHeader'
import Icon from '../components/Icon'
import Badge from '../components/Badge'
import Card from '../components/Card'
import Pagination from '../components/Pagination'
import { TableSkeleton, ErrorState, EmptyState, FieldError } from '../components/States'
import { useToast } from '../components/Toast'

export default function Pacientes() {
  const toast = useToast()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [modalAberto, setModalAberto] = useState(false)
  const termo = useDebounce(q, 300)

  const { data, loading, error, reload } = useResource(
    () => api.listPacientes({ q: termo || undefined, page, pageSize: 8 }),
    [termo, page],
    { initialData: { items: [], total: 0, page: 1, totalPages: 1 } },
  )

  function onSearch(value) {
    setQ(value)
    setPage(1)
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Pacientes"
        subtitle={loading ? 'A carregar…' : `${data.total} pacientes registados`}
      >
        <button
          onClick={() => setModalAberto(true)}
          className="bg-accent text-white text-sm px-4 py-2 rounded font-medium hover:bg-blue transition-colors flex items-center gap-2"
        >
          <Icon name="plus" className="w-4 h-4" />
          Novo paciente
        </button>
      </PageHeader>

      <Card>
        <div className="px-4 py-3 border-b border-line">
          <div className="relative max-w-sm">
            <Icon
              name="search"
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              value={q}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Pesquisar por nome ou ID..."
              aria-label="Pesquisar pacientes"
              className="w-full border border-line rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
        </div>

        {error ? (
          <ErrorState error={error} onRetry={reload} />
        ) : (
          <>
            <div className="overflow-x-auto">
              {loading ? (
                <TableSkeleton rows={6} cols={6} />
              ) : data.items.length === 0 ? (
                <EmptyState
                  icon="users"
                  title="Nenhum paciente encontrado"
                  description={
                    termo
                      ? `Não há resultados para "${termo}". Tente outro nome ou identificador.`
                      : 'Ainda não há pacientes registados.'
                  }
                />
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-muted border-b border-line">
                      <th className="px-4 py-2.5 font-medium">ID</th>
                      <th className="px-4 py-2.5 font-medium">Nome</th>
                      <th className="px-4 py-2.5 font-medium">Nascimento</th>
                      <th className="px-4 py-2.5 font-medium">Sexo</th>
                      <th className="px-4 py-2.5 font-medium">Última visita</th>
                      <th className="px-4 py-2.5 font-medium">Estado</th>
                      <th className="px-4 py-2.5 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((p) => (
                      <tr key={p.id} className="border-t border-line hover:bg-surface">
                        <td className="px-4 py-2.5">{p.id}</td>
                        <td className="px-4 py-2.5 font-medium">
                          <Link to={`/pacientes/${p.id}`} className="hover:text-accent">
                            {p.nome}
                          </Link>
                        </td>
                        <td className="px-4 py-2.5 text-muted">{formatDate(p.dataNascimento)}</td>
                        <td className="px-4 py-2.5">{p.sexo}</td>
                        <td className="px-4 py-2.5 text-muted">{formatDate(p.ultimaVisita)}</td>
                        <td className="px-4 py-2.5">
                          <Badge>{p.estado}</Badge>
                        </td>
                        <td className="px-4 py-2.5">
                          <Link to={`/pacientes/${p.id}`} className="text-accent">
                            Ver
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {!loading && data.total > 0 && (
              <Pagination
                page={data.page}
                totalPages={data.totalPages}
                total={data.total}
                onChange={setPage}
                label="pacientes"
              />
            )}
          </>
        )}
      </Card>

      {modalAberto && (
        <ModalPaciente
          onFechar={() => setModalAberto(false)}
          onCriado={(id) => {
            setModalAberto(false)
            reload()
            toast('Paciente registado')
            navigate(`/pacientes/${id}`)
          }}
        />
      )}
    </div>
  )
}

function ModalPaciente({ onFechar, onCriado }) {
  const toast = useToast()
  const [form, setForm] = useState({
    nome: '',
    dataNascimento: '',
    sexo: '',
    estado: 'Ativo',
  })
  const [erros, setErros] = useState({})
  const [submetendo, setSubmetendo] = useState(false)

  const set = (campo) => (e) => {
    setForm({ ...form, [campo]: e.target.value })
    setErros((atual) => ({ ...atual, [campo]: undefined }))
  }

  function validar() {
    const found = {}
    if (!form.nome.trim()) found.nome = 'Indique o nome completo.'
    if (!form.dataNascimento) found.dataNascimento = 'Indique a data de nascimento.'
    else if (form.dataNascimento > todayISO()) found.dataNascimento = 'Data no futuro inválida.'
    if (!form.sexo) found.sexo = 'Indique o sexo.'
    setErros(found)
    return Object.keys(found).length === 0
  }

  async function onSubmit(event) {
    event.preventDefault()
    if (!validar()) return
    setSubmetendo(true)
    try {
      const criado = await api.createPaciente({
        nome: form.nome.trim(),
        dataNascimento: form.dataNascimento,
        sexo: form.sexo,
        estado: form.estado,
      })
      onCriado(criado.id)
    } catch (err) {
      setErros(err.details || {})
      toast(err.message)
    } finally {
      setSubmetendo(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-paciente"
        className="w-full max-w-md bg-white border border-line rounded-md shadow-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="px-5 py-3.5 border-b border-line flex items-center justify-between">
          <h2 id="modal-paciente" className="font-semibold">
            Novo paciente
          </h2>
          <button onClick={onFechar} aria-label="Fechar" className="text-muted hover:text-navy">
            <Icon name="x" className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} noValidate className="p-5 space-y-4">
          <div>
            <label htmlFor="nome-paciente" className="block text-xs font-medium text-muted mb-1">
              Nome completo
            </label>
            <input
              id="nome-paciente"
              value={form.nome}
              onChange={set('nome')}
              placeholder="Ex.: Maria Isabel Santos"
              className="w-full border border-line rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
            <FieldError>{erros.nome}</FieldError>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="nascimento" className="block text-xs font-medium text-muted mb-1">
                Data de nascimento
              </label>
              <input
                id="nascimento"
                type="date"
                max={todayISO()}
                value={form.dataNascimento}
                onChange={set('dataNascimento')}
                className="w-full border border-line rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
              <FieldError>{erros.dataNascimento}</FieldError>
            </div>

            <div>
              <label htmlFor="sexo" className="block text-xs font-medium text-muted mb-1">
                Sexo
              </label>
              <select
                id="sexo"
                value={form.sexo}
                onChange={set('sexo')}
                className="w-full border border-line rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
              >
                <option value="">—</option>
                {SEXOS.map((s) => (
                  <option key={s} value={s}>
                    {s === 'M' ? 'Masculino' : 'Feminino'}
                  </option>
                ))}
              </select>
              <FieldError>{erros.sexo}</FieldError>
            </div>
          </div>

          <div>
            <label htmlFor="estado-paciente" className="block text-xs font-medium text-muted mb-1">
              Estado
            </label>
            <select
              id="estado-paciente"
              value={form.estado}
              onChange={set('estado')}
              className="w-full border border-line rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            >
              {PACIENTE_ESTADOS.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onFechar}
              className="border border-line text-sm px-4 py-2 rounded font-medium hover:bg-surface transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submetendo}
              className="bg-accent text-white text-sm px-4 py-2 rounded font-medium hover:bg-blue transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submetendo && (
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              )}
              Registar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}