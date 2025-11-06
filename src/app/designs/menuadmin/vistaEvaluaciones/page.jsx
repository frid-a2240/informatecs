"use client";

import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { AiOutlineCloseCircle, AiOutlineSave } from "react-icons/ai"; // Para el cerrar y guardar de Ant Design
import "./evaluacionespanel.css";

const EvaluacionesPanel = () => {
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
  const [estudiantesSeleccionados, setEstudiantesSeleccionados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [evaluaciones, setEvaluaciones] = useState({});

  useEffect(() => {
    cargarActividades();
  }, []);

  const cargarActividades = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/studentsactivos-inscritos");
      if (!response.ok) throw new Error("Error al cargar estudiantes");

      const estudiantes = await response.json();
      const actividadesMap = new Map();

      estudiantes.forEach((estudiante) => {
        estudiante.inscripciones?.forEach((insc) => {
          const id = insc.actividad?.id;
          const nombre = insc.actividad?.actnom || insc.actividad?.nombre;
          if (id && nombre) {
            if (!actividadesMap.has(id)) {
              actividadesMap.set(id, { id, nombre, estudiantes: [] });
            }
            const act = actividadesMap.get(id);
            if (!act.estudiantes.some((e) => e.aluctr === estudiante.aluctr)) {
              act.estudiantes.push(estudiante);
            }
          }
        });
      });

      setActividades(Array.from(actividadesMap.values()));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const actividadesFiltradas = actividades.filter((act) =>
    act.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const toggleSeleccionEstudiante = (aluctr) => {
    setEstudiantesSeleccionados((prev) =>
      prev.includes(aluctr)
        ? prev.filter((id) => id !== aluctr)
        : [...prev, aluctr]
    );
  };

  const seleccionarTodos = () => {
    if (
      estudiantesSeleccionados.length ===
      actividadSeleccionada.estudiantes.length
    ) {
      setEstudiantesSeleccionados([]);
    } else {
      setEstudiantesSeleccionados(
        actividadSeleccionada.estudiantes.map((e) => e.aluctr)
      );
    }
  };

  const generarListaPDF = () => {
    if (!actividadSeleccionada) return;

    const estudiantesParaImprimir =
      estudiantesSeleccionados.length > 0
        ? actividadSeleccionada.estudiantes.filter((e) =>
            estudiantesSeleccionados.includes(e.aluctr)
          )
        : actividadSeleccionada.estudiantes;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginLeft = 14;

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("INSTITUTO TECNOLÓGICO DE ENSENADA", pageWidth / 2, 20, {
      align: "center",
    });

    doc.setFontSize(14);
    doc.text(
      "Lista de Asistencia - Actividades Complementarias",
      pageWidth / 2,
      30,
      { align: "center" }
    );

    doc.setFontSize(12);
    doc.setTextColor(0, 85, 170);
    doc.text(`Actividad: ${actividadSeleccionada.nombre}`, pageWidth / 2, 38, {
      align: "center",
    });

    doc.setFontSize(10);
    doc.setTextColor(0);
    const fecha = new Date().toLocaleDateString("es-MX");
    doc.text(`Fecha: ${fecha}`, marginLeft, 46);

    const tableData = estudiantesParaImprimir.map((e, i) => [
      i + 1,
      e.aluctr,
      `${e.alunom} ${e.aluapp} ${e.aluapm}`,
      e.alumai,
      "",
    ]);

    autoTable(doc, {
      startY: 58,
      head: [["#", "Control", "Nombre", "Email", "Firma"]],
      body: tableData,
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [0, 85, 170], textColor: 255 },
    });

    doc.save(`Lista_${actividadSeleccionada.nombre.replace(/\s+/g, "_")}.pdf`);
  };

  const abrirModalEvaluacion = () => {
    if (estudiantesSeleccionados.length === 0) {
      alert("Selecciona al menos un estudiante para evaluar.");
      return;
    }
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
  };

  const guardarEvaluaciones = () => {
    console.log("Evaluaciones guardadas:", evaluaciones);
    alert("✅ Evaluaciones guardadas correctamente.");
    setMostrarModal(false);
  };

  const manejarCambio = (aluctr, campo, valor) => {
    setEvaluaciones((prev) => ({
      ...prev,
      [aluctr]: { ...prev[aluctr], [campo]: valor },
    }));
  };

  if (loading) return <p className="loading">Cargando actividades...</p>;
  if (error) return <p className="error">{error}</p>;

  // 🌟 Vista principal (actividades)
  if (!actividadSeleccionada) {
    return (
      <div className="evaluaciones-container">
        <div className="evaluaciones-header">
          <h2 className="titulo-evaluaciones ">Centro de Evaluaciones</h2>
          <p className="evaluaciones-subtitulo">
            Selecciona una actividad para ver o evaluar estudiantes.
          </p>
          <input
            type="text"
            className="evaluaciones-busqueda"
            placeholder="🔍 Buscar actividad..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="actividades-grid">
          {actividadesFiltradas.map((act) => (
            <div
              key={act.id}
              className="actividad-card"
              onClick={() => setActividadSeleccionada(act)}
            >
              <h3>{act.nombre}</h3>
              <p>👥 {act.estudiantes.length} estudiantes</p>
              <button className="btn-ver">Ver lista →</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 👩‍🎓 Vista estudiantes
  return (
    <div className="evaluaciones-container">
      <div className="actividad-header">
        <button
          className="btn-back"
          onClick={() => {
            setActividadSeleccionada(null);
            setEstudiantesSeleccionados([]);
          }}
        >
          ← Volver
        </button>
        <h2>{actividadSeleccionada.nombre}</h2>
        <p>{actividadSeleccionada.estudiantes.length} estudiantes inscritos</p>
      </div>

      <div className="acciones">
        <button className="btn btn-gray" onClick={seleccionarTodos}>
          {estudiantesSeleccionados.length ===
          actividadSeleccionada.estudiantes.length
            ? "☑️ Deseleccionar todos"
            : "☐ Seleccionar todos"}
        </button>

        <button className="btn btn-green" onClick={abrirModalEvaluacion}>
          Evaluar
        </button>

        <button className="btn btn-blue" onClick={generarListaPDF}>
          Generar PDF
        </button>
      </div>

      <div className="tabla-container">
        <table className="estudiantes-table">
          <thead>
            <tr>
              <th>☐</th>
              <th>Control</th>
              <th>Nombre</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {actividadSeleccionada.estudiantes.map((est) => (
              <tr
                key={est.aluctr}
                className={
                  estudiantesSeleccionados.includes(est.aluctr)
                    ? "fila-seleccionada"
                    : ""
                }
              >
                <td>
                  <input
                    type="checkbox"
                    checked={estudiantesSeleccionados.includes(est.aluctr)}
                    onChange={() => toggleSeleccionEstudiante(est.aluctr)}
                  />
                </td>
                <td>{est.aluctr}</td>
                <td>{`${est.alunom} ${est.aluapp} ${est.aluapm}`}</td>
                <td>{est.alumai}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🟢 Modal de Evaluación */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>📝 Evaluar estudiantes</h3>
            <p>
              Actividad: <strong>{actividadSeleccionada.nombre}</strong>
            </p>

            <div className="modal-lista">
              {estudiantesSeleccionados.map((aluctr) => {
                const est = actividadSeleccionada.estudiantes.find(
                  (e) => e.aluctr === aluctr
                );
                const evaluacion = evaluaciones[aluctr] || {
                  asistencia: "",
                  participacion: "",
                  desempeno: "",
                  calificacion: "",
                  observaciones: "",
                };

                const handleInputChange = (e) => {
                  const { name, value } = e.target;
                  setEvaluaciones((prev) => ({
                    ...prev,
                    [aluctr]: { ...prev[aluctr], [name]: value },
                  }));
                };

                return (
                  <div
                    key={aluctr}
                    className="evaluacion-item"
                    style={{ marginBottom: "2rem" }}
                  >
                    <h4 style={{ color: "#004aad", marginBottom: "1rem" }}>
                      {`${est.alunom} ${est.aluapp} ${est.aluapm}`}
                    </h4>

                    {/* Asistencia */}
                    <div style={{ marginBottom: "1rem" }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "0.5rem",
                          fontWeight: "600",
                        }}
                      >
                        Asistencia
                      </label>
                      <select
                        name="asistencia"
                        value={evaluacion.asistencia}
                        onChange={handleInputChange}
                        required
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          border: "1px solid #ddd",
                          borderRadius: "8px",
                          fontSize: "1rem",
                        }}
                      >
                        <option value="">Seleccionar...</option>
                        <option value="excelente">Excelente (90-100%)</option>
                        <option value="buena">Buena (70-89%)</option>
                        <option value="regular">Regular (50-69%)</option>
                        <option value="deficiente">Deficiente (0-49%)</option>
                      </select>
                    </div>

                    {/* Participación */}
                    <div style={{ marginBottom: "1rem" }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "0.5rem",
                          fontWeight: "600",
                        }}
                      >
                        Participación
                      </label>
                      <select
                        name="participacion"
                        value={evaluacion.participacion}
                        onChange={handleInputChange}
                        required
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          border: "1px solid #ddd",
                          borderRadius: "8px",
                          fontSize: "1rem",
                        }}
                      >
                        <option value="">Seleccionar...</option>
                        <option value="excelente">Excelente</option>
                        <option value="buena">Buena</option>
                        <option value="regular">Regular</option>
                        <option value="deficiente">Deficiente</option>
                      </select>
                    </div>

                    {/* Desempeño */}
                    <div style={{ marginBottom: "1rem" }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "0.5rem",
                          fontWeight: "600",
                        }}
                      >
                        Desempeño
                      </label>
                      <select
                        name="desempeno"
                        value={evaluacion.desempeno}
                        onChange={handleInputChange}
                        required
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          border: "1px solid #ddd",
                          borderRadius: "8px",
                          fontSize: "1rem",
                        }}
                      >
                        <option value="">Seleccionar...</option>
                        <option value="excelente">Excelente</option>
                        <option value="bueno">Bueno</option>
                        <option value="regular">Regular</option>
                        <option value="deficiente">Deficiente</option>
                      </select>
                    </div>

                    {/* Calificación Final */}
                    <div style={{ marginBottom: "1rem" }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "0.5rem",
                          fontWeight: "600",
                        }}
                      >
                        Calificación Final
                      </label>
                      <input
                        type="number"
                        name="calificacion"
                        value={evaluacion.calificacion}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                        required
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          border: "1px solid #ddd",
                          borderRadius: "8px",
                          fontSize: "1rem",
                        }}
                        placeholder="0-100"
                      />
                    </div>

                    {/* Observaciones */}
                    <div style={{ marginBottom: "1rem" }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "0.5rem",
                          fontWeight: "600",
                        }}
                      >
                        Observaciones
                      </label>
                      <textarea
                        name="observaciones"
                        value={evaluacion.observaciones}
                        onChange={handleInputChange}
                        rows="3"
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          border: "1px solid #ddd",
                          borderRadius: "8px",
                          fontSize: "1rem",
                          resize: "vertical",
                        }}
                        placeholder="Comentarios adicionales..."
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="modal-buttons">
              <button className="btn btn-gray" onClick={cerrarModal}>
                <AiOutlineCloseCircle style={{ marginRight: "8px" }} />{" "}
                {/* Icono de cerrar/cancelar */}
                Cancelar
              </button>
              <button className="btn btn-green" onClick={guardarEvaluaciones}>
                <AiOutlineSave style={{ marginRight: "8px" }} />{" "}
                {/* Icono de guardar */}
                Guardar Evaluación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluacionesPanel;
