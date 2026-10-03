import { Link, useParams } from 'react-router-dom'
import { api } from '../lib/api'
import useResource from '../hooks/useResource'
import { formatDate, initials } from '../lib/format'
import { BackLink } from '../components/PageHeader'
import Icon from '../components/Icon'
import Badge from '../components/Badge'
import Card from '../components/Card'
import { Skeleton, TableSkeleton, ErrorState, EmptyState } from '../components/States'

export default function PerfilPaciente() {
  const { id } = useParams()

  const paciente = useResource(() => api.getPaciente({ id }), [id])
  const relatorios = useResource(
    () => api.listRelatorios({ pacienteId: id, pageSize: 20 }),
    [id],
    { initialData: { items: [] } },
  )
  const exames = useResource(() => api.listExames({ pacienteId: id, pageSize: 20 }), [id], {
    initialData: { items: [] },
  })
  const prescricoes = useResource(
    () => api.listPrescricoes({ pacienteId: id, pageSize: 20 }),
    [id],
    { initialData: { items: [] } },
  )

  if (paciente.error) {
    return (
      <div className="space-y-4">
        <BackLink to="/pacientes">Voltar a pacientes</BackLink>
        <Card>
          <ErrorState
            error={paciente.error}
            onRetry={paciente.reload}
            title={
              paciente.error.isNotFound
                ? 'Paciente não encontrado'
                : 'Não foi possível carregar o paciente'
            }
          />
        </Card>
      </div>
    )
  }

  const p = paciente.data

  return (
    <div className="space-y-4">
      <BackLink to="/pacientes">Voltar a pacientes</BackLink>

      <Card className="p-5">
        {paciente.loading || !p ? (
          <div className="flex items-start gap-4">
            <Skeleton className="w-14 h-14 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-56" />
              <Skeleton className="h-3 w-72" />
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-4 flex-wrap">
            <div className="w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center text-lg font-semibold shrink-0">
              {initials(p.nome)}
            </div>
            <div className="flex-1 min-w-48">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-semibold">{p.nome}</h1>
                <Badge>{p.estado}</Badge>
              </div>
              <p className="text-muted text-xs mt-0.5">
                {p.id} · Nascimento {formatDate(p.dataNascimento)} · Sexo {p.sexo}
              </p>
              <p className="text-muted text-xs mt-0.5">
                {p.totais.relatorios} relatórios · {p.totais.exames} exames ·{' '}
                {p.totais.prescricoes} prescrições · {p.totais.documentos} documentos
              </p>
            </div>
            <Link
              to={`/relatorios/novo?paciente=${p.id}`}
              className="bg-accent text-white text-sm px-4 py-2 rounded font-medium hover:bg-blue transition-colors flex items-center gap-2"
            >
              <Icon name="plus" className="w-4 h-4" />
              Novo relatório
            </Link>
          </div>
        )}
      </Card>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <div className="px-4 py-3 border-b border-line">
            <h2 className="font-semibold">Relatórios</h2>
          </div>
          <Historico
            loading={relatorios.loading}
            error={relatorios.error}
            onRetry={relatorios.reload}
            items={relatorios.data?.items}
            vazio={{ icon: 'report', title: 'Sem relatórios' }}
            colunas={['Nº', 'Tipo', 'Data', 'Estado']}
            render={(r) => [
              <Link key="n" to={`/relatorios/${r.id}`} className="font-medium hover:text-accent">
                {r.id}
              </Link>,
              <span key="t">{r.tipo}</span>,
              <span key="d" className="text-muted">
                {formatDate(r.data)}
              </span>,
              <Badge key="e">{r.estado}</Badge>,
            ]}
          />
        </Card>

        <Card>
          <div className="px-4 py-3 border-b border-line">
            <h2 className="font-semibold">Exames</h2>
          </div>
          <Historico
            loading={exames.loading}
            error={exames.error}
            onRetry={exames.reload}
            items={exames.data?.items}
            vazio={{ icon: 'flask', title: 'Sem exames' }}
            colunas={['Exame', 'Data', 'Estado']}
            render={(e) => [
              <span key="n" className="font-medium">
                {e.nome}
              </span>,
              <span key="d" className="text-muted">
                {formatDate(e.data)}
              </span>,
              <Badge key="e">{e.estado}</Badge>,
            ]}
          />
        </Card>
      </div>

      <Card>
        <div className="px-4 py-3 border-b border-line">
          <h2 className="font-semibold">Prescrições</h2>
        </div>
        <Historico
          loading={prescricoes.loading}
          error={prescricoes.error}
          onRetry={prescricoes.reload}
          items={prescricoes.data?.items}
          vazio={{ icon: 'pill', title: 'Sem prescrições' }}
          colunas={['Medicamento', 'Profissional', 'Data', 'Estado']}
          render={(x) => [
            <span key="m" className="font-medium">
              {x.medicamento}
            </span>,
            <span key="pr">{x.profissionalNome}</span>,
            <span key="d" className="text-muted">
              {formatDate(x.data)}
            </span>,
            <Badge key="e">{x.estado}</Badge>,
          ]}
        />
      </Card>
    </div>
  )
}

function Historico({ loading, error, onRetry, items, vazio, colunas, render }) {
  if (error) return <ErrorState error={error} onRetry={onRetry} />
  if (loading) return <TableSkeleton rows={4} cols={colunas.length} />
  if (!items || items.length === 0) return <EmptyState icon={vazio.icon} title={vazio.title} />

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t border-line">
              {render(item).map((celula, i) => (
                <td key={i} className="px-4 py-2.5">
                  {celula}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}