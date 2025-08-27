"use client";

import { useState } from "react";
import NavbarEst from "@/app/components/navbares";

export default function WelcomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="dashboard-container">
      {/* Sidebar con toggle */}
      <NavbarEst open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Contenido principal */}
      <main
        className={`dashboard-main welcome-main ${
          sidebarOpen ? "with-sidebar" : "full-width"
        }`}
      >
        <div className="welcome-card">
          <h1>¡Bienvenido a tu panel!</h1>
          <p>
            En este portal podrás verificar toda tu información personal y
            académica antes de realizar tu inscripción a cualquier evento
            institucional. Esta revisión te permitirá asegurarte de que cumples
            con los requisitos necesarios para participar, evitando
            inscripciones en actividades para las cuales no estás elegible. Te
            invitamos a consultar cuidadosamente tus datos y confirmar que todo
            esté correcto, garantizando así un proceso de registro eficiente y
            sin inconvenientes. ¡Disfruta de la experiencia y participa en los
            eventos que mejor se ajusten a tu perfil académico!
          </p>
        </div>
      </main>

      <style jsx>{`
        /* -----------------------------
           Layout general
        ----------------------------- */
        .dashboard-container {
          display: flex;
          min-height: 100vh;
          background-color: #f5f7fa;
          font-family: "Inter", sans-serif;
        }

        /* -----------------------------
           Contenido principal
        ----------------------------- */
        .dashboard-main {
          flex: 1;
          padding: 2rem 3rem;
          transition: margin-left 0.3s ease;
        }

        .with-sidebar {
          margin-left: 220px;
        }

        .full-width {
          margin-left: 70px;
        }

        /* -----------------------------
           Página de bienvenida
        ----------------------------- */
        .welcome-main {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
        }

        .welcome-card {
          background-color: #ffffff;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
          max-width: 800px;
        }

        .welcome-card h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #1f3a93;
          margin-bottom: 1rem;
        }

        .welcome-card p {
          font-size: 1rem;
          line-height: 1.8;
          color: #333;
        }

        /* -----------------------------
           Responsividad
        ----------------------------- */
        @media (max-width: 1024px) {
          .with-sidebar {
            margin-left: 70px;
          }

          .dashboard-main {
            padding: 1.5rem 2rem;
          }

          .welcome-card h1 {
            font-size: 1.7rem;
          }

          .welcome-card p {
            font-size: 0.95rem;
          }
        }

        @media (max-width: 768px) {
          .dashboard-container {
            flex-direction: column;
          }

          .with-sidebar,
          .full-width {
            margin-left: 0;
          }

          .dashboard-main {
            padding: 1rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
