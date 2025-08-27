"use client";
import { useState } from "react";
import NavbarEst from "@/app/components/navbares";

export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="dashboard-container">
      {/* Sidebar recibe el estado para abrir/cerrar */}
      <NavbarEst open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Contenido principal */}
      <main
        className={`dashboard-main welcome-main ${
          sidebarOpen ? "with-sidebar" : "full-width"
        }`}
      >
        <h1>¡Bienvenido a tu panel!</h1>
        <p>
          Aquí podrás gestionar tus actividades, revisar tus reportes y acceder
          a todas las funcionalidades del sistema de manera rápida y sencilla.
        </p>
      </main>
    </div>
  );
}
