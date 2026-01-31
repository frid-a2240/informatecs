import React, { useState } from 'react';
import { Award, Shield, TrendingUp, Medal } from 'lucide-react';

const SeccionRankings = ({ resultados, actividades }) => {
  const [selectedTorneo, setSelectedTorneo] = useState('');

  // Obtenemos la lista única de torneos basada en los resultados existentes
  const torneosExistentes = [...new Set(resultados.map(r => r.Actividad))].filter(Boolean);

  const stats = {};

  // Procesamiento de estadísticas
  resultados.forEach(res => {
    // Filtro por torneo seleccionado
    if (selectedTorneo && res.Actividad !== selectedTorneo) return;

    // Mapeo defensivo de nombres de equipos
    const local = res["Equipo Local"] || res.Equipo_Local || res.Local;
    const visitante = res["Equipo Visitante"] || res.Equipo_Visitante || res.Visitante;
    const ganador = res.Ganador;

    if (!local || !visitante) return;

    // Inicializar estadísticas si el equipo no existe en el objeto
    [local, visitante].forEach(eq => {
      if (!stats[eq]) {
        stats[eq] = { nombre: eq, pj: 0, v: 0, e: 0, d: 0, pts: 0 };
      }
    });

    // Sumar Partidos Jugados
    stats[local].pj++;
    stats[visitante].pj++;

    // Lógica de puntos y resultados
    if (ganador === 'Empate' || ganador === 'empate') {
      stats[local].e++;
      stats[visitante].e++;
      stats[local].pts += 1;
      stats[visitante].pts += 1;
    } else if (ganador === local) {
      stats[local].v++;
      stats[visitante].d++;
      stats[local].pts += 3;
    } else if (ganador === visitante) {
      stats[visitante].v++;
      stats[local].d++;
      stats[visitante].pts += 3;
    }
  });

  // Convertir a array y ordenar (1. Puntos, 2. Victorias)
  const ranking = Object.values(stats).sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    return b.v - a.v;
  });

  // Función para renderizar el icono de posición
  const renderPos = (idx) => {
    if (idx === 0) return <Medal size={20} className="text-yellow-500" />;
    if (idx === 1) return <Medal size={20} className="text-slate-400" />;
    if (idx === 2) return <Medal size={20} className="text-amber-600" />;
    return <span className="text-slate-400 font-bold">{idx + 1}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header con Filtro */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <TrendingUp className="text-blue-600" />
            Tabla de Posiciones
          </h2>
          <p className="text-slate-500 text-sm font-medium">Clasificación en tiempo real basada en resultados</p>
        </div>
        
        <select 
          className="w-full md:w-64 p-3 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:border-blue-500 transition-all cursor-pointer"
          onChange={e => setSelectedTorneo(e.target.value)}
        >
          <option value="">🏆 Todos los torneos</option>
          {torneosExistentes.map((t, i) => (
            <option key={i} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Tabla Pro */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-black uppercase tracking-widest text-[10px]">
                <th className="p-5 text-center w-20">Rango</th>
                <th className="p-5">Club / Equipo</th>
                <th className="p-5 text-center">PJ</th>
                <th className="p-5 text-center text-green-400">V</th>
                <th className="p-5 text-center text-yellow-400">E</th>
                <th className="p-5 text-center text-red-400">D</th>
                <th className="p-5 text-center bg-blue-700">Total PTS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {ranking.length > 0 ? (
                ranking.map((eq, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/50 transition-colors group">
                    <td className="p-5 text-center flex justify-center items-center">
                      {renderPos(idx)}
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-100 transition-all">
                          <Shield size={20} />
                        </div>
                        <span className="font-black text-slate-700 text-base">{eq.nombre}</span>
                      </div>
                    </td>
                    <td className="p-5 text-center font-bold text-slate-500">{eq.pj}</td>
                    <td className="p-5 text-center font-bold text-slate-700">{eq.v}</td>
                    <td className="p-5 text-center font-bold text-slate-400">{eq.e}</td>
                    <td className="p-5 text-center font-bold text-slate-400">{eq.d}</td>
                    <td className="p-5 text-center">
                      <span className="bg-blue-600 text-white px-5 py-2 rounded-xl font-black text-lg shadow-lg shadow-blue-100">
                        {eq.pts}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-20 text-center text-slate-400 font-bold">
                    No hay resultados registrados para este torneo aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leyenda rápida */}
      <div className="flex gap-6 px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-slate-400 rounded-full"/> PJ: Partidos Jugados</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-green-400 rounded-full"/> V: Victorias (3 pts)</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-yellow-400 rounded-full"/> E: Empates (1 pt)</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-400 rounded-full"/> D: Derrotas (0 pts)</div>
      </div>
    </div>
  );
};

export default SeccionRankings;
