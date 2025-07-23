import { useContext } from "react";
import { PacienteContext } from "../context/pacienteContext";

export function usePacienteContext(){
    return useContext(PacienteContext);
}