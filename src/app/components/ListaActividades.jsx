import React from "react";
import {
  ChevronDown,
  ChevronUp,
  Droplets,
  Clock,
  Calendar,
  Award,
  AlertCircle,
  Activity,
  FileText,
  MapPin,
  Pill,
  Stethoscope,
  Heart,
  Ban,
  Edit2,
  Trash2,
} from "lucide-react";

export const ListaView = ({
  inscripciones = [],
  actividadesPersonales = [],
  expanded,
  toggleExpand,
  onEdit,
  onDelete,
  onExportPDF,
}) => {
  if (inscripciones.length === 0 && actividadesPersonales.length === 0) {
    return (
      <div className="empty-state">
        <FileText size={64} />
        <h2>Sin actividades</h2>
        <p>Agrega tus clases para comenzar a organizar tu horario.</p>
      </div>
    );
  }

  return (
    <div className="lista-container">
      <h2 className="lista-title">
        <FileText size={24} />
        Resumen de Actividades
      </h2>

      <div className="actividades-lista">
        {inscripciones.map((item, index) => {
          const act = item.actividad;
          const horario = act?.horario;
          const formData = item.formularioData || {};
          const isExpanded = expanded === `insc-${index}`;

          return (
            <div
              className={`actividad-item ${isExpanded ? "expanded" : ""}`}
              key={`insc-${index}`}
            >
              <div
                className="actividad-header"
                onClick={() => toggleExpand(`insc-${index}`)}
              >
                <div className="actividad-header-info">
                  <div className="actividad-badge inscrita">Inscrita</div>
                  <h3>{act?.aconco || "Actividad sin nombre"}</h3>
                  <div className="actividad-badges">
                    <span className="badge-code">{act?.aticve || "N/A"}</span>
                    <span className="badge">
                      <Award size={14} />
                      {act?.acocre} créditos
                    </span>
                    <span className="badge">
                      <Clock size={14} />
                      {act?.acohrs} hrs
                    </span>
                  </div>
                </div>
                <button className="btn-toggle">
                  {isExpanded ? (
                    <ChevronUp size={24} />
                  ) : (
                    <ChevronDown size={24} />
                  )}
                </button>
              </div>

              {isExpanded && (
                <div className="actividad-body">
                  <div className="info-section">
                    <InfoCard
                      icon={<Calendar size={20} />}
                      label="Fecha de inscripción"
                      value={new Date(item.fechaInscripcion).toLocaleDateString(
                        "es-MX",
                        { year: "numeric", month: "long", day: "numeric" },
                      )}
                    />
                    <InfoCard
                      icon={<Droplets size={20} />}
                      label="Tipo de sangre"
                      value={formData.bloodType || "No especificado"}
                    />
                  </div>

                  <div className="medical-section">
                    <h4 className="medical-title">
                      <Stethoscope size={20} /> Información Médica
                    </h4>
                    <div className="medical-grid">
                      <MedicalItem
                        icon={<Heart size={18} />}
                        title="Condición médica"
                        status={formData.hasCondition}
                        details={formData.conditionDetails}
                      />
                      <MedicalItem
                        icon={<Pill size={18} />}
                        title="Medicamentos"
                        status={formData.takesMedication}
                        details={formData.medicationDetails}
                      />
                      <MedicalItem
                        icon={<AlertCircle size={18} />}
                        title="Alergias"
                        status={formData.hasAllergy}
                        details={formData.allergyDetails}
                        type="danger"
                      />
                      <MedicalItem
                        icon={<Activity size={18} />}
                        title="Lesión reciente"
                        status={formData.hasInjury}
                        details={formData.injuryDetails}
                      />
                      <MedicalItem
                        icon={<Ban size={18} />}
                        title="Restricción médica"
                        status={formData.hasRestriction}
                        details={formData.restrictionDetails}
                        type="danger"
                      />
                    </div>
                  </div>

                  <div className="horario-section">
                    <h4>
                      <Clock size={18} /> Horario
                    </h4>
                    {horario?.dias?.length > 0 ? (
                      <table className="horario-table">
                        <thead>
                          <tr>
                            <th>Día</th>
                            <th>Inicio</th>
                            <th>Fin</th>
                            <th>Salón</th>
                          </tr>
                        </thead>
                        <tbody>
                          {horario.dias.map((dia, idx) => (
                            <tr key={idx}>
                              <td>{dia}</td>
                              <td>{horario.horaInicio}</td>
                              <td>{horario.horaFin}</td>
                              <td>{horario.salon || "Por asignar"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="pendiente">
                        Horario por asignar próximamente.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {actividadesPersonales.map((activity) => (
          <div
            className="actividad-item personal-grouped"
            key={activity.id}
            style={{ borderLeft: `6px solid ${activity.color}` }}
          >
            <div className="actividad-header">
              <div className="actividad-header-info">
                <div className="actividad-badge personal">Personal</div>
                <h3>{activity.nombre}</h3>
                <div className="actividad-badges">
                  {/* CAMBIO CLAVE: Renderizado de múltiples días */}
                  <div className="badge-group">
                    <Calendar size={14} />
                    <div className="dias-list">
                      {(activity.diasPresentes || [activity.dia]).map(
                        (d, idx) => (
                          <span key={idx} className="mini-pill">
                            {d}
                          </span>
                        ),
                      )}
                    </div>
                  </div>

                  <span className="badge">
                    <Clock size={14} />
                    {activity.horaInicio} - {activity.horaFin}
                  </span>

                  {activity.ubicacion && (
                    <span className="badge">
                      <MapPin size={14} />
                      {activity.ubicacion}
                    </span>
                  )}
                </div>
              </div>

              <div className="actividad-actions">
                <button
                  className="btn-icon-large"
                  onClick={() => onEdit(activity)}
                  title="Editar"
                >
                  <Edit2 size={18} />
                </button>

                <button
                  className="btn-icon-large delete"
                  onClick={() => onDelete(activity.id)}
                  title="Eliminar"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .badge-group {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #f3f4f6;
          padding: 2px 8px;
          border-radius: 6px;
          color: #4b5563;
        }
        .dias-list {
          display: flex;
          gap: 4px;
        }
        .mini-pill {
          background: #fff;
          padding: 0px 6px;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 700;
          border: 1px solid #e5e7eb;
          text-transform: uppercase;
        }
        .actividad-actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

const InfoCard = ({ icon, label, value }) => (
  <div className="info-card">
    <div className="info-icon">{icon}</div>
    <div>
      <p className="info-label">{label}</p>
      <p className="info-value">{value}</p>
    </div>
  </div>
);

const MedicalItem = ({ icon, title, status, details, type = "warning" }) => (
  <div className="medical-item">
    <div className="medical-header">
      {icon}
      <span>{title}</span>
    </div>
    <p>
      {status === "si" ? (
        <>
          <span className={`badge-${type}`}>Sí</span>
          {details && <span className="details">{details}</span>}
        </>
      ) : (
        <span className="badge-success">No</span>
      )}
    </p>
  </div>
);
