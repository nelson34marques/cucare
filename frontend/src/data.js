export const currentUser = {
  id: 'U-0001',
  nome: 'Carlos Mendes',
  honorifico: 'Dr.',
  email: 'carlos.mendes@hospital.ao',
  especialidade: 'Clínica Geral',
  registoProfissional: 'Reg. 4821',
  perfil: 'medico',
}

export const instituicao = {
  nome: 'CuCare — Hospital Central',
  morada: 'Av. 4 de Fevereiro, Luanda',
  telefone: '+244 222 000 000',
  sistema: 'CuCare — Sistema de Gestão Clínica',
}

export const preferencias = {
  novosRelatorios: true,
  examesPendentes: true,
  emailSemanal: false,
  doisFatores: false,
}

export const pacientes = [
  { id: 'P-0001', nome: 'João Manuel Silva', dataNascimento: '1983-03-12', sexo: 'M', ultimaVisita: '2025-04-18', estado: 'Ativo' },
  { id: 'P-0002', nome: 'Ana Cristina Domingos', dataNascimento: '1990-07-23', sexo: 'F', ultimaVisita: '2025-04-16', estado: 'Ativo' },
  { id: 'P-0003', nome: 'Pedro António Cardoso', dataNascimento: '1982-11-05', sexo: 'M', ultimaVisita: '2025-04-10', estado: 'Ativo' },
  { id: 'P-0004', nome: 'Maria Isabel Santos', dataNascimento: '1977-08-19', sexo: 'F', ultimaVisita: '2025-04-09', estado: 'Ativo' },
  { id: 'P-0005', nome: 'José Ferreira', dataNascimento: '1975-01-03', sexo: 'M', ultimaVisita: '2025-04-05', estado: 'Inativo' },
  { id: 'P-0006', nome: 'Carla Mendes', dataNascimento: '1995-09-27', sexo: 'F', ultimaVisita: '2025-03-28', estado: 'Ativo' },
  { id: 'P-0007', nome: 'Luís Santos', dataNascimento: '1980-12-14', sexo: 'M', ultimaVisita: '2025-03-25', estado: 'Ativo' },
  { id: 'P-0008', nome: 'Helena Costa', dataNascimento: '1972-06-05', sexo: 'F', ultimaVisita: '2025-03-20', estado: 'Ativo' },
]

export const profissionais = [
  { id: 'PR-0001', nome: 'Carlos Mendes', honorifico: 'Dr.', especialidade: 'Clínica Geral', registo: 'Reg. 4821', departamento: 'Consultas Externas', estado: 'Ativo' },
  { id: 'PR-0002', nome: 'Ana Silva', honorifico: 'Dra.', especialidade: 'Pediatria', registo: 'Reg. 3390', departamento: 'Pediatria', estado: 'Ativo' },
  { id: 'PR-0003', nome: 'Luís Ferro', honorifico: 'Dr.', especialidade: 'Radiologia', registo: 'Reg. 5512', departamento: 'Imagiologia', estado: 'Ativo' },
  { id: 'PR-0004', nome: 'Sofia Neto', honorifico: 'Dra.', especialidade: 'Cardiologia', registo: 'Reg. 2287', departamento: 'Cardiologia', estado: 'Inativo' },
]

export const relatorios = [
  {
    id: 'R-0001',
    pacienteId: 'P-0001',
    tipo: 'Geral',
    profissionalId: 'PR-0001',
    data: '2025-04-26',
    estado: 'Finalizado',
    resumo:
      'Paciente observado na consulta de rotina. Quadro clínico estável, sem queixas relevantes. Sinais vitais dentro dos parâmetros normais. Recomenda-se manutenção do tratamento atual e reavaliação dentro de 30 dias.',
    notas: 'O paciente refere boa adesão à medicação. Sem efeitos secundários reportados. Exames laboratoriais anteriores dentro da normalidade.',
  },
  {
    id: 'R-0002',
    pacienteId: 'P-0002',
    tipo: 'Consulta',
    profissionalId: 'PR-0002',
    data: '2025-04-24',
    estado: 'Rascunho',
    resumo: 'Consulta de seguimento pediátrico. Crescimento dentro dos valores esperados para a idade.',
    notas: 'A completar com resultados de exame requisitados.',
  },
  {
    id: 'R-0003',
    pacienteId: 'P-0003',
    tipo: 'Exame',
    profissionalId: 'PR-0003',
    data: '2025-04-22',
    estado: 'Em revisão',
    resumo: 'Registado de imagiologia compatível com ecografia abdominal sem alterações significativas.',
    notas: 'Aguarda validação do departamento de radiologia.',
  },
  {
    id: 'R-0004',
    pacienteId: 'P-0004',
    tipo: 'Alta',
    profissionalId: 'PR-0001',
    data: '2025-04-20',
    estado: 'Corrigido',
    resumo: 'Alta clínica após internamento. Quadro resolvido, com indicação de regresso à actividade habitual.',
    notas: 'Consulta de revisão agendada para 30 dias.',
  },
  {
    id: 'R-0005',
    pacienteId: 'P-0005',
    tipo: 'Acompanhamento',
    profissionalId: 'PR-0002',
    data: '2025-04-18',
    estado: 'Finalizado',
    resumo: 'Consulta de acompanhamento. Sem alterações do plano terapêutico vigente.',
    notas: '',
  },
]

export const exames = [
  { id: 'EX-0001', pacienteId: 'P-0001', nome: 'Hemograma completo', departamento: 'Laboratório', data: '2025-04-18', profissionalId: 'PR-0001', estado: 'Validado' },
  { id: 'EX-0002', pacienteId: 'P-0002', nome: 'Radiografia de tórax', departamento: 'Radiologia', data: '2025-04-16', profissionalId: 'PR-0002', estado: 'Resultado disponível' },
  { id: 'EX-0003', pacienteId: 'P-0003', nome: 'Ecografia abdominal', departamento: 'Ecografia', data: '2025-04-12', profissionalId: 'PR-0003', estado: 'Realizado' },
  { id: 'EX-0004', pacienteId: 'P-0004', nome: 'ECG', departamento: 'Cardiologia', data: '2025-04-09', profissionalId: 'PR-0001', estado: 'Solicitado' },
]

export const prescricoes = [
  { id: 'PS-0001', pacienteId: 'P-0001', medicamento: 'Omeprazol 20mg', profissionalId: 'PR-0001', data: '2025-04-26', estado: 'Ativa' },
  { id: 'PS-0002', pacienteId: 'P-0002', medicamento: 'Paracetamol 500mg', profissionalId: 'PR-0002', data: '2025-04-24', estado: 'Concluída' },
  { id: 'PS-0003', pacienteId: 'P-0004', medicamento: 'Losartan 50mg', profissionalId: 'PR-0001', data: '2025-04-20', estado: 'Ativa' },
  { id: 'PS-0004', pacienteId: 'P-0005', medicamento: 'Amoxicilina 875mg', profissionalId: 'PR-0002', data: '2025-04-18', estado: 'Cancelada' },
]

export const documentos = [
  { id: 'DOC-0001', nome: 'Relatório_Consulta_Abr2025.pdf', pacienteId: 'P-0001', tipo: 'Relatório', tamanhoBytes: 219136, data: '2025-04-26', estado: 'Validado' },
  { id: 'DOC-0002', nome: 'Hemograma_Completo.pdf', pacienteId: 'P-0002', tipo: 'Exame', tamanhoBytes: 100352, data: '2025-04-24', estado: 'Validado' },
  { id: 'DOC-0003', nome: 'Receita_Omeprazol.pdf', pacienteId: 'P-0001', tipo: 'Receita', tamanhoBytes: 53248, data: '2025-04-23', estado: 'Ativo' },
  { id: 'DOC-0004', nome: 'Declaracao_Medica.pdf', pacienteId: 'P-0004', tipo: 'Declaração', tamanhoBytes: 62464, data: '2025-04-20', estado: 'Validado' },
  { id: 'DOC-0005', nome: 'Radiografia_Torax.jpg', pacienteId: 'P-0003', tipo: 'Imagem', tamanhoBytes: 1468006, data: '2025-04-18', estado: 'Validado' },
]

export const auditoria = [
  { id: 'AUD-0001', dataHora: '2025-04-26T14:30:00', utilizadorId: 'PR-0001', acao: 'Visualizou relatório', entidade: 'Relatório', referencia: 'R-0001', pacienteId: 'P-0001', resultado: 'Sucesso' },
  { id: 'AUD-0002', dataHora: '2025-04-24T12:40:00', utilizadorId: 'PR-0002', acao: 'Criou paciente', entidade: 'Paciente', referencia: 'P-0004', pacienteId: 'P-0004', resultado: 'Sucesso' },
  { id: 'AUD-0003', dataHora: '2025-04-23T10:15:00', utilizadorId: 'PR-0003', acao: 'Editou relatório', entidade: 'Relatório', referencia: 'R-0003', pacienteId: 'P-0003', resultado: 'Sucesso' },
  { id: 'AUD-0004', dataHora: '2025-04-22T09:02:00', utilizadorId: 'PR-0001', acao: 'Alterou permissões', entidade: 'Perfil', referencia: null, pacienteId: null, resultado: 'Sucesso' },
]

export const notificacoes = [
  { id: 'N-0001', titulo: 'Relatório R-0001 finalizado', corpo: 'O relatório de João Manuel Silva foi finalizado.', dataHora: '2025-04-26T14:30:00', lida: false, ligação: '/relatorios/R-0001' },
  { id: 'N-0002', titulo: 'Exame pendente de validação', corpo: 'A radiografia de Ana Cristina Domingos tem resultado disponível.', dataHora: '2025-04-24T09:10:00', lida: false, ligação: '/exames' },
  { id: 'N-0003', titulo: 'Relatório em revisão', corpo: 'R-0003 aguarda validação da radiologia.', dataHora: '2025-04-23T10:15:00', lida: true, ligação: '/relatorios/R-0003' },
]