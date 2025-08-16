import {
    DeleteOutlined,
    EyeOutlined,
    PlusOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import {
    Button,
    Input,
    Popconfirm,
    Space,
    Spin,
    Table,
    Typography,
} from "antd";
import React, { lazy, Suspense, useMemo } from "react";
import {
    useConsultasByGestacaoID,
    useGestacaoByPacienteID,
} from "../../hooks/gestacaoHooks";
import { usePacienteById } from "../../hooks/pacienteHooks";
import { useConsultaForm } from "../../hooks/useConsultaForm";
import { usePacienteContext } from "../../hooks/useContext";
import ConsultaDetailsModal from "../../modals/ConsultaDetailsModal";
import ConsultaModal from "../../modals/ConsultaModal";
import type {
    AtendimentoDetails,
    Consulta,
    GestacaoCreateFormData,
} from "../../types";

import GestacaoCreateModal from "../../modals/GestacaoCreateModal";

const { Title } = Typography;

const PacientePerfil = lazy(() => import("../../components/PacientePerfil"));
const GestacaoHistorico = lazy(
    () => import("../../components/GestacaoHistorico"),
);
interface PacienteDetalhesContentProps {
    pacienteId: string;
}

const PacienteDetalhesContent: React.FC<PacienteDetalhesContentProps> = ({
    pacienteId,
}) => {
    const {
        isModalVisible,
        openModal,
        closeModal,
        pagination,
        handleSubmit,
        setPagination,
        handleDelete,
        handleGestacaoSubmit,
    } = useConsultaForm();

    const { gestacaoId } = usePacienteContext();

    const { data: gestacoesResponse } = useGestacaoByPacienteID(pacienteId);
    const { data: pacienteResponse } = usePacienteById(pacienteId);
    const { data: consultasResponse, isLoading } = useConsultasByGestacaoID({
        gestacaoId: gestacaoId ?? "",
        page: pagination.current,
        limit: pagination.pageSize,
    });

    //   TODO: refactor
    // --- //

    const [isDetailsModalVisible, setIsDetailsModalVisible] =
        React.useState(false);
    const [selectedConsulta, setSelectedConsulta] =
        React.useState<Consulta | null>(null);

    const [isCreateGestacaoModalVisible, setIsCreateGestacaoModalVisible] =
        React.useState(false);

    const openCreateGestacaoModal = () => {
        setIsCreateGestacaoModalVisible(true);
    };

    const handleGestacaoSubmitWithPaciente = (data: GestacaoCreateFormData) => {
        handleGestacaoSubmit({ ...data, pacienteId });
    };

    const handleViewConsulta = (consulta: Consulta) => {
        setSelectedConsulta(consulta);
        setIsDetailsModalVisible(true);
    };

    const atendimentoDetails: AtendimentoDetails | undefined = selectedConsulta
        ? {
              data: selectedConsulta.createdAt,
              medico: selectedConsulta.medico?.nome ?? "",
              unidade:
                  selectedConsulta.ubs?.nome ||
                  selectedConsulta.policlinica?.nome ||
                  "",
              descricao: selectedConsulta.descricao ?? "",
              file:
                  selectedConsulta.AtendimentoArquivo?.map(
                      (a) => a.arquivoUrl,
                  ) ?? [],
          }
        : undefined;

    // --- //

    const columns = useMemo(
        () => [
            {
                title: "Data",
                dataIndex: "createdAt",
                key: "createdAt",
                render: (value: string) =>
                    new Date(value).toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    }),
            },
            {
                title: "Médico",
                dataIndex: ["medico", "nome"],
                key: "medico",
            },
            {
                title: "Unidade",
                key: "unidade",
                render: (_: any, record: Consulta) =>
                    record.ubs?.nome || record.policlinica?.nome || "",
            },
            {
                title: "Ações",
                key: "actions",
                width: 150,
                fixed: "right" as const,
                render: (_: unknown, record: Consulta) => (
                    <Space size="middle">
                        <Button
                            onClick={() => handleViewConsulta(record)}
                            type="text"
                            icon={<EyeOutlined />}
                        />
                        <Popconfirm
                            title="Excluir consulta?"
                            okText="Sim"
                            cancelText="Não"
                            onConfirm={() => handleDelete(record.id)}
                        >
                            <Button
                                danger
                                type="text"
                                icon={<DeleteOutlined />}
                            />
                        </Popconfirm>
                    </Space>
                ),
            },
        ],
        [],
    );

    return (
        <div className="flex h-full gap-4">
            <div className="w-80 flex flex-col  rounded-md">
                <Suspense fallback={<Spin />}>
                    <PacientePerfil
                        cpf={pacienteResponse?.cpf ?? ""}
                        telefone={pacienteResponse?.telefone ?? ""}
                        nome={pacienteResponse?.nome ?? ""}
                    />
                </Suspense>
                <div className="flex-1 overflow-auto  mt-5">
                    <Suspense fallback={<Spin />}>
                        <GestacaoHistorico
                            gestacoes={gestacoesResponse ?? []}
                        />
                    </Suspense>
                </div>
            </div>

            <div className="flex flex-col flex-1 bg-white rounded-lg ">
                <div className="flex items-center justify-between px-4 py-4">
                    <Title level={4}>Consultas</Title>
                    <Space>
                        <Input
                            placeholder="Buscar por nome ou CPF..."
                            prefix={<SearchOutlined />}
                            style={{ width: 250 }}
                            allowClear
                        />
                        <Button type="default" icon={<SearchOutlined />} />
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={openModal}
                        >
                            Cadastrar Atendimento
                        </Button>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={openCreateGestacaoModal}
                        >
                            Cadastrar Gestação
                        </Button>
                    </Space>
                </div>
                <div className="flex-1 overflow-auto p-4">
                    <Table
                        columns={columns}
                        rowKey="id"
                        loading={isLoading}
                        dataSource={consultasResponse?.data ?? []}
                        pagination={{
                            current: pagination.current,
                            pageSize: pagination.pageSize,
                            total: consultasResponse?.meta.totalItems,
                            showSizeChanger: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} de ${total} Pacientes`,
                            onChange: (page, pageSize) =>
                                setPagination({ current: page, pageSize }),
                            onShowSizeChange: (_, size) =>
                                setPagination({ current: 1, pageSize: size }),
                        }}
                    />
                </div>
            </div>

            <GestacaoCreateModal
                visible={isCreateGestacaoModalVisible}
                onCancel={() => setIsCreateGestacaoModalVisible(false)}
                onSubmit={handleGestacaoSubmitWithPaciente}
                initialValues={undefined}
            />

            <ConsultaDetailsModal
                visible={isDetailsModalVisible}
                onCancel={() => setIsDetailsModalVisible(false)}
                initialValues={atendimentoDetails}
            />

            <ConsultaModal
                visible={isModalVisible}
                onCancel={closeModal}
                onSubmit={handleSubmit}
                initialValues={undefined}
            />
        </div>
    );
};

export default PacienteDetalhesContent;
