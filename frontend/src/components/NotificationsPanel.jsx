import { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import useResource from '../hooks/useResource'
import useClickOutside from '../hooks/useClickOutside'
import { formatRelative } from '../lib/format'
import Icon from './Icon'
import { Skeleton, EmptyState } from './States'

export default function NotificationsPanel() {
  const [aberto, setAberto] = useState(false)
  const containerRef = useRef(null)
  const navigate = useNavigate()

  const fechar = useCallback(() => setAberto(false), [])
  useClickOutside(containerRef, fechar, aberto)

  const { data, loading, error, reload } = useResource(() => api.listNotificacoes({}), [])

  const naoLidas = data?.naoLidas ?? 0

  async function abrirNotificacao(n) {
    if (!n.lida) {
      await api.markNotificacaoLida({ id: n.id })
      reload()
    }
    setAberto(false)
    if (n.ligacao) navigate(n.ligacao)
  }

  async function marcarTodas() {
    await api.markTodasNotificacoesLidas()
    reload()
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setAberto((a) => !a)}
        aria-label={`Notificações${naoLidas ? ` (${naoLidas} por ler)` : ''}`}
        aria-expanded={aberto}
        className="relative p-2 text-muted hover:text-navy transition-colors"
      >
        <Icon name="bell" className="w-5 h-5" />
        {naoLidas > 0 && (
          <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-accent text-white text-[10px] font-semibold flex items-center justify-center">
            {naoLidas > 9 ? '9+' : naoLidas}
          </span>
        )}
      </button>

      {aberto && (
        <div className="absolute right-0 top-full mt-1.5 w-80 bg-white border border-line rounded-md shadow-lg overflow-hidden z-30">
          <div className="px-3 py-2.5 border-b border-line flex items-center justify-between">
            <span className="font-semibold text-sm">Notificações</span>
            {naoLidas > 0 && (
              <button
                onClick={marcarTodas}
                className="text-[11px] text-accent hover:underline"
              >
                Marcar todas como lidas
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading && (
              <div className="p-3 space-y-3">
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            )}

            {!loading && error && (
              <p className="p-4 text-xs text-muted text-center">
                Não foi possível carregar as notificações.
              </p>
            )}

            {!loading && !error && data.items.length === 0 && (
              <EmptyState
                icon="bell"
                title="Sem notificações"
                description="Está tudo em dia."
              />
            )}

            {!loading &&
              !error &&
              data.items.map((n) => (
                <button
                  key={n.id}
                  onClick={() => abrirNotificacao(n)}
                  className={`w-full text-left px-3 py-2.5 border-b border-line last:border-0 flex gap-2.5 hover:bg-surface transition-colors ${
                    n.lida ? '' : 'bg-accent/5'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${
                      n.lida ? 'bg-transparent' : 'bg-accent'
                    }`}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium truncate">{n.titulo}</span>
                    <span className="block text-[11px] text-muted">{n.corpo}</span>
                    <span className="block text-[11px] text-muted mt-0.5">
                      {formatRelative(n.dataHora)}
                    </span>
                  </span>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}