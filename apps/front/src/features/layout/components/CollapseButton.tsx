import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button } from "antd";
import type { CollapseButtonProps } from "../interfaces/Layout.interfaces";

export const CollapseButton = ({
    collapsed,
    onToggle,
}: CollapseButtonProps) => {
    return (
        <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={onToggle}
        />
    );
};

export default CollapseButton;
