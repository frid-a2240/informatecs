"use client";
import React, { useEffect, useState } from "react";
import NavbarEst from "@/app/components/navbares";
import {
  ChevronDown,
  ChevronUp,
  Droplets,
  Clock,
  Building2,
} from "lucide-react";
import "./actividades.css";

export default function MisActividades() {
  const [inscripciones, setInscripciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [expanded, setExpanded] = useState(null);

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

  const toggleExpand = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  if (!studentData) return <p>Inicia sesión para ver tus actividades.</p>;
  if (loading) return <p>Cargando tus inscripciones...</p>;

  return (
    <div className="actividades-container">
      <main className="actividades-main">
        <h1 className="titulo-principal">📅 Mis Actividades Inscritas</h1>

        {inscripciones.length === 0 ? (
          <p className="mensaje-vacio">
            No estás inscrito en ninguna actividad aún.
          </p>
        ) : (
          <div className="lista-actividades">
            {inscripciones.map((item, index) => (
              <div className="actividad-card" key={index}>
                <div
                  className="card-header"
                  onClick={() => toggleExpand(index)}
                >
                  <div>
                    <h3>{item.actividad?.aconco || "Actividad sin nombre"}</h3>
                    <p className="subinfo">
                      Código: {item.actividad?.acocve} | Créditos:{" "}
                      {item.actividad?.acocre} | Horas: {item.actividad?.acohrs}
                    </p>
                  </div>
                  <button className="btn-toggle">
                    {expanded === index ? <ChevronUp /> : <ChevronDown />}
                  </button>
                </div>

                {expanded === index && (
                  <div className="card-body">
                    <div className="detalle-grid">
                      <div className="detalle-item azul">
                        <p className="label">Fecha de inscripción</p>
                        <p className="valor">
                          {new Date(item.fechaInscripcion).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="detalle-item verde">
                        <p className="label">Tipo de sangre</p>
                        <p className="valor flex">
                          <Droplets size={16} />{" "}
                          {item.formularioData?.bloodType || "No especificado"}
                        </p>
                      </div>

                      <div className="detalle-item amarillo">
                        <p className="label">Experiencia previa</p>
                        <p className="valor">
                          {item.formularioData?.hasPracticed || "No especifica"}
                        </p>
                      </div>

                      <div className="detalle-item rojo">
                        <p className="label">Condición médica</p>
                        <p className="valor">
                          {item.formularioData?.hasIllness || "No reportó"}
                        </p>
                      </div>
                    </div>

                    <div className="detalle-item proposito">
                      <p className="label">Propósito de inscripción</p>
                      <p className="valor">
                        {item.formularioData?.purpose ||
                          "Sin propósito indicado"}
                      </p>
                    </div>

                    <div className="horario-info">
                      <Clock size={16} />
                      El horario será asignado por el administrador
                      próximamente.
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
