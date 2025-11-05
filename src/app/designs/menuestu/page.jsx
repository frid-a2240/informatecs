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
  inscripciones: [],
};

export default function DashboardPage() {
  const [studentData, setStudentData] = useState(initialStudentData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudentData = useCallback(() => {
    try {
      const savedData = localStorage.getItem("studentData");
      if (savedData) {
        const data = JSON.parse(savedData);
        setStudentData(data);
        console.log("Datos cargados del estudiante:", data);
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
  }, [fetchStudentData]);

  if (loading) {
    return (
      <div className="perfil-container perfil-centered">
        <div className="perfil-loading">
          <div className="spinner"></div>
          <p>Cargando información del perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="perfil-container perfil-centered">
        <div className="perfil-error">{error}</div>
      </div>
    );
  }

  const defaultText = "No disponible";
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
    inscripciones,
  } = studentData;

  const primeraInscripcion = inscripciones?.[0];
  const carrera = primeraInscripcion?.carrera?.carnom || "Sin carrera asignada";
  const carreraId = primeraInscripcion?.carrera?.carcve || "N/A";

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
    <div className="perfil-container">
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
                  {ubicacion || "Sin ubicación"}
                </span>
                <span className="meta-item">{email || "Sin email"}</span>
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
              { label: "Carrera", value: carrera },
              { label: "ID Carrera", value: carreraId },
              { label: "Número de Control", value: numeroControl },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
