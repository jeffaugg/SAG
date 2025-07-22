import { LockOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu, Tooltip } from "antd";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useNavigation } from "../contexts/NavigationContext";
import type { CargoType } from "../modules/auth/schemas/auth.schemas";

interface RouteItem {
    path: string;
    label: string;
    icon?: ReactNode;
    requiredRoles?: Array<CargoType>;
    children?: RouteItem[];
    isVisible?: boolean;
}

const AppMenu = () => {
    const { routes, openKeys, selectedKeys, setOpenKeys, hasPermission } =
        useNavigation();

    const getMenuItems = (routes: RouteItem[]): MenuProps["items"] => {
        return routes
            .filter((route: RouteItem) => {
                if (route.isVisible === false) return false;

                if (route.children?.length) {
                    const visibleChildren = route.children.filter(
                        (child: RouteItem) =>
                            child.isVisible !== false &&
                            hasPermission(child.requiredRoles),
                    );
                    return visibleChildren.length > 0;
                }

                return true;
            })
            .map((route: RouteItem) => {
                const userHasAccess = hasPermission(route.requiredRoles);

                if (route.children && route.children.length > 0) {
                    const childItems = getMenuItems(
                        route.children.filter(
                            (child: RouteItem) => child.isVisible !== false,
                        ),
                    );

                    if (childItems && childItems.length === 0) {
                        return null;
                    }

                    return {
                        key: route.path,
                        icon: route.icon,
                        label: (
                            <span>
                                {route.label}
                                {!userHasAccess && (
                                    <Tooltip title="Acesso restrito">
                                        <LockOutlined
                                            style={{
                                                marginLeft: 5,
                                                fontSize: 12,
                                            }}
                                        />
                                    </Tooltip>
                                )}
                            </span>
                        ),
                        children: childItems,
                    };
                }

                const menuItem = {
                    key: route.path,
                    icon: route.icon,
                    label: userHasAccess ? (
                        <Link to={route.path}>{route.label}</Link>
                    ) : (
                        <Tooltip title="Acesso restrito">
                            <span className="text-gray-400">
                                {route.label}{" "}
                                <LockOutlined style={{ fontSize: 12 }} />
                            </span>
                        </Tooltip>
                    ),
                    disabled: !userHasAccess,
                };

                return menuItem;
            })
            .filter(Boolean) as MenuProps["items"];
    };

    const menuItems = getMenuItems(routes);

    const onOpenChange: MenuProps["onOpenChange"] = (keys) => {
        setOpenKeys(keys as string[]);
    };

    return (
        <Menu
            mode="inline"
            theme="light"
            openKeys={openKeys}
            selectedKeys={selectedKeys}
            onOpenChange={onOpenChange}
            items={menuItems}
            className="border-0"
        />
    );
};

export default AppMenu;
