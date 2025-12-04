"use client";

import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Droplets,
  Clock,
  Calendar,
  Award,
  AlertCircle,
  Activity,
  FileText,
  MapPin,
  Pill,
  Stethoscope,
  Heart,
  Ban,
} from "lucide-react";
import { FaRunning } from "react-icons/fa";
import "./actividades.css";
import BloodTypeValidator from "@/app/components/blood";


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
        .finally(() => setLoading(false));
    }
  }, []);

  const toggleExpand = (index) =>
    setExpanded(expanded === index ? null : index);

  if (!studentData) {
    return (
      <div className="mis-actividades-page">
        <div className="act-empty-state">
          <AlertCircle size={64} />
          <h2>Acceso Restringido</h2>
          <p>Inicia sesión para ver tus actividades.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mis-actividades-page">
        <div className="act-loading-state">
          <div className="act-spinner"></div>
          <p>Cargando tus inscripciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mis-actividades-page">
      <div className="act-header">
        <div className="act-header-content">
          <h1>
            <FaRunning size={40} color="white" />
            Mis Actividades Inscritas
          </h1>
          <p className="act-header-subtitle">
            Total de actividades: <span>{inscripciones.length}</span>
          </p>
        </div>
      </div>
{/* Validador de tipo de sangre */}
<BloodTypeValidator numeroControl={studentData.numeroControl} />
      <main className="act-main">
        {inscripciones.length === 0 ? (
          <div className="act-empty-state">
            <FileText size={64} />
            <h2>Sin actividades</h2>
            <p>No estás inscrito en ninguna actividad aún.</p>
            <p className="act-empty-hint">
              Explora las actividades disponibles y regístrate en las que te
              interesen.
            </p>
          </div>
        ) : (
          <div className="act-lista">
            {inscripciones.map((item, index) => {
              const act = item.actividad;
              const horario = act?.horario;
              const formData = item.formularioData || {};

              return (
                <div
                  className={`act-card ${
                    expanded === index ? "act-expanded" : ""
                  }`}
                  key={index}
                >
                  <div
                    className="act-card-header"
                    onClick={() => toggleExpand(index)}
                  >
                    <div className="act-header-info">
                      <h3>{act?.aconco || "Actividad sin nombre"}</h3>
                      <div className="act-badges">
                        <span className="act-badge act-badge-code">
                          {act?.aticve || "N/A"}
                        </span>
                        <span className="act-badge act-badge-credits">
                          <Award size={14} />
                          {act?.acocre} créditos
                        </span>
                        <span className="act-badge act-badge-hours">
                          <Clock size={14} />
                          {act?.acohrs} hrs
                        </span>
                      </div>
                    </div>
                    <button className="act-btn-toggle" aria-label="Ver más">
                      {expanded === index ? (
                        <ChevronUp size={24} />
                      ) : (
                        <ChevronDown size={24} />
                      )}
                    </button>
                  </div>

                  {expanded === index && (
                    <div className="act-card-body">
                      {/* Información General */}
                      <div className="act-info-section">
                        <div className="act-info-card act-info-primary">
                          <div className="act-info-icon">
                            <Calendar size={20} />
                          </div>
                          <div className="act-info-content">
                            <p className="act-info-label">
                              Fecha de inscripción
                            </p>
                            <p className="act-info-value">
                              {new Date(
                                item.fechaInscripcion
                              ).toLocaleDateString("es-MX", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="act-info-card act-info-blood">
                          <div className="act-info-icon">
                            <Droplets size={20} />
                          </div>
                          <div className="act-info-content">
                            <p className="act-info-label">Tipo de sangre</p>
                            <p className="act-info-value">
                              {formData.bloodType || "No especificado"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Información Médica */}
                      <div className="act-medical-section">
                        <h4 className="medical-title">
                          <Stethoscope size={20} />
                          Información Médica
                        </h4>

                        <div className="medical-grid">
                          {/* Condición Médica */}
                          <div className="medical-item">
                            <div className="medical-item-header">
                              <Heart size={18} className="medical-icon" />
                              <span className="medical-label">
                                Condición médica
                              </span>
                            </div>
                            <p className="medical-value">
                              {formData.hasCondition === "si" ? (
                                <>
                                  <span className="badge-warning">Sí</span>
                                  {formData.conditionDetails && (
                                    <span className="medical-details">
                                      {formData.conditionDetails}
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="badge-success">No</span>
                              )}
                            </p>
                          </div>

                          {/* Medicamentos */}
                          <div className="medical-item">
                            <div className="medical-item-header">
                              <Pill size={18} className="medical-icon" />
                              <span className="medical-label">
                                Medicamentos regulares
                              </span>
                            </div>
                            <p className="medical-value">
                              {formData.takesMedication === "si" ? (
                                <>
                                  <span className="badge-warning">Sí</span>
                                  {formData.medicationDetails && (
                                    <span className="medical-details">
                                      {formData.medicationDetails}
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="badge-success">No</span>
                              )}
                            </p>
                          </div>

                          {/* Alergias */}
                          <div className="medical-item">
                            <div className="medical-item-header">
                              <AlertCircle size={18} className="medical-icon" />
                              <span className="medical-label">Alergias</span>
                            </div>
                            <p className="medical-value">
                              {formData.hasAllergy === "si" ? (
                                <>
                                  <span className="badge-danger">Sí</span>
                                  {formData.allergyDetails && (
                                    <span className="medical-details">
                                      {formData.allergyDetails}
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="badge-success">No</span>
                              )}
                            </p>
                          </div>

                          {/* Lesiones */}
                          <div className="medical-item">
                            <div className="medical-item-header">
                              <Activity size={18} className="medical-icon" />
                              <span className="medical-label">
                                Lesión reciente
                              </span>
                            </div>
                            <p className="medical-value">
                              {formData.hasInjury === "si" ? (
                                <>
                                  <span className="badge-warning">Sí</span>
                                  {formData.injuryDetails && (
                                    <span className="medical-details">
                                      {formData.injuryDetails}
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="badge-success">No</span>
                              )}
                            </p>
                          </div>

                          {/* Restricciones */}
                          <div className="medical-item">
                            <div className="medical-item-header">
                              <Ban size={18} className="medical-icon" />
                              <span className="medical-label">
                                Restricción médica
                              </span>
                            </div>
                            <p className="medical-value">
                              {formData.hasRestriction === "si" ? (
                                <>
                                  <span className="badge-danger">Sí</span>
                                  {formData.restrictionDetails && (
                                    <span className="medical-details">
                                      {formData.restrictionDetails}
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="badge-success">No</span>
                              )}
                            </p>
                          </div>
                          {/* Propósito de inscripción */}
<div className="medical-item medical-item-full">
  <div className="medical-item-header">
    <FileText size={18} className="medical-icon" />
    <span className="medical-label">Propósito de inscripción</span>
  </div>

  <p className="medical-value">
    {formData.purpose ? (
      <>
        <span className="badge-info">{formData.purpose}</span>
      </>
    ) : (
      <span className="badge-success">No especificado</span>
    )}
  </p>
</div>


                        </div>
                      </div>

                      {/* Horario */}
                      <div className="act-horario-section">
                        <h4>
                          <Clock size={18} /> Horario
                        </h4>

                        {horario &&
                        Array.isArray(horario.dias) &&
                        horario.dias.length > 0 ? (
                          <table className="horario-table">
                            <thead>
                              <tr>
                                <th>
                                  <Calendar size={16} /> Día
                                </th>
                                <th>
                                  <Clock size={16} /> Hora Inicio
                                </th>
                                <th>
                                  <Clock size={16} /> Hora Fin
                                </th>
                                <th>
                                  <MapPin size={16} /> Salón
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {horario.dias.map((dia, idx) => (
                                <tr key={idx}>
                                  <td>{dia}</td>
                                  <td>{horario.horaInicio}</td>
                                  <td>{horario.horaFin}</td>
                                  <td>{horario.salon || "Por asignar"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p className="act-horario-pendiente">
                            El horario será asignado por el administrador
                            próximamente.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}