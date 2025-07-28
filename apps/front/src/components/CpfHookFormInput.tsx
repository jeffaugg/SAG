import { UserOutlined } from "@ant-design/icons";
import { Input } from "antd";
import {
    Controller,
    type Control,
    type FieldPath,
    type FieldValues,
} from "react-hook-form";

interface CpfHookFormInputProps<
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

export const CpfHookFormInput = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
    name,
    control,
    label,
    placeholder = "Digite seu CPF (ex: 123.456.789-00)",
    className = "",
    required = true,
}: CpfHookFormInputProps<TFieldValues, TName>) => {
    const formatCpf = (input: string) => {
        const digits = input.replace(/\D/g, "");
        let formatted = digits;

        if (digits.length > 3) {
            formatted = `${digits.substring(0, 3)}.${digits.substring(3)}`;
        }
        if (digits.length > 6) {
            formatted = `${formatted.substring(0, 7)}.${formatted.substring(7)}`;
        }
        if (digits.length > 9) {
            formatted = `${formatted.substring(0, 11)}-${formatted.substring(11)}`;
        }

        return formatted;
    };

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <div className="mb-2">
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                        {label}{" "}
                        {required && <span className="text-red-500">*</span>}
                    </label>
                    <Input
                        {...field}
                        className={`w-full ${
                            fieldState.error ? "border-red-500" : ""
                        } hover:border-blue-400 focus:border-blue-500 ${className}`}
                        placeholder={placeholder}
                        maxLength={14}
                        autoComplete="off"
                        size="large"
                        prefix={<UserOutlined />}
                        onChange={(e) => {
                            const formattedValue = formatCpf(e.target.value);
                            field.onChange(formattedValue);
                        }}
                    />
                    {fieldState.error && (
                        <p className="text-red-500 text-xs mt-1">
                            {fieldState.error.message}
                        </p>
                    )}
                </div>
            )}
        />
    );
};

export default CpfHookFormInput;
