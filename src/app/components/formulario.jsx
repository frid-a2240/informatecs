"use client";
import React, { useState } from "react";

const ActividadForm = ({
  formData = {},
  setFormData,
  handleFormSubmit,
  selectedSport,
  cancelar,
  isSubmitting = false,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ["hasPracticed", "hasIllness", "purpose", "bloodType"];

  const handleNext = () => {
    const currentField = steps[currentStep];
    if (!formData[currentField]) {
      alert("Por favor completa este campo antes de continuar.");
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const onSubmit = (e) => {
    e.preventDefault();

    console.log("🔵 onSubmit ejecutado");
    console.log("🔵 formData actual:", formData);

    // Validar directamente del formData
    if (
      !formData.hasPracticed ||
      !formData.hasIllness ||
      !formData.purpose ||
      !formData.bloodType
    ) {
      console.error("❌ Faltan datos:", formData);
      alert("Por favor completa todos los campos antes de enviar.");
      return;
    }

    console.log("✅ Datos completos, enviando:", formData);

    // Enviar directamente el formData
    handleFormSubmit(formData);
  };

  return (
    <div className="actividad-form-wrapper">
      <div className="actividad-form">
        <div className="actividad-form-header">
          <h3>
            Inscripción a {selectedSport?.name ?? "la actividad seleccionada"}
          </h3>
          <button
            type="button"
            className="close-btn"
            onClick={cancelar}
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
            }}
          />
        </div>

        <form onSubmit={onSubmit}>
          {currentStep === 0 && (
            <div className="pregunta-card p-color1">
              <label>1. ¿Has practicado esta actividad antes?</label>
              <div className="radio-group">
                {["si", "no"].map((opcion) => (
                  <label key={opcion}>
                    <input
                      type="radio"
                      name="hasPracticed"
                      value={opcion}
                      checked={formData.hasPracticed === opcion}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hasPracticed: e.target.value,
                        })
                      }
                      disabled={isSubmitting}
                    />
                    {opcion === "si" ? "Sí" : "No"}
                  </label>
                ))}
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="pregunta-card p-color2">
              <label>2. ¿Tienes alguna enfermedad o lesión relevante?</label>
              <div className="radio-group">
                {["si", "no"].map((opcion) => (
                  <label key={opcion}>
                    <input
                      type="radio"
                      name="hasIllness"
                      value={opcion}
                      checked={formData.hasIllness === opcion}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hasIllness: e.target.value,
                        })
                      }
                      disabled={isSubmitting}
                    />
                    {opcion === "si" ? "Sí" : "No"}
                  </label>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="pregunta-card p-color3">
              <label>3. Propósito de inscripción:</label>
              <input
                type="text"
                placeholder="Ej: Obtener créditos complementarios"
                value={formData.purpose}
                onChange={(e) =>
                  setFormData({ ...formData, purpose: e.target.value })
                }
                disabled={isSubmitting}
              />
            </div>
          )}

          {currentStep === 3 && (
            <div className="pregunta-card p-color4">
              <label>4. Tipo de sangre:</label>
              <select
                value={formData.bloodType}
                onChange={(e) =>
                  setFormData({ ...formData, bloodType: e.target.value })
                }
                disabled={isSubmitting}
              >
                <option value="">Selecciona tu tipo de sangre</option>
                {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map(
                  (tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  )
                )}
              </select>
            </div>
          )}

          <div className="form-buttons">
            {currentStep > 0 && (
              <button
                type="button"
                className="back-btn"
                onClick={handleBack}
                disabled={isSubmitting}
              >
                Atrás
              </button>
            )}
            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                className="next-btn"
                onClick={handleNext}
                disabled={isSubmitting}
              >
                Siguiente
              </button>
            ) : (
              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Enviar Inscripción"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActividadForm;
