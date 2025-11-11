"use client";
import { useEffect, useState, useCallback } from "react";
import NavbarEst from "@/app/components/navbares";
import "./perfil.css";

const initialStudentData = {
  nombreCompleto: "",
  numeroControl: "",
  ubicacion: "",
  fotoUrl: "",
  fechaNacimiento: "",
  rfc: "",
  curp: "",
  telefono: "",
  email: "",
  sexo: "",
  carrera: "", // Nombre de la carrera
  carreraId: "", // ID de la carrera
  semestre: "", // Semestre
  inscripciones: [],
};

export default function DashboardPage() {
  const [studentData, setStudentData] = useState(initialStudentData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudentData = useCallback(() => {
    try {
      const savedData = localStorage.getItem("studentData");
      if (!savedData) throw new Error("No se encontraron datos");

      const parsed = JSON.parse(savedData);
      const firstInscripcion = parsed.inscripciones?.[0] || {};
      const carreraObj = firstInscripcion.carrera || {};

      const merged = {
        ...initialStudentData,
        ...parsed,
        carrera: carreraObj.carnom || "Sin carrera asignada",
        carreraId: carreraObj.carcve?.toString() || "N/A",
        semestre: firstInscripcion.calnpe || "No disponible",
        sexo:
          parsed.alusex === 1
            ? "Masculino"
            : parsed.alusex === 2
            ? "Femenino"
            : parsed.sexo || "No disponible",
      };

      setStudentData(merged);
      console.log("✅ Datos del estudiante actualizados:", merged);
      setError(null);
    } catch (err) {
      console.error("❌ Error al procesar datos del estudiante:", err);
      setError("Error al procesar la información del estudiante.");
      setStudentData(initialStudentData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "studentData") fetchStudentData();
    };

    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(() => {
      const savedData = localStorage.getItem("studentData");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.numeroControl !== studentData.numeroControl) {
          fetchStudentData();
        }
      }
    }, 5000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [fetchStudentData, studentData.numeroControl]);

  if (loading)
    return (
      <div className="perfil-container perfil-centered">
        <div className="perfil-loading">
          <div className="spinner"></div>
          <p>Cargando información del perfil...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="perfil-container perfil-centered">
        <div className="perfil-error">{error}</div>
      </div>
    );

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
    semestre,
    sexo,
  } = studentData;

  const defaultText = "No disponible";

  const InfoCard = ({ icon, title, items }) => (
    <div className="info-card">
      <div className="card-header">
        <div className="card-icon">{icon}</div>
        <h2 className="card-title">{title}</h2>
      </div>
      <div className="card-content">
        {items.map(
          (item, index) =>
            item.value && (
              <div key={index} className="info-item">
                <span className="info-label">{item.label}</span>
                <span className="info-value">{item.value}</span>
              </div>
            )
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
              { label: "Sexo", value: sexo },
              { label: "Semestre", value: semestre },
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
