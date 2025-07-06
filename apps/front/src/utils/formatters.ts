export const formatCNES = (value: string): string => {
    const digits = value.replace(/\D/g, "");
    return digits.slice(0, 7);
};

export const formatPhone = (value: string): string => {
    const digits = value.replace(/\D/g, "");

    if (digits.length <= 2) {
        return `(${digits}`;
    }
    if (digits.length <= 7) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    if (digits.length <= 11) {
        const hasNinthDigit = digits.length === 11;
        if (hasNinthDigit) {
            return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
        } else {
            return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
        }
    }

    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};
