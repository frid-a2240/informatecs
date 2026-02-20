import "@/styles/admin/InscripcionesPanel.css";
const TarjetasTotales = ({ totales }) => {
  const {
    totalEstudiantes,
    totalActividades,
    porSexo,
    porTipoActividad,
    porProposito,
  } = totales;

  return (
    <>
      {/* Totales principales */}
      <div className="ip-stats-grid">
        <div className="ip-stat-card ip-stat-card--blue">
          <p className="ip-stat-label">Total Estudiantes</p>
          <p className="ip-stat-value--blue">{totalEstudiantes}</p>
        </div>
        <div className="ip-stat-card ip-stat-card--green">
          <p className="ip-stat-label">Total Actividades</p>
          <p className="ip-stat-value--green">{totalActividades}</p>
        </div>
        <div className="ip-stat-card ip-stat-card--pink">
          <p className="ip-stat-label">Mujeres</p>
          <p className="ip-stat-value--pink">{porSexo.F}</p>
        </div>
        <div className="ip-stat-card ip-stat-card--indigo">
          <p className="ip-stat-label">Hombres</p>
          <p className="ip-stat-value--indigo">{porSexo.M}</p>
        </div>
      </div>

      {/* Por tipo */}
      <div className="ip-breakdown-card">
        <h3 className="ip-breakdown-title">Inscripciones por Tipo</h3>
        <div className="ip-breakdown-grid-4">
          <div className="ip-breakdown-item">
            <p className="ip-breakdown-num--blue">{porTipoActividad.CIVICA}</p>
            <p className="ip-breakdown-label">Cívicas</p>
          </div>
          <div className="ip-breakdown-item">
            <p className="ip-breakdown-num--purple">
              {porTipoActividad.CULTURAL}
            </p>
            <p className="ip-breakdown-label">Culturales</p>
          </div>
          <div className="ip-breakdown-item">
            <p className="ip-breakdown-num--orange">
              {porTipoActividad.DEPORTIVA}
            </p>
            <p className="ip-breakdown-label">Deportivas</p>
          </div>
          <div className="ip-breakdown-item">
            <p className="ip-breakdown-num--gray">{porTipoActividad.OTRA}</p>
            <p className="ip-breakdown-label">Otras</p>
          </div>
        </div>
      </div>

      {/* Por propósito */}
      <div className="ip-breakdown-card">
        <h3 className="ip-breakdown-title">Inscripciones por Propósito</h3>
        <div className="ip-breakdown-grid-3">
          <div className="ip-breakdown-item">
            <p className="ip-breakdown-num--blue">{porProposito.creditos}</p>
            <p className="ip-breakdown-label">Créditos</p>
          </div>
          <div className="ip-breakdown-item">
            <p className="ip-breakdown-num--green">
              {porProposito.servicio_social}
            </p>
            <p className="ip-breakdown-label">Servicio Social</p>
          </div>
          <div className="ip-breakdown-item">
            <p className="ip-breakdown-num--purple">{porProposito.por_gusto}</p>
            <p className="ip-breakdown-label">Por Gusto</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TarjetasTotales;
