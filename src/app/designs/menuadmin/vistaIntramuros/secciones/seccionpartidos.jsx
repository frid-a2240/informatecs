"use client"
import React, { useState } from 'react';
import { Plus, X, Send, Loader2 } from 'lucide-react';

const SeccionPartidos = ({ actividades, resultados, onRefresh, WEB_APP_URL }) => {
  const [showModal, setShowModal] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [form, setForm] = useState({ 
    Fecha: new Date().toISOString().split('T')[0], 
    Actividad: '', 
    Local: '', 
    Visitante: '', 
    ScoreL: 0, 
    ScoreV: 0 
  });

  // Función para obtener el nombre del equipo sin importar cómo venga la llave del JSON
  const getTeamName = (res, type) => {
    if (type === 'local') {
      return res["Equipo Local"] || res["Equipo_Local"] || res.Local || res.local || "Local";
    }
    return res["Equipo Visitante"] || res["Equipo_Visitante"] || res.Visitante || res.visitante || "Visitante";
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.Actividad || !form.Local || !form.Visitante) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    setEnviando(true);
    const sL = parseInt(form.ScoreL) || 0;
    const sV = parseInt(form.ScoreV) || 0;
    
    // Determinamos el ganador para enviarlo listo a la hoja de cálculo
    let ganador = sL > sV ? form.Local : sV > sL ? form.Visitante : "Empate";

    const payload = {
      action: 'saveResult',
      hoja: 'partidos',
      Fecha: form.Fecha,
      Actividad: form.Actividad,
      "Equipo Local": form.Local,
      "Equipo Visitante": form.Visitante,
      Marcador: `${sL} - ${sV}`,
      Ganador: ganador
    };

    try {
      await fetch(WEB_APP_URL, { 
        method: 'POST', 
        mode: 'no-cors', 
        body: JSON.stringify(payload) 
      });
      
      setShowModal(false);
      setForm({ Fecha: new Date().toISOString().split('T')[0], Actividad: '', Local: '', Visitante: '', ScoreL: 0, ScoreV: 0 });
      setTimeout(onRefresh, 1500);
    } catch (err) { 
      alert("Error al guardar. Verifica tu conexión."); 
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Historial de Partidos</h2>
          <p className="text-slate-500 font-medium">Se han registrado {resultados.length} encuentros</p>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-transform active:scale-95 shadow-lg shadow-blue-100"
        >
          <Plus size={20}/> Registrar Score
        </button>
      </div>

      {/* Tabla de Resultados */}
      <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest">Fecha</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest">Torneo</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Encuentro</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Marcador</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest">Ganador</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {resultados.map((res, i) => (
                <tr key={i} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="p-5 text-slate-500 font-medium">{res.Fecha}</td>
                  <td className="p-5">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                      {res.Actividad}
                    </span>
                  </td>
                  <td className="p-5 text-center font-bold text-slate-700">
                    <span className="group-hover:text-blue-600 transition-colors">
                      {getTeamName(res, 'local')}
                    </span>
                    <span className="text-slate-300 mx-3 font-normal">VS</span>
                    <span className="group-hover:text-blue-600 transition-colors">
                      {getTeamName(res, 'visitante')}
                    </span>
                  </td>
                  <td className="p-5 text-center">
                    <span className="bg-slate-900 text-white px-4 py-2 rounded-xl font-mono font-black text-lg">
                      {res.Marcador}
                    </span>
                  </td>
                  <td className="p-5 font-black text-blue-600 italic">
                    {res.Ganador}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Registro */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 bg-blue-600 text-white flex justify-between items-center">
              <span className="font-black tracking-widest">NUEVO MARCADOR</span>
              <button onClick={() => setShowModal(false)} className="hover:rotate-90 transition-transform">
                <X size={24}/>
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-5">
              {/* Selector de Torneo */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Torneo / Actividad</label>
                <select 
                  required 
                  className="w-full bg-slate-100 p-4 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-500" 
                  onChange={e => setForm({...form, Actividad: e.target.value})}
                >
                    <option value="">Seleccionar...</option>
                    {actividades.map((a, i) => <option key={i} value={a.Nombre_Actividad}>{a.Nombre_Actividad}</option>)}
                </select>
              </div>

              {/* Inputs de Equipos y Scores */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <input 
                    placeholder="Equipo Local" 
                    className="w-full bg-slate-50 p-4 rounded-xl font-bold border border-slate-200 outline-none focus:ring-2 ring-blue-500/20" 
                    onChange={e => setForm({...form, Local: e.target.value})} 
                  />
                  <input 
                    type="number"
                    placeholder="0"
                    className="w-full bg-slate-900 text-white text-center text-3xl p-4 rounded-xl font-black outline-none"
                    onChange={e => setForm({...form, ScoreL: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <input 
                    placeholder="Equipo Visitante" 
                    className="w-full bg-slate-50 p-4 rounded-xl font-bold border border-slate-200 outline-none focus:ring-2 ring-blue-500/20" 
                    onChange={e => setForm({...form, Visitante: e.target.value})} 
                  />
                  <input 
                    type="number"
                    placeholder="0"
                    className="w-full bg-slate-900 text-white text-center text-3xl p-4 rounded-xl font-black outline-none"
                    onChange={e => setForm({...form, ScoreV: e.target.value})}
                  />
                </div>
              </div>

              <button 
                disabled={enviando} 
                className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-200 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:bg-slate-300"
              >
                {enviando ? <Loader2 className="animate-spin"/> : <Send size={20}/>}
                {enviando ? "PROCESANDO..." : "PUBLICAR RESULTADO"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeccionPartidos;