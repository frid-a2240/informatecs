"use client";
import React, { useEffect, useState } from "react";
import NavbarEst from "@/app/components/navbares";
import "./actividades.css"; // Si deseas estilos separados

export default function MisActividades() {
  const [inscripciones, setInscripciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("studentData");
    if (stored) {
      const parsed = JSON.parse(stored);
      setStudentData(parsed);

      fetch(`/api/inscripciones?aluctr=${parsed.numeroControl}`)
        .then((res) => res.json())
        .then((data) => setInscripciones(data))
        .catch((err) => console.error("Error cargando inscripciones:", err))
        .finally(() => setLoading(false));
    }
  }, []);

  if (!studentData) return <p>Inicia sesión para ver tus actividades.</p>;
  if (loading) return <p>Cargando tus inscripciones...</p>;

  return (
    <div className="dashboard-container">
      <NavbarEst />
      <main className="dashboard-main">
        <h1>Mis Actividades Inscritas</h1>
        {inscripciones.length === 0 ? (
          <p>No estás inscrito en ninguna actividad aún.</p>
        ) : (
          <div className="actividades-list">
            {inscripciones.map((item, index) => (
              <div className="actividad-card" key={index}>
                <h3>{item.actividad.aconco}</h3>
                <p>
                  <strong>Código:</strong> {item.actividad.acocve}
                </p>
                <p>
                  <strong>Créditos:</strong> {item.actividad.acocre}
                </p>
                <p>
                  <strong>Horas:</strong> {item.actividad.acohrs}
                </p>
                <p>
                  <strong>Fecha de inscripción:</strong>{" "}
                  {new Date(item.fechaInscripcion).toLocaleDateString()}
                </p>
                <hr />
                <p>
                  <strong>¿Has practicado antes?</strong>{" "}
                  {item.formularioData?.hasPracticed}
                </p>
                <p>
                  <strong>¿Tienes alguna enfermedad?</strong>{" "}
                  {item.formularioData?.hasIllness}
                </p>
                <p>
                  <strong>Propósito:</strong> {item.formularioData?.purpose}
                </p>
                <p>
                  <strong>Tipo de sangre:</strong>{" "}
                  {item.formularioData?.bloodType}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
