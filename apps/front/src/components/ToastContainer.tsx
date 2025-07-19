import React from "react";
import { ToastContainer, type ToastContainerProps } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AppToastContainerProps extends ToastContainerProps {
    position?: ToastContainerProps["position"];
}

export const AppToastContainer: React.FC<AppToastContainerProps> = (props) => {
    return (
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            {...props}
        />
    );
};

export default AppToastContainer;
