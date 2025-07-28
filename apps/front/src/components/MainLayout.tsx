import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, theme } from "antd";
import { useState, type ReactNode } from "react";
import { NavigationProvider } from "../contexts/NavigationContext";
import { useCurrentUser, useLogout } from "../modules/auth/hooks/authHooks";
import routes from "../routes/routes.config";
import AppBreadcrumb from "./AppBreadcrumb";
import AppMenu from "./AppMenu";
import LoadingSpinner from "./LoadingSpinner";

interface MainLayoutProps {
    children: ReactNode;
}

const { Header, Content, Sider, Footer } = Layout;

const MainLayout = ({ children }: MainLayoutProps) => {
    const logout = useLogout();
    const { data: user, isLoading } = useCurrentUser();
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <NavigationProvider routes={routes}>
            <Layout className="min-h-screen">
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                    width={250}
                    theme="light"
                >
                    <div className="flex w-full items-center justify-center">
                        <img
                            src="/img/sag_logo.svg"
                            alt="Logo do Sistema de Apoio a Gestante (SAG)"
                            className="w-2/5 h-auto object-contain p-2"
                        />
                    </div>
                    <div className="overflow-auto">
                        <AppMenu />
                    </div>
                    <div className="border-t border-gray-200 p-4 flex justify-center ">
                        <Button
                            type="text"
                            icon={
                                collapsed ? (
                                    <MenuUnfoldOutlined />
                                ) : (
                                    <MenuFoldOutlined />
                                )
                            }
                            onClick={() => setCollapsed(!collapsed)}
                        />
                    </div>
                </Sider>
                <Layout className="!bg-grey-100">
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
                                        <span>
                                            Olá, <strong>{user?.name}</strong> (
                                            {user?.cargo})
                                        </span>
                                        <Button onClick={logout} type="link">
                                            Sair
                                        </Button>
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
                        <div className="h-[calc(100vh-200px)]">
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
