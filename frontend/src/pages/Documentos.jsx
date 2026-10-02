import Badge from '../components/Badge'
import Card from '../components/Card'
import Icon from '../components/Icon'
import { documentos } from '../data'

export default function Documentos() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold">Documentos</h1>
          <p className="text-muted text-xs mt-0.5">{documentos.length} documentos</p>
        </div>
        <button className="bg-accent text-white text-sm px-4 py-2 rounded font-medium hover:bg-blue transition-colors flex items-center gap-2">
          <Icon name="plus" className="w-4 h-4" />
          Carregar documento
        </button>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-muted border-b border-line">
                <th className="px-4 py-2.5 font-medium">Ficheiro</th>
                <th className="px-4 py-2.5 font-medium">Paciente</th>
                <th className="px-4 py-2.5 font-medium">Tipo</th>
                <th className="px-4 py-2.5 font-medium">Tamanho</th>
                <th className="px-4 py-2.5 font-medium">Data</th>
                <th className="px-4 py-2.5 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {documentos.map((d, i) => (
                <tr key={i} className="border-t border-line hover:bg-surface">
                  <td className="px-4 py-2.5 font-medium">{d[0]}</td>
                  <td className="px-4 py-2.5">{d[1]}</td>
                  <td className="px-4 py-2.5">{d[2]}</td>
                  <td className="px-4 py-2.5 text-muted">{d[3]}</td>
                  <td className="px-4 py-2.5 text-muted">{d[4]}</td>
                  <td className="px-4 py-2.5"><Badge>{d[5]}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
