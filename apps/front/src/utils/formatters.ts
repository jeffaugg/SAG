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

export const formatCpf = (value: string): string => {
    const digits = value.replace(/\D/g, "");

    if (digits.length <= 3) {
        return digits;
    }
    if (digits.length <= 6) {
        return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    }
    if (digits.length <= 9) {
        return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    }

    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
};

export const normalizeSearchText = (text: string): string => {
    return text.toLowerCase().trim();
};

export const createSearchFilter = <T>(
    items: T[],
    searchText: string,
    searchFields: (keyof T)[],
): T[] => {
    if (!searchText) return items;

    const normalizedSearch = normalizeSearchText(searchText);

    return items.filter((item) =>
        searchFields.some((field) => {
            const value = item[field];
            return (
                value && String(value).toLowerCase().includes(normalizedSearch)
            );
        }),
    );
};
