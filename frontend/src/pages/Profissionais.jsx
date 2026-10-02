import Badge from '../components/Badge'
import Card from '../components/Card'
import { profissionais } from '../data'

export default function Profissionais() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Profissionais</h1>
        <p className="text-muted text-xs mt-0.5">{profissionais.length} profissionais de saúde</p>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-muted border-b border-line">
                <th className="px-4 py-2.5 font-medium">Nome</th>
                <th className="px-4 py-2.5 font-medium">Especialidade</th>
                <th className="px-4 py-2.5 font-medium">Registro</th>
                <th className="px-4 py-2.5 font-medium">Departamento</th>
                <th className="px-4 py-2.5 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {profissionais.map((p, i) => (
                <tr key={i} className="border-t border-line hover:bg-surface">
                  <td className="px-4 py-2.5 font-medium">{p[0]}</td>
                  <td className="px-4 py-2.5">{p[1]}</td>
                  <td className="px-4 py-2.5 text-muted">{p[2]}</td>
                  <td className="px-4 py-2.5">{p[3]}</td>
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
