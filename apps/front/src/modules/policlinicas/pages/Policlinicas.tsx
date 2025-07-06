import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input, Modal, Space, Table } from "antd";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import type { Policlinica } from "../../auth/schemas/auth.schemas";
import {
    useCreatePoliclinica,
    useDeletePoliclinica,
    usePoliclinicas,
    useUpdatePoliclinica,
} from "../hooks/policlinicasHooks";

const policlinicaSchema = z.object({
    nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    contato: z.string().min(10, "Contato deve ter pelo menos 10 caracteres"),
    localizacao: z
        .string()
        .min(5, "Localização deve ter pelo menos 5 caracteres"),
    cnes: z.string().length(7, "CNES deve ter exatamente 7 caracteres"),
});

type PoliclinicaFormData = z.infer<typeof policlinicaSchema>;

const Policlinicas = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPoliclinica, setEditingPoliclinica] =
        useState<Policlinica | null>(null);

    const { data: policlinicas, isLoading } = usePoliclinicas();
    const createPoliclinica = useCreatePoliclinica();
    const updatePoliclinica = useUpdatePoliclinica();
    const deletePoliclinica = useDeletePoliclinica();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<PoliclinicaFormData>({
        resolver: zodResolver(policlinicaSchema),
    });

    const columns = [
        {
            title: "Nome",
            dataIndex: "nome",
            key: "nome",
        },
        {
            title: "CNES",
            dataIndex: "cnes",
            key: "cnes",
        },
        {
            title: "Localização",
            dataIndex: "localizacao",
            key: "localizacao",
        },
        {
            title: "Contato",
            dataIndex: "contato",
            key: "contato",
        },
        {
            title: "Ações",
            key: "actions",
            render: (_: unknown, record: Policlinica) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        size="small"
                    />
                    <Button
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                        danger
                        size="small"
                    />
                </Space>
            ),
        },
    ];

    const handleEdit = (policlinica: Policlinica) => {
        setEditingPoliclinica(policlinica);
        reset({
            nome: policlinica.nome,
            contato: policlinica.contato,
            localizacao: policlinica.localizacao,
            cnes: policlinica.cnes,
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: "Confirmar exclusão",
            content: "Tem certeza que deseja excluir esta policlínica?",
            onOk: () => deletePoliclinica.mutate(id),
        });
    };

    const onSubmit = (data: PoliclinicaFormData) => {
        if (editingPoliclinica) {
            updatePoliclinica.mutate(
                { id: editingPoliclinica.id, data },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        setEditingPoliclinica(null);
                        reset();
                    },
                },
            );
        } else {
            createPoliclinica.mutate(data, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingPoliclinica(null);
        reset();
    };

    return (
        <div>
            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Policlínicas</h1>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalOpen(true)}
                >
                    Nova Policlínica
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={policlinicas}
                loading={isLoading}
                rowKey="id"
            />

            <Modal
                title={
                    editingPoliclinica
                        ? "Editar Policlínica"
                        : "Nova Policlínica"
                }
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
                    <Form.Item
                        label="Nome"
                        validateStatus={errors.nome ? "error" : ""}
                    >
                        <Controller
                            name="nome"
                            control={control}
                            render={({ field }) => <Input {...field} />}
                        />
                        {errors.nome && (
                            <span className="text-red-500">
                                {errors.nome.message}
                            </span>
                        )}
                    </Form.Item>

                    <Form.Item
                        label="CNES"
                        validateStatus={errors.cnes ? "error" : ""}
                    >
                        <Controller
                            name="cnes"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} maxLength={7} />
                            )}
                        />
                        {errors.cnes && (
                            <span className="text-red-500">
                                {errors.cnes.message}
                            </span>
                        )}
                    </Form.Item>

                    <Form.Item
                        label="Localização"
                        validateStatus={errors.localizacao ? "error" : ""}
                    >
                        <Controller
                            name="localizacao"
                            control={control}
                            render={({ field }) => <Input {...field} />}
                        />
                        {errors.localizacao && (
                            <span className="text-red-500">
                                {errors.localizacao.message}
                            </span>
                        )}
                    </Form.Item>

                    <Form.Item
                        label="Contato"
                        validateStatus={errors.contato ? "error" : ""}
                    >
                        <Controller
                            name="contato"
                            control={control}
                            render={({ field }) => <Input {...field} />}
                        />
                        {errors.contato && (
                            <span className="text-red-500">
                                {errors.contato.message}
                            </span>
                        )}
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button onClick={handleCancel}>Cancelar</Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={
                                    createPoliclinica.isPending ||
                                    updatePoliclinica.isPending
                                }
                            >
                                {editingPoliclinica ? "Atualizar" : "Criar"}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Policlinicas;
