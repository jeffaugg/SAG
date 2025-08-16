// Importa componentes e hooks necessários para exibir o histórico de gestações
import Title from "antd/es/typography/Title";
import { useEffect } from "react";
import { useDeleteGestacao } from "../hooks/gestacaoHooks";
import { usePacienteContext } from "../hooks/useContext";
import type { Gestacao } from "../types";
import GestacaoInfoCard from "./GestacaoInfoCard";

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
    const { gestacaoId, setGestacao } = usePacienteContext();
    const deleteGestacao = useDeleteGestacao();

    useEffect(() => {
        if (gestacoes.length > 0) {
            setGestacao(gestacoes[0].id);
        }
    }, [gestacoes, setGestacao]);

    return (
        <div className="flex-1 flex flex-col bg-white rounded-lg h-full gap-4 p-4">
            <Title className="!m-0" level={3}>
                Histórico de Gestações
            </Title>
            <div className="flex flex-col gap-2.5">
                {gestacoes.map((gestacao, index) => (
                    <GestacaoInfoCard
                        key={gestacao.id}
                        inicio={gestacao.inicio}
                        status={gestacao.status}
                        fim={gestacao.fim ?? ""}
                        numero={index + 1}
                        isSelected={gestacaoId === gestacao.id}
                        onClick={() => setGestacao(gestacao.id)}
                        onDelete={() => deleteGestacao.mutate(gestacao.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default GestacaoHistorico;
