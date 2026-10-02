import Badge from '../components/Badge'
import Card from '../components/Card'
import { exames } from '../data'

export default function Exames() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Exames</h1>
        <p className="text-muted text-xs mt-0.5">{exames.length} exames registados</p>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-muted border-b border-line">
                <th className="px-4 py-2.5 font-medium">Paciente</th>
                <th className="px-4 py-2.5 font-medium">Exame</th>
                <th className="px-4 py-2.5 font-medium">Departamento</th>
                <th className="px-4 py-2.5 font-medium">Data</th>
                <th className="px-4 py-2.5 font-medium">Profissional</th>
                <th className="px-4 py-2.5 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {exames.map((e, i) => (
                <tr key={i} className="border-t border-line hover:bg-surface">
                  <td className="px-4 py-2.5 font-medium">{e[0]}</td>
                  <td className="px-4 py-2.5">{e[1]}</td>
                  <td className="px-4 py-2.5">{e[2]}</td>
                  <td className="px-4 py-2.5 text-muted">{e[3]}</td>
                  <td className="px-4 py-2.5">{e[4]}</td>
                  <td className="px-4 py-2.5"><Badge>{e[5]}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
