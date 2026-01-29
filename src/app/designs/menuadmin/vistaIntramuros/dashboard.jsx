import React from 'react';
import { Calendar, Swords, Shield, Users, TrendingUp, Clock } from 'lucide-react';
import { StatCard } from './admincards';

const Dashboard = ({ actividades, resultados, inscripciones }) => {
  // 1. Torneos y Partidos
  const torneosAbiertos = actividades?.filter(a => a.Estado?.toLowerCase() === 'abierto').length || 0;
  const torneosCerrados = actividades?.filter(a => a.Estado?.toLowerCase() === 'cerrado').length || 0;
  
  // 2. Invertir resultados para ver los más recientes arriba
  const resultadosRecientes = [...(resultados || [])].reverse();

  // 3. Conteo Preciso de Participantes (Capitanes + Integrantes)
  const obtenerTotalParticipantes = () => {
    const setUnico = new Set();
    inscripciones?.forEach(i => {
      if (i.Nombre && i.Nombre !== "N/A") setUnico.add(i.Nombre.trim().toLowerCase());
      if (i.Nombres_Integrantes && i.Nombres_Integrantes !== "N/A") {
        i.Nombres_Integrantes.split(/[,/\n]/).forEach(nom => {
          const limpio = nom.replace(/\((M|F)\)/gi, '').trim().toLowerCase();
          if (limpio && limpio !== "n/a") setUnico.add(limpio);
        });
      }
    });
    return setUnico.size;
  };

  const equiposUnicos = [...new Set(
    inscripciones?.filter(i => i.Nombre_Equipo && i.Nombre_Equipo !== "Individual" && i.Nombre_Equipo !== "N/A")
      .map(i => i.Nombre_Equipo.trim().toLowerCase())
  )].length;

  // 4. Deportes Populares
  const deportesCont = {};
  actividades?.forEach(a => { 
    const d = a.Deporte_o_Area || 'Otro'; 
    deportesCont[d] = (deportesCont[d] || 0) + 1; 
  });
  const topDeportes = Object.entries(deportesCont).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">ESTADÍSTICAS</h2>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Resumen de actividad en tiempo real</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Calendar size={28}/>} title="Torneos Activos" value={torneosAbiertos} subtitle={`${torneosCerrados} cerrados`} color="blue" />
        <StatCard icon={<Swords size={28}/>} title="Partidos" value={resultados.length} subtitle="Resultados cargados" color="green" />
        <StatCard icon={<Shield size={28}/>} title="Equipos" value={equiposUnicos} subtitle="Inscritos" color="purple" />
        <StatCard icon={<Users size={28}/>} title="Atletas" value={obtenerTotalParticipantes()} subtitle="Personas únicas" color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Deportes */}
        <div className="bg-white rounded-[2rem] shadow-xl border p-6">
          <h3 className="text-sm font-black text-slate-400 mb-6 flex items-center gap-2 uppercase tracking-widest">
            <TrendingUp size={16}/> Popularidad por Deporte
          </h3>
          <div className="space-y-5">
            {topDeportes.map(([deporte, count], idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-black text-slate-700 text-xs uppercase">{deporte}</span>
                  <span className="text-xs font-black text-blue-600">{count}</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{width: `${(count / (actividades?.length || 1)) * 100}%`}} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Últimos Resultados Corregidos */}
        <div className="bg-white rounded-[2rem] shadow-xl border p-6">
          <h3 className="text-sm font-black text-slate-400 mb-6 flex items-center gap-2 uppercase tracking-widest">
            <Clock size={16}/> Cronología de Resultados
          </h3>
          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2">
            {resultadosRecientes.length > 0 ? (
              resultadosRecientes.slice(0, 8).map((res, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border-l-4 border-slate-900 shadow-sm">
                  <div className="flex-1">
                    <p className="text-[9px] font-black text-blue-600 uppercase tracking-tighter mb-1">
                      {res.Actividad || "Torneo"}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-700 uppercase">{res["Equipo_Local"]}</span>
                      <span className="text-[10px] font-bold text-slate-300">VS</span>
                      <span className="text-xs font-black text-slate-700 uppercase">{res["Equipo_Visitante"]}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="bg-slate-900 text-white px-3 py-1.5 rounded-xl font-mono font-black text-sm ring-4 ring-slate-100">
                      {res.Marcador || "0-0"}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-slate-400 font-bold italic">No hay resultados que mostrar</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;