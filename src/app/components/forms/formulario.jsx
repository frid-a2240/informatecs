"use client";
import React, { useState, useEffect } from "react";

const ActividadForm = ({
  formData = {},
  setFormData,
  handleFormSubmit,
  selectedSport,
  cancelar,
  isSubmitting = false,
  aluctr, // Asegúrate de pasar el número de control del usuario actual
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [bloodData, setBloodData] = useState({ status: "loading", data: null });
  const [fileError, setFileError] = useState("");

  // Definición de pasos incluyendo el nuevo de sangre
  const steps = [
    "purpose",
    "bloodType", // ✅ NUEVO PASO
    "hasCondition",
    "takesMedication",
    "hasAllergy",
    "hasInjury",
    "hasRestriction",
  ];

  // 1. Verificar estado de sangre al cargar
  useEffect(() => {
    const checkBloodStatus = async () => {
      try {
        const res = await fetch(`/api/sangre?aluctr=${aluctr}`);
        const data = await res.json();
        setBloodData({ status: "ready", data });

        // Si ya tiene sangre validada, la pre-cargamos
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
  }, [aluctr]);

  // Manejador de archivo PDF
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setFileError("");

    if (!file) return;
    if (file.type !== "application/pdf") {
      setFileError("El archivo debe ser un PDF.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      // 2MB limit
      setFileError("El archivo es demasiado grande (máx 2MB).");
      return;
    }

    // Convertir a Base64 para enviar al servidor
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

    // Validación paso sangre
    if (currentField === "bloodType") {
      const needsValidation = !bloodData.data?.estudiante?.alutsa;
      if (needsValidation) {
        if (!formData.bloodType) return alert("Selecciona tu tipo de sangre.");
        if (!formData.bloodTypeFile)
          return alert("Sube el comprobante en PDF.");
      }
    }

    if (!formData[currentField] && currentField !== "bloodType") {
      alert("Por favor completa este campo antes de continuar.");
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <div style={headerStyle}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 600 }}>
            Inscripción: {selectedSport?.name}
          </h3>
          <button onClick={cancelar} style={closeButtonStyle}>
            ✕
          </button>
        </div>

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

        <div style={{ padding: "1.5rem" }}>
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

          {/* ✅ NUEVO PASO 1: TIPO DE SANGRE */}
          {currentStep === 1 && (
            <div>
              <label style={labelStyle}>2. Información de Tipo de Sangre</label>

              {bloodData.data?.estudiante?.alutsa ? (
                <div style={validatedBoxStyle}>
                  <p>
                    ✅ Tu tipo de sangre ya está validado:{" "}
                    <strong>{bloodData.data.estudiante.alutsa}</strong>
                  </p>
                </div>
              ) : bloodData.data?.tieneSolicitudPendiente ? (
                <div style={pendingBoxStyle}>
                  <p>
                    ⏳ Tienes una validación pendiente:{" "}
                    <strong>
                      {bloodData.data.solicitudPendiente.tipoSangreSolicitado}
                    </strong>
                  </p>
                  <p style={{ fontSize: "0.8rem" }}>
                    Puedes continuar con el formulario, pero tu inscripción
                    final dependerá de esta validación.
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
                  <p style={{ fontSize: "0.9rem", color: "#666" }}>
                    Requerimos un comprobante oficial de tu tipo de sangre.
                  </p>

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
                        fontWeight: 500,
                        display: "block",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Comprobante (PDF):
                    </label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                    />
                    {fileError && (
                      <p style={{ color: "red", fontSize: "0.8rem" }}>
                        {fileError}
                      </p>
                    )}
                    {formData.bloodTypeFileName && (
                      <p style={{ color: "green", fontSize: "0.8rem" }}>
                        ✔ {formData.bloodTypeFileName}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ... (RESTO DE LOS PASOS: MEDICAMENTOS, ALERGIAS, ETC IGUAL QUE TU CÓDIGO) ... */}
          {/* Nota: Solo asegúrate de ajustar los índices currentStep === 2, 3, 4, 5, 6 */}
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
              ? "Procesando..."
              : currentStep < steps.length - 1
                ? "Siguiente"
                : "Enviar Inscripción"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- ESTILOS (Añadidos para los nuevos elementos) ---
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
  maxWidth: "600px",
  width: "100%",
  maxHeight: "90vh",
  overflow: "auto",
};
const headerStyle = {
  padding: "1.5rem",
  borderBottom: "1px solid #e5e7eb",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};
const closeButtonStyle = {
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  border: "none",
  cursor: "pointer",
};
const progressBarStyle = {
  height: "8px",
  backgroundColor: "#e5e7eb",
  borderRadius: "4px",
  overflow: "hidden",
};
const progressFillStyle = {
  height: "100%",
  backgroundColor: "#3b82f6",
  transition: "width 0.3s",
};
const stepTextStyle = {
  textAlign: "center",
  marginTop: "0.5rem",
  fontSize: "0.875rem",
  color: "#6b7280",
};
const labelStyle = {
  display: "block",
  marginBottom: "0.75rem",
  fontWeight: 500,
  fontSize: "1rem",
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
  padding: "1rem",
  border: "2px dashed #e5e7eb",
  borderRadius: "0.5rem",
};
const radioContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
};
const radioOptionStyle = (selected) => ({
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  padding: "0.75rem",
  border: selected ? "2px solid #3b82f6" : "2px solid #e5e7eb",
  borderRadius: "0.5rem",
  cursor: "pointer",
  backgroundColor: selected ? "#eff6ff" : "white",
});
const footerStyle = {
  padding: "1.5rem",
  borderTop: "1px solid #e5e7eb",
  display: "flex",
  gap: "0.75rem",
  justifyContent: "flex-end",
};
const backButtonStyle = {
  padding: "0.5rem 1.5rem",
  backgroundColor: "#f3f4f6",
  border: "none",
  borderRadius: "0.5rem",
  cursor: "pointer",
};
const nextButtonStyle = {
  padding: "0.5rem 1.5rem",
  backgroundColor: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "0.5rem",
  cursor: "pointer",
};
const submitButtonStyle = {
  padding: "0.5rem 1.5rem",
  backgroundColor: "#10b981",
  color: "white",
  border: "none",
  borderRadius: "0.5rem",
  cursor: "pointer",
};

export default ActividadForm;
