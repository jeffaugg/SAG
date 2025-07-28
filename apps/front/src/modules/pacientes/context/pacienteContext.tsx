/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";


interface PacienteContextValue {
    gestacaoId: string | null;
    setGestacao: React.Dispatch<React.SetStateAction<string | null>>;
}

export const PacienteContext = createContext({} as PacienteContextValue);

export function PacienteProvider({ children }: { children: React.ReactNode }) {
    const [gestacaoId, setGestacao] = useState<string | null>(null);

    return (
        <PacienteContext.Provider value={{ gestacaoId, setGestacao }}>
            {children}
        </PacienteContext.Provider>
    );
}