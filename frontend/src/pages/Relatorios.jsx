import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import useResource from '../hooks/useResource'
import useDebounce from '../hooks/useDebounce'
import { formatDate } from '../lib/format'
import { RELATORIO_ESTADOS } from '../lib/enums'
import PageHeader from '../components/PageHeader'
import Icon from '../components/Icon'
import Badge from '../components/Badge'
import Card from '../components/Card'
import Pagination from '../components/Pagination'
import { TableSkeleton, ErrorState, EmptyState } from '../components/States'

export default function Relatorios() {
  const [q, setQ] = useState('')
  const [estado, setEstado] = useState('')
  const [page, setPage] = useState(1)
  const termo = useDebounce(q, 300)

  const { data, loading, error, reload } = useResource(
    () => api.listRelatorios({ q: termo || undefined, estado: estado || undefined, page, pageSize: 8 }),
    [termo, estado, page],
    { initialData: { items: [], total: 0, page: 1, totalPages: 1 } },
  )

  function resetPage(fn) {
    return (value) => {
      fn(value)
      setPage(1)
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Relatórios" subtitle={loading ? 'A carregar…' : `${data.total} relatórios`}>
        <Link
          to="/relatorios/novo"
          className="bg-accent text-white text-sm px-4 py-2 rounded font-medium hover:bg-blue transition-colors flex items-center gap-2"
        >
          <Icon name="plus" className="w-4 h-4" />
          Novo relatório
        </Link>
      </PageHeader>

      <Card>
        <div className="px-4 py-3 border-b border-line flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm min-w-56">
            <Icon
              name="search"
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              value={q}
              onChange={(e) => resetPage(setQ)(e.target.value)}
              placeholder="Pesquisar por número ou paciente..."
              aria-label="Pesquisar relatórios"
              className="w-full border border-line rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
          <select
            value={estado}
            onChange={(e) => resetPage(setEstado)(e.target.value)}
            aria-label="Filtrar por estado"
            className="border border-line rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            <option value="">Todos os estados</option>
            {RELATORIO_ESTADOS.map((e) => (
              <option key={e} value={e}>
                {e}
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
                  icon="report"
                  title="Nenhum relatório encontrado"
                  description={
                    termo || estado
                      ? 'Não há relatórios que correspondam aos filtros aplicados.'
                      : 'Ainda não foi criado nenhum relatório.'
                  }
                  action={
                    <Link to="/relatorios/novo" className="text-xs text-accent">
                      Criar relatório
                    </Link>
                  }
                />
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-muted border-b border-line">
                      <th className="px-4 py-2.5 font-medium">Nº</th>
                      <th className="px-4 py-2.5 font-medium">Paciente</th>
                      <th className="px-4 py-2.5 font-medium">Tipo</th>
                      <th className="px-4 py-2.5 font-medium">Profissional</th>
                      <th className="px-4 py-2.5 font-medium">Data</th>
                      <th className="px-4 py-2.5 font-medium">Estado</th>
                      <th className="px-4 py-2.5 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((r) => (
                      <tr key={r.id} className="border-t border-line hover:bg-surface">
                        <td className="px-4 py-2.5">
                          <Link to={`/relatorios/${r.id}`} className="font-medium hover:text-accent">
                            {r.id}
                          </Link>
                        </td>
                        <td className="px-4 py-2.5 font-medium">
                          <Link to={`/pacientes/${r.pacienteId}`} className="hover:text-accent">
                            {r.pacienteNome}
                          </Link>
                        </td>
                        <td className="px-4 py-2.5">{r.tipo}</td>
                        <td className="px-4 py-2.5">{r.profissionalNome}</td>
                        <td className="px-4 py-2.5 text-muted">{formatDate(r.data)}</td>
                        <td className="px-4 py-2.5">
                          <Badge>{r.estado}</Badge>
                        </td>
                        <td className="px-4 py-2.5">
                          <Link to={`/relatorios/${r.id}`} className="text-accent">
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
                label="relatórios"
              />
            )}
          </>
        )}
      </Card>
    </div>
  )
}