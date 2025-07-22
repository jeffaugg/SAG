import { useCallback, useState } from "react";
import type { AppError, ErrorState } from "../utils/@types/error.types";
import { handleError } from "../utils/error-handler";

export const useErrorHandler = () => {
    const [errorState, setErrorState] = useState<ErrorState>({
        hasError: false,
        message: null,
    });

    const clearErrors = useCallback(() => {
        setErrorState({
            hasError: false,
            message: null,
        });
    }, []);

    const handleAppError = useCallback((error: unknown) => {
        const appError: AppError = handleError(error);

        setErrorState({
            hasError: true,
            message: appError.message,
            fieldErrors: appError.details,
            statusCode: appError.statusCode,
        });

        return appError;
    }, []);

    const getFieldError = useCallback(
        (fieldName: string): string | undefined => {
            if (errorState.fieldErrors && errorState.fieldErrors[fieldName]) {
                return errorState.fieldErrors[fieldName][0];
            }
            return undefined;
        },
        [errorState.fieldErrors],
    );

    const hasFieldError = useCallback(
        (fieldName: string): boolean => {
            return !!(
                errorState.fieldErrors && errorState.fieldErrors[fieldName]
            );
        },
        [errorState.fieldErrors],
    );

    return {
        error: errorState,
        handleError: handleAppError,
        clearErrors,
        getFieldError,
        hasFieldError,
    };
};
