"use client";
import { useState, useEffect } from "react";
import {
  Search,
  FileText,
  CheckCircle,
  Clock,
  Filter,
  Download,
} from "lucide-react";

export default function VistaReportes() {
  const [inscripcionesAprobadas, setInscripcionesAprobadas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(false);
  const [filtroActividad, setFiltroActividad] = useState("todas");
  const [actividadesDisponibles, setActividadesDisponibles] = useState([]);

  useEffect(() => {
    cargarInscripcionesAprobadas();
  }, []);

  const cargarInscripcionesAprobadas = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/inscripciones", {
        cache: "no-store",
      });

      if (!response.ok) {
        console.error("❌ Error HTTP:", response.status);
        setInscripcionesAprobadas([]);
        return;
      }

      const inscripciones = await response.json();

      if (!Array.isArray(inscripciones)) {
        console.error("❌ Respuesta no es array:", inscripciones);
        setInscripcionesAprobadas([]);
        return;
      }

      // Filtrar solo las inscripciones aprobadas (calificación >= 70)
      const aprobadas = inscripciones.filter((inscripcion) => {
        const calificacion = inscripcion.calificacion || 0;
        return (
          calificacion >= 70 && inscripcion.estudiante && inscripcion.actividad
        );
      });

      // Ordenar por número de control y luego por actividad
      aprobadas.sort((a, b) => {
        const controlA = a.estudiante?.aluctr || "";
        const controlB = b.estudiante?.aluctr || "";
        return controlA.localeCompare(controlB);
      });

      setInscripcionesAprobadas(aprobadas);

      // Extraer actividades únicas para el filtro
      const actividadesUnicas = [
        ...new Set(
          aprobadas.map(
            (i) => i.actividad?.aconco || i.actividad?.aticve || "Sin nombre",
          ),
        ),
      ].sort();

      setActividadesDisponibles(actividadesUnicas);
    } catch (error) {
      console.error("❌ Error al cargar inscripciones aprobadas:", error);
      setInscripcionesAprobadas([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar inscripciones según búsqueda y filtro de actividad
  const inscripcionesFiltradas = inscripcionesAprobadas.filter(
    (inscripcion) => {
      const estudiante = inscripcion.estudiante;
      const actividad = inscripcion.actividad;

      const nombreCompleto =
        `${estudiante.alunom || ""} ${estudiante.aluapp || ""} ${estudiante.aluapm || ""}`.toLowerCase();
      const numeroControl = (estudiante.aluctr || "").toLowerCase();
      const nombreActividad = (
        actividad.aconco ||
        actividad.aticve ||
        ""
      ).toLowerCase();
      const terminoBusqueda = busqueda.toLowerCase();

      const cumpleBusqueda =
        nombreCompleto.includes(terminoBusqueda) ||
        numeroControl.includes(terminoBusqueda) ||
        nombreActividad.includes(terminoBusqueda);

      const cumpleFiltroActividad =
        filtroActividad === "todas" ||
        (actividad.aconco || actividad.aticve || "Sin nombre") ===
          filtroActividad;

      return cumpleBusqueda && cumpleFiltroActividad;
    },
  );

  // Función para exportar a CSV
  const exportarCSV = () => {
    const headers = [
      "No. Control",
      "Nombre Completo",
      "Correo",
      "Actividad",
      "Código",
      "Créditos",
      "Horas",
      "Calificación",
      "Propósito",
    ];

    const rows = inscripcionesFiltradas.map((inscripcion) => {
      const estudiante = inscripcion.estudiante;
      const actividad = inscripcion.actividad;
      const nombreCompleto =
        `${estudiante.alunom || ""} ${estudiante.aluapp || ""} ${estudiante.aluapm || ""}`.trim();
      const nombreActividad =
        actividad.aconco || actividad.aticve || "Sin nombre";
      const proposito =
        inscripcion.formularioData?.purpose === "creditos"
          ? "Créditos"
          : inscripcion.formularioData?.purpose === "servicio_social"
            ? "Servicio Social"
            : "Por Gusto";

      return [
        estudiante.aluctr,
        nombreCompleto,
        estudiante.alumai || "N/A",
        nombreActividad,
        actividad.aticve || "N/A",
        actividad.acocre || "N/A",
        actividad.acohrs || "N/A",
        inscripcion.calificacion,
        proposito,
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Reporte_Aprobados_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Lista de Estudiantes Aprobados
                </h1>
                <p className="text-gray-600">
                  Estudiantes con calificación aprobatoria (≥70) en actividades
                  complementarias
                </p>
              </div>
            </div>
            <button
              onClick={exportarCSV}
              disabled={inscripcionesFiltradas.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Download size={18} />
              Exportar CSV
            </button>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Aprobados</p>
                <p className="text-2xl font-bold text-gray-800">
                  {inscripcionesAprobadas.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Actividades Distintas</p>
                <p className="text-2xl font-bold text-gray-800">
                  {actividadesDisponibles.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Filter className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Resultados Filtrados</p>
                <p className="text-2xl font-bold text-gray-800">
                  {inscripcionesFiltradas.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Buscador y Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Buscador */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Buscar por nombre, control o actividad..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            {/* Filtro de actividad */}
            <div className="relative">
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <select
                value={filtroActividad}
                onChange={(e) => setFiltroActividad(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="todas">📋 Todas las actividades</option>
                {actividadesDisponibles.map((actividad, idx) => (
                  <option key={idx} value={actividad}>
                    {actividad}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tabla de resultados */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Estudiantes aprobados: {inscripcionesFiltradas.length}
            </h2>
            {filtroActividad !== "todas" && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Filtrando: {filtroActividad}
              </span>
            )}
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <Clock className="animate-spin mx-auto mb-2" size={32} />
              Cargando estudiantes aprobados...
            </div>
          ) : inscripcionesFiltradas.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FileText className="mx-auto mb-2 text-gray-300" size={48} />
              <p className="font-medium">
                No se encontraron estudiantes aprobados
              </p>
              <p className="text-sm mt-1">
                Intenta ajustar los filtros de búsqueda
              </p>
            </div>
          ) : (
            <div className="max-h-[600px] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      No. Control
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Nombre Completo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Correo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Actividad
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">
                      Código
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">
                      Créditos
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">
                      Horas
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">
                      Calificación
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">
                      Propósito
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {inscripcionesFiltradas.map((inscripcion, idx) => {
                    const estudiante = inscripcion.estudiante;
                    const actividad = inscripcion.actividad;
                    const nombreCompleto =
                      `${estudiante.alunom || ""} ${estudiante.aluapp || ""} ${estudiante.aluapm || ""}`.trim();
                    const nombreActividad =
                      actividad.aconco || actividad.aticve || "Sin nombre";
                    const proposito = inscripcion.formularioData?.purpose;

                    const propositoTexto =
                      proposito === "creditos"
                        ? "Créditos"
                        : proposito === "servicio_social"
                          ? "Servicio Social"
                          : "Por Gusto";

                    const propositoColor =
                      proposito === "creditos"
                        ? "bg-blue-100 text-blue-700"
                        : proposito === "servicio_social"
                          ? "bg-green-100 text-green-700"
                          : "bg-purple-100 text-purple-700";

                    return (
                      <tr
                        key={idx}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {estudiante.aluctr}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {nombreCompleto}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {estudiante.alumai || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {nombreActividad}
                        </td>
                        <td className="px-4 py-3 text-sm text-center text-gray-600">
                          {actividad.aticve || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm text-center text-gray-600">
                          {actividad.acocre || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm text-center text-gray-600">
                          {actividad.acohrs || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center justify-center w-12 h-8 bg-green-100 text-green-800 font-bold text-sm rounded">
                            {inscripcion.calificacion}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${propositoColor}`}
                          >
                            {propositoTexto}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer informativo */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle
              className="text-green-600 flex-shrink-0 mt-0.5"
              size={20}
            />
            <div className="text-sm text-green-800">
              <p className="font-semibold mb-1">ℹInformación sobre la lista</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Solo se muestran estudiantes con calificación ≥ 70</li>
                <li>
                  Si un estudiante está inscrito en múltiples actividades,
                  aparecerá una vez por cada actividad aprobada
                </li>
                <li>
                  Los datos se actualizan automáticamente desde la base de datos
                </li>
                <li>
                  Puedes exportar la lista completa en formato CSV para análisis
                  externos
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
