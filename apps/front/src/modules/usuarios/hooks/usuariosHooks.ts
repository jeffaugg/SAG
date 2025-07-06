import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../api/axiosConfig";
import { API_ENDPOINTS } from "../../../api/endpoints";
import { handleError } from "../../../utils/error-handler";
import { ToastService } from "../../../utils/toast-service";
import type { CargoType, Usuario } from "../../auth/schemas/auth.schemas";

interface CreateUsuarioData {
    nome: string;
    cargo: CargoType;
    cpf: string;
    senha: string;
}

interface UpdateUsuarioData {
    nome?: string;
    cargo?: CargoType;
    senha?: string;
}

export const useUsuarios = () => {
    return useQuery({
        queryKey: ["usuarios"],
        queryFn: async () => {
            try {
                const response = await axiosInstance.get(
                    `${API_ENDPOINTS.USUARIOS.ME.replace("/me", "")}`,
                );
                return response.data;
            } catch (error) {
                const appError = handleError(error);
                throw new Error(appError.message);
            }
        },
        staleTime: 5 * 60 * 1000,
    });
};

export const useCreateUsuario = () => {
    const queryClient = useQueryClient();

    return useMutation<Usuario, Error, CreateUsuarioData>({
        mutationFn: async (userData) => {
            try {
                const response = await axiosInstance.post(
                    `${API_ENDPOINTS.USUARIOS.ME.replace("/me", "")}`,
                    userData,
                );
                return response.data;
            } catch (error) {
                const appError = handleError(error);
                throw new Error(appError.message);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["usuarios"] });
            ToastService.success("Usuário criado com sucesso!");
        },
    });
};

export const useUpdateUsuario = () => {
    const queryClient = useQueryClient();

    return useMutation<Usuario, Error, { id: string; data: UpdateUsuarioData }>(
        {
            mutationFn: async ({ id, data }) => {
                try {
                    const response = await axiosInstance.put(
                        `${API_ENDPOINTS.USUARIOS.ME.replace("/me", "")}/${id}`,
                        data,
                    );
                    return response.data;
                } catch (error) {
                    const appError = handleError(error);
                    throw new Error(appError.message);
                }
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["usuarios"] });
                ToastService.success("Usuário atualizado com sucesso!");
            },
        },
    );
};

export const useDeleteUsuario = () => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, string>({
        mutationFn: async (id) => {
            try {
                await axiosInstance.delete(
                    `${API_ENDPOINTS.USUARIOS.ME.replace("/me", "")}/${id}`,
                );
            } catch (error) {
                const appError = handleError(error);
                throw new Error(appError.message);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["usuarios"] });
            ToastService.success("Usuário removido com sucesso!");
        },
    });
};
