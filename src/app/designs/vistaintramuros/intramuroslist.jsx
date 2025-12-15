"use client";
import React, { useState, useEffect } from "react";
import "./intramuros.css";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserTie,
  FaClock,
  FaEnvelope, // Añadido para email
} from "react-icons/fa";

// --- 🛠️ CONFIGURACIÓN DE LA CONEXIÓN 🛠️ ---
// 1. URL base para la comunicación con el API Proxy de Next.js (Recomendado).
//    Asume que next.config.js redirige '/api/intramuros' a la URL de Google Apps Script.
const API_PROXY_URL = "/api/intramuros";
// ====================================================================
// ======================= MODAL INSCRIPCIÓN ==========================
// ====================================================================

const ModalInscripcion = ({ actividad, onClose, onSuccessfulSubmit }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    matricula: "",
    carrera: "",
    comentarios: "",
  });

  const [estado, setEstado] = useState("idle"); // idle, loading, success, error
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * Valida si el email tiene un formato básico correcto.
   */
  const isValidEmail = (email) => {
    // Patrón regex simple para validar el formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validación de campos obligatorios
    if (!formData.nombre.trim() || !formData.email.trim()) {
      setEstado("error");
      setMensaje("Por favor completa los campos obligatorios: Nombre y Email.");
      return;
    }

    // 2. Validación de formato de email
    if (!isValidEmail(formData.email)) {
      setEstado("error");
      setMensaje("Por favor ingresa un correo electrónico válido.");
      return;
    }

    // ======================================================
    // === ✅ VERIFICACIÓN CRÍTICA DE LA ID DE LA ACTIVIDAD ===
    // Asegura que la ID que se pasa al backend existe.
    // ======================================================
    const activityIdToSend = actividad?.ID_Actividad;

    if (!activityIdToSend || activityIdToSend === 0) {
      console.error(
        "Error en datos de actividad: ID_Actividad no encontrada o inválida.",
        actividad
      );
      setEstado("error");
      setMensaje(
        "Error interno: La ID de la actividad seleccionada no es válida. Por favor, reporta este problema."
      );
      return;
    }
    // ======================================================

    setEstado("loading");

    try {
      const payload = {
        activityId: activityIdToSend, // Usamos la ID verificada
        nombre: formData.nombre.trim(),
        email: formData.email.trim(),
        // Se limpian espacios en blanco de los opcionales antes de enviar
        telefono: formData.telefono.trim(),
        matricula: formData.matricula.trim(),
        carrera: formData.carrera.trim(),
        comentarios: formData.comentarios.trim(),
      };

      // 3. Uso de la constante API_PROXY_URL
      const response = await fetch(API_PROXY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Se usa response.ok para manejo HTTP correcto
        setEstado("success");
        setMensaje(`¡Inscripción a ${actividad.Actividad} registrada!`);

        // Ejecutar callback para mensaje principal
        if (onSuccessfulSubmit) {
          onSuccessfulSubmit(data.message);
        }

        // Cierra el modal después de 3 segundos
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        // Maneja errores de la API (incluyendo errores HTTP si response.ok es false)
        setEstado("error");
        setMensaje(
          data.error ||
            `Error ${response.status}: Al procesar la inscripción. Intenta de nuevo.`
        );
      }
    } catch (error) {
      setEstado("error");
      setMensaje(
        "Error de conexión. Asegúrate que el servicio de API esté activo y accesible."
      );
      console.error("Error en POST:", error);
    }
  };

  // Función para formatear fechas del modal (se mantiene robusta)
  const formatModalDate = (dateString) => {
    if (!dateString) return "Fecha no disponible";
    // Si la cadena incluye hora (como la de Apps Script), la toma como ISO.
    try {
      return new Date(dateString).toLocaleDateString("es-MX", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return "Formato inválido";
    }
  };

  // Función para formatear horas del modal (se mantiene robusta)
  const formatModalTime = (timeString) => {
    if (!timeString) return "Hora no especificada";
    try {
      const date = new Date(timeString);

      if (isNaN(date.getTime())) {
        if (typeof timeString === "string" && timeString.length >= 5) {
          return timeString.substring(0, 5);
        }
        return "Hora no especificada";
      }

      return date.toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch (e) {
      return "Formato inválido";
    }
  };
  // -----------------------------------------------------------------

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Inscripción</h3>
          <button
            className="modal-close"
            onClick={onClose}
            disabled={estado === "loading"}
          >
            ×
          </button>
        </div>

        {/* Info de la Actividad en el Modal */}
        <div className="modal-actividad-info">
          <h4>{actividad.Actividad}</h4>
          <p>
            <FaCalendarAlt /> {formatModalDate(actividad.Fecha_Inicio)}
          </p>
          <p>
            <FaClock /> {formatModalTime(actividad.Hora_Inicio)}
          </p>
          <p className="modal-actividad-description">
            {actividad.Descripcion_Detalles || "Sin detalles adicionales."}
          </p>
        </div>

        {/* Mensajes de Estado */}
        {estado === "success" && (
          <div className="alert alert-success">
            <strong>¡Inscripción exitosa!</strong>
            <p>{mensaje} Revisa tu correo electrónico para la confirmación.</p>
          </div>
        )}

        {estado === "error" && (
          <div className="alert alert-error">
            <strong>Error en la inscripción</strong>
            <p>{mensaje}</p>
          </div>
        )}

        {/* Formulario */}
        {estado !== "success" && (
          <form onSubmit={handleSubmit} className="inscription-form">
            <div className="form-group">
              <label>
                Nombre completo <span className="required-star">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                placeholder="Juan Pérez"
                disabled={estado === "loading"}
                aria-required="true"
              />
            </div>

            <div className="form-group">
              <label>
                Correo electrónico <span className="required-star">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="tu.email@ite.edu.mx"
                disabled={estado === "loading"}
                aria-required="true"
              />
            </div>

            {/* Campos Opcionales */}
            <div className="form-group">
              <label>Teléfono (Opcional)</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="(646) 123-4567"
                disabled={estado === "loading"}
              />
            </div>

            <div className="form-group">
              <label>Matrícula (Opcional)</label>
              <input
                type="text"
                name="matricula"
                value={formData.matricula}
                onChange={handleChange}
                placeholder="12345678"
                disabled={estado === "loading"}
              />
            </div>

            <div className="form-group">
              <label>Carrera (Opcional)</label>
              <input
                type="text"
                name="carrera"
                value={formData.carrera}
                onChange={handleChange}
                placeholder="Ingeniería en Sistemas"
                disabled={estado === "loading"}
              />
            </div>

            <div className="form-group">
              <label>Comentarios (Opcional)</label>
              <textarea
                name="comentarios"
                value={formData.comentarios}
                onChange={handleChange}
                rows="3"
                placeholder="Información adicional (opcional)"
                disabled={estado === "loading"}
              />
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={estado === "loading"}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={estado === "loading"}
              >
                {estado === "loading" ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Enviando...
                  </>
                ) : (
                  "Inscribirme"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
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

  // Función auxiliar para formatear fechas a solo la parte de la fecha (DD/MM/YYYY)
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("es-MX");
    } catch (e) {
      return "N/A";
    }
  };

  // Función de Hora Robusta (igual que en el modal)
  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    try {
      const date = new Date(timeString);

      if (isNaN(date.getTime())) {
        if (typeof timeString === "string" && timeString.length >= 5) {
          return timeString.substring(0, 5);
        }
        return "N/A";
      }

      return date.toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch (e) {
      return "N/A";
    }
  };
  // -----------------------------------------------------------

  // Manejo de la actualización de la lista después de una inscripción exitosa en el modal
  const handleSuccessfulSubmit = (msg) => {
    setSuccessMessage(msg + " Por favor, revisa tu correo.");

    // Limpiar mensaje de éxito después de un tiempo
    const timer = setTimeout(() => setSuccessMessage(null), 5000);
    // Limpieza de efecto para evitar fugas de memoria si el componente se desmonta
    return () => clearTimeout(timer);
  };

  // Función de carga de datos inicial (Refactorizada para ser reutilizable)
  const fetchActividades = async () => {
    setLoading(true);
    setError(null);
    try {
      // 4. Uso de la constante API_PROXY_URL
      const response = await fetch(API_PROXY_URL);

      if (!response.ok) {
        throw new Error(
          `Error HTTP: ${response.status} al intentar conectar con el proxy.`
        );
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Se muestra la lista completa, pero se mantiene el filtro de estado en la tabla
      setActividades(data);
    } catch (err) {
      console.error("Error al obtener datos:", err);
      setError(
        "Error de conexión con la API o el proxy. Verifica la configuración."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActividades();
    // Limpieza de efecto si se necesitan temporizadores o suscripciones
    return () => {
      // Nada que limpiar aquí, pero se mantiene la estructura por si acaso.
    };
  }, []); // Cargar solo al montar el componente

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "abierto":
        return "status-open";
      case "en curso":
        return "status-inprogress";
      case "cerrado":
        return "status-closed";
      default:
        return "status-default";
    }
  };

  const filteredActividades = actividades.filter(
    (actividad) =>
      actividad.Actividad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      actividad.Coordinador?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      actividad.Deporte_Area?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="intramuros-list-wrapper">
        <div className="loading-message">Cargando actividades...</div>
      </div>
    );

  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="intramuros-list-wrapper">
      <h2>Registro de Actividades Intramuros</h2>

      {successMessage && (
        <div className="alert alert-success principal-alert">
          {successMessage}
        </div>
      )}

      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por Actividad, Coordinador o Área..."
          className="search-input"
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Buscar actividad"
        />
      </div>

      <div className="table-responsive">
        {" "}
        {/* Añadido para mejor manejo en móviles */}
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
            {filteredActividades.map((actividad, index) => (
              <tr key={actividad.ID_Actividad || index}>
                <td>{actividad.ID_Actividad}</td>
                <td data-label="Actividad">{actividad.Actividad}</td>
                <td data-label="Área">{actividad.Deporte_Area}</td>
                <td data-label="Coordinador">
                  <FaUserTie /> {actividad.Coordinador}
                </td>
                <td data-label="Fecha/Hora">
                  <FaCalendarAlt /> {formatDate(actividad.Fecha_Inicio)}
                  <br />
                  <FaClock /> {formatTime(actividad.Hora_Inicio)}
                </td>
                <td data-label="Lugar">
                  <FaMapMarkerAlt /> {actividad.Lugar_Sede}
                </td>
                <td data-label="Estado">
                  <span
                    className={`status-badge ${getStatusClass(
                      actividad.Estado
                    )}`}
                  >
                    {actividad.Estado}
                  </span>
                </td>
                <td data-label="Acción">
                  {actividad.Estado?.toLowerCase() === "abierto" ? (
                    <button
                      className="btn-inscribirse"
                      onClick={() => setModalActivo(actividad)}
                    >
                      Inscribirme
                    </button>
                  ) : (
                    <button className="btn-inscribirse btn-disabled" disabled>
                      {actividad.Estado || "No disp."}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredActividades.length === 0 && !loading && (
        <p className="no-results">
          No se encontraron actividades que coincidan con la búsqueda.
        </p>
      )}

      {/* Renderizado Condicional del Modal */}
      {modalActivo && (
        <ModalInscripcion
          actividad={modalActivo}
          onClose={() => setModalActivo(null)}
          onSuccessfulSubmit={handleSuccessfulSubmit}
        />
      )}
    </div>
  );
};

export default IntramurosList;
