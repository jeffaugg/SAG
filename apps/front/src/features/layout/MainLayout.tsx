import { Layout, theme } from "antd";
import { useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useCurrentUser, useLogout } from "../../modules/auth/hooks/authHooks";
import routes from "../../routes/routes.config";
import AppBreadcrumb from "../navigation/components/AppBreadcrumb";
import { NavigationProvider } from "../navigation/context/NavigationContext";
import SiderContent from "./components/SiderContent";
import UserInfo from "./components/UserInfo";
import type { MainLayoutProps } from "./interfaces/Layout.interfaces";

const { Header, Content, Footer } = Layout;

const MainLayout = ({ children }: MainLayoutProps) => {
    const logout = useLogout();
    const { data: user, isLoading } = useCurrentUser();
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const handleToggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return (
        <NavigationProvider routes={routes}>
            <Layout className="min-h-screen">
                <SiderContent
                    collapsed={collapsed}
                    onToggle={handleToggleCollapsed}
                />
                <Layout>
                    <Header
                        style={{
                            padding: 0,
                            background: colorBgContainer,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            paddingLeft: 16,
                            paddingRight: 16,
                        }}
                    >
                        <div className="w-full flex items-center justify-end">
                            {isLoading ? (
                                <LoadingSpinner
                                    containerClassName="mr-2"
                                    iconSize={16}
                                    tip={null}
                                />
                            ) : (
                                <div className="flex w-full items-center justify-end gap-4">
                                    <AppBreadcrumb />
                                    <div className="flex items-center gap-2 w-full justify-end">
                                        <UserInfo
                                            name={user?.name}
                                            cargo={user?.cargo}
                                            onLogout={logout}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </Header>
                    <Content
                        style={{
                            margin: "24px 16px",
                            padding: 24,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <div className="min-h-[calc(100vh-200px)]">
                            {children}
                        </div>
                    </Content>
                    <Footer className="text-center text-gray-500">
                        SAG ©{new Date().getFullYear()} - Todos os direitos
                        reservados
                    </Footer>
                </Layout>
            </Layout>
        </NavigationProvider>
    );
};

export default MainLayout;
