import Title from "antd/es/typography/Title";
import GestacaoInfoCard from "./GestacaoInfoCard";

const GestacaoHistorico: React.FC = () => (
  <div className="flex-1 flex flex-col bg-white rounded-b-lg gap-4 p-4">
    <Title className="!m-0" level={3}>Histórico de Gestações</Title>
    <div className="flex flex-col gap-2.5">
      <GestacaoInfoCard />
      <GestacaoInfoCard />
    </div>
  </div>
);
export default GestacaoHistorico;
