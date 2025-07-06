import { Button, Form, Input, Modal, Select, Space } from "antd";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { formatCpf } from "../../../utils/formatters";
import type { UsuarioFormData } from "../types";

interface UsuarioModalProps {
    visible: boolean;
    editingId: string | null;
    onCancel: () => void;
    onSubmit: (data: UsuarioFormData) => void;
    loading: boolean;
    initialValues?: UsuarioFormData;
}

const UsuarioModal: React.FC<UsuarioModalProps> = ({
    visible,
    editingId,
    onCancel,
    onSubmit,
    loading,
    initialValues,
}) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<UsuarioFormData>();

    React.useEffect(() => {
        if (visible) {
            reset(
                initialValues || {
                    nome: "",
                    cargo: "Enfermeiro",
                    cpf: "",
                    senha: "",
                },
            );
        }
    }, [visible, initialValues, reset]);

    return (
        <Modal
            title={editingId ? "Editar Usuário" : "Novo Usuário"}
            open={visible}
            onCancel={onCancel}
            footer={null}
            destroyOnClose
        >
            <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                <Form.Item
                    label="Nome"
                    validateStatus={errors.nome ? "error" : ""}
                    help={errors.nome?.message}
                >
                    <Controller
                        name="nome"
                        control={control}
                        rules={{
                            required: "Nome é obrigatório",
                            minLength: {
                                value: 3,
                                message:
                                    "Nome deve ter pelo menos 3 caracteres",
                            },
                        }}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="Digite o nome completo"
                            />
                        )}
                    />
                </Form.Item>

                <Form.Item
                    label="Cargo"
                    validateStatus={errors.cargo ? "error" : ""}
                    help={errors.cargo?.message}
                >
                    <Controller
                        name="cargo"
                        control={control}
                        rules={{
                            required: "Cargo é obrigatório",
                        }}
                        render={({ field }) => (
                            <Select {...field} placeholder="Selecione o cargo">
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
                </Form.Item>

                <Form.Item
                    label="CPF"
                    validateStatus={errors.cpf ? "error" : ""}
                    help={errors.cpf?.message}
                >
                    <Controller
                        name="cpf"
                        control={control}
                        rules={{
                            required: "CPF é obrigatório",
                            pattern: {
                                value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                                message:
                                    "Formato inválido. Use: XXX.XXX.XXX-XX",
                            },
                        }}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="XXX.XXX.XXX-XX"
                                maxLength={14}
                                onChange={(e) => {
                                    const formatted = formatCpf(e.target.value);
                                    field.onChange(formatted);
                                }}
                            />
                        )}
                    />
                </Form.Item>

                {!editingId && (
                    <Form.Item
                        label="Senha"
                        validateStatus={errors.senha ? "error" : ""}
                        help={errors.senha?.message}
                    >
                        <Controller
                            name="senha"
                            control={control}
                            rules={{
                                required: editingId
                                    ? false
                                    : "Senha é obrigatória",
                                minLength: {
                                    value: 8,
                                    message:
                                        "Senha deve ter pelo menos 8 caracteres",
                                },
                            }}
                            render={({ field }) => (
                                <Input.Password
                                    {...field}
                                    placeholder="Digite a senha"
                                />
                            )}
                        />
                    </Form.Item>
                )}

                <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
                    <Space>
                        <Button onClick={onCancel}>Cancelar</Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                        >
                            {editingId ? "Atualizar" : "Criar"}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UsuarioModal;
