import { USE_MOCK, API_BASE } from './env'
import { mockApi } from './mock-server'
import { request } from './api-client'

function descarregar(url, nome) {
  const a = document.createElement('a')
  a.href = url
  a.download = nome
  document.body.appendChild(a)
  a.click()
  a.remove()
}

function exportarRelatorioMock(relatorio) {
  const { instituicao, paciente, resumo, notas, profissional } = relatorio
  const corpo = `
<!doctype html>
<html lang="pt"><head><meta charset="utf-8">
<title>${relatorio.id} — ${paciente?.nome ?? ''}</title>
<style>
  body{font-family:system-ui,sans-serif;color:#0F2A4A;margin:40px;line-height:1.6}
  header{border-bottom:1px solid #E2E8F0;padding-bottom:16px;margin-bottom:24px}
  h1{font-size:18px;margin:0 0 4px}
  .muted{color:#64748B;font-size:12px}
  table{width:100%;border-collapse:collapse;margin-bottom:24px;font-size:13px}
  td{padding:6px 0;border-bottom:1px solid #F5F7FA}
  td:first-child{color:#64748B;width:160px}
  footer{border-top:1px solid #E2E8F0;padding-top:16px;margin-top:24px;font-size:11px;color:#64748B}
  .assinatura{margin-top:48px;text-align:center;width:260px;margin-left:auto}
  .assinatura div:first-child{border-bottom:1px solid #64748B;margin-bottom:4px}
</style></head><body>
<header>
  <h1>${instituicao.nome}</h1>
  <div class="muted">${instituicao.morada} · ${instituicao.telefone}</div>
</header>
<table>
  <tr><td>Relatório</td><td>${relatorio.id}</td></tr>
  <tr><td>Paciente</td><td>${paciente?.nome ?? '—'} (${paciente?.id ?? '—'})</td></tr>
  <tr><td>Tipo</td><td>${relatorio.tipo}</td></tr>
  <tr><td>Profissional</td><td>${profissional ? `${profissional.honorifico} ${profissional.nome}` : '—'}</td></tr>
  <tr><td>Data</td><td>${relatorio.data}</td></tr>
  <tr><td>Estado</td><td>${relatorio.estado}</td></tr>
</table>
<h2>Resumo clínico</h2><p>${resumo || '—'}</p>
${notas ? `<h2>Observações</h2><p>${notas}</p>` : ''}
<div class="assinatura"><div></div>${profissional ? `${profissional.honorifico} ${profissional.nome}` : ''}</div>
<footer>Documento gerado eletronicamente · ${instituicao.sistema}</footer>
</body></html>`

  const url = URL.createObjectURL(new Blob([corpo], { type: 'text/html;charset=utf-8' }))
  descarregar(url, `relatorio-${relatorio.id}.html`)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

const realApi = {
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me'),
  updatePerfil: (patch) => request('/auth/me', { method: 'PATCH', body: patch }),
  changePassword: (payload) => request('/auth/change-password', { method: 'POST', body: payload }),
  forgotPassword: (payload) => request('/auth/forgot-password', { method: 'POST', body: payload }),

  getPreferencias: () => request('/utilizador/preferencias'),
  updatePreferencias: (patch) =>
    request('/utilizador/preferencias', { method: 'PATCH', body: patch }),
  getInstituicao: () => request('/instituicao'),

  getDashboardResumo: () => request('/dashboard/resumo'),

  listPacientes: (params) => request('/pacientes', { params }),
  getPaciente: ({ id }) => request(`/pacientes/${id}`),
  createPaciente: (payload) => request('/pacientes', { method: 'POST', body: payload }),
  updatePaciente: ({ id, ...patch }) => request(`/pacientes/${id}`, { method: 'PATCH', body: patch }),

  listRelatorios: (params) => request('/relatorios', { params }),
  getRelatorio: ({ id }) => request(`/relatorios/${id}`),
  createRelatorio: (payload) => request('/relatorios', { method: 'POST', body: payload }),
  updateRelatorio: ({ id, ...patch }) => request(`/relatorios/${id}`, { method: 'PATCH', body: patch }),
  setRelatorioEstado: ({ id, estado }) =>
    request(`/relatorios/${id}/estado`, { method: 'POST', body: { estado } }),
  relatorioPdfUrl: ({ id }) => `${API_BASE}/relatorios/${id}/pdf`,

  listExames: (params) => request('/exames', { params }),
  createExame: (payload) => request('/exames', { method: 'POST', body: payload }),

  listPrescricoes: (params) => request('/prescricoes', { params }),
  createPrescricao: (payload) => request('/prescricoes', { method: 'POST', body: payload }),
  setPrescricaoEstado: ({ id, estado }) =>
    request(`/prescricoes/${id}/estado`, { method: 'POST', body: { estado } }),

  listDocumentos: (params) => request('/documentos', { params }),
  createDocumento: (payload) => request('/documentos', { method: 'POST', body: payload }),
  uploadDocumento: ({ ficheiro, pacienteId, tipo }) => {
    const data = new FormData()
    data.append('ficheiro', ficheiro)
    data.append('pacienteId', pacienteId)
    data.append('tipo', tipo)
    return request('/documentos', { method: 'POST', body: data })
  },
  deleteDocumento: ({ id }) => request(`/documentos/${id}`, { method: 'DELETE' }),

  listProfissionais: (params) => request('/profissionais', { params }),
  updateProfissional: ({ id, ...patch }) =>
    request(`/profissionais/${id}`, { method: 'PATCH', body: patch }),

  listAuditoria: (params) => request('/auditoria', { params }),

  listNotificacoes: (params) => request('/notificacoes', { params }),
  markNotificacaoLida: ({ id }) => request(`/notificacoes/${id}/ler`, { method: 'POST' }),
  markTodasNotificacoesLidas: () => request('/notificacoes/ler-todas', { method: 'POST' }),

  globalSearch: (params) => request('/pesquisa', { params }),
}

export const api = USE_MOCK ? mockApi : realApi

if (USE_MOCK) {
  api.exportRelatorio = ({ id }) =>
    api.getRelatorio({ id }).then((relatorio) => exportarRelatorioMock(relatorio))
} else {
  api.exportRelatorio = async ({ id }) => {
    const url = `${API_BASE}/relatorios/${id}/pdf`
    const res = await fetch(url, { credentials: 'include' })
    if (!res.ok) throw new Error('Não foi possível gerar o PDF do relatório.')
    const blob = await res.blob()
    const objectUrl = URL.createObjectURL(blob)
    descarregar(objectUrl, `relatorio-${id}.pdf`)
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
  }
}

export { ApiError } from './api-client'