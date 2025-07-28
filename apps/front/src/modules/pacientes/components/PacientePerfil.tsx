import { IdcardOutlined, PhoneOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import { getFirstLetter } from "../../../utils/first-letter";

interface PacientePerfilProps {
    nome: string;
    cpf: string;
    telefone: string;
}

const PacientePerfil: React.FC<PacientePerfilProps> = ({ nome, cpf, telefone }) => (
  <div className="px-4 py-10 flex flex-col items-center rounded-t-lg shadow-md">
    <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center">
      <span className="text-4xl font-bold text-gray-500">
        {getFirstLetter(nome)}
      </span>
    </div>
    <Title level={4} className="mt-6 text-center">{nome}</Title>
    <div className="flex flex-col items-start mt-4 space-y-3 text-center !text-black">
      <div className="flex gap-3">
        <IdcardOutlined />
        {cpf}
      </div>
      <div className="flex gap-3">
        <PhoneOutlined />
        {telefone}
      </div>
    </div>
  </div>
);
export default PacientePerfil;
