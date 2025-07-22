import type { ReactNode } from "react";
import type { CargoType } from "../../../modules/auth/schemas/auth.schemas";

export interface RouteDefinition {
    path: string;
    label: string;
    icon?: ReactNode;
    requiredRoles?: Array<CargoType>;
    children?: RouteDefinition[];
    isVisible?: boolean;
}

export interface BreadcrumbItem {
    path: string;
    label: string;
    icon?: ReactNode;
}

export interface NavigationContextValue {
    routes: RouteDefinition[];
    breadcrumbs: BreadcrumbItem[];
    activePath: string;
    openKeys: string[];
    selectedKeys: string[];
    setOpenKeys: (keys: string[]) => void;
    hasPermission: (requiredRoles?: Array<CargoType>) => boolean;
}
