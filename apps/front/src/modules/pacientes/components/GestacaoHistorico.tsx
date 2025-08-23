import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Title from "antd/es/typography/Title";
import { useEffect, useState } from "react";
import {
    useCreateGestacao,
    useDeleteGestacao,
    useUpdateGestacao,
} from "../hooks/gestacaoHooks";
import { usePacienteContext } from "../hooks/useContext";
import GestacaoCreateModal from "../modals/GestacaoCreateModal";
import GestacaoEditModal from "../modals/GestacaoEditModal";
import type { Gestacao, GestacaoCreateFormData } from "../types";
import GestacaoInfoCard from "./GestacaoInfoCard";

interface GestacaoHistoricoProps {
    gestacoes: Gestacao[];
    pacienteId: string;
}

const GestacaoHistorico: React.FC<GestacaoHistoricoProps> = ({
    gestacoes,
    pacienteId,
}) => {
    const { gestacaoId, setGestacao } = usePacienteContext();
    const createGestacao = useCreateGestacao();
    const deleteGestacao = useDeleteGestacao();
    const updateGestacao = useUpdateGestacao();

    const [editModalVisible, setEditModalVisible] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [gestacaoToEdit, setGestacaoToEdit] = useState<Gestacao | null>(null);

    useEffect(() => {
        if (gestacoes.length > 0) {
            setGestacao(gestacoes[0].id);
        }
    }, [gestacoes, setGestacao]);

    const handleEditGestacao = (gestacao: Gestacao) => {
        setGestacaoToEdit(gestacao);
        setEditModalVisible(true);
    };

    const handleCreateGestacao = () => {
        setCreateModalVisible(true);
    };

    const handleCreateSubmit = (data: GestacaoCreateFormData) => {
        createGestacao.mutate(
            { ...data, pacienteId },
            {
                onSuccess: () => {
                    setCreateModalVisible(false);
                },
            },
        );
    };

    const handleUpdateSubmit = (data: GestacaoCreateFormData) => {
        if (gestacaoToEdit) {
            updateGestacao.mutate(
                { id: gestacaoToEdit.id, data },
                {
                    onSuccess: () => {
                        setEditModalVisible(false);
                        setGestacaoToEdit(null);
                    },
                },
            );
        }
    };

    const handleCancelEdit = () => {
        setEditModalVisible(false);
        setGestacaoToEdit(null);
    };

    const handleCancelCreate = () => {
        setCreateModalVisible(false);
    };

    return (
        <div className="flex-1 flex flex-col bg-white rounded-lg h-full gap-4 p-4">
            <div className="flex items-center justify-between">
                <Title className="!m-0" level={5}>
                    Gestações
                </Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleCreateGestacao}
                >
                    Cadastrar Gestação
                </Button>
            </div>
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
                        onUpdate={() => handleEditGestacao(gestacao)}
                    />
                ))}
            </div>

            <GestacaoCreateModal
                visible={createModalVisible}
                onCancel={handleCancelCreate}
                onSubmit={handleCreateSubmit}
                initialValues={undefined}
            />

            <GestacaoEditModal
                visible={editModalVisible}
                onCancel={handleCancelEdit}
                onSubmit={handleUpdateSubmit}
                initialValues={
                    gestacaoToEdit
                        ? {
                              inicio: gestacaoToEdit.inicio,
                              fim: gestacaoToEdit.fim || "",
                              status: "Pendente",
                              pacienteId: gestacaoToEdit.pacienteId,
                          }
                        : undefined
                }
            />
        </div>
    );
};

export default GestacaoHistorico;
