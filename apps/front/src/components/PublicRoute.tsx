import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStatus } from "../modules/auth/hooks/authHooks";
import LoadingSpinner from "./LoadingSpinner";

interface PublicRouteProps {
    children: ReactNode;
    restrictForAuthUsers?: boolean;
}

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
