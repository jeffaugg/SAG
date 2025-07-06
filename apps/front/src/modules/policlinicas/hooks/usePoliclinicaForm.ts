import { useState } from "react";
import type {
    Policlinica,
    PoliclinicaFormData,
    PoliclinicaPagination,
} from "../types";
import {
    useCreatePoliclinica,
    useDeletePoliclinica,
    useUpdatePoliclinica,
} from "./policlinicasHooks";

export const usePoliclinicaForm = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingPoliclinica, setEditingPoliclinica] =
        useState<Policlinica | null>(null);
    const [pagination, setPagination] = useState<PoliclinicaPagination>({
        current: 1,
        pageSize: 10,
    });
    const [searchText, setSearchText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const createPoliclinicaMutation = useCreatePoliclinica();
    const updatePoliclinicaMutation = useUpdatePoliclinica();
    const deletePoliclinicaMutation = useDeletePoliclinica();

    const isSubmitting =
        createPoliclinicaMutation.isPending ||
        updatePoliclinicaMutation.isPending;
    const isDeleting = deletePoliclinicaMutation.isPending;

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

    const openEditModal = (policlinica: Policlinica) => {
        setEditingPoliclinica(policlinica);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setEditingPoliclinica(null);
    };

    const handleDelete = async (id: string) => {
        await deletePoliclinicaMutation.mutateAsync(id);
    };

    const handleSubmit = async (data: PoliclinicaFormData) => {
        if (editingPoliclinica) {
            await updatePoliclinicaMutation.mutateAsync({
                id: editingPoliclinica.id,
                data,
            });
        } else {
            await createPoliclinicaMutation.mutateAsync(data);
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
