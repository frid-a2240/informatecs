"use client";
import React, { Fragment } from "react";
import { Clock, MapPin, Edit2, Trash2 } from "lucide-react";

export const CalendarioView = ({
  horas,
  diasSemana,
  getActivityForSlot,
  getActivitySpan,
  onEdit,
  onDelete,
}) => {
  const getStartRow = (horaInicio) => {
    if (!horaInicio) return 2;
    const [h] = horaInicio.split(":").map(Number);
    return Math.max(2, h - 7 + 2);
  };

  return (
    <div className="calendario-container">
      <div
        className="calendario-grid"
        style={{
          display: "grid",
          gridTemplateColumns: `80px repeat(${diasSemana.length}, 1fr)`,
          gridTemplateRows: `auto repeat(${horas.length}, 60px)`,
          backgroundColor: "#fff",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
        }}
      >
        {/* Cabecera */}
        <div
          style={{
            gridRow: "1",
            gridColumn: "1",
            padding: "10px",
            fontWeight: "bold",
            borderBottom: "2px solid #eee",
            textAlign: "center",
            backgroundColor: "#f9fafb",
          }}
        >
          Hora
        </div>
        {diasSemana.map((dia, idx) => (
          <div
            key={dia}
            style={{
              gridRow: "1",
              gridColumn: idx + 2,
              padding: "10px",
              textAlign: "center",
              fontWeight: "bold",
              borderBottom: "2px solid #eee",
              backgroundColor: "#f9fafb",
            }}
          >
            {dia}
          </div>
        ))}

        {/* Filas de horas */}
        {horas.map((hora, idx) => (
          <div
            key={hora}
            style={{
              gridRow: idx + 2,
              gridColumn: "1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.85rem",
              color: "#6b7280",
              borderRight: "1px solid #eee",
              borderBottom: "1px solid #f3f4f6",
            }}
          >{`${hora}:00`}</div>
        ))}

        {diasSemana.map((dia, diaIdx) => {
          const colIndex = diaIdx + 2;
          return (
            <Fragment key={dia}>
              {horas.map((_, hIdx) => (
                <div
                  key={hIdx}
                  style={{
                    gridRow: hIdx + 2,
                    gridColumn: colIndex,
                    borderRight: "1px solid #f3f4f6",
                    borderBottom: "1px solid #f3f4f6",
                  }}
                />
              ))}

              {horas.map((hora) => {
                const activity = getActivityForSlot(dia, hora);

                if (activity && activity.horaInicio.startsWith(`${hora}:`)) {
                  const span = getActivitySpan(activity);
                  const startRow = getStartRow(activity.horaInicio);

                  return (
                    <div
                      key={activity.id}
                      style={{
                        backgroundColor: activity.color,
                        gridRow: `${startRow} / span ${span}`,
                        gridColumn: colIndex,
                        zIndex: 10,
                        margin: "2px",
                        borderRadius: "6px",
                        padding: "6px",
                        color: "white",
                        display: "flex", // Flexbox horizontal
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        overflow: "hidden",
                      }}
                    >
                      {/* LADO IZQUIERDO: TEXTO */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: "bold",
                            fontSize: "0.75rem",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {activity.nombre}
                        </div>
                        <div
                          style={{
                            fontSize: "0.65rem",
                            display: "flex",
                            alignItems: "center",
                            opacity: 0.9,
                            marginTop: "2px",
                          }}
                        >
                          <Clock
                            size={10}
                            style={{ marginRight: "3px", flexShrink: 0 }}
                          />
                          {activity.horaInicio.substring(0, 5)}
                        </div>
                        {activity.ubicacion && (
                          <div
                            style={{
                              fontSize: "0.65rem",
                              display: "flex",
                              alignItems: "center",
                              opacity: 0.9,
                            }}
                          >
                            <MapPin
                              size={10}
                              style={{ marginRight: "3px", flexShrink: 0 }}
                            />
                            <span
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {activity.ubicacion}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* LADO DERECHO: BOTONES (Solo personales) */}
                      {activity.tipo === "personal" && (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                            marginLeft: "4px",
                            flexShrink: 0, // Evita que los botones se escondan
                          }}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(activity);
                            }}
                            style={{
                              background: "white",
                              border: "none",
                              borderRadius: "3px",
                              color: activity.color, // Color del icono igual al de la materia
                              padding: "4px",
                              cursor: "pointer",
                              display: "flex",
                              boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
                            }}
                          >
                            <Edit2 size={12} strokeWidth={3} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(activity.id);
                            }}
                            style={{
                              background: "rgba(0,0,0,0.2)",
                              border: "none",
                              borderRadius: "3px",
                              color: "white",
                              padding: "4px",
                              cursor: "pointer",
                              display: "flex",
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              })}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};
