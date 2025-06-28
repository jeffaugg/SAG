import { Button } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-w-screen min-h-screen bg-gray-100">
            <Title level={1}>404</Title>
            <Paragraph className="text-lg">
                A página que você está procurando não foi encontrada. Contacte o
                administrador do sistema ou volte para a{" "}
                <Link
                    to="/"
                    className="!text-black !underline hover:!text-blue-500"
                >
                    página inicial
                </Link>
            </Paragraph>
            <Button
                type="primary"
                className="mt-4 !bg-neutral-800 !border-neutral-800 hover:!bg-neutral-700 hover:!border-neutral-700"
                onClick={() => (window.location.href = "/")}
            >
                Voltar ao início
            </Button>
        </div>
    );
};

export default NotFound;
