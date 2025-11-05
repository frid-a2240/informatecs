"use client";
import React, { useState } from "react";

const ActividadForm = ({
  formData = {}, // valor por defecto
  setFormData,
  handleFormSubmit,
  selectedSport,
  cancelar,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = ["hasPracticed", "hasIllness", "purpose", "bloodType"];

  const handleNext = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  // Valores por defecto seguros
  const safeFormData = {
    hasPracticed: formData.hasPracticed || "",
    hasIllness: formData.hasIllness || "",
    purpose: formData.purpose || "",
    bloodType: formData.bloodType || "",
  };

  return (
    <div className="actividad-form-wrapper">
      <div className="actividad-form">
        <div className="actividad-form-header">
          <h3>
            Inscripción a {selectedSport?.name ?? "la actividad seleccionada"}
          </h3>
          <button className="close-btn" onClick={cancelar}>
            ✕
          </button>
        </div>

        {/* Barra de progreso */}
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        <form onSubmit={handleFormSubmit}>
          {/* Pregunta 1 */}
          {currentStep === 0 && (
            <div className="pregunta-card p-color1">
              <label>1. ¿Has practicado esta actividad antes?</label>
              <label>
                <input
                  type="radio"
                  name="hasPracticed"
                  value="si"
                  checked={safeFormData.hasPracticed === "si"}
                  onChange={(e) =>
                    setFormData({ ...formData, hasPracticed: e.target.value })
                  }
                />{" "}
                Sí
              </label>
              <label>
                <input
                  type="radio"
                  name="hasPracticed"
                  value="no"
                  checked={safeFormData.hasPracticed === "no"}
                  onChange={(e) =>
                    setFormData({ ...formData, hasPracticed: e.target.value })
                  }
                />{" "}
                No
              </label>
            </div>
          )}

          {/* Pregunta 2 */}
          {currentStep === 1 && (
            <div className="pregunta-card p-color2">
              <label>2. ¿Tienes alguna enfermedad o lesión relevante?</label>
              <label>
                <input
                  type="radio"
                  name="hasIllness"
                  value="si"
                  checked={safeFormData.hasIllness === "si"}
                  onChange={(e) =>
                    setFormData({ ...formData, hasIllness: e.target.value })
                  }
                />{" "}
                Sí
              </label>
              <label>
                <input
                  type="radio"
                  name="hasIllness"
                  value="no"
                  checked={safeFormData.hasIllness === "no"}
                  onChange={(e) =>
                    setFormData({ ...formData, hasIllness: e.target.value })
                  }
                />{" "}
                No
              </label>
            </div>
          )}

          {/* Pregunta 3 */}
          {currentStep === 2 && (
            <div className="pregunta-card p-color3">
              <label>3. Propósito de inscripción:</label>
              <input
                type="text"
                placeholder="Ej: Obtener créditos complementarios"
                value={safeFormData.purpose}
                onChange={(e) =>
                  setFormData({ ...formData, purpose: e.target.value })
                }
              />
            </div>
          )}

          {/* Pregunta 4 */}
          {currentStep === 3 && (
            <div className="pregunta-card p-color4">
              <label>4. Tipo de sangre:</label>
              <select
                value={safeFormData.bloodType}
                onChange={(e) =>
                  setFormData({ ...formData, bloodType: e.target.value })
                }
              >
                <option value="">Selecciona tu tipo de sangre</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          )}

          {/* Botones de navegación */}
          <div className="form-buttons">
            {currentStep > 0 && (
              <button type="button" className="back-btn" onClick={handleBack}>
                Atrás
              </button>
            )}
            {currentStep < steps.length - 1 ? (
              <button type="button" className="next-btn" onClick={handleNext}>
                Siguiente
              </button>
            ) : (
              <button type="submit" className="submit-btn">
                Enviar Inscripción
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActividadForm;
