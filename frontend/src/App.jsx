import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { ToastProvider } from './components/Toast'
import Login from './pages/Login'
import RecuperarSenha from './pages/RecuperarSenha'
import Dashboard from './pages/Dashboard'
import Pacientes from './pages/Pacientes'
import PerfilPaciente from './pages/PerfilPaciente'
import Relatorios from './pages/Relatorios'
import CriarRelatorio from './pages/CriarRelatorio'
import PreviewRelatorio from './pages/PreviewRelatorio'
import Exames from './pages/Exames'
import Prescricoes from './pages/Prescricoes'
import Documentos from './pages/Documentos'
import Profissionais from './pages/Profissionais'
import Auditoria from './pages/Auditoria'
import Configuracoes from './pages/Configuracoes'

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pacientes" element={<Pacientes />} />
            <Route path="/perfil-paciente" element={<PerfilPaciente />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/criar-relatorio" element={<CriarRelatorio />} />
            <Route path="/preview-relatorio" element={<PreviewRelatorio />} />
            <Route path="/exames" element={<Exames />} />
            <Route path="/prescricoes" element={<Prescricoes />} />
            <Route path="/documentos" element={<Documentos />} />
            <Route path="/profissionais" element={<Profissionais />} />
            <Route path="/auditoria" element={<Auditoria />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}
