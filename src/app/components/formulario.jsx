import React from "react";

const ActividadForm = ({
  formData,
  setFormData,
  handleFormSubmit,
  selectedSport,
  cancelar,
}) => {
  return (
    <div className="actividad-form-wrapper">
      <div className="actividad-form">
        <div className="actividad-form-header">
          <h3>📝 Inscripción a {selectedSport.name}</h3>
          <button onClick={cancelar}>✕</button>
        </div>

        <form onSubmit={handleFormSubmit}>
          {/* Pregunta 1 */}
          <div className="pregunta-card p-color1">
            <label>1. ¿Has practicado esta actividad antes?</label>
            <label>
              <input
                type="radio"
                name="hasPracticed"
                value="si"
                checked={formData.hasPracticed === "si"}
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
                checked={formData.hasPracticed === "no"}
                onChange={(e) =>
                  setFormData({ ...formData, hasPracticed: e.target.value })
                }
              />{" "}
              No
            </label>
          </div>

          {/* Pregunta 2 */}
          <div className="pregunta-card p-color2">
            <label>2. ¿Tienes alguna enfermedad o lesión relevante?</label>
            <label>
              <input
                type="radio"
                name="hasIllness"
                value="si"
                checked={formData.hasIllness === "si"}
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
                checked={formData.hasIllness === "no"}
                onChange={(e) =>
                  setFormData({ ...formData, hasIllness: e.target.value })
                }
              />{" "}
              No
            </label>
          </div>

          {/* Pregunta 3 */}
          <div className="pregunta-card p-color3">
            <label>3. Propósito de inscripción:</label>
            <input
              type="text"
              placeholder="Ej: Obtener créditos complementarios"
              value={formData.purpose}
              onChange={(e) =>
                setFormData({ ...formData, purpose: e.target.value })
              }
            />
          </div>

          {/* Pregunta 4 */}
          <div className="pregunta-card p-color4">
            <label>4. Tipo de sangre:</label>
            <select
              value={formData.bloodType}
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

          <div className="form-buttons">
            <button type="button" onClick={cancelar}>
              Cancelar
            </button>
            <button type="submit">Enviar Inscripción</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActividadForm;
