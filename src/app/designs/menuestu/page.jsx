"use client";
import { useEffect, useState, useCallback } from "react";
import NavbarEst from "@/app/components/navbares";
import "./perfil.css";

const initialStudentData = {
  nombreCompleto: null,
  numeroControl: null,
  ubicacion: null,
  fotoUrl: null,
  fechaNacimiento: null,
  rfc: null,
  curp: null,
  telefono: null,
  email: null,
  carrera: null,
  carreraId: null,
};

export default function DashboardPage() {
  const [studentData, setStudentData] = useState(initialStudentData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState("dark");

  const fetchStudentData = useCallback(() => {
    try {
      const savedData = localStorage.getItem("studentData");
      if (savedData) {
        const data = JSON.parse(savedData);
        setStudentData(data);
      } else {
        setError(
          "No se encontraron datos de estudiante en el almacenamiento local."
        );
      }
    } catch (err) {
      console.error("Error al obtener o parsear datos del estudiante:", err);
      setError("Error al procesar la información del estudiante.");
      setStudentData(initialStudentData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudentData();
    const savedTheme = localStorage.getItem("perfilTheme") || "dark";
    setTheme(savedTheme);
  }, [fetchStudentData]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("perfilTheme", newTheme);
  };

  const {
    nombreCompleto,
    numeroControl,
    ubicacion,
    fotoUrl,
    fechaNacimiento,
    rfc,
    curp,
    telefono,
    email,
    carrera,
    carreraId,
  } = studentData;

  if (loading) {
    return (
      <div className="perfil-container perfil-centered" data-theme={theme}>
        <div className="perfil-loading">
          <div className="spinner"></div>
          <p>Cargando información del perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="perfil-container perfil-centered" data-theme={theme}>
        <div className="perfil-error">
          <svg
            className="error-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" />
            <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" />
          </svg>
          {error}
        </div>
      </div>
    );
  }

  const defaultText = "No disponible";

  const InfoCard = ({ icon, title, items }) => (
    <div className="info-card">
      <div className="card-header">
        <div className="card-icon">{icon}</div>
        <h2 className="card-title">{title}</h2>
      </div>
      <div className="card-content">
        {items.map((item, index) =>
          item.value ? (
            <div key={index} className="info-item">
              <span className="info-label">{item.label}</span>
              <span className="info-value">{item.value}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );

  return (
    <div className="perfil-container" data-theme={theme}>
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label="Cambiar tema"
      >
        {theme === "light" ? (
          <svg className="moon-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 7c0 3.866 3.134 7 7 7 1.958 0 3.729-.804 5-2.1V12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2h.1A7 7 0 0010 7z" />
          </svg>
        ) : (
          <svg className="sun-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 18C8.686 18 6 15.314 6 12s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6zM11 1h2v3h-2V1zM11 20h2v3h-2v-3zM3.515 4.929l1.414-1.414 2.121 2.121-1.414 1.414L3.515 4.93zM16.95 18.364l1.414-1.414 2.122 2.121-1.415 1.415-2.121-2.122zM19.071 3.515l1.414 1.414-2.122 2.122-1.414-1.415L19.07 3.515zM5.636 16.95l1.414 1.414-2.122 2.122-1.414-1.415 2.122-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z" />
          </svg>
        )}
      </button>

      <div className="portfolio-wrapper">
        <div className="hero-section">
          <div className="hero-background"></div>
          <div className="hero-content">
            <div className="profile-image-wrapper">
              <img
                className="profile-image"
                src={fotoUrl || "/imagenes/logoelegantee.png"}
                alt="Foto del estudiante"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/imagenes/logoelegantee.png";
                }}
              />
              <div className="status-badge">Activo</div>
            </div>
            <div className="hero-text">
              <h1 className="hero-name">{nombreCompleto || defaultText}</h1>
              <p className="hero-control">{numeroControl || defaultText}</p>
              <div className="hero-meta">
                <span className="meta-item">
                  <svg
                    className="meta-icon"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  </svg>
                  {ubicacion || "Sin ubicación"}
                </span>
                <span className="meta-item">
                  <svg
                    className="meta-icon"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" />
                  </svg>
                  {email || "Sin email"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="info-grid">
          <InfoCard
            icon={
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 9s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            }
            title="Información Personal"
            items={[
              { label: "Nombre Completo", value: nombreCompleto },
              { label: "Fecha de Nacimiento", value: fechaNacimiento },
              { label: "RFC", value: rfc },
              { label: "CURP", value: curp },
              { label: "Teléfono", value: telefono },
              { label: "Email", value: email },
            ]}
          />
          <InfoCard
            icon={
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
              </svg>
            }
            title="Información Académica"
            items={[
              { label: "Carrera", value: carrera || "Sin carrera asignada" },
              { label: "ID Carrera", value: carreraId },
              { label: "Número de Control", value: numeroControl },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
