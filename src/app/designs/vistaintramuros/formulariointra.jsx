"use client";
import React, { useState } from "react";
import { Plus, Trash2, Users } from "lucide-react";
import "./form.css";

const POST_API_URL = "/api/intramuros";

const ModalInscripcion = ({ actividad, onClose, onSuccessfulSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [esExterno, setEsExterno] = useState(false);

  // Extraemos datos de la actividad
  const nombreActividad = actividad.Nombre_Actividad || actividad.Actividad || "Actividad";
  const idActividad = actividad.ID_Actividad || "N/A";

  // Lógica para detectar si es grupal
  const esActividadGrupal = ["fútbol", "baloncesto", "torneo", "copa", "vóley", "relevos", "flag", "fubol"]
    .some(p => nombreActividad.toLowerCase().includes(p));

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    sexo: "",
    telefono: "",
    matricula: "",
    carrera: "",
    comentarios: "",
    nombreEquipo: "",
  });

  const [integrantes, setIntegrantes] = useState([]);
  const [nuevoInt, setNuevoInt] = useState({ nombre: "", correo: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const agregarIntegrante = (e) => {
    e.preventDefault();
    if (!nuevoInt.nombre.trim()) return;
    setIntegrantes(prev => [...prev, { ...nuevoInt }]);
    setNuevoInt({ nombre: "", correo: "" });
    setError(null);
  };

  const eliminarIntegrante = (index) => {
    setIntegrantes(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Bloqueo manual si ya está cargando para evitar doble clic accidental
    if (loading) return;

    if (esActividadGrupal && integrantes.length === 0) {
      setError("Agrega al menos un integrante con el botón (+)");
      return;
    }

    setLoading(true);
    setError(null);
    
    const payload = {
      activityId: idActividad,
      actividad: nombreActividad,
      nombre: formData.nombre,
      email: formData.email,
      sexo: formData.sexo,
      telefono: formData.telefono,
      matricula: esExterno ? "EXTERNO" : formData.matricula,
      carrera: esExterno ? "EXTERNO" : formData.carrera,
      comentarios: formData.comentarios || "Sin obs.",
      externo: esExterno ? "SÍ" : "NO",
      nombreEquipo: esActividadGrupal ? (formData.nombreEquipo || "Equipo") : "Individual",
      responsable: formData.nombre,
      nombresIntegrantes: esActividadGrupal ? integrantes.map(i => i.nombre).join(", ") : "N/A",
      correosIntegrantes: esActividadGrupal ? integrantes.map(i => i.correo || "S/C").join(", ") : "N/A",
      is_admin: false // Flag para el script de Google
    };

    try {
      const response = await fetch(POST_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      
      if (result.status === "success" || result.result === "success") {
        onSuccessfulSubmit("¡Inscripción exitosa!");
        onClose();
      } else {
        // Manejo de error de duplicado enviado por el Script
        throw new Error(result.message || "Error al procesar la inscripción.");
      }
    } catch (err) {
      console.error("Submit Error:", err);
      setError(err.message || "Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content animate-in">
        <div className="modal-header">
          <h3>Registro: {nombreActividad}</h3>
          <button type="button" className="close-button" onClick={onClose} disabled={loading}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {error && <div className="alert-error">{error}</div>}

          <div className="toggle-wrapper">
            <span>Alumno ITE</span>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={esExterno} 
                onChange={() => setEsExterno(!esExterno)} 
                disabled={loading}
              />
              <span className="slider round"></span>
            </label>
            <span>Externo</span>
          </div>

          <div className="form-grid">
            <input type="text" name="nombre" placeholder="Nombre Completo *" onChange={handleChange} required disabled={loading} />
            <input type="email" name="email" placeholder="Correo Electrónico *" onChange={handleChange} required disabled={loading} />
            
            <select name="sexo" onChange={handleChange} required disabled={loading}>
              <option value="">Género *</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>

            <input type="tel" name="telefono" placeholder="WhatsApp / Teléfono *" onChange={handleChange} required disabled={loading} />
            
            {!esExterno && (
              <>
                <input type="text" name="matricula" placeholder="Matrícula *" onChange={handleChange} required disabled={loading} />
                <input type="text" name="carrera" placeholder="Carrera *" onChange={handleChange} required disabled={loading} />
              </>
            )}

            <input 
              type="text" 
              name="comentarios" 
              placeholder="¿Alguna observación?" 
              className="full-width" 
              onChange={handleChange} 
              disabled={loading}
            />
          </div>

          {esActividadGrupal && (
            <div className="team-section">
              <div className="section-divider"><Users size={16}/> Configuración de Equipo</div>
              <input 
                type="text" 
                name="nombreEquipo" 
                placeholder="Nombre de tu Equipo *" 
                onChange={handleChange} 
                required 
                className="full-width" 
                disabled={loading}
              />
              
              <div className="section-divider">Integrantes</div>
              <div className="integrante-input-group">
                <input 
                  type="text" 
                  placeholder="Nombre" 
                  value={nuevoInt.nombre}
                  onChange={(e) => setNuevoInt({...nuevoInt, nombre: e.target.value})}
                  disabled={loading}
                />
                <input 
                  type="email" 
                  placeholder="Correo" 
                  value={nuevoInt.correo}
                  onChange={(e) => setNuevoInt({...nuevoInt, correo: e.target.value})}
                  disabled={loading}
                />
                <button type="button" onClick={agregarIntegrante} className="btn-add" disabled={loading}>
                  <Plus size={18} />
                </button>
              </div>

              <div className="integrantes-list">
                {integrantes.map((int, index) => (
                  <div key={index} className="integrante-item">
                    <span>{int.nombre}</span>
                    <button type="button" className="btn-delete-int" onClick={() => eliminarIntegrante(index)} disabled={loading}>
                      <Trash2 size={14}/>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-cancel" disabled={loading}>Cancelar</button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Registrando..." : "Confirmar Registro"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalInscripcion;