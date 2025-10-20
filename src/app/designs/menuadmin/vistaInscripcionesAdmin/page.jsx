"use client";
import React, { useState, useEffect } from "react";
import { Users, ChevronDown, ChevronUp, Search } from "lucide-react";
import AdminSidebar from "@/app/components/navbaradm";

const InscripcionesPanel = () => {
  const [actividadesOfertadas, setActividadesOfertadas] = useState([]);
  const [inscripciones, setInscripciones] = useState({});
  const [actividadExpandida, setActividadExpandida] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      // Cargar actividades ofertadas
      const resOfertas = await fetch("/api/act-disponibles");
      const ofertas = await resOfertas.json();

      // Cargar todas las inscripciones
      const resInscripciones = await fetch("/api/inscripdispo");
      const todasInscripciones = await resInscripciones.json();

      // Agrupar inscripciones por actividad
      const inscripcionesPorActividad = {};
      todasInscripciones.forEach((inscripcion) => {
        const actId = inscripcion.actividadId;
        if (!inscripcionesPorActividad[actId]) {
          inscripcionesPorActividad[actId] = [];
        }
        inscripcionesPorActividad[actId].push(inscripcion);
      });

      setActividadesOfertadas(ofertas);
      setInscripciones(inscripcionesPorActividad);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActividad = (actividadId) => {
    setActividadExpandida(
      actividadExpandida === actividadId ? null : actividadId
    );
  };

  const actividadesFiltradas = actividadesOfertadas.filter((oferta) =>
    (oferta.actividad.aconco || oferta.actividad.aticve || "")
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8">Cargando inscripciones...</div>;
  }

  return (
    <div className="space-y-6">
      <AdminSidebar />
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Inscripciones por Actividad
        </h2>
        <p className="text-gray-600">
          Lista de estudiantes inscritos en cada actividad
        </p>
      </div>

      {/* Buscador */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar actividad..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Lista de actividades */}
      <div className="space-y-3">
        {actividadesFiltradas.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
            No se encontraron actividades ofertadas
          </div>
        ) : (
          actividadesFiltradas.map((oferta) => {
            const inscritos = inscripciones[oferta.actividadId] || [];
            const isExpanded = actividadExpandida === oferta.actividadId;

            return (
              <div
                key={oferta.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                {/* Header de la actividad */}
                <button
                  onClick={() => toggleActividad(oferta.actividadId)}
                  className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {oferta.actividad?.aconco ||
                        oferta.actividad?.aticve ||
                        ""}
                    </h3>
                    <div className="flex gap-4 mt-1 text-sm text-gray-600">
                      <span>Código: {oferta.actividad.aticve}</span>
                      <span>Créditos: {oferta.actividad.acocre}</span>
                      <span>Horas: {oferta.actividad.acohrs}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        inscritos.length > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Users size={14} className="inline mr-1" />
                      {inscritos.length} inscritos
                    </span>
                    {isExpanded ? <ChevronUp /> : <ChevronDown />}
                  </div>
                </button>

                {/* Lista de estudiantes inscritos */}
                {isExpanded && (
                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    {inscritos.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">
                        No hay estudiantes inscritos en esta actividad
                      </p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                                No. Control
                              </th>
                              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                                Nombre
                              </th>
                              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                                Fecha Inscripción
                              </th>
                              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                                Tipo de Sangre
                              </th>
                              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                                Propósito
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {inscritos.map((inscripcion, idx) => {
                              const nombreCompleto = `${
                                inscripcion.estudiante.alunom || ""
                              } ${inscripcion.estudiante.aluapp || ""} ${
                                inscripcion.estudiante.aluapm || ""
                              }`.trim();

                              return (
                                <tr key={idx} className="hover:bg-gray-50">
                                  <td className="px-4 py-3 text-sm text-gray-900">
                                    {inscripcion.estudiante.aluctr}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900">
                                    {nombreCompleto || "Sin nombre"}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600">
                                    {new Date(
                                      inscripcion.fechaInscripcion
                                    ).toLocaleDateString()}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600">
                                    {inscripcion.formularioData?.bloodType ||
                                      "N/A"}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600">
                                    {inscripcion.formularioData?.purpose ||
                                      "N/A"}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default InscripcionesPanel;
