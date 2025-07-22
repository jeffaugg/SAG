import { Controller, useForm } from "react-hook-form";
import type { PacienteFormData } from "../types";
import React from "react";
import { Button, Form, Input, Modal } from "antd";

interface PacienteModalProps {
    visible: boolean;
    editingId: string | null;
    onCancel: () => void;
    onSubmit: (data: PacienteFormData) => void;
    loading: boolean;
    initialValues?: PacienteFormData;

}

const PacienteModal: React.FC <PacienteModalProps> = ({
    visible,
    editingId,
    onCancel,
    onSubmit,
    loading,
    initialValues,
}) => {
    const { control, handleSubmit, formState: {errors}, reset } = useForm<PacienteFormData>();

    React.useEffect(() => {
        if (visible) {
            reset(
                initialValues || {
                    nome: "",
                    cpf: "",
                    telefone: "",
                    endereco: "",
                },
            );
        }
    }, [visible, initialValues, reset]);


    return (
        <Modal
            title={editingId ? "Editar Paciente" : "Novo Paciente"}
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
                        render={({ field }) => (
                            <Input {...field} placeholder="Nome do Paciente" />
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
                        render={({ field }) => (
                            <Input {...field} placeholder="CPF do Paciente" />
                        )}
                    />
                </Form.Item>
                <Form.Item
                    label="Telefone"
                    validateStatus={errors.telefone ? "error" : ""}
                    help={errors.telefone?.message}
                >
                    <Controller
                        name="telefone"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} placeholder="Telefone do Paciente" />
                        )}
                    />
                </Form.Item>
                <Form.Item
                    label="Endereço"
                    validateStatus={errors.endereco ? "error" : ""}
                    help={errors.endereco?.message}
                >
                    <Controller
                        name="endereco"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} placeholder="Endereço do Paciente" />
                        )}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {editingId ? "Salvar Alterações" : "Cadastrar Paciente"}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}   

export default PacienteModal;
