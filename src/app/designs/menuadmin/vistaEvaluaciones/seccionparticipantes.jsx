import React, { useState } from 'react';
import { Search, User, Globe, GraduationCap } from 'lucide-react';

const SeccionParticipantes = ({ inscripciones }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const obtenerTodosLosParticipantes = () => {
    const mapaUnico = new Map();
    const DOMINIO_INST = "@ite.edu.mx";

    inscripciones.forEach(i => {
      // 1. Procesar al Responsable (Capitán)
      if (i.Nombre && i.Nombre.trim() !== "" && i.Nombre !== "N/A") {
        const nombreLimpio = i.Nombre.trim();
        const correo = (i.Email || "").toLowerCase().trim();
        const esInstitucional = correo.endsWith(DOMINIO_INST); //

        mapaUnico.set(nombreLimpio.toLowerCase(), {
          nombre: nombreLimpio,
          equipo: i.Nombre_Equipo || 'Individual',
          tipo: esInstitucional ? 'Alumno ITE' : 'Externo', //
          esExterno: !esInstitucional,
          rol: i.Nombre_Equipo && i.Nombre_Equipo !== "Individual" ? 'Capitán' : 'Individual'
        });
      }

      // 2. Procesar Integrantes (como Ivan)
      if (i.Nombres_Integrantes && i.Nombres_Integrantes !== "N/A") {
        const nombres = i.Nombres_Integrantes.split(/[,/\n]/);
        const correos = (i.Correos_Integrantes || "").split(/[,/\n]/); //

        nombres.forEach((nom, index) => {
          const nomTrim = nom.trim();
          if (nomTrim && nomTrim !== "") {
            // Buscamos el correo correspondiente al integrante
            const correoInt = (correos[index] || "").toLowerCase().trim();
            const esIntInstitucional = correoInt.endsWith(DOMINIO_INST); //

            if (!mapaUnico.has(nomTrim.toLowerCase())) {
              mapaUnico.set(nomTrim.toLowerCase(), {
                nombre: nomTrim,
                equipo: i.Nombre_Equipo,
                // Aquí validamos a Ivan: como su correo es gmail, será Externo
                tipo: esIntInstitucional ? 'Alumno ITE' : 'Externo',
                esExterno: !esIntInstitucional,
                rol: 'Integrante'
              });
            }
          }
        });
      }
    });

    return Array.from(mapaUnico.values());
  };

  const participantes = obtenerTodosLosParticipantes();
  const filtrados = participantes.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h2 className="text-2xl font-black text-slate-900">Participantes Detectados</h2>
        <div className="text-right">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Resumen:</span>
          <p className="text-xs font-bold text-blue-600">
            {participantes.filter(p => !p.esExterno).length} Internos | {participantes.filter(p => p.esExterno).length} Externos
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
        <input 
          type="text" 
          placeholder="Buscar por nombre..." 
          className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500"
          onChange={e => setSearchTerm(e.target.value)} 
        />
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
            <tr>
              <th className="p-5">Nombre</th>
              <th className="p-5">Clasificación</th>
              <th className="p-5">Equipo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtrados.map((p, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="p-5 font-black text-slate-700 uppercase">{p.nombre}</td>
                <td className="p-5">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase
                    ${p.esExterno ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                    {p.esExterno ? <Globe size={12}/> : <GraduationCap size={12}/>}
                    {p.tipo}
                  </span>
                </td>
                <td className="p-5 text-xs font-bold text-slate-400 uppercase">{p.equipo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SeccionParticipantes;