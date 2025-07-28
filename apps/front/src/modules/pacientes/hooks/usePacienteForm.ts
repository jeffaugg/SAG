import { useSearchForm } from "../../../hooks/useSearchForm";
import type { Paciente, PacienteFormData } from "../types";
import { useCreatePaciente, useDeletePaciente, useUpdatePaciente } from "./pacienteHooks";

export const usePacienteForm = () => {
    const createMutation = useCreatePaciente();
    const updateMutation = useUpdatePaciente();
    const deleteMutation = useDeletePaciente();

    const {
        isModalVisible,
        editingItem: editingPaciente,
        pagination,
        searchText,
        searchQuery,
        openModal,
        openEditModal,
        closeModal,
        setPagination,
        setSearchText,
        handleSearch,
        clearSearch,
    } = useSearchForm<Paciente>();

    const isSubmitting = createMutation.isPending || updateMutation.isPending;
    const isDeleting = deleteMutation.isPending;

    const handleDelete = async (id: string) => {
        await deleteMutation.mutateAsync(id);
    };

    const handleSubmit = async (data: PacienteFormData) => {
        if (editingPaciente) {
            await updateMutation.mutateAsync({ id: editingPaciente.id, data });
        } else {
            await createMutation.mutateAsync(data);
        }
        closeModal();
    };

    return {
        isModalVisible,
        editingPaciente,
        isSubmitting,
        isDeleting,
        pagination,
        searchText,
        searchQuery,
        openModal,
        openEditModal,
        closeModal,
        handleDelete,
        handleSubmit,
        setPagination,
        setSearchText,
        handleSearch,
        clearSearch,
    };
}