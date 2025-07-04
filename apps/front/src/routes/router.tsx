import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { LoadingSpinner } from "../components";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";
import { MainLayout } from "../features/layout";

const Maintenance = lazy(() => import("../pages/Maintenance"));
const NotFound = lazy(() => import("../pages/NotFound"));
const AccessDenied = lazy(() => import("../pages/AccessDenied"));
const WorkInProgress = lazy(() => import("../pages/WorkInProgress"));
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
                                <WorkInProgress
                                    pageName="Dashboard"
                                    estimatedCompletion="até o final do próximo sprint"
                                    features={[
                                        "Listagem de todos os indicadores do sistema",
                                        "Estatísticas de gestantes ativas por UBS e Policlínica",
                                        "Monitoramento de gestantes de alto risco",
                                        "Relatórios executivos para gestão",
                                    ]}
                                />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/gestacoes"
                    element={
                        <ProtectedRoute
                            requiredRoles={["Enfermeiro", "Medico", "ADM"]}
                        >
                            <MainLayout>
                                <WorkInProgress
                                    pageName="Gestações"
                                    estimatedCompletion="até o final do próximo sprint"
                                    features={[
                                        "Listagem de todas as gestações ativas",
                                        "Filtro por paciente e status",
                                        "Visualização de indicadores e alertas de risco",
                                        "Exportação de relatórios em PDF",
                                    ]}
                                />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/gestacoes/cadastrar"
                    element={
                        <ProtectedRoute
                            requiredRoles={["Enfermeiro", "Medico"]}
                        >
                            <MainLayout>
                                <WorkInProgress
                                    pageName="Cadastro de Gestações"
                                    estimatedCompletion="até o final do próximo sprint"
                                    features={[
                                        "Formulário de cadastro com validações",
                                        "Cálculo automático da data provável do parto",
                                        "Seleção da paciente via pesquisa",
                                        "Registro de informações básicas do primeiro atendimento",
                                    ]}
                                />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/gestacoes/:id"
                    element={
                        <ProtectedRoute
                            requiredRoles={["Enfermeiro", "Medico", "ADM"]}
                        >
                            <MainLayout>
                                <WorkInProgress
                                    pageName="Detalhes da Gestação"
                                    estimatedCompletion="até o final do próximo sprint"
                                />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/pacientes"
                    element={
                        <ProtectedRoute
                            requiredRoles={["Enfermeiro", "Medico", "ADM"]}
                        >
                            <MainLayout>
                                <WorkInProgress
                                    pageName="Pacientes"
                                    estimatedCompletion="na próxima semana"
                                    features={[
                                        "Listagem completa de pacientes",
                                        "Busca por nome, CPF ou cartão SUS",
                                        "Filtros por UBS e status",
                                        "Histórico de atendimentos e gestações",
                                    ]}
                                />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/pacientes/cadastrar"
                    element={
                        <ProtectedRoute requiredRoles={["Enfermeiro", "ADM"]}>
                            <MainLayout>
                                <WorkInProgress
                                    pageName="Cadastro de Pacientes"
                                    estimatedCompletion="na próxima semana"
                                />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/pacientes/:id"
                    element={
                        <ProtectedRoute
                            requiredRoles={["Enfermeiro", "Medico", "ADM"]}
                        >
                            <MainLayout>
                                <WorkInProgress
                                    pageName="Detalhes do Paciente"
                                    estimatedCompletion="na próxima semana"
                                />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/ubs"
                    element={
                        <ProtectedRoute requiredRoles={["ADM"]}>
                            <MainLayout>
                                <WorkInProgress
                                    pageName="Unidades Básicas de Saúde"
                                    estimatedCompletion="no próximo mês"
                                />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/ubs/cadastrar"
                    element={
                        <ProtectedRoute requiredRoles={["ADM"]}>
                            <MainLayout>
                                <WorkInProgress
                                    pageName="Cadastro de UBS"
                                    estimatedCompletion="no próximo mês"
                                />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/ubs/:id"
                    element={
                        <ProtectedRoute requiredRoles={["ADM"]}>
                            <MainLayout>
                                <WorkInProgress
                                    pageName="Detalhes da UBS"
                                    estimatedCompletion="no próximo mês"
                                />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/policlinicas"
                    element={
                        <ProtectedRoute requiredRoles={["ADM"]}>
                            <MainLayout>
                                <WorkInProgress
                                    pageName="Policlínicas"
                                    estimatedCompletion="no próximo mês"
                                />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/policlinicas/cadastrar"
                    element={
                        <ProtectedRoute requiredRoles={["ADM"]}>
                            <MainLayout>
                                <WorkInProgress
                                    pageName="Cadastro de Policlínicas"
                                    estimatedCompletion="no próximo mês"
                                />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/policlinicas/:id"
                    element={
                        <ProtectedRoute requiredRoles={["ADM"]}>
                            <MainLayout>
                                <WorkInProgress
                                    pageName="Detalhes da Policlínica"
                                    estimatedCompletion="no próximo mês"
                                />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/usuarios"
                    element={
                        <ProtectedRoute requiredRoles={["ADM"]}>
                            <MainLayout>
                                <WorkInProgress
                                    pageName="Usuários"
                                    estimatedCompletion="em breve"
                                />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/usuarios/cadastrar"
                    element={
                        <ProtectedRoute requiredRoles={["ADM"]}>
                            <MainLayout>
                                <WorkInProgress
                                    pageName="Cadastro de Usuários"
                                    estimatedCompletion="em breve"
                                />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/usuarios/:id"
                    element={
                        <ProtectedRoute requiredRoles={["ADM"]}>
                            <MainLayout>
                                <WorkInProgress
                                    pageName="Detalhes do Usuário"
                                    estimatedCompletion="em breve"
                                />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/configuracoes"
                    element={
                        <ProtectedRoute requiredRoles={["ADM"]}>
                            <MainLayout>
                                <WorkInProgress
                                    pageName="Configurações"
                                    estimatedCompletion="nas próximas atualizações"
                                    features={[
                                        "Personalização da interface do sistema",
                                        "Configuração de notificações e alertas",
                                        "Gerenciamento de permissões",
                                        "Configurações regionais e de unidade",
                                    ]}
                                />
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
