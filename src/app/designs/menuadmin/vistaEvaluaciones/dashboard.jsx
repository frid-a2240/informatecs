import React from 'react';
import { Calendar, Swords, Shield, Users, TrendingUp, Clock, Filter, Download, AlertCircle } from 'lucide-react';
import { StatCard } from './admincards';


const Dashboard = ({ actividades, resultados, inscripciones }) => {
  const torneosAbiertos = actividades.filter(a => a.Estado?.toLowerCase() === 'abierto').length;
  const torneosCerrados = actividades.filter(a => a.Estado?.toLowerCase() === 'cerrado').length;
  const totalPartidos = resultados.length;
  const equiposUnicos = [...new Set(inscripciones.filter(i => i.Nombre_Equipo && i.Nombre_Equipo !== "Individual").map(i => i.Nombre_Equipo?.toLowerCase().trim()))].length;
  const participantesUnicos = [...new Set(inscripciones.filter(i => i.Nombre_Completo).map(i => i.Nombre_Completo?.toLowerCase().trim()))].length;

  const deportesCont = {};
  actividades.forEach(a => { const d = a.Deporte_o_Area || 'Otro'; deportesCont[d] = (deportesCont[d] || 0) + 1; });
  const topDeportes = Object.entries(deportesCont).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Dashboard General</h2>
          <p className="text-slate-500 mt-1">Resumen de actividades y estadísticas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Calendar size={28}/>} title="Torneos Activos" value={torneosAbiertos} subtitle={`${torneosCerrados} cerrados`} color="blue" />
        <StatCard icon={<Swords size={28}/>} title="Partidos Jugados" value={totalPartidos} subtitle="Total registrados" color="green" />
        <StatCard icon={<Shield size={28}/>} title="Equipos Registrados" value={equiposUnicos} subtitle="Únicos en el sistema" color="purple" />
        <StatCard icon={<Users size={28}/>} title="Participantes" value={participantesUnicos} subtitle="Personas únicas" color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border p-6">
          <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2"><TrendingUp size={20} className="text-blue-600"/> Deportes Populares</h3>
          <div className="space-y-3">
            {topDeportes.map(([deporte, count], idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-black text-sm">{idx + 1}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-700">{deporte}</span>
                    <span className="text-sm font-bold text-slate-500">{count}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{width: `${(count / actividades.length) * 100}%`}} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border p-6">
          <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2"><Clock size={20} className="text-green-600"/> Últimos Resultados</h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {resultados.slice(0, 5).map((res, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex-1">
                  <div className="text-xs text-slate-400 font-bold">{res.Actividad}</div>
                  <div className="text-sm font-bold text-slate-700">{res["Equipo Local"]} vs {res["Equipo Visitante"]}</div>
                </div>
                <div className="text-center">
                  <div className="bg-slate-900 text-white px-3 py-1 rounded-lg font-mono font-black text-sm">{res.Marcador}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;