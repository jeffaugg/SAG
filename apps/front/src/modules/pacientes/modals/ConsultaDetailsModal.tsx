import { Button, Col, DatePicker, Form, Input, Modal, Row } from "antd";
import { useForm } from "react-hook-form";

import dayjs from 'dayjs';
import React from "react";

import customParseFormat from 'dayjs/plugin/customParseFormat';

import type { AtendimentoDetails } from "../types";

dayjs.extend(customParseFormat);

const dateFormat = 'DD/MM/YYYY';

interface ConsultaDetailsModalProps {
    visible: boolean;
    onCancel: () => void;
    initialValues?: AtendimentoDetails;
}

const ConsultaDetailsModal: React.FC<ConsultaDetailsModalProps> = ({
    visible,
    onCancel,
    initialValues,
}) => {
    const { reset } = useForm<AtendimentoDetails>();

    React.useEffect(() => {
        if (visible) {
            reset(
                initialValues || {
                    data: "",
                    medico: "",
                    unidade: "",
                    descricao: "",
                    file: []
                },
            );
        }
    }, [visible, initialValues, reset]);

    return (
        <Modal
            title="Detalhes da Consulta"
            open={visible}
            onCancel={onCancel}
            footer={null}
            destroyOnClose
        >
            <Form layout="vertical" disabled>
                        <Form.Item label="Médico">
                            <Input value={initialValues?.medico} />
                        </Form.Item>

                <Row gutter={16} justify="space-between">
                    <Col span={11}>
                        <Form.Item label="Data da Consulta">
                            <DatePicker defaultValue={initialValues?.data ? dayjs(initialValues.data) : undefined} format={dateFormat} />
                        </Form.Item>
                    </Col>
                
                    <Col span={11}>
                        <Form.Item label="Unidade">
                            <Input value={initialValues?.unidade} />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item label="Descrição">
                    <Input.TextArea value={initialValues?.descricao} autoSize />
                </Form.Item>
                <Form.Item label="Anexos">
                    {initialValues?.file && initialValues.file.length > 0 ? (
                        <ul style={{ paddingLeft: 16 }}>
                            {initialValues.file.map((url, idx) => (
                                <li key={url}>
                                    <a
                                    href={`http://localhost:3000/atendimentos/pdf/${url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button color="blue" variant="filled" disabled={false} style={{ width: '100%', marginBottom: 8 }}>
                                        Arquivo {idx + 1}
                                    </Button>
                                    
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <span>Nenhum anexo</span>
                )}
            </Form.Item>
        </Form>
    </Modal>
)
};

export default ConsultaDetailsModal;