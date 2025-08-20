"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import "animate.css";
import "./perfil.css";

const datosFicticios = {
  matricula: "2024001",
  carrera: "Ingeniería en Sistemas",
  semestre: 5,
  creditos: 42,
  email: "correo@example.com",
  telefono: "555-123-4567",

  profileImage: "/imagenes/logoevento.png",
  horario: [
    { dia: "Lunes", materia: "Matemáticas", hora: "8:00 - 10:00" },
    { dia: "Miércoles", materia: "Programación", hora: "10:00 - 12:00" },
    { dia: "Viernes", materia: "Física", hora: "14:00 - 16:00" },
  ],
};

function LoadingAnimation() {
  return (
    // Usa las clases CSS definidas en perfil.css para centrar la animación
    <div
      className="perfil-container" // Esta clase tiene flex, min-height: 100vh, etc.
      style={{
        // Sobrescribe o añade estilos específicos para el centrado del cargador
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
        minHeight: "100vh", // Asegura que ocupe toda la altura de la vista
      }}
    >
      <div className="loader-container">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="line" style={{ "--i": i }}></div>
        ))}
      </div>

      <p className="perfil-loading-text">Cargando perfil...</p>
    </div>
  );
}

export default function PerfilEstudiante() {
  const searchParams = useSearchParams();
  const nameParam = searchParams.get("name");

  const [nombreReal, setNombreReal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!nameParam) return;

    setLoading(true);
    const timeout = setTimeout(() => {
      setNombreReal(nameParam);
      setLoading(false);
    }, 600); // Pequeño retraso para que la animación de carga sea visible

    return () => clearTimeout(timeout);
  }, [nameParam]);

  if (!nameParam) {
    return (
      <div
        className="perfil-container"
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <p className="perfil-message">No se proporcionó un nombre en la URL.</p>
      </div>
    );
  }

  if (loading) return <LoadingAnimation />;

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <h1 className="perfil-title">Bienvenido, {nombreReal}</h1>

        <div className="perfil-main-content">
          <div className="perfil-info-section">
            <h2
              className="perfil-section-title"
              style={{
                borderBottom: "none",
                marginBottom: "0.5rem",
                textAlign: "left",
                fontSize: "1.5rem",
                color: "#1e3a8a",
              }}
            >
              Información Personal
            </h2>
            <div className="perfil-info-grid">
              <div className="perfil-info-item">
                <strong>Matrícula</strong>
                <span>{datosFicticios.matricula}</span>
              </div>
              <div className="perfil-info-item">
                <strong>Carrera</strong>
                <span>{datosFicticios.carrera}</span>
              </div>
              <div className="perfil-info-item">
                <strong>Semestre</strong>
                <span>{datosFicticios.semestre}</span>
              </div>
              <div className="perfil-info-item">
                <strong>Créditos</strong>
                <span>{datosFicticios.creditos}</span>
              </div>
              <div className="perfil-info-item">
                <strong>Email</strong>
                <span>{datosFicticios.email}</span>
              </div>
              <div className="perfil-info-item">
                <strong>Teléfono</strong>
                <span>{datosFicticios.telefono}</span>
              </div>
            </div>
          </div>

          <div className="perfil-image-section">
            <img
              src={datosFicticios.profileImage}
              alt="Foto de Perfil del Estudiante"
              className="perfil-profile-image"
            />

            <p
              style={{ fontSize: "0.9rem", color: "#555", textAlign: "center" }}
            >
              Estudiante dedicado del Tecnológico Nacional de México,
              comprometido con la excelencia académica y el desarrollo
              profesional.
            </p>
          </div>
        </div>

        <h2 className="perfil-section-title">Horario de Clases</h2>
        <div className="perfil-table-container">
          <table className="perfil-table">
            <thead>
              <tr>
                <th className="perfil-table th">Día</th>
                <th className="perfil-table th">Materia</th>
                <th className="perfil-table th">Hora</th>
              </tr>
            </thead>
            <tbody>
              {datosFicticios.horario.map(({ dia, materia, hora }) => (
                <tr key={dia + materia} className="perfil-table tr">
                  <td className="perfil-table td">{dia}</td>
                  <td className="perfil-table td">{materia}</td>
                  <td className="perfil-table td">{hora}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
