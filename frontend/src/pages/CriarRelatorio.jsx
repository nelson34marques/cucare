import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { api } from '../lib/api'
import useResource from '../hooks/useResource'
import { RELATORIO_TIPOS } from '../lib/enums'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import Icon from '../components/Icon'
import { Skeleton, LoadingBlock, FieldError } from '../components/States'
import { useToast } from '../components/Toast'

const PASSOS = ['Paciente', 'Conteúdo', 'Revisão']

const RESUMO_MINIMO = 10

const vazio = { pacienteId: '', tipo: 'Geral', profissionalId: '', resumo: '', notas: '' }

export default function CriarRelatorio() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const toast = useToast()
  const emEdicao = Boolean(id)

  const [passo, setPasso] = useState(1)
  const [form, setForm] = useState(vazio)
  const [erros, setErros] = useState({})
  const [erroGeral, setErroGeral] = useState(null)
  const [submetendo, setSubmetendo] = useState(false)
  const [carregandoRelatorio, setCarregandoRelatorio] = useState(emEdicao)

  const pacientes = useResource(
    () => api.listPacientes({ pageSize: 100 }),
    [],
    { initialData: { items: [] } },
  )
  const profissionais = useResource(
    () => api.listProfissionais({ estado: 'Ativo' }),
    [],
    { initialData: { items: [] } },
  )
  const relatorio = useResource(() => api.getRelatorio({ id }), [id], {
    enabled: emEdicao,
  })

  useEffect(() => {
    if (emEdicao && relatorio.data) {
      const r = relatorio.data
      setForm({
        pacienteId: r.pacienteId,
        tipo: r.tipo,
        profissionalId: r.profissionalId,
        resumo: r.resumo ?? '',
        notas: r.notas ?? '',
      })
    }
    if (emEdicao && !relatorio.loading) setCarregandoRelatorio(false)
  }, [relatorio.data, relatorio.loading, emEdicao])

  useEffect(() => {
    const paciente = searchParams.get('paciente')
    if (paciente && !emEdicao) {
      setForm((f) => ({ ...f, pacienteId: paciente }))
    }
  }, [searchParams, emEdicao])

  const set = (campo) => (e) => {
    setForm({ ...form, [campo]: e.target.value })
    setErros((atual) => ({ ...atual, [campo]: undefined }))
  }

  const listaPacientes = useMemo(
    () => (pacientes.data?.items ?? []).filter((p) => p.estado === 'Ativo'),
    [pacientes.data],
  )
  const listaProfissionais = profissionais.data?.items ?? []

  function collectErrors(alvo) {
    const found = {}
    if (alvo >= 1) {
      if (!form.pacienteId) found.pacienteId = 'Selecione um paciente.'
      if (!form.tipo) found.tipo = 'Selecione o tipo de relatório.'
      if (!form.profissionalId) found.profissionalId = 'Selecione o profissional responsável.'
    }
    if (alvo >= 2) {
      if (!form.resumo.trim()) found.resumo = 'Descreva o resumo clínico.'
      else if (form.resumo.trim().length < RESUMO_MINIMO) {
        found.resumo = `O resumo clínico deve ter pelo menos ${RESUMO_MINIMO} caracteres.`
      }
    }
    return found
  }

  function advancing() {
    const found = collectErrors(passo)
    setErros(found)
    if (Object.keys(found).length) return
    setPasso((p) => Math.min(3, p + 1))
  }

  async function onSubmit() {
    const found = collectErrors(3)
    if (Object.keys(found).length) {
      setErros(found)
      setPasso(Object.keys(collectErrors(1)).length ? 1 : 2)
      return
    }
    setSubmetendo(true)
    setErroGeral(null)
    try {
      const payload = {
        pacienteId: form.pacienteId,
        tipo: form.tipo,
        profissionalId: form.profissionalId,
        resumo: form.resumo,
        notas: form.notas,
      }
      const resultado = emEdicao
        ? await api.updateRelatorio({ id, ...payload })
        : await api.createRelatorio(payload)
      toast(emEdicao ? 'Relatório actualizado' : 'Relatório criado com sucesso')
      navigate(`/relatorios/${resultado.id}`)
    } catch (err) {
      setErroGeral(err.message)
      if (err.details) setErros(err.details)
    } finally {
      setSubmetendo(false)
    }
  }

  const nomePaciente = listaPacientes.find((p) => p.id === form.pacienteId)?.nome
  const nomeProfissional = listaProfissionais.find((p) => p.id === form.profissionalId)?.nomeCompleto

  if (relatorio.error) {
    return (
      <div className="max-w-2xl">
        <Card className="p-6 text-center">
          <p className="text-sm text-bad">{relatorio.error.message}</p>
          <button
            onClick={() => navigate('/relatorios')}
            className="mt-4 border border-line text-sm px-4 py-2 rounded font-medium hover:bg-surface"
          >
            Voltar a relatórios
          </button>
        </Card>
      </div>
    )
  }

  if (carregandoRelatorio) {
    return (
      <div className="max-w-2xl">
        <Card>
          <LoadingBlock label="A carregar relatório…" />
        </Card>
      </div>
    )
  }

  const dependentesCarregando = pacientes.loading || profissionais.loading

  return (
    <div className="space-y-4 max-w-2xl">
      <PageHeader
        title={emEdicao ? 'Editar relatório' : 'Criar relatório'}
        subtitle={`Passo ${passo} de 3 — ${PASSOS[passo - 1]}`}
      />

      <div className="flex items-center gap-2">
        {PASSOS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                passo > i + 1 ? 'bg-ok text-white' : passo === i + 1 ? 'bg-accent text-white' : 'bg-line text-muted'
              }`}
            >
              {passo > i + 1 ? <Icon name="check" className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span className={`text-xs hidden sm:block ${passo === i + 1 ? 'font-medium' : 'text-muted'}`}>
              {s}
            </span>
            {i < PASSOS.length - 1 && <div className={`flex-1 h-px ${passo > i + 1 ? 'bg-ok' : 'bg-line'}`} />}
          </div>
        ))}
      </div>

      {erroGeral && (
        <div
          role="alert"
          className="flex items-start gap-2 bg-red-100 text-bad text-xs px-3 py-2.5 rounded"
        >
          <Icon name="alert" className="w-4 h-4 shrink-0 mt-px" />
          <span>{erroGeral}</span>
        </div>
      )}

      <Card className="p-5">
        {dependentesCarregando ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {passo === 1 && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="paciente" className="block text-xs font-medium text-muted mb-1">
                    Paciente
                  </label>
                  <select
                    id="paciente"
                    value={form.pacienteId}
                    onChange={set('pacienteId')}
                    className="w-full border border-line rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                  >
                    <option value="">Selecionar paciente...</option>
                    {listaPacientes.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nome} ({p.id})
                      </option>
                    ))}
                  </select>
                  <FieldError>{erros.pacienteId}</FieldError>
                </div>

                <div>
                  <label htmlFor="tipo" className="block text-xs font-medium text-muted mb-1">
                    Tipo de relatório
                  </label>
                  <select
                    id="tipo"
                    value={form.tipo}
                    onChange={set('tipo')}
                    className="w-full border border-line rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                  >
                    {RELATORIO_TIPOS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <FieldError>{erros.tipo}</FieldError>
                </div>

                <div>
                  <label
                    htmlFor="profissional"
                    className="block text-xs font-medium text-muted mb-1"
                  >
                    Profissional responsável
                  </label>
                  <select
                    id="profissional"
                    value={form.profissionalId}
                    onChange={set('profissionalId')}
                    className="w-full border border-line rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                  >
                    <option value="">Selecionar profissional...</option>
                    {listaProfissionais.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nomeCompleto} — {p.especialidade}
                      </option>
                    ))}
                  </select>
                  <FieldError>{erros.profissionalId}</FieldError>
                </div>
              </div>
            )}

            {passo === 2 && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-baseline justify-between">
                    <label htmlFor="resumo" className="block text-xs font-medium text-muted">
                      Resumo clínico
                    </label>
                    <span className="text-[11px] text-muted">
                      {form.resumo.trim().length} caracteres
                    </span>
                  </div>
                  <textarea
                    id="resumo"
                    value={form.resumo}
                    onChange={set('resumo')}
                    rows={5}
                    placeholder="Descreva o quadro clínico, observações e conclusões..."
                    className="w-full border border-line rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                  <FieldError>{erros.resumo}</FieldError>
                </div>

                <div>
                  <label htmlFor="notas" className="block text-xs font-medium text-muted mb-1">
                    Notas adicionais
                  </label>
                  <textarea
                    id="notas"
                    value={form.notas}
                    onChange={set('notas')}
                    rows={3}
                    placeholder="Notas, recomendações, seguimento..."
                    className="w-full border border-line rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
              </div>
            )}

            {passo === 3 && (
              <div className="space-y-3">
                <h2 className="font-semibold">Revisão do relatório</h2>
                <dl className="text-sm divide-y divide-line">
                  <div className="flex justify-between py-2.5 gap-4">
                    <dt className="text-muted">Paciente</dt>
                    <dd className="font-medium text-right">
                      {nomePaciente ? `${nomePaciente} (${form.pacienteId})` : '—'}
                    </dd>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <dt className="text-muted">Tipo</dt>
                    <dd>{form.tipo}</dd>
                  </div>
                  <div className="flex justify-between py-2.5 gap-4">
                    <dt className="text-muted">Profissional</dt>
                    <dd className="text-right">{nomeProfissional || '—'}</dd>
                  </div>
                  <div className="py-2.5">
                    <dt className="text-muted mb-1">Resumo</dt>
                    <dd className="whitespace-pre-wrap">{form.resumo || '—'}</dd>
                  </div>
                  {form.notas && (
                    <div className="py-2.5">
                      <dt className="text-muted mb-1">Notas</dt>
                      <dd className="whitespace-pre-wrap">{form.notas}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </>
        )}
      </Card>

      <div className="flex justify-between">
        <button
          onClick={() => (passo === 1 ? navigate(-1) : setPasso(passo - 1))}
          disabled={submetendo}
          className="text-sm text-muted hover:text-navy flex items-center gap-1.5 px-4 py-2 disabled:opacity-50"
        >
          <Icon name="back" className="w-4 h-4" />
          {passo === 1 ? 'Cancelar' : 'Anterior'}
        </button>

        {passo < 3 ? (
          <button
            onClick={advancing}
            disabled={dependentesCarregando}
            className="bg-accent text-white text-sm px-4 py-2 rounded font-medium hover:bg-blue transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Seguinte
          </button>
        ) : (
          <button
            onClick={onSubmit}
            disabled={submetendo || dependentesCarregando}
            className="bg-ok text-white text-sm px-4 py-2 rounded font-medium hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submetendo && (
              <span className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            )}
            {emEdicao ? 'Guardar alterações' : 'Finalizar relatório'}
          </button>
        )}
      </div>
    </div>
  )
}