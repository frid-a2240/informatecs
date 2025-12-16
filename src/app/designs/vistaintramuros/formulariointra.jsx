// src/app/designs/vistaintramuros/formulariointra.jsx
// ESTE CÓDIGO ES UNA PLANTILLA PARA EL MODAL DE INSCRIPCIÓN
"use client";
import React, { useState } from "react";
import "./form.css"; // Asume que tienes un CSS para el modal

// La URL de tu App Web de Google Apps Script (la misma que usas para GET/POST)
const POST_API_URL =
  "https://script.google.com/macros/s/AKfycbyLeN9z1JvTmVs9S8cvQSgmZXKO7LIK33pKzR4Ulk4oMeO4zODhKI0iD2hN5dA4DMh1gw/exec";
// Usa la URL de tu proyecto con la función doPost

const ModalInscripcion = ({ actividad, onClose, onSuccessfulSubmit }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",

    sexo: "",
    carrera: "",
    telefono: "",
    matricula: "",
    comentarios: "",
    activityId: actividad.ID_Actividad, // ID de la actividad seleccionada
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.nombre ||
      !formData.email ||
      !formData.sexo ||
      !formData.carrera
    ) {
      setError(
        "Por favor, rellena todos los campos requeridos (Nombre, Email, Sexo, Carrera)."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(POST_API_URL, {
        method: "POST",
        // El contenido del cuerpo debe enviarse como JSON
        body: JSON.stringify(formData),
        // Apps Script espera text/plain, no application/json para el POST del cuerpo
        // pero la conversión a JSON se hace en el lado del servidor.
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
      });

      const result = await response.json();

      if (result.success) {
        onSuccessfulSubmit(result.message);
        onClose(); // Cerrar el modal al completar la inscripción
      } else {
        // Mostrar error del backend (p. ej., "Ya estás inscrito")
        setError(result.error || "Error desconocido en el registro.");
      }
    } catch (err) {
      console.error("Error al enviar la inscripción:", err);
      setError("Error de conexión al servidor: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Inscripción a: {actividad.Actividad}</h3>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre Completo *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo Electrónico *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="sexo">Sexo *</label>
              <select
                id="sexo"
                name="sexo"
                value={formData.sexo}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione...</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="carrera">Carrera *</label>
              <input
                type="text"
                id="carrera"
                name="carrera"
                value={formData.carrera}
                onChange={handleChange}
                required
              />
            </div>

            {/* Campos opcionales */}
            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                type="text"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="matricula">Matrícula</label>
              <input
                type="text"
                id="matricula"
                name="matricula"
                value={formData.matricula}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="comentarios">Comentarios</label>
              <textarea
                id="comentarios"
                name="comentarios"
                value={formData.comentarios}
                onChange={handleChange}
              />
            </div>

            <div className="modal-footer">
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Registrando..." : "Confirmar Inscripción"}
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalInscripcion;
