
// Importa componentes e hooks necessários para exibir o histórico de gestações
import Title from "antd/es/typography/Title";
import GestacaoInfoCard from "./GestacaoInfoCard";
import type { Gestacao } from "../types";
import { usePacienteContext } from "../hooks/useContext";
import { useEffect } from "react";
import { useDeleteGestacao } from "../hooks/gestacaoHooks";


/**
 * Props do componente GestacaoHistorico
 * - gestacoes: lista de gestações do paciente
 */
interface GestacaoHistoricoProps {
    gestacoes: Gestacao[];
}


/**
 * Componente que exibe o histórico de gestações do paciente.
 * Mostra uma lista de cards, cada um representando uma gestação.
 * Permite selecionar e excluir uma gestação.
 */
const GestacaoHistorico: React.FC<GestacaoHistoricoProps> = ({ gestacoes }) => {
  // Hook de contexto para manipular a gestação selecionada
  const { setGestacao } = usePacienteContext();
  // Hook para deletar uma gestação
  const deleteGestacao = useDeleteGestacao();

  // Sempre que a lista de gestações mudar, seleciona a primeira como padrão
  useEffect(() => {
    if (gestacoes.length > 0) {
      setGestacao(gestacoes[0].id);
    }
  }, [gestacoes, setGestacao]);

  return (
    <div className="flex-1 flex flex-col bg-white rounded-b-lg gap-4 p-4">
      {/* Título do histórico */}
      <Title className="!m-0" level={3}>Histórico de Gestações</Title>
      <div className="flex flex-col gap-2.5">
        {/* Renderiza um card para cada gestação */}
        {gestacoes.map((gestacao, index) => (
          <GestacaoInfoCard
            key={gestacao.id}
            inicio={gestacao.inicio}
            status={gestacao.status}
            fim={gestacao.fim ?? ""}
            numero={index + 1}
            onClick={() => setGestacao(gestacao.id)} // Seleciona a gestação ao clicar
            onDelete={() => deleteGestacao.mutate(gestacao.id)} // Exclui a gestação
          />
        ))}
      </div>
    </div>
  );
}

export default GestacaoHistorico;