"use client";
import { useState, useEffect } from "react";
import { 
  FileText, 
  Download, 
  Shield, 
  Calendar, 
  Award,
  ExternalLink,
  Search
} from "lucide-react";
// ✅ IMPORTANTE: Importamos tu utilidad que usa el diseño oficial de React-PDF
import { descargarConstanciaPDF } from "@/app/utils/pdfHelper";

export default function MisConstancias() {
  const [constancias, setConstancias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroAnio, setFiltroAnio] = useState("");
  const [numeroControl, setNumeroControl] = useState("");

  useEffect(() => {
    const obtenerNumeroControl = () => {
      let numControl = localStorage.getItem("numeroControl");
      if (!numControl) {
        try {
          const studentDataStr = localStorage.getItem("studentData");
          if (studentDataStr) {
            const studentData = JSON.parse(studentDataStr);
            numControl = studentData.numeroControl;
            if (numControl) localStorage.setItem("numeroControl", numControl);
          }
        } catch (error) {
          console.error("❌ Error al parsear studentData:", error);
        }
      }
      return numControl;
    };

    const numControl = obtenerNumeroControl();
    if (numControl) {
      setNumeroControl(numControl);
      cargarConstancias(numControl);
    } else {
      setLoading(false);
      setTimeout(() => { window.location.href = "/designs/vistaLogin"; }, 2000);
    }
  }, []);

  const cargarConstancias = async (numControl) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/constancias/estudiante?numeroControl=${numControl}`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const data = await response.json();
      setConstancias(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error al cargar constancias:", error);
      setConstancias([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ CORRECCIÓN: Ahora usa tu diseño de @react-pdf/renderer
  const manejarDescarga = async (constancia) => {
    try {
      // Llamamos a la utilidad que inyecta los datos en TU componente de diseño
      await descargarConstanciaPDF({
        folio: constancia.folio,
        codigoVerificacion: constancia.codigoVerificacion,
        nombreCompleto: constancia.nombreCompleto,
        numeroControl: constancia.numeroControl,
        actividadNombre: constancia.actividadNombre,
        periodo: constancia.periodo,
        acreditacion: constancia.acreditacion
      });
    } catch (error) {
      console.error("❌ Error al descargar:", error);
      alert("No se pudo generar el PDF con el formato oficial.");
    }
  };

  // Filtros de búsqueda
  const constanciasFiltradas = constancias.filter((constancia) => {
    const cumpleBusqueda = 
      constancia.actividadNombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      constancia.folio?.toLowerCase().includes(busqueda.toLowerCase());
    const anioConstancia = new Date(constancia.fechaEmision).getFullYear().toString();
    const cumpleAnio = !filtroAnio || anioConstancia === filtroAnio;
    return cumpleBusqueda && cumpleAnio;
  });

  const aniosDisponibles = [...new Set(constancias.map(c => new Date(c.fechaEmision).getFullYear()))].sort((a, b) => b - a);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando constancias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header - Diseño Original */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Award className="text-blue-600" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Mis Constancias</h1>
              <p className="text-gray-600">Historial de constancias oficiales</p>
            </div>
          </div>
        </div>

        {/* Buscador y Filtros - Diseño Original */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por actividad o folio..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filtroAnio}
            onChange={(e) => setFiltroAnio(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">Todos los años</option>
            {aniosDisponibles.map(anio => <option key={anio} value={anio}>{anio}</option>)}
          </select>
        </div>

        {/* Listado - Diseño Original */}
        <div className="space-y-4">
          {constanciasFiltradas.map((constancia) => (
            <div key={constancia.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all border-l-4 border-blue-600">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{constancia.actividadNombre}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm text-gray-600">
                    <p><strong>Folio:</strong> {constancia.folio}</p>
                    <p><strong>Periodo:</strong> {constancia.periodo}</p>
                    <p><strong>Fecha:</strong> {new Date(constancia.fechaEmision).toLocaleDateString()}</p>
                    <p><strong>Acreditación:</strong> {constancia.acreditacion}</p>
                  </div>
                </div>
                <div className="flex flex-row md:flex-col gap-2">
                  <button
                    onClick={() => manejarDescarga(constancia)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Download size={18} /> Descargar PDF
                  </button>
                  <a
                    href={`/verificar/${constancia.folio}`}
                    target="_blank"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
                  >
                    <ExternalLink size={18} /> Verificar
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}