import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { Button, Input, Popconfirm, Space, Table, Typography } from "antd";
import React, { useEffect, useMemo } from "react";
import { handleError } from "../../../utils/error-handler";
import { ToastService } from "../../../utils/toast-service";
import UBSModal from "../components/UBSModal";
import { useUBS } from "../hooks/ubsHooks";
import { useUBSForm } from "../hooks/useUBSForm";
import type { UBS } from "../types";

const { Title } = Typography;

const UBS: React.FC = () => {
    const {
        isModalVisible,
        editingUBS,
        isSubmitting,
        isDeleting,
        pagination,
        searchText,
        searchQuery,
        openModal,
        openEditModal,
        closeModal,
        handleDelete,
        handleSubmit,
        setPagination,
        setSearchText,
        handleSearch,
        clearSearch,
    } = useUBSForm();

    const {
        data: ubsResponse,
        isLoading,
        error,
    } = useUBS({
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchQuery,
    });

    const ubsList = ubsResponse?.data || [];
    const meta = ubsResponse?.meta;

    useEffect(() => {
        if (error) {
            const appError = handleError(error);
            ToastService.error(`Erro ao carregar UBS: ${appError.message}`);
        }
    }, [error]);

    const columns = useMemo(
        () => [
            { title: "CNES", dataIndex: "cnes", key: "cnes", width: 100 },
            { title: "Nome", dataIndex: "nome", key: "nome" },
            {
                title: "Localização",
                dataIndex: "localizacao",
                key: "localizacao",
                width: 400,
            },
            {
                title: "Contato",
                dataIndex: "contato",
                key: "contato",
                width: 150,
            },
            {
                title: "Ações",
                key: "actions",
                width: 150,
                render: (_: unknown, record: UBS) => (
                    <Space size="middle">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => openEditModal(record)}
                        />
                        <Popconfirm
                            title="Tem certeza que deseja excluir esta UBS?"
                            onConfirm={() => handleDelete(record.id)}
                            okText="Sim"
                            cancelText="Não"
                        >
                            <Button
                                danger
                                type="text"
                                icon={<DeleteOutlined />}
                                loading={isDeleting}
                            />
                        </Popconfirm>
                    </Space>
                ),
            },
        ],
        [openEditModal, handleDelete, isDeleting],
    );

    const showEmptyState = !ubsList.length && !isLoading;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <Title level={4}>Gerenciar UBS</Title>

                <Space>
                    <Input
                        placeholder="Buscar por nome ou CNES..."
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
                        Cadastrar UBS
                    </Button>
                </Space>
            </div>
            {showEmptyState ? (
                <div>
                    <Typography.Text type="secondary">
                        Nenhuma UBS cadastrada. Clique em "Nova UBS" para
                        adicionar a primeira.
                    </Typography.Text>
                </div>
            ) : (
                <Table
                    columns={columns}
                    dataSource={ubsList}
                    rowKey="id"
                    loading={isLoading}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: meta?.totalItems || 0,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} de ${total} UBS`,
                        onChange: (page, pageSize) =>
                            setPagination({ current: page, pageSize }),
                        onShowSizeChange: (_, size) =>
                            setPagination({ current: 1, pageSize: size }),
                    }}
                />
            )}

            <UBSModal
                visible={isModalVisible}
                editingId={editingUBS?.id || null}
                onCancel={closeModal}
                onSubmit={handleSubmit}
                loading={isSubmitting}
                initialValues={
                    editingUBS
                        ? {
                              cnes: editingUBS.cnes,
                              nome: editingUBS.nome,
                              localizacao: editingUBS.localizacao,
                              contato: editingUBS.contato,
                          }
                        : undefined
                }
            />
        </div>
    );
};

export default UBS;
