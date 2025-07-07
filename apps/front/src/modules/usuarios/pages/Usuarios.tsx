import {
    DeleteOutlined,
    LinkOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import {
    Button,
    Card,
    Empty,
    Input,
    Modal,
    Pagination,
    Popconfirm,
    Select,
    Space,
    Table,
    Typography,
} from "antd";
import { useEffect, useMemo } from "react";
import { formatCpf } from "../../../utils/formatters";
import { VincularUsuarioModal } from "../components";
import { useUsuarioForm } from "../hooks/useUsuarioForm";
import { useUsuarios } from "../hooks/usuariosHooks";
import type { Usuario } from "../types";

const { Title } = Typography;

const Usuarios: React.FC = () => {
    const {
        isModalVisible,
        selectedUsuario,
        isSubmitting,
        isDeleting,
        pagination,
        searchText,
        searchQuery,
        cargoFilter,
        openVincularModal,
        closeModal,
        handleDelete,
        handleVincular,
        setPagination,
        setSearchText,
        setCargoFilter,
        handleSearch,
        clearSearch,
    } = useUsuarioForm();

    const {
        data: usuarioResponse,
        isLoading,
        error,
    } = useUsuarios({
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchQuery,
        cargo: cargoFilter,
    });

    const usuariosList = usuarioResponse?.data || [];
    const meta = usuarioResponse?.meta;

    useEffect(() => {
        if (error) {
            Modal.error({
                title: "Erro ao carregar usuários",
                content: error.message,
            });
        }
    }, [error]);

    const columns = useMemo(
        () => [
            {
                title: "Nome",
                dataIndex: "nome",
                key: "nome",
            },
            {
                title: "CPF",
                dataIndex: "cpf",
                key: "cpf",
                width: 150,
                render: (cpf: string) => formatCpf(cpf),
            },
            {
                title: "Cargo",
                dataIndex: "cargo",
                key: "cargo",
                width: 120,
            },
            {
                title: "Ações",
                key: "actions",
                width: 150,
                render: (_: unknown, record: Usuario) => (
                    <Space size="middle">
                        <Popconfirm
                            title="Tem certeza que deseja excluir este usuário?"
                            onConfirm={() => handleDelete(record.id)}
                            okText="Sim"
                            cancelText="Não"
                        >
                            <Button
                                color="danger"
                                variant="text"
                                icon={<DeleteOutlined />}
                                loading={isDeleting}
                            />
                        </Popconfirm>
                        <Button
                            color="primary"
                            variant="text"
                            icon={<LinkOutlined />}
                            onClick={() => openVincularModal(record)}
                            title="Vincular usuário"
                        />
                    </Space>
                ),
            },
        ],
        [openVincularModal, handleDelete, isDeleting],
    );

    const showEmptyState = !usuariosList.length && !isLoading;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <Title level={4}>Usuários</Title>

                <Space>
                    <Input
                        placeholder="Buscar por nome, CPF ou cargo..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onPressEnter={handleSearch}
                        style={{ flex: 1 }}
                    />
                    <Select
                        placeholder="Filtrar por cargo"
                        value={cargoFilter}
                        onChange={setCargoFilter}
                        allowClear
                        onClear={clearSearch}
                        style={{ width: 180 }}
                    >
                        <Select.Option value="Enfermeiro">
                            Enfermeiro
                        </Select.Option>
                        <Select.Option value="Medico">Médico</Select.Option>
                        <Select.Option value="ADM">Administrador</Select.Option>
                    </Select>
                    <Button
                        type="default"
                        icon={<SearchOutlined />}
                        onClick={handleSearch}
                    />
                </Space>
            </div>
            {showEmptyState ? (
                <Card>
                    <Empty
                        description={
                            searchQuery || cargoFilter
                                ? "Nenhum usuário encontrado"
                                : "Nenhum usuário cadastrado"
                        }
                    />
                </Card>
            ) : (
                <>
                    <Table
                        columns={columns}
                        dataSource={usuariosList}
                        loading={isLoading}
                        rowKey="id"
                        pagination={false}
                    />
                    {meta && meta.totalPages > 1 && (
                        <div
                            style={{
                                textAlign: "center",
                                marginTop: "16px",
                            }}
                        >
                            <Pagination
                                current={pagination.current}
                                pageSize={pagination.pageSize}
                                total={meta.totalItems}
                                onChange={(page, pageSize) =>
                                    setPagination({ current: page, pageSize })
                                }
                                showSizeChanger
                                showQuickJumper
                                showTotal={(total, range) =>
                                    `${range[0]}-${range[1]} de ${total} usuários`
                                }
                            />
                        </div>
                    )}
                </>
            )}
            <VincularUsuarioModal
                visible={isModalVisible}
                usuarioId={selectedUsuario?.id || null}
                onCancel={closeModal}
                onSubmit={handleVincular}
                loading={isSubmitting}
            />
        </div>
    );
};

export default Usuarios;
