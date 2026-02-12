// app/designs/admin/constancias/page.jsx
"use client";
import { useState, useEffect, useMemo } from "react";
import { Search, FileText, Award, Filter } from "lucide-react";
import { ModalGenerar } from "@/app/components/ModalGenerar";
import { EstudianteRow } from "@/app/components/EstudianteRow";

export default function VistaConstanciasAdmin() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos"); // todos, aprobados, no_aprobados
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  const cargarEstudiantes = async () => {
    setLoading(true);
    try {
      // Obtener inscripciones
      const res = await fetch("/api/inscripciones");
      const inscripciones = await res.json();

      // Procesar estudiantes únicos y determinar si tienen actividades aprobadas
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

        // Si la calificación es >= 70, marcar como aprobado
        if ((inscripcion.calificacion || 0) >= 70) {
          est.tieneActividadAprobada = true;
          est.actividadesAprobadas++;
        }
      });

      const estudiantesArray = Array.from(estudiantesMap.values()).sort(
        (a, b) => a.aluctr.localeCompare(b.aluctr),
      );

      setEstudiantes(estudiantesArray);
    } catch (error) {
      console.error("❌ Error al cargar estudiantes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar estudiantes
  const estudiantesFiltrados = useMemo(() => {
    const termino = busqueda.toLowerCase();

    return estudiantes.filter((est) => {
      // Filtro de búsqueda
      const cumpleBusqueda =
        `${est.alunom} ${est.aluapp} ${est.aluapm || ""}`
          .toLowerCase()
          .includes(termino) || est.aluctr.toLowerCase().includes(termino);

      if (!cumpleBusqueda) return false;

      // Filtro de estado
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando estudiantes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header - Mismo diseño que vista de alumno */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Award className="text-blue-600" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Generación de Constancias
              </h1>
              <p className="text-gray-600">
                Administración de constancias oficiales
              </p>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-600">
            <p className="text-sm text-gray-600 mb-1">Total Estudiantes</p>
            <p className="text-3xl font-bold text-gray-800">
              {estadisticas.total}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-600">
            <p className="text-sm text-gray-600 mb-1">
              Con Actividades Aprobadas
            </p>
            <p className="text-3xl font-bold text-green-600">
              {estadisticas.aprobados}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-gray-400">
            <p className="text-sm text-gray-600 mb-1">
              Sin Actividades Aprobadas
            </p>
            <p className="text-3xl font-bold text-gray-600">
              {estadisticas.noAprobados}
            </p>
          </div>
        </div>

        {/* Buscador y Filtros - Mismo diseño */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar por nombre o número de control..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400" size={20} />
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos los estados</option>
              <option value="aprobados">Con actividades aprobadas</option>
              <option value="no_aprobados">Sin actividades aprobadas</option>
            </select>
          </div>
        </div>

        {/* Tabla de estudiantes */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100 uppercase text-xs font-bold text-gray-700">
                <tr>
                  <th className="px-6 py-3">Núm. Control</th>
                  <th className="px-6 py-3">Nombre Completo</th>
                  <th className="px-6 py-3 text-center">Estado</th>
                  <th className="px-6 py-3 text-right">Acciones</th>
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
                    <td
                      colSpan="4"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No se encontraron estudiantes
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> Solo se pueden generar constancias para
            estudiantes con calificación ≥ 70 en al menos una actividad. El
            sistema genera automáticamente un folio único y código de
            verificación para cada constancia.
          </p>
        </div>

        {/* Modal de generación */}
        {estudianteSeleccionado && (
          <ModalGenerar
            estudiante={estudianteSeleccionado}
            onClose={() => {
              setEstudianteSeleccionado(null);
              cargarEstudiantes(); // Recargar para actualizar estadísticas
            }}
          />
        )}
      </div>
    </div>
  );
}
