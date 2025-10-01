"use client";
import AdminSidebar from "@/app/components/navbaradm";
import React, { useState } from "react";

export default function MenuAdminPage() {
  const [activeSection, setActiveSection] = useState("dashboard");

  const handleLogout = () => {
    alert("Sesión cerrada");
  };

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        handleLogout={handleLogout}
      />

      <main style={{ flexGrow: 1, padding: "2rem" }}>
        {activeSection === "dashboard" && <div>Dashboard</div>}
        {activeSection === "events" && <div>Gestionar Eventos</div>}
        {activeSection === "users" && <div>Usuarios</div>}
        {activeSection === "inscriptions" && <div>Inscripciones</div>}
        {activeSection === "reports" && <div>Reportes</div>}
        {activeSection === "settings" && <div>Configuración</div>}
      </main>
    </div>
  );
}
