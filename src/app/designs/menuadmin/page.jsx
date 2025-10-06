"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/app/components/navbaradm";
import AdminPanel from "../../components/admin/AdminPanel";
import InscripcionesPanel from "../../components/admin/InscripcionesPanel";
import AlumPanel from "../../components/admin/AlumPanel";

const AdminDashboard = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("dashboard");

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      localStorage.removeItem("adminData");
      router.push("/");
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* ✅ Sidebar externo */}
      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        handleLogout={handleLogout}
      />

      {/* ✅ Contenido principal */}
      <main style={{ flex: 1, padding: "2rem", backgroundColor: "#f5f5f5" }}>
        {activeSection === "dashboard" && (
          <div>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>
              Panel de Control
            </h2>
            <p style={{ color: "#666" }}>Bienvenido de vuelta, Administrador</p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1.5rem",
                marginTop: "2rem",
              }}
            >
              <DashboardCard icon="📅" value="24" label="Eventos Activos" />
              <DashboardCard
                icon="👥"
                value="1,247"
                label="Usuarios Registrados"
              />
              <DashboardCard icon="✅" value="356" label="Inscripciones Hoy" />
            </div>
          </div>
        )}

        {activeSection === "events" && <AdminPanel />}
        {activeSection === "inscriptions" && <InscripcionesPanel />}
        {activeSection === "users" && <AlumPanel />}

        {(activeSection === "reports" || activeSection === "settings") && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "400px",
              backgroundColor: "white",
              borderRadius: "15px",
              boxShadow: "0 5px 15px rgba(0, 0, 0, 0.08)",
              textAlign: "center",
            }}
          >
            <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
              {activeSection === "reports" ? "Reportes" : "Configuración"}
            </h2>
            <p style={{ fontSize: "1.1rem", color: "#666" }}>
              Funcionalidad en desarrollo...
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;

function DashboardCard({ icon, value, label }) {
  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "15px",
        padding: "1.5rem",
        textAlign: "center",
        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.08)",
      }}
    >
      <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{icon}</div>
      <div
        style={{
          fontSize: "2rem",
          fontWeight: "700",
          marginBottom: "0.5rem",
        }}
      >
        {value}
      </div>
      <div style={{ color: "#666", fontWeight: "500" }}>{label}</div>
    </div>
  );
}
