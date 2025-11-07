import { useState } from "react";

export const useInscripcion = () => {
  const [formSport, setFormSport] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    hasPracticed: "",
    hasIllness: "",
    purpose: "",
    bloodType: "",
  });

  const iniciarInscripcion = (sport) => {
    setFormSport(sport);
    setShowForm(true);
    setFormData({
      hasPracticed: "",
      hasIllness: "",
      purpose: "",
      bloodType: "",
    });
  };

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

  const submitInscripcion = async (
    studentData,
    updateBloodType,
    formDataFromChild
  ) => {
    if (!formSport) {
      console.error("❌ No hay deporte seleccionado (formSport es null)");
      alert("Error: No se ha seleccionado ninguna actividad");
      return;
    }

    if (!formSport.actividadId || (!formSport.id && !formSport.ofertaId)) {
      console.error(formSport);
      alert("Error: Datos de actividad incompletos");
      return;
    }

    setIsSubmitting(true);

    try {
      // Construir payload aplanado
      const payload = {
        aluctr: studentData.numeroControl,
        actividadId: formSport.actividadId,
        ofertaId: formSport.ofertaId || formSport.id, // ← Soporta ambos nombres
        hasPracticed: formDataFromChild.hasPracticed,
        hasIllness: formDataFromChild.hasIllness,
        purpose: formDataFromChild.purpose,
        bloodType: formDataFromChild.bloodType,
      };

      // Verificación de campos
      const camposFaltantes = [];
      if (!payload.aluctr) camposFaltantes.push("aluctr (numeroControl)");
      if (!payload.actividadId) camposFaltantes.push("actividadId");
      if (!payload.ofertaId) camposFaltantes.push("ofertaId");
      if (!payload.hasPracticed) camposFaltantes.push("hasPracticed");
      if (!payload.hasIllness) camposFaltantes.push("hasIllness");
      if (!payload.purpose) camposFaltantes.push("purpose");
      if (!payload.bloodType) camposFaltantes.push("bloodType");

      if (camposFaltantes.length > 0) {
        throw new Error(
          `Faltan campos en el payload: ${camposFaltantes.join(", ")}`
        );
      }

      const response = await fetch("/api/inscripciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al inscribir");
      }

      // Actualizar tipo de sangre si cambió
      if (
        formDataFromChild.bloodType &&
        formDataFromChild.bloodType !== studentData.bloodType &&
        updateBloodType
      ) {
        updateBloodType(formDataFromChild.bloodType);
      }

      alert("¡Inscripción exitosa!");
      cancelarInscripcion();

      return data;
    } catch (error) {
      console.error("❌ Error en inscripción:", error);
      alert(error.message || "Error al procesar la inscripción");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formSport,
    showForm,
    isSubmitting,
    formData,
    setFormData,
    iniciarInscripcion,
    cancelarInscripcion,
    submitInscripcion,
  };
};
