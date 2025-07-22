import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Popconfirm, Space,  Table,  Typography } from "antd";
import React, { lazy, useMemo } from "react";
import type { Paciente } from "../../types";
const { Title } = Typography;
const PacientePerfil = lazy(
    () => import("../../components/PacientePerfil"),
);

const GestacaoHistorico = lazy(
    () => import("../../components/GestacaoHistorico"),
);
const PacienteDetalhes : React.FC = () => {
    const columns = useMemo(
        () => [
            { title: "Consulta", dataIndex: "consulta", key: "consulta" },
            { title: "Data", dataIndex: "data", key: "data"},
            {
                title: "Médico Responsável",
                dataIndex: "telefone",
                key: "telefone",
            },
            {
                title: "UBS/Policlinica",
                dataIndex: "endereco",
                key: "endereco",
            },
            {
                title: "Ações",
                key: "actions",
                width: 150,
                render: (_: unknown, record: Paciente) => (
                    <Space size="middle">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                        />
                        <Popconfirm
                            title="Tem certeza que deseja excluir esta UBS?"
                            okText="Sim"
                            cancelText="Não"
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
                <div className="w-80 flex flex-col bg-white rounded-md">
                    <PacientePerfil />
                    <div className="flex-1 overflow-auto shadow-lg mt-5">
                        <GestacaoHistorico />
                    </div>
                </div>

                <div className="flex flex-col flex-1 bg-white rounded-lg shadow-md">
                    <div className="flex items-center justify-between px-4 py-4">
                        <Title level={4}>Consultas</Title>
                        <Space>
                            <Input
                                    placeholder="Buscar por nome ou CPF..."
                                    prefix={<SearchOutlined />}
                                    style={{ width: 250 }}
                                    allowClear
                                    />
                                <Button
                                    type="default"
                                    icon={<SearchOutlined />}
                                />
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                >
                                    Cadastrar Paciente
                                </Button>
                        </Space>
                    </div>
                    <div className="flex-1 overflow-auto p-4">
                        <Table columns={columns} rowKey="id" />
                    </div>
                </div>
            </div>
  );
};

export default PacienteDetalhes;


