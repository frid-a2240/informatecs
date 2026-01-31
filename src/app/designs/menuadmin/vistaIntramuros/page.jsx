
"use client";
import React, { useState, useEffect } from 'react';
import { 
  Trophy, RefreshCw, BarChart3, Calendar, Swords, Shield, Award, 
  Users, FileText, Plus 
} from 'lucide-react';

// Importamos las secciones (asumiendo que las moviste a archivos propios)

import SeccionPartidos from './secciones/seccionpartidos';
import SeccionEquipos from './secciones/equipos';
import SeccionRankings from './secciones/seccionracking';
import SeccionParticipantes from './secciones/seccionparticipantes';
import SeccionReportes from './secciones/reportes';
import AdminPublicador from './ componentes/intramurospublicador';
import SectionActividades from './secciones/seccionactividades';
import Dashboard from './ componentes/dashboard';

const WEB_APP_URL = "/api/intramuros";

const IntramurosPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    actividades: [],
    resultados: [],
    inscripciones: []
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  useEffect(() => { loadAllData(); }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const fetchPath = (h) => fetch(`${WEB_APP_URL}?hoja=${h}`).then(r => r.json());
      const [actData, resData, inscribe, externos, inst] = await Promise.all([
        fetchPath('lista'), fetchPath('partidos'), fetchPath('inscribe'), 
        fetchPath('inscribe_externos'), fetchPath('inscribe_institucional')
      ]);
      
      setData({
        actividades: actData.data || [],
        resultados: resData.data || [],
        inscripciones: [...(inscribe.data || []), ...(externos.data || []), ...(inst.data || [])]
      });
    } catch (e) { console.error("Error:", e); }
    setLoading(false);
  };

  const siguienteID = data.actividades.length > 0 
    ? Math.max(...data.actividades.map(a => parseInt(a.ID_Actividad || 0))) + 1 
    : 1;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
    
      <header className="bg-white border-b p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg">
            <Trophy size={28} className="text-white" />
          </div>
          <h1 className="text-xl font-black">PANEL ADMIN ITE</h1>
        </div>
        <button onClick={loadAllData} className={`p-3 rounded-xl bg-slate-100 ${loading ? 'animate-spin' : ''}`}>
          <RefreshCw size={20} />
        </button>
      </header>

    
      <nav className="bg-white border-b flex gap-1 px-4 overflow-x-auto shadow-sm">
        {[
          { id: 'dashboard', icon: <BarChart3 size={18}/>, label: 'Dashboard' },
          { id: 'actividades', icon: <Calendar size={18}/>, label: 'Torneos' },
          { id: 'partidos', icon: <Swords size={18}/>, label: 'Partidos' },
          { id: 'equipos', icon: <Shield size={18}/>, label: 'Equipos' },
          { id: 'rankings', icon: <Award size={18}/>, label: 'Rankings' },
          { id: 'participantes', icon: <Users size={18}/>, label: 'Participantes' },
          { id: 'reportes', icon: <FileText size={18}/>, label: 'Reportes' },
          { id: 'nueva', icon: <Plus size={18}/>, label: 'Nueva' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)} 
            className={`py-3 px-4 font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === tab.id ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-400'
            }`}
          >
            {tab.icon} <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </nav>

      <main className="p-4 sm:p-6 max-w-[1600px] mx-auto">
        {activeTab === 'dashboard' && <Dashboard {...data} />}
        {activeTab === 'actividades' && (
            <SectionActividades
                data={data.actividades} 
                inscripciones={data.inscripciones} 
                onEdit={(a) => { setEditingActivity(a); setShowEditModal(true); }} 
                onNew={() => setActiveTab('nueva')} 
            />
        )}
        {activeTab === 'partidos' && <SeccionPartidos actividades={data.actividades} resultados={data.resultados} onRefresh={loadAllData} WEB_APP_URL={WEB_APP_URL} />}
        {activeTab === 'equipos' && <SeccionEquipos inscripciones={data.inscripciones} actividades={data.actividades} />}
        {activeTab === 'rankings' && <SeccionRankings resultados={data.resultados} actividades={data.actividades} />}
        {activeTab === 'participantes' && <SeccionParticipantes inscripciones={data.inscripciones} />}
        {activeTab === 'reportes' && <SeccionReportes {...data} />}
        {activeTab === 'nueva' && <AdminPublicador siguienteID={siguienteID} onFinish={() => { loadAllData(); setActiveTab('actividades'); }} onCancel={() => setActiveTab('actividades')} />}
      </main>

      {showEditModal && <EditModal activity={editingActivity} onClose={() => setShowEditModal(false)} onSave={loadAllData} WEB_APP_URL={WEB_APP_URL} />}
    </div>
  );
};

export default IntramurosPanel;