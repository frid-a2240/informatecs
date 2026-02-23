// app/designs/admin/constancias/page.jsx
"use client";
import { useState, useEffect, useMemo } from "react";
import { Search, Award, Filter } from "lucide-react";
import { ModalGenerar } from "@/app/components/ModalGenerar";
import { EstudianteRow } from "@/app/components/EstudianteRow";
import "@/styles/admin/constancias.css"; // Asegúrate que este CSS tenga el prefijo constanciasge-

export default function VistaConstanciasAdmin() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  const cargarEstudiantes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/inscripciones");
      const inscripciones = await res.json();

      const estudiantesMap = new Map();

      inscripciones.forEach((inscripcion) => {
        const estudiante = inscripcion.estudiante;
        if (!estudiante) return;

        const numeroControl = estudiante.aluctr;
        if (!estudiantesMap.has(numeroControl)) {
          estudiantesMap.set(numeroControl, {
            ...estudiante,
            tieneActividadAprobada: false,
            totalActividades: 0,
            actividadesAprobadas: 0,
          });
        }

        const est = estudiantesMap.get(numeroControl);
        est.totalActividades++;
        if ((inscripcion.calificacion || 0) >= 70) {
          est.tieneActividadAprobada = true;
          est.actividadesAprobadas++;
        }
      });

      setEstudiantes(
        Array.from(estudiantesMap.values()).sort((a, b) =>
          a.aluctr.localeCompare(b.aluctr),
        ),
      );
    } catch (error) {
      console.error("Error cargando estudiantes:", error);
    } finally {
      setLoading(false);
    }
  };

  const estudiantesFiltrados = useMemo(() => {
    const termino = busqueda.toLowerCase();
    return estudiantes.filter((est) => {
      const cumpleBusqueda =
        `${est.alunom} ${est.aluapp} ${est.aluapm || ""}`
          .toLowerCase()
          .includes(termino) || est.aluctr.toLowerCase().includes(termino);

      if (!cumpleBusqueda) return false;

      if (filtroEstado === "aprobados") return est.tieneActividadAprobada;
      if (filtroEstado === "no_aprobados") return !est.tieneActividadAprobada;
      return true;
    });
  }, [estudiantes, busqueda, filtroEstado]);

  const estadisticas = useMemo(() => {
    const total = estudiantes.length;
    const aprobados = estudiantes.filter(
      (e) => e.tieneActividadAprobada,
    ).length;
    const noAprobados = total - aprobados;
    return { total, aprobados, noAprobados };
  }, [estudiantes]);

  if (loading) {
    return (
      <div className="constanciasge-page-container">
        <div className="constanciasge-loading">
          <div className="constanciasge-spinner"></div>
          <p>Cargando estudiantes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="constanciasge-page-container">
      <div className="constanciasge-content-wrapper">
        <div className="constanciasge-card constanciasge-header">
          <div>
            <h1 className="constanciasge-title">Generación de Constancias</h1>
            <p className="constanciasge-subtitle">
              Administración de constancias oficiales
            </p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="constanciasge-stats-grid">
          <div className="constanciasge-stat-card constanciasge-border-blue">
            <p className="constanciasge-card-title">Total Estudiantes</p>
            <p className="constanciasge-card-value">{estadisticas.total}</p>
          </div>
          <div className="constanciasge-stat-card constanciasge-border-green">
            <p className="constanciasge-card-title">
              Con Actividades Aprobadas
            </p>
            <p className="constanciasge-card-value">{estadisticas.aprobados}</p>
          </div>
          <div className="constanciasge-stat-card ">
            <p className="constanciasge-card-title">
              Sin Actividades Aprobadas
            </p>
            <p className="constanciasge-card-value">
              {estadisticas.noAprobados}
            </p>
          </div>
        </div>

        {/* Buscador y Filtros */}
        <div className="constanciasge-card constanciasge-filters">
          <div className="constanciasge-input-group">
            <Search size={18} className="constanciasge-icon" />
            <input
              type="text"
              placeholder="Buscar por nombre o número de control..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="constanciasge-input"
            />
          </div>
          <div className="constanciasge-input-group">
            <Filter className="constanciasge-icon" size={18} />
            <select className="constanciasge-select">
              <option value="">Todos los estados</option>
              <option value="aprobado">Aprobado</option>
              <option value="pendiente">Pendiente</option>
            </select>
          </div>
        </div>

        {/* Tabla */}
        <div className="constanciasge-card constanciasge-table-container">
          <table className="constanciasge-table">
            <thead>
              <tr>
                <th>Núm. Control</th>
                <th>Nombre Completo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {estudiantesFiltrados.length > 0 ? (
                estudiantesFiltrados.map((est) => (
                  <EstudianteRow
                    key={est.aluctr}
                    est={est}
                    onSelect={() => setEstudianteSeleccionado(est)}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="constanciasge-no-data">
                    No se encontraron estudiantes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Nota */}
        <div className="constanciasge-note">
          <p>
            <strong>Nota:</strong> Solo se pueden generar constancias para
            estudiantes con calificación ≥ 70 en al menos una actividad. El
            sistema genera automáticamente un folio único y código de
            verificación para cada constancia.
          </p>
        </div>

        {/* Modal */}
        {estudianteSeleccionado && (
          <ModalGenerar
            estudiante={estudianteSeleccionado}
            onClose={() => {
              setEstudianteSeleccionado(null);
              cargarEstudiantes();
            }}
          />
        )}
      </div>
    </div>
  );
}
