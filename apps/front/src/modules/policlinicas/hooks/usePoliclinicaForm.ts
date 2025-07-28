import { useSearchForm } from "../../../hooks/useSearchForm";
import type { Policlinica, PoliclinicaFormData } from "../types";
import {
    useCreatePoliclinica,
    useDeletePoliclinica,
    useUpdatePoliclinica,
} from "./policlinicasHooks";

export const usePoliclinicaForm = () => {
    const createMutation = useCreatePoliclinica();
    const updateMutation = useUpdatePoliclinica();
    const deleteMutation = useDeletePoliclinica();

    const {
        isModalVisible,
        editingItem: editingPoliclinica,
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
    } = useSearchForm<Policlinica>();

    const isSubmitting = createMutation.isPending || updateMutation.isPending;
    const isDeleting = deleteMutation.isPending;

    const handleDelete = async (id: string) => {
        await deleteMutation.mutateAsync(id);
    };

    const handleSubmit = async (data: PoliclinicaFormData) => {
        if (editingPoliclinica) {
            await updateMutation.mutateAsync({
                id: editingPoliclinica.id,
                data,
            });
        } else {
            await createMutation.mutateAsync(data);
        }
        closeModal();
    };

    return {
        isModalVisible,
        editingPoliclinica,
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
};
