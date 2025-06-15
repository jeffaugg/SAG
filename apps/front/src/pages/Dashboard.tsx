import { Typography } from "antd";
import { PageLoading } from "../components";
import { useCurrentUser } from "../modules/auth/hooks/authHooks";

const { Title } = Typography;

const Dashboard = () => {
    const { data: isLoading } = useCurrentUser();

    if (isLoading) {
        return (
            <PageLoading
                message="Carregando dados do usuário..."
                title="Dashboard"
            />
        );
    }

    return (
        <div>
            <Title className="mb- 4">
                Bem-vindo ao Dashboard do Sistema de Apoio a Gestante (SAG)
            </Title>
        </div>
    );
};

export default Dashboard;
