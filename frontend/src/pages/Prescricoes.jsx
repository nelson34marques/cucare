import Badge from '../components/Badge'
import Card from '../components/Card'
import { prescricoes } from '../data'

export default function Prescricoes() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Prescrições</h1>
        <p className="text-muted text-xs mt-0.5">{prescricoes.length} prescrições</p>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-muted border-b border-line">
                <th className="px-4 py-2.5 font-medium">Paciente</th>
                <th className="px-4 py-2.5 font-medium">Medicamento</th>
                <th className="px-4 py-2.5 font-medium">Profissional</th>
                <th className="px-4 py-2.5 font-medium">Data</th>
                <th className="px-4 py-2.5 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {prescricoes.map((p, i) => (
                <tr key={i} className="border-t border-line hover:bg-surface">
                  <td className="px-4 py-2.5 font-medium">{p[0]}</td>
                  <td className="px-4 py-2.5">{p[1]}</td>
                  <td className="px-4 py-2.5">{p[2]}</td>
                  <td className="px-4 py-2.5 text-muted">{p[3]}</td>
                  <td className="px-4 py-2.5"><Badge>{p[4]}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
