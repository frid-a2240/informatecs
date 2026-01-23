"use client";
import React, { useState } from "react";
import "./form.css";

const POST_API_URL = "https://script.google.com/macros/s/AKfycbyJ2B9Nf0ymC9KXnB1TyBtkidjjW9emCbpP89aZCly6sB5RoPG-hY5Q-9waRp7Yeb2Bew/exec";

const ModalInscripcion = ({ actividad, onClose, onSuccessfulSubmit }) => {
  const esActividadGrupal = ["fútbol", "baloncesto", "torneo", "copa", "vóley"]
    .some(p => actividad.Actividad.toLowerCase().includes(p));

  const [formData, setFormData] = useState({
    nombre: "", email: "", sexo: "", telefono: "", 
    matricula: "", carrera: "", comentarios: "",
    nombreEquipo: "", responsable: "",
    activityId: actividad.ID_Actividad,
  });

  // Estado para integrantes con Nombre, Género y Correo
  const [integrantes, setIntegrantes] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const agregarFila = () => setIntegrantes([...integrantes, { nombre: "", genero: "", email: "" }]);
  const eliminarFila = (index) => setIntegrantes(integrantes.filter((_, i) => i !== index));
  
  const handleIntegranteChange = (index, campo, valor) => {
    const nuevos = [...integrantes];
    nuevos[index][campo] = valor;
    setIntegrantes(nuevos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Formateamos los integrantes para que el Excel los reciba ordenados
    // Ejemplo Nombre: "Juan (M), Maria (F)"
    const nombresConGenero = integrantes
      .map(i => `${i.nombre} (${i.genero || 'N/E'})`)
      .filter(n => n !== " (N/E)")
      .join(", ");

    const correosList = integrantes.map(i => i.email).filter(e => e).join(", ");

    const payload = {
      ...formData,
      nombresIntegrantes: nombresConGenero, // Se guarda en Columna N
      correosIntegrantes: correosList,     // Se guarda en Columna O
    };

    try {
      await fetch(POST_API_URL, {
        method: "POST",
        mode: "no-cors", 
        body: JSON.stringify(payload),
        headers: { "Content-Type": "text/plain;charset=utf-8" }
      });
      
      onSuccessfulSubmit("¡Registro de equipo exitoso!");
      onClose();
    } catch (err) {
      setError("Error al enviar los datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Inscripción: {actividad.Actividad}</h3>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {error && <div className="alert-error">{error}</div>}

          <div className="form-section">
            <label className="section-title">Datos del Responsable</label>
            <div className="form-grid">
              <input type="text" name="nombre" placeholder="Tu Nombre *" onChange={handleChange} required />
              <input type="email" name="email" placeholder="Tu Email *" onChange={handleChange} required />
              <select name="sexo" onChange={handleChange} required>
                <option value="">Tu Género *</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
            </div>
          </div>

          {esActividadGrupal && (
            <div className="form-section team-bg">
              <label className="section-title">Datos del Equipo</label>
              <div className="form-grid">
                <input type="text" name="nombreEquipo" placeholder="Nombre del Equipo *" onChange={handleChange} required />
                <input type="text" name="responsable" placeholder="Capitán *" onChange={handleChange} required />
              </div>

              <div className="integrantes-container">
                <p className="sub-label">Integrantes del Equipo:</p>
                {integrantes.map((item, idx) => (
                  <div key={idx} className="integrante-row-triple">
                    <input 
                      placeholder="Nombre" 
                      className="flex-2"
                      value={item.nombre} 
                      onChange={(e) => handleIntegranteChange(idx, "nombre", e.target.value)} 
                      required 
                    />
                    <select 
                      className="flex-1"
                      value={item.genero} 
                      onChange={(e) => handleIntegranteChange(idx, "genero", e.target.value)} 
                      required
                    >
                      <option value="">Género</option>
                      <option value="M">M</option>
                      <option value="F">F</option>
                    </select>
                    <input 
                      placeholder="Correo" 
                      className="flex-2"
                      value={item.email} 
                      onChange={(e) => handleIntegranteChange(idx, "email", e.target.value)} 
                      required 
                    />
                    <button type="button" onClick={() => eliminarFila(idx)} className="btn-del">×</button>
                  </div>
                ))}
                <button type="button" className="btn-add" onClick={agregarFila}>+ Añadir Integrante</button>
              </div>
            </div>
          )}

          <div className="form-grid" style={{marginTop:"10px"}}>
             <input type="text" name="telefono" placeholder="Teléfono" onChange={handleChange} />
             <input type="text" name="carrera" placeholder="Carrera *" onChange={handleChange} required />
          </div>

          <div className="modal-footer">
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Enviando..." : "Finalizar Inscripción"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalInscripcion;