import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input, Modal, Select, Space, Table } from "antd";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { CpfHookFormInput } from "../../../components";
import type { Usuario } from "../../auth/schemas/auth.schemas";
import { cargoSchema, cpfSchema } from "../../auth/schemas/auth.schemas";
import {
    useCreateUsuario,
    useDeleteUsuario,
    useUpdateUsuario,
    useUsuarios,
} from "../hooks/usuariosHooks";

const usuarioSchema = z.object({
    nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    cargo: cargoSchema,
    cpf: cpfSchema,
    senha: z
        .string()
        .min(8, "Senha deve ter pelo menos 8 caracteres")
        .optional(),
});

type UsuarioFormData = z.infer<typeof usuarioSchema>;

const Usuarios = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<Usuario | null>(null);

    const { data: usuarios, isLoading } = useUsuarios();
    const createUsuario = useCreateUsuario();
    const updateUsuario = useUpdateUsuario();
    const deleteUsuario = useDeleteUsuario();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UsuarioFormData>({
        resolver: zodResolver(usuarioSchema),
    });

    const columns = [
        {
            title: "Nome",
            dataIndex: "nome",
            key: "nome",
        },
        {
            title: "CPF",
            dataIndex: "cpf",
            key: "cpf",
        },
        {
            title: "Cargo",
            dataIndex: "cargo",
            key: "cargo",
        },
        {
            title: "Ações",
            key: "actions",
            render: (_: unknown, record: Usuario) => (
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

    const handleEdit = (user: Usuario) => {
        setEditingUser(user);
        reset({
            nome: user.nome,
            cargo: user.cargo,
            cpf: user.cpf,
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: "Confirmar exclusão",
            content: "Tem certeza que deseja excluir este usuário?",
            onOk: () => deleteUsuario.mutate(id),
        });
    };

    const onSubmit = (data: UsuarioFormData) => {
        if (editingUser) {
            updateUsuario.mutate(
                { id: editingUser.id, data },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        setEditingUser(null);
                        reset();
                    },
                },
            );
        } else {
            createUsuario.mutate(data as UsuarioFormData & { senha: string }, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        reset();
    };

    return (
        <div>
            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Usuários</h1>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalOpen(true)}
                >
                    Novo Usuário
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={usuarios}
                loading={isLoading}
                rowKey="id"
            />

            <Modal
                title={editingUser ? "Editar Usuário" : "Novo Usuário"}
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
                        label="Cargo"
                        validateStatus={errors.cargo ? "error" : ""}
                    >
                        <Controller
                            name="cargo"
                            control={control}
                            render={({ field }) => (
                                <Select {...field}>
                                    <Select.Option value="Enfermeiro">
                                        Enfermeiro
                                    </Select.Option>
                                    <Select.Option value="Medico">
                                        Médico
                                    </Select.Option>
                                    <Select.Option value="ADM">
                                        Administrador
                                    </Select.Option>
                                </Select>
                            )}
                        />
                        {errors.cargo && (
                            <span className="text-red-500">
                                {errors.cargo.message}
                            </span>
                        )}
                    </Form.Item>

                    <Form.Item
                        label="CPF"
                        validateStatus={errors.cpf ? "error" : ""}
                    >
                        <CpfHookFormInput
                            name="cpf"
                            control={control}
                            label="CPF"
                        />
                        {errors.cpf && (
                            <span className="text-red-500">
                                {errors.cpf.message}
                            </span>
                        )}
                    </Form.Item>

                    {!editingUser && (
                        <Form.Item
                            label="Senha"
                            validateStatus={errors.senha ? "error" : ""}
                        >
                            <Controller
                                name="senha"
                                control={control}
                                render={({ field }) => (
                                    <Input.Password {...field} />
                                )}
                            />
                            {errors.senha && (
                                <span className="text-red-500">
                                    {errors.senha.message}
                                </span>
                            )}
                        </Form.Item>
                    )}

                    <Form.Item>
                        <Space>
                            <Button onClick={handleCancel}>Cancelar</Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={
                                    createUsuario.isPending ||
                                    updateUsuario.isPending
                                }
                            >
                                {editingUser ? "Atualizar" : "Criar"}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Usuarios;
