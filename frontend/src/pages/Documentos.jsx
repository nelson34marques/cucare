import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import useResource from '../hooks/useResource'
import { formatDate, formatBytes } from '../lib/format'
import { DOCUMENTO_TIPOS } from '../lib/enums'
import PageHeader from '../components/PageHeader'
import Icon from '../components/Icon'
import Badge from '../components/Badge'
import Card from '../components/Card'
import Pagination from '../components/Pagination'
import { TableSkeleton, ErrorState, EmptyState, FieldError } from '../components/States'
import { useToast } from '../components/Toast'

export default function Documentos() {
  const toast = useToast()
  const [tipo, setTipo] = useState('')
  const [page, setPage] = useState(1)
  const [modalAberto, setModalAberto] = useState(false)

  const { data, loading, error, reload } = useResource(
    () => api.listDocumentos({ tipo: tipo || undefined, page, pageSize: 10 }),
    [tipo, page],
    { initialData: { items: [], total: 0, page: 1, totalPages: 1 } },
  )

  async function remover(id, nome) {
    if (!window.confirm(`Remover o documento "${nome}"?`)) return
    try {
      await api.deleteDocumento({ id })
      reload()
      toast('Documento removido')
    } catch (err) {
      toast(err.message)
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Documentos"
        subtitle={loading ? 'A carregar…' : `${data.total} documentos`}
      >
        <button
          onClick={() => setModalAberto(true)}
          className="bg-accent text-white text-sm px-4 py-2 rounded font-medium hover:bg-blue transition-colors flex items-center gap-2"
        >
          <Icon name="upload" className="w-4 h-4" />
          Carregar documento
        </button>
      </PageHeader>

      <Card>
        <div className="px-4 py-3 border-b border-line">
          <select
            value={tipo}
            onChange={(e) => {
              setTipo(e.target.value)
              setPage(1)
            }}
            aria-label="Filtrar por tipo"
            className="border border-line rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            <option value="">Todos os tipos</option>
            {DOCUMENTO_TIPOS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
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
                  icon="folder"
                  title="Nenhum documento encontrado"
                  description="Não há documentos que correspondam ao filtro aplicado."
                />
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-muted border-b border-line">
                      <th className="px-4 py-2.5 font-medium">ID</th>
                      <th className="px-4 py-2.5 font-medium">Ficheiro</th>
                      <th className="px-4 py-2.5 font-medium">Paciente</th>
                      <th className="px-4 py-2.5 font-medium">Tipo</th>
                      <th className="px-4 py-2.5 font-medium">Tamanho</th>
                      <th className="px-4 py-2.5 font-medium">Data</th>
                      <th className="px-4 py-2.5 font-medium">Estado</th>
                      <th className="px-4 py-2.5 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((d) => (
                      <tr key={d.id} className="border-t border-line hover:bg-surface">
                        <td className="px-4 py-2.5">{d.id}</td>
                        <td className="px-4 py-2.5 font-medium">{d.nome}</td>
                        <td className="px-4 py-2.5">
                          <Link to={`/pacientes/${d.pacienteId}`} className="hover:text-accent">
                            {d.pacienteNome}
                          </Link>
                        </td>
                        <td className="px-4 py-2.5">{d.tipo}</td>
                        <td className="px-4 py-2.5 text-muted">{formatBytes(d.tamanhoBytes)}</td>
                        <td className="px-4 py-2.5 text-muted">{formatDate(d.data)}</td>
                        <td className="px-4 py-2.5">
                          <Badge>{d.estado}</Badge>
                        </td>
                        <td className="px-4 py-2.5">
                          <button
                            onClick={() => remover(d.id, d.nome)}
                            aria-label={`Remover ${d.nome}`}
                            className="text-muted hover:text-bad transition-colors"
                          >
                            <Icon name="trash" className="w-4 h-4" />
                          </button>
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
                label="documentos"
              />
            )}
          </>
        )}
      </Card>

      {modalAberto && (
        <ModalCarregar
          onFechar={() => setModalAberto(false)}
          onCarregado={() => {
            setModalAberto(false)
            reload()
          }}
        />
      )}
    </div>
  )
}

function ModalCarregar({ onFechar, onCarregado }) {
  const toast = useToast()
  const [ficheiro, setFicheiro] = useState(null)
  const [pacienteId, setPacienteId] = useState('')
  const [tipo, setTipo] = useState('Relatório')
  const [erros, setErros] = useState({})
  const [submetendo, setSubmetendo] = useState(false)

  const pacientes = useResource(() => api.listPacientes({ pageSize: 100 }), [], {
    initialData: { items: [] },
  })

  function escolher(event) {
    const file = event.target.files?.[0] ?? null
    setFicheiro(file)
    setErros((e) => ({ ...e, ficheiro: undefined }))
  }

  async function onSubmit(event) {
    event.preventDefault()
    const found = {}
    if (!ficheiro) found.ficheiro = 'Seleccione um ficheiro.'
    if (!pacienteId) found.pacienteId = 'Seleccione um paciente.'
    setErros(found)
    if (Object.keys(found).length) return

    setSubmetendo(true)
    try {
      await api.uploadDocumento({ ficheiro, pacienteId, tipo })
      toast('Documento carregado')
      onCarregado()
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
        aria-labelledby="modal-documento"
        className="w-full max-w-md bg-white border border-line rounded-md shadow-lg"
      >
        <div className="px-5 py-3.5 border-b border-line flex items-center justify-between">
          <h2 id="modal-documento" className="font-semibold">
            Carregar documento
          </h2>
          <button onClick={onFechar} aria-label="Fechar" className="text-muted hover:text-navy">
            <Icon name="x" className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} noValidate className="p-5 space-y-4">
          <div>
            <label htmlFor="ficheiro" className="block text-xs font-medium text-muted mb-1">
              Ficheiro
            </label>
            <input
              id="ficheiro"
              type="file"
              onChange={escolher}
              className="w-full text-xs file:mr-3 file:rounded file:border-0 file:bg-surface file:px-3 file:py-1.5 file:text-xs file:font-medium text-muted"
            />
            <FieldError>{erros.ficheiro}</FieldError>
          </div>

          <div>
            <label htmlFor="paciente-doc" className="block text-xs font-medium text-muted mb-1">
              Paciente
            </label>
            <select
              id="paciente-doc"
              value={pacienteId}
              onChange={(e) => setPacienteId(e.target.value)}
              disabled={pacientes.loading}
              className="w-full border border-line rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            >
              <option value="">
                {pacientes.loading ? 'A carregar pacientes…' : 'Selecionar paciente...'}
              </option>
              {pacientes.data.items.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome} ({p.id})
                </option>
              ))}
            </select>
            <FieldError>{erros.pacienteId}</FieldError>
          </div>

          <div>
            <label htmlFor="tipo-doc" className="block text-xs font-medium text-muted mb-1">
              Tipo
            </label>
            <select
              id="tipo-doc"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full border border-line rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            >
              {DOCUMENTO_TIPOS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {ficheiro && (
            <p className="text-[11px] text-muted">
              {ficheiro.name} · {formatBytes(ficheiro.size)}
            </p>
          )}

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
              Carregar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}