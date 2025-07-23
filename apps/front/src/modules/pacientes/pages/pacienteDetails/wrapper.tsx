import { useParams } from "react-router-dom";
import PacienteDetalhes from ".";

const PacienteDetalhesWrapper = () => {
    const { id } = useParams<{ id: string }>();

    if(!id) return null;

    return <PacienteDetalhes pacienteId={id} />;
};

export default PacienteDetalhesWrapper;