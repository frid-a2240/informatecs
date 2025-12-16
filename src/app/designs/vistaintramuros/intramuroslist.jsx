// src/app/designs/vistaintramuros/IntramurosList.jsx

"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
// Importa el archivo CSS para los estilos
import "./actividades.css";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserTie,
  FaClock,
  FaSearch, // Icono de búsqueda añadido para mejor UX
} from "react-icons/fa";
// Asegúrate de que esta ruta sea correcta para tu componente Modal
import ModalInscripcion from "./formulariointra";

// --- 🛠️ CONFIGURACIÓN DE LA CONEXIÓN 🛠️ ---
const API_PROXY_URL =
  "https://script.google.com/macros/s/AKfycbyLeN9z1JvTmVs9S8cvQSgmZXKO7LIK33pKzR4Ulk4oMeO4zODhKI0iD2hN5dA4DMh1gw/exec";

// ====================================================================
// === FUNCIONES AUXILIARES ===
// ====================================================================

/**
 * Formatea una cadena de fecha a formato local (es-MX).
 * @param {string} dateString - Cadena de fecha ISO o compatible.
 * @returns {string} Fecha formateada o 'N/A'.
 */
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      return "N/A";
    }
    // Opciones para asegurar el formato y manejar las zonas horarias si es necesario
    return date.toLocaleDateString("es-MX", { timeZone: "UTC" });
  } catch (e) {
    console.error("Error al formatear fecha:", e);
    return "N/A";
  }
};

/**
 * Formatea una cadena de tiempo o fecha a 'HH:mm' (formato 24h).
 * @param {string} timeString - Cadena de tiempo o fecha ISO.
 * @returns {string} Hora formateada o 'N/A'.
 */
const formatTime = (timeString) => {
  if (!timeString) return "N/A";
  try {
    const date = new Date(timeString);

    if (isNaN(date.getTime())) {
      // Intento alternativo para cadenas como "HH:mm" si la fecha no es válida
      const match = timeString.match(/^(\d{1,2}):(\d{2})$/);
      if (match) {
        // Devuelve la cadena tal cual si ya es un formato de hora simple
        return timeString.substring(0, 5);
      }
      return "N/A";
    }

    // Usar timeZone: 'UTC' para evitar que la conversión a fecha cambie la hora original,
    // asumiendo que la hora en la API es simple (ej. "15:00").
    return date.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC",
    });
  } catch (e) {
    return "N/A";
  }
};

/**
 * Devuelve la clase CSS para el badge de estado.
 * @param {string} status - El estado de la actividad.
 * @returns {string} Clase CSS.
 */
const getStatusClass = (status) => {
  const normalizedStatus = status?.toLowerCase().replace(/\s/g, "_");
  switch (normalizedStatus) {
    case "abierto":
      return "status-open";
    case "en_curso":
      return "status-inprogress";
    case "cerrado":
      return "status-closed";
    default:
      return "status-default";
  }
};

// ====================================================================
// ======================= COMPONENTE LISTA PRINCIPAL =================
// ====================================================================

const IntramurosList = () => {
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalActivo, setModalActivo] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  /**
   * Maneja el mensaje de éxito después de enviar el formulario del modal.
   * @param {string} msg - Mensaje base de éxito.
   */
  const handleSuccessfulSubmit = (msg) => {
    setModalActivo(null); // Cierra el modal
    setSuccessMessage(msg + " Por favor, revisa tu correo.");
    // Desaparece el mensaje de éxito después de 5 segundos
    const timer = setTimeout(() => setSuccessMessage(null), 5000);
    return () => clearTimeout(timer);
  };

  /**
   * Cierra el modal, una función más limpia para pasar a ModalInscripcion.
   */
  const handleCloseModal = useCallback(() => {
    setModalActivo(null);
  }, []);

  /**
   * Función para obtener las actividades de la API.
   */
  const fetchActividades = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_PROXY_URL);

      if (!response.ok) {
        // Nivel 1: Error HTTP
        throw new Error(
          `Error HTTP ${response.status}: Falló la conexión con la API.`
        );
      }

      const data = await response.json();

      // Nivel 2: Manejo de errores de Google Apps Script (si devuelve {"error": "..."})
      if (data && typeof data === "object" && data.error) {
        console.error("Error devuelto por Apps Script:", data.error);
        throw new Error(`Error en la API: ${data.error}`);
      }

      // Nivel 3: Validación del formato de datos
      if (Array.isArray(data)) {
        // Limpiamos los datos de cualquier fila vacía o nula
        const cleanData = data.filter((item) => item && item.ID_Actividad);
        setActividades(cleanData);
      } else {
        console.error("API devolvió datos en formato incorrecto:", data);
        setError(
          "La API devolvió un formato de datos inesperado. Contacte a soporte."
        );
        setActividades([]);
      }
    } catch (err) {
      console.error("Error al obtener datos:", err);
      setError(
        err.message ||
          "Error de conexión o respuesta inesperada. Verifica la URL y la implementación del script."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Efecto para la carga inicial de datos
  useEffect(() => {
    fetchActividades();
  }, [fetchActividades]);

  // Uso de useMemo para optimizar el filtrado de actividades
  const filteredActividades = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return actividades;

    return actividades.filter((actividad) => {
      // Verificación de existencia y conversión a string para evitar errores
      const id = String(actividad.ID_Actividad || "");
      const nombre = String(actividad.Actividad || "").toLowerCase();
      const coordinador = String(actividad.Coordinador || "").toLowerCase();
      const area = String(actividad.Deporte_Area || "").toLowerCase();

      return (
        nombre.includes(term) ||
        coordinador.includes(term) ||
        area.includes(term) ||
        id.includes(term)
      );
    });
  }, [actividades, searchTerm]);

  // --- RENDERIZADO DEL COMPONENTE ---

  if (loading)
    return (
      <div className="intramuros-list-wrapper">
        <div className="loading-message">⏳ Cargando actividades...</div>
      </div>
    );

  if (error)
    return (
      <div className="intramuros-list-wrapper">
        <div className="error-message">⚠️ Error: {error}</div>
        <button onClick={fetchActividades} className="btn-retry">
          Reintentar Carga
        </button>
      </div>
    );

  return (
    <div className="intramuros-list-wrapper">
      <header className="list-header">
        <h2>Registro de Actividades Intramuros</h2>
      </header>

      {successMessage && (
        <div className="alert alert-success principal-alert">
          ✅ {successMessage}
        </div>
      )}

      <div className="search-container">
        <FaSearch className="search-icon" aria-hidden="true" />
        <input
          type="text"
          placeholder="Buscar por ID, Actividad, Coordinador o Área..."
          className="search-input"
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Buscar actividad por palabra clave"
          value={searchTerm} // Controlar el input
        />
      </div>

      <div className="table-responsive">
        <table className="intramuros-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Actividad</th>
              <th>Área</th>
              <th>Coordinador</th>
              <th>Fecha/Hora</th>
              <th>Lugar</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filteredActividades.length > 0 ? (
              filteredActividades.map((actividad) => (
                <tr
                  key={String(
                    actividad.ID_Actividad || `temp-${Math.random()}`
                  )}
                >
                  <td>{actividad.ID_Actividad}</td>
                  <td data-label="Actividad">{actividad.Actividad}</td>
                  <td data-label="Área">{actividad.Deporte_Area}</td>
                  <td data-label="Coordinador">
                    <FaUserTie aria-hidden="true" />{" "}
                    {actividad.Coordinador || "N/A"}
                  </td>
                  <td data-label="Fecha/Hora">
                    <FaCalendarAlt aria-hidden="true" />{" "}
                    {formatDate(actividad.Fecha_Inicio)}
                    <br />
                    <FaClock aria-hidden="true" />{" "}
                    {formatTime(actividad.Hora_Inicio)}
                  </td>
                  <td data-label="Lugar">
                    <FaMapMarkerAlt aria-hidden="true" /> {actividad.Lugar_Sede}
                  </td>
                  <td data-label="Estado">
                    <span
                      className={`status-badge ${getStatusClass(
                        actividad.Estado
                      )}`}
                    >
                      {actividad.Estado || "Desconocido"}
                    </span>
                  </td>
                  <td data-label="Acción">
                    {actividad.Estado?.toLowerCase() === "abierto" ? (
                      <button
                        className="btn-inscribirse"
                        onClick={() => setModalActivo(actividad)}
                        aria-label={`Inscribirse a ${actividad.Actividad}`}
                      >
                        Inscribirme
                      </button>
                    ) : (
                      <button
                        className="btn-inscribirse btn-disabled"
                        disabled
                        aria-label={`Actividad ${
                          actividad.Estado || "no disponible"
                        }`}
                      >
                        {actividad.Estado || "No disp."}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">
                  <p className="no-results">
                    {searchTerm
                      ? `No se encontraron resultados para "${searchTerm}".`
                      : "No hay actividades disponibles en este momento."}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* El componente ModalInscripcion */}
      {modalActivo && (
        <ModalInscripcion
          actividad={modalActivo}
          // Usamos la función optimizada con useCallback
          onClose={handleCloseModal}
          onSuccessfulSubmit={handleSuccessfulSubmit}
          // Prop extra para asegurar el ID de la actividad en el formulario
          activityId={modalActivo.ID_Actividad}
        />
      )}
    </div>
  );
};

export default IntramurosList;
