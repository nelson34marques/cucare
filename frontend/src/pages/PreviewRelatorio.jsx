import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import Badge from '../components/Badge'
import Card from '../components/Card'
import { reports } from '../data'

export default function PreviewRelatorio() {
  const r = reports[0]

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Link to="/relatorios" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy">
          <Icon name="back" className="w-4 h-4" />
          Voltar a relatórios
        </Link>
        <div className="flex gap-2">
          <button className="border border-line text-sm px-4 py-2 rounded font-medium hover:bg-surface transition-colors">
            Editar
          </button>
          <button className="bg-accent text-white text-sm px-4 py-2 rounded font-medium hover:bg-blue transition-colors">
            Exportar PDF
          </button>
        </div>
      </div>

      <Card className="p-6 md:p-8">
        <div className="flex items-start justify-between gap-4 flex-wrap pb-5 border-b border-line">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-accent text-white flex items-center justify-center">
              <Icon name="shield" className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold">CuCare — Hospital Central</div>
              <div className="text-xs text-muted">Av. 4 de Fevereiro, Luanda · +244 222 000 000</div>
            </div>
          </div>
          <div className="text-right text-sm">
            <div className="font-medium">{r.n}</div>
            <div className="text-muted text-xs">{r.date}</div>
            <div className="mt-1"><Badge>{r.status}</Badge></div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 py-5 border-b border-line text-sm">
          <div><span className="text-muted">Paciente: </span><span className="font-medium">{r.patient}</span></div>
          <div><span className="text-muted">Tipo: </span>{r.type}</div>
          <div><span className="text-muted">Profissional: </span>{r.prof}</div>
          <div><span className="text-muted">Data: </span>{r.date}</div>
        </div>

        <div className="py-5 space-y-4">
          <div>
            <h2 className="font-semibold mb-2">Resumo clínico</h2>
            <p className="text-sm leading-relaxed text-navy/90">
              Paciente observado na consulta de rotina. Quadro clínico estável, sem queixas relevantes.
              Sinais vitais dentro dos parâmetros normais. Recomenda-se manutenção do tratamento atual
              e reavaliação dentro de 30 dias.
            </p>
          </div>
          <div>
            <h2 className="font-semibold mb-2">Observações</h2>
            <p className="text-sm leading-relaxed text-navy/90">
              O paciente refere boa adesão à medicação. Sem efeitos secundários reportados.
              Exames laboratoriais anteriores dentro da normalidade.
            </p>
          </div>
        </div>

        <div className="pt-5 border-t border-line flex items-end justify-between">
          <div className="text-xs text-muted">
            <div>Documento gerado eletronicamente</div>
            <div>CuCare — Sistema de Gestão Clínica</div>
          </div>
          <div className="text-center">
            <div className="w-40 border-b border-muted mb-1" />
            <div className="text-xs text-muted">{r.prof}</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
