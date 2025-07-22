import { z } from "zod";
import { isValidBrazilianCpf } from "../../../utils/cpf-validator";

const cpfRegex = /^\d{11}$/;

export const cpfSchema = z
    .string()
    .min(11, { message: "CPF deve ter 11 dígitos" })
    .transform((val) => val.replace(/\D/g, ""))
    .refine((val) => cpfRegex.test(val), {
        message: "CPF deve conter apenas números e ter 11 dígitos",
    })
    .refine((val) => isValidBrazilianCpf(val), {
        message: "CPF inválido. Verifique os dígitos informados",
    });

export const loginSchema = z
    .object({
        cpf: cpfSchema,
        senha: z
            .string()
            .min(8, { message: "A senha deve ter no mínimo 8 caracteres" }),
        tipoUsuario: z.enum(["ADM", "FUNCIONARIO"]),
        organizacaoCNES: z.string().optional(),
    })
    .refine(
        (data) => {
            if (data.tipoUsuario === "FUNCIONARIO" && !data.organizacaoCNES) {
                return false;
            }
            return true;
        },
        {
            message: "Selecione uma organização",
            path: ["organizacaoCNES"],
        },
    );

export type LoginFormData = z.infer<typeof loginSchema>;

export const cargoSchema = z.enum(["Enfermeiro", "Medico", "ADM"]);
export type CargoType = z.infer<typeof cargoSchema>;

export const registerSchema = z.object({
    nome: z
        .string()
        .min(3, { message: "O nome deve ter no mínimo 3 caracteres" }),
    cargo: cargoSchema,
    cpf: cpfSchema,
    senha: z
        .string()
        .min(8, { message: "A senha deve ter no mínimo 8 caracteres" }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const authResponseSchema = z.object({
    token: z.string(),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;

export const userSchema = z.object({
    id: z.string(),
    name: z.string(),
    cargo: cargoSchema,
    cpf: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type User = z.infer<typeof userSchema>;

// Tipos básicos das entidades
export type Cargo = "Enfermeiro" | "Medico" | "ADM";

export interface Usuario {
    id: string;
    nome: string;
    cargo: Cargo;
    cpf: string;
    senha: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
}

export interface Policlinica {
    id: string;
    contato: string;
    nome: string;
    localizacao: string;
    cnes: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
}

export interface UBS {
    id: string;
    contato: string;
    nome: string;
    localizacao: string;
    cnes: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
}
