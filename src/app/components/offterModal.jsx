import React from "react";
import { X, Timer, Code2, Star } from "lucide-react";

/**
 * Componente Modal para mostrar detalles de una oferta
 * @param {Object} item - Objeto con la información de la oferta
 * @param {Function} onClose - Callback para cerrar el modal
 * @param {Function} onRegister - Callback para registrarse en la actividad
 */
const OfferModal = ({ item, onClose, onRegister }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      <button className="close-btn" onClick={onClose}>
        <X />
      </button>
      {item.actividad.image && (
        <img src={item.actividad.image} alt={item.actividad.aconco} />
      )}
      <h2>{item.actividad.aconco}</h2>
      <div className="modal-content">
        <p>
          Esta actividad forma parte de la oferta del semestre. Conoce sus
          detalles y regístrate para participar.
        </p>
        <div className="info-grid">
          <p>
            <Timer /> Horas: {item.actividad.acohrs}
          </p>
          <p>
            <Code2 /> Código: {item.actividad.acocve}
          </p>
          <p>
            <Star /> Créditos: {item.actividad.acocre}
          </p>
        </div>
      </div>
      <button className="register-btn" onClick={() => onRegister(item)}>
        Registrarme
      </button>
    </div>
  </div>
);

export default OfferModal;
