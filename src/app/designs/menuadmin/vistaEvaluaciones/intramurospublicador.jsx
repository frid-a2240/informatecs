"use client";
import React, { useState, useEffect } from 'react';
import { Send, Loader2, ListPlus, X, Users2 } from 'lucide-react';

const WEB_APP_URL = "/api/intramuros";

const AdminPublicador = ({ onFinish, onCancel, siguienteID }) => {
  const [enviando, setEnviando] = useState(false);
  
  const [form, setForm] = useState({
    ID_Actividad: siguienteID || '',
    Nombre_Actividad: '',
    Deporte_o_Area: '',
    Periodo_Semestre: 'Primavera 2026',
    Fecha_Inicio: '',
    Hora_Inicio: '',
    Fecha_Fin: '',
    Lugar_Sede: '',
    Estado: 'Abierto',
    Coordinador: '',
    Contacto: '',
    Descripción_Detalles: '',
    Capacidad_Maxima: '10',
    Max_Integrantes: '6',
    Categoria_Genero: 'Mixto' // <-- Nuevo campo para definir la regla del torneo
  });

  useEffect(() => {
    if (siguienteID) setForm(prev => ({ ...prev, ID_Actividad: siguienteID }));
  }, [siguienteID]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    try {
      // Enviamos con la acción saveActivity que ya tenemos en el Script
      await fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ action: 'saveActivity', ...form })
      });
      
      setTimeout(() => {
        setEnviando(false);
        if (onFinish) onFinish();
      }, 1500);
    } catch (error) {
      setEnviando(false);
      alert("Error al guardar la actividad.");
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalContainerStyle}>
        {/* HEADER */}
        <div style={headerStyle}>
          <div style={iconContainerStyle}><ListPlus size={24} color="#fff" /></div>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, color: '#1e293b', fontSize: '18px', fontWeight: '800' }}>CONFIGURAR ACTIVIDAD</h2>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#2563eb', fontWeight: 'bold' }}>ID DE REGISTRO: {form.ID_Actividad}</p>
          </div>
          <button onClick={onCancel} style={closeButtonStyle}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={formScrollStyle}>
          <div style={gridStyle}>
            {/* Nombre y Deporte */}
            <div style={fullWidth}>
              <label style={labelStyle}>Nombre de la Actividad *</label>
              <input style={inputStyle} type="text" required value={form.Nombre_Actividad} onChange={e => setForm({...form, Nombre_Actividad: e.target.value})} placeholder="Ej. Torneo Relámpago Voleibol" />
            </div>

            <div>
              <label style={labelStyle}>Deporte o Área</label>
              <input style={inputStyle} type="text" value={form.Deporte_o_Area} onChange={e => setForm({...form, Deporte_o_Area: e.target.value})} placeholder="Ej. Deportes" />
            </div>
            <div>
              <label style={labelStyle}>Categoría de Género</label>
              <select style={inputStyle} value={form.Categoria_Genero} onChange={e => setForm({...form, Categoria_Genero: e.target.value})}>
                <option value="Mixto">Mixto</option>
                <option value="Varonil">Varonil</option>
                <option value="Femenil">Femenil</option>
              </select>
            </div>

            {/* Fechas */}
            <div>
              <label style={labelStyle}>Fecha Inicio</label>
              <input style={inputStyle} type="date" required value={form.Fecha_Inicio} onChange={e => setForm({...form, Fecha_Inicio: e.target.value})} />
            </div>
            <div>
              <label style={labelStyle}>Hora de Encuentro</label>
              <input style={inputStyle} type="time" value={form.Hora_Inicio} onChange={e => setForm({...form, Hora_Inicio: e.target.value})} />
            </div>

            {/* Configuración de Equipo */}
            <div>
              <label style={labelStyle}>Capacidad de Equipos</label>
              <input style={inputStyle} type="number" value={form.Capacidad_Maxima} onChange={e => setForm({...form, Capacidad_Maxima: e.target.value})} />
            </div>
            <div>
              <label style={labelStyle}>Máx. Integrantes p/e</label>
              <input style={inputStyle} type="number" value={form.Max_Integrantes} onChange={e => setForm({...form, Max_Integrantes: e.target.value})} />
            </div>

            {/* Ubicación y Estado */}
            <div style={fullWidth}>
              <label style={labelStyle}>Lugar / Sede</label>
              <input style={inputStyle} type="text" value={form.Lugar_Sede} onChange={e => setForm({...form, Lugar_Sede: e.target.value})} placeholder="Ej. Cancha de Usos Múltiples" />
            </div>

            <div>
              <label style={labelStyle}>Coordinador</label>
              <input style={inputStyle} type="text" value={form.Coordinador} onChange={e => setForm({...form, Coordinador: e.target.value})} />
            </div>
            <div>
              <label style={labelStyle}>Estado de Inscripción</label>
              <select style={inputStyle} value={form.Estado} onChange={e => setForm({...form, Estado: e.target.value})}>
                <option value="Abierto">Abierto (Público)</option>
                <option value="Cerrado">Cerrado (Oculto)</option>
              </select>
            </div>

            <div style={fullWidth}>
              <label style={labelStyle}>Descripción y Requisitos</label>
              <textarea style={{...inputStyle, height: '80px', resize: 'none'}} value={form.Descripción_Detalles} onChange={e => setForm({...form, Descripción_Detalles: e.target.value})} placeholder="Indica si deben traer uniforme, credencial, etc." />
            </div>
          </div>
        </form>

        {/* FOOTER */}
        <div style={footerStyle}>
          <button type="submit" onClick={handleSubmit} disabled={enviando} style={buttonStyle}>
            {enviando ? <Loader2 className="animate-spin" size={20} /> : <Send size={18} />}
            {enviando ? "PUBLICANDO..." : "PUBLICAR ACTIVIDAD"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- ESTILOS MANTENIDOS ---
const overlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' };
const modalContainerStyle = { width: '100%', maxWidth: '640px', backgroundColor: '#fff', borderRadius: '32px', display: 'flex', flexDirection: 'column', maxHeight: '90vh', shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' };
const headerStyle = { padding: '24px 32px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid #f1f5f9' };
const formScrollStyle = { padding: '32px', overflowY: 'auto' };
const footerStyle = { padding: '20px 32px', borderTop: '1px solid #f1f5f9', backgroundColor: '#f8fafc' };
const iconContainerStyle = { backgroundColor: '#2563eb', width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.4)' };
const closeButtonStyle = { background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' };
const fullWidth = { gridColumn: '1 / span 2' };
const labelStyle = { display: 'block', fontSize: '11px', fontWeight: '900', marginBottom: '8px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' };
const inputStyle = { width: '100%', padding: '12px 16px', border: '2px solid #f1f5f9', borderRadius: '14px', fontSize: '14px', fontWeight: '600', color: '#1e293b', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' };
const buttonStyle = { width: '100%', padding: '16px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '16px', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '12px', fontWeight: '800', fontSize: '15px', transition: 'transform 0.2s' };

export default AdminPublicador;