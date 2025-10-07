"use client";

import React, { useState } from "react";

const MisActividades = ({ misActividades }) => {
  const [actividadExpandida, setActividadExpandida] = useState(null);

  if (!misActividades || misActividades.length === 0) {
    return (
      <>
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            color: "#666",
            background: "rgba(255,255,255,0.95)",
            borderRadius: "15px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
            marginTop: "2rem",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📝</div>
          <h4 style={{ marginBottom: "0.5rem" }}>
            No tienes actividades inscritas
          </h4>
          <p>
            Ve a "Actividades Complementarias" para inscribirte en alguna
            actividad.
          </p>
        </div>
      </>
    );
  }

  return (
    <div style={{ display: "grid", gap: "1.5rem", marginTop: "2rem" }}>
      {misActividades.map((inscripcion, index) => {
        const actividad = inscripcion.formSport;
        const data = inscripcion.formData;
        const isExpanded = actividadExpandida === index;

        return (
          <div
            key={index}
            style={{
              border: "2px solid #e0e0e0",
              borderRadius: "12px",
              overflow: "hidden",
              backgroundColor: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            {/* Header */}
            <div
              onClick={() => setActividadExpandida(isExpanded ? null : index)}
              style={{
                padding: "1.5rem",
                backgroundColor: "#f8f9fa",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: isExpanded ? "2px solid #e0e0e0" : "none",
              }}
            >
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "1.4rem",
                    color: "#333",
                    fontWeight: "700",
                  }}
                >
                  {actividad?.name || "Actividad"}
                </h3>
                <p
                  style={{
                    margin: "0.5rem 0 0 0",
                    fontSize: "0.9rem",
                    color: "#666",
                  }}
                >
                  Código: {actividad?.actividadId || "N/A"} | Créditos: N/A |
                  Horas: N/A
                </p>
              </div>
              <div style={{ fontSize: "1.5rem", color: "#666" }}>
                {isExpanded ? "▼" : "▶"}
              </div>
            </div>

            {/* Contenido expandido */}
            {isExpanded && (
              <div style={{ padding: "2rem" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      padding: "1rem",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "8px",
                      borderLeft: "4px solid #007bff",
                    }}
                  >
                    <h4
                      style={{
                        margin: "0 0 0.5rem 0",
                        fontSize: "0.9rem",
                        color: "#666",
                        textTransform: "uppercase",
                      }}
                    >
                      Tipo de Sangre
                    </h4>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        color: "#333",
                      }}
                    >
                      {data?.bloodType || "N/A"}
                    </p>
                  </div>

                  <div
                    style={{
                      padding: "1rem",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "8px",
                      borderLeft: "4px solid #ffc107",
                    }}
                  >
                    <h4
                      style={{
                        margin: "0 0 0.5rem 0",
                        fontSize: "0.9rem",
                        color: "#666",
                        textTransform: "uppercase",
                      }}
                    >
                      Experiencia Previa
                    </h4>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        color: "#333",
                      }}
                    >
                      {data?.hasPracticed === "si"
                        ? "Sí ha practicado"
                        : "No ha practicado"}
                    </p>
                  </div>

                  <div
                    style={{
                      padding: "1rem",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "8px",
                      borderLeft: "4px solid #dc3545",
                    }}
                  >
                    <h4
                      style={{
                        margin: "0 0 0.5rem 0",
                        fontSize: "0.9rem",
                        color: "#666",
                        textTransform: "uppercase",
                      }}
                    >
                      Condición Médica
                    </h4>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        color: "#333",
                      }}
                    >
                      {data?.hasIllness === "si" ? "Sí reportó" : "No reportó"}
                    </p>
                  </div>

                  <div
                    style={{
                      padding: "1rem",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "8px",
                      borderLeft: "4px solid #6f42c1",
                      gridColumn: "span 2",
                    }}
                  >
                    <h4
                      style={{
                        margin: "0 0 0.5rem 0",
                        fontSize: "0.9rem",
                        color: "#666",
                        textTransform: "uppercase",
                      }}
                    >
                      Propósito de Inscripción
                    </h4>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        color: "#333",
                      }}
                    >
                      {data?.purpose || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MisActividades;
