import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../api/axiosConfig";
import { API_ENDPOINTS } from "../../../api/endpoints";
import { handleError } from "../../../utils/error-handler";
import { ToastService } from "../../../utils/toast-service";
import type { Policlinica } from "../../auth/schemas/auth.schemas";

interface CreatePoliclinicaData {
    nome: string;
    contato: string;
    localizacao: string;
    cnes: string;
}

type UpdatePoliclinicaData = Partial<CreatePoliclinicaData>;

export const usePoliclinicas = () => {
    return useQuery({
        queryKey: ["policlinicas"],
        queryFn: async () => {
            try {
                const response = await axiosInstance.get(
                    API_ENDPOINTS.POLICLINICAS.ROOT,
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

export const useCreatePoliclinica = () => {
    const queryClient = useQueryClient();

    return useMutation<Policlinica, Error, CreatePoliclinicaData>({
        mutationFn: async (data) => {
            try {
                const response = await axiosInstance.post(
                    API_ENDPOINTS.POLICLINICAS.ROOT,
                    data,
                );
                return response.data;
            } catch (error) {
                const appError = handleError(error);
                throw new Error(appError.message);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["policlinicas"] });
            ToastService.success("Policlínica criada com sucesso!");
        },
    });
};

export const useUpdatePoliclinica = () => {
    const queryClient = useQueryClient();

    return useMutation<
        Policlinica,
        Error,
        { id: string; data: UpdatePoliclinicaData }
    >({
        mutationFn: async ({ id, data }) => {
            try {
                const response = await axiosInstance.put(
                    API_ENDPOINTS.POLICLINICAS.BY_ID(id),
                    data,
                );
                return response.data;
            } catch (error) {
                const appError = handleError(error);
                throw new Error(appError.message);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["policlinicas"] });
            ToastService.success("Policlínica atualizada com sucesso!");
        },
    });
};

export const useDeletePoliclinica = () => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, string>({
        mutationFn: async (id) => {
            try {
                await axiosInstance.delete(
                    API_ENDPOINTS.POLICLINICAS.BY_ID(id),
                );
            } catch (error) {
                const appError = handleError(error);
                throw new Error(appError.message);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["policlinicas"] });
            ToastService.success("Policlínica removida com sucesso!");
        },
    });
};
