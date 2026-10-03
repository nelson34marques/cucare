import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import useResource from '../hooks/useResource'
import { formatDate } from '../lib/format'
import { PRESCRICAO_ESTADOS } from '../lib/enums'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import Card from '../components/Card'
import Pagination from '../components/Pagination'
import { TableSkeleton, ErrorState, EmptyState } from '../components/States'
import { useToast } from '../components/Toast'

export default function Prescricoes() {
  const toast = useToast()
  const [estado, setEstado] = useState('')
  const [page, setPage] = useState(1)

  const { data, loading, error, reload } = useResource(
    () => api.listPrescricoes({ estado: estado || undefined, page, pageSize: 10 }),
    [estado, page],
    { initialData: { items: [], total: 0, page: 1, totalPages: 1 } },
  )

  async function alterarEstado(id, novo) {
    try {
      await api.setPrescricaoEstado({ id, estado: novo })
      reload()
      toast(`Prescrição marcada como "${novo}"`)
    } catch (err) {
      toast(err.message)
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Prescrições"
        subtitle={loading ? 'A carregar…' : `${data.total} prescrições`}
      />

      <Card>
        <div className="px-4 py-3 border-b border-line">
          <select
            value={estado}
            onChange={(e) => {
              setEstado(e.target.value)
              setPage(1)
            }}
            aria-label="Filtrar por estado"
            className="border border-line rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            <option value="">Todos os estados</option>
            {PRESCRICAO_ESTADOS.map((e) => (
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
                  icon="pill"
                  title="Nenhuma prescrição encontrada"
                  description="Não há prescrições que correspondam ao filtro aplicado."
                />
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-muted border-b border-line">
                      <th className="px-4 py-2.5 font-medium">ID</th>
                      <th className="px-4 py-2.5 font-medium">Paciente</th>
                      <th className="px-4 py-2.5 font-medium">Medicamento</th>
                      <th className="px-4 py-2.5 font-medium">Profissional</th>
                      <th className="px-4 py-2.5 font-medium">Data</th>
                      <th className="px-4 py-2.5 font-medium">Estado</th>
                      <th className="px-4 py-2.5 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((p) => (
                      <tr key={p.id} className="border-t border-line hover:bg-surface">
                        <td className="px-4 py-2.5">{p.id}</td>
                        <td className="px-4 py-2.5 font-medium">
                          <Link to={`/pacientes/${p.pacienteId}`} className="hover:text-accent">
                            {p.pacienteNome}
                          </Link>
                        </td>
                        <td className="px-4 py-2.5">{p.medicamento}</td>
                        <td className="px-4 py-2.5">{p.profissionalNome}</td>
                        <td className="px-4 py-2.5 text-muted">{formatDate(p.data)}</td>
                        <td className="px-4 py-2.5">
                          <Badge>{p.estado}</Badge>
                        </td>
                        <td className="px-4 py-2.5">
                          {p.estado === 'Ativa' ? (
                            <button
                              onClick={() => alterarEstado(p.id, 'Concluída')}
                              className="text-accent hover:underline"
                            >
                              Concluir
                            </button>
                          ) : (
                            <button
                              onClick={() => alterarEstado(p.id, 'Cancelada')}
                              className="text-muted hover:text-bad"
                            >
                              Cancelar
                            </button>
                          )}
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
                label="prescrições"
              />
            )}
          </>
        )}
      </Card>
    </div>
  )
}