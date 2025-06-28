import { z } from "zod";

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

export function isValidBrazilianCpf(cpf: string): boolean {
    if (!cpf || cpf.length !== 11) return false;

    if (/^(\d)\1{10}$/.test(cpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }

    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;

    if (remainder !== parseInt(cpf.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;

    if (remainder !== parseInt(cpf.charAt(10))) return false;

    return true;
}

export const loginSchema = z.object({
    cpf: cpfSchema,
    senha: z
        .string()
        .min(8, { message: "A senha deve ter no mínimo 8 caracteres" }),
});

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
