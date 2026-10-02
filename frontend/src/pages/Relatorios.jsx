import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import Badge from '../components/Badge'
import Card from '../components/Card'
import { reports } from '../data'

export default function Relatorios() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold">Relatórios</h1>
          <p className="text-muted text-xs mt-0.5">{reports.length} relatórios</p>
        </div>
        <Link to="/criar-relatorio" className="bg-accent text-white text-sm px-4 py-2 rounded font-medium hover:bg-blue transition-colors flex items-center gap-2">
          <Icon name="plus" className="w-4 h-4" />
          Novo relatório
        </Link>
      </div>

      <Card>
        <div className="overflow-x-auto">
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
              {reports.map((r) => (
                <tr key={r.n} className="border-t border-line hover:bg-surface">
                  <td className="px-4 py-2.5">{r.n}</td>
                  <td className="px-4 py-2.5 font-medium">{r.patient}</td>
                  <td className="px-4 py-2.5">{r.type}</td>
                  <td className="px-4 py-2.5">{r.prof}</td>
                  <td className="px-4 py-2.5 text-muted">{r.date}</td>
                  <td className="px-4 py-2.5"><Badge>{r.status}</Badge></td>
                  <td className="px-4 py-2.5">
                    <Link to="/preview-relatorio" className="text-accent">Ver</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
