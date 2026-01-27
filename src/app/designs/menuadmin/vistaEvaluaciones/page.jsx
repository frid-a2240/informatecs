"use client";
import React, { useState } from 'react';
import { Send, Loader2, ListPlus, Clock } from 'lucide-react';

const RESULTS_API_URL = "/api/intramuros";
const AdminPublicador = () => {
  const [enviando, setEnviando] = useState(false);
  
  // Estado con las 12 columnas exactas del Excel (ID se genera en el server)
  const [form, setForm] = useState({
    Actividad: '',
    Deporte_Area: '',
    Periodo_Semestre: 'Primavera 2026',
    Fecha_Inicio: '',
    Hora_Inicio: '',
    Fecha_Fin: '',
    Lugar_Sede: '',
    Estado: 'abierto',
    Coordinador: '',
    Contacto: '',
    Descripcion_Detalles: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);

    try {
      // Agregamos isNewActivity para que el Script sepa que va a la hoja "lista"
      const payload = { ...form, isNewActivity: true };

      await fetch(RESULTS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      alert("¡Actividad publicada con éxito en la hoja lista! (Hora Pacífico)");
      setForm({
        Actividad: '', Deporte_Area: '', Periodo_Semestre: 'Primavera 2026',
        Fecha_Inicio: '', Hora_Inicio: '', Fecha_Fin: '',
        Lugar_Sede: '', Estado: 'abierto', Coordinador: '', 
        Contacto: '', Descripcion_Detalles: ''
      });
    } catch (err) {
      alert("Error de conexión con el servidor.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <ListPlus size={24} />
        <div>
          <h2 style={{ margin: 0 }}>Nueva Actividad - Registro Directo</h2>
          <p style={{ margin: 0, fontSize: '12px', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={12} /> Zona Horaria: Pacífico (Tijuana/Ensenada)
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={gridStyle}>
        {/* Fila 1 */}
        <div style={fullWidth}>
          <label style={labelStyle}>Nombre de la Actividad</label>
          <input style={inputStyle} type="text" required placeholder="Ej. Torneo de Fútbol 7"
            value={form.Actividad} onChange={e => setForm({...form, Actividad: e.target.value})} />
        </div>

        {/* Fila 2 */}
        <div>
          <label style={labelStyle}>Deporte o Área</label>
          <input style={inputStyle} type="text" required placeholder="Ej. Baloncesto"
            value={form.Deporte_Area} onChange={e => setForm({...form, Deporte_Area: e.target.value})} />
        </div>
        <div>
          <label style={labelStyle}>Periodo / Semestre</label>
          <input style={inputStyle} type="text" placeholder="Ej. Primavera 2025"
            value={form.Periodo_Semestre} onChange={e => setForm({...form, Periodo_Semestre: e.target.value})} />
        </div>

        {/* Fila 3 - Fechas */}
        <div>
          <label style={labelStyle}>Fecha de Inicio</label>
          <input style={inputStyle} type="date" required
            value={form.Fecha_Inicio} onChange={e => setForm({...form, Fecha_Inicio: e.target.value})} />
        </div>
        <div>
          <label style={labelStyle}>Hora de Inicio (Hora Local)</label>
          <input style={inputStyle} type="time"
            value={form.Hora_Inicio} onChange={e => setForm({...form, Hora_Inicio: e.target.value})} />
        </div>

        {/* Fila 4 */}
        <div>
          <label style={labelStyle}>Fecha de Fin</label>
          <input style={inputStyle} type="date"
            value={form.Fecha_Fin} onChange={e => setForm({...form, Fecha_Fin: e.target.value})} />
        </div>
        <div>
          <label style={labelStyle}>Lugar / Sede</label>
          <input style={inputStyle} type="text" placeholder="Ej. Cancha 2 ITE"
            value={form.Lugar_Sede} onChange={e => setForm({...form, Lugar_Sede: e.target.value})} />
        </div>

        {/* Fila 5 */}
        <div>
          <label style={labelStyle}>Estado</label>
          <select style={inputStyle} value={form.Estado} onChange={e => setForm({...form, Estado: e.target.value})}>
            <option value="abierto">Abierto</option>
            <option value="cerrado">Cerrado</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Coordinador</label>
          <input style={inputStyle} type="text" placeholder="Nombre del encargado"
            value={form.Coordinador} onChange={e => setForm({...form, Coordinador: e.target.value})} />
        </div>

        {/* Fila 6 */}
        <div style={fullWidth}>
          <label style={labelStyle}>Contacto (Email o Extensión)</label>
          <input style={inputStyle} type="text" placeholder="ejemplo@ite.edu.mx"
            value={form.Contacto} onChange={e => setForm({...form, Contacto: e.target.value})} />
        </div>

        {/* Fila 7 */}
        <div style={fullWidth}>
          <label style={labelStyle}>Descripción y Detalles</label>
          <textarea style={{...inputStyle, height: '80px', resize: 'none'}} 
            placeholder="Reglas, requisitos, etc."
            value={form.Descripcion_Detalles} onChange={e => setForm({...form, Descripcion_Detalles: e.target.value})} />
        </div>

        <button type="submit" disabled={enviando} style={buttonStyle}>
          {enviando ? <Loader2 className="animate-spin" /> : <Send size={18} />}
          {enviando ? "Guardando en Excel..." : "Publicar Actividad"}
        </button>
      </form>
    </div>
  );
};

// Estilos
const containerStyle = { maxWidth: '750px', margin: '30px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' };
const headerStyle = { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px', color: '#2563eb', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px' };
const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' };
const fullWidth = { gridColumn: '1 / span 2' };
const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#475569' };
const inputStyle = { width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' };
const buttonStyle = { gridColumn: '1 / span 2', padding: '15px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', fontSize: '16px', fontWeight: 'bold', marginTop: '10px' };

export default AdminPublicador;