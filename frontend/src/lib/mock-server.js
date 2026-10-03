import * as seed from '../data'
import { ApiError } from './api-client'
import { todayISO, toDate } from './format'
import {
  RELATORIO_TIPOS,
  RELATORIO_ESTADOS,
  PRESCRICAO_ESTADOS,
  EXAME_ESTADOS,
  PACIENTE_ESTADOS,
} from './enums'

const SEED_ANCHOR = '2025-04-26'

// O dataset de seed tem datas fixas de 2025. Para o mock reflectir um sistema "vivo",
// deslocamos todas as datas mantendo o intervalo relativo entre registos.
const dayDelta = Math.round(
  (toDate(todayISO()).getTime() - toDate(SEED_ANCHOR).getTime()) / 86400000,
)

function shiftDate(value) {
  const d = toDate(value)
  if (!d) return value
  const shifted = new Date(d.getTime() + dayDelta * 86400000)
  const pad = (n) => String(n).padStart(2, '0')
  return `${shifted.getFullYear()}-${pad(shifted.getMonth() + 1)}-${pad(shifted.getDate())}`
}

function shiftDateTime(value) {
  const d = toDate(value)
  if (!d) return value
  return new Date(d.getTime() + dayDelta * 86400000).toISOString()
}

function shiftRecord(record) {
  const out = { ...record }
  if (out.dataNascimento) return { ...out, dataNascimento: shiftDate(out.dataNascimento) }
  if (out.dataHora) return { ...out, dataHora: shiftDateTime(out.dataHora) }
  if (out.data) return { ...out, data: shiftDate(out.data) }
  return out
}

const db = {
  pacientes: seed.pacientes.map(shiftRecord),
  profissionais: seed.profissionais.map(shiftRecord),
  relatorios: seed.relatorios.map(shiftRecord),
  exames: seed.exames.map(shiftRecord),
  prescricoes: seed.prescricoes.map(shiftRecord),
  documentos: seed.documentos.map(shiftRecord),
  auditoria: seed.auditoria.map(shiftRecord),
  notificacoes: [],
  preferencias: { ...seed.preferencias },
  instituicao: { ...seed.instituicao },
  password: 'demo1234',
}

const minutesAgo = (m) => new Date(Date.now() - m * 60000).toISOString()
db.notificacoes = seed.notificacoes.map((n, i) => ({
  ...n,
  id: `N-000${i + 1}`,
  dataHora: minutesAgo([12, 300, 1500][i] ?? 60),
}))

let user = { ...seed.currentUser }

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const read = () => wait(200 + Math.random() * 260)
const write = () => wait(140 + Math.random() * 160)

const contains = (haystack, needle) =>
  String(haystack || '').toLowerCase().includes(String(needle).toLowerCase())

function paginate(items, { page = 1, pageSize = 20 } = {}) {
  const current = Math.max(1, Number(page) || 1)
  const size = Math.max(1, Number(pageSize) || 20)
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / size))
  const start = (current - 1) * size
  return {
    items: items.slice(start, start + size),
    total,
    page: Math.min(current, totalPages),
    pageSize: size,
    totalPages,
  }
}

const pacienteById = (id) => db.pacientes.find((p) => p.id === id)
const profissionalById = (id) => db.profissionais.find((p) => p.id === id)

function comPaciente(record) {
  const p = pacienteById(record.pacienteId)
  return { ...record, pacienteNome: p?.nome ?? '—' }
}

function comProfissional(record) {
  const pr = profissionalById(record.profissionalId)
  return {
    ...record,
    profissionalNome: pr ? `${pr.honorifico} ${pr.nome}` : '—',
  }
}

function comUtilizador(record) {
  const u = profissionalById(record.utilizadorId)
  return {
    ...record,
    utilizadorNome: u ? `${u.honorifico} ${u.nome}` : 'Sistema',
  }
}

function notFound(recurso) {
  return new ApiError(`${recurso} não encontrado.`, { status: 404, code: 'not_found' })
}

function nextId(prefix, list) {
  const max = list.reduce((acc, item) => {
    const n = Number(String(item.id).split('-')[1])
    return Number.isFinite(n) ? Math.max(acc, n) : acc
  }, 0)
  return `${prefix}-${String(max + 1).padStart(4, '0')}`
}

function registarAuditoria(acao, entidade, referencia, pacienteId = null, resultado = 'Sucesso') {
  db.auditoria.unshift({
    id: nextId('AUD', db.auditoria),
    dataHora: new Date().toISOString(),
    utilizadorId: 'PR-0001',
    acao,
    entidade,
    referencia,
    pacienteId,
    resultado,
  })
}

function validar(payload, campos) {
  const details = {}
  for (const [campo, mensagem] of Object.entries(campos)) {
    const valor = payload?.[campo]
    if (valor === undefined || valor === null || String(valor).trim() === '') {
      details[campo] = mensagem
    }
  }
  if (Object.keys(details).length) {
    throw new ApiError('Existem campos obrigatórios por preencher.', {
      status: 422,
      code: 'validation_error',
      details,
    })
  }
}

export const mockApi = {
  async login({ email, password }) {
    await read()
    if (email !== user.email || password !== db.password) {
      throw new ApiError('Email ou palavra-passe incorretos.', {
        status: 401,
        code: 'invalid_credentials',
      })
    }
    registarAuditoria('Iniciou sessão', 'Utilizador', user.id)
    return { user }
  },

  async logout() {
    await write()
    registarAuditoria('Terminou sessão', 'Utilizador', user.id)
    return { ok: true }
  },

  async forgotPassword({ email }) {
    await read()
    // Nunca revelamos se a conta existe — comportamento de segurança esperado em produção.
    if (contains(email, '@')) {
      registarAuditoria('Pediu recuperação de senha', 'Utilizador', user.id, null, 'Sucesso')
    }
    return { ok: true }
  },

  async me() {
    await read()
    return user
  },

  async updatePerfil(patch) {
    await write()
    Object.assign(user, patch)
    registarAuditoria('Editou perfil', 'Utilizador', user.id)
    return user
  },

  async changePassword({ atual, nova }) {
    await write()
    if (atual !== db.password) {
      throw new ApiError('Palavra-passe atual incorreta.', {
        status: 422,
        code: 'validation_error',
        details: { atual: 'Palavra-passe atual incorreta.' },
      })
    }
    if (!nova || String(nova).length < 8) {
      throw new ApiError('A nova palavra-passe é demasiado curta.', {
        status: 422,
        code: 'validation_error',
        details: { nova: 'Use pelo menos 8 caracteres.' },
      })
    }
    db.password = nova
    registarAuditoria('Alterou palavra-passe', 'Utilizador', user.id)
    return { ok: true }
  },

  async getPreferencias() {
    await read()
    return db.preferencias
  },

  async updatePreferencias(patch) {
    await write()
    Object.assign(db.preferencias, patch)
    return db.preferencias
  },

  async getInstituicao() {
    await read()
    return db.instituicao
  },

  async getDashboardResumo() {
    await read()
    const inicioMes = todayISO().slice(0, 7)
    return {
      pacientesAtivos: db.pacientes.filter((p) => p.estado === 'Ativo').length,
      relatoriosMes: db.relatorios.filter((r) => r.data.startsWith(inicioMes)).length,
      examesPendentes: db.exames.filter((e) => e.estado !== 'Validado').length,
      prescricoesAtivas: db.prescricoes.filter((p) => p.estado === 'Ativa').length,
      relatoriosRecentes: db.relatorios.slice(0, 4).map(comPaciente),
      atividadeRecente: db.auditoria.slice(0, 5).map(comUtilizador),
      pacientesRecentes: db.pacientes.slice(0, 5),
    }
  },

  async listPacientes({ q, estado, page, pageSize } = {}) {
    await read()
    let items = db.pacientes
    if (q) {
      items = items.filter((p) => contains(p.nome, q) || contains(p.id, q))
    }
    if (estado) items = items.filter((p) => p.estado === estado)
    return paginate(items, { page, pageSize })
  },

  async getPaciente({ id }) {
    await read()
    const paciente = pacienteById(id)
    if (!paciente) throw notFound('Paciente')
    return {
      ...paciente,
      totais: {
        relatorios: db.relatorios.filter((r) => r.pacienteId === id).length,
        exames: db.exames.filter((e) => e.pacienteId === id).length,
        prescricoes: db.prescricoes.filter((p) => p.pacienteId === id).length,
        documentos: db.documentos.filter((d) => d.pacienteId === id).length,
      },
    }
  },

  async createPaciente(payload) {
    validar(payload, {
      nome: 'Indique o nome do paciente.',
      dataNascimento: 'Indique a data de nascimento.',
      sexo: 'Indique o sexo.',
    })
    if (pacienteById(payload.id)) {
      throw new ApiError('Já existe um paciente com este identificador.', {
        status: 409,
        code: 'conflict',
      })
    }
    await write()
    const novo = {
      id: payload.id || nextId('P', db.pacientes),
      nome: payload.nome.trim(),
      dataNascimento: payload.dataNascimento,
      sexo: payload.sexo,
      ultimaVisita: null,
      estado: PACIENTE_ESTADOS.includes(payload.estado) ? payload.estado : 'Ativo',
    }
    db.pacientes.unshift(novo)
    registarAuditoria('Criou paciente', 'Paciente', novo.id, novo.id)
    return novo
  },

  async updatePaciente({ id, ...patch }) {
    await read()
    const paciente = pacienteById(id)
    if (!paciente) throw notFound('Paciente')
    await write()
    Object.assign(paciente, patch)
    registarAuditoria('Editou paciente', 'Paciente', id, id)
    return paciente
  },

  async listRelatorios({ q, estado, pacienteId, page, pageSize } = {}) {
    await read()
    let items = db.relatorios
    if (q) items = items.filter((r) => contains(r.id, q) || contains(pacienteById(r.pacienteId)?.nome, q))
    if (estado) items = items.filter((r) => r.estado === estado)
    if (pacienteId) items = items.filter((r) => r.pacienteId === pacienteId)
    return paginate(items.map(comProfissional).map(comPaciente), { page, pageSize })
  },

  async getRelatorio({ id }) {
    await read()
    const relatorio = db.relatorios.find((r) => r.id === id)
    if (!relatorio) throw notFound('Relatório')
    return {
      ...comProfissional(relatorio),
      ...comPaciente(relatorio),
      paciente: pacienteById(relatorio.pacienteId) ?? null,
      profissional: profissionalById(relatorio.profissionalId) ?? null,
      instituicao: db.instituicao,
    }
  },

  async createRelatorio(payload) {
    validar(payload, {
      pacienteId: 'Selecione um paciente.',
      profissionalId: 'Selecione um profissional responsável.',
      resumo: 'Descreva o resumo clínico.',
    })
    if (!RELATORIO_TIPOS.includes(payload.tipo)) {
      throw new ApiError('Tipo de relatório inválido.', {
        status: 422,
        code: 'validation_error',
        details: { tipo: 'Tipo de relatório inválido.' },
      })
    }
    if (!pacienteById(payload.pacienteId)) throw notFound('Paciente')
    if (!profissionalById(payload.profissionalId)) throw notFound('Profissional')
    await write()
    const novo = {
      id: nextId('R', db.relatorios),
      pacienteId: payload.pacienteId,
      tipo: payload.tipo,
      profissionalId: payload.profissionalId,
      data: todayISO(),
      estado: 'Rascunho',
      resumo: payload.resumo.trim(),
      notas: payload.notas?.trim() || '',
    }
    db.relatorios.unshift(novo)
    registarAuditoria('Criou relatório', 'Relatório', novo.id, novo.pacienteId)
    return novo
  },

  async updateRelatorio({ id, ...patch }) {
    await read()
    const relatorio = db.relatorios.find((r) => r.id === id)
    if (!relatorio) throw notFound('Relatório')
    await write()
    Object.assign(relatorio, patch)
    registarAuditoria('Editou relatório', 'Relatório', id, relatorio.pacienteId)
    return comProfissional(relatorio)
  },

  async setRelatorioEstado({ id, estado }) {
    if (!RELATORIO_ESTADOS.includes(estado)) {
      throw new ApiError('Estado inválido.', {
        status: 422,
        code: 'validation_error',
        details: { estado: 'Estado inválido.' },
      })
    }
    await read()
    const relatorio = db.relatorios.find((r) => r.id === id)
    if (!relatorio) throw notFound('Relatório')
    await write()
    relatorio.estado = estado
    registarAuditoria('Alterou estado de relatório', 'Relatório', id, relatorio.pacienteId)
    return relatorio
  },

  async listExames({ pacienteId, estado, departamento, page, pageSize } = {}) {
    await read()
    let items = db.exames
    if (pacienteId) items = items.filter((e) => e.pacienteId === pacienteId)
    if (estado) items = items.filter((e) => e.estado === estado)
    if (departamento) items = items.filter((e) => e.departamento === departamento)
    return paginate(items.map(comProfissional).map(comPaciente), { page, pageSize })
  },

  async createExame(payload) {
    validar(payload, {
      pacienteId: 'Selecione um paciente.',
      nome: 'Indique o exame.',
      departamento: 'Selecione o departamento.',
    })
    if (!EXAME_ESTADOS.includes(payload.estado || 'Solicitado')) {
      throw new ApiError('Estado inválido.', {
        status: 422,
        code: 'validation_error',
        details: { estado: 'Estado inválido.' },
      })
    }
    if (!pacienteById(payload.pacienteId)) throw notFound('Paciente')
    await write()
    const novo = {
      id: nextId('EX', db.exames),
      pacienteId: payload.pacienteId,
      nome: payload.nome.trim(),
      departamento: payload.departamento,
      data: todayISO(),
      profissionalId: payload.profissionalId || null,
      estado: payload.estado || 'Solicitado',
    }
    db.exames.unshift(novo)
    registarAuditoria('Criou exame', 'Exame', novo.id, novo.pacienteId)
    return comPaciente(novo)
  },

  async listPrescricoes({ pacienteId, estado, page, pageSize } = {}) {
    await read()
    let items = db.prescricoes
    if (pacienteId) items = items.filter((p) => p.pacienteId === pacienteId)
    if (estado) items = items.filter((p) => p.estado === estado)
    return paginate(items.map(comProfissional).map(comPaciente), { page, pageSize })
  },

  async createPrescricao(payload) {
    validar(payload, {
      pacienteId: 'Selecione um paciente.',
      medicamento: 'Indique o medicamento.',
    })
    if (!PRESCRICAO_ESTADOS.includes(payload.estado || 'Ativa')) {
      throw new ApiError('Estado inválido.', {
        status: 422,
        code: 'validation_error',
        details: { estado: 'Estado inválido.' },
      })
    }
    if (!pacienteById(payload.pacienteId)) throw notFound('Paciente')
    await write()
    const nova = {
      id: nextId('PS', db.prescricoes),
      pacienteId: payload.pacienteId,
      medicamento: payload.medicamento.trim(),
      profissionalId: payload.profissionalId || null,
      data: todayISO(),
      estado: payload.estado || 'Ativa',
    }
    db.prescricoes.unshift(nova)
    registarAuditoria('Criou prescrição', 'Prescrição', nova.id, nova.pacienteId)
    return comPaciente(nova)
  },

  async setPrescricaoEstado({ id, estado }) {
    if (!PRESCRICAO_ESTADOS.includes(estado)) {
      throw new ApiError('Estado inválido.', {
        status: 422,
        code: 'validation_error',
        details: { estado: 'Estado inválido.' },
      })
    }
    await read()
    const prescricao = db.prescricoes.find((p) => p.id === id)
    if (!prescricao) throw notFound('Prescrição')
    await write()
    prescricao.estado = estado
    registarAuditoria('Alterou estado de prescrição', 'Prescrição', id, prescricao.pacienteId)
    return prescricao
  },

  async listDocumentos({ pacienteId, tipo, page, pageSize } = {}) {
    await read()
    let items = db.documentos
    if (pacienteId) items = items.filter((d) => d.pacienteId === pacienteId)
    if (tipo) items = items.filter((d) => d.tipo === tipo)
    return paginate(items.map(comPaciente), { page, pageSize })
  },

  async createDocumento(payload) {
    validar(payload, { nome: 'Indique o nome do ficheiro.', pacienteId: 'Selecione um paciente.' })
    await write()
    const novo = {
      id: nextId('DOC', db.documentos),
      nome: payload.nome,
      pacienteId: payload.pacienteId,
      tipo: payload.tipo || 'Relatório',
      tamanhoBytes: payload.tamanhoBytes || 0,
      data: todayISO(),
      estado: payload.estado || 'Ativo',
    }
    db.documentos.unshift(novo)
    registarAuditoria('Carregou documento', 'Documento', novo.id, novo.pacienteId)
    return comPaciente(novo)
  },

  async uploadDocumento({ ficheiro, pacienteId, tipo }) {
    validar({ nome: ficheiro?.name, pacienteId }, {
      nome: 'Seleccione um ficheiro.',
      pacienteId: 'Selecione um paciente.',
    })
    await write()
    const novo = {
      id: nextId('DOC', db.documentos),
      nome: ficheiro.name,
      pacienteId,
      tipo: tipo || 'Relatório',
      tamanhoBytes: ficheiro.size,
      data: todayISO(),
      estado: 'Ativo',
    }
    db.documentos.unshift(novo)
    registarAuditoria('Carregou documento', 'Documento', novo.id, novo.pacienteId)
    return comPaciente(novo)
  },

  async deleteDocumento({ id }) {
    await read()
    const index = db.documentos.findIndex((d) => d.id === id)
    if (index === -1) throw notFound('Documento')
    await write()
    const [removido] = db.documentos.splice(index, 1)
    registarAuditoria('Removeu documento', 'Documento', id, removido.pacienteId)
    return { ok: true }
  },

  async listProfissionais({ q, estado } = {}) {
    await read()
    let items = db.profissionais.map((p) => ({
      ...p,
      nomeCompleto: `${p.honorifico} ${p.nome}`,
    }))
    if (q) {
      items = items.filter(
        (p) => contains(p.nome, q) || contains(p.especialidade, q) || contains(p.registo, q),
      )
    }
    if (estado) items = items.filter((p) => p.estado === estado)
    return { items, total: items.length, page: 1, pageSize: items.length || 1, totalPages: 1 }
  },

  async updateProfissional({ id, ...patch }) {
    await read()
    const profissional = profissionalById(id)
    if (!profissional) throw notFound('Profissional')
    await write()
    Object.assign(profissional, patch)
    registarAuditoria('Editou profissional', 'Profissional', id)
    return { ...profissional, nomeCompleto: `${profissional.honorifico} ${profissional.nome}` }
  },

  async listAuditoria({ from, to, utilizadorId, resultado, page, pageSize } = {}) {
    await read()
    let items = db.auditoria.map(comUtilizador)
    if (utilizadorId) items = items.filter((a) => a.utilizadorId === utilizadorId)
    if (resultado) items = items.filter((a) => a.resultado === resultado)
    if (from) items = items.filter((a) => a.dataHora.slice(0, 10) >= from)
    if (to) items = items.filter((a) => a.dataHora.slice(0, 10) <= to)
    return paginate(items.map(comPaciente), { page, pageSize })
  },

  async listNotificacoes({ unreadOnly } = {}) {
    await read()
    const items = unreadOnly ? db.notificacoes.filter((n) => !n.lida) : db.notificacoes
    return {
      items,
      total: items.length,
      naoLidas: db.notificacoes.filter((n) => !n.lida).length,
      page: 1,
      pageSize: items.length || 1,
      totalPages: 1,
    }
  },

  async markNotificacaoLida({ id }) {
    await write()
    const notificacao = db.notificacoes.find((n) => n.id === id)
    if (!notificacao) throw notFound('Notificação')
    notificacao.lida = true
    return notificacao
  },

  async markTodasNotificacoesLidas() {
    await write()
    db.notificacoes.forEach((n) => {
      n.lida = true
    })
    return { ok: true }
  },

  async globalSearch({ q, limite = 6 } = {}) {
    await read()
    if (!q || !String(q).trim()) {
      return { pacientes: [], relatorios: [] }
    }
    const termo = String(q).trim()
    const pacientes = db.pacientes
      .filter((p) => contains(p.nome, termo) || contains(p.id, termo))
      .slice(0, limite)
    const relatorios = db.relatorios
      .filter((r) => contains(r.id, termo) || contains(pacienteById(r.pacienteId)?.nome, termo))
      .slice(0, limite)
      .map(comPaciente)
    return { pacientes, relatorios }
  },
}