import type { SpinProps } from "antd";
import type { ReactNode } from "react";
import type { ToastContainerProps } from "react-toastify";

export interface LoadingSpinnerProps extends SpinProps {
    fullScreen?: boolean;
    iconSize?: number;
    message?: string | null;
    containerClassName?: string;
    height?: string;
    withBackground?: boolean;
}

export interface PageLoadingProps
    extends Omit<LoadingSpinnerProps, "fullScreen"> {
    title?: string;
}

export interface MainLayoutProps {
    children: ReactNode;
}

export interface ProtectedRouteProps {
    children: ReactNode;
    requiredRoles?: Array<"Enfermeiro" | "Medico" | "ADM">;
}

export interface PublicRouteProps {
    children: ReactNode;
    restrictForAuthUsers?: boolean;
}

export interface AppToastContainerProps extends ToastContainerProps {}

export interface LocationState {
    from?: string;
    message?: string;
}
