import { Navigate } from "react-router-dom";
import { useAuthStatus } from "../modules/auth/hooks/authHooks";
import type { PublicRouteProps } from "./@types/components.types";
import LoadingSpinner from "./LoadingSpinner";

const PublicRoute = ({
    children,
    restrictForAuthUsers = true,
}: PublicRouteProps) => {
    const { data: authStatus, isLoading } = useAuthStatus();

    if (isLoading) {
        return (
            <LoadingSpinner fullScreen message="Verificando autenticação..." />
        );
    }

    if (authStatus?.isAuthenticated && restrictForAuthUsers) {
        return <Navigate to="/" replace />;
    }
    return <>{children}</>;
};

export default PublicRoute;
