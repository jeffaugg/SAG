import { useState } from "react";
import { useSearchForm } from "../../../hooks/useSearchForm";
import type { Paciente, PacienteFormData } from "../types";
import { useAssociarPacientePoliclinica, useAssociarPacienteUbs, useCreatePaciente, useDeletePaciente, useUpdatePaciente } from "./pacienteHooks";

export const usePacienteForm = () => {
    const createMutation = useCreatePaciente();
    const updateMutation = useUpdatePaciente();
    const deleteMutation = useDeletePaciente();
    const associarPacientePoliclinica = useAssociarPacientePoliclinica();
    const associarPacienteUbs = useAssociarPacienteUbs();
    const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
    const [isModalEncaminharVisible, setIsModalEncaminharVisible] = useState(false);


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

    const openEncaminharModal = (paciente: Paciente) => {
            setSelectedPaciente(paciente);
            setIsModalEncaminharVisible(true);
    };

    const closeEncaminharModal = () => {
        setIsModalEncaminharVisible(false);
        setSelectedPaciente(null);
    };

    const handleEncaminhar = async (data: { tipo: "ubs" | "policlinica"; cnes: string; }) => {
        if(!selectedPaciente) return;

        if (data.tipo === "ubs") {
            await associarPacienteUbs.mutateAsync({
                cnes: data.cnes,
                usuarioCpf: selectedPaciente.cpf,
            });
        } else {
            await associarPacientePoliclinica.mutateAsync({
                cnes: data.cnes,
                usuarioCpf: selectedPaciente.cpf,
            });
        }
        
        closeEncaminharModal();
    };

    return {
        isModalVisible,
        isModalEncaminharVisible,
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
        selectedPaciente,
        openEncaminharModal,
        handleEncaminhar,
        closeEncaminharModal
    };
}