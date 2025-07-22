import type { ReactNode } from "react";
import type { CargoType } from "../../../modules/auth/schemas/auth.schemas";

export interface MainLayoutProps {
    children: ReactNode;
}

export interface CollapseButtonProps {
    collapsed: boolean;
    onToggle: () => void;
}

export interface UserInfoProps {
    name: string | undefined;
    cargo: CargoType | undefined;
    onLogout: () => void;
}

export interface SiderContentProps {
    collapsed: boolean;
    onToggle: () => void;
}
