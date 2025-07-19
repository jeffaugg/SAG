import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../api/axiosConfig";
import { API_ENDPOINTS } from "../../../api/endpoints";
import { handleError } from "../../../utils/error-handler";
import { ToastService } from "../../../utils/toast-service";
import type {
    Usuario,
    UsuarioFormData,
    UsuarioPaginatedResponse,
    UsuarioSearchParams,
} from "../types";

export const useUsuarios = (params?: UsuarioSearchParams) => {
    return useQuery({
        queryKey: ["usuarios", params],
        queryFn: async (): Promise<UsuarioPaginatedResponse> => {
            const searchParams = new URLSearchParams();

            if (params?.page && params.page > 0) {
                searchParams.append("page", params.page.toString());
            }
            if (params?.limit && params.limit > 0) {
                searchParams.append("limit", params.limit.toString());
            }
            if (params?.search?.trim()) {
                searchParams.append("search", params.search.trim());
            }
            if (params?.cargo) {
                searchParams.append("cargo", params.cargo);
            }

            const url = `${API_ENDPOINTS.USUARIOS.ROOT}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

            try {
                const response = await axiosInstance.get(url);
                return response.data as UsuarioPaginatedResponse;
            } catch (error) {
                const appError = handleError(error);
                throw new Error(
                    `Erro ao carregar lista de usuários: ${appError.message}`,
                );
            }
        },
        retry: 2,
        staleTime: 5 * 60 * 1000,
    });
};

export const useUsuarioById = (id: string) => {
    return useQuery({
        queryKey: ["usuarios", id],
        queryFn: async (): Promise<Usuario> => {
            try {
                const response = await axiosInstance.get(
                    API_ENDPOINTS.USUARIOS.BY_ID(id),
                );
                return response.data;
            } catch (error) {
                const appError = handleError(error);
                throw new Error(
                    `Erro ao carregar usuário: ${appError.message}`,
                );
            }
        },
        enabled: !!id,
        retry: 2,
        staleTime: 5 * 60 * 1000,
    });
};

export const useCreateUsuario = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: UsuarioFormData): Promise<Usuario> => {
            const response = await axiosInstance.post(
                API_ENDPOINTS.USUARIOS.ROOT,
                data,
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["usuarios"] });
            ToastService.success("Usuário criado com sucesso!");
        },
        onError: (error) => {
            const appError = handleError(error);
            ToastService.error(`Erro ao criar usuário: ${appError.message}`);
        },
    });
};

export const useUpdateUsuario = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: Partial<UsuarioFormData>;
        }): Promise<Usuario> => {
            const response = await axiosInstance.patch(
                API_ENDPOINTS.USUARIOS.BY_ID(id),
                data,
            );
            return response.data;
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["usuarios"] });
            queryClient.invalidateQueries({ queryKey: ["usuarios", id] });
            ToastService.success("Usuário atualizado com sucesso!");
        },
        onError: (error) => {
            const appError = handleError(error);
            ToastService.error(
                `Erro ao atualizar usuário: ${appError.message}`,
            );
        },
    });
};

export const useDeleteUsuario = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string): Promise<void> => {
            await axiosInstance.delete(API_ENDPOINTS.USUARIOS.BY_ID(id));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["usuarios"] });
            ToastService.success("Usuário excluído com sucesso!");
        },
        onError: (error) => {
            const appError = handleError(error);
            ToastService.error(`Erro ao excluir usuário: ${appError.message}`);
        },
    });
};

export const useVincularUsuarioUbs = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            ubsId,
            usuarioId,
        }: {
            ubsId: string;
            usuarioId: string;
        }): Promise<void> => {
            await axiosInstance.post(
                API_ENDPOINTS.UBS.ADD_USUARIO(ubsId, usuarioId),
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["usuarios"] });
            ToastService.success("Usuário vinculado à UBS com sucesso!");
        },
        onError: (error) => {
            const appError = handleError(error);
            ToastService.error(
                `Erro ao vincular usuário à UBS: ${appError.message}`,
            );
        },
    });
};

export const useVincularUsuarioPoliclinica = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            policlinicaId,
            usuarioId,
        }: {
            policlinicaId: string;
            usuarioId: string;
        }): Promise<void> => {
            await axiosInstance.post(
                API_ENDPOINTS.POLICLINICAS.ADD_USUARIO(
                    policlinicaId,
                    usuarioId,
                ),
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["usuarios"] });
            ToastService.success(
                "Usuário vinculado à Policlínica com sucesso!",
            );
        },
        onError: (error) => {
            const appError = handleError(error);
            ToastService.error(
                `Erro ao vincular usuário à Policlínica: ${appError.message}`,
            );
        },
    });
};
