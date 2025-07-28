import React from "react";
import { PacienteProvider } from "../../context/pacienteContext";
import PacienteDetalhesContent from "./PacienteDetalhesContent";

interface PacienteDetalhesPageProps {
  pacienteId: string;
}

const PacienteDetalhesPage: React.FC<PacienteDetalhesPageProps> = ({ pacienteId }) => (
  <PacienteProvider>
    <PacienteDetalhesContent pacienteId={pacienteId} />
  </PacienteProvider>
);

export default PacienteDetalhesPage;