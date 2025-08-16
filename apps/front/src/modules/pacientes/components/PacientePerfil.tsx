import { CopyOutlined, IdcardOutlined, PhoneOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import Title from "antd/es/typography/Title";
import { getFirstLetter } from "../../../utils/first-letter";
import { formatCpf, formatPhone } from "../../../utils/formatters";
import { ToastService } from "../../../utils/toast-service";

interface PacientePerfilProps {
    nome: string;
    cpf: string;
    telefone: string;
}

const PacientePerfil: React.FC<PacientePerfilProps> = ({
    nome,
    cpf,
    telefone,
}) => {
    const handleCopy = async (text: string, type: string) => {
        try {
            await navigator.clipboard.writeText(text);
            ToastService.success(`${type} copiado!`);
        } catch {
            ToastService.error(`Erro ao copiar ${type.toLowerCase()}`);
        }
    };

    return (
        <div className="px-4 py-10 flex flex-col bg-white items-center rounded-lg ">
            <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-4xl font-bold text-gray-500">
                    {getFirstLetter(nome)}
                </span>
            </div>
            <Title level={4} className="mt-6 text-center">
                {nome}
            </Title>
            <div className="flex flex-col items-start mt-4 space-y-3 text-center !text-black">
                <div className="flex gap-3 items-center">
                    <IdcardOutlined />
                    <span>{formatCpf(cpf)}</span>
                    <Tooltip title="Copiar CPF">
                        <CopyOutlined
                            className="cursor-pointer text-gray-500 hover:text-blue-500 hover:scale-110 transition-all duration-200"
                            onClick={() => handleCopy(cpf, "CPF")}
                        />
                    </Tooltip>
                </div>
                <div className="flex gap-3 items-center">
                    <PhoneOutlined />
                    <span>{formatPhone(telefone)}</span>
                    <Tooltip title="Copiar Telefone">
                        <CopyOutlined
                            className="cursor-pointer text-gray-500 hover:text-blue-500 hover:scale-110 transition-all duration-200"
                            onClick={() => handleCopy(telefone, "Telefone")}
                        />
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};
export default PacientePerfil;
