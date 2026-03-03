import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './app/layout/AppShell'
import ProtectedRoute from './app/layout/ProtectedRoute'
import DashboardPage from './app/pages/DashboardPage'
import LoginPage from './app/pages/LoginPage'
import PaymentsPage from './app/pages/PaymentsPage'
import SessionsPage from './app/pages/SessionsPage'
import StudentsPage from './app/pages/StudentsPage'
import LandingPage from './marketing/LandingPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="sessions" element={<SessionsPage />} />
          <Route path="payments" element={<PaymentsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
