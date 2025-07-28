import Title from "antd/es/typography/Title";
import GestacaoInfoCard from "./GestacaoInfoCard";
import type { Gestacao } from "../types";
import { usePacienteContext } from "../hooks/useContext";
import {  useEffect } from "react";
import { useDeleteGestacao } from "../hooks/gestacaoHooks";

interface GestacaoHistoricoProps {
    gestacoes: Gestacao[];
}

const GestacaoHistorico: React.FC<GestacaoHistoricoProps> = ({ gestacoes }) => {
  const { setGestacao } = usePacienteContext();
  const deleteGestacao = useDeleteGestacao();

  useEffect(() => {
    if (gestacoes.length > 0) {
      setGestacao(gestacoes[0].id);
    }
  }, [gestacoes, setGestacao]);

  return (
    <div className="flex-1 flex flex-col bg-white rounded-b-lg gap-4 p-4">
      <Title className="!m-0" level={3}>Histórico de Gestações</Title>
      <div className="flex flex-col gap-2.5">
        {gestacoes.map((gestacao, index) => (
          <GestacaoInfoCard
            key={gestacao.id}
            inicio={gestacao.inicio}
            status={gestacao.status}
            fim={gestacao.fim ?? ""}
            numero={index + 1}
            onClick={() => setGestacao(gestacao.id)}
            onDelete={() => deleteGestacao.mutate(gestacao.id)}
          />
        ))}
      </div>
    </div>
  );
}
export default GestacaoHistorico;