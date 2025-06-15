import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const Maintenance = lazy(() => import("../pages/Maintenance"));
const NotFound = lazy(() => import("../pages/NotFound"));
const AuthRoutes = lazy(() => import("../modules/auth/router/AuthRoutes"));

const Router = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Maintenance />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/auth/*" element={<AuthRoutes />} />
      </Routes>
    </Suspense>
  );
};

export default Router;
