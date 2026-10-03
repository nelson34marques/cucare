import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { initials } from '../lib/format'
import Sidebar from './Sidebar'
import GlobalSearch from './GlobalSearch'
import NotificationsPanel from './NotificationsPanel'
import Icon from './Icon'
import { Skeleton } from './States'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()

  async function onLogout() {
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="flex min-h-screen text-sm">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={onLogout} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-line flex items-center gap-3 px-4 sticky top-0 z-20">
          <button
            className="lg:hidden p-1.5 -ml-1.5 text-muted hover:text-navy"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menu"
          >
            <Icon name="menu" className="w-5 h-5" />
          </button>

          <GlobalSearch />

          <div className="ml-auto flex items-center gap-3">
            <NotificationsPanel />
            <div className="flex items-center gap-2.5">
              {loading || !user ? (
                <>
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="hidden sm:block space-y-1.5">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-2.5 w-16" />
                  </div>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-xs font-semibold shrink-0">
                    {initials(`${user.honorifico || ''} ${user.nome}`)}
                  </div>
                  <div className="hidden sm:block leading-tight">
                    <div className="font-medium">
                      {user.honorifico} {user.nome}
                    </div>
                    <div className="text-[11px] text-muted">{user.especialidade}</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}