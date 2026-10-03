import Icon from './Icon'

export default function Pagination({ page, totalPages, total, onChange, label = 'registos' }) {
  if (!total) return null

  const anteriorDisabled = page <= 1
  const proximaDisabled = page >= totalPages

  return (
    <div className="px-4 py-3 border-t border-line flex items-center justify-between gap-3 flex-wrap">
      <span className="text-xs text-muted">
        {total} {label} · página {page} de {totalPages}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={anteriorDisabled}
          aria-label="Página anterior"
          className="w-8 h-8 rounded border border-line flex items-center justify-center hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Icon name="chevron-left" className="w-4 h-4" />
        </button>
        <button
          onClick={() => onChange(page + 1)}
          disabled={proximaDisabled}
          aria-label="Página seguinte"
          className="w-8 h-8 rounded border border-line flex items-center justify-center hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Icon name="chevron-right" className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}