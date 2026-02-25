"use client";

import React, { useState, useMemo } from "react";
import { Search, Printer } from "lucide-react";
import "../css/seccionparticipantes.css";

const SeccionParticipantes = ({ inscripciones }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [filtroGenero, setFiltroGenero] = useState("Todos");

  const { filtrados, estadisticas } = useMemo(() => {
    const mapaUnico = new Map();
    const DOMINIO_INST = "@ite.edu.mx";
    if (!inscripciones) return { filtrados: [], estadisticas: {} };

    inscripciones.forEach((i) => {
      const actividadActual = i.Nombre_Actividad || "Sin Actividad";
      const equipoActual = i.Nombre_Equipo || "Individual";

      const procesarPersona = (nombre, correo, sexo, esCapitan) => {
        if (
          !nombre ||
          nombre.trim() === "" ||
          nombre === "N/A" ||
          nombre === "NOMBRE"
        )
          return;
        const nombreLimpio = nombre.replace(/\((M|F)\)/gi, "").trim();
        const gen =
          sexo === "M" || nombre.includes("(M)")
            ? "M"
            : sexo === "F" || nombre.includes("(F)")
              ? "F"
              : "N/R";
        const esInst = (correo || "").toLowerCase().endsWith(DOMINIO_INST);
        const llave = `${nombreLimpio.toLowerCase()}-${actividadActual.toLowerCase()}`;

        if (!mapaUnico.has(llave)) {
          mapaUnico.set(llave, {
            nombre: nombreLimpio,
            actividad: actividadActual,
            equipo: equipoActual,
            tipo: esInst ? "ITE" : "EXT",
            esExterno: !esInst,
            genero: gen,
            rol: esCapitan
              ? equipoActual !== "Individual"
                ? "Capitán"
                : "Individual"
              : "Integrante",
          });
        }
      };

      procesarPersona(i.Nombre, i.Email, i.Sexo, true);
      if (i.Nombres_Integrantes && i.Nombres_Integrantes !== "N/A") {
        i.Nombres_Integrantes.split(/[,/\n]/).forEach((nom) =>
          procesarPersona(nom, "", "", false),
        );
      }
    });

    const listado = Array.from(mapaUnico.values()).filter((p) => {
      const busqueda = searchTerm.toLowerCase();
      const coincide =
        p.nombre.toLowerCase().includes(busqueda) ||
        p.equipo.toLowerCase().includes(busqueda) ||
        p.actividad.toLowerCase().includes(busqueda);
      const cumpleTipo =
        filtroTipo === "Todos" ||
        (filtroTipo === "Interno" ? !p.esExterno : p.esExterno);
      const cumpleGen = filtroGenero === "Todos" || p.genero === filtroGenero;
      return coincide && cumpleTipo && cumpleGen;
    });

    return {
      filtrados: listado,
      estadisticas: {
        total: listado.length,
        h: listado.filter((p) => p.genero === "M").length,
        m: listado.filter((p) => p.genero === "F").length,
        ite: listado.filter((p) => !p.esExterno).length,
        ext: listado.filter((p) => p.esExterno).length,
      },
    };
  }, [inscripciones, searchTerm, filtroTipo, filtroGenero]);

  return (
    <div className="sp-wrapper">
      {/* ── Encabezado PDF ── */}
      <div className="sp-print-header">
        <h1 className="sp-print-header__title">
          Cédula de Registro y Control de Asistencia
        </h1>
        <p className="sp-print-header__sub">
          Instituto Tecnológico — Departamento de Deportes y Cultura
        </p>
        <div className="sp-print-header__stats">
          <span>
            Hombres: {estadisticas.h} | Mujeres: {estadisticas.m}
          </span>
          <span>
            ITE: {estadisticas.ite} | Externos: {estadisticas.ext}
          </span>
          <span>Total: {estadisticas.total} Registros</span>
        </div>
      </div>

      {/* ── Filtros (ocultos en PDF) ── */}
      <div className="sp-filters sp-no-print">
        <div className="sp-search-wrap">
          <Search className="sp-search-icon" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre o torneo..."
            className="sp-search-input"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="sp-filter-controls">
          <select
            className="sp-select"
            onChange={(e) => setFiltroTipo(e.target.value)}
          >
            <option value="Todos">ITE / EXT</option>
            <option value="Interno">Solo ITE</option>
            <option value="Externo">Solo Externos</option>
          </select>
          <select
            className="sp-select"
            onChange={(e) => setFiltroGenero(e.target.value)}
          >
            <option value="Todos">Género</option>
            <option value="M">Masc</option>
            <option value="F">Fem</option>
          </select>
          <button className="sp-btn-print" onClick={() => window.print()}>
            <Printer size={15} />
            Imprimir
          </button>
        </div>
      </div>

      {/* ── Tarjetas de totales (ocultas en PDF) ── */}
      <div className="sp-stats-grid sp-no-print">
        <div className="sp-stat-card">
          <span className="sp-stat-label">Total</span>
          <span className="sp-stat-value">{estadisticas.total}</span>
        </div>
        <div className="sp-stat-card">
          <span className="sp-stat-label sp-stat-label--blue">Hombres</span>
          <span className="sp-stat-value">{estadisticas.h}</span>
        </div>
        <div className="sp-stat-card">
          <span className="sp-stat-label sp-stat-label--pink">Mujeres</span>
          <span className="sp-stat-value">{estadisticas.m}</span>
        </div>
        <div className="sp-stat-card sp-stat-card--ite">
          <span className="sp-stat-label">Alumnos ITE</span>
          <span className="sp-stat-value">{estadisticas.ite}</span>
        </div>
        <div className="sp-stat-card sp-stat-card--ext">
          <span className="sp-stat-label">Externos</span>
          <span className="sp-stat-value">{estadisticas.ext}</span>
        </div>
      </div>

      {/* ── Tabla ── */}
      <div className="sp-print-container">
        <table className="sp-table">
          <thead>
            <tr>
              <th className="sp-col-n sp-print-only">#</th>
              <th className="sp-col-nombre">Nombre del Atleta</th>
              <th className="sp-col-act">Actividad / Deporte</th>
              <th className="sp-col-equipo">Equipo / Rol</th>
              <th className="sp-col-g sp-print-only sp-center">G</th>
              <th className="sp-col-firma sp-center">Firma</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((p, idx) => (
              <tr key={idx}>
                <td className="sp-col-n sp-td-num sp-print-only">{idx + 1}</td>
                <td className="sp-td-nombre">{p.nombre}</td>
                <td className="sp-td-actividad">{p.actividad}</td>
                <td>
                  <span className="sp-td-equipo">{p.equipo}</span>
                  <span className="sp-td-rol">{p.rol}</span>
                </td>
                <td className="sp-col-g sp-center sp-print-only">{p.genero}</td>
                <td className="sp-col-firma" />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Pie de firmas (solo PDF) ── */}
      <div className="sp-print-footer">
        <div className="sp-print-footer__line">Firma Responsable</div>
        <div className="sp-print-footer__line">Sello de Institución</div>
      </div>
    </div>
  );
};

export default SeccionParticipantes;
