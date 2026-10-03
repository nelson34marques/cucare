import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../lib/api'
import useResource from '../hooks/useResource'
import { formatDate } from '../lib/format'
import { RELATORIO_ESTADOS } from '../lib/enums'
import { BackLink } from '../components/PageHeader'
import Icon from '../components/Icon'
import Badge from '../components/Badge'
import Card from '../components/Card'
import { Skeleton, ErrorState } from '../components/States'
import { useToast } from '../components/Toast'

export default function PreviewRelatorio() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [exportando, setExportando] = useState(false)
  const [alterandoEstado, setAlterandoEstado] = useState(false)

  const { data: r, loading, error, reload } = useResource(() => api.getRelatorio({ id }), [id])

  async function onExportar() {
    setExportando(true)
    try {
      await api.exportRelatorio({ id })
      toast('Relatório exportado')
    } catch (err) {
      toast(err.message)
    } finally {
      setExportando(false)
    }
  }

  async function onFinalizar() {
    setAlterandoEstado(true)
    try {
      await api.setRelatorioEstado({ id, estado: 'Finalizado' })
      reload()
      toast('Relatório finalizado')
    } catch (err) {
      toast(err.message)
    } finally {
      setAlterandoEstado(false)
    }
  }

  if (error) {
    return (
      <div className="space-y-4">
        <BackLink to="/relatorios">Voltar a relatórios</BackLink>
        <Card>
          <ErrorState
            error={error}
            onRetry={reload}
            title={
              error.isNotFound
                ? 'Relatório não encontrado'
                : 'Não foi possível carregar o relatório'
            }
          />
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <BackLink to="/relatorios">Voltar a relatórios</BackLink>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/relatorios/${id}/editar`)}
            disabled={loading}
            className="border border-line text-sm px-4 py-2 rounded font-medium hover:bg-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Editar
          </button>
          <button
            onClick={onExportar}
            disabled={loading || exportando}
            className="bg-accent text-white text-sm px-4 py-2 rounded font-medium hover:bg-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {exportando && (
              <span className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            )}
            {exportando ? 'A exportar…' : 'Exportar PDF'}
          </button>
        </div>
      </div>

      <Card className="p-6 md:p-8">
        {loading || !r ? (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-line">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-64" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-16 ml-auto" />
                <Skeleton className="h-3 w-20 ml-auto" />
              </div>
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
            <Skeleton className="h-3 w-3/5" />
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4 flex-wrap pb-5 border-b border-line">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-accent text-white flex items-center justify-center">
                  <Icon name="shield" className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold">{r.instituicao.nome}</div>
                  <div className="text-xs text-muted">
                    {r.instituicao.morada} · {r.instituicao.telefone}
                  </div>
                </div>
              </div>
              <div className="text-right text-sm">
                <div className="font-medium">{r.id}</div>
                <div className="text-muted text-xs">{formatDate(r.data)}</div>
                <div className="mt-1">
                  <Badge>{r.estado}</Badge>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 py-5 border-b border-line text-sm">
              <div>
                <span className="text-muted">Paciente: </span>
                <Link to={`/pacientes/${r.pacienteId}`} className="font-medium hover:text-accent">
                  {r.pacienteNome}
                </Link>
              </div>
              <div>
                <span className="text-muted">Tipo: </span>
                {r.tipo}
              </div>
              <div>
                <span className="text-muted">Profissional: </span>
                {r.profissionalNome}
              </div>
              <div>
                <span className="text-muted">Data: </span>
                {formatDate(r.data)}
              </div>
            </div>

            <div className="py-5 space-y-4">
              <div>
                <h2 className="font-semibold mb-2">Resumo clínico</h2>
                <p className="text-sm leading-relaxed text-navy/90 whitespace-pre-wrap">
                  {r.resumo || '—'}
                </p>
              </div>
              {r.notas && (
                <div>
                  <h2 className="font-semibold mb-2">Observações</h2>
                  <p className="text-sm leading-relaxed text-navy/90 whitespace-pre-wrap">{r.notas}</p>
                </div>
              )}
            </div>

            {r.estado !== 'Finalizado' && (
              <div className="pb-5">
                <label
                  htmlFor="estado"
                  className="block text-xs font-medium text-muted mb-1"
                >
                  Alterar estado
                </label>
                <div className="flex gap-2">
                  <select
                    id="estado"
                    value={r.estado}
                    onChange={(e) => {
                      api
                        .setRelatorioEstado({ id, estado: e.target.value })
                        .then(() => {
                          reload()
                          toast(`Estado alterado para "${e.target.value}"`)
                        })
                        .catch((err) => toast(err.message))
                    }}
                    disabled={alterandoEstado}
                    className="border border-line rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                  >
                    {RELATORIO_ESTADOS.map((e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={onFinalizar}
                    disabled={alterandoEstado}
                    className="bg-ok text-white text-sm px-4 py-2 rounded font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Finalizar
                  </button>
                </div>
              </div>
            )}

            <div className="pt-5 border-t border-line flex items-end justify-between gap-4">
              <div className="text-xs text-muted">
                <div>Documento gerado eletronicamente</div>
                <div>{r.instituicao.sistema}</div>
              </div>
              <div className="text-center shrink-0">
                <div className="w-40 border-b border-muted mb-1" />
                <div className="text-xs text-muted">{r.profissionalNome}</div>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}