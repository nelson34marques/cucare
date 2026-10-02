import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import Badge from '../components/Badge'
import Card from '../components/Card'
import { patients, reports, exames, prescricoes } from '../data'

export default function PerfilPaciente() {
  const p = patients[0]
  const patientReports = reports.filter((r) => r.patient.includes(p.name.split(' ')[0]))
  const patientExames = exames.filter((e) => e[0].includes(p.name.split(' ')[0]))
  const patientPresc = prescricoes.filter((x) => x[0].includes(p.name.split(' ')[0]))

  return (
    <div className="space-y-4">
      <Link to="/pacientes" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy">
        <Icon name="back" className="w-4 h-4" />
        Voltar a pacientes
      </Link>

      <Card className="p-5">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center text-lg font-semibold">
            {p.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
          </div>
          <div className="flex-1 min-w-48">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-semibold">{p.name}</h1>
              <Badge>{p.status}</Badge>
            </div>
            <p className="text-muted text-xs mt-0.5">{p.id} · Nascimento {p.dob} · Sexo {p.sex}</p>
          </div>
          <Link to="/criar-relatorio" className="bg-accent text-white text-sm px-4 py-2 rounded font-medium hover:bg-blue transition-colors flex items-center gap-2">
            <Icon name="plus" className="w-4 h-4" />
            Novo relatório
          </Link>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <div className="px-4 py-3 border-b border-line">
            <h2 className="font-semibold">Relatórios</h2>
          </div>
          <table className="w-full">
            <tbody>
              {patientReports.map((r) => (
                <tr key={r.n} className="border-t border-line">
                  <td className="px-4 py-2.5 font-medium">{r.n}</td>
                  <td className="px-4 py-2.5">{r.type}</td>
                  <td className="px-4 py-2.5 text-muted">{r.date}</td>
                  <td className="px-4 py-2.5"><Badge>{r.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card>
          <div className="px-4 py-3 border-b border-line">
            <h2 className="font-semibold">Exames</h2>
          </div>
          <table className="w-full">
            <tbody>
              {patientExames.map((e, i) => (
                <tr key={i} className="border-t border-line">
                  <td className="px-4 py-2.5 font-medium">{e[1]}</td>
                  <td className="px-4 py-2.5 text-muted">{e[3]}</td>
                  <td className="px-4 py-2.5"><Badge>{e[5]}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <Card>
        <div className="px-4 py-3 border-b border-line">
          <h2 className="font-semibold">Prescrições</h2>
        </div>
        <table className="w-full">
          <tbody>
            {patientPresc.map((x, i) => (
              <tr key={i} className="border-t border-line">
                <td className="px-4 py-2.5 font-medium">{x[1]}</td>
                <td className="px-4 py-2.5">{x[2]}</td>
                <td className="px-4 py-2.5 text-muted">{x[3]}</td>
                <td className="px-4 py-2.5"><Badge>{x[4]}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
