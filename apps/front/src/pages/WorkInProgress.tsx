import {
    BulbOutlined,
    CalendarOutlined,
    HomeOutlined,
    RocketOutlined,
} from "@ant-design/icons";
import { Button, Card, Space, Typography } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;

interface WorkInProgressProps {
    pageName?: string;
    estimatedCompletion?: string;
    features?: string[];
}

const WorkInProgress: React.FC<WorkInProgressProps> = ({
    pageName = "Esta página",
    estimatedCompletion = "em breve",
    features = [],
}) => {
    const navigate = useNavigate();

    const defaultFeatures = [
        "Listagem de registros",
        "Filtragem avançada",
        "Exportação de dados",
        "Visualização detalhada",
    ];

    const displayFeatures = features.length > 0 ? features : defaultFeatures;

    return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="text-center max-w-3xl mb-8">
                <div className="mb-8 flex justify-center">
                    <div className="w-32 h-32 relative">
                        {/* <Spin size="large" className="absolute inset-0" /> */}
                        <RocketOutlined className="absolute inset-0 flex items-center justify-center text-5xl text-blue-500" />
                    </div>
                </div>

                <Title level={2}>
                    <span className="text-blue-600">Em Desenvolvimento</span>
                </Title>

                <Title level={3} className="mb-6">
                    {pageName} está em construção
                </Title>

                <Paragraph className="text-lg mb-6">
                    Nossa equipe está trabalhando para implementar esta
                    funcionalidade. Estamos comprometidos em entregar uma
                    experiência de alta qualidade e deve estar disponível{" "}
                    {estimatedCompletion}.
                </Paragraph>

                <Card
                    title="Funcionalidades Previstas"
                    className="mb-8 text-left"
                >
                    <ul className="list-disc pl-6">
                        {displayFeatures.map((feature, index) => (
                            <li key={index} className="mb-2">
                                <Space>
                                    <BulbOutlined /> {feature}
                                </Space>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 flex items-center">
                        <CalendarOutlined className="mr-2" />
                        <Text type="secondary">
                            Previsão de entrega: {estimatedCompletion}
                        </Text>
                    </div>
                </Card>

                <div className="bg-gray-100 p-4 rounded-lg mb-8">
                    <Text strong className="text-gray-700">
                        Enquanto isso, você pode explorar outras áreas do
                        sistema que já estão funcionando.
                    </Text>
                </div>

                <Space>
                    <Button
                        type="default"
                        size="large"
                        onClick={() => navigate(-1)}
                    >
                        Voltar
                    </Button>
                    <Button
                        type="primary"
                        size="large"
                        icon={<HomeOutlined />}
                        onClick={() => navigate("/pacientes")}
                    >
                        Ir para a página de Pacientes
                    </Button>
                </Space>
            </div>
        </div>
    );
};

export default WorkInProgress;
