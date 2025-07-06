import { LockOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Typography } from "antd";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { CpfHookFormInput } from "../../../components";
import { cleanCpf } from "../../../utils/cpf-validator";
import { useErrorHandler } from "../../../utils/useErrorHandler";
import { useLogin } from "../hooks/authHooks";
import type { LoginFormData } from "../schemas/auth.schemas";
import { loginSchema } from "../schemas/auth.schemas";

const Login = () => {
    const { Title } = Typography;
    const { handleError, clearErrors } = useErrorHandler();
    const { mutate: login, isPending, isSuccess } = useLogin();
    const navigate = useNavigate();
    const location = useLocation();

    const { control, handleSubmit } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            cpf: "",
            senha: "",
        },
    });

    useEffect(() => {
        if (isSuccess) {
            const fromPath = (location.state as { from?: string })?.from || "/";
            navigate(fromPath, { replace: true });
        }
    }, [isSuccess, navigate, location.state]);

    const onSubmit = (values: LoginFormData) => {
        clearErrors();

        const cleanedCpf = cleanCpf(values.cpf);

        login(
            { ...values, cpf: cleanedCpf },
            {
                onError: (err) => {
                    handleError(err);
                },
            },
        );
    };

    return (
        <div className="flex items-center justify-start min-w-screen min-h-screen bg-gray-100">
            <img
                src="/img/home_hero.png"
                alt="Logo do Sistema de Apoio a Gestante (SAG)"
                className="h-screen"
            />
            <div className="w-full flex flex-col items-center justify-center">
                <div className="flex justify-center">
                    <img
                        src="/img/sag_logo.svg"
                        alt="Logo do Sistema de Apoio a Gestante (SAG)"
                        className="w-48 h-48 object-contain"
                    />
                </div>
                <div className="text-center ">
                    <Title level={2}>Acesse sua conta</Title>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full flex flex-col gap-4 max-w-2xl p-8"
                >
                    <CpfHookFormInput
                        name="cpf"
                        label="CPF"
                        control={control}
                        required
                        className="w-full"
                    />

                    <Controller
                        name="senha"
                        control={control}
                        render={({ field, fieldState }) => (
                            <div>
                                <label className="block text-sm font-medium ">
                                    Senha
                                </label>
                                <Input.Password
                                    {...field}
                                    prefix={<LockOutlined />}
                                    className={`w-full ${
                                        fieldState.error ? "border-red-500" : ""
                                    }`}
                                    placeholder="Digite sua senha"
                                    size="large"
                                />
                                {fieldState.error && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {fieldState.error.message}
                                    </p>
                                )}
                            </div>
                        )}
                    />

                    <div>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isPending}
                            block
                            size="large"
                            className="!bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white border-none shadow-sm transition duration-300"
                        >
                            {isPending ? "Entrando..." : "Entrar"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
