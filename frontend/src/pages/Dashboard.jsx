import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import useResource from '../hooks/useResource'
import { formatDate, formatDateTimeShort } from '../lib/format'
import PageHeader from '../components/PageHeader'
import Icon from '../components/Icon'
import Badge from '../components/Badge'
import Card from '../components/Card'
import { Skeleton, ErrorState, EmptyState } from '../components/States'

const STATS = [
  { key: 'pacientesAtivos', label: 'Pacientes ativos', icon: 'users', color: 'bg-accent' },
  { key: 'relatoriosMes', label: 'Relatórios este mês', icon: 'report', color: 'bg-blue' },
  { key: 'examesPendentes', label: 'Exames pendentes', icon: 'flask', color: 'bg-warn' },
  { key: 'prescricoesAtivas', label: 'Prescrições ativas', icon: 'pill', color: 'bg-ok' },
]

export default function Dashboard() {
  const { data, loading, error, reload } = useResource(() => api.getDashboardResumo(), [])

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" subtitle="Visão geral da instituição">
        <Link
          to="/relatorios/novo"
          className="bg-accent text-white text-sm px-4 py-2 rounded font-medium hover:bg-blue transition-colors flex items-center gap-2"
        >
          <Icon name="plus" className="w-4 h-4" />
          Novo relatório
        </Link>
      </PageHeader>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <Card key={s.key} className="p-4 flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded ${s.color} text-white flex items-center justify-center shrink-0`}
            >
              <Icon name={s.icon} className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              {loading ? (
                <>
                  <Skeleton className="h-6 w-10" />
                  <Skeleton className="h-3 w-20 mt-1" />
                </>
              ) : (
                <>
                  <div className="text-xl font-semibold leading-tight">{data?.[s.key] ?? 0}</div>
                  <div className="text-xs text-muted truncate">{s.label}</div>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>

      {error && (
        <Card>
          <ErrorState error={error} onRetry={reload} />
        </Card>
      )}

      {!error && (
        <div className="grid lg:grid-cols-2 gap-4">
          <Card>
            <div className="px-4 py-3 border-b border-line flex items-center justify-between">
              <h2 className="font-semibold">Relatórios recentes</h2>
              <Link to="/relatorios" className="text-xs text-accent">
                Ver todos
              </Link>
            </div>
            {loading ? (
              <div className="divide-y divide-line">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="px-4 py-3 flex gap-4">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 flex-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>
            ) : data.relatoriosRecentes.length === 0 ? (
              <EmptyState
                icon="report"
                title="Sem relatórios"
                description="Ainda não foi criado nenhum relatório."
                action={
                  <Link to="/relatorios/novo" className="text-xs text-accent">
                    Criar relatório
                  </Link>
                }
              />
            ) : (
              <table className="w-full">
                <tbody>
                  {data.relatoriosRecentes.map((r) => (
                    <tr key={r.id} className="border-t border-line">
                      <td className="px-4 py-2.5 font-medium">
                        <Link to={`/relatorios/${r.id}`} className="hover:text-accent">
                          {r.id}
                        </Link>
                      </td>
                      <td className="px-4 py-2.5">{r.pacienteNome}</td>
                      <td className="px-4 py-2.5 text-muted">{formatDate(r.data)}</td>
                      <td className="px-4 py-2.5">
                        <Badge>{r.estado}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>

          <Card>
            <div className="px-4 py-3 border-b border-line">
              <h2 className="font-semibold">Atividade recente</h2>
            </div>
            {loading ? (
              <div className="divide-y divide-line">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="px-4 py-3 flex gap-4">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-3 flex-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>
            ) : data.atividadeRecente.length === 0 ? (
              <EmptyState icon="shield" title="Sem atividade registada" />
            ) : (
              <table className="w-full">
                <tbody>
                  {data.atividadeRecente.map((a) => (
                    <tr key={a.id} className="border-t border-line">
                      <td className="px-4 py-2.5 font-medium">{a.utilizadorNome}</td>
                      <td className="px-4 py-2.5">{a.acao}</td>
                      <td className="px-4 py-2.5 text-muted">{a.pacienteNome}</td>
                      <td className="px-4 py-2.5 text-muted whitespace-nowrap">
                        {formatDateTimeShort(a.dataHora)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </div>
      )}

      {!error && (
        <Card>
          <div className="px-4 py-3 border-b border-line flex items-center justify-between">
            <h2 className="font-semibold">Pacientes recentes</h2>
            <Link to="/pacientes" className="text-xs text-accent">
              Ver todos
            </Link>
          </div>
          {loading ? (
            <div className="divide-y divide-line">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-4 py-3 flex gap-4">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 flex-1" />
                  <Skeleton className="h-3 w-20" />
                </div>
              ))}
            </div>
          ) : data.pacientesRecentes.length === 0 ? (
            <EmptyState icon="users" title="Sem pacientes registados" />
          ) : (
            <table className="w-full">
              <tbody>
                {data.pacientesRecentes.map((p) => (
                  <tr key={p.id} className="border-t border-line hover:bg-surface">
                    <td className="px-4 py-2.5">{p.id}</td>
                    <td className="px-4 py-2.5 font-medium">
                      <Link to={`/pacientes/${p.id}`} className="hover:text-accent">
                        {p.nome}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5 text-muted">{formatDate(p.dataNascimento)}</td>
                    <td className="px-4 py-2.5 text-muted">{formatDate(p.ultimaVisita)}</td>
                    <td className="px-4 py-2.5">
                      <Badge>{p.estado}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      )}
    </div>
  )
}