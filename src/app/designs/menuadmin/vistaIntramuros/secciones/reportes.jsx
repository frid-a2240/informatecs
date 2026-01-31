"use client";
import React from 'react';
import { Calendar, Swords, Users, Globe, GraduationCap } from 'lucide-react';
import { ReportCard } from '../ componentes/admincards';

const SeccionReportes = ({ actividades, resultados, inscripciones }) => {
  
  // 1. Lógica para contar a TODAS las personas reales (Capitanes + Integrantes)
  const calcularMetricasReales = () => {
    const nombresUnicos = new Set();
    let internos = 0;
    let externos = 0;
    const DOMINIO_INST = "@ite.edu.mx";

    inscripciones.forEach(i => {
      // A. Contar al que se registró (Capitán o Individual)
      if (i.Nombre && i.Nombre.trim() !== "") {
        const nombreLimpio = i.Nombre.trim().toLowerCase();
        if (!nombresUnicos.has(nombreLimpio)) {
          nombresUnicos.add(nombreLimpio);
          const esInst = (i.Email || "").toLowerCase().endsWith(DOMINIO_INST);
          esInst ? internos++ : externos++;
        }
      }

      // B. Contar a los integrantes de la lista
      if (i.Nombres_Integrantes && i.Nombres_Integrantes !== "N/A") {
        const nombresExtra = i.Nombres_Integrantes.split(/[,/\n]/);
        const correosExtra = (i.Correos_Integrantes || "").split(/[,/\n]/);

        nombresExtra.forEach((nom, index) => {
          const nomTrim = nom.trim();
          if (nomTrim && nomTrim !== "" && !nombresUnicos.has(nomTrim.toLowerCase())) {
            nombresUnicos.add(nomTrim.toLowerCase());
            
            // Validamos el correo del integrante (como el caso de Ivan)
            const correoInt = (correosExtra[index] || "").toLowerCase().trim();
            const esInstInt = correoInt.endsWith(DOMINIO_INST);
            esInstInt ? internos++ : externos++;
          }
        });
      }
    });

    return {
      totalReal: nombresUnicos.size,
      internos,
      externos
    };
  };

  const metricas = calcularMetricasReales();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Centro de Reportes</h2>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest italic">Datos procesados individualmente</p>
        </div>
      </div>

      {/* Fila Principal de Conteos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ReportCard
          icon={<Calendar size={32}/>} 
          title="Torneos" 
          desc="Disciplinas abiertas" 
          count={actividades.length} 
          color="blue" 
        />
        <ReportCard 
          icon={<Swords size={32}/>} 
          title="Partidos" 
          desc="Resultados en tabla" 
          count={resultados.length} 
          color="green" 
        />
        <ReportCard 
          icon={<Users size={32}/>} 
          title="Personas Totales" 
          desc="Capitanes + Miembros" 
          count={metricas.totalReal} // <--- ESTE ES EL TOTAL REAL
          color="purple" 
        />
      </div>

      {/* Desglose de Población */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-500 transition-all">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap size={32} />
            </div>
            <div>
              <p className="text-3xl font-black text-slate-800">{metricas.internos}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Estudiantes ITE</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-2 py-1 rounded">
              {metricas.totalReal > 0 ? Math.round((metricas.internos / metricas.totalReal) * 100) : 0}%
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-orange-500 transition-all">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Globe size={32} />
            </div>
            <div>
              <p className="text-3xl font-black text-slate-800">{metricas.externos}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Invitados Externos</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black bg-orange-100 text-orange-700 px-2 py-1 rounded">
              {metricas.totalReal > 0 ? Math.round((metricas.externos / metricas.totalReal) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeccionReportes;