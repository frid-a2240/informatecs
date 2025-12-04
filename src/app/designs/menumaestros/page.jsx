"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavbarMaestro from "@/app/components/navbarmaestro";
import { FiBook, FiClock, FiFileText, FiUser, FiMail, FiPhone, FiBriefcase, FiCalendar } from "react-icons/fi";
import "./menumaestro.css";

export default function MenuMaestrosPage() {
  const router = useRouter();
  const [maestroData, setMaestroData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedData = localStorage.getItem("maestroData");
    
    if (!savedData) {
      router.push("/designs/vistaLogin");
      return;
    }

    const parsed = JSON.parse(savedData);
    setMaestroData(parsed);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="maestro-loading-screen">
        <div className="loader-circle"></div>
        <p className="loader-text">Cargando tu espacio...</p>
      </div>
    );
  }

  if (!maestroData) {
    return (
      <div className="maestro-error-screen">
        <div className="error-icon">⚠️</div>
        <p>No se encontró información del maestro</p>
        <button onClick={() => router.push("/designs/vistaLogin")}>
          Volver al Login
        </button>
      </div>
    );
  }

  return (
    <>
      <NavbarMaestro />
      <div className="maestro-main-wrapper">
        {/* Hero Section */}
        <div className="maestro-hero">
          <div className="hero-gradient"></div>
          <div className="hero-content-wrapper">
            <div className="hero-avatar">
              <img 
                src="/imagenes/logoelegantee.png" 
                alt="Avatar"
                className="avatar-image"
              />
              <div className="avatar-status"></div>
            </div>
            <div className="hero-info">
              <h1 className="hero-title">¡Bienvenido, {maestroData.nombreCompleto}!</h1>
              <p className="hero-subtitle">
                <FiUser className="inline-icon" /> Profesor • ID: {maestroData.percve}
              </p>
              <div className="hero-badges">
                <span className="badge badge-purple">
                  <FiBriefcase /> Activo
                </span>
                <span className="badge badge-blue">
                  <FiCalendar /> Ciclo 2025
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="maestro-content">
          {/* Quick Stats */}
          <div className="stats-section">
            <h2 className="section-title">
              <span className="title-icon">📊</span>
              Resumen Rápido
            </h2>
            <div className="stats-grid">
              <div className="stat-card stat-purple">
                <div className="stat-icon-wrapper">
                  <FiBook />
                </div>
                <div className="stat-details">
                  <p className="stat-label">Materias</p>
                  <h3 className="stat-value">5</h3>
                </div>
                <div className="stat-decoration"></div>
              </div>

              <div className="stat-card stat-blue">
                <div className="stat-icon-wrapper">
                  <FiClock />
                </div>
                <div className="stat-details">
                  <p className="stat-label">Horas/Semana</p>
                  <h3 className="stat-value">24</h3>
                </div>
                <div className="stat-decoration"></div>
              </div>

              <div className="stat-card stat-green">
                <div className="stat-icon-wrapper">
                  <FiFileText />
                </div>
                <div className="stat-details">
                  <p className="stat-label">Estudiantes</p>
                  <h3 className="stat-value">142</h3>
                </div>
                <div className="stat-decoration"></div>
              </div>

              <div className="stat-card stat-orange">
                <div className="stat-icon-wrapper">
                  <FiCalendar />
                </div>
                <div className="stat-details">
                  <p className="stat-label">Semana Actual</p>
                  <h3 className="stat-value">14</h3>
                </div>
                <div className="stat-decoration"></div>
              </div>
            </div>
          </div>

          {/* Info Personal */}
          <div className="info-section">
            <h2 className="section-title">
              <span className="title-icon">👤</span>
              Información Personal
            </h2>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-icon-wrapper purple">
                  <FiMail />
                </div>
                <div className="info-content">
                  <p className="info-label">Correo Electrónico</p>
                  <p className="info-value">{maestroData.correo || "No disponible"}</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon-wrapper blue">
                  <FiPhone />
                </div>
                <div className="info-content">
                  <p className="info-label">Teléfono</p>
                  <p className="info-value">{maestroData.telefono || "No disponible"}</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon-wrapper green">
                  <FiBriefcase />
                </div>
                <div className="info-content">
                  <p className="info-label">Departamento</p>
                  <p className="info-value">{maestroData.departamento || "No asignado"}</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon-wrapper orange">
                  <FiUser />
                </div>
                <div className="info-content">
                  <p className="info-label">Sexo</p>
                  <p className="info-value">{maestroData.sexo || "No especificado"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Accesos Rápidos */}
          <div className="quick-section">
            <h2 className="section-title">
              <span className="title-icon">⚡</span>
              Accesos Rápidos
            </h2>
            <div className="quick-grid">
              <button 
                className="quick-card quick-purple"
                onClick={() => router.push("/designs/menumaestros/perfil")}
              >
                <div className="quick-card-bg"></div>
                <FiUser className="quick-card-icon" />
                <h3>Mi Perfil</h3>
                <p>Ver información completa</p>
                <div className="quick-card-arrow">→</div>
              </button>

              <button 
                className="quick-card quick-blue"
                onClick={() => router.push("/designs/menumaestros/vistaMismaterias")}
              >
                <div className="quick-card-bg"></div>
                <FiBook className="quick-card-icon" />
                <h3>Mis Materias</h3>
                <p>Gestionar asignaturas</p>
                <div className="quick-card-arrow">→</div>
              </button>

              <button 
                className="quick-card quick-green"
                onClick={() => router.push("/designs/menumaestros/vistaMihorario")}
              >
                <div className="quick-card-bg"></div>
                <FiClock className="quick-card-icon" />
                <h3>Mi Horario</h3>
                <p>Consultar calendario</p>
                <div className="quick-card-arrow">→</div>
              </button>

              <button 
                className="quick-card quick-orange"
                onClick={() => router.push("/designs/menumaestros/vistaCalificaciones")}
              >
                <div className="quick-card-bg"></div>
                <FiFileText className="quick-card-icon" />
                <h3>Calificaciones</h3>
                <p>Gestionar evaluaciones</p>
                <div className="quick-card-arrow">→</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
