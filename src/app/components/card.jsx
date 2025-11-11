import React from "react";
import { BookOpen, Inbox } from "lucide-react";

/**
 * Componente Card para mostrar una oferta de actividad
 * @param {Object} item - Objeto con la información de la oferta
 * @param {boolean} isSelected - Si la card está seleccionada
 * @param {Function} onClick - Callback al hacer clic en la card
 */
const Card = ({ item, isSelected, onClick }) => (
  <div
    className={`card ${isSelected ? "selected" : ""}`}
    onClick={() => onClick(item)}
  >
    <div className="card-header">
      <BookOpen className="icon" /> Asignatura
    </div>
    <h3>{item.actividad.aconco}</h3>
    <p className="description">
      Descubre más sobre esta actividad y sus beneficios.
    </p>
    <div className="card-footer">
      <span>
        <Inbox /> {item.actividad.acodes}
      </span>
      Información
    </div>
  </div>
);

export default Card;
