import { useState } from "react";
import type { UBS, UBSFormData, UBSPagination } from "../types";
import { useCreateUBS, useDeleteUBS, useUpdateUBS } from "./ubsHooks";

export const useUBSForm = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingUBS, setEditingUBS] = useState<UBS | null>(null);
    const [pagination, setPagination] = useState<UBSPagination>({
        current: 1,
        pageSize: 10,
    });
    const [searchText, setSearchText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const createUBSMutation = useCreateUBS();
    const updateUBSMutation = useUpdateUBS();
    const deleteUBSMutation = useDeleteUBS();

    const isSubmitting =
        createUBSMutation.isPending || updateUBSMutation.isPending;
    const isDeleting = deleteUBSMutation.isPending;

    const handleSearch = () => {
        setSearchQuery(searchText);
        setPagination((prev) => ({ ...prev, current: 1 }));
    };

    const clearSearch = () => {
        setSearchText("");
        setSearchQuery("");
        setPagination((prev) => ({ ...prev, current: 1 }));
    };

    const openModal = () => setIsModalVisible(true);

    const openEditModal = (ubs: UBS) => {
        setEditingUBS(ubs);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setEditingUBS(null);
    };

    const handleDelete = async (id: string) => {
        await deleteUBSMutation.mutateAsync(id);
    };

    const handleSubmit = async (data: UBSFormData) => {
        if (editingUBS) {
            await updateUBSMutation.mutateAsync({ id: editingUBS.id, data });
        } else {
            await createUBSMutation.mutateAsync(data);
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
