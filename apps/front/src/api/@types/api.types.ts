export interface ApiErrorResponse {
    message: string;
    statusCode?: number;
    error?: string;
    details?: Record<string, string[]>;
}
