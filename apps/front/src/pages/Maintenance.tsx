import { Typography } from "antd";
const { Title, Paragraph } = Typography;

const Maintenance = () => {
    return (
        <div className="flex flex-col items-center justify-center min-w-screen min-h-screen bg-gray-100">
            <Title level={1}>Estamos em manutenção...</Title>
            <Paragraph className="text-lg">
                Estamos em manutenção! Partes do nosso sistema podem não
                funcionar direito, aguarde alguns instantes e tente novamente.
            </Paragraph>
        </div>
    );
};

export default Maintenance;
