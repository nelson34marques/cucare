export const statusColor = (s) =>
  ({
    Ativo: 'bg-green-100 text-ok',
    Inativo: 'bg-slate-100 text-muted',
    Finalizado: 'bg-green-100 text-ok',
    Rascunho: 'bg-slate-100 text-muted',
    'Em revisão': 'bg-amber-100 text-warn',
    Corrigido: 'bg-blue-100 text-accent',
    Validado: 'bg-green-100 text-ok',
    Ativa: 'bg-green-100 text-ok',
    Concluída: 'bg-blue-100 text-accent',
    Cancelada: 'bg-red-100 text-bad',
    Sucesso: 'bg-green-100 text-ok',
    Falha: 'bg-red-100 text-bad',
    'Resultado disponível': 'bg-blue-100 text-accent',
    Realizado: 'bg-green-100 text-ok',
    Solicitado: 'bg-amber-100 text-warn',
    Pendente: 'bg-amber-100 text-warn',
  })[s] || 'bg-slate-100 text-muted'

export const RELATORIO_TIPOS = ['Geral', 'Consulta', 'Exame', 'Alta', 'Acompanhamento']

export const RELATORIO_ESTADOS = ['Rascunho', 'Em revisão', 'Corrigido', 'Finalizado']

export const EXAME_ESTADOS = ['Solicitado', 'Realizado', 'Resultado disponível', 'Validado']

export const EXAME_DEPARTAMENTOS = ['Laboratório', 'Radiologia', 'Ecografia', 'Cardiologia']

export const PRESCRICAO_ESTADOS = ['Ativa', 'Concluída', 'Cancelada']

export const DOCUMENTO_TIPOS = ['Relatório', 'Exame', 'Receita', 'Declaração', 'Imagem']

export const DOCUMENTO_ESTADOS = ['Ativo', 'Validado']

export const PACIENTE_ESTADOS = ['Ativo', 'Inativo']

export const PROFISSIONAL_ESTADOS = ['Ativo', 'Inativo']

export const SEXOS = ['M', 'F']