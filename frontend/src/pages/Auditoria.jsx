import { useState } from 'react'
import { api } from '../lib/api'
import useResource from '../hooks/useResource'
import { formatDateTime } from '../lib/format'
import PageHeader from '../components/PageHeader'
import Icon from '../components/Icon'
import Badge from '../components/Badge'
import Card from '../components/Card'
import Pagination from '../components/Pagination'
import { TableSkeleton, ErrorState, EmptyState } from '../components/States'

export default function Auditoria() {
  const [de, setDe] = useState('')
  const [ate, setAte] = useState('')
  const [resultado, setResultado] = useState('')
  const [page, setPage] = useState(1)

  const { data, loading, error, reload } = useResource(
    () =>
      api.listAuditoria({
        from: de || undefined,
        to: ate || undefined,
        resultado: resultado || undefined,
        page,
        pageSize: 15,
      }),
    [de, ate, resultado, page],
    { initialData: { items: [], total: 0, page: 1, totalPages: 1 } },
  )

  function filtrar(setter) {
    return (value) => {
      setter(value)
      setPage(1)
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Auditoria"
        subtitle={loading ? 'A carregar…' : `${data.total} registos de atividade`}
      />

      <Card>
        <div className="px-4 py-3 border-b border-line flex items-end gap-3 flex-wrap">
          <div>
            <label htmlFor="de" className="block text-[11px] text-muted mb-1">
              De
            </label>
            <input
              id="de"
              type="date"
              value={de}
              max={ate || undefined}
              onChange={(e) => filtrar(setDe)(e.target.value)}
              className="border border-line rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
          <div>
            <label htmlFor="ate" className="block text-[11px] text-muted mb-1">
              Até
            </label>
            <input
              id="ate"
              type="date"
              value={ate}
              min={de || undefined}
              onChange={(e) => filtrar(setAte)(e.target.value)}
              className="border border-line rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
          <div>
            <label htmlFor="resultado" className="block text-[11px] text-muted mb-1">
              Resultado
            </label>
            <select
              id="resultado"
              value={resultado}
              onChange={(e) => filtrar(setResultado)(e.target.value)}
              className="border border-line rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            >
              <option value="">Todos</option>
              <option value="Sucesso">Sucesso</option>
              <option value="Falha">Falha</option>
            </select>
          </div>
          {(de || ate || resultado) && (
            <button
              onClick={() => {
                setDe('')
                setAte('')
                setResultado('')
                setPage(1)
              }}
              className="text-xs text-accent hover:underline flex items-center gap-1 pb-2"
            >
              <Icon name="x" className="w-3.5 h-3.5" />
              Limpar filtros
            </button>
          )}
        </div>

        {error ? (
          <ErrorState error={error} onRetry={reload} />
        ) : (
          <>
            <div className="overflow-x-auto">
              {loading ? (
                <TableSkeleton rows={8} cols={6} />
              ) : data.items.length === 0 ? (
                <EmptyState
                  icon="shield"
                  title="Sem registos de auditoria"
                  description="Não existem atividades para os filtros aplicados."
                />
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-muted border-b border-line">
                      <th className="px-4 py-2.5 font-medium">Data/Hora</th>
                      <th className="px-4 py-2.5 font-medium">Utilizador</th>
                      <th className="px-4 py-2.5 font-medium">Ação</th>
                      <th className="px-4 py-2.5 font-medium">Entidade</th>
                      <th className="px-4 py-2.5 font-medium">Registo</th>
                      <th className="px-4 py-2.5 font-medium">Paciente</th>
                      <th className="px-4 py-2.5 font-medium">Resultado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((a) => (
                      <tr key={a.id} className="border-t border-line hover:bg-surface">
                        <td className="px-4 py-2.5 text-muted whitespace-nowrap">
                          {formatDateTime(a.dataHora)}
                        </td>
                        <td className="px-4 py-2.5 font-medium">{a.utilizadorNome}</td>
                        <td className="px-4 py-2.5">{a.acao}</td>
                        <td className="px-4 py-2.5 text-muted">{a.entidade}</td>
                        <td className="px-4 py-2.5">{a.referencia ?? '—'}</td>
                        <td className="px-4 py-2.5">{a.pacienteNome}</td>
                        <td className="px-4 py-2.5">
                          <Badge>{a.resultado}</Badge>
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
                label="registos"
              />
            )}
          </>
        )}
      </Card>
    </div>
  )
}