"use client";

import { useState } from "react";
// 1. Importamos los componentes necesarios de React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AdminSidebar from "@/app/components/layout/navbaradm";
import Sidebar from "@/app/components/layout/navbares";

export default function EstudiantesLayout({ children }) {
  // 2. Creamos una instancia del QueryClient persistente
  // Usamos useState para asegurar que solo se cree una vez durante el ciclo de vida del cliente
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // Los datos se consideran "frescos" por 1 minuto
            retry: 1, // Si falla la API, reintenta una vez
          },
        },
      }),
  );

  return (
    // 3. Envolvemos todo el layout con el Provider
    <QueryClientProvider client={queryClient}>
      <div className="estudiantes-layout">
        <AdminSidebar />
        <main className="content-area">{children}</main>
      </div>
    </QueryClientProvider>
  );
}
