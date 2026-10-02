
const patients = [
  {id:'P-0001',name:'João Manuel Silva',dob:'12/03/1983',sex:'M',last:'18/04/2025',status:'Ativo'},
  {id:'P-0002',name:'Ana Cristina Domingos',dob:'23/07/1990',sex:'F',last:'16/04/2025',status:'Ativo'},
  {id:'P-0003',name:'Pedro António Cardoso',dob:'05/11/1982',sex:'M',last:'10/04/2025',status:'Ativo'},
  {id:'P-0004',name:'Maria Isabel Santos',dob:'19/08/1977',sex:'F',last:'09/04/2025',status:'Ativo'},
  {id:'P-0005',name:'José Ferreira',dob:'03/01/1975',sex:'M',last:'05/04/2025',status:'Inativo'},
  {id:'P-0006',name:'Carla Mendes',dob:'27/09/1995',sex:'F',last:'28/03/2025',status:'Ativo'},
  {id:'P-0007',name:'Luís Santos',dob:'14/12/1980',sex:'M',last:'25/03/2025',status:'Ativo'},
  {id:'P-0008',name:'Helena Costa',dob:'05/06/1972',sex:'F',last:'20/03/2025',status:'Ativo'},
];
const reports = [
  {n:'R-0001',patient:'João Manuel',type:'Geral',prof:'Dr. Carlos Mendes',date:'26/04/2025',status:'Finalizado'},
  {n:'R-0002',patient:'Ana Cristina',type:'Consulta',prof:'Dra. Ana Silva',date:'24/04/2025',status:'Rascunho'},
  {n:'R-0003',patient:'Pedro António',type:'Exame',prof:'Dr. Luís Ferro',date:'22/04/2025',status:'Em revisão'},
  {n:'R-0004',patient:'Maria Isabel',type:'Alta',prof:'Dr. Carlos Mendes',date:'20/04/2025',status:'Corrigido'},
  {n:'R-0005',patient:'José Ferreira',type:'Acompanhamento',prof:'Dra. Ana Silva',date:'18/04/2025',status:'Finalizado'},
];
const activity = [
  ['Carlos Mendes','Visualizou relatório','Ana Cristina','24/04 14:30'],
  ['Ana Silva','Criou paciente','Maria Isabel','24/04 12:40'],
  ['Luís Ferro','Editou relatório','Pedro António','23/04 10:15'],
];
const documentos = [
  ['Relatório_Consulta_Abr2025.pdf','João Manuel','Relatório','214 KB','26/04/2025','Validado'],
  ['Hemograma_Completo.pdf','Ana Cristina','Exame','98 KB','24/04/2025','Validado'],
  ['Receita_Omeprazol.pdf','João Manuel','Receita','52 KB','23/04/2025','Ativo'],
  ['Declaracao_Medica.pdf','Maria Isabel','Declaração','61 KB','20/04/2025','Validado'],
  ['Radiografia_Torax.jpg','Pedro António','Imagem','1.4 MB','18/04/2025','Validado'],
];
const exames = [
  ['João Manuel','Hemograma completo','Laboratório','18/04/2025','Dr. Carlos Mendes','Validado'],
  ['Ana Cristina','Radiografia de tórax','Radiologia','16/04/2025','Dra. Ana Silva','Resultado disponível'],
  ['Pedro António','Ecografia abdominal','Ecografia','12/04/2025','Dr. Luís Ferro','Realizado'],
  ['Maria Isabel','ECG','Cardiologia','09/04/2025','Dr. Carlos Mendes','Solicitado'],
];
const prescricoes = [
  ['João Manuel','Omeprazol 20mg','Dr. Carlos Mendes','26/04/2025','Ativa'],
  ['Ana Cristina','Paracetamol 500mg','Dra. Ana Silva','24/04/2025','Concluída'],
  ['Maria Isabel','Losartan 50mg','Dr. Carlos Mendes','20/04/2025','Ativa'],
  ['José Ferreira','Amoxicilina 875mg','Dra. Ana Silva','18/04/2025','Cancelada'],
];
const profissionais = [
  ['Dr. Carlos Mendes','Clínica Geral','Reg. 4821','Consultas Externas','Ativo'],
  ['Dra. Ana Silva','Pediatria','Reg. 3390','Pediatria','Ativo'],
  ['Dr. Luís Ferro','Radiologia','Reg. 5512','Imagiologia','Ativo'],
  ['Dra. Sofia Neto','Cardiologia','Reg. 2287','Cardiologia','Inativo'],
];
const auditoria = [
  ['26/04/2025 14:30','Carlos Mendes','Visualizou relatório','R-0001','João Manuel','Sucesso'],
  ['24/04/2025 12:40','Ana Silva','Criou paciente','P-0004','Maria Isabel','Sucesso'],
  ['23/04/2025 10:15','Luís Ferro','Editou relatório','R-0003','Pedro António','Sucesso'],
  ['22/04/2025 09:02','Carlos Mendes','Alterou permissões','—','—','Sucesso'],
];
const statusColor = s => ({Ativo:'bg-green-100 text-ok',Inativo:'bg-slate-100 text-muted',Finalizado:'bg-green-100 text-ok',Rascunho:'bg-slate-100 text-muted','Em revisão':'bg-amber-100 text-warn',Corrigido:'bg-blue-100 text-accent'}[s]||'bg-slate-100 text-muted');
function rows(list,badgeCols){return list.map(r=>'<tr class="border-t border-line hover:bg-surface">'+r.map((c,i)=>`<td class="px-3 py-2${i===0?' font-medium':''}">${badgeCols&&badgeCols.includes(i)?`<span class="badge ${statusColor(c)}">${c}</span>`:c}</td>`).join('')+'</tr>').join('');}
