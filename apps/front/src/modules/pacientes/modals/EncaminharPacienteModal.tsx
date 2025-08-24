import { Button, Form, Modal, Select, Space } from "antd";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { usePoliclinicas } from "../../policlinicas/hooks/policlinicasHooks";
import { useUBS } from "../../ubs/hooks/ubsHooks";

interface EncaminharFormData {
    tipo: "ubs" | "policlinica";
    cnes: string;
}

interface EncaminharPacienteModalProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (data: EncaminharFormData) => void;
    loading: boolean;
}

const EncaminharPacienteModal: React.FC<EncaminharPacienteModalProps> = ({
    visible,
    onCancel,
    onSubmit,
    loading,
}) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<EncaminharFormData>();

    const tipoSelecionado = watch("tipo");

    const { data: ubsResponse } = useUBS({
        page: 1,
        limit: 1000,
    });

    const { data: policlinicasResponse } = usePoliclinicas({
        page: 1,
        limit: 1000,
    });

    const ubsList = ubsResponse?.data || [];
    const policlinicasList = policlinicasResponse?.data || [];

    React.useEffect(() => {
        if (visible) {
            reset({
                tipo: undefined,
                cnes: "",
            });
        }
    }, [visible, reset]);

    return (
        <Modal
            title="Encaminhar Paciente"
            open={visible}
            onCancel={onCancel}
            footer={null}
            destroyOnClose
        >
            <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                <Form.Item
                    label="Tipo de Unidade"
                    validateStatus={errors.tipo ? "error" : ""}
                    help={errors.tipo?.message}
                >
                    <Controller
                        name="tipo"
                        control={control}
                        rules={{
                            required: "Tipo de unidade é obrigatório",
                        }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                placeholder="Selecione o tipo de unidade"
                            >
                                <Select.Option value="ubs">UBS</Select.Option>
                                <Select.Option value="policlinica">
                                    Policlínica
                                </Select.Option>
                            </Select>
                        )}
                    />
                </Form.Item>

                <Form.Item
                    label="Unidade"
                    validateStatus={errors.cnes ? "error" : ""}
                    help={errors.cnes?.message}
                >
                    <Controller
                        name="cnes"
                        control={control}
                        rules={{
                            required: "Unidade é obrigatória",
                        }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                placeholder={
                                    tipoSelecionado
                                        ? `Selecione a ${tipoSelecionado === "ubs" ? "UBS" : "Policlínica"}`
                                        : "Selecione primeiro o tipo de unidade"
                                }
                                disabled={!tipoSelecionado}
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    (option?.children as string)
                                        ?.toLowerCase()
                                        .includes(input.toLowerCase())
                                }
                            >
                                {tipoSelecionado === "ubs"
                                    ? ubsList.map((ubs) => (
                                          <Select.Option
                                              key={ubs.cnes}
                                              value={ubs.cnes}
                                          >
                                              {ubs.nome} - {ubs.cnes}
                                          </Select.Option>
                                      ))
                                    : tipoSelecionado === "policlinica"
                                      ? policlinicasList.map((policlinica) => (
                                            <Select.Option
                                                key={policlinica.cnes}
                                                value={policlinica.cnes}
                                            >
                                                {policlinica.nome} -{" "}
                                                {policlinica.cnes}
                                            </Select.Option>
                                        ))
                                      : null}
                            </Select>
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
                            Encaminhar
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EncaminharPacienteModal;
