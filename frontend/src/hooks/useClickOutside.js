import { useEffect } from 'react'

export default function useClickOutside(ref, onOutside, active = true) {
  useEffect(() => {
    if (!active) return
    const handler = (event) => {
      if (ref.current && !ref.current.contains(event.target)) onOutside()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, onOutside, active])
}