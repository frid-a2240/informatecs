import React from "react";
import { X } from "lucide-react";

export const ActividadModal = ({
  show,
  onClose,
  onSubmit,
  formData,
  onChange,
  onColorSelect,
  colors,
  dias,
  isEditing,
}) => {
  if (!show) return null;

  // Manejador para los botones de los días
  const handleDiaToggle = (diaSeleccionado) => {
    const diasActuales = formData.dias || [];
    const nuevosDias = diasActuales.includes(diaSeleccionado)
      ? diasActuales.filter((d) => d !== diaSeleccionado)
      : [...diasActuales, diaSeleccionado];

    // Mantenemos la estructura de evento que espera tu page.jsx
    onChange({
      target: {
        name: "dias",
        value: nuevosDias,
      },
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          {/* Si editamos, mostramos el nombre de la materia para mayor claridad */}
          <h2>
            {isEditing ? `Editando: ${formData.nombre}` : "Nueva Actividad"}
          </h2>
          <button className="btn-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="modal-form">
          <div className="form-group">
            <label>Nombre de la actividad</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={onChange}
              placeholder="Ej: Desarrollo Web"
              required
            />
          </div>

          <div className="form-group">
            <label>Días asignados</label>
            <div
              className="dias-selector"
              style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}
            >
              {dias.map((dia) => {
                const isSelected = formData.dias?.includes(dia);
                return (
                  <button
                    key={dia}
                    type="button"
                    className={`btn-dia ${isSelected ? "active" : ""}`}
                    onClick={() => handleDiaToggle(dia)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid #e5e7eb",
                      backgroundColor: isSelected ? formData.color : "white",
                      color: isSelected ? "white" : "#374151",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {dia.substring(0, 3)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Hora inicio</label>
              <input
                type="time"
                name="horaInicio"
                value={formData.horaInicio}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Hora fin</label>
              <input
                type="time"
                name="horaFin"
                value={formData.horaFin}
                onChange={onChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Ubicación / Salón</label>
            <input
              type="text"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={onChange}
              placeholder="Ej: Laboratorio 102"
            />
          </div>

          <div className="form-group">
            <label>Color de etiqueta</label>
            <div
              className="color-picker"
              style={{ display: "flex", gap: "10px" }}
            >
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`color-option ${formData.color === color ? "selected" : ""}`}
                  style={{
                    backgroundColor: color,
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    border:
                      formData.color === color
                        ? "3px solid #000"
                        : "1px solid #ddd",
                    cursor: "pointer",
                  }}
                  onClick={() => onColorSelect(color)}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn-submit"
            disabled={formData.dias?.length === 0}
            style={{
              marginTop: "20px",
              backgroundColor: "#1b396a",
              color: "white",
              padding: "12px",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: formData.dias?.length === 0 ? "not-allowed" : "pointer",
              opacity: formData.dias?.length === 0 ? 0.5 : 1,
            }}
          >
            {isEditing ? "Actualizar todos los días" : "Agregar Actividad"}
          </button>
        </form>
      </div>
    </div>
  );
};
