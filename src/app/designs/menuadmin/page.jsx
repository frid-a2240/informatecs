"use client";
import React from "react";
import AdminSidebar from "@/app/components/navbaradm"; // tu sidebar con rutas
import AdminPanel from "../../components/admin/AdminPanel";
import InscripcionesPanel from "../../components/admin/InscripcionesPanel";
import AlumPanel from "../../components/admin/AlumPanel";

const AdminDashboard = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <AdminSidebar />

      <main
        style={{
          flex: 1,
          padding: "2rem",
          backgroundColor: "#f5f5f5",
          marginLeft: "250px", // ancho del sidebar
        }}
      >
        <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>
          Panel de Control
        </h2>
        <p style={{ color: "#666" }}>Bienvenido de vuelta, Administrador</p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.5rem",
            marginTop: "2rem",
          }}
        >
          <DashboardCard icon="📅" value="24" label="Eventos Activos" />
          <DashboardCard icon="👥" value="1,247" label="Usuarios Registrados" />
          <DashboardCard icon="✅" value="356" label="Inscripciones Hoy" />
        </div>
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
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "translateY(-5px)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
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
