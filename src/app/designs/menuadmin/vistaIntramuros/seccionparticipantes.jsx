"use client";

import React, { useState, useMemo } from 'react';
import { Search, Printer, Users, User, UserPlus } from 'lucide-react';

const SeccionParticipantes = ({ inscripciones }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [filtroGenero, setFiltroGenero] = useState('Todos');

  const { filtrados, estadisticas } = useMemo(() => {
    const mapaUnico = new Map();
    const DOMINIO_INST = "@ite.edu.mx";
    if (!inscripciones) return { filtrados: [], estadisticas: {} };

    inscripciones.forEach(i => {
      const actividadActual = i.Nombre_Actividad || "Sin Actividad";
      const equipoActual = i.Nombre_Equipo || 'Individual';

      const procesarPersona = (nombre, correo, sexo, esCapitan) => {
        if (!nombre || nombre.trim() === "" || nombre === "N/A" || nombre === "NOMBRE") return;
        const nombreLimpio = nombre.replace(/\((M|F)\)/gi, '').trim();
        const gen = sexo === 'M' || nombre.includes('(M)') ? 'M' : 
                    sexo === 'F' || nombre.includes('(F)') ? 'F' : 'N/R';
        const esInst = (correo || "").toLowerCase().endsWith(DOMINIO_INST);
        
        const llave = `${nombreLimpio.toLowerCase()}-${actividadActual.toLowerCase()}`;
        if (!mapaUnico.has(llave)) {
          mapaUnico.set(llave, {
            nombre: nombreLimpio,
            actividad: actividadActual,
            equipo: equipoActual,
            tipo: esInst ? 'ITE' : 'EXT',
            esExterno: !esInst,
            genero: gen,
            rol: esCapitan ? (equipoActual !== "Individual" ? 'Capitán' : 'Individual') : 'Integrante'
          });
        }
      };

      procesarPersona(i.Nombre, i.Email, i.Sexo, true);
      if (i.Nombres_Integrantes && i.Nombres_Integrantes !== "N/A") {
        i.Nombres_Integrantes.split(/[,/\n]/).forEach(nom => procesarPersona(nom, "", "", false));
      }
    });

    const listado = Array.from(mapaUnico.values()).filter(p => {
      const busqueda = searchTerm.toLowerCase();
      const coincide = p.nombre.toLowerCase().includes(busqueda) || p.equipo.toLowerCase().includes(busqueda) || p.actividad.toLowerCase().includes(busqueda);
      const cumpleTipo = filtroTipo === 'Todos' || (filtroTipo === 'Interno' ? !p.esExterno : p.esExterno);
      const cumpleGen = filtroGenero === 'Todos' || p.genero === filtroGenero;
      return coincide && cumpleTipo && cumpleGen;
    });

    return {
      filtrados: listado,
      estadisticas: {
        total: listado.length,
        h: listado.filter(p => p.genero === 'M').length,
        m: listado.filter(p => p.genero === 'F').length,
        ite: listado.filter(p => !p.esExterno).length,
        ext: listado.filter(p => p.esExterno).length
      }
    };
  }, [inscripciones, searchTerm, filtroTipo, filtroGenero]);

  return (
    <div className="w-full space-y-4">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          nav, header, aside, .no-print, [role="navigation"], .dashboard-header, button { 
            display: none !important; 
          }
          @page { size: letter; margin: 1cm; }
          body { background: white !important; margin: 0 !important; padding: 0 !important; }
          .print-container { width: 100% !important; border: none !important; box-shadow: none !important; margin: 0 !important; }
          table { width: 100% !important; border-collapse: collapse !important; table-layout: fixed !important; }
          th, td { border: 1pt solid black !important; padding: 8px 5px !important; color: black !important; word-wrap: break-word !important; }
          th { background-color: #f2f2f2 !important; font-size: 9pt !important; font-weight: bold !important; text-transform: uppercase; }
          td { font-size: 8.5pt !important; }
          .col-n { width: 30px; text-align: center !important; }
          .col-nombre { width: 35%; }
          .col-act { width: 25%; }
          .col-equipo { width: 20%; }
          .col-g { width: 35px; text-align: center !important; }
          .col-firma { width: 70px; }
          .print-only { display: block !important; }
        }
        .print-only { display: none; }
      `}} />

      {/* ENCABEZADO PDF */}
      <div className="print-only text-center border-b-2 border-black pb-4 mb-6">
        <h1 className="text-xl font-bold uppercase underline">Cédula de Registro y Control de Asistencia</h1>
        <p className="text-[10px] font-medium mt-1">Instituto Tecnológico - Departamento de Deportes y Cultura</p>
        <div className="flex justify-between mt-4 text-[9px] font-black uppercase">
          <span>Hombres: {estadisticas.h} | Mujeres: {estadisticas.m}</span>
          <span>ITE: {estadisticas.ite} | Externos: {estadisticas.ext}</span>
          <span className="text-sm">Total: {estadisticas.total} Registros</span>
        </div>
      </div>

      {/* BARRA DE FILTROS (OCULTA EN PDF) */}
      <div className="no-print bg-white p-6 rounded-[2.5rem] border shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
          <input 
            type="text" 
            placeholder="Buscar por nombre o torneo..." 
            className="w-full pl-12 pr-4 py-2 bg-slate-50 rounded-xl font-bold outline-none border-2 border-transparent focus:border-slate-200"
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select className="bg-slate-50 p-2 rounded-xl font-bold text-xs flex-1" onChange={e => setFiltroTipo(e.target.value)}>
            <option value="Todos">ITE / EXT</option>
            <option value="Interno">Solo ITE</option>
            <option value="Externo">Solo Externos</option>
          </select>
          <select className="bg-slate-50 p-2 rounded-xl font-bold text-xs flex-1" onChange={e => setFiltroGenero(e.target.value)}>
            <option value="Todos">Género</option>
            <option value="M">Masc</option>
            <option value="F">Fem</option>
          </select>
          <button onClick={() => window.print()} className="bg-slate-900 text-white px-6 py-2 rounded-xl font-black flex items-center gap-2 shadow-lg">
            <Printer size={16}/> IMPRIMIR
          </button>
        </div>
      </div>

      {/* TARJETAS DE TOTALES (SOLO WEB) */}
      <div className="no-print grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
          <span className="text-[10px] font-black text-slate-400 uppercase">Total</span>
          <span className="text-xl font-black text-slate-900">{estadisticas.total}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
          <span className="text-[10px] font-black text-blue-500 uppercase">Hombres</span>
          <span className="text-xl font-black text-slate-900">{estadisticas.h}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
          <span className="text-[10px] font-black text-pink-500 uppercase">Mujeres</span>
          <span className="text-xl font-black text-slate-900">{estadisticas.m}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center border-l-4 border-l-blue-600">
          <span className="text-[10px] font-black text-slate-400 uppercase">Alumnos ITE</span>
          <span className="text-xl font-black text-slate-900">{estadisticas.ite}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center border-l-4 border-l-orange-500">
          <span className="text-[10px] font-black text-slate-400 uppercase">Externos</span>
          <span className="text-xl font-black text-slate-900">{estadisticas.ext}</span>
        </div>
      </div>

      {/* TABLA DE RESULTADOS */}
      <div className="bg-white rounded-2xl border shadow-lg overflow-hidden print-container">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="col-n print-only">#</th>
              <th className="col-nombre p-4 border-none">Nombre del Atleta</th>
              <th className="col-act p-4 border-none">Actividad / Deporte</th>
              <th className="col-equipo p-4 border-none">Equipo / Rol</th>
              <th className="col-g print-only">G</th>
              <th className="col-firma p-4 border-none text-center">Firma</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtrados.map((p, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="col-n print-only font-bold text-slate-400 text-center">{idx + 1}</td>
                <td className="p-4 font-bold uppercase text-slate-800">{p.nombre}</td>
                <td className="p-4 text-xs font-medium text-slate-600 uppercase">{p.actividad}</td>
                <td className="p-4">
                  <div className="flex flex-col leading-tight">
                    <span className="text-[10px] font-black uppercase text-slate-700">{p.equipo}</span>
                    <span className="text-[8px] font-bold text-slate-400 italic uppercase">{p.rol}</span>
                  </div>
                </td>
                <td className="col-g print-only font-bold text-center">{p.genero}</td>
                <td className="p-4"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PIE DE PÁGINA DE FIRMAS (SOLO PDF) */}
      <div className="print-only mt-32 grid grid-cols-2 gap-20 px-20 text-center">
        <div className="border-t-2 border-black pt-2 uppercase font-black text-[9px] tracking-widest">Firma Responsable</div>
        <div className="border-t-2 border-black pt-2 uppercase font-black text-[9px] tracking-widest">Sello de Institución</div>
      </div>
    </div>
  );
};

export default SeccionParticipantes;