import { CalendarOutlined, IdcardOutlined, PhoneOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";

const PacientePerfil: React.FC = () => (
  <div className="px-4 py-10 flex flex-col items-center rounded-t-lg shadow-md">
    <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center">
      Foto perfil
    </div>
    <Title level={4} className="mt-6 text-center">Nome do Paciente</Title>
    <div className="flex flex-col items-start mt-4 space-y-3 text-center !text-black">
      <div className="flex gap-3">
        <CalendarOutlined />
        35 anos
      </div>
      <div className="flex gap-3">
        <IdcardOutlined />
        123.456.789-11
      </div>
      <div className="flex gap-3">
        <PhoneOutlined />
        (88) 9 1234-5678
      </div>
    </div>
  </div>
);
export default PacientePerfil;
