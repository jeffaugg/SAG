import { Alert, Button, Result } from "antd";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MainLayout } from "../components";

interface LocationState {
    from?: string;
    message?: string;
}

const AccessDenied: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as LocationState;
    const message =
        state?.message || "Você não tem permissão para acessar esta página.";

    const handleBackToHome = () => {
        navigate("/");
    };

    return (
        <MainLayout>
            <Result
                status="403"
                title="Acesso Negado"
                subTitle={message}
                extra={
                    <>
                        {state?.from && (
                            <Alert
                                type="info"
                                message={`Você tentou acessar: ${state.from}`}
                                className="mb-4"
                            />
                        )}
                        <Button type="primary" onClick={handleBackToHome}>
                            Voltar para a Página Inicial
                        </Button>
                    </>
                }
            />
        </MainLayout>
    );
};

export default AccessDenied;
