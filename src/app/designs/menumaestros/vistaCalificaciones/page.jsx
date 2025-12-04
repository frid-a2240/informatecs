"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import NavbarMaestro from "@/app/components/navbarmaestro";
import {
  FiBook,
  FiUsers,
  FiArrowLeft,
  FiSave,
  FiDownload,
  FiEdit,
  FiCheck,
  FiX,
} from "react-icons/fi";
import "./calificaciones.css";

export default function VistaCalificacionesPage() {
  const router = useRouter();
  const [maestroData, setMaestroData] = useState(null);
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState(null);
  const [calificaciones, setCalificaciones] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem("maestroData");

    if (!savedData) {
      router.push("/designs/vistaLogin");
      return;
    }

    const parsed = JSON.parse(savedData);
    setMaestroData(parsed);
    cargarMaterias(parsed.percve);
  }, [router]);

  // ✅ Cargar materias del maestro
  const cargarMaterias = async (percve) => {
    try {
      setLoading(true);
      console.log("🔍 Cargando materias para percve:", percve);

      const response = await fetch(`/api/maestros-materias?percve=${percve}`);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Error de la API:", errorData);
        setMaterias([]);
        return;
      }

      const data = await response.json();
      console.log("📚 Materias del maestro:", data);
      setMaterias(data || []);
    } catch (error) {
      console.error("❌ Error al cargar materias:", error);
      setMaterias([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Seleccionar materia y cargar calificaciones desde BD
  const seleccionarMateria = async (materia) => {
    setMateriaSeleccionada(materia);

    // Cargar calificaciones desde la base de datos
    try {
      console.log("📥 Cargando calificaciones de la materia:", materia.id);
      
      const response = await fetch(
        `/api/calificaciones?actividadId=${materia.id}&maestroId=${maestroData.percve}`
      );

      if (!response.ok) {
        throw new Error("Error al cargar calificaciones");
      }

      const inscripciones = await response.json();
      console.log("✅ Inscripciones cargadas:", inscripciones);

      // Inicializar calificaciones con datos de la BD
      const calificacionesIniciales = {};
      inscripciones.forEach((inscripcion) => {
        calificacionesIniciales[inscripcion.estudiante.aluctr] = {
          calificacion: inscripcion.calificacion || "",
          observaciones: inscripcion.formularioData?.observaciones || "",
          liberado: inscripcion.liberado || false,
        };
      });

      setCalificaciones(calificacionesIniciales);
      console.log("📊 Calificaciones inicializadas:", calificacionesIniciales);
    } catch (error) {
      console.error("❌ Error al cargar calificaciones:", error);

      // Si falla, inicializar con datos del objeto materia
      const calificacionesVacias = {};
      materia.inscripact?.forEach((inscripcion) => {
        calificacionesVacias[inscripcion.estudiante.aluctr] = {
          calificacion: inscripcion.calificacion || "",
          observaciones: inscripcion.formularioData?.observaciones || "",
          liberado: inscripcion.liberado || false,
        };
      });
      setCalificaciones(calificacionesVacias);
    }
  };

  // ✅ Manejar cambio de calificación
  const handleCalificacionChange = (aluctr, valor) => {
    setCalificaciones((prev) => ({
      ...prev,
      [aluctr]: {
        ...prev[aluctr],
        calificacion: valor,
      },
    }));
  };

  // ✅ Manejar cambio de observación
  const handleObservacionChange = (aluctr, valor) => {
    setCalificaciones((prev) => ({
      ...prev,
      [aluctr]: {
        ...prev[aluctr],
        observaciones: valor,
      },
    }));
  };

  // ✅ Guardar calificaciones en la base de datos
  const guardarCalificaciones = async () => {
    try {
      setGuardando(true);

      console.log("💾 Guardando calificaciones...");
      console.log("Datos a guardar:", calificaciones);

      const response = await fetch("/api/calificaciones", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actividadId: materiaSeleccionada.id,
          maestroId: maestroData.percve,
          calificaciones: calificaciones,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al guardar");
      }

      const resultado = await response.json();
      console.log("✅ Resultado:", resultado);

      alert(`✅ Se guardaron ${resultado.guardadas} calificaciones correctamente`);
      setModoEdicion(false);

      // Recargar las materias para actualizar los contadores
      await cargarMaterias(maestroData.percve);

      // Recargar las calificaciones actualizadas
      await seleccionarMateria(materiaSeleccionada);
    } catch (error) {
      console.error("❌ Error al guardar calificaciones:", error);
      alert(`❌ Error al guardar calificaciones: ${error.message}`);
    } finally {
      setGuardando(false);
    }
  };

  // ✅ Generar Acta en PDF
  const generarActaPDF = () => {
    if (!materiaSeleccionada) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginLeft = 14;

    // Encabezado
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("INSTITUTO TECNOLÓGICO DE ENSENADA", pageWidth / 2, 20, {
      align: "center",
    });

    doc.setFontSize(14);
    doc.text(
      "Acta de Calificaciones - Actividades Complementarias",
      pageWidth / 2,
      30,
      {
        align: "center",
      }
    );

    // Info de la materia
    doc.setFontSize(12);
    doc.setTextColor(0, 85, 170);
    doc.text(
      `Actividad: ${materiaSeleccionada.aconco || materiaSeleccionada.aticve}`,
      pageWidth / 2,
      38,
      { align: "center" }
    );

    doc.setFontSize(10);
    doc.setTextColor(0);
    const fecha = new Date().toLocaleDateString("es-MX");
    doc.text(`Fecha: ${fecha}`, marginLeft, 46);
    doc.text(`Maestro: ${maestroData.nombreCompleto}`, marginLeft, 52);
    doc.text(`Código: ${materiaSeleccionada.aticve}`, marginLeft, 58);

    // Preparar datos de la tabla
    const tableData = materiaSeleccionada.inscripact.map((inscripcion, i) => {
      const est = inscripcion.estudiante;
      const nombreCompleto = `${est.alunom || ""} ${est.aluapp || ""} ${
        est.aluapm || ""
      }`.trim();
      const calif = calificaciones[est.aluctr]?.calificacion || "N/A";
      const obs = calificaciones[est.aluctr]?.observaciones || "";

      return [
        i + 1,
        est.aluctr,
        nombreCompleto,
        est.inscripciones?.calnpe || "N/A",
        calif,
        obs,
      ];
    });

    // Generar tabla
    autoTable(doc, {
      startY: 65,
      head: [["#", "Control", "Nombre", "Sem.", "Calif.", "Observaciones"]],
      body: tableData,
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [0, 85, 170], textColor: 255 },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 25 },
        2: { cellWidth: 60 },
        3: { cellWidth: 15 },
        4: { cellWidth: 20 },
        5: { cellWidth: 50 },
      },
    });

    // Firma
    const finalY = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(10);
    doc.text("_______________________________", pageWidth / 2, finalY, {
      align: "center",
    });
    doc.text(maestroData.nombreCompleto, pageWidth / 2, finalY + 6, {
      align: "center",
    });
    doc.text("Firma del Maestro", pageWidth / 2, finalY + 12, {
      align: "center",
    });

    doc.save(`Acta_${materiaSeleccionada.aticve}_${Date.now()}.pdf`);
  };

  if (loading) {
    return (
      <div className="calificaciones-loading-screen">
        <div className="loader-circle"></div>
        <p className="loader-text">Cargando materias...</p>
      </div>
    );
  }

  // Vista principal (lista de materias)
  if (!materiaSeleccionada) {
    return (
      <>
        <NavbarMaestro />
        <div className="calificaciones-main-wrapper">
          <div className="calificaciones-header">
            <div className="header-content">
              <div>
                <h1 className="header-title">
                  <FiBook className="inline-icon" />
                  Calificaciones
                </h1>
                <p className="header-subtitle">
                  Selecciona una materia para evaluar estudiantes
                </p>
              </div>
              <div className="header-stats">
                <div className="stat-badge stat-purple">
                  <FiBook />
                  <span>{materias.length} Materias</span>
                </div>
                <div className="stat-badge stat-blue">
                  <FiUsers />
                  <span>
                    {materias.reduce(
                      (acc, m) => acc + (m.inscripact?.length || 0),
                      0
                    )}{" "}
                    Estudiantes
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="calificaciones-content">
            {materias.length === 0 ? (
              <div className="materias-empty">
                <FiBook size={64} className="empty-icon" />
                <h2>No tienes materias asignadas</h2>
                <p>Contacta con el administrador para que te asigne materias.</p>
              </div>
            ) : (
              <div className="materias-grid">
                {materias.map((materia) => {
                  const totalEstudiantes = materia.inscripact?.length || 0;
                  const estudiantesEvaluados =
                    materia.inscripact?.filter(
                      (ins) => ins.calificacion !== null && ins.calificacion !== ""
                    ).length || 0;

                  return (
                    <div
                      key={materia.id}
                      className="materia-card-calif"
                      onClick={() => seleccionarMateria(materia)}
                    >
                      <div className="materia-card-header-calif">
                        <h3>{materia.aconco || materia.aticve}</h3>
                        <span className="materia-codigo">
                          Código: {materia.aticve}
                        </span>
                      </div>

                      <div className="materia-stats">
                        <div className="stat-item">
                          <FiUsers size={20} />
                          <div>
                            <span className="stat-number">
                              {totalEstudiantes}
                            </span>
                            <span className="stat-label">Estudiantes</span>
                          </div>
                        </div>
                        <div className="stat-item">
                          <FiCheck size={20} />
                          <div>
                            <span className="stat-number">
                              {estudiantesEvaluados}
                            </span>
                            <span className="stat-label">Evaluados</span>
                          </div>
                        </div>
                      </div>

                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${
                              totalEstudiantes > 0
                                ? (estudiantesEvaluados / totalEstudiantes) *
                                  100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>

                      <button className="btn-evaluar">
                        Evaluar estudiantes →
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  // Vista de calificaciones de una materia específica
  return (
    <>
      <NavbarMaestro />
      <div className="calificaciones-main-wrapper">
        <div className="calificaciones-header-detalle">
          <button
            className="btn-back"
            onClick={() => {
              setMateriaSeleccionada(null);
              setModoEdicion(false);
            }}
          >
            <FiArrowLeft size={20} />
            Volver
          </button>

          <div className="header-info">
            <h1>{materiaSeleccionada.aconco || materiaSeleccionada.aticve}</h1>
            <p>Código: {materiaSeleccionada.aticve}</p>
          </div>

          <div className="header-actions">
            {!modoEdicion ? (
              <>
                <button
                  className="btn btn-primary"
                  onClick={() => setModoEdicion(true)}
                >
                  <FiEdit size={18} />
                  Editar Calificaciones
                </button>
                <button className="btn btn-secondary" onClick={generarActaPDF}>
                  <FiDownload size={18} />
                  Generar Acta PDF
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-success"
                  onClick={guardarCalificaciones}
                  disabled={guardando}
                >
                  <FiSave size={18} />
                  {guardando ? "Guardando..." : "Guardar"}
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => setModoEdicion(false)}
                >
                  <FiX size={18} />
                  Cancelar
                </button>
              </>
            )}
          </div>
        </div>

        <div className="calificaciones-table-container">
          <table className="calificaciones-table">
            <thead>
              <tr>
                <th>#</th>
                <th>No. Control</th>
                <th>Nombre Completo</th>
                <th>Semestre</th>
                <th>Carrera</th>
                <th>Calificación</th>
                <th>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {materiaSeleccionada.inscripact?.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">
                    No hay estudiantes inscritos
                  </td>
                </tr>
              ) : (
                materiaSeleccionada.inscripact.map((inscripcion, index) => {
                  const est = inscripcion.estudiante;
                  const nombreCompleto = `${est.alunom || ""} ${
                    est.aluapp || ""
                  } ${est.aluapm || ""}`.trim();
                  const calif =
                    calificaciones[est.aluctr]?.calificacion || "";
                  const obs = calificaciones[est.aluctr]?.observaciones || "";

                  return (
                    <tr key={est.aluctr}>
                      <td>{index + 1}</td>
                      <td className="font-mono">{est.aluctr}</td>
                      <td className="font-semibold">{nombreCompleto}</td>
                      <td>{est.inscripciones?.calnpe || "N/A"}°</td>
                      <td className="carrera-cell">
                        {est.inscripciones?.carrera?.carnco || "N/A"}
                      </td>
                      <td>
                        {modoEdicion ? (
                          <input
                            type="number"
                            className="input-calificacion"
                            value={calif}
                            onChange={(e) =>
                              handleCalificacionChange(
                                est.aluctr,
                                e.target.value
                              )
                            }
                            min="0"
                            max="100"
                            placeholder="0-100"
                          />
                        ) : (
                          <span
                            className={`calificacion-badge ${
                              calif >= 70
                                ? "aprobado"
                                : calif > 0
                                ? "reprobado"
                                : "sin-calif"
                            }`}
                          >
                            {calif || "N/A"}
                          </span>
                        )}
                      </td>
                      <td>
                        {modoEdicion ? (
                          <input
                            type="text"
                            className="input-observacion"
                            value={obs}
                            onChange={(e) =>
                              handleObservacionChange(
                                est.aluctr,
                                e.target.value
                              )
                            }
                            placeholder="Observaciones..."
                          />
                        ) : (
                          <span className="observacion-text">{obs || "-"}</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="calificaciones-footer">
          <p>
            Total: {materiaSeleccionada.inscripact?.length || 0} estudiantes
          </p>
          <p>
            Evaluados:{" "}
            {materiaSeleccionada.inscripact?.filter(
              (ins) => ins.calificacion !== null && ins.calificacion !== ""
            ).length || 0}
          </p>
        </div>
      </div>
    </>
  );
}
