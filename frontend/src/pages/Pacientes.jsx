import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import Badge from '../components/Badge'
import Card from '../components/Card'
import { patients } from '../data'

export default function Pacientes() {
  const [q, setQ] = useState('')
  const filtered = patients.filter(
    (p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.id.toLowerCase().includes(q.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold">Pacientes</h1>
          <p className="text-muted text-xs mt-0.5">{patients.length} pacientes registados</p>
        </div>
        <button className="bg-accent text-white text-sm px-4 py-2 rounded font-medium hover:bg-blue transition-colors flex items-center gap-2">
          <Icon name="plus" className="w-4 h-4" />
          Novo paciente
        </button>
      </div>

      <Card>
        <div className="px-4 py-3 border-b border-line">
          <div className="relative max-w-sm">
            <Icon name="search" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Pesquisar por nome ou ID..."
              className="w-full border border-line rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-muted border-b border-line">
                <th className="px-4 py-2.5 font-medium">ID</th>
                <th className="px-4 py-2.5 font-medium">Nome</th>
                <th className="px-4 py-2.5 font-medium">Nascimento</th>
                <th className="px-4 py-2.5 font-medium">Sexo</th>
                <th className="px-4 py-2.5 font-medium">Última visita</th>
                <th className="px-4 py-2.5 font-medium">Estado</th>
                <th className="px-4 py-2.5 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-line hover:bg-surface">
                  <td className="px-4 py-2.5">{p.id}</td>
                  <td className="px-4 py-2.5 font-medium">{p.name}</td>
                  <td className="px-4 py-2.5 text-muted">{p.dob}</td>
                  <td className="px-4 py-2.5">{p.sex}</td>
                  <td className="px-4 py-2.5 text-muted">{p.last}</td>
                  <td className="px-4 py-2.5"><Badge>{p.status}</Badge></td>
                  <td className="px-4 py-2.5">
                    <Link to="/perfil-paciente" className="text-accent">Ver</Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="7" className="px-4 py-8 text-center text-muted">Nenhum paciente encontrado</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
