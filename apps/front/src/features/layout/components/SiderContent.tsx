import { Layout } from "antd";
import AppMenu from "../../navigation/components/AppMenu";
import type { SiderContentProps } from "../interfaces/Layout.interfaces";
import CollapseButton from "./CollapseButton";

const { Sider } = Layout;

export const SiderContent = ({ collapsed, onToggle }: SiderContentProps) => {
    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            className="flex flex-col"
            width={250}
            theme="light"
        >
            <div className="flex items-center justify-center mb-2">
                <img
                    src="/img/sag_logo.svg"
                    alt="Logo do Sistema de Apoio a Gestante (SAG)"
                    className="w-2/5 h-auto object-contain p-2"
                />
            </div>
            <div className="flex-grow overflow-auto h-full">
                <AppMenu />
            </div>
            <div className="border-t border-gray-200 p-4 flex justify-center sticky bottom-0 bg-white">
                <CollapseButton collapsed={collapsed} onToggle={onToggle} />
            </div>
        </Sider>
    );
};

export default SiderContent;
