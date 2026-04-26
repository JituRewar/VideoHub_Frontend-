import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  //  Show loader while checking auth
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg">Checking authentication...</p>
      </div>
    )
  }

  //  Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Logged in → allow access
  return children
}

export default ProtectedRoute