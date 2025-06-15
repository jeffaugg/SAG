import { Button, Layout } from "antd";
import { useCurrentUser, useLogout } from "../modules/auth/hooks/authHooks";
import type { MainLayoutProps } from "./@types/components.types";
import LoadingSpinner from "./LoadingSpinner";

const { Content, Footer } = Layout;

const MainLayout = ({ children }: MainLayoutProps) => {
    const logout = useLogout();
    const { data: user, isLoading } = useCurrentUser();

    return (
        <Layout className="min-h-screen">
            <div className="flex items-center">
                {isLoading ? (
                    <LoadingSpinner
                        containerClassName="mr-2"
                        iconSize={16}
                        tip={null}
                    />
                ) : (
                    <>
                        <span className="mr-4">
                            Olá, <strong>{user?.name}</strong> ({user?.cargo})
                        </span>
                        <Button onClick={logout} type="link">
                            Sair
                        </Button>
                    </>
                )}
            </div>
            <Content className="p-6">
                <div className="bg-white p-6 rounded-lg shadow-sm min-h-[calc(100vh-100px)]">
                    {children}
                </div>
            </Content>
            <Footer className="text-center text-gray-500">
                SAG ©{new Date().getFullYear()} - Todos os direitos reservados
            </Footer>
        </Layout>
    );
};

export default MainLayout;
