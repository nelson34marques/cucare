import { useCallback, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useDebounce from '../hooks/useDebounce'
import useGlobalSearch from '../hooks/useGlobalSearch'
import useClickOutside from '../hooks/useClickOutside'
import Icon from './Icon'
import { Skeleton, EmptyState } from './States'

function flatten({ pacientes, relatorios }) {
  return [
    ...pacientes.map((p) => ({
      id: p.id,
      tipo: 'Paciente',
      titulo: p.nome,
      meta: p.id,
      para: `/pacientes/${p.id}`,
    })),
    ...relatorios.map((r) => ({
      id: r.id,
      tipo: 'Relatório',
      titulo: `${r.id} — ${r.pacienteNome}`,
      meta: r.tipo,
      para: `/relatorios/${r.id}`,
    })),
  ]
}

export default function GlobalSearch() {
  const [q, setQ] = useState('')
  const [aberto, setAberto] = useState(false)
  const [indice, setIndice] = useState(0)

  const termo = useDebounce(q, 250)
  const { resultados, carregando, erro } = useGlobalSearch(termo)

  const containerRef = useRef(null)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  const fechar = useCallback(() => setAberto(false), [])
  useClickOutside(containerRef, fechar, aberto)

  const itens = useMemo(() => (resultados ? flatten(resultados) : []), [resultados])

  const selecionar = useCallback(
    (item) => {
      navigate(item.para)
      setQ('')
      setAberto(false)
      inputRef.current?.blur()
    },
    [navigate],
  )

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      setAberto(false)
      inputRef.current?.blur()
      return
    }
    if (event.key === 'ArrowDown' && itens.length) {
      event.preventDefault()
      setIndice((i) => (i + 1) % itens.length)
    } else if (event.key === 'ArrowUp' && itens.length) {
      event.preventDefault()
      setIndice((i) => (i - 1 + itens.length) % itens.length)
    } else if (event.key === 'Enter' && itens[indice]) {
      event.preventDefault()
      selecionar(itens[indice])
    }
  }

  const mostrarPainel = aberto && q.trim().length > 0

  return (
    <div ref={containerRef} className="relative flex-1 max-w-md">
      <Icon
        name="search"
        className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
      />
      <input
        ref={inputRef}
        value={q}
        onChange={(e) => {
          setQ(e.target.value)
          setAberto(true)
        }}
        onFocus={() => setAberto(true)}
        onKeyDown={onKeyDown}
        placeholder="Pesquisar pacientes, relatórios..."
        role="combobox"
        aria-expanded={mostrarPainel}
        aria-controls="global-search-resultados"
        className="w-full border border-line rounded pl-9 pr-3 py-2 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-accent/40"
      />

      {mostrarPainel && (
        <div
          id="global-search-resultados"
          className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-line rounded-md shadow-lg overflow-hidden z-30"
        >
          {carregando && (
            <div className="p-3 space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          )}

          {!carregando && erro && <p className="p-4 text-xs text-muted text-center">{erro.message}</p>}

          {!carregando && !erro && itens.length === 0 && (
            <EmptyState
              icon="search"
              title="Sem resultados"
              description={`Nada encontrado para "${q.trim()}".`}
            />
          )}

          {!carregando && !erro && itens.length > 0 && (
            <ul className="max-h-80 overflow-y-auto py-1" role="listbox">
              {itens.map((item, i) => (
                <li key={`${item.tipo}-${item.id}`}>
                  <button
                    onClick={() => seleccionar(item)}
                    onMouseEnter={() => setIndice(i)}
                    role="option"
                    aria-selected={i === indice}
                    className={`w-full text-left px-3 py-2 flex items-center gap-3 transition-colors ${
                      i === indice ? 'bg-surface' : ''
                    }`}
                  >
                    <Icon
                      name={item.tipo === 'Paciente' ? 'user' : 'report'}
                      className="w-4 h-4 text-muted shrink-0"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm truncate">{item.titulo}</span>
                      <span className="block text-[11px] text-muted">
                        {item.tipo} · {item.meta}
                      </span>
                    </span>
                    {i === indice && (
                      <Icon name="chevron-right" className="w-4 h-4 text-muted shrink-0" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}