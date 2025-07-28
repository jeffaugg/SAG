
// Importa componentes do Ant Design, utilitários de data e hooks do React
import { Button, DatePicker, Form, Modal } from "antd";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import React from "react";
import { Controller, useForm } from "react-hook-form";
import type { GestacaoCreateFormData } from '../types';

// Extende o dayjs para aceitar formatos customizados de data
dayjs.extend(customParseFormat);

// Formato padrão das datas exibidas no formulário
const dateFormat = 'DD/MM/YYYY';

/**
 * Props do modal de criação de gestação
 * - visible: controla a exibição do modal
 * - onCancel: função chamada ao fechar o modal
 * - onSubmit: função chamada ao submeter o formulário
 * - initialValues: valores iniciais do formulário (edição ou reset)
 */
interface GestacaoModalProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (data: GestacaoCreateFormData) => void;
    initialValues?: GestacaoCreateFormData;
}

/**
 * Modal para criação de uma nova gestação.
 * Utiliza React Hook Form para controle do formulário e validação.
 */
const GestacaoCreateModal: React.FC<GestacaoModalProps> = ({
    visible,
    onCancel,
    onSubmit,
    initialValues,
}) => {

    // Hook do React Hook Form para controle dos campos e validação
    const { control, handleSubmit, formState: { errors }, reset } = useForm<GestacaoCreateFormData>();

    // Efeito para resetar o formulário quando o modal é aberto ou os valores iniciais mudam
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
            {/* Formulário vertical com validação e integração ao React Hook Form */}
            <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                {/* Campo de data de início, obrigatório */}
                <Form.Item label="Data de Início" required={true}
                validateStatus={errors.inicio ? "error" : ""}
                help={errors.inicio?.message}>
                    <Controller
                        name="inicio"
                        control={control}
                        rules={{ required: "A data de início é obrigatória" }}
                        render={({ field }) => (
                            <DatePicker format={dateFormat} {...field} style={{ width: "100%" }} />
                        )}
                    />
                </Form.Item>
                {/* Campo de data de término, opcional */}
                <Form.Item label="Data de Término">
                    <Controller
                        name="fim"
                        control={control}
                        render={({ field }) => (
                            <DatePicker format={dateFormat} {...field} style={{ width: "100%" }} />
                        )}
                    />
                </Form.Item>
                {/* Botão de submissão do formulário */}
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