"use client";
import { useState, useEffect, useMemo } from "react";
import { Search, FileText } from "lucide-react";
import { descargarConstanciaPDF } from "@/app/utils/pdfHelper";
import { ModalGenerar } from "@/app/components/ModalGenerar";
import { EstudianteRow } from "@/app/components/EstudianteRow";
// Componentes que extraemos (te muestro abajo cómo quedan)

export default function VistaConstancias() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch("/api/inscripciones").then(r => r.json());
      const mapa = res.reduce((acc, i) => {
        const e = i.estudiante;
        if (!e) return acc;
        if (!acc[e.aluctr]) acc[e.aluctr] = { ...e, apto: false };
        if ((i.calificacion || 0) >= 70) acc[e.aluctr].apto = true;
        return acc;
      }, {});
      setEstudiantes(Object.values(mapa));
      setLoading(false);
    })();
  }, []);

  const filtrados = useMemo(() => {
    const t = busqueda.toLowerCase();
    return estudiantes.filter(e => 
      `${e.alunom} ${e.aluapp}`.toLowerCase().includes(t) || e.aluctr.includes(t)
    );
  }, [estudiantes, busqueda]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3"><FileText className="text-blue-600"/> Generación</h1>
        </header>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input className="w-full pl-10 pr-4 py-3 border rounded-lg" placeholder="Buscar..." onChange={e => setBusqueda(e.target.value)} />
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 uppercase text-xs font-bold">
              <tr><th className="px-6 py-3">Control</th><th className="px-6 py-3">Nombre</th><th className="px-6 py-3 text-center">Estado</th><th className="px-6 py-3"></th></tr>
            </thead>
            <tbody>
              {filtrados.map(est => (
                <EstudianteRow key={est.aluctr} est={est} onSelect={() => setEstudianteSeleccionado(est)} />
              ))}
            </tbody>
          </table>
        </div>

        {estudianteSeleccionado && (
          <ModalGenerar
            estudiante={estudianteSeleccionado} 
            onClose={() => setEstudianteSeleccionado(null)} 
          />
        )}
      </div>
    </div>
  );
}