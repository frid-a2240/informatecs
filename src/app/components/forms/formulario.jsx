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
  const steps = [
    "purpose", // ✅ NUEVO PASO
    "hasCondition",
    "takesMedication",
    "hasAllergy",
    "hasInjury",
    "hasRestriction",
  ];

  const handleNext = () => {
    const currentField = steps[currentStep];

    if (!formData[currentField]) {
      alert("Por favor completa este campo antes de continuar.");
      return;
    }

    // ✅ Validación específica del nuevo campo purpose
    if (currentStep === 0 && !formData.purpose) {
      alert("Por favor selecciona el propósito de tu inscripción.");
      return;
    }

    if (currentStep === 1 && formData.hasCondition === "si" && !formData.conditionDetails) {
      alert("Por favor especifica tu condición médica.");
      return;
    }

    if (currentStep === 2 && formData.takesMedication === "si" && !formData.medicationDetails) {
      alert("Por favor especifica qué medicamentos tomas.");
      return;
    }

    if (currentStep === 3 && formData.hasAllergy === "si" && !formData.allergyDetails) {
      alert("Por favor especifica tu alergia.");
      return;
    }

    if (currentStep === 4 && formData.hasInjury === "si" && !formData.injuryDetails) {
      alert("Por favor describe tu lesión.");
      return;
    }

    if (currentStep === 5 && formData.hasRestriction === "si" && !formData.restrictionDetails) {
      alert("Por favor indica tu restricción médica.");
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const onSubmit = () => {
    // ✅ Validar que el purpose esté seleccionado
    if (!formData.purpose) {
      alert("Por favor selecciona el propósito de tu inscripción.");
      return;
    }

    if (
      !formData.hasCondition ||
      !formData.takesMedication ||
      !formData.hasAllergy ||
      !formData.hasInjury ||
      !formData.hasRestriction
    ) {
      alert("Por favor completa todos los campos antes de enviar.");
      return;
    }

    if (formData.hasCondition === "si" && !formData.conditionDetails) {
      alert("Por favor especifica tu condición médica.");
      return;
    }

    if (formData.takesMedication === "si" && !formData.medicationDetails) {
      alert("Por favor especifica qué medicamentos tomas.");
      return;
    }

    if (formData.hasAllergy === "si" && !formData.allergyDetails) {
      alert("Por favor especifica tu alergia.");
      return;
    }

    if (formData.hasInjury === "si" && !formData.injuryDetails) {
      alert("Por favor describe tu lesión.");
      return;
    }

    if (formData.hasRestriction === "si" && !formData.restrictionDetails) {
      alert("Por favor indica tu restricción médica.");
      return;
    }

    handleFormSubmit(formData);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          maxWidth: "600px",
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            padding: "1.5rem",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#1f2937" }}>
            Inscripción a {selectedSport?.name ?? "la actividad seleccionada"}
          </h3>
          <button
            onClick={cancelar}
            disabled={isSubmitting}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: "#f3f4f6",
              cursor: "pointer",
              fontSize: "1.25rem",
              color: "#6b7280",
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: "0 1.5rem", marginTop: "1rem" }}>
          <div
            style={{
              height: "8px",
              backgroundColor: "#e5e7eb",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                backgroundColor: "#3b82f6",
                width: `${((currentStep + 1) / steps.length) * 100}%`,
                transition: "width 0.3s",
              }}
            />
          </div>
          <p
            style={{
              textAlign: "center",
              marginTop: "0.5rem",
              fontSize: "0.875rem",
              color: "#6b7280",
            }}
          >
            Paso {currentStep + 1} de {steps.length}
          </p>
        </div>

        <div style={{ padding: "1.5rem" }}>
          {/* ✅ NUEVO PASO 1: PROPÓSITO DE INSCRIPCIÓN */}
          {currentStep === 0 && (
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.75rem",
                  fontWeight: 500,
                  fontSize: "1rem",
                }}
              >
                1. ¿Cuál es el propósito de tu inscripción?
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[
                  { value: "creditos", label: "Créditos" },
                  { value: "servicio_social", label: "Servicio Social" },
                  { value: "por_gusto", label: "Por Gusto" },
                ].map((opcion) => (
                  <label
                    key={opcion.value}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.75rem",
                      border: formData.purpose === opcion.value ? "2px solid #3b82f6" : "2px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      backgroundColor: formData.purpose === opcion.value ? "#eff6ff" : "white",
                    }}
                  >
                    <input
                      type="radio"
                      name="purpose"
                      value={opcion.value}
                      checked={formData.purpose === opcion.value}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          purpose: e.target.value,
                        })
                      }
                      disabled={isSubmitting}
                      style={{
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                      }}
                    />
                    <span style={{ fontWeight: 500, fontSize: "1rem" }}>
                      {opcion.label}
                    </span>
                  </label>
                ))}
              </div>
              <p
                style={{
                  marginTop: "1rem",
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  fontStyle: "italic",
                }}
              >
                💡 Selecciona la razón principal por la que te inscribes a esta actividad.
              </p>
            </div>
          )}

          {/* PASO 2: CONDICIÓN MÉDICA */}
          {currentStep === 1 && (
            <div>
              <label style={{ display: "block", marginBottom: "0.75rem", fontWeight: 500 }}>
                2. ¿Tienes alguna condición médica que debamos considerar?
              </label>
              <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                {["si", "no"].map((opcion) => (
                  <label
                    key={opcion}
                    style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}
                  >
                    <input
                      type="radio"
                      name="hasCondition"
                      value={opcion}
                      checked={formData.hasCondition === opcion}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hasCondition: e.target.value,
                          conditionDetails: e.target.value === "no" ? "" : formData.conditionDetails,
                        })
                      }
                      disabled={isSubmitting}
                    />
                    <span>{opcion === "si" ? "Sí" : "No"}</span>
                  </label>
                ))}
              </div>

              {formData.hasCondition === "si" && (
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
                    Especifica cuál:
                  </label>
                  <textarea
                    placeholder="Describe tu condición médica..."
                    value={formData.conditionDetails || ""}
                    onChange={(e) => setFormData({ ...formData, conditionDetails: e.target.value })}
                    disabled={isSubmitting}
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "0.5rem",
                      resize: "vertical",
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* PASO 3: MEDICACIÓN */}
          {currentStep === 2 && (
            <div>
              <label style={{ display: "block", marginBottom: "0.75rem", fontWeight: 500 }}>
                3. ¿Tomas algún medicamento de forma regular?
              </label>
              <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                {["si", "no"].map((opcion) => (
                  <label
                    key={opcion}
                    style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}
                  >
                    <input
                      type="radio"
                      name="takesMedication"
                      value={opcion}
                      checked={formData.takesMedication === opcion}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          takesMedication: e.target.value,
                          medicationDetails: e.target.value === "no" ? "" : formData.medicationDetails,
                        })
                      }
                      disabled={isSubmitting}
                    />
                    <span>{opcion === "si" ? "Sí" : "No"}</span>
                  </label>
                ))}
              </div>

              {formData.takesMedication === "si" && (
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
                    Especifica cuál:
                  </label>
                  <textarea
                    placeholder="Indica qué medicamentos tomas..."
                    value={formData.medicationDetails || ""}
                    onChange={(e) => setFormData({ ...formData, medicationDetails: e.target.value })}
                    disabled={isSubmitting}
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "0.5rem",
                      resize: "vertical",
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* PASO 4: ALERGIAS */}
          {currentStep === 3 && (
            <div>
              <label style={{ display: "block", marginBottom: "0.75rem", fontWeight: 500 }}>
                4. ¿Tienes alguna alergia importante?
              </label>
              <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                {["si", "no"].map((opcion) => (
                  <label
                    key={opcion}
                    style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}
                  >
                    <input
                      type="radio"
                      name="hasAllergy"
                      value={opcion}
                      checked={formData.hasAllergy === opcion}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hasAllergy: e.target.value,
                          allergyDetails: e.target.value === "no" ? "" : formData.allergyDetails,
                        })
                      }
                      disabled={isSubmitting}
                    />
                    <span>{opcion === "si" ? "Sí" : "No"}</span>
                  </label>
                ))}
              </div>

              {formData.hasAllergy === "si" && (
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
                    Especifica cuál:
                  </label>
                  <textarea
                    placeholder="Describe tu alergia..."
                    value={formData.allergyDetails || ""}
                    onChange={(e) => setFormData({ ...formData, allergyDetails: e.target.value })}
                    disabled={isSubmitting}
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "0.5rem",
                      resize: "vertical",
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* PASO 5: LESIONES */}
          {currentStep === 4 && (
            <div>
              <label style={{ display: "block", marginBottom: "0.75rem", fontWeight: 500 }}>
                5. ¿Has sufrido alguna lesión reciente?
              </label>
              <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                {["si", "no"].map((opcion) => (
                  <label
                    key={opcion}
                    style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}
                  >
                    <input
                      type="radio"
                      name="hasInjury"
                      value={opcion}
                      checked={formData.hasInjury === opcion}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hasInjury: e.target.value,
                          injuryDetails: e.target.value === "no" ? "" : formData.injuryDetails,
                        })
                      }
                      disabled={isSubmitting}
                    />
                    <span>{opcion === "si" ? "Sí" : "No"}</span>
                  </label>
                ))}
              </div>

              {formData.hasInjury === "si" && (
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
                    Describe la lesión:
                  </label>
                  <textarea
                    placeholder="Describe tu lesión reciente..."
                    value={formData.injuryDetails || ""}
                    onChange={(e) => setFormData({ ...formData, injuryDetails: e.target.value })}
                    disabled={isSubmitting}
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "0.5rem",
                      resize: "vertical",
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* PASO 6: RESTRICCIONES */}
          {currentStep === 5 && (
            <div>
              <label style={{ display: "block", marginBottom: "0.75rem", fontWeight: 500 }}>
                6. ¿Tienes alguna restricción médica para realizar actividad física?
              </label>
              <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                {["si", "no"].map((opcion) => (
                  <label
                    key={opcion}
                    style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}
                  >
                    <input
                      type="radio"
                      name="hasRestriction"
                      value={opcion}
                      checked={formData.hasRestriction === opcion}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hasRestriction: e.target.value,
                          restrictionDetails: e.target.value === "no" ? "" : formData.restrictionDetails,
                        })
                      }
                      disabled={isSubmitting}
                    />
                    <span>{opcion === "si" ? "Sí" : "No"}</span>
                  </label>
                ))}
              </div>

              {formData.hasRestriction === "si" && (
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
                    Indica cuál:
                  </label>
                  <textarea
                    placeholder="Describe tu restricción médica..."
                    value={formData.restrictionDetails || ""}
                    onChange={(e) => setFormData({ ...formData, restrictionDetails: e.target.value })}
                    disabled={isSubmitting}
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "0.5rem",
                      resize: "vertical",
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div
          style={{
            padding: "1.5rem",
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            gap: "0.75rem",
            justifyContent: "flex-end",
          }}
        >
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              disabled={isSubmitting}
              style={{
                padding: "0.5rem 1.5rem",
                backgroundColor: "#f3f4f6",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Atrás
            </button>
          )}
          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              style={{
                padding: "0.5rem 1.5rem",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Siguiente
            </button>
          ) : (
            <button
              onClick={onSubmit}
              disabled={isSubmitting}
              style={{
                padding: "0.5rem 1.5rem",
                backgroundColor: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              {isSubmitting ? "Enviando..." : "Enviar Inscripción"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActividadForm;
