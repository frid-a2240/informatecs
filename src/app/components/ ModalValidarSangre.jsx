import "@/styles/admin/InscripcionesPanel.css";
const ModalValidarSangre = ({ inscripcion, onClose, onValidar }) => {
  if (!inscripcion) return null;

  const {
    estudiante,
    tipoSangreSolicitado,
    nombreArchivoSangre,
    comprobanteSangrePDF,
  } = inscripcion;
  const nombreCompleto = `${estudiante.alunom} ${estudiante.aluapp} ${estudiante.aluapm}`;

  const handleAprobar = () => {
    if (
      confirm(
        `¿Confirmas que el tipo de sangre ${tipoSangreSolicitado} coincide con el comprobante?\n\nEsto actualizará el registro del estudiante.`,
      )
    ) {
      onValidar(inscripcion.id, estudiante.aluctr);
    }
  };

  return (
    <div className="ip-sangre-overlay">
      <div className="ip-sangre-modal">
        {/* Header */}
        <div className="ip-sangre-header">
          <div>
            <h3 className="ip-sangre-header-title">
              🩸 Validar Tipo de Sangre
            </h3>
            <p className="ip-sangre-header-sub">
              Revisa el comprobante antes de aprobar
            </p>
          </div>
          <button className="ip-sangre-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="ip-sangre-body">
          <div className="ip-student-box">
            <h4 className="ip-student-box-title">👤 Datos del Estudiante</h4>
            <div className="ip-student-grid">
              <div>
                <span className="ip-student-grid-label">Nombre:</span>
                <p className="ip-student-grid-value">{nombreCompleto}</p>
              </div>
              <div>
                <span className="ip-student-grid-label">No. Control:</span>
                <p className="ip-student-grid-value">{estudiante.aluctr}</p>
              </div>
            </div>
          </div>

          <div className="ip-blood-display-box">
            <h4 className="ip-blood-display-title">
              Tipo de sangre seleccionado por el estudiante:
            </h4>
            <div className="ip-blood-display-type">
              <span>{tipoSangreSolicitado}</span>
            </div>
          </div>

          <div className="ip-comprobante-box">
            <h4 className="ip-comprobante-title">📄 Comprobante Subido</h4>
            <p className="ip-comprobante-file">
              Archivo: <span>{nombreArchivoSangre}</span>
            </p>
            <div className="ip-comprobante-preview">
              {comprobanteSangrePDF?.startsWith("data:application/pdf") ? (
                <iframe src={comprobanteSangrePDF} title="Comprobante PDF" />
              ) : (
                <img src={comprobanteSangrePDF} alt="Comprobante" />
              )}
            </div>
            <a
              href={comprobanteSangrePDF}
              download={nombreArchivoSangre}
              className="ip-download-btn"
            >
              📥 Descargar Comprobante
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="ip-sangre-footer">
          <button className="ip-btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button className="ip-btn-approve" onClick={handleAprobar}>
            ✅ APROBAR Y VALIDAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalValidarSangre;
