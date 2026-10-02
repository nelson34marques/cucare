
function toggleSidebar(forceClose){
  const sb=document.getElementById('sidebar'), ov=document.getElementById('overlay');
  if(!sb) return;
  if(forceClose){sb.classList.add('-translate-x-full');ov.classList.add('hidden');return;}
  sb.classList.toggle('-translate-x-full'); ov.classList.toggle('hidden');
}
let toastTimer;
function toast(msg){
  const t=document.getElementById('toast'); if(!t) return;
  t.textContent=msg; t.classList.remove('opacity-0');
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.add('opacity-0'),2600);
}
function renderPatients(){
  const el = document.getElementById('tbl-patients'); if(!el) return;
  const q = (document.getElementById('pat-search')?.value||'').toLowerCase();
  el.innerHTML = patients.filter(p=>p.name.toLowerCase().includes(q)||p.id.toLowerCase().includes(q)).map(p=>`
    <tr class="border-t border-line hover:bg-surface">
      <td class="px-3 py-2">${p.id}</td>
      <td class="px-3 py-2 font-medium">${p.name}</td>
      <td class="px-3 py-2">${p.dob}</td>
      <td class="px-3 py-2">${p.sex}</td>
      <td class="px-3 py-2">${p.last}</td>
      <td class="px-3 py-2"><span class="badge ${statusColor(p.status)}">${p.status}</span></td>
      <td class="px-3 py-2"><a href="perfil-paciente.html" class="text-accent">Ver</a></td>
    </tr>`).join('');
}
function renderReports(){
  const el = document.getElementById('tbl-reports');
  if(el) el.innerHTML = reports.map(r=>`
    <tr class="border-t border-line hover:bg-surface">
      <td class="px-3 py-2">${r.n}</td>
      <td class="px-3 py-2 font-medium">${r.patient}</td>
      <td class="px-3 py-2">${r.type}</td>
      <td class="px-3 py-2">${r.prof}</td>
      <td class="px-3 py-2">${r.date}</td>
      <td class="px-3 py-2"><span class="badge ${statusColor(r.status)}">${r.status}</span></td>
      <td class="px-3 py-2"><a href="preview-relatorio.html" class="text-accent">Ver</a></td>
    </tr>`).join('');
  const rr = document.getElementById('tbl-recent-reports');
  if(rr) rr.innerHTML = reports.slice(0,4).map(r=>`
    <tr class="border-t border-line"><td class="py-1.5">${r.n}</td><td>${r.patient}</td><td>${r.date}</td>
    <td><span class="badge ${statusColor(r.status)}">${r.status}</span></td></tr>`).join('');
  const ac = document.getElementById('tbl-activity');
  if(ac) ac.innerHTML = activity.map(a=>`
    <tr class="border-t border-line"><td class="py-1.5">${a[0]}</td><td>${a[1]}</td><td>${a[2]}</td><td class="text-muted">${a[3]}</td></tr>`).join('');
}
function renderExtra(){
  const map = [['tbl-documentos',documentos,[5]],['tbl-exames',exames,[5]],['tbl-prescricoes',prescricoes,[4]],['tbl-profissionais',profissionais,[4]],['tbl-auditoria',auditoria,[5]]];
  map.forEach(([id,list,badges])=>{ const el=document.getElementById(id); if(el) el.innerHTML = rows(list,badges); });
}
renderPatients(); renderReports(); renderExtra();
