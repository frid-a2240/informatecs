"use client";
import React, { useState, useEffect } from "react";
import { Download, Users, FileText, TrendingUp } from "lucide-react";
import * as XLSX from "xlsx";
import "./reportes.css";

const VistaReportesPage = () => {
  const [inscripciones, setInscripciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarInscripciones();
  }, []);

  const cargarInscripciones = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/inscripciones");
      const data = await response.json();
      console.log("📊 Inscripciones cargadas:", data);
      setInscripciones(data);
    } catch (error) {
      console.error("❌ Error al cargar inscripciones:", error);
    } finally {
      setLoading(false);
    }
  };

  // Agrupar estudiantes por propósito (sin duplicados)
  const agruparPorProposito = () => {
    const grupos = {
      creditos: new Map(),
      servicio_social: new Map(),
      por_gusto: new Map(),
    };

    inscripciones.forEach((inscripcion) => {
      const proposito = inscripcion.formularioData?.purpose;
      const aluctr = inscripcion.estudiante?.aluctr;

      if (!proposito || !aluctr) return;

      // Solo agregar si el grupo existe y el estudiante no está duplicado
      if (grupos[proposito] && !grupos[proposito].has(aluctr)) {
        grupos[proposito].set(aluctr, {
          aluctr: inscripcion.estudiante.aluctr,
          nombreCompleto: `${inscripcion.estudiante.alunom || ""} ${
            inscripcion.estudiante.aluapp || ""
          } ${inscripcion.estudiante.aluapm || ""}`.trim(),
          semestre: inscripcion.estudiante?.inscripciones?.calnpe || "N/A",
          sexo:
            inscripcion.estudiante?.alusex === 1
              ? "Masculino"
              : inscripcion.estudiante?.alusex === 2
              ? "Femenino"
              : "N/A",
          email: inscripcion.estudiante?.alumai || "N/A",
          actividad:
            inscripcion.actividad?.aconco ||
            inscripcion.actividad?.aticve ||
            "N/A",
          fechaInscripcion: new Date(
            inscripcion.fechaInscripcion
          ).toLocaleDateString("es-MX"),
        });
      }
    });

    return {
      creditos: Array.from(grupos.creditos.values()),
      servicio_social: Array.from(grupos.servicio_social.values()),
      por_gusto: Array.from(grupos.por_gusto.values()),
    };
  };

  const estudiantesPorProposito = agruparPorProposito();

  // Función para exportar a Excel
  const exportarAExcel = (datos, nombreArchivo) => {
    const worksheet = XLSX.utils.json_to_sheet(datos);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Estudiantes");

    // Ajustar ancho de columnas
    const columnWidths = [
      { wch: 12 }, // No. Control
      { wch: 35 }, // Nombre
      { wch: 10 }, // Semestre
      { wch: 12 }, // Sexo
      { wch: 30 }, // Email
      { wch: 30 }, // Actividad
      { wch: 15 }, // Fecha
    ];
    worksheet["!cols"] = columnWidths;

    XLSX.writeFile(workbook, `${nombreArchivo}_${Date.now()}.xlsx`);
  };

  const exportarTodos = () => {
    const todosDatos = [
      ...estudiantesPorProposito.creditos.map((e) => ({
        ...e,
        proposito: "Créditos",
      })),
      ...estudiantesPorProposito.servicio_social.map((e) => ({
        ...e,
        proposito: "Servicio Social",
      })),
      ...estudiantesPorProposito.por_gusto.map((e) => ({
        ...e,
        proposito: "Por Gusto",
      })),
    ];

    exportarAExcel(todosDatos, "Reporte_Completo_Inscripciones");
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p className="loading-text">Cargando reportes...</p>
      </div>
    );
  }

  return (
    <div className="reportes-container">
      <div className="reportes-content">
        {/* Header */}
        <div className="reportes-header">
          <div>
            <h1 className="reportes-title">
              📊 Reportes por Propósito de Inscripción
            </h1>
            <p className="reportes-subtitle">
              Estudiantes agrupados por razón de inscripción
            </p>
          </div>
          <button onClick={exportarTodos} className="btn-export-all">
            <Download size={20} />
            Exportar Todo
          </button>
        </div>

        {/* Cards de Resumen */}
        <div className="resumen-grid">
          <div className="resumen-card creditos">
            <div className="resumen-header">
              <div className="resumen-info">
                <h3>Créditos</h3>
                <div className="numero">
                  {estudiantesPorProposito.creditos.length}
                </div>
                <div className="label">estudiantes</div>
              </div>
              <FileText size={48} className="resumen-icon" />
            </div>
          </div>

          <div className="resumen-card servicio">
            <div className="resumen-header">
              <div className="resumen-info">
                <h3>Servicio Social</h3>
                <div className="numero">
                  {estudiantesPorProposito.servicio_social.length}
                </div>
                <div className="label">estudiantes</div>
              </div>
              <Users size={48} className="resumen-icon" />
            </div>
          </div>

          <div className="resumen-card gusto">
            <div className="resumen-header">
              <div className="resumen-info">
                <h3>Por Gusto</h3>
                <div className="numero">
                  {estudiantesPorProposito.por_gusto.length}
                </div>
                <div className="label">estudiantes</div>
              </div>
              <TrendingUp size={48} className="resumen-icon" />
            </div>
          </div>
        </div>

        {/* TABLA 1: Créditos */}
        <div className="tabla-wrapper">
          <div className="tabla-header creditos">
            <h2 className="tabla-titulo">
              <FileText size={24} />
              Estudiantes Inscritos por Créditos
            </h2>
            <button
              onClick={() =>
                exportarAExcel(
                  estudiantesPorProposito.creditos,
                  "Estudiantes_Creditos"
                )
              }
              className="btn-export creditos"
            >
              <Download size={18} />
              Exportar
            </button>
          </div>
          <div className="tabla-container">
            {estudiantesPorProposito.creditos.length === 0 ? (
              <p className="empty-state">
                No hay estudiantes inscritos por créditos
              </p>
            ) : (
              <table className="tabla">
                <thead>
                  <tr>
                    <th>No. Control</th>
                    <th>Nombre Completo</th>
                    <th>Semestre</th>
                    <th>Sexo</th>
                    <th>Email</th>
                    <th>Actividad</th>
                    <th>Fecha Inscripción</th>
                  </tr>
                </thead>
                <tbody>
                  {estudiantesPorProposito.creditos.map((estudiante, idx) => (
                    <tr key={idx}>
                      <td className="control">{estudiante.aluctr}</td>
                      <td className="nombre">{estudiante.nombreCompleto}</td>
                      <td>{estudiante.semestre}°</td>
                      <td>{estudiante.sexo}</td>
                      <td>{estudiante.email}</td>
                      <td>{estudiante.actividad}</td>
                      <td>{estudiante.fechaInscripcion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* TABLA 2: Servicio Social */}
        <div className="tabla-wrapper">
          <div className="tabla-header servicio">
            <h2 className="tabla-titulo">
              <Users size={24} />
              Estudiantes Inscritos por Servicio Social
            </h2>
            <button
              onClick={() =>
                exportarAExcel(
                  estudiantesPorProposito.servicio_social,
                  "Estudiantes_Servicio_Social"
                )
              }
              className="btn-export servicio"
            >
              <Download size={18} />
              Exportar
            </button>
          </div>
          <div className="tabla-container">
            {estudiantesPorProposito.servicio_social.length === 0 ? (
              <p className="empty-state">
                No hay estudiantes inscritos por servicio social
              </p>
            ) : (
              <table className="tabla">
                <thead>
                  <tr>
                    <th>No. Control</th>
                    <th>Nombre Completo</th>
                    <th>Semestre</th>
                    <th>Sexo</th>
                    <th>Email</th>
                    <th>Actividad</th>
                    <th>Fecha Inscripción</th>
                  </tr>
                </thead>
                <tbody>
                  {estudiantesPorProposito.servicio_social.map(
                    (estudiante, idx) => (
                      <tr key={idx}>
                        <td className="control">{estudiante.aluctr}</td>
                        <td className="nombre">{estudiante.nombreCompleto}</td>
                        <td>{estudiante.semestre}°</td>
                        <td>{estudiante.sexo}</td>
                        <td>{estudiante.email}</td>
                        <td>{estudiante.actividad}</td>
                        <td>{estudiante.fechaInscripcion}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* TABLA 3: Por Gusto */}
        <div className="tabla-wrapper">
          <div className="tabla-header gusto">
            <h2 className="tabla-titulo">
              <TrendingUp size={24} />
              Estudiantes Inscritos por Gusto
            </h2>
            <button
              onClick={() =>
                exportarAExcel(
                  estudiantesPorProposito.por_gusto,
                  "Estudiantes_Por_Gusto"
                )
              }
              className="btn-export gusto"
            >
              <Download size={18} />
              Exportar
            </button>
          </div>
          <div className="tabla-container">
            {estudiantesPorProposito.por_gusto.length === 0 ? (
              <p className="empty-state">
                No hay estudiantes inscritos por gusto
              </p>
            ) : (
              <table className="tabla">
                <thead>
                  <tr>
                    <th>No. Control</th>
                    <th>Nombre Completo</th>
                    <th>Semestre</th>
                    <th>Sexo</th>
                    <th>Email</th>
                    <th>Actividad</th>
                    <th>Fecha Inscripción</th>
                  </tr>
                </thead>
                <tbody>
                  {estudiantesPorProposito.por_gusto.map(
                    (estudiante, idx) => (
                      <tr key={idx}>
                        <td className="control">{estudiante.aluctr}</td>
                        <td className="nombre">{estudiante.nombreCompleto}</td>
                        <td>{estudiante.semestre}°</td>
                        <td>{estudiante.sexo}</td>
                        <td>{estudiante.email}</td>
                        <td>{estudiante.actividad}</td>
                        <td>{estudiante.fechaInscripcion}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VistaReportesPage;
