import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { apolloClient } from "@/lib/apolloClient";
import { queryClient } from "@/lib/queryClient";
import { ToastProvider } from "@/lib/toast-provider";
import App from "./App";
import "../tailwind.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <ApolloProvider client={apolloClient}>
            <QueryClientProvider client={queryClient}>
                <ToastProvider>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </ToastProvider>
            </QueryClientProvider>
        </ApolloProvider>
    </React.StrictMode>
);
