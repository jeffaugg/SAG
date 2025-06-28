import { Navigate, useLocation } from "react-router-dom";
import { useErrorHandler } from "../hooks/useErrorHandler";
import { useAuthStatus, useCurrentUser } from "../modules/auth/hooks/authHooks";
import type { ProtectedRouteProps } from "./@types/components.types";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children, requiredRoles }: ProtectedRouteProps) => {
    const {
        data: authStatus,
        isLoading: authLoading,
        error: authError,
    } = useAuthStatus();
    const {
        data: currentUser,
        isLoading: userLoading,
        error: userError,
    } = useCurrentUser();
    const { handleError } = useErrorHandler();
    const location = useLocation();

    const isLoading =
        authLoading || (authStatus?.isAuthenticated && userLoading);
    const error = authError || userError;

    if (error) {
        handleError(error);
        return (
            <Navigate
                to="/auth/login"
                state={{ from: location.pathname }}
                replace
            />
        );
    }

    if (isLoading) {
        return (
            <LoadingSpinner fullScreen message="Verificando autenticação..." />
        );
    }

    if (!authStatus?.isAuthenticated) {
        return (
            <Navigate
                to="/auth/login"
                state={{ from: location.pathname }}
                replace
            />
        );
    }

    if (requiredRoles && requiredRoles.length > 0 && currentUser) {
        const userHasRequiredRole = requiredRoles.includes(currentUser.cargo);
        if (!userHasRequiredRole) {
            return (
                <Navigate
                    to="/access-denied"
                    state={{
                        from: location.pathname,
                        message:
                            "Você não tem permissão para acessar esta página.",
                    }}
                    replace
                />
            );
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;
