// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import NavbarMaestro from "@/app/components/navbarmaestro";
// import { FiBook, FiClock, FiFileText, FiUser, FiMail, FiPhone, FiBriefcase, FiCalendar } from "react-icons/fi";
// import "./menumaestro.css";

// export default function MenuMaestrosPage() {
//   const router = useRouter();
//   const [maestroData, setMaestroData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const savedData = localStorage.getItem("maestroData");

//     if (!savedData) {
//       router.push("/designs/vistaLogin");
//       return;
//     }

//     const parsed = JSON.parse(savedData);
//     setMaestroData(parsed);
//     setLoading(false);
//   }, [router]);

//   if (loading) {
//     return (
//       <div className="maestro-loading-screen">
//         <div className="loader-circle"></div>
//         <p className="loader-text">Cargando tu espacio...</p>
//       </div>
//     );
//   }

//   if (!maestroData) {
//     return (
//       <div className="maestro-error-screen">
//         <div className="error-icon">⚠️</div>
//         <p>No se encontró información del maestro</p>
//         <button onClick={() => router.push("/designs/vistaLogin")}>
//           Volver al Login
//         </button>
//       </div>
//     );
//   }

//   return (
//     <>
//       <NavbarMaestro />
//       <div className="maestro-main-wrapper">
//         {/* Hero Section */}
//         <div className="maestro-hero">
//           <div className="hero-gradient"></div>
//           <div className="hero-content-wrapper">
//             <div className="hero-avatar">
//               <img
//                 src="/imagenes/logoelegantee.png"
//                 alt="Avatar"
//                 className="avatar-image"
//               />
//               <div className="avatar-status"></div>
//             </div>
//             <div className="hero-info">
//               <h1 className="hero-title">¡Bienvenido, {maestroData.nombreCompleto}!</h1>
//               <p className="hero-subtitle">
//                 <FiUser className="inline-icon" /> Profesor • ID: {maestroData.percve}
//               </p>
//               <div className="hero-badges">
//                 <span className="badge badge-purple">
//                   <FiBriefcase /> Activo
//                 </span>
//                 <span className="badge badge-blue">
//                   <FiCalendar /> Ciclo 2025
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="maestro-content">
//           {/* Quick Stats */}
//           <div className="stats-section">
//             <h2 className="section-title">
//               <span className="title-icon">📊</span>
//               Resumen Rápido
//             </h2>
//             <div className="stats-grid">
//               <div className="stat-card stat-purple">
//                 <div className="stat-icon-wrapper">
//                   <FiBook />
//                 </div>
//                 <div className="stat-details">
//                   <p className="stat-label">Materias</p>
//                   <h3 className="stat-value">5</h3>
//                 </div>
//                 <div className="stat-decoration"></div>
//               </div>

//               <div className="stat-card stat-blue">
//                 <div className="stat-icon-wrapper">
//                   <FiClock />
//                 </div>
//                 <div className="stat-details">
//                   <p className="stat-label">Horas/Semana</p>
//                   <h3 className="stat-value">24</h3>
//                 </div>
//                 <div className="stat-decoration"></div>
//               </div>

//               <div className="stat-card stat-green">
//                 <div className="stat-icon-wrapper">
//                   <FiFileText />
//                 </div>
//                 <div className="stat-details">
//                   <p className="stat-label">Estudiantes</p>
//                   <h3 className="stat-value">142</h3>
//                 </div>
//                 <div className="stat-decoration"></div>
//               </div>

//               <div className="stat-card stat-orange">
//                 <div className="stat-icon-wrapper">
//                   <FiCalendar />
//                 </div>
//                 <div className="stat-details">
//                   <p className="stat-label">Semana Actual</p>
//                   <h3 className="stat-value">14</h3>
//                 </div>
//                 <div className="stat-decoration"></div>
//               </div>
//             </div>
//           </div>

//           {/* Info Personal */}
//           <div className="info-section">
//             <h2 className="section-title">
//               <span className="title-icon">👤</span>
//               Información Personal
//             </h2>
//             <div className="info-grid">
//               <div className="info-item">
//                 <div className="info-icon-wrapper purple">
//                   <FiMail />
//                 </div>
//                 <div className="info-content">
//                   <p className="info-label">Correo Electrónico</p>
//                   <p className="info-value">{maestroData.correo || "No disponible"}</p>
//                 </div>
//               </div>

//               <div className="info-item">
//                 <div className="info-icon-wrapper blue">
//                   <FiPhone />
//                 </div>
//                 <div className="info-content">
//                   <p className="info-label">Teléfono</p>
//                   <p className="info-value">{maestroData.telefono || "No disponible"}</p>
//                 </div>
//               </div>

//               <div className="info-item">
//                 <div className="info-icon-wrapper green">
//                   <FiBriefcase />
//                 </div>
//                 <div className="info-content">
//                   <p className="info-label">Departamento</p>
//                   <p className="info-value">{maestroData.departamento || "No asignado"}</p>
//                 </div>
//               </div>

//               <div className="info-item">
//                 <div className="info-icon-wrapper orange">
//                   <FiUser />
//                 </div>
//                 <div className="info-content">
//                   <p className="info-label">Sexo</p>
//                   <p className="info-value">{maestroData.sexo || "No especificado"}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Accesos Rápidos */}
//           <div className="quick-section">
//             <h2 className="section-title">
//               <span className="title-icon">⚡</span>
//               Accesos Rápidos
//             </h2>
//             <div className="quick-grid">
//               <button
//                 className="quick-card quick-purple"
//                 onClick={() => router.push("/designs/menumaestros/perfil")}
//               >
//                 <div className="quick-card-bg"></div>
//                 <FiUser className="quick-card-icon" />
//                 <h3>Mi Perfil</h3>
//                 <p>Ver información completa</p>
//                 <div className="quick-card-arrow">→</div>
//               </button>

//               <button
//                 className="quick-card quick-blue"
//                 onClick={() => router.push("/designs/menumaestros/vistaMismaterias")}
//               >
//                 <div className="quick-card-bg"></div>
//                 <FiBook className="quick-card-icon" />
//                 <h3>Mis Materias</h3>
//                 <p>Gestionar asignaturas</p>
//                 <div className="quick-card-arrow">→</div>
//               </button>

//               <button
//                 className="quick-card quick-green"
//                 onClick={() => router.push("/designs/menumaestros/vistaMihorario")}
//               >
//                 <div className="quick-card-bg"></div>
//                 <FiClock className="quick-card-icon" />
//                 <h3>Mi Horario</h3>
//                 <p>Consultar calendario</p>
//                 <div className="quick-card-arrow">→</div>
//               </button>

//               <button
//                 className="quick-card quick-orange"
//                 onClick={() => router.push("/designs/menumaestros/vistaCalificaciones")}
//               >
//                 <div className="quick-card-bg"></div>
//                 <FiFileText className="quick-card-icon" />
//                 <h3>Calificaciones</h3>
//                 <p>Gestionar evaluaciones</p>
//                 <div className="quick-card-arrow">→</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavbarMaestro from "@/app/components/navbarmaestro";
import {
  FiBook,
  FiCalendar,
  FiUsers,
  FiClock,
  FiFileText,
  FiUser,
  FiAward,
  FiHome,
  FiChevronRight,
  FiMail,
  FiPhone,
  FiCheckCircle,
  FiTrendingUp,
  FiMapPin,
} from "react-icons/fi";
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
        <p className="loader-text">Cargando...</p>
      </div>
    );
  }

  if (!maestroData) {
    return (
      <div className="maestro-error-screen">
        <div className="error-icon">⚠️</div>
        <p>No se encontró información</p>
        <button onClick={() => router.push("/designs/vistaLogin")}>
          Volver al Login
        </button>
      </div>
    );
  }

  return (
    <>
      <NavbarMaestro />
      <div className="maestro-interface">
        {/* Banner Superior */}
        <div className="top-banner">
          <div className="banner-content">
            <div className="banner-text">
              <h1 className="banner-title">
                Prof.{" "}
                <span className="highlight">
                  {maestroData.nombreCompleto?.split(" ")[0]}
                </span>
              </h1>
              <p className="banner-subtitle">Sistema de Gestión Académica</p>
            </div>
            <div className="banner-badges">
              <span className="badge-cycle">
                <FiCalendar /> Ciclo 2025
              </span>
              <span className="badge-status">
                <FiCheckCircle /> Activo
              </span>
            </div>
          </div>
        </div>

        {/* Área de Estadísticas - Estilo Dashboard */}
        <div className="dashboard-area">
          <div className="metric-display">
            <div className="metric-large">
              <div className="metric-icon">
                <FiBook />
              </div>
              <div className="metric-content">
                <span className="metric-value">5</span>
                <span className="metric-label">Materias Activas</span>
              </div>
              <div className="metric-trend">
                <FiTrendingUp />
                <span>+0 este ciclo</span>
              </div>
            </div>

            <div className="metric-grid">
              <div className="metric-item">
                <div className="metric-item-icon">
                  <FiClock />
                </div>
                <div className="metric-item-content">
                  <h4>24 hrs</h4>
                  <p>Carga semanal</p>
                </div>
              </div>

              <div className="metric-item">
                <div className="metric-item-icon">
                  <FiUsers />
                </div>
                <div className="metric-item-content">
                  <h4>142</h4>
                  <p>Estudiantes</p>
                </div>
              </div>

              <div className="metric-item">
                <div className="metric-item-icon">
                  <FiCalendar />
                </div>
                <div className="metric-item-content">
                  <h4>Semana 14</h4>
                  <p>Avance del ciclo</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de Acciones - Estilo Lista/Barra */}
        <div className="actions-panel">
          <div className="panel-header">
            <h2 className="panel-title">Acciones Disponibles</h2>
            <div className="panel-divider"></div>
          </div>

          <div className="actions-list">
            <div
              className="action-row"
              onClick={() => router.push("/designs/menumaestros/perfil")}
            >
              <div className="action-row-left">
                <div className="action-icon">
                  <FiUser />
                </div>
                <div className="action-info">
                  <h3>Mi Perfil</h3>
                  <p>Información personal y académica</p>
                </div>
              </div>
              <div className="action-row-right">
                <FiChevronRight className="action-arrow" />
              </div>
            </div>

            <div
              className="action-row"
              onClick={() =>
                router.push("/designs/menumaestros/vistaMismaterias")
              }
            >
              <div className="action-row-left">
                <div className="action-icon">
                  <FiBook />
                </div>
                <div className="action-info">
                  <h3>Mis Materias</h3>
                  <p>Gestiona 5 asignaturas activas</p>
                </div>
              </div>
              <div className="action-row-right">
                <FiChevronRight className="action-arrow" />
              </div>
            </div>

            <div
              className="action-row"
              onClick={() =>
                router.push("/designs/menumaestros/vistaMihorario")
              }
            >
              <div className="action-row-left">
                <div className="action-icon">
                  <FiClock />
                </div>
                <div className="action-info">
                  <h3>Mi Horario</h3>
                  <p>24 horas semanales programadas</p>
                </div>
              </div>
              <div className="action-row-right">
                <FiChevronRight className="action-arrow" />
              </div>
            </div>

            <div
              className="action-row"
              onClick={() =>
                router.push("/designs/menumaestros/vistaCalificaciones")
              }
            >
              <div className="action-row-left">
                <div className="action-icon">
                  <FiAward />
                </div>
                <div className="action-info">
                  <h3>Calificaciones</h3>
                  <p>142 estudiantes asignados</p>
                </div>
              </div>
              <div className="action-row-right">
                <FiChevronRight className="action-arrow" />
              </div>
            </div>
          </div>
        </div>

        {/* Información Personal - Estilo Minimalista */}
        <div className="personal-info-section">
          <div className="info-header">
            <FiUser className="header-icon" />
            <h2>Identificación</h2>
          </div>

          <div className="info-table">
            <div className="table-row">
              <div className="table-cell label">
                <FiUser className="cell-icon" />
                <span>Nombre</span>
              </div>
              <div className="table-cell value">
                {maestroData.nombreCompleto}
              </div>
            </div>

            <div className="table-row">
              <div className="table-cell label">
                <FiFileText className="cell-icon" />
                <span>ID Profesor</span>
              </div>
              <div className="table-cell value">{maestroData.percve}</div>
            </div>

            <div className="table-row">
              <div className="table-cell label">
                <FiMapPin className="cell-icon" />
                <span>Departamento</span>
              </div>
              <div className="table-cell value">
                {maestroData.departamento || "No asignado"}
              </div>
            </div>

            <div className="table-row">
              <div className="table-cell label">
                <FiMail className="cell-icon" />
                <span>Correo</span>
              </div>
              <div className="table-cell value email">
                {maestroData.correo || "No disponible"}
              </div>
            </div>

            <div className="table-row">
              <div className="table-cell label">
                <FiPhone className="cell-icon" />
                <span>Teléfono</span>
              </div>
              <div className="table-cell value">
                {maestroData.telefono || "No disponible"}
              </div>
            </div>
          </div>
        </div>

        {/* Barra de Estado Inferior */}
        <div className="status-bar">
          <div className="status-content">
            <div className="status-item">
              <span className="status-dot active"></span>
              <span>Sistema: Operativo</span>
            </div>
            <div className="status-divider"></div>
            <div className="status-item">
              <span>ID: {maestroData.percve}</span>
            </div>
            <div className="status-divider"></div>
            <div className="status-item">
              <span>Último acceso: Hoy</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
