import { Button, Form, Input, Modal, Space } from "antd";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { formatCNES, formatPhone } from "../../../utils/formatters";
import type { UBSFormData } from "../types";

interface UBSModalProps {
    visible: boolean;
    editingId: string | null;
    onCancel: () => void;
    onSubmit: (data: UBSFormData) => void;
    loading: boolean;
    initialValues?: UBSFormData;
}

const UBSModal: React.FC<UBSModalProps> = ({
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
    } = useForm<UBSFormData>();

    React.useEffect(() => {
        if (visible) {
            reset(
                initialValues || {
                    cnes: "",
                    nome: "",
                    localizacao: "",
                    contato: "",
                },
            );
        }
    }, [visible, initialValues, reset]);

    return (
        <Modal
            title={editingId ? "Editar UBS" : "Nova UBS"}
            open={visible}
            onCancel={onCancel}
            footer={null}
            destroyOnClose
        >
            <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                <Form.Item
                    label="CNES"
                    validateStatus={errors.cnes ? "error" : ""}
                    help={errors.cnes?.message}
                >
                    <Controller
                        name="cnes"
                        control={control}
                        rules={{
                            required: "CNES é obrigatório",
                            pattern: {
                                value: /^\d{7}$/,
                                message:
                                    "CNES deve conter exatamente 7 dígitos",
                            },
                        }}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="Digite o CNES"
                                maxLength={7}
                                onChange={(e) => {
                                    const formatted = formatCNES(
                                        e.target.value,
                                    );
                                    field.onChange(formatted);
                                }}
                            />
                        )}
                    />
                </Form.Item>

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
                                value: 2,
                                message:
                                    "Nome deve ter pelo menos 2 caracteres",
                            },
                        }}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="Digite o nome da UBS"
                            />
                        )}
                    />
                </Form.Item>

                <Form.Item
                    label="Localização"
                    validateStatus={errors.localizacao ? "error" : ""}
                    help={errors.localizacao?.message}
                >
                    <Controller
                        name="localizacao"
                        control={control}
                        rules={{
                            required: "Localização é obrigatória",
                        }}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="Digite a localização"
                            />
                        )}
                    />
                </Form.Item>

                <Form.Item
                    label="Contato"
                    validateStatus={errors.contato ? "error" : ""}
                    help={errors.contato?.message}
                >
                    <Controller
                        name="contato"
                        control={control}
                        rules={{
                            required: "Contato é obrigatório",
                            pattern: {
                                value: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
                                message:
                                    "Formato inválido. Use: (XX) XXXXX-XXXX",
                            },
                        }}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="(XX) XXXXX-XXXX"
                                maxLength={15}
                                onChange={(e) => {
                                    const formatted = formatPhone(
                                        e.target.value,
                                    );
                                    field.onChange(formatted);
                                }}
                            />
                        )}
                    />
                </Form.Item>

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

export default UBSModal;
