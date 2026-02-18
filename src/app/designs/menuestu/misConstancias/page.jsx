"use client";
import { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Award,
  ExternalLink,
  Search,
  Loader2,
  LogOut,
  Calendar,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";

// IMPORTANTE: Asegúrate de que esta ruta sea la correcta hacia tu componente PDF
import { ConstanciaPDF } from "@/app/components/Constancias";
import "@/styles/alumno/cons.css";

export default function MisConstancias() {
  const [constancias, setConstancias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [descargandoId, setDescargandoId] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroAnio, setFiltroAnio] = useState("");
  const [numeroControl, setNumeroControl] = useState("");

  useEffect(() => {
    // FUNCIÓN PARA RECUPERAR LA SESIÓN REAL
    const recuperarSesion = () => {
      // Intentamos obtener el ID de las llaves más comunes que podrías estar usando
      const idDirecto = localStorage.getItem("numeroControl");
      const dataEstudiante = localStorage.getItem("studentData");

      if (idDirecto) return idDirecto;

      if (dataEstudiante) {
        try {
          const parsed = JSON.parse(dataEstudiante);
          return parsed.aluctr || parsed.numeroControl;
        } catch (e) {
          return null;
        }
      }
      return null;
    };

    const idSesion = recuperarSesion();

    if (idSesion) {
      setNumeroControl(idSesion);
      cargarConstancias(idSesion);
    } else {
      // Si no hay sesión, redirigir al login
      console.warn("No se detectó sesión activa, redirigiendo...");
      setTimeout(() => {
        window.location.href = "/designs/vistaLogin";
      }, 1000);
    }
  }, []);

  const cargarConstancias = async (idEstudiante) => {
    try {
      setLoading(true);
      // t=${Date.now()} evita que el navegador use datos cacheados de otro alumno
      const response = await fetch(
        `/api/constancias?numeroControl=${idEstudiante}&t=${Date.now()}`,
        { cache: "no-store" },
      );

      const data = await response.json();

      // Validamos que sea un array y que pertenezcan al alumno logueado
      if (Array.isArray(data)) {
        setConstancias(data.filter((c) => c.numeroControl === idEstudiante));
      } else {
        setConstancias([]);
      }
    } catch (error) {
      console.error("Error al cargar constancias:", error);
      setConstancias([]);
    } finally {
      setLoading(false);
    }
  };

  const manejarDescarga = async (constancia) => {
    setDescargandoId(constancia.id);
    try {
      const doc = <ConstanciaPDF datos={constancia} />;
      const blob = await pdf(doc).toBlob();
      saveAs(blob, `Constancia_${constancia.folio}.pdf`);
    } catch (error) {
      alert("Error al generar el PDF oficial.");
    } finally {
      setDescargandoId(null);
    }
  };

  const cerrarSesion = () => {
    localStorage.clear();
    window.location.href = "/designs/vistaLogin";
  };

  // Lógica de filtrado
  const constanciasFiltradas = constancias.filter((c) => {
    const cumpleBusqueda =
      c.actividadNombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.folio?.toLowerCase().includes(busqueda.toLowerCase());
    const anio = new Date(c.fechaEmision).getFullYear().toString();
    const cumpleAnio = !filtroAnio || anio === filtroAnio;
    return cumpleBusqueda && cumpleAnio;
  });

  const aniosDisponibles = [
    ...new Set(constancias.map((c) => new Date(c.fechaEmision).getFullYear())),
  ].sort((a, b) => b - a);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="spinner"></div>
          <p className="loading-text">Validando identidad...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="user-banner">
        <div className="user-banner-container">
          <div className="user-banner-content">
            <div className="user-info">
              <div className="user-details">
                <h1>Mis Constancias</h1>
                <p className="user-control">
                  Número de Control:{" "}
                  <span className="control-number">{numeroControl}</span>
                </p>
              </div>
            </div>
            <div className="stats-card">
              <div className="stats-number">{constancias.length}</div>
              <div className="stats-label">constancias</div>
            </div>
          </div>
        </div>
      </div>

      <div className="main-container">
        {/* Barra de búsqueda y filtros */}
        <div className="search-filters-card">
          <div className="filters-grid">
            {/* Campo de búsqueda */}
            <div className="input-wrapper">
              <Search className="input-icon" size={20} />
              <input
                type="text"
                placeholder="Buscar por actividad o folio..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="search-input"
              />
            </div>

            {/* Filtro de año */}
            <div className="input-wrapper">
              <Filter className="input-icon" size={20} />
              <select
                value={filtroAnio}
                onChange={(e) => setFiltroAnio(e.target.value)}
                className="filter-select"
              >
                <option value="">Todos los años</option>
                {aniosDisponibles.map((anio) => (
                  <option key={anio} value={anio}>
                    {anio}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Contador de resultados */}
          <div className="results-counter">
            Mostrando{" "}
            <span className="highlight">{constanciasFiltradas.length}</span> de{" "}
            <span className="highlight">{constancias.length}</span> constancias
          </div>
        </div>

        {/* Lista de constancias */}
        <div className="constancias-list">
          {constanciasFiltradas.length > 0 ? (
            constanciasFiltradas.map((c) => (
              <div key={c.id} className="constancia-card">
                <div className="constancia-content">
                  <div className="constancia-layout">
                    {/* Información de la constancia */}
                    <div className="constancia-info">
                      {/* Header con badge y folio */}
                      <div className="constancia-header">
                        <div className="badge-valid">
                          <CheckCircle2 size={14} />
                          <span>Válida</span>
                        </div>
                        <span className="badge-folio">Folio: {c.folio}</span>
                      </div>

                      {/* Título */}
                      <h3 className="constancia-title">{c.actividadNombre}</h3>

                      {/* Detalles */}
                      <div className="constancia-details">
                        <div className="detail-item">
                          <Award size={18} className="detail-icon" />
                          <span>{c.acreditacion}</span>
                        </div>
                        <div className="detail-item">
                          <Calendar size={18} className="detail-icon" />
                          <span>{c.periodo}</span>
                        </div>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="action-buttons">
                      <button
                        onClick={() => manejarDescarga(c)}
                        disabled={descargandoId === c.id}
                        className="btn-primary"
                      >
                        {descargandoId === c.id ? (
                          <>
                            <Loader2 className="animate-spin" size={20} />
                            <span>Generando...</span>
                          </>
                        ) : (
                          <>
                            <Download size={20} />
                            <span>Descargar PDF</span>
                          </>
                        )}
                      </button>
                      <a
                        href={`/verificar/${c.folio}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                        title="Verificar constancia"
                      >
                        <ExternalLink size={20} />
                        <span className="hidden-tablet">Verificar</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-state-content">
                <div className="empty-icon-wrapper">
                  <FileText className="empty-icon" size={40} />
                </div>
                <h3 className="empty-title">No se encontraron constancias</h3>
                <p className="empty-description">
                  {busqueda || filtroAnio
                    ? "Intenta ajustar los filtros de búsqueda para ver más resultados"
                    : "No hay constancias emitidas para tu cuenta en este momento"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
