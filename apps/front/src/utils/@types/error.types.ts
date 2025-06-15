export interface ErrorState {
    hasError: boolean;
    message: string | null;
    fieldErrors?: Record<string, string[]>;
    statusCode?: number;
}

export interface AppError {
    message: string;
    type: "validation" | "api" | "network" | "auth" | "unknown";
    details?: Record<string, string[]>;
    statusCode?: number;
}
