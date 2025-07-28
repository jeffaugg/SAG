import React from "react";
import LoadingSpinner from "./LoadingSpinner";

interface PageLoadingProps {
    title?: string;
    iconSize?: number;
    message?: string | null;
    containerClassName?: string;
    height?: string;
    withBackground?: boolean;
}

const PageLoading: React.FC<PageLoadingProps> = ({
    message = "Carregando dados...",
    iconSize = 36,
    title,
    ...props
}) => {
    return (
        <div className="w-full">
            {title && (
                <h2 className="text-lg text-gray-500 text-center mb-4">
                    {title}
                </h2>
            )}
            <LoadingSpinner message={message} iconSize={iconSize} {...props} />
        </div>
    );
};

export default PageLoading;
