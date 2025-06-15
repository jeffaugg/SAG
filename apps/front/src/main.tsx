import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { createQueryClient } from "./hooks/useQuery.ts";
import Router from "./routes/router.tsx";
import "./styles/global.css";

const navigate = (path: string) => {
  window.location.href = path;
};
const queryClient = createQueryClient(navigate);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
