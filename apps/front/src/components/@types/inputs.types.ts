import type { Control, FieldPath, FieldValues } from "react-hook-form";

export interface CpfHookFormInputProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
    name: TName;
    control: Control<TFieldValues>;
    label: string;
    placeholder?: string;
    className?: string;
    required?: boolean;
}
