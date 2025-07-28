import { useSearchForm } from "../../../hooks/useSearchForm";
import { usePacienteContext } from "../hooks/useContext";
import type { Consulta, ConsultaFormData, GestacaoCreateFormData } from "../types";
import { useCreateAtendimento, useDeleteAtendimento, } from "./consultaHooks";
import { useCreateGestacao } from "./gestacaoHooks";


export const useConsultaForm = () => {
  const createGestacaoMutation = useCreateGestacao();
  const createMutation = useCreateAtendimento();
  const deleteMutation = useDeleteAtendimento();

  const { gestacaoId } = usePacienteContext();

  const {
    isModalVisible,
    editingItem: editingConsulta,
    openModal,
    openEditModal,
    closeModal,
    pagination,
    searchText,
    searchQuery,
    setPagination,
    setSearchText,
    handleSearch,
    clearSearch,
  } = useSearchForm<Consulta>();

  const handleSubmit = async (data : ConsultaFormData) => {
  if (!gestacaoId) {
    throw new Error("gestacaoId não pode ser nulo.");
  }

  const formData = new FormData();
  formData.append("descricao", data.descricao);
  formData.append("gestacaoId", gestacaoId);

  if (data.files && data.files.length > 0) {
    data.files.forEach((file: File) => {
      formData.append("file", file);
    });
  }

  await createMutation.mutateAsync(formData);
    closeModal();
  };

  const handleGestacaoSubmit = async (data: GestacaoCreateFormData) => {
    await createGestacaoMutation.mutateAsync(data);
    closeModal();
    };

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  return {
    isModalVisible,
    editingConsulta,
    openModal,
    openEditModal,
    closeModal,
    pagination,
    searchText,
    searchQuery,
    setPagination,
    setSearchText,
    handleSearch,
    clearSearch,
    handleSubmit,
    handleDelete,
    createGestacaoMutation,
    handleGestacaoSubmit
  };
};
