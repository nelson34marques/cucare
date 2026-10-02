import { createContext, useCallback, useContext, useRef, useState } from 'react'
import Icon from './Icon'

const ToastCtx = createContext(() => {})

export const useToast = () => useContext(ToastCtx)

export function ToastProvider({ children }) {
  const [msg, setMsg] = useState('')
  const [visible, setVisible] = useState(false)
  const timer = useRef(null)

  const toast = useCallback((m) => {
    setMsg(m)
    setVisible(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setVisible(false), 2600)
  }, [])

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-navy text-white text-sm px-4 py-2.5 rounded shadow-lg transition-opacity duration-300 flex items-center gap-2 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <Icon name="bell" className="w-4 h-4" />
        {msg}
      </div>
    </ToastCtx.Provider>
  )
}
