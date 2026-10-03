import { useCallback, useEffect, useRef, useState } from 'react'

export default function useResource(fetcher, deps = [], { enabled = true, initialData = null } = {}) {
  const [data, setData] = useState(initialData)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(enabled)
  const requestId = useRef(0)
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const reload = useCallback(async () => {
    if (!enabled) return
    const id = ++requestId.current
    setLoading(true)
    setError(null)
    try {
      const result = await fetcherRef.current()
      if (id !== requestId.current) return
      setData(result)
    } catch (err) {
      if (id !== requestId.current) return
      setError(err)
    } finally {
      if (id === requestId.current) setLoading(false)
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      return
    }
    reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, enabled, reload])

  return { data, error, loading, reload, setData }
}