import { useState } from "react";
import { useSearchForm } from "../../../hooks/useSearchForm";
import type { Usuario, UsuarioFormData } from "../types";
import {
    useCreateUsuario,
    useDeleteUsuario,
    useUpdateUsuario,
} from "./usuariosHooks";

export const useUsuarioForm = () => {
    const createMutation = useCreateUsuario();
    const updateMutation = useUpdateUsuario();
    const deleteMutation = useDeleteUsuario();

    const [cargoFilter, setCargoFilter] = useState<
        "Enfermeiro" | "Medico" | "ADM" | undefined
    >(undefined);

    const {
        isModalVisible,
        editingItem: editingUsuario,
        pagination,
        searchText,
        searchQuery,
        openModal,
        openEditModal,
        closeModal,
        setPagination,
        setSearchText,
        handleSearch,
        clearSearch: baseClearSearch,
    } = useSearchForm<Usuario>();

    const isSubmitting = createMutation.isPending || updateMutation.isPending;
    const isDeleting = deleteMutation.isPending;

    const clearSearch = () => {
        baseClearSearch();
        setCargoFilter(undefined);
    };

    const handleDelete = async (id: string) => {
        await deleteMutation.mutateAsync(id);
    };

    const handleSubmit = async (data: UsuarioFormData) => {
        if (editingUsuario) {
            await updateMutation.mutateAsync({
                id: editingUsuario.id,
                data,
            });
        } else {
            await createMutation.mutateAsync(data);
        }
        closeModal();
    };

    return {
        isModalVisible,
        editingUsuario,
        isSubmitting,
        isDeleting,
        pagination,
        searchText,
        searchQuery,
        cargoFilter,
        openModal,
        openEditModal,
        closeModal,
        handleDelete,
        handleSubmit,
        setPagination,
        setSearchText,
        setCargoFilter,
        handleSearch,
        clearSearch,
    };
};
