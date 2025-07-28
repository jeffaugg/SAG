import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Upload } from "antd";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import type { ConsultaFormData } from "../types";


interface ConsultaModalProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (data: ConsultaFormData) => void;
    initialValues?: ConsultaFormData;
}

const ConsultaModal: React.FC<ConsultaModalProps> = ({
    visible,
    onCancel,
    onSubmit,
    initialValues,
}) => {
    const [fileList, setFileList] = React.useState<any[]>([]);

    const handleFormSubmit = (data: ConsultaFormData) => {
        const files = fileList.map(f => f.originFileObj).filter(Boolean);
        const payload = { ...data, files };
        onSubmit(payload);
        setFileList([])
};

    const { control, handleSubmit, formState: { errors }, reset } = useForm<ConsultaFormData>();

    React.useEffect(() => {
        if (visible) {
            reset(
                initialValues || {
                    descricao: "",
                },
            );
        }
    }, [visible, initialValues, reset]);

    return (
        <Modal
            title="Criar Atendimento"
            open={visible}
            onCancel={onCancel}
            footer={null}
            destroyOnClose
        >
            <Form layout="vertical" onFinish={handleSubmit(handleFormSubmit)}>
                <Form.Item
                    label="Descrição"
                    validateStatus={errors.descricao ? "error" : ""}
                    help={errors.descricao?.message}
                    required={true}
                >
                    <Controller
                        name="descricao"
                        control={control}
                        rules={{ required: "Descrição é obrigatório" }}
                        render={({ field }) => (
                            <Input.TextArea {...field} placeholder="Descrição da Consulta" />
                        )}
                    />
                </Form.Item>
                <Form.Item 
                    label="Anexos"
                    >
                    <Upload
                        beforeUpload={() => false}
                        fileList={fileList}
                        onChange={({ fileList }) => setFileList(fileList)}
                        multiple
                        accept=".pdf"
                        maxCount={5}
                    >
                        <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Criar Atendimento
                    </Button>
                </Form.Item>
                
            </Form>
        </Modal>
    );
}

export default ConsultaModal;