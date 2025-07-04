import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { AppToastContainerProps } from "./@types/components.types";

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
