import Badge from '../components/Badge'
import Card from '../components/Card'
import { auditoria } from '../data'

export default function Auditoria() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Auditoria</h1>
        <p className="text-muted text-xs mt-0.5">Registo de atividades do sistema</p>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-muted border-b border-line">
                <th className="px-4 py-2.5 font-medium">Data/Hora</th>
                <th className="px-4 py-2.5 font-medium">Utilizador</th>
                <th className="px-4 py-2.5 font-medium">Ação</th>
                <th className="px-4 py-2.5 font-medium">Registo</th>
                <th className="px-4 py-2.5 font-medium">Paciente</th>
                <th className="px-4 py-2.5 font-medium">Resultado</th>
              </tr>
            </thead>
            <tbody>
              {auditoria.map((a, i) => (
                <tr key={i} className="border-t border-line hover:bg-surface">
                  <td className="px-4 py-2.5 text-muted">{a[0]}</td>
                  <td className="px-4 py-2.5 font-medium">{a[1]}</td>
                  <td className="px-4 py-2.5">{a[2]}</td>
                  <td className="px-4 py-2.5">{a[3]}</td>
                  <td className="px-4 py-2.5">{a[4]}</td>
                  <td className="px-4 py-2.5"><Badge>{a[5]}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
