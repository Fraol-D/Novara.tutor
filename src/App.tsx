import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './app/layout/AppShell'
import ProtectedRoute from './app/layout/ProtectedRoute'
import AccountSetupPage from './app/pages/AccountSetupPage'
import LoginPage from './app/pages/LoginPage'
import ParentAcademicGpsPage from './app/pages/ParentAcademicGpsPage'
import ParentAddChildPage from './app/pages/ParentAddChildPage'
import ParentDashboardPage from './app/pages/ParentDashboardPage'
import ParentReportsPage from './app/pages/ParentReportsPage'
import TutorOnboardingPage from './app/pages/TutorOnboardingPage'
import LandingPage from './marketing/LandingPage'
import ThemeToggleFab from './components/ThemeToggleFab'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<LoginPage initialMode="register" />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/setup" element={<AccountSetupPage />} />
        </Route>

        <Route element={<ProtectedRoute requiredRole="parent" />}>
          <Route path="/app/parent" element={<AppShell />}>
            <Route index element={<ParentDashboardPage />} />
            <Route path="add-child" element={<ParentAddChildPage />} />
            <Route path="academic-gps" element={<ParentAcademicGpsPage />} />
            <Route path="reports" element={<ParentReportsPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute requiredRole="tutor" />}>
          <Route path="/app" element={<AppShell />}>
            <Route path="tutor/onboarding" element={<TutorOnboardingPage />} />
          </Route>
        </Route>

        <Route path="/app/tutor" element={<Navigate to="/app/tutor/onboarding" replace />} />
        <Route path="/app" element={<Navigate to="/app/parent" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ThemeToggleFab />
    </>
  )
}
