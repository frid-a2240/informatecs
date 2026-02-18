"use client";
import React, { useState, useEffect } from "react";

const ActividadForm = ({
  formData = {},
  setFormData,
  handleFormSubmit,
  selectedSport,
  cancelar,
  isSubmitting = false,
  aluctr,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [bloodData, setBloodData] = useState({ status: "loading", data: null });
  const [fileError, setFileError] = useState("");

  // Definición de todos los pasos
  const steps = [
    "purpose", // 0
    "bloodType", // 1
    "hasCondition", // 2
    "takesMedication", // 3
    "hasAllergy", // 4
    "hasInjury", // 5
    "hasRestriction", // 6
  ];

  // 1. Verificar estado de sangre al cargar
  useEffect(() => {
    const checkBloodStatus = async () => {
      try {
        const res = await fetch(`/api/sangre?aluctr=${aluctr}`);
        const data = await res.json();
        setBloodData({ status: "ready", data });

        if (data.estudiante?.alutsa) {
          setFormData((prev) => ({
            ...prev,
            bloodType: data.estudiante.alutsa,
          }));
        }
      } catch (err) {
        console.error("Error consultando sangre:", err);
      }
    };
    if (aluctr) checkBloodStatus();
  }, [aluctr, setFormData]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setFileError("");

    if (!file) return;
    if (file.type !== "application/pdf") {
      setFileError("El archivo debe ser un PDF.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setFileError("El archivo es demasiado grande (máx 2MB).");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({
        ...formData,
        bloodTypeFile: reader.result,
        bloodTypeFileName: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleNext = () => {
    const currentField = steps[currentStep];

    // Validación específica para el paso de sangre
    if (currentField === "bloodType") {
      const isAlreadyValidated = bloodData.data?.estudiante?.alutsa;
      const hasPendingRequest = bloodData.data?.tieneSolicitudPendiente;

      if (!isAlreadyValidated && !hasPendingRequest) {
        if (!formData.bloodType) return alert("Selecciona tu tipo de sangre.");
        if (!formData.bloodTypeFile)
          return alert("Sube el comprobante en PDF.");
      }
    } else {
      // Validación general: que no esté vacío
      if (!formData[currentField] || formData[currentField].trim() === "") {
        alert(
          "Por favor completa este campo antes de continuar (puedes poner 'Ninguna' si no aplica).",
        );
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <div style={headerStyle}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 600 }}>
            Inscripción: {selectedSport?.name || "Actividad"}
          </h3>
          <button onClick={cancelar} style={closeButtonStyle}>
            ✕
          </button>
        </div>

        {/* Barra de Progreso */}
        <div style={{ padding: "0 1.5rem", marginTop: "1rem" }}>
          <div style={progressBarStyle}>
            <div
              style={{
                ...progressFillStyle,
                width: `${((currentStep + 1) / steps.length) * 100}%`,
              }}
            />
          </div>
          <p style={stepTextStyle}>
            Paso {currentStep + 1} de {steps.length}
          </p>
        </div>

        <div style={{ padding: "1.5rem", minHeight: "250px" }}>
          {/* PASO 0: PROPÓSITO */}
          {currentStep === 0 && (
            <div className="animate-fade-in">
              <label style={labelStyle}>
                1. ¿Cuál es el propósito de tu inscripción?
              </label>
              <div style={radioContainerStyle}>
                {["creditos", "servicio_social", "por_gusto"].map((val) => (
                  <label
                    key={val}
                    style={radioOptionStyle(formData.purpose === val)}
                  >
                    <input
                      type="radio"
                      style={{ marginRight: "10px" }}
                      checked={formData.purpose === val}
                      onChange={() =>
                        setFormData({ ...formData, purpose: val })
                      }
                    />
                    {val.replace("_", " ").toUpperCase()}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* PASO 1: SANGRE */}
          {currentStep === 1 && (
            <div className="animate-fade-in">
              <label style={labelStyle}>2. Información de Tipo de Sangre</label>
              {bloodData.data?.estudiante?.alutsa ? (
                <div style={validatedBoxStyle}>
                  <p>
                    ✅ Sangre validada:{" "}
                    <strong>{bloodData.data.estudiante.alutsa}</strong>
                  </p>
                </div>
              ) : bloodData.data?.tieneSolicitudPendiente ? (
                <div style={pendingBoxStyle}>
                  <p>
                    ⏳ Validación pendiente:{" "}
                    <strong>
                      {bloodData.data.solicitudPendiente.tipoSangreSolicitado}
                    </strong>
                  </p>
                  <p style={{ fontSize: "0.8rem", marginTop: "5px" }}>
                    Puedes continuar, la inscripción se procesará tras la
                    validación.
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <select
                    value={formData.bloodType || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, bloodType: e.target.value })
                    }
                    style={inputStyle}
                  >
                    <option value="">Selecciona tipo de sangre...</option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                      (t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ),
                    )}
                  </select>
                  <div style={uploadBoxStyle}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontSize: "0.85rem",
                      }}
                    >
                      Comprobante Oficial (PDF):
                    </label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                    />
                    {fileError && (
                      <p style={{ color: "red", fontSize: "0.75rem" }}>
                        {fileError}
                      </p>
                    )}
                    {formData.bloodTypeFileName && (
                      <p style={{ color: "green", fontSize: "0.75rem" }}>
                        ✔ {formData.bloodTypeFileName}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PASO 2: CONDICIÓN CRÓNICA */}
          {currentStep === 2 && (
            <div className="animate-fade-in">
              <label style={labelStyle}>
                3. ¿Padeces alguna enfermedad crónica?
              </label>
              <p style={helperTextStyle}>
                Ejemplo: Asma, Diabetes, Epilepsia, o "Ninguna".
              </p>
              <textarea
                style={textareaStyle}
                placeholder="Escribe aquí tu respuesta..."
                value={formData.hasCondition || ""}
                onChange={(e) =>
                  setFormData({ ...formData, hasCondition: e.target.value })
                }
              />
            </div>
          )}

          {/* PASO 3: MEDICAMENTOS */}
          {currentStep === 3 && (
            <div className="animate-fade-in">
              <label style={labelStyle}>
                4. ¿Tomas algún medicamento actualmente?
              </label>
              <p style={helperTextStyle}>
                Indica el nombre y frecuencia, o "Ninguno".
              </p>
              <textarea
                style={textareaStyle}
                placeholder="Escribe aquí tu respuesta..."
                value={formData.takesMedication || ""}
                onChange={(e) =>
                  setFormData({ ...formData, takesMedication: e.target.value })
                }
              />
            </div>
          )}

          {/* PASO 4: ALERGIAS */}
          {currentStep === 4 && (
            <div className="animate-fade-in">
              <label style={labelStyle}>5. ¿Eres alérgico a algo?</label>
              <p style={helperTextStyle}>
                Medicamentos, alimentos o picaduras, o "Ninguna".
              </p>
              <textarea
                style={textareaStyle}
                placeholder="Escribe aquí tu respuesta..."
                value={formData.hasAllergy || ""}
                onChange={(e) =>
                  setFormData({ ...formData, hasAllergy: e.target.value })
                }
              />
            </div>
          )}

          {/* PASO 5: LESIONES */}
          {currentStep === 5 && (
            <div className="animate-fade-in">
              <label style={labelStyle}>
                6. ¿Tienes alguna lesión reciente o antigua?
              </label>
              <p style={helperTextStyle}>
                Ejemplo: Fracturas, esguinces o cirugías, o "Ninguna".
              </p>
              <textarea
                style={textareaStyle}
                placeholder="Escribe aquí tu respuesta..."
                value={formData.hasInjury || ""}
                onChange={(e) =>
                  setFormData({ ...formData, hasInjury: e.target.value })
                }
              />
            </div>
          )}

          {/* PASO 6: RESTRICCIONES */}
          {currentStep === 6 && (
            <div className="animate-fade-in">
              <label style={labelStyle}>
                7. ¿Tienes alguna restricción física para el ejercicio?
              </label>
              <p style={helperTextStyle}>
                Cualquier indicación médica especial, o "Ninguna".
              </p>
              <textarea
                style={textareaStyle}
                placeholder="Escribe aquí tu respuesta..."
                value={formData.hasRestriction || ""}
                onChange={(e) =>
                  setFormData({ ...formData, hasRestriction: e.target.value })
                }
              />
            </div>
          )}
        </div>

        {/* Footer con Botones */}
        <div style={footerStyle}>
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              disabled={isSubmitting}
              style={backButtonStyle}
            >
              Atrás
            </button>
          )}
          <button
            onClick={
              currentStep < steps.length - 1
                ? handleNext
                : () => handleFormSubmit(formData)
            }
            disabled={isSubmitting}
            style={
              currentStep < steps.length - 1
                ? nextButtonStyle
                : submitButtonStyle
            }
          >
            {isSubmitting
              ? "Enviando..."
              : currentStep < steps.length - 1
                ? "Siguiente"
                : "Finalizar Inscripción"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- ESTILOS ADICIONALES Y ACTUALIZADOS ---
const helperTextStyle = {
  fontSize: "0.85rem",
  color: "#6b7280",
  marginBottom: "10px",
};

const textareaStyle = {
  width: "100%",
  minHeight: "120px",
  padding: "0.75rem",
  borderRadius: "0.5rem",
  border: "1px solid #d1d5db",
  fontFamily: "inherit",
  resize: "none",
  outline: "none",
  fontSize: "0.95rem",
};

// Se mantienen los estilos anteriores...
const modalOverlayStyle = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: "1rem",
};
const modalContentStyle = {
  backgroundColor: "white",
  borderRadius: "12px",
  maxWidth: "550px",
  width: "100%",
  maxHeight: "90vh",
  overflow: "auto",
};
const headerStyle = {
  padding: "1.25rem 1.5rem",
  borderBottom: "1px solid #e5e7eb",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};
const closeButtonStyle = {
  background: "none",
  border: "none",
  fontSize: "1.2rem",
  cursor: "pointer",
  color: "#9ca3af",
};
const progressBarStyle = {
  height: "6px",
  backgroundColor: "#e5e7eb",
  borderRadius: "3px",
  overflow: "hidden",
};
const progressFillStyle = {
  height: "100%",
  backgroundColor: "#3b82f6",
  transition: "width 0.3s",
};
const stepTextStyle = {
  textAlign: "center",
  marginTop: "8px",
  fontSize: "0.75rem",
  color: "#6b7280",
  fontWeight: 500,
};
const labelStyle = {
  display: "block",
  marginBottom: "5px",
  fontWeight: 600,
  fontSize: "1.05rem",
  color: "#111827",
};
const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "0.5rem",
  border: "1px solid #d1d5db",
};
const validatedBoxStyle = {
  padding: "1rem",
  backgroundColor: "#ecfdf5",
  border: "1px solid #10b981",
  borderRadius: "0.5rem",
  color: "#065f46",
};
const pendingBoxStyle = {
  padding: "1rem",
  backgroundColor: "#fffbeb",
  border: "1px solid #f59e0b",
  borderRadius: "0.5rem",
  color: "#92400e",
};
const uploadBoxStyle = {
  padding: "0.75rem",
  border: "2px dashed #e5e7eb",
  borderRadius: "0.5rem",
};
const radioContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
};
const radioOptionStyle = (selected) => ({
  display: "flex",
  alignItems: "center",
  padding: "0.75rem",
  border: selected ? "2px solid #3b82f6" : "1px solid #e5e7eb",
  borderRadius: "0.5rem",
  cursor: "pointer",
  backgroundColor: selected ? "#eff6ff" : "transparent",
  fontWeight: selected ? 600 : 400,
});
const footerStyle = {
  padding: "1.25rem 1.5rem",
  borderTop: "1px solid #e5e7eb",
  display: "flex",
  gap: "10px",
  justifyContent: "flex-end",
};
const backButtonStyle = {
  padding: "0.6rem 1.2rem",
  backgroundColor: "#f3f4f6",
  border: "none",
  borderRadius: "0.5rem",
  cursor: "pointer",
  fontWeight: 500,
};
const nextButtonStyle = {
  padding: "0.6rem 1.2rem",
  backgroundColor: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "0.5rem",
  cursor: "pointer",
  fontWeight: 500,
};
const submitButtonStyle = {
  padding: "0.6rem 1.2rem",
  backgroundColor: "#10b981",
  color: "white",
  border: "none",
  borderRadius: "0.5rem",
  cursor: "pointer",
  fontWeight: 600,
};

export default ActividadForm;
