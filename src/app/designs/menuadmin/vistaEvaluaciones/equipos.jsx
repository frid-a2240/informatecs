import React, { useState } from 'react';
import { Search, Shield, Users } from 'lucide-react';

const SeccionEquipos = ({ inscripciones, actividades }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');

  // 1. Agrupamos los equipos y filtramos duplicados
  const equiposMap = {};
  
  inscripciones
    .filter(i => i.Nombre_Equipo && i.Nombre_Equipo !== "Individual")
    .forEach(i => {
      const key = `${i.Nombre_Equipo}_${i.ID_Actividad}`.toLowerCase().trim();
      
      if (!equiposMap[key]) {
        const actividadInfo = actividades.find(a => String(a.ID_Actividad) === String(i.ID_Actividad));
        equiposMap[key] = { 
          nombre: i.Nombre_Equipo, 
          actividadNombre: actividadInfo ? actividadInfo.Nombre_Actividad : "Actividad " + i.ID_Actividad,
          idActividad: i.ID_Actividad,
          integrantes: [],
          // Usamos un Set temporal para evitar nombres repetidos
          nombresUnicos: new Set() 
        };
      }

      // Función auxiliar para agregar nombres sin repetir
      const agregarNombre = (nombreStr, esResponsable = false) => {
        if (!nombreStr || nombreStr === "N/A" || nombreStr === "ninguna") return;
        
        // Limpiamos el nombre para comparar (quitar espacios y pasar a minúsculas)
        const nombreLimpio = nombreStr.trim().toLowerCase();
        
        if (!equiposMap[key].nombresUnicos.has(nombreLimpio)) {
          equiposMap[key].nombresUnicos.add(nombreLimpio);
          equiposMap[key].integrantes.push({ 
            nombre: nombreStr.trim(), 
            rol: esResponsable ? 'Responsable' : 'Integrante' 
          });
        }
      };

      // Intentamos agregar desde todas las columnas posibles donde hay nombres
      agregarNombre(i.Nombre, true); // El que registra (Prioridad como Responsable)
      agregarNombre(i.Responsable, false); 
      
      // Procesamos la lista de integrantes adicionales
      if (i.Nombres_Integrantes) {
        const lista = i.Nombres_Integrantes.split(/[,/\n]/); // Separa por coma, diagonal o salto de línea
        lista.forEach(n => agregarNombre(n, false));
      }
    });

  let equipos = Object.values(equiposMap);

  // Filtros de búsqueda
  if (searchTerm) {
    equipos = equipos.filter(e => e.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
  }
  if (selectedActivity) {
    equipos = equipos.filter(e => String(e.idActividad) === String(selectedActivity));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 italic tracking-tight">Equipos Registrados</h2>
          <p className="text-slate-500 font-medium">Total: {equipos.length} escuadras</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
            <input 
              type="text" 
              placeholder="Buscar equipo..." 
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold outline-none focus:border-purple-500 w-full sm:w-64 transition-all" 
              onChange={e => setSearchTerm(e.target.value)} 
            />
          </div>
          <select 
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold outline-none focus:border-purple-500 transition-all cursor-pointer" 
            onChange={e => setSelectedActivity(e.target.value)}
          >
            <option value="">Todas las disciplinas</option>
            {actividades.map((a, idx) => (
              <option key={idx} value={a.ID_Actividad}>{a.Nombre_Actividad}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipos.map((equipo, idx) => (
          <div key={idx} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-purple-500/5 transition-all group">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200 group-hover:scale-110 transition-transform">
                  <Shield size={28} fill="currentColor" fillOpacity={0.2}/>
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-xl leading-none mb-1">{equipo.nombre}</h3>
                  <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md font-black uppercase tracking-wider">
                    {equipo.actividadNombre}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Plantilla Oficial</span>
                  <Users size={14}/>
                </div>
                
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
                  {equipo.integrantes.map((int, i) => (
                    <div key={i} className="flex items-center justify-between group/name">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${int.rol === 'Responsable' ? 'bg-purple-600 scale-125' : 'bg-slate-300'}`}/>
                        <span className={`text-sm ${int.rol === 'Responsable' ? 'font-black text-slate-800' : 'text-slate-600 font-medium'}`}>
                          {int.nombre}
                        </span>
                      </div>
                      {int.rol === 'Responsable' && (
                        <span className="text-[9px] font-black text-purple-600 uppercase italic">Capitán</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeccionEquipos;