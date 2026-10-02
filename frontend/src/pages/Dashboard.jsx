import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import Badge from '../components/Badge'
import Card from '../components/Card'
import { patients, reports, activity } from '../data'

const stats = [
  { label: 'Pacientes ativos', value: '128', icon: 'users', color: 'bg-accent' },
  { label: 'Relatórios este mês', value: '46', icon: 'report', color: 'bg-blue' },
  { label: 'Exames pendentes', value: '12', icon: 'flask', color: 'bg-warn' },
  { label: 'Prescrições ativas', value: '34', icon: 'pill', color: 'bg-ok' },
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-muted text-xs mt-0.5">Visão geral da instituição</p>
        </div>
        <Link to="/criar-relatorio" className="bg-accent text-white text-sm px-4 py-2 rounded font-medium hover:bg-blue transition-colors flex items-center gap-2">
          <Icon name="plus" className="w-4 h-4" />
          Novo relatório
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded ${s.color} text-white flex items-center justify-center shrink-0`}>
              <Icon name={s.icon} className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-semibold leading-tight">{s.value}</div>
              <div className="text-xs text-muted">{s.label}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <div className="px-4 py-3 border-b border-line flex items-center justify-between">
            <h2 className="font-semibold">Relatórios recentes</h2>
            <Link to="/relatorios" className="text-xs text-accent">Ver todos</Link>
          </div>
          <table className="w-full">
            <tbody>
              {reports.slice(0, 4).map((r) => (
                <tr key={r.n} className="border-t border-line">
                  <td className="px-4 py-2.5 font-medium">{r.n}</td>
                  <td className="px-4 py-2.5">{r.patient}</td>
                  <td className="px-4 py-2.5 text-muted">{r.date}</td>
                  <td className="px-4 py-2.5"><Badge>{r.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card>
          <div className="px-4 py-3 border-b border-line">
            <h2 className="font-semibold">Atividade recente</h2>
          </div>
          <table className="w-full">
            <tbody>
              {activity.map((a, i) => (
                <tr key={i} className="border-t border-line">
                  <td className="px-4 py-2.5 font-medium">{a[0]}</td>
                  <td className="px-4 py-2.5">{a[1]}</td>
                  <td className="px-4 py-2.5">{a[2]}</td>
                  <td className="px-4 py-2.5 text-muted">{a[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <Card>
        <div className="px-4 py-3 border-b border-line flex items-center justify-between">
          <h2 className="font-semibold">Pacientes recentes</h2>
          <Link to="/pacientes" className="text-xs text-accent">Ver todos</Link>
        </div>
        <table className="w-full">
          <tbody>
            {patients.slice(0, 5).map((p) => (
              <tr key={p.id} className="border-t border-line hover:bg-surface">
                <td className="px-4 py-2.5">{p.id}</td>
                <td className="px-4 py-2.5 font-medium">{p.name}</td>
                <td className="px-4 py-2.5 text-muted">{p.dob}</td>
                <td className="px-4 py-2.5 text-muted">{p.last}</td>
                <td className="px-4 py-2.5"><Badge>{p.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
