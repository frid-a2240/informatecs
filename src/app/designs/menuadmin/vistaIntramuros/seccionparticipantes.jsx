"use client"
import React, { useState, useMemo } from 'react';
import { Search, User, Globe, GraduationCap, Users, Trophy } from 'lucide-react';

const SeccionParticipantes = ({ inscripciones }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [filtroGenero, setFiltroGenero] = useState('Todos');

  const participantes = useMemo(() => {
    const mapaUnico = new Map();
    const DOMINIO_INST = "@ite.edu.mx";

    if (!inscripciones) return [];

    inscripciones.forEach(i => {
      const actividadActual = i.Nombre_Actividad || "Sin Actividad";
      const equipoActual = i.Nombre_Equipo || 'Individual';

      // 1. Procesar al Responsable (Capitán)
      if (i.Nombre && i.Nombre.trim() !== "" && i.Nombre !== "N/A") {
        const nombreLimpio = i.Nombre.trim();
        const correo = (i.Email || "").toLowerCase().trim();
        const esInstitucional = correo.endsWith(DOMINIO_INST);
        
        const llave = `${nombreLimpio.toLowerCase()}-${actividadActual.toLowerCase()}`;

        mapaUnico.set(llave, {
          nombre: nombreLimpio,
          actividad: actividadActual,
          equipo: equipoActual,
          tipo: esInstitucional ? 'Alumno ITE' : 'Externo',
          esExterno: !esInstitucional,
          genero: i.Sexo === 'M' ? 'Masculino' : i.Sexo === 'F' ? 'Femenino' : 'N/R',
          rol: equipoActual !== "Individual" ? 'Capitán' : 'Individual'
        });
      }

      // 2. Procesar Integrantes
      if (i.Nombres_Integrantes && i.Nombres_Integrantes !== "N/A") {
        const nombres = i.Nombres_Integrantes.split(/[,/\n]/);
        const correos = (i.Correos_Integrantes || "").split(/[,/\n]/);

        nombres.forEach((nom, index) => {
          let nomTrim = nom.trim();
          if (nomTrim && nomTrim !== "") {
            let generoDetectado = 'N/R';
            if (nomTrim.includes('(M)')) generoDetectado = 'Masculino';
            if (nomTrim.includes('(F)')) generoDetectado = 'Femenino';
            
            const nombreMostrar = nomTrim.replace(/\((M|F)\)/gi, '').trim();
            const correoInt = (correos[index] || "").toLowerCase().trim();
            const esIntInstitucional = correoInt.endsWith(DOMINIO_INST);
            const llaveInt = `${nombreMostrar.toLowerCase()}-${actividadActual.toLowerCase()}`;

            if (!mapaUnico.has(llaveInt)) {
              mapaUnico.set(llaveInt, {
                nombre: nombreMostrar,
                actividad: actividadActual,
                equipo: equipoActual,
                tipo: esIntInstitucional ? 'Alumno ITE' : 'Externo',
                esExterno: !esIntInstitucional,
                genero: generoDetectado,
                rol: 'Integrante'
              });
            }
          }
        });
      }
    });

    return Array.from(mapaUnico.values());
  }, [inscripciones]);

  // Lógica de filtrado combinada
  const filtrados = participantes.filter(p => {
    const busqueda = searchTerm.toLowerCase();
    const coincideTexto = 
      p.nombre.toLowerCase().includes(busqueda) || 
      p.equipo.toLowerCase().includes(busqueda) || 
      p.actividad.toLowerCase().includes(busqueda);
    
    const cumpleTipo = filtroTipo === 'Todos' || 
      (filtroTipo === 'Interno' ? !p.esExterno : p.esExterno);
    
    const cumpleGenero = filtroGenero === 'Todos' || p.genero === filtroGenero;

    return coincideTexto && cumpleTipo && cumpleGenero;
  });

  return (
    <div className="space-y-6">
      {/* SECCIÓN DE CUENTA (STATS) */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-black text-slate-900 leading-none">LISTADO DE PARTICIPANTES</h2>
          <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Base de datos unificada</p>
        </div>
        
        <div className="flex gap-2">
          <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-2xl text-center">
            <p className="text-[10px] font-black text-blue-500 uppercase">Internos ITE</p>
            <p className="text-xl font-black text-blue-700">{filtrados.filter(p => !p.esExterno).length}</p>
          </div>
          <div className="bg-orange-50 border border-orange-100 px-4 py-2 rounded-2xl text-center">
            <p className="text-[10px] font-black text-orange-500 uppercase">Externos</p>
            <p className="text-xl font-black text-orange-700">{filtrados.filter(p => p.esExterno).length}</p>
          </div>
          <div className="bg-slate-900 px-4 py-2 rounded-2xl text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase">Total</p>
            <p className="text-xl font-black text-white">{filtrados.length}</p>
          </div>
        </div>
      </div>

      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
          <input 
            type="text" 
            placeholder="Buscar por Nombre, Equipo o Actividad..." 
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-600 transition-all shadow-sm"
            onChange={e => setSearchTerm(e.target.value)} 
          />
        </div>
        
        <select 
          className="bg-white border-2 border-slate-100 p-3 rounded-2xl font-bold text-slate-600 outline-none focus:border-blue-600 cursor-pointer"
          onChange={(e) => setFiltroTipo(e.target.value)}
        >
          <option value="Todos">Todas las Clasificaciones</option>
          <option value="Interno">Solo Alumnos ITE</option>
          <option value="Externo">Solo Externos</option>
        </select>

        <select 
          className="bg-white border-2 border-slate-100 p-3 rounded-2xl font-bold text-slate-600 outline-none focus:border-blue-600 cursor-pointer"
          onChange={(e) => setFiltroGenero(e.target.value)}
        >
          <option value="Todos">Todos los Géneros</option>
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
        </select>
      </div>

      {/* TABLA DE RESULTADOS */}
      <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-900 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <tr>
                <th className="p-6">Participante</th>
                <th className="p-6">Inscripción y Equipo</th>
                <th className="p-6">Clasificación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtrados.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-6">
                    <div className="flex flex-col">
                      <p className="font-black text-slate-800 uppercase text-sm">{p.nombre}</p>
                      <p className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter italic">{p.rol}</p>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Trophy size={14} className="text-amber-500 shrink-0" />
                        <span className="text-xs font-black uppercase leading-none">{p.actividad}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Users size={12} className="shrink-0" />
                        <span className="text-[10px] font-bold uppercase tracking-tight">
                          {p.equipo === 'Individual' ? 'Participación Individual' : p.equipo}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase w-fit
                        ${p.esExterno ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                        {p.esExterno ? <Globe size={11}/> : <GraduationCap size={11}/>}
                        {p.tipo}
                      </span>
                      <span className="text-[9px] font-black text-slate-400 uppercase ml-1">
                        Género: {p.genero}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filtrados.length === 0 && (
          <div className="p-20 text-center bg-slate-50">
            <p className="text-slate-400 font-black uppercase text-sm tracking-widest">No se encontraron coincidencias</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeccionParticipantes;