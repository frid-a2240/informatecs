"use client"
import React from 'react';
import { Download } from 'lucide-react';

export const StatCard = ({ icon, title, value, subtitle, color }) => {
  const colors = { 
    blue: 'from-blue-500 to-blue-600', 
    green: 'from-green-500 to-green-600', 
    purple: 'from-purple-500 to-purple-600', 
    orange: 'from-orange-500 to-orange-600' 
  };
  return (
    <div className="bg-white rounded-2xl shadow-lg border p-5 hover:shadow-xl transition-all">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colors[color]} shadow-lg text-white`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-slate-500 mb-1">{title}</div>
          <div className="text-3xl font-black text-slate-900">{value}</div>
          <div className="text-xs text-slate-400 font-medium mt-1">{subtitle}</div>
        </div>
      </div>
    </div>
  );
};

export const ReportCard = ({ icon, title, desc, count, color }) => {
  const colors = { 
    blue: 'from-blue-50 to-blue-100 border-blue-200', 
    green: 'from-green-50 to-green-100 border-green-200', 
    purple: 'from-purple-50 to-purple-100 border-purple-200' 
  };
  return (
    <button className={`bg-gradient-to-br ${colors[color]} border-2 rounded-2xl p-6 text-left hover:shadow-lg transition-all w-full`}>
      <div className="flex items-start justify-between mb-4 text-slate-700">{icon}<Download size={20} className="text-slate-400"/></div>
      <h3 className="font-black text-slate-900 text-lg mb-2">{title}</h3>
      <p className="text-sm text-slate-600 mb-3">{desc}</p>
      <div className="text-2xl font-black text-slate-900">{count} registros</div>
    </button>
  );
};