import { useEffect, useRef, useState } from 'react'
import { api } from '../lib/api'

export default function useGlobalSearch(termo, enabled = true) {
  const [resultados, setResultados] = useState(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)
  const requestId = useRef(0)

  useEffect(() => {
    const valor = termo?.trim()

    if (!enabled || !valor) {
      requestId.current += 1
      setResultados(null)
      setCarregando(false)
      setErro(null)
      return
    }

    const id = ++requestId.current
    setCarregando(true)
    setErro(null)

    api
      .globalSearch({ q: valor })
      .then((res) => {
        if (id !== requestId.current) return
        setResultados(res)
      })
      .catch(() => {
        if (id !== requestId.current) return
        setErro(new Error('Não foi possível pesquisar.'))
        setResultados(null)
      })
      .finally(() => {
        if (id === requestId.current) setCarregando(false)
      })
  }, [termo, enabled])

  return { resultados, carregando, erro }
}