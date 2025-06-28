import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const Login = lazy(() => import("../pages/Login"));
const NotFound = lazy(() => import("../../../pages/NotFound"));

const AuthRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/auth/login" replace />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AuthRoutes;
