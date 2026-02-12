"use client";
import { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Award,
  ExternalLink,
  Search,
  Loader2,
  UserCircle,
} from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";

// IMPORTANTE: Asegúrate de que esta ruta sea la correcta hacia tu componente PDF
import { ConstanciaPDF } from "@/app/components/Constancias";

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-slate-600 font-medium">Validando identidad...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Barra Superior */}
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex gap-4 items-center">
            <img
              src="/imagenes/itelogo.png"
              className="h-10 w-auto"
              alt="Logo ITE"
            />
            <div className="hidden md:block h-8 w-[1px] bg-slate-200"></div>
            <img
              src="/imagenes/tecnlogo.png"
              className="hidden md:block h-8 w-auto"
              alt="TecNM"
            />
          </div>
          <button
            onClick={cerrarSesion}
            className="flex items-center gap-2 text-slate-500 hover:text-red-600 font-medium transition-colors text-sm"
          >
            Cerrar Sesión
          </button>
        </div>

        {/* Header de Perfil */}
        <div className="bg-slate-900 rounded-3xl p-8 mb-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl shadow-slate-200">
          <div className="flex items-center gap-5">
            <div className="bg-blue-600 p-4 rounded-2xl">
              <UserCircle size={40} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Mis Constancias</h1>
              <p className="text-slate-400">
                Alumno: <span className="text-blue-400">{numeroControl}</span>
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-center px-6 py-2 bg-slate-800 rounded-xl border border-slate-700">
              <p className="text-2xl font-bold">{constancias.length}</p>
              <p className="text-[10px] uppercase text-slate-400 font-bold">
                Emitidas
              </p>
            </div>
          </div>
        </div>

        {/* Buscador y Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-3 relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar por nombre de actividad o folio..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <select
            value={filtroAnio}
            onChange={(e) => setFiltroAnio(e.target.value)}
            className="w-full px-6 py-4 bg-white rounded-2xl border-none shadow-sm font-bold text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
          >
            <option value="">Todos los años</option>
            {aniosDisponibles.map((anio) => (
              <option key={anio} value={anio}>
                {anio}
              </option>
            ))}
          </select>
        </div>

        {/* Lista de Constancias */}
        <div className="space-y-4">
          {constanciasFiltradas.length > 0 ? (
            constanciasFiltradas.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-1 rounded-md uppercase">
                        Válida
                      </span>
                      <span className="text-slate-400 text-xs font-mono">
                        Folio: {c.folio}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-blue-600 transition-colors">
                      {c.actividadNombre}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Award size={16} /> <span>{c.acreditacion}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <FileText size={16} />{" "}
                        <span className="text-xs">{c.periodo}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 w-full md:w-auto">
                    <button
                      onClick={() => manejarDescarga(c)}
                      disabled={descargandoId === c.id}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all disabled:bg-slate-200"
                    >
                      {descargandoId === c.id ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <Download size={20} />
                      )}
                      PDF
                    </button>
                    <a
                      href={`/verificar/${c.folio}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all"
                    >
                      <ExternalLink size={20} />
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-slate-200">
              <FileText className="mx-auto text-slate-200 mb-4" size={60} />
              <p className="text-slate-400 font-medium">
                No se encontraron constancias emitidas para tu cuenta.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
