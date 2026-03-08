import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'
import type { UserRole } from '../types'

type Props = {
  requiredRole?: UserRole
}

export default function ProtectedRoute({ requiredRole }: Props) {
  const { isAuthenticated, role, setupCompleted } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (!setupCompleted && location.pathname !== '/setup') {
    return <Navigate to="/setup" replace />
  }

  if (requiredRole && role !== requiredRole) {
    const dest = role === 'tutor' ? '/app/tutor' : '/app/parent'
    return <Navigate to={dest} replace />
  }

  return <Outlet />
}
