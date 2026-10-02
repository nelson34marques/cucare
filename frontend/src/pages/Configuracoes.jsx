import { useState } from 'react'
import Card from '../components/Card'
import Icon from '../components/Icon'
import { useToast } from '../components/Toast'

function Toggle({ label, description, defaultOn = false }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-xs text-muted">{description}</div>
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`w-10 h-5.5 rounded-full relative transition-colors ${on ? 'bg-accent' : 'bg-line'}`}
        aria-pressed={on}
      >
        <span className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-all ${on ? 'left-5' : 'left-0.5'}`} />
      </button>
    </div>
  )
}

export default function Configuracoes() {
  const toast = useToast()

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold">Configurações</h1>
        <p className="text-muted text-xs mt-0.5">Preferências da conta e do sistema</p>
      </div>

      <Card className="p-5">
        <h2 className="font-semibold mb-1">Perfil</h2>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Nome</label>
            <input className="w-full border border-line rounded px-3 py-2 text-sm" defaultValue="Carlos Mendes" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Email</label>
            <input className="w-full border border-line rounded px-3 py-2 text-sm" defaultValue="carlos.mendes@hospital.ao" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Especialidade</label>
            <input className="w-full border border-line rounded px-3 py-2 text-sm" defaultValue="Clínica Geral" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Registro profissional</label>
            <input className="w-full border border-line rounded px-3 py-2 text-sm" defaultValue="Reg. 4821" />
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="font-semibold mb-1">Notificações</h2>
        <div className="divide-y divide-line">
          <Toggle label="Novos relatórios" description="Notificar quando um relatório for finalizado" defaultOn />
          <Toggle label="Exames pendentes" description="Alertas de exames por validar" defaultOn />
          <Toggle label="Email semanal" description="Resumo semanal de atividade" />
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="font-semibold mb-1">Segurança</h2>
        <div className="divide-y divide-line">
          <Toggle label="Autenticação de dois fatores" description="Proteção extra no início de sessão" />
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="font-medium">Palavra-passe</div>
              <div className="text-xs text-muted">Alterar palavra-passe</div>
            </div>
            <button className="text-sm text-accent">Alterar</button>
          </div>
        </div>
      </Card>

      <button
        onClick={() => toast('Configurações guardadas')}
        className="bg-accent text-white text-sm px-4 py-2 rounded font-medium hover:bg-blue transition-colors flex items-center gap-2"
      >
        <Icon name="settings" className="w-4 h-4" />
        Guardar alterações
      </button>
    </div>
  )
}
