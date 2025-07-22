import axiosInstance from "../../api/axiosConfig";
import { handleError } from "../../utils/error-handler";

export abstract class BaseApiService {
    protected async get<T>(
        url: string,
        params?: Record<string, any>,
    ): Promise<T> {
        try {
            const response = await axiosInstance.get<T>(url, { params });
            return response.data;
        } catch (error) {
            const appError = handleError(error);
            throw new Error(appError.message);
        }
    }
    protected async post<T, D = any>(url: string, data?: D): Promise<T> {
        try {
            const response = await axiosInstance.post<T>(url, data);
            return response.data;
        } catch (error) {
            const appError = handleError(error);
            throw new Error(appError.message);
        }
    }
    protected async put<T, D = any>(url: string, data?: D): Promise<T> {
        try {
            const response = await axiosInstance.put<T>(url, data);
            return response.data;
        } catch (error) {
            const appError = handleError(error);
            throw new Error(appError.message);
        }
    }
    protected async patch<T, D = any>(url: string, data?: D): Promise<T> {
        try {
            const response = await axiosInstance.patch<T>(url, data);
            return response.data;
        } catch (error) {
            const appError = handleError(error);
            throw new Error(appError.message);
        }
    }
    protected async delete<T>(url: string): Promise<T> {
        try {
            const response = await axiosInstance.delete<T>(url);
            return response.data;
        } catch (error) {
            const appError = handleError(error);
            throw new Error(appError.message);
        }
    }
}
