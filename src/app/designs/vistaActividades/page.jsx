"use client";
import React from "react";
import AdminPanel from "../../components/admin/AdminPanel";

import AdminSidebar from "@/app/components/navbaradm";

const DashboardCard = ({ icon, value, label }) => {
  return (
    <div className="dashboard-card">
      <div className="dashboard-card-icon">{icon}</div>
      <div className="dashboard-card-value">{value}</div>
      <div className="dashboard-card-label">{label}</div>
    </div>
  );
};

const MainContent = ({
  activeSection,
  actividades = [],
  borrarTodasOfertas,
  actualizarActividades,
}) => {
  const totalCreditos = actividades.reduce(
    (acc, act) => acc + (act.creditos || 0),
    0
  );

  return (
    <div className="main-wrapper">
      <AdminSidebar />
      <main className="main-content">
        j
        {activeSection === "dashboard" && (
          <div>
            <h2 className="dashboard-title">Panel de Control</h2>
            <p className="dashboard-subtitle">
              Bienvenido de vuelta, Administrador
            </p>

            <div className="dashboard-cards-grid">
              <DashboardCard
                icon="📅"
                value={actividades.length}
                label="Actividades Ofertadas"
              />
              <DashboardCard
                icon="🎓"
                value={totalCreditos}
                label="Créditos Totales"
              />
            </div>
          </div>
        )}
        {activeSection === "events" && (
          <AdminPanel
            borrarTodasOfertas={borrarTodasOfertas}
            actualizarActividades={actualizarActividades}
          />
        )}
        {(activeSection === "users" ||
          activeSection === "inscriptions" ||
          activeSection === "reports" ||
          activeSection === "settings") && (
          <div className="placeholder-card">
            <h2>
              {activeSection === "users" && "Gestión de Usuarios"}
              {activeSection === "inscriptions" && "Inscripciones"}
              {activeSection === "reports" && "Reportes"}
              {activeSection === "settings" && "Configuración"}
            </h2>
            <p>Funcionalidad en desarrollo...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MainContent;
