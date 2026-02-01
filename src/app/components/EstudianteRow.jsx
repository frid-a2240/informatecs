"use client";
import { FileText } from "lucide-react";

export const EstudianteRow = ({ est, onSelect }) => (
  <tr className="hover:bg-gray-50 transition-colors border-b last:border-0">
    <td className="px-6 py-4 text-sm font-medium">{est.aluctr}</td>
    <td className="px-6 py-4 text-sm">{`${est.alunom} ${est.aluapp}`}</td>
    <td className="px-6 py-4 text-center">
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
        est.apto ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
      }`}>
        {est.apto ? '✅ Aprobado' : '⏳ Pendiente'}
      </span>
    </td>
    <td className="px-6 py-4 text-center">
      <button 
        onClick={onSelect}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto transition-all active:scale-95"
      >
        <FileText size={16} /> Generar
      </button>
    </td>
  </tr>
);