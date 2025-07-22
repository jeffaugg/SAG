import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { AppToastContainer } from "./components";
import Router from "./routes/router.tsx";
import "./styles/global.css";
import { createQueryClient } from "./utils/query-client";

const queryClient = createQueryClient();

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Router />
                <AppToastContainer />
            </BrowserRouter>
        </QueryClientProvider>
    </StrictMode>,
);
