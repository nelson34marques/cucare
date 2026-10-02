import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Icon from '../components/Icon'
import { useToast } from '../components/Toast'
import { patients, profissionais } from '../data'

const tipos = ['Geral', 'Consulta', 'Exame', 'Alta', 'Acompanhamento']

export default function CriarRelatorio() {
  const navigate = useNavigate()
  const toast = useToast()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ paciente: '', tipo: 'Geral', profissional: '', resumo: '', notas: '' })

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const steps = ['Paciente', 'Conteúdo', 'Revisão']

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold">Criar relatório</h1>
        <p className="text-muted text-xs mt-0.5">Passo {step} de 3 — {steps[step - 1]}</p>
      </div>

      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${step > i + 1 ? 'bg-ok text-white' : step === i + 1 ? 'bg-accent text-white' : 'bg-line text-muted'}`}>
              {step > i + 1 ? '✓' : i + 1}
            </div>
            <span className={`text-xs hidden sm:block ${step === i + 1 ? 'font-medium' : 'text-muted'}`}>{s}</span>
            {i < steps.length - 1 && <div className={`flex-1 h-px ${step > i + 1 ? 'bg-ok' : 'bg-line'}`} />}
          </div>
        ))}
      </div>

      <Card className="p-5">
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Paciente</label>
              <select value={form.paciente} onChange={set('paciente')} className="w-full border border-line rounded px-3 py-2 text-sm">
                <option value="">Selecionar paciente...</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.name}>{p.name} ({p.id})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Tipo de relatório</label>
              <select value={form.tipo} onChange={set('tipo')} className="w-full border border-line rounded px-3 py-2 text-sm">
                {tipos.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Profissional responsável</label>
              <select value={form.profissional} onChange={set('profissional')} className="w-full border border-line rounded px-3 py-2 text-sm">
                <option value="">Selecionar profissional...</option>
                {profissionais.filter((p) => p[4] === 'Ativo').map((p) => (
                  <option key={p[2]} value={p[0]}>{p[0]} — {p[1]}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Resumo clínico</label>
              <textarea value={form.resumo} onChange={set('resumo')} rows={5} placeholder="Descreva o quadro clínico, observações e conclusões..." className="w-full border border-line rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Notas adicionais</label>
              <textarea value={form.notas} onChange={set('notas')} rows={3} placeholder="Notas, recomendações, seguimento..." className="w-full border border-line rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40" />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <h2 className="font-semibold">Revisão do relatório</h2>
            <dl className="text-sm divide-y divide-line">
              <div className="flex justify-between py-2.5"><dt className="text-muted">Paciente</dt><dd className="font-medium">{form.paciente || '—'}</dd></div>
              <div className="flex justify-between py-2.5"><dt className="text-muted">Tipo</dt><dd>{form.tipo}</dd></div>
              <div className="flex justify-between py-2.5"><dt className="text-muted">Profissional</dt><dd>{form.profissional || '—'}</dd></div>
              <div className="py-2.5"><dt className="text-muted mb-1">Resumo</dt><dd className="whitespace-pre-wrap">{form.resumo || '—'}</dd></div>
              {form.notas && <div className="py-2.5"><dt className="text-muted mb-1">Notas</dt><dd className="whitespace-pre-wrap">{form.notas}</dd></div>}
            </dl>
          </div>
        )}
      </Card>

      <div className="flex justify-between">
        <button
          onClick={() => (step === 1 ? navigate('/relatorios') : setStep(step - 1))}
          className="text-sm text-muted hover:text-navy flex items-center gap-1.5 px-4 py-2"
        >
          <Icon name="back" className="w-4 h-4" />
          {step === 1 ? 'Cancelar' : 'Anterior'}
        </button>
        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="bg-accent text-white text-sm px-4 py-2 rounded font-medium hover:bg-blue transition-colors"
          >
            Seguinte
          </button>
        ) : (
          <button
            onClick={() => { toast('Relatório criado com sucesso'); navigate('/relatorios') }}
            className="bg-ok text-white text-sm px-4 py-2 rounded font-medium hover:opacity-90 transition-opacity"
          >
            Finalizar relatório
          </button>
        )}
      </div>
    </div>
  )
}
