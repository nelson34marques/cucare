import Icon from './Icon'
import { ApiError } from '../lib/api-client'

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded bg-line ${className}`} />
}

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="divide-y divide-line">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 px-4 py-3">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton
              key={c}
              className={`h-3 ${c === 0 ? 'w-24' : 'flex-1'}`}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="p-4 space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-3 w-16" />
    </div>
  )
}

export function LoadingBlock({ label = 'A carregar…' }) {
  return (
    <div className="p-8 flex flex-col items-center gap-3 text-muted">
      <div className="w-5 h-5 rounded-full border-2 border-line border-t-accent animate-spin" />
      <span className="text-xs">{label}</span>
    </div>
  )
}

export function ErrorState({ error, onRetry, title = 'Não foi possível carregar os dados' }) {
  const mensagem =
    error instanceof ApiError ? error.message : 'Ocorreu um erro inesperado. Tente novamente.'
  const semLigacao = error instanceof ApiError && (error.code === 'network' || error.code === 'timeout')

  return (
    <div className="p-8 flex flex-col items-center gap-3 text-center">
      <div className="w-11 h-11 rounded-full bg-red-100 text-bad flex items-center justify-center">
        <Icon name="alert" className="w-5 h-5" />
      </div>
      <div>
        <div className="font-medium">{title}</div>
        <p className="text-xs text-muted mt-1 max-w-sm">{mensagem}</p>
        {semLigacao && (
          <p className="text-xs text-muted mt-1">Verifique a ligação ao servidor.</p>
        )}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-1 border border-line text-sm px-4 py-2 rounded font-medium hover:bg-surface transition-colors flex items-center gap-2"
        >
          <Icon name="refresh" className="w-4 h-4" />
          Tentar novamente
        </button>
      )}
    </div>
  )
}

export function EmptyState({ icon = 'inbox', title, description, action }) {
  return (
    <div className="p-8 flex flex-col items-center gap-3 text-center">
      <div className="w-11 h-11 rounded-full bg-surface text-muted flex items-center justify-center">
        <Icon name={icon} className="w-5 h-5" />
      </div>
      <div>
        <div className="font-medium">{title}</div>
        {description && <p className="text-xs text-muted mt-1 max-w-sm">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function FieldError({ children }) {
  if (!children) return null
  return <p className="text-[11px] text-bad mt-1">{children}</p>
}