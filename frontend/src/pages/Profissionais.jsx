import { useState } from 'react'
import { api } from '../lib/api'
import useResource from '../hooks/useResource'
import useDebounce from '../hooks/useDebounce'
import { PROFISSIONAL_ESTADOS } from '../lib/enums'
import PageHeader from '../components/PageHeader'
import Icon from '../components/Icon'
import Badge from '../components/Badge'
import Card from '../components/Card'
import { TableSkeleton, ErrorState, EmptyState } from '../components/States'
import { useToast } from '../components/Toast'

export default function Profissionais() {
  const toast = useToast()
  const [q, setQ] = useState('')
  const [estado, setEstado] = useState('')
  const termo = useDebounce(q, 300)

  const { data, loading, error, reload } = useResource(
    () => api.listProfissionais({ q: termo || undefined, estado: estado || undefined }),
    [termo, estado],
    { initialData: { items: [], total: 0 } },
  )

  async function alternarEstado(p) {
    const novo = p.estado === 'Ativo' ? 'Inativo' : 'Ativo'
    try {
      await api.updateProfissional({ id: p.id, estado: novo })
      reload()
      toast(`${p.nomeCompleto} marcado como ${novo}`)
    } catch (err) {
      toast(err.message)
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Profissionais"
        subtitle={loading ? 'A carregar…' : `${data.total} profissionais de saúde`}
      />

      <Card>
        <div className="px-4 py-3 border-b border-line flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm min-w-56">
            <Icon
              name="search"
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Pesquisar por nome, especialidade ou registro..."
              aria-label="Pesquisar profissionais"
              className="w-full border border-line rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            aria-label="Filtrar por estado"
            className="border border-line rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            <option value="">Todos os estados</option>
            {PROFISSIONAL_ESTADOS.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>

        {error ? (
          <ErrorState error={error} onRetry={reload} />
        ) : loading ? (
          <TableSkeleton rows={6} cols={6} />
        ) : data.items.length === 0 ? (
          <EmptyState
            icon="badge"
            title="Nenhum profissional encontrado"
            description="Não há profissionais que correspondam aos filtros aplicados."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-muted border-b border-line">
                  <th className="px-4 py-2.5 font-medium">ID</th>
                  <th className="px-4 py-2.5 font-medium">Nome</th>
                  <th className="px-4 py-2.5 font-medium">Especialidade</th>
                  <th className="px-4 py-2.5 font-medium">Registro</th>
                  <th className="px-4 py-2.5 font-medium">Departamento</th>
                  <th className="px-4 py-2.5 font-medium">Estado</th>
                  <th className="px-4 py-2.5 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((p) => (
                  <tr key={p.id} className="border-t border-line hover:bg-surface">
                    <td className="px-4 py-2.5">{p.id}</td>
                    <td className="px-4 py-2.5 font-medium">{p.nomeCompleto}</td>
                    <td className="px-4 py-2.5">{p.especialidade}</td>
                    <td className="px-4 py-2.5 text-muted">{p.registo}</td>
                    <td className="px-4 py-2.5">{p.departamento}</td>
                    <td className="px-4 py-2.5">
                      <Badge>{p.estado}</Badge>
                    </td>
                    <td className="px-4 py-2.5">
                      <button
                        onClick={() => alternarEstado(p)}
                        className="text-accent hover:underline"
                      >
                        {p.estado === 'Ativo' ? 'Desativar' : 'Ativar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}