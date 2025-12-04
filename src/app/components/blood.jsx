"use client";
import React, { useState, useEffect } from "react";
import { Droplets, Upload, Check, AlertCircle } from "lucide-react";

const BloodTypeValidator = ({ numeroControl }) => {
  const [bloodType, setBloodType] = useState("");
  const [bloodTypeFile, setBloodTypeFile] = useState(null);
  const [bloodTypeFileName, setBloodTypeFileName] = useState("");
  const [currentBloodType, setCurrentBloodType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (numeroControl) {
      cargarTipoSangre();
    }
  }, [numeroControl]);

  const cargarTipoSangre = async () => {
    try {
      const response = await fetch(`/api/sangre?aluctr=${numeroControl}`);
      const data = await response.json();
      if (data?.alutsa) {
        setCurrentBloodType(data.alutsa);
      }
    } catch (error) {
      // Error silencioso
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf",
      ];
      if (!validTypes.includes(file.type)) {
        alert("Solo se permiten archivos JPG, PNG o PDF");
        e.target.value = "";
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("El archivo no debe superar los 5MB");
        e.target.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setBloodTypeFile(reader.result);
        setBloodTypeFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!bloodType || !bloodTypeFile) {
      alert("Por favor completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/sangre", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          aluctr: numeroControl,
          bloodType,
          bloodTypeFile,
          bloodTypeFileName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al guardar");
      }

      alert("✅ Tipo de sangre validado correctamente");
      setCurrentBloodType(bloodType);
      setShowModal(false);
      setBloodType("");
      setBloodTypeFile(null);
      setBloodTypeFileName("");
    } catch (error) {
      alert(error.message || "Error al validar tipo de sangre");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg shadow-md p-6 border-2 border-red-200 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Droplets className="text-red-600" size={32} />
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                Tipo de Sangre
              </h3>
              <p className="text-sm text-gray-600">
                Valida tu tipo de sangre una sola vez
              </p>
            </div>
          </div>

          {currentBloodType ? (
            <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-lg">
              <Check className="text-green-600" size={20} />
              <span className="font-bold text-green-800 text-lg">
                {currentBloodType}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-lg">
              <AlertCircle className="text-yellow-600" size={20} />
              <span className="font-semibold text-yellow-800 text-sm">
                No validado
              </span>
            </div>
          )}
        </div>

        {!currentBloodType ? (
          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <Upload size={20} />
            Validar Tipo de Sangre
          </button>
        ) : (
          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Actualizar Tipo de Sangre
          </button>
        )}
      </div>

      {/* Modal */}
      {showModal && (
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
              maxWidth: "500px",
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
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  color: "#1f2937",
                }}
              >
                Validar Tipo de Sangre
              </h3>
              <button
                onClick={() => setShowModal(false)}
                disabled={loading}
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

            <div style={{ padding: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: 500,
                }}
              >
                Selecciona tu tipo de sangre
              </label>
              <select
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                  marginBottom: "1rem",
                }}
              >
                <option value="">Selecciona...</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                  (tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  )
                )}
              </select>

              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: 500,
                  color: "#dc2626",
                }}
              >
                Subir comprobante (OBLIGATORIO)
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              />
              {bloodTypeFileName && (
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#059669",
                    marginBottom: "0.5rem",
                  }}
                >
                  ✅ Archivo: {bloodTypeFileName}
                </p>
              )}
              <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                Formatos: PDF, JPG, PNG (máx. 5MB)
              </p>
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
              <button
                onClick={() => setShowModal(false)}
                disabled={loading}
                style={{
                  padding: "0.5rem 1.5rem",
                  backgroundColor: "#f3f4f6",
                  border: "none",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !bloodType || !bloodTypeFile}
                style={{
                  padding: "0.5rem 1.5rem",
                  backgroundColor: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontWeight: 500,
                  opacity: loading || !bloodType || !bloodTypeFile ? 0.5 : 1,
                }}
              >
                {loading ? "Guardando..." : "Validar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BloodTypeValidator;