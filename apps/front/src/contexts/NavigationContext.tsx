import {
    createContext,
    type ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { useLocation } from "react-router-dom";
import { useCurrentUser } from "../modules/auth/hooks/authHooks";
import type { CargoType } from "../modules/auth/schemas/auth.schemas";

interface RouteDefinition {
    path: string;
    label: string;
    icon?: ReactNode;
    requiredRoles?: Array<CargoType>;
    children?: RouteDefinition[];
    isVisible?: boolean;
}

interface BreadcrumbItem {
    path: string;
    label: string;
    icon?: ReactNode;
}

interface NavigationContextType {
    routes: RouteDefinition[];
    breadcrumbs: BreadcrumbItem[];
    activePath: string;
    openKeys: string[];
    selectedKeys: string[];
    setOpenKeys: (keys: string[]) => void;
    hasPermission: (requiredRoles?: Array<CargoType>) => boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
    undefined,
);

export const NavigationProvider = ({
    children,
    routes,
}: {
    children: ReactNode;
    routes: RouteDefinition[];
}) => {
    const location = useLocation();
    const { data: user } = useCurrentUser();
    const [openKeys, setOpenKeys] = useState<string[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

    const hasPermission = (requiredRoles?: Array<CargoType>): boolean => {
        if (!requiredRoles || requiredRoles.length === 0) return true;
        if (!user) return false;
        return requiredRoles.includes(user.cargo);
    };

    const applyPermissionsFilter = (
        routes: RouteDefinition[],
    ): RouteDefinition[] => {
        return routes
            .map((route) => {
                const hasAccess = hasPermission(route.requiredRoles);

                let filteredChildren: RouteDefinition[] | undefined;
                if (route.children && route.children.length > 0) {
                    filteredChildren = applyPermissionsFilter(route.children);
                }

                if (
                    hasAccess ||
                    (filteredChildren && filteredChildren.length > 0)
                ) {
                    return {
                        ...route,
                        isVisible: hasAccess,
                        children: filteredChildren,
                    };
                }

                return null;
            })
            .filter(Boolean) as RouteDefinition[];
    };

    const filteredRoutes = applyPermissionsFilter(routes);

    useEffect(() => {
        const pathSegments = location.pathname.split("/").filter(Boolean);

        setSelectedKeys([location.pathname]);

        const breadcrumbItems: BreadcrumbItem[] = [];
        let currentPath = "";

        breadcrumbItems.push({
            path: "/",
            label: "Home",
            icon: routes.find((r) => r.path === "/")?.icon,
        });

        const findRouteByPath = (
            routes: RouteDefinition[],
            path: string,
        ): RouteDefinition | undefined => {
            for (const route of routes) {
                if (route.path === path) return route;
                if (route.children) {
                    const childRoute = findRouteByPath(route.children, path);
                    if (childRoute) return childRoute;
                }
            }
            return undefined;
        };

        pathSegments.forEach((segment) => {
            currentPath += `/${segment}`;

            const route = findRouteByPath(routes, currentPath);
            const label =
                route?.label ||
                segment.charAt(0).toUpperCase() + segment.slice(1);

            breadcrumbItems.push({
                path: currentPath,
                label,
                icon: route?.icon,
            });
        });

        setBreadcrumbs(breadcrumbItems);

        if (pathSegments.length > 0) {
            let path = "";
            const newOpenKeys = pathSegments.map((segment) => {
                path += `/${segment}`;
                return path;
            });

            if (openKeys.length === 0) {
                setOpenKeys(newOpenKeys.slice(0, -1));
            }
        }
    }, [location.pathname, routes, user]);

    return (
        <NavigationContext.Provider
            value={{
                routes: filteredRoutes,
                breadcrumbs,
                activePath: location.pathname,
                openKeys,
                selectedKeys,
                setOpenKeys,
                hasPermission,
            }}
        >
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error(
            "useNavigation must be used within a NavigationProvider",
        );
    }
    return context;
};
