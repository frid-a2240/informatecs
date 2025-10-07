import React, { useState } from "react";

const FormularioInscripcion = ({ selectedSport, setActiveSection }) => {
  const [showForm, setShowForm] = useState(true);
  const [formData, setFormData] = useState({
    hasPracticed: "",
    hasIllness: "",
    purpose: "",
    bloodType: "",
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar el envío (por ejemplo, llamar a una API)
    console.log("Datos del formulario:", formData);

    // Cerrar formulario o mostrar confirmación
    setShowForm(false);
    setActiveSection("events"); // o cualquier otra lógica que uses
  };

  if (!showForm) return null;

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "15px",
          width: "100%",
          maxWidth: "600px",
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.08)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            color: "#fff",
            padding: "1rem 2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ fontSize: "1.3rem", fontWeight: "bold", margin: 0 }}>
            📝 Inscripción a {selectedSport?.name || "Deporte"}
          </h3>
          <button
            onClick={() => setShowForm(false)}
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: "1.2rem",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleFormSubmit} style={{ padding: "2rem" }}>
          {/* Pregunta 1 */}
          <div style={{ marginBottom: "2rem" }}>
            <label style={labelStyle}>
              1. ¿Has practicado esta actividad antes?
            </label>
            <div style={radioGroupStyle}>
              <label style={radioLabelStyle}>
                <input
                  type="radio"
                  name="hasPracticed"
                  value="si"
                  checked={formData.hasPracticed === "si"}
                  onChange={(e) =>
                    setFormData({ ...formData, hasPracticed: e.target.value })
                  }
                  style={radioInputStyle}
                />
                Sí
              </label>
              <label style={radioLabelStyle}>
                <input
                  type="radio"
                  name="hasPracticed"
                  value="no"
                  checked={formData.hasPracticed === "no"}
                  onChange={(e) =>
                    setFormData({ ...formData, hasPracticed: e.target.value })
                  }
                  style={radioInputStyle}
                />
                No
              </label>
            </div>
          </div>

          {/* Pregunta 2 */}
          <div style={{ marginBottom: "2rem" }}>
            <label style={labelStyle}>
              2. ¿Tienes alguna enfermedad o lesión relevante?
            </label>
            <div style={radioGroupStyle}>
              <label style={radioLabelStyle}>
                <input
                  type="radio"
                  name="hasIllness"
                  value="si"
                  checked={formData.hasIllness === "si"}
                  onChange={(e) =>
                    setFormData({ ...formData, hasIllness: e.target.value })
                  }
                  style={radioInputStyle}
                />
                Sí
              </label>
              <label style={radioLabelStyle}>
                <input
                  type="radio"
                  name="hasIllness"
                  value="no"
                  checked={formData.hasIllness === "no"}
                  onChange={(e) =>
                    setFormData({ ...formData, hasIllness: e.target.value })
                  }
                  style={radioInputStyle}
                />
                No
              </label>
            </div>
          </div>

          {/* Pregunta 3 */}
          <div style={{ marginBottom: "2rem" }}>
            <label style={labelStyle}>3. Propósito de inscripción:</label>
            <input
              type="text"
              placeholder="Ej: Obtener créditos complementarios"
              value={formData.purpose}
              onChange={(e) =>
                setFormData({ ...formData, purpose: e.target.value })
              }
              style={inputStyle}
            />
          </div>

          {/* Pregunta 4 */}
          <div style={{ marginBottom: "2rem" }}>
            <label style={labelStyle}>4. Tipo de sangre:</label>
            <select
              value={formData.bloodType}
              onChange={(e) =>
                setFormData({ ...formData, bloodType: e.target.value })
              }
              style={inputStyle}
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

          {/* Botones */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={cancelButtonStyle}
            >
              Cancelar
            </button>
            <button type="submit" style={submitButtonStyle}>
              Enviar Inscripción
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Estilos reutilizables
const labelStyle = {
  display: "block",
  fontSize: "1.1rem",
  fontWeight: "600",
  color: "#333",
  marginBottom: "1rem",
};

const radioGroupStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
};

const radioLabelStyle = {
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
};

const radioInputStyle = {
  marginRight: "0.75rem",
  transform: "scale(1.2)",
};

const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  border: "2px solid #ddd",
  borderRadius: "8px",
  fontSize: "1rem",
  backgroundColor: "white",
};

const cancelButtonStyle = {
  flex: 1,
  padding: "0.75rem",
  border: "2px solid #ddd",
  borderRadius: "8px",
  backgroundColor: "#fff",
  color: "#666",
  fontSize: "1rem",
  fontWeight: "600",
  cursor: "pointer",
};

const submitButtonStyle = {
  flex: 1,
  padding: "0.75rem",
  border: "none",
  borderRadius: "8px",
  backgroundColor: "#28a745",
  color: "#fff",
  fontSize: "1rem",
  fontWeight: "600",
  cursor: "pointer",
};

export default FormularioInscripcion;
