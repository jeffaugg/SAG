import { LoadingOutlined } from "@ant-design/icons";
import { Spin, type SpinProps } from "antd";
import React from "react";

interface LoadingSpinnerProps extends SpinProps {
    fullScreen?: boolean;
    iconSize?: number;
    message?: string | null;
    containerClassName?: string;
    height?: string;
    withBackground?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    fullScreen = false,
    iconSize = 40,
    message = "Carregando...",
    containerClassName = "",
    height,
    withBackground = false,
    ...spinProps
}) => {
    const defaultClasses = "flex items-center justify-center";

    let heightClass = "h-64";
    if (fullScreen) {
        heightClass = "min-h-screen";
    } else if (height) {
        heightClass = height;
    }

    const backgroundClass = withBackground ? "bg-white/80" : "";

    const containerClasses = `${defaultClasses} ${heightClass} ${backgroundClass} ${containerClassName}`;

    return (
        <div className={containerClasses}>
            <Spin
                indicator={
                    <LoadingOutlined style={{ fontSize: iconSize }} spin />
                }
                tip={message || undefined}
                size="large"
                {...spinProps}
            />
        </div>
    );
};

export default LoadingSpinner;
