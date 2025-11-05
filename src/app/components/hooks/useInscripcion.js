import { useState } from "react";

/**
 * Hook para manejar el proceso completo de inscripción a actividades
 * @returns {Object} Estado y funciones para manejar inscripciones
 */
export const useInscripcion = () => {
  // Estado del deporte/actividad seleccionada para inscripción
  const [formSport, setFormSport] = useState(null);

  // Control de visibilidad del formulario
  const [showForm, setShowForm] = useState(false);

  // Estado de envío (loading state)
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Datos del formulario de inscripción
  const [formData, setFormData] = useState({
    hasPracticed: "", // ¿Has practicado esta actividad antes?
    hasIllness: "", // ¿Tienes alguna enfermedad o lesión?
    purpose: "", // Propósito de inscripción
    bloodType: "", // Tipo de sangre
  });

  /**
   * Inicia el proceso de inscripción
   * Abre el formulario con los datos de la actividad seleccionada
   */
  const iniciarInscripcion = (item) => {
    setFormSport({
      ofertaId: item.id,
      actividadId: item.actividad.id,
      name: item.actividad.aconco,
    });

    // Resetear el formulario
    setFormData({
      hasPracticed: "",
      hasIllness: "",
      purpose: "",
      bloodType: "",
    });

    setShowForm(true);
  };

  /**
   * Cancela la inscripción
   * Cierra el formulario y limpia los datos
   */
  const cancelarInscripcion = () => {
    setShowForm(false);
    setFormSport(null);
    setFormData({
      hasPracticed: "",
      hasIllness: "",
      purpose: "",
      bloodType: "",
    });
  };

  /**
   * Envía la inscripción al servidor
   * @param {Object} studentData - Datos del estudiante
   * @param {Function} onSuccess - Callback a ejecutar si la inscripción es exitosa
   */
  const submitInscripcion = async (studentData, onSuccess) => {
    // Validar que existan datos esenciales
    if (!formSport || !studentData?.numeroControl) {
      alert("Faltan datos esenciales para la inscripción");
      return;
    }

    // Validar que el formulario esté completo
    const { hasPracticed, hasIllness, purpose, bloodType } = formData;
    if (!hasPracticed || !hasIllness || !purpose || !bloodType) {
      alert("Por favor completa todas las preguntas");
      return;
    }

    // Preparar datos para enviar
    const dataToSend = {
      aluctr: studentData.numeroControl,
      actividadId: formSport.actividadId,
      ofertaId: formSport.ofertaId,
      formData: { ...formData },
    };

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/inscripciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (response.ok) {
        // Ejecutar callback de éxito (ej: actualizar tipo de sangre)
        if (onSuccess) {
          onSuccess(formData.bloodType);
        }

        // Limpiar formulario y cerrar
        cancelarInscripcion();

        alert(`Inscripción a ${formSport.name} registrada exitosamente`);
      } else {
        alert(
          "Error al registrar inscripción: " +
            (data.error || "Error desconocido")
        );
      }
    } catch (error) {
      console.error("Error en submitInscripcion:", error);
      alert("Error de conexión al servidor");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // Estados
    formSport, // Datos de la actividad seleccionada
    showForm, // Si el formulario está visible
    isSubmitting, // Si está enviando datos
    formData, // Datos del formulario

    // Setters
    setFormData, // Para actualizar campos del formulario

    // Acciones
    iniciarInscripcion, // Abre el formulario de inscripción
    cancelarInscripcion, // Cierra y limpia el formulario
    submitInscripcion, // Envía la inscripción al servidor
  };
};
