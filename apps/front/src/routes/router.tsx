import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { LoadingSpinner } from "../components";
import MainLayout from "../components/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const Maintenance = lazy(() => import("../pages/Maintenance"));
const NotFound = lazy(() => import("../pages/NotFound"));
const AccessDenied = lazy(() => import("../pages/AccessDenied"));
const AuthRoutes = lazy(() => import("../modules/auth/router/AuthRoutes"));

const SuspenseLoading = () => (
    <LoadingSpinner fullScreen message="Carregando aplicação..." />
);

const Router = () => {
    return (
        <Suspense fallback={<SuspenseLoading />}>
            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <Dashboard />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/auth/*"
                    element={
                        <PublicRoute>
                            <AuthRoutes />
                        </PublicRoute>
                    }
                />

                <Route path="/maintenance" element={<Maintenance />} />
                <Route path="/access-denied" element={<AccessDenied />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
};

export default Router;
