"use client";
import React, { useState, useEffect } from "react";
import { Droplets, Upload, Check, AlertCircle, Clock, RefreshCw } from "lucide-react";

const BloodTypeValidator = ({ numeroControl }) => {
  const [bloodType, setBloodType] = useState("");
  const [bloodTypeFile, setBloodTypeFile] = useState(null);
  const [bloodTypeFileName, setBloodTypeFileName] = useState("");
  const [currentBloodType, setCurrentBloodType] = useState(null); // ✅ Validado
  const [pendingRequest, setPendingRequest] = useState(null); // ⏳ Pendiente
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
      
      console.log("📊 Datos recibidos de /api/sangre:", data);
      
      // ✅ Tipo de sangre validado (en estudiantes.alutsa)
      if (data?.estudiante?.alutsa) {
        setCurrentBloodType(data.estudiante.alutsa);
      }
      
      // ⏳ Solicitud pendiente (en inscripact)
      if (data?.tieneSolicitudPendiente && data?.solicitudPendiente) {
        setPendingRequest(data.solicitudPendiente);
      } else {
        setPendingRequest(null);
      }
    } catch (error) {
      console.error("❌ Error al cargar tipo de sangre:", error);
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

      alert("✅ Documento enviado. Esperando validación del administrador.");
      
      // Recargar datos
      await cargarTipoSangre();
      
      setShowModal(false);
      setBloodType("");
      setBloodTypeFile(null);
      setBloodTypeFileName("");
    } catch (error) {
      alert(error.message || "Error al enviar documento");
    } finally {
      setLoading(false);
    }
  };

  // ✅ CASO 1: Ya está validado por el admin
  if (currentBloodType && !pendingRequest) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-md p-6 border-2 border-green-200 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Droplets className="text-green-600" size={32} />
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                Tipo de Sangre Validado
              </h3>
              <p className="text-sm text-green-600 font-semibold">
                ✅ Verificado por el administrador
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-lg">
              <Check className="text-green-600" size={20} />
              <span className="font-bold text-green-800 text-lg">
                {currentBloodType}
              </span>
            </div>
            
            {/* Botón de actualizar en caso de error */}
            <button
              onClick={() => setShowModal(true)}
              className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm"
              title="Actualizar en caso de error"
            >
              <RefreshCw size={16} />
              Actualizar
            </button>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mt-3">
          💡 Si tu tipo de sangre es incorrecto, haz clic en "Actualizar" para enviar una nueva solicitud.
        </p>
      </div>
    );
  }

  // ⏳ CASO 2: Tiene validado PERO también tiene solicitud pendiente
  if (currentBloodType && pendingRequest) {
    return (
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg shadow-md p-6 border-2 border-yellow-300 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Clock className="text-yellow-600 animate-pulse" size={32} />
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                Actualización Pendiente
              </h3>
              <p className="text-sm text-yellow-700 font-semibold">
                ⏳ Nueva solicitud esperando revisión
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Tipo actual */}
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Tipo actual validado:</p>
            <div className="flex items-center gap-2">
              <Check className="text-green-600" size={16} />
              <span className="font-bold text-green-800 text-lg">
                {currentBloodType}
              </span>
            </div>
          </div>

          {/* Tipo solicitado */}
          <div className="bg-yellow-100 p-3 rounded-lg border border-yellow-300">
            <p className="text-xs text-yellow-800 mb-1">Nuevo tipo solicitado:</p>
            <div className="flex items-center gap-2">
              <Clock className="text-yellow-600" size={16} />
              <span className="font-bold text-yellow-800 text-lg">
                {pendingRequest.tipoSangreSolicitado}
              </span>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mt-3">
          📝 El administrador revisará tu solicitud de cambio pronto.
        </p>
      </div>
    );
  }

  // ⏳ CASO 3: No tiene validado pero tiene solicitud pendiente
  if (!currentBloodType && pendingRequest) {
    return (
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg shadow-md p-6 border-2 border-yellow-300 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="text-yellow-600 animate-pulse" size={32} />
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                Validación Pendiente
              </h3>
              <p className="text-sm text-yellow-700 font-semibold">
                ⏳ Esperando revisión del administrador
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-lg">
            <span className="font-bold text-yellow-800 text-lg">
              {pendingRequest.tipoSangreSolicitado}
            </span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mt-3">
          📄 Tu documento ha sido enviado. El administrador lo revisará pronto.
        </p>
      </div>
    );
  }

  // ❌ CASO 4: No ha subido nada
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
                Valida tu tipo de sangre subiendo un comprobante
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-lg">
            <AlertCircle className="text-yellow-600" size={20} />
            <span className="font-semibold text-yellow-800 text-sm">
              No validado
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
        >
          <Upload size={20} />
          Subir Comprobante
        </button>
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
                {currentBloodType ? "Actualizar Tipo de Sangre" : "Validar Tipo de Sangre"}
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
              {currentBloodType && (
                <div style={{
                  marginBottom: "1rem",
                  padding: "0.75rem",
                  backgroundColor: "#dbeafe",
                  border: "1px solid #3b82f6",
                  borderRadius: "0.5rem",
                }}>
                  <p style={{ fontSize: "0.875rem", color: "#1e40af" }}>
                    ℹ️ <strong>Tipo actual:</strong> {currentBloodType}
                  </p>
                </div>
              )}

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
              
              <div style={{
                marginTop: "1rem",
                padding: "0.75rem",
                backgroundColor: "#fef3c7",
                border: "1px solid #fbbf24",
                borderRadius: "0.5rem",
              }}>
                <p style={{ fontSize: "0.875rem", color: "#92400e" }}>
                  ⚠️ <strong>Importante:</strong> Tu documento será revisado por el administrador antes de validarse.
                </p>
              </div>
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
                {loading ? "Enviando..." : currentBloodType ? "Enviar Actualización" : "Enviar para Validación"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BloodTypeValidator;
