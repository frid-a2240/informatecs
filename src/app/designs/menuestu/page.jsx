"use client";
import { useEffect, useState, useCallback } from "react";
import NavbarEst from "@/app/components/layout/navbares";
import "@/styles/alumno/perfil.css";

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
  sangre: "", 
  creditosAprobados: 0,
  carrera: "", 
  carreraId: "", 
  semestre: "",
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
        sangre: parsed.alutsa || parsed.sangre || "No disponible",
        carrera: carreraObj.carnom || "Sin carrera asignada",
        carreraId: carreraObj.carcve?.toString() || "N/A",
        semestre: firstInscripcion.calnpe || "No disponible",
        telefono: parsed.alute1 || parsed.telefono || "No disponible",
        creditosAprobados: parsed.calcac ?? parsed.creditosAprobados ?? 0,
        sexo: parsed.alusex === 1 ? "Masculino" : parsed.alusex === 2 ? "Femenino" : parsed.sexo || "No disponible",
      };

      setStudentData(merged);
      setError(null);
    } catch (err) {
      console.error("❌ Error al procesar datos:", err);
      setError("Error al procesar la información del estudiante.");
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
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [fetchStudentData]);

  if (loading) return (
    <div className="perfil-centered">
      <div className="spinner"></div>
      <p>Cargando información del perfil...</p>
    </div>
  );

  const {
    nombreCompleto,
    numeroControl,
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
    sangre,
    creditosAprobados,
  } = studentData;

  const InfoCard = ({ icon, title, items }) => (
    <div className="info-card">
      <div className="card-header">
        <div className="card-icon-box">{icon}</div>
        <div>
          <h2 className="card-title">{title}</h2>
          
        </div>
      </div>
      <div className="card-content">
        {items.map((item, index) => (
          <div key={index} className="data-row">
            <span className="data-label">{item.label}</span>
            <span className="data-value">
              {item.value || "No disponible"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="main-page-container">
    
      <div className="portfolio-wrapper">
        <header className="welcome-section">
          <div className="welcome-grid">
            <div className="mascot-container">
              <img 
                src={fotoUrl || "/imagenes/logoelegantee.png"} 
                className="profile-main-img" 
                alt="Foto" 
                onError={(e) => { e.target.src = "/imagenes/logoelegantee.png"; }}
              />
            </div>
            <div className="welcome-text-content">
            
              <h1 className="welcome-title">¡Bienvenido, {nombreCompleto.split(' ')[0]}!</h1>
              <p className="welcome-description">
                Esta es tu ficha de identidad académica. Por favor, verifica que tu información 
                personal y escolar coincida con tus documentos oficiales.
              </p>
              
            </div>
          </div>
        </header>

        <main className="info-grid">
          <InfoCard
            icon={<svg viewBox="0 0 24 24" width="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>}
            title="Información Personal"
            items={[
              { label: "Nombre Completo", value: nombreCompleto },
              { label: "Fecha de Nacimiento", value: fechaNacimiento },
              { label: "Tipo de Sangre", value: sangre },
              { label: "RFC", value: rfc },
              { label: "CURP", value: curp },
              { label: "Sexo", value: sexo },
              { label: "Teléfono", value: telefono },
              { label: "Email", value: email || studentData.alumai },
            ]}
          />

          <InfoCard
            icon={<svg viewBox="0 0 24 24" width="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>}
            title="Información Académica"
            items={[
              { label: "Carrera", value: carrera },
              { label: "Clave de Carrera", value: carreraId },
              { label: "Matrícula / Control", value: numeroControl },
              { label: "Semestre Actual", value: semestre },
              { label: "Créditos Aprobados", value: creditosAprobados },
            ]}
          />
        </main>
      </div>
    </div>
  );
}