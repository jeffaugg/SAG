export const cleanCpf = (value: string): string => {
    return value.replace(/\D/g, "");
};

export const isValidBrazilianCpf = (cpf: string): boolean => {
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
};

export const validateCpfFormat = (value?: string): string | undefined => {
    if (!value) {
        return "Por favor, digite seu CPF";
    }

    const cleanedCpf = cleanCpf(value);

    if (cleanedCpf.length !== 11) {
        return "CPF deve conter 11 dígitos";
    }

    if (!/^\d{11}$/.test(cleanedCpf)) {
        return "CPF deve conter apenas números";
    }

    if (!isValidBrazilianCpf(cleanedCpf)) {
        return "CPF inválido. Verifique os dígitos informados.";
    }

    return undefined;
};

export const cpfValidator = (_: unknown, value: string): Promise<void> => {
    const errorMessage = validateCpfFormat(value);

    if (errorMessage) {
        return Promise.reject(errorMessage);
    }

    return Promise.resolve();
};
