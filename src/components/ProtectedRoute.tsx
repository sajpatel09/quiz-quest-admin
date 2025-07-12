import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IRootState } from '../store';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean;
}

const ProtectedRoute = ({ children, requireAuth = true }: ProtectedRouteProps) => {
    const { isLoggedIn } = useSelector((state: IRootState) => state.auth);

    if (requireAuth && !isLoggedIn) {
        // Redirect them to the login page if not authenticated
        return <Navigate to="/login" replace />;
    }

    if (!requireAuth && isLoggedIn) {
        // Redirect to home page if already authenticated (for login page)
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
