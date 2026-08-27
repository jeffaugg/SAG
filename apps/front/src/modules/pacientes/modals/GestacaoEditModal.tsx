import { Button, DatePicker, Form, Modal } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import type { GestacaoCreateFormData } from "../types";

dayjs.extend(customParseFormat);

const dateFormat = "DD/MM/YYYY";

interface GestacaoEditModalProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (data: GestacaoCreateFormData) => void;
    initialValues?: GestacaoCreateFormData;
}

const GestacaoEditModal: React.FC<GestacaoEditModalProps> = ({
    visible,
    onCancel,
    onSubmit,
    initialValues,
}) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<GestacaoCreateFormData>();

    React.useEffect(() => {
        if (visible && initialValues) {
            const formattedValues = {
                ...initialValues,
                inicio: initialValues.inicio
                    ? dayjs(initialValues.inicio).format(dateFormat)
                    : "",
                fim: initialValues.fim
                    ? dayjs(initialValues.fim).format(dateFormat)
                    : "",
            };
            reset(formattedValues);
        }
    }, [visible, initialValues, reset]);

    const handleFormSubmit = (data: GestacaoCreateFormData) => {
        const formattedData = {
            ...data,
            inicio: data.inicio
                ? dayjs(data.inicio, dateFormat).toISOString()
                : "",
            fim: data.fim ? dayjs(data.fim, dateFormat).toISOString() : "",
        };
        onSubmit(formattedData);
    };

    return (
        <Modal
            title="Editar Gestação"
            open={visible}
            onCancel={onCancel}
            footer={null}
            destroyOnClose
        >
            <Form layout="vertical" onFinish={handleSubmit(handleFormSubmit)}>
                <Form.Item
                    label="Data de Início"
                    required={true}
                    validateStatus={errors.inicio ? "error" : ""}
                    help={errors.inicio?.message}
                >
                    <Controller
                        name="inicio"
                        control={control}
                        rules={{ required: "A data de início é obrigatória" }}
                        render={({ field }) => (
                            <DatePicker
                                format={dateFormat}
                                value={
                                    field.value
                                        ? dayjs(field.value, dateFormat)
                                        : null
                                }
                                onChange={(date) =>
                                    field.onChange(
                                        date ? date.format(dateFormat) : "",
                                    )
                                }
                                style={{ width: "100%" }}
                            />
                        )}
                    />
                </Form.Item>
                <Form.Item label="Data de Término">
                    <Controller
                        name="fim"
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                format={dateFormat}
                                value={
                                    field.value
                                        ? dayjs(field.value, dateFormat)
                                        : null
                                }
                                onChange={(date) =>
                                    field.onChange(
                                        date ? date.format(dateFormat) : "",
                                    )
                                }
                                style={{ width: "100%" }}
                            />
                        )}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Atualizar Gestação
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default GestacaoEditModal;
