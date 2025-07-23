import React, { lazy, useMemo, Suspense } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Popconfirm, Space, Table, Typography, Spin } from "antd";
import type { Consulta } from "../../types";
import { usePacienteById } from "../../hooks/pacienteHooks";
import { useConsultasByGestacaoID, useGestacaoByPacienteID } from "../../hooks/gestacaoHooks";
import { usePacienteContext } from "../../hooks/useContext";

const { Title } = Typography;
const PacientePerfil = lazy(() => import("../../components/PacientePerfil"));
const GestacaoHistorico = lazy(() => import("../../components/GestacaoHistorico"));

interface PacienteDetalhesContentProps {
  pacienteId: string;
}

const PacienteDetalhesContent: React.FC<PacienteDetalhesContentProps> = ({ pacienteId }) => {
  const { gestacaoId } = usePacienteContext();

  const { data: gestacoesResponse } = useGestacaoByPacienteID(pacienteId);
  const { data: pacienteResponse } = usePacienteById(pacienteId);
  const { data: consultasResponse, isLoading } = useConsultasByGestacaoID({
    gestacaoId: gestacaoId ?? "",
    page: 1,
    limit: 10,
  });

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
        dataIndex: ["unidade", "nome"],
        key: "unidade",
      },
      {
        title: "Ações",
        key: "actions",
        width: 150,
        fixed: "right" as const,
        render: (_: unknown, record: Consulta) => (
          <Space size="middle">
            <Button type="text" icon={<EditOutlined />} />
            <Popconfirm title="Excluir consulta?" okText="Sim" cancelText="Não">
              <Button danger type="text" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        ),
      },
    ],
    []
  );

  return (
    <div className="flex h-full gap-4">
      <div className="w-80 flex flex-col bg-white rounded-md">
        <Suspense fallback={<Spin />}>
          <PacientePerfil
            cpf={pacienteResponse?.cpf ?? ""}
            telefone={pacienteResponse?.telefone ?? ""}
            nome={pacienteResponse?.nome ?? ""}
          />
        </Suspense>
        <div className="flex-1 overflow-auto shadow-lg mt-5">
          <Suspense fallback={<Spin />}>
            <GestacaoHistorico gestacoes={gestacoesResponse ?? []} />
          </Suspense>
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
            <Button type="default" icon={<SearchOutlined />} />
            <Button type="primary" icon={<PlusOutlined />}>
              Cadastrar Consulta
            </Button>
          </Space>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <Table
            columns={columns}
            rowKey="id"
            loading={isLoading}
            dataSource={consultasResponse?.data ?? []}
          />
        </div>
      </div>
    </div>
  );
};

export default PacienteDetalhesContent;
