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
import PoliclinicaModal from "../components/PoliclinicaModal";
import { usePoliclinicas } from "../hooks/policlinicasHooks";
import { usePoliclinicaForm } from "../hooks/usePoliclinicaForm";
import type { Policlinica } from "../types";

const { Title } = Typography;

const Policlinicas: React.FC = () => {
    const {
        isModalVisible,
        editingPoliclinica,
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
    } = usePoliclinicaForm();

    const {
        data: policlinicaResponse,
        isLoading,
        error,
    } = usePoliclinicas({
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchQuery,
    });

    const policlinicasList = policlinicaResponse?.data || [];
    const meta = policlinicaResponse?.meta;

    useEffect(() => {
        if (error) {
            const appError = handleError(error);
            ToastService.error(
                `Erro ao carregar policlínicas: ${appError.message}`,
            );
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
                render: (_: unknown, record: Policlinica) => (
                    <Space size="middle">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => openEditModal(record)}
                        />
                        <Popconfirm
                            title="Tem certeza que deseja excluir esta policlínica?"
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

    const showEmptyState = !policlinicasList.length && !isLoading;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <Title level={4}>Gerenciar Policlínicas</Title>

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
                        Cadastrar Policlínica
                    </Button>
                </Space>
            </div>
            {showEmptyState ? (
                <div>
                    <Typography.Text type="secondary">
                        Nenhuma policlínica cadastrada. Clique em "Cadastrar
                        Policlínica" para adicionar a primeira.
                    </Typography.Text>
                </div>
            ) : (
                <Table
                    columns={columns}
                    dataSource={policlinicasList}
                    rowKey="id"
                    loading={isLoading}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: meta?.totalItems || 0,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} de ${total} policlínicas`,
                        onChange: (page, pageSize) =>
                            setPagination({ current: page, pageSize }),
                        onShowSizeChange: (_, size) =>
                            setPagination({ current: 1, pageSize: size }),
                    }}
                />
            )}

            <PoliclinicaModal
                visible={isModalVisible}
                editingId={editingPoliclinica?.id || null}
                onCancel={closeModal}
                onSubmit={handleSubmit}
                loading={isSubmitting}
                initialValues={
                    editingPoliclinica
                        ? {
                              cnes: editingPoliclinica.cnes,
                              nome: editingPoliclinica.nome,
                              localizacao: editingPoliclinica.localizacao,
                              contato: editingPoliclinica.contato,
                          }
                        : undefined
                }
            />
        </div>
    );
};

export default Policlinicas;
