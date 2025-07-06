import { useSearchForm } from "../../../hooks/useSearchForm";
import type { UBS, UBSFormData } from "../types";
import { useCreateUBS, useDeleteUBS, useUpdateUBS } from "./ubsHooks";

export const useUBSForm = () => {
    const createMutation = useCreateUBS();
    const updateMutation = useUpdateUBS();
    const deleteMutation = useDeleteUBS();

    const {
        isModalVisible,
        editingItem: editingUBS,
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
    } = useSearchForm<UBS>();

    const isSubmitting = createMutation.isPending || updateMutation.isPending;
    const isDeleting = deleteMutation.isPending;

    const handleDelete = async (id: string) => {
        await deleteMutation.mutateAsync(id);
    };

    const handleSubmit = async (data: UBSFormData) => {
        if (editingUBS) {
            await updateMutation.mutateAsync({ id: editingUBS.id, data });
        } else {
            await createMutation.mutateAsync(data);
        }
        closeModal();
    };

    return {
        isModalVisible,
        editingUBS,
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
