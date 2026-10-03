import { useState } from 'react'
import { api } from '../lib/api'
import useResource from '../hooks/useResource'
import { formatDate } from '../lib/format'
import { EXAME_ESTADOS, EXAME_DEPARTAMENTOS } from '../lib/enums'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import Card from '../components/Card'
import Pagination from '../components/Pagination'
import { TableSkeleton, ErrorState, EmptyState } from '../components/States'

export default function Exames() {
  const [estado, setEstado] = useState('')
  const [departamento, setDepartamento] = useState('')
  const [page, setPage] = useState(1)

  const { data, loading, error, reload } = useResource(
    () => api.listExames({ estado: estado || undefined, departamento: departamento || undefined, page, pageSize: 10 }),
    [estado, departamento, page],
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
      <PageHeader title="Exames" subtitle={loading ? 'A carregar…' : `${data.total} exames registados`} />

      <Card>
        <div className="px-4 py-3 border-b border-line flex items-center gap-3 flex-wrap">
          <select
            value={departamento}
            onChange={(e) => filtrar(setDepartamento)(e.target.value)}
            aria-label="Filtrar por departamento"
            className="border border-line rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            <option value="">Todos os departamentos</option>
            {EXAME_DEPARTAMENTOS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            value={estado}
            onChange={(e) => filtrar(setEstado)(e.target.value)}
            aria-label="Filtrar por estado"
            className="border border-line rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            <option value="">Todos os estados</option>
            {EXAME_ESTADOS.map((e) => (
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
                  icon="flask"
                  title="Nenhum exame encontrado"
                  description="Não há exames que correspondam aos filtros aplicados."
                />
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-muted border-b border-line">
                      <th className="px-4 py-2.5 font-medium">ID</th>
                      <th className="px-4 py-2.5 font-medium">Paciente</th>
                      <th className="px-4 py-2.5 font-medium">Exame</th>
                      <th className="px-4 py-2.5 font-medium">Departamento</th>
                      <th className="px-4 py-2.5 font-medium">Data</th>
                      <th className="px-4 py-2.5 font-medium">Profissional</th>
                      <th className="px-4 py-2.5 font-medium">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((e) => (
                      <tr key={e.id} className="border-t border-line hover:bg-surface">
                        <td className="px-4 py-2.5">{e.id}</td>
                        <td className="px-4 py-2.5 font-medium">{e.pacienteNome}</td>
                        <td className="px-4 py-2.5">{e.nome}</td>
                        <td className="px-4 py-2.5">{e.departamento}</td>
                        <td className="px-4 py-2.5 text-muted">{formatDate(e.data)}</td>
                        <td className="px-4 py-2.5">{e.profissionalNome}</td>
                        <td className="px-4 py-2.5">
                          <Badge>{e.estado}</Badge>
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
                label="exames"
              />
            )}
          </>
        )}
      </Card>
    </div>
  )
}