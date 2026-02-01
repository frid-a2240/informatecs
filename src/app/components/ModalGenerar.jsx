import { useState, useEffect } from "react";
import { X, Shield, Download } from "lucide-react";
import { descargarConstanciaPDF } from "@/app/utils/pdfHelper";

export const ModalGenerar = ({ estudiante, onClose }) => {
  const [inscripciones, setInscripciones] = useState([]);
  const [seleccionada, setSeleccionada] = useState(null);
  const [datos, setDatos] = useState({ periodo: "", cantidad: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/inscripciones")
      .then(r => r.json())
      .then(data => {
        const filtradas = data.filter(i => i?.estudiante?.aluctr === estudiante.aluctr);
        setInscripciones(filtradas);
        const apta = filtradas.find(i => (i.calificacion || 0) >= 70);
        if (apta) setSeleccionada(apta);
      });
  }, [estudiante]);

  const handleGenerar = async () => {
    setLoading(true);
    try {
      const nombreCompleto = `${estudiante.alunom} ${estudiante.aluapp} ${estudiante.aluapm}`.trim();
      const unidad = seleccionada.formularioData?.purpose === 'servicio_social' ? 'Horas' : 'Créditos';
      
      const res = await fetch("/api/constancias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numeroControl: estudiante.aluctr,
          nombreCompleto,
          actividadNombre: seleccionada.actividad?.aconco,
          periodo: datos.periodo,
          acreditacion: `${datos.cantidad} ${unidad}`,
          actividadId: seleccionada.actividadId,
        }),
      });

      const { constancia } = await res.json();
      await descargarConstanciaPDF({
        ...constancia,
        nombreCompleto,
        numeroControl: estudiante.aluctr,
        actividadNombre: seleccionada.actividad?.aconco,
        acreditacion: `${datos.cantidad} ${unidad}`
      });
      onClose();
    } catch (e) { alert("Error al generar"); }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield className="text-blue-600" />
            <h3 className="font-bold text-xl text-gray-800">Generar Constancia</h3>
          </div>
          <button onClick={onClose}><X /></button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="font-bold text-blue-900">{estudiante.alunom} {estudiante.aluapp}</p>
            <p className="text-sm text-blue-700">Control: {estudiante.aluctr}</p>
          </div>

          <div className="space-y-3">
            {inscripciones.map((insc, idx) => (
              <div 
                key={idx}
                onClick={() => (insc.calificacion >= 70) && setSeleccionada(insc)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  insc.calificacion < 70 ? 'opacity-40 grayscale cursor-not-allowed' : 
                  (seleccionada === insc ? 'border-blue-600 bg-blue-50' : 'border-gray-200')
                }`}
              >
                <div className="flex justify-between font-bold text-sm">
                  <span>{insc.actividad?.aconco}</span>
                  <span>{insc.calificacion >= 70 ? '✅ Apto' : '❌ Pendiente'}</span>
                </div>
              </div>
            ))}
          </div>

          {seleccionada && (
            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <input 
                className="p-2 border rounded-md" 
                placeholder="Periodo (Ene-Jun 2025)" 
                onChange={e => setDatos({...datos, periodo: e.target.value})}
              />
              <div className="flex gap-2">
                <input 
                  type="number" className="w-full p-2 border rounded-md" 
                  placeholder="Cantidad"
                  onChange={e => setDatos({...datos, cantidad: e.target.value})}
                />
                <span className="bg-gray-100 p-2 rounded-md text-xs font-bold flex items-center">
                  {seleccionada.formularioData?.purpose === 'servicio_social' ? 'Hrs' : 'Créd'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancelar</button>
          <button 
            disabled={loading || !seleccionada || !datos.periodo}
            onClick={handleGenerar}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:bg-gray-300"
          >
            {loading ? <span className="animate-spin border-2 border-white/20 border-t-white rounded-full w-4 h-4" /> : <Download size={18} />}
            Generar PDF con QR
          </button>
        </div>
      </div>
    </div>
  );
};