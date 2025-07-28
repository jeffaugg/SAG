import { Button, DatePicker, Form, Modal } from "antd";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import React from "react";
import { Controller, useForm } from "react-hook-form";
import type { GestacaoCreateFormData } from '../types';

dayjs.extend(customParseFormat);

const dateFormat = 'DD/MM/YYYY';

interface GestacaoModalProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (data: GestacaoCreateFormData) => void;
    initialValues?: GestacaoCreateFormData;
}

const GestacaoCreateModal: React.FC<GestacaoModalProps> = ({
    visible,
    onCancel,
    onSubmit,
    initialValues,
}) => {

    const { control, handleSubmit, formState: { errors }, reset } = useForm<GestacaoCreateFormData>();

    React.useEffect(() => {
        if (visible) {
            reset(
                initialValues || {
                    inicio: "",
                    fim: "",
                    status: "Pendente",
                    pacienteId: "",
                },
            );
        }
    }, [visible, initialValues, reset]);

    return (
        <Modal
            title="Criar Gestação"
            open={visible}
            onCancel={onCancel}
            footer={null}
            destroyOnClose
        >
            <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                <Form.Item label="Data de Início" required={true}>
                    <Controller
                        name="inicio"
                        control={control}
                        rules={{ required: "A data de início é obrigatória" }}
                        render={({ field }) => (
                            <DatePicker format={dateFormat} {...field} style={{ width: "100%" }} />
                        )}
                    />
                </Form.Item>
                <Form.Item label="Data de Término">
                    <Controller
                        name="fim"
                        control={control}
                        render={({ field }) => (
                            <DatePicker format={dateFormat} {...field} style={{ width: "100%" }} />
                        )}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Criar Gestação
                    </Button>
                </Form.Item>
                
            </Form>
        </Modal>
    );
}

export default GestacaoCreateModal;