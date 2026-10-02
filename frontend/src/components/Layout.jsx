import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Icon from './Icon'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen text-sm">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-line flex items-center gap-3 px-4 sticky top-0 z-20">
          <button className="lg:hidden p-1.5 -ml-1.5 text-muted hover:text-navy" onClick={() => setSidebarOpen(true)} aria-label="Abrir menu">
            <Icon name="menu" className="w-5 h-5" />
          </button>
          <div className="relative flex-1 max-w-md">
            <Icon name="search" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              placeholder="Pesquisar pacientes, relatórios..."
              className="w-full border border-line rounded pl-9 pr-3 py-2 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button className="relative p-2 text-muted hover:text-navy" aria-label="Notificações">
              <Icon name="bell" className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center">
                <Icon name="user" className="w-4 h-4" />
              </div>
              <div className="hidden sm:block leading-tight">
                <div className="font-medium">Dr. Carlos Mendes</div>
                <div className="text-[11px] text-muted">Clínica Geral</div>
              </div>
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
