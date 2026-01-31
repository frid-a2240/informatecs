"use client";

import React, { useState } from 'react';
import { Search, Shield, Users, Trophy, Printer, FileText } from 'lucide-react';

const SeccionEquipos = ({ inscripciones, actividades }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');

  // 1. Agrupamos los equipos y filtramos duplicados
  const equiposMap = {};
  
  inscripciones
    .filter(i => i.Nombre_Equipo && i.Nombre_Equipo !== "Individual" && i.Nombre_Equipo !== "N/A")
    .forEach(i => {
      const actividadInfo = actividades.find(a => String(a.ID_Actividad) === String(i.ID_Actividad));
      const nombreActividad = actividadInfo ? actividadInfo.Nombre_Actividad : "Actividad " + i.ID_Actividad;
      const key = `${i.Nombre_Equipo}_${nombreActividad}`.toLowerCase().trim();
      
      if (!equiposMap[key]) {
        equiposMap[key] = { 
          nombre: i.Nombre_Equipo, 
          actividadNombre: nombreActividad,
          idActividad: i.ID_Actividad,
          integrantes: [],
          nombresUnicos: new Set() 
        };
      }

      const agregarNombre = (nombreStr, esResponsable = false) => {
        if (!nombreStr || nombreStr === "N/A") return;
        const nombreLimpio = nombreStr.replace(/\((M|F)\)/gi, '').trim();
        const comparacion = nombreLimpio.toLowerCase();
        
        if (!equiposMap[key].nombresUnicos.has(comparacion)) {
          equiposMap[key].nombresUnicos.add(comparacion);
          equiposMap[key].integrantes.push({ nombre: nombreLimpio, rol: esResponsable ? 'Capitán' : 'Integrante' });
        }
      };

      agregarNombre(i.Nombre, true); 
      if (i.Nombres_Integrantes && i.Nombres_Integrantes !== "N/A") {
        i.Nombres_Integrantes.split(/[,/\n]/).forEach(n => agregarNombre(n, false));
      }
    });

  let equipos = Object.values(equiposMap);

  if (searchTerm) {
    equipos = equipos.filter(e => e.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
  }
  if (selectedActivity) {
    equipos = equipos.filter(e => String(e.idActividad) === String(selectedActivity));
  }

  // FUNCIÓN PARA IMPRIMIR PDF
  const imprimirPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* ESTILOS EXCLUSIVOS PARA IMPRESIÓN PDF */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { size: letter; margin: 1cm; }
          body { background: white !important; }
          .no-print { display: none !important; }
          .print-container { display: block !important; width: 100% !important; }
          .card-equipo { 
            break-inside: avoid; 
            border: 1px solid #e2e8f0 !important; 
            box-shadow: none !important; 
            margin-bottom: 20px !important;
            border-radius: 12px !important;
          }
          .grid-equipos { display: block !important; }
          .bg-purple-600 { background-color: #7c3aed !important; -webkit-print-color-adjust: exact; }
          .text-white { color: white !important; }
        }
      `}} />

      {/* HEADER (OCULTO EN PDF) */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 no-print">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Equipos</h2>
          <div className="flex gap-2 mt-2">
            <button 
              onClick={imprimirPDF}
              className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-slate-700 transition-all shadow-lg"
            >
              <Printer size={16}/> IMPRIMIR PDF
            </button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="pl-4 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-purple-500 w-full sm:w-64" 
            onChange={e => setSearchTerm(e.target.value)} 
          />
          <select 
            className="px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-600 outline-none cursor-pointer" 
            onChange={e => setSelectedActivity(e.target.value)}
          >
            <option value="">Todas las disciplinas</option>
            {actividades.map((a, idx) => (
              <option key={idx} value={a.ID_Actividad}>{a.Nombre_Actividad}</option>
            ))}
          </select>
        </div>
      </div>

      {/* CONTENEDOR DE EQUIPOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 grid-equipos">
        {equipos.map((equipo, idx) => (
          <div key={idx} className="bg-white rounded-[2rem] shadow-md border border-slate-100 overflow-hidden card-equipo">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-xl flex items-center justify-center no-print">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg uppercase leading-none">{equipo.nombre}</h3>
                  <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest">{equipo.actividadNombre}</p>
                </div>
              </div>

              <div className="space-y-2 border-t pt-4">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Plantilla Oficial</p>
                {equipo.integrantes.map((int, i) => (
                  <div key={i} className="flex justify-between items-center py-1 border-b border-slate-50 last:border-0">
                    <span className={`text-xs ${int.rol === 'Capitán' ? 'font-black text-slate-800' : 'font-medium text-slate-600'}`}>
                      {int.rol === 'Capitán' ? '⭐ ' : '• '}{int.nombre}
                    </span>
                    {int.rol === 'Capitán' && <span className="text-[8px] font-black text-purple-600 uppercase">Capitán</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeccionEquipos;