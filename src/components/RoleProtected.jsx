import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const RoleProtected = ({ children, requiredRole }) => {
    const { user } = useAuth()
    const location = useLocation()

    if (!user) return <Navigate to="/login" replace state={{ from: location }} />

    if (!user.profileComplete && location.pathname !== '/complete-profile') {
        return <Navigate to="/complete-profile" replace />
    }

    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/home" replace />
    }

    if (user.role === 'seller' && requiredRole === 'seller' && user.approved === false) {
        return <Navigate to="/waiting-approval" replace />
    }

    return children
}

export default RoleProtected
