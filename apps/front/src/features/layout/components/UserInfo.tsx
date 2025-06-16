import { Button } from "antd";
import type { UserInfoProps } from "../interfaces/Layout.interfaces";

export const UserInfo = ({ name, cargo, onLogout }: UserInfoProps) => {
    return (
        <div className="flex items-center gap-2">
            <span>
                Olá, <strong>{name}</strong> ({cargo})
            </span>
            <Button onClick={onLogout} type="link">
                Sair
            </Button>
        </div>
    );
};

export default UserInfo;
