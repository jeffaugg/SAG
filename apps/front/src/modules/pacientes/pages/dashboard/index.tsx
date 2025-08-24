import { DeleteOutlined, EditOutlined, LinkOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Popconfirm, Space, Table, Typography } from "antd";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { handleError } from "../../../../utils/error-handler";
import ToastService from "../../../../utils/toast-service";
import { usePaciente } from "../../hooks/pacienteHooks";
import { usePacienteForm } from "../../hooks/usePacienteForm";
import PacienteModal from "../../modals/PacienteModal";
import type { Paciente } from "../../types";
import EncaminharPacienteModal from "../../modals/EncaminharPacienteModal";

const { Title } = Typography;

const Paciente : React.FC = () => {
    const navigate = useNavigate();
    const {
        pagination,
        searchText,
        searchQuery,
        openModal,
        openEditModal,
        setPagination,
        setSearchText,
        handleSearch,
        clearSearch,
        handleDelete,
        isDeleting,
        openEncaminharModal,
        isSubmitting,
        isModalEncaminharVisible,
        isModalVisible,
        closeModal,
        editingPaciente,
        selectedPaciente,
        handleSubmit,
        handleEncaminhar,
        closeEncaminharModal
    } = usePacienteForm();


    const { data: pacientes, isLoading, error } = usePaciente({
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchQuery,
    });

    const pacientesList = pacientes?.data || [];
    const meta = pacientes?.meta;

    useEffect(() => {
            if (error) {
                const appError = handleError(error);
                ToastService.error(`Erro ao carregar Pacientes: ${appError.message}`);
            }
        }, [error]);

    const columns = useMemo(
        () => [
            { title: "Nome", dataIndex: "nome", key: "nome" },
            { title: "CPF", dataIndex: "cpf", key: "cpf"},
            {
                title: "Telefone",
                dataIndex: "telefone",
                key: "telefone",
            },
            {
                title: "Endereço",
                dataIndex: "endereco",
                key: "endereco",
            },
            {
                title: "Ações",
                key: "actions",
                width: 150,
                render: (_: unknown, record: Paciente) => (
                    <Space size="middle" onClick={(e) => e.stopPropagation()}>
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(record);
                            }}
                        />
                        <Popconfirm
                            title="Tem certeza que deseja excluir esta UBS?"
                            onConfirm={() => handleDelete(record.id)}
                            okText="Sim"
                            cancelText="Não"
                            onCancel={(e) => e?.stopPropagation()}
                        >
                            <Button
                                danger
                                type="text"
                                icon={<DeleteOutlined />}
                                loading={isDeleting}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </Popconfirm>
                        <Button
                            color="primary"
                            variant="text"
                            icon={<LinkOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                openEncaminharModal(record);
                            }}
                            title="Vincular usuário"
                        />
                    </Space>
                ),
            },
        ],
        [ openEditModal, handleDelete, isDeleting, openEncaminharModal ],
    );


  return (
    <div className="flex flex-col gap-6" >
      <div className="flex items-center justify-between">
        <Title level={4}>Gerenciar Pacientes</Title>

        <Space>
             <Input
                    placeholder="Buscar por nome ou CPF..."
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onPressEnter={handleSearch}
                    style={{ width: 250 }}
                    allowClear
                    onClear={clearSearch}
                    />
                <Button
                    type="default"
                    icon={<SearchOutlined />}
                    onClick={handleSearch}
                />
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={openModal}
                >
                    Cadastrar Paciente
                </Button>
        </Space>
      </div>

      
        {(!pacientesList.length && !isLoading) ? (
          <Typography.Text type="secondary">
            Nenhum paciente encontrado.
          </Typography.Text>
        ) : (
            <Table
                columns={columns}
                dataSource={pacientesList}
                rowKey="id"
                loading={isLoading}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: meta?.totalItems,
                    showSizeChanger: true,
                    showTotal: (total, range) =>
                            `${range[0]}-${range[1]} de ${total} Pacientes`,
                    onChange: (page, pageSize) =>
                            setPagination({ current: page, pageSize }),
                        onShowSizeChange: (_, size) =>
                            setPagination({ current: 1, pageSize: size }),
                }}
                onRow={(record) => ({
                    onClick: () => navigate(`/pacientes/${record.id}`),
                })}
            />
        )}

        <PacienteModal
                visible={isModalVisible}
                editingId={editingPaciente?.id || null}
                onCancel={closeModal}
                onSubmit={handleSubmit}
                loading={isSubmitting}
                initialValues={
                    editingPaciente
                        ? {
                              cpf: editingPaciente.cpf,
                              nome: editingPaciente.nome,
                              endereco: editingPaciente.endereco,
                              telefone: editingPaciente.telefone,
                          }
                        : undefined
                }
            />

        <EncaminharPacienteModal
                visible={isModalEncaminharVisible && !!selectedPaciente}
                onCancel={closeEncaminharModal}
                onSubmit={handleEncaminhar}
                loading={isSubmitting}
            />
      </div>
  );
};

export default Paciente;