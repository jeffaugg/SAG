import { useState } from "react";
import { useSearchForm } from "../../../hooks/useSearchForm";
import type { Usuario } from "../types";
import {
    useDeleteUsuario,
    useVincularUsuarioPoliclinica,
    useVincularUsuarioUbs,
} from "./usuariosHooks";

export const useUsuarioForm = () => {
    const deleteMutation = useDeleteUsuario();
    const vincularUbsMutation = useVincularUsuarioUbs();
    const vincularPoliclinicaMutation = useVincularUsuarioPoliclinica();

    const [cargoFilter, setCargoFilter] = useState<
        "Enfermeiro" | "Medico" | "ADM" | undefined
    >(undefined);

    const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(
        null,
    );

    const {
        isModalVisible,
        pagination,
        searchText,
        searchQuery,
        openEditModal,
        closeModal,
        setPagination,
        setSearchText,
        handleSearch,
        clearSearch: baseClearSearch,
    } = useSearchForm<Usuario>();

    const isSubmitting =
        vincularUbsMutation.isPending || vincularPoliclinicaMutation.isPending;
    const isDeleting = deleteMutation.isPending;

    const clearSearch = () => {
        baseClearSearch();
        setCargoFilter(undefined);
    };

    const handleDelete = async (id: string) => {
        await deleteMutation.mutateAsync(id);
    };

    const openVincularModal = (usuario: Usuario) => {
        setSelectedUsuario(usuario);
        openEditModal(usuario);
    };

    const handleVincular = async (data: {
        tipo: "ubs" | "policlinica";
        unidadeId: string;
    }) => {
        if (!selectedUsuario) return;

        if (data.tipo === "ubs") {
            await vincularUbsMutation.mutateAsync({
                ubsId: data.unidadeId,
                usuarioId: selectedUsuario.id,
            });
        } else {
            await vincularPoliclinicaMutation.mutateAsync({
                policlinicaId: data.unidadeId,
                usuarioId: selectedUsuario.id,
            });
        }
        closeModal();
        setSelectedUsuario(null);
    };

    const handleCloseModal = () => {
        closeModal();
        setSelectedUsuario(null);
    };

    return {
        isModalVisible,
        selectedUsuario,
        isSubmitting,
        isDeleting,
        pagination,
        searchText,
        searchQuery,
        cargoFilter,
        openVincularModal,
        closeModal: handleCloseModal,
        handleDelete,
        handleVincular,
        setPagination,
        setSearchText,
        setCargoFilter,
        handleSearch,
        clearSearch,
    };
};
