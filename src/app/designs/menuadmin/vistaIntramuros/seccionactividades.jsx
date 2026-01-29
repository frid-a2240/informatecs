import React from 'react';
import { Plus, MapPin, Edit } from 'lucide-react';

const SectionActividades = ({ data, inscripciones, onEdit, onNew }) => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div><h2 className="text-2xl sm:text-3xl font-black text-slate-900">Torneos Activos</h2><p className="text-slate-500 mt-1">{data.length} torneos registrados</p></div>
      <button onClick={onNew} className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg font-bold hover:bg-blue-700 transition-colors"><Plus size={20}/> Nueva Actividad</button>
    </div>
    <div className="bg-white rounded-2xl shadow-xl border overflow-hidden overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b"><tr className="text-xs font-black text-slate-400 uppercase"><th className="p-5">Actividad</th><th className="p-5 text-center">Estado</th><th className="p-5 text-center">Equipos</th><th className="p-5 text-center">Acciones</th></tr></thead>
        <tbody className="divide-y text-sm">
          {data.map((act, idx) => {
            const numEq = [...new Set(inscripciones.filter(i => i.ID_Actividad?.toString() === act.ID_Actividad?.toString() && i.Nombre_Equipo !== "Individual").map(i => i.Nombre_Equipo?.toLowerCase().trim()))].length;
            return (
              <tr key={idx} className="hover:bg-blue-50/40">
                <td className="p-5"><div className="font-bold text-slate-700 uppercase">{act.Nombre_Actividad}</div><div className="text-xs text-slate-400 flex items-center gap-1 mt-1"><MapPin size={12}/> {act.Lugar_Sede}</div></td>
                <td className="p-5 text-center"><span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${act.Estado?.toLowerCase() === 'abierto' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>{act.Estado}</span></td>
                <td className="p-5 text-center"><div className="text-lg font-black text-blue-600">{numEq} / {act.Capacidad_Maxima}</div></td>
                <td className="p-5 text-center"><button onClick={() => onEdit(act)} className="p-2 text-slate-400 hover:text-blue-600 hover:scale-110 transition-all"><Edit size={20}/></button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);
export default SectionActividades;