"use client";
import { useState, useEffect } from "react";
import { Search, FileText, Download, Edit2, X, Info, Shield } from "lucide-react";
import jsPDF from "jspdf";

export default function VistaConstancias() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [generandoPDF, setGenerandoPDF] = useState(false);
  
  const [inscripcionesEstudiante, setInscripcionesEstudiante] = useState([]);
  const [inscripcionSeleccionada, setInscripcionSeleccionada] = useState(null);

  // ✅ CAMBIO: Solo cantidad editable, unidad automática
  const [datosConstancia, setDatosConstancia] = useState({
    periodo: "",
    cantidadAcreditacion: "", // Solo el número
  });

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  const cargarEstudiantes = async () => {
    try {
      setLoading(true);
      
      const response = await fetch("/api/inscripciones", {
        cache: 'no-store'
      });
      
      if (!response.ok) {
        console.error("❌ Error HTTP:", response.status);
        setEstudiantes([]);
        return;
      }
      
      const inscripciones = await response.json();
      
      if (!Array.isArray(inscripciones)) {
        console.error("❌ Respuesta no es array:", inscripciones);
        setEstudiantes([]);
        return;
      }

      const estudiantesUnicos = new Map();
      
      inscripciones.forEach((inscripcion) => {
        const estudiante = inscripcion?.estudiante;
        if (estudiante && estudiante.aluctr) {
          if (!estudiantesUnicos.has(estudiante.aluctr)) {
            const actividadesEstudiante = inscripciones.filter(
              (i) => i?.estudiante?.aluctr === estudiante.aluctr
            );
            const tieneAprobada = actividadesEstudiante.some(
              (i) => (i.calificacion || 0) >= 70
            );
            
            estudiantesUnicos.set(estudiante.aluctr, {
              ...estudiante,
              tieneActividadAprobada: tieneAprobada,
              totalActividades: actividadesEstudiante.length,
            });
          }
        }
      });

      const listaEstudiantes = Array.from(estudiantesUnicos.values()).sort(
        (a, b) => (a.aluctr || "").localeCompare(b.aluctr || "")
      );

      setEstudiantes(listaEstudiantes);
    } catch (error) {
      console.error("❌ Error al cargar estudiantes:", error);
      setEstudiantes([]);
    } finally {
      setLoading(false);
    }
  };

  const estudiantesFiltrados = estudiantes.filter((est) => {
    const nombreCompleto = `${est.alunom || ""} ${est.aluapp || ""} ${
      est.aluapm || ""
    }`.toLowerCase();
    const numeroControl = (est.aluctr || "").toLowerCase();
    const terminoBusqueda = busqueda.toLowerCase();

    return (
      nombreCompleto.includes(terminoBusqueda) ||
      numeroControl.includes(terminoBusqueda)
    );
  });

  const cargarInscripcionesEstudiante = async (numeroControl) => {
    try {
      const response = await fetch("/api/inscripciones", {
        cache: 'no-store'
      });
      
      if (!response.ok) {
        console.error("❌ Error HTTP:", response.status);
        setInscripcionesEstudiante([]);
        return;
      }
      
      const todasInscripciones = await response.json();

      if (!Array.isArray(todasInscripciones)) {
        console.error("❌ Respuesta no es array");
        setInscripcionesEstudiante([]);
        return;
      }

      const inscripcionesDelEstudiante = todasInscripciones.filter(
        (insc) => insc?.estudiante?.aluctr === numeroControl
      );
      
      setInscripcionesEstudiante(inscripcionesDelEstudiante);
      
      if (inscripcionesDelEstudiante.length === 1) {
        const inscripcion = inscripcionesDelEstudiante[0];
        const calificacion = inscripcion.calificacion || 0;
        if (calificacion >= 70) {
          setInscripcionSeleccionada(inscripcion);
        }
      }
    } catch (error) {
      console.error("❌ Error al cargar inscripciones del estudiante:", error);
      setInscripcionesEstudiante([]);
    }
  };

  const seleccionarEstudiante = async (estudiante) => {
    setEstudianteSeleccionado(estudiante);
    setMostrarModal(true);
    setInscripcionSeleccionada(null);
    setInscripcionesEstudiante([]);
    setDatosConstancia({
      periodo: "",
      cantidadAcreditacion: "",
    });
    
    await cargarInscripcionesEstudiante(estudiante.aluctr);
  };

  // ✅ FUNCIÓN PARA OBTENER UNIDAD SEGÚN PROPÓSITO
  const obtenerUnidadAcreditacion = (proposito) => {
    if (proposito === "servicio_social") {
      return "Horas";
    } else if (proposito === "creditos") {
      return "Créditos";
    }
    return "";
  };

  // ✅ FUNCIÓN PARA TÍTULO DEL DOCUMENTO
  const obtenerTituloConstancia = (proposito) => {
    if (proposito === "servicio_social") {
      return "Liberación de horas";
    } else if (proposito === "creditos") {
      return "Liberación de créditos";
    }
    return "Constancia de participación";
  };

  const generarConstancia = async () => {
    if (!estudianteSeleccionado || !inscripcionSeleccionada) return;

    try {
      setGenerandoPDF(true);

      const nombreCompleto = `${estudianteSeleccionado.alunom || ""} ${
        estudianteSeleccionado.aluapp || ""
      } ${estudianteSeleccionado.aluapm || ""}`.trim();

      const nombreActividad = inscripcionSeleccionada.actividad?.aconco || 
                             inscripcionSeleccionada.actividad?.aticve || 
                             "Actividad no especificada";

      // ✅ OBTENER PROPÓSITO Y ACREDITACIÓN DINÁMICA
      const proposito = inscripcionSeleccionada.formularioData?.purpose;
      const unidad = obtenerUnidadAcreditacion(proposito);
      const acreditacionCompleta = `${datosConstancia.cantidadAcreditacion} ${unidad}`;

      // 1️⃣ GUARDAR CONSTANCIA EN BASE DE DATOS
      const responseConstancia = await fetch("/api/constancias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numeroControl: estudianteSeleccionado.aluctr,
          nombreCompleto: nombreCompleto,
          correoEstudiante: estudianteSeleccionado.alumai,
          actividadCodigo: inscripcionSeleccionada.actividad?.aticve || "N/A",
          actividadNombre: nombreActividad,
          actividadCreditos: inscripcionSeleccionada.actividad?.acocre,
          actividadHoras: inscripcionSeleccionada.actividad?.acohrs,
          periodo: datosConstancia.periodo,
          acreditacion: acreditacionCompleta,
          actividadId: inscripcionSeleccionada.actividadId,
        }),
      });

      if (!responseConstancia.ok) {
        throw new Error("Error al registrar constancia");
      }

      const { constancia } = await responseConstancia.json();
      const { folio, codigoVerificacion } = constancia;

      // 2️⃣ GENERAR CÓDIGO QR
      const urlVerificacion = `${window.location.origin}/verificar/${folio}`;
      const qrCodeDataURL = await generarQRCode(urlVerificacion);

      // 3️⃣ GENERAR PDF CON FOLIO Y QR
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      doc.setFont("helvetica");

      // Header
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("EDUCACIÓN", pageWidth / 2, 20, { align: "center" });
      doc.setFontSize(10);
      doc.text("SECRETARÍA DE EDUCACIÓN PÚBLICA", pageWidth / 2, 26, {
        align: "center",
      });

      doc.setFontSize(12);
      doc.text("TECNOLÓGICO", pageWidth - 40, 20, { align: "center" });
      doc.text("NACIONAL DE MÉXICO", pageWidth - 40, 26, { align: "center" });

      doc.setFontSize(10);
      doc.text("Instituto Tecnológico de Ensenada", pageWidth - 30, 35, {
        align: "right",
      });

      // ✅ TÍTULO DINÁMICO
      const tituloConstancia = obtenerTituloConstancia(proposito);
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("CONSTANCIA DE ACREDITACIÓN DE ACTIVIDAD", pageWidth - 30, 50, {
        align: "right",
      });
      doc.text("COMPLEMENTARIA", pageWidth - 30, 57, { align: "right" });
      
      // ✅ SUBTÍTULO: "Liberación de horas" o "Liberación de créditos"
      doc.setFontSize(12);
      doc.text(tituloConstancia, pageWidth - 30, 64, { align: "right" });

      // ✅ FOLIO Y CÓDIGO DE VERIFICACIÓN
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(`Folio: ${folio}`, 20, 50);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(`Código: ${codigoVerificacion}`, 20, 55);

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");

      let y = 80;
      doc.text("A QUIEN CORRESPONDA", 20, y);

      y += 15;
      doc.setFont("helvetica", "bold");
      doc.text("PRESENTE", 20, y);

      y += 15;
      doc.setFont("helvetica", "normal");

      const texto1 = `Se envía un cordial saludo y a su vez se le extiende la presente constancia al (la) alumno (a): `;
      const texto2 = `, con número de control `;
      const texto3 = `, quien ha participado en la actividad complementaria: `;
      const texto4 = `, en el período `;
      const texto5 = `, bajo la asesoría de `;
      const texto6 = `Juan Carlos Leal Nodal, obteniendo una acreditación de `;
      const texto7 = ` conforme a las disposiciones del ITE.`;

      const margenIzq = 20;
      const margenDer = pageWidth - 20;
      const anchoTexto = margenDer - margenIzq;

      const escribirTexto = (texto, yPos) => {
        const lineas = doc.splitTextToSize(texto, anchoTexto);
        lineas.forEach((linea) => {
          doc.text(linea, margenIzq, yPos);
          yPos += 7;
        });
        return yPos;
      };

      const parrafoCompleto = `${texto1}${nombreCompleto}${texto2}${
        estudianteSeleccionado.aluctr
      }${texto3}${nombreActividad}${texto4}${
        datosConstancia.periodo
      }${texto5}${texto6}${acreditacionCompleta}${texto7}`;

      y = escribirTexto(parrafoCompleto, y);

      y += 10;
      doc.text(
        "Por lo que agradezco su atención para las gestiones necesarias que se requieran.",
        margenIzq,
        y
      );

      y += 15;
      doc.text("Saludos.", margenIzq, y);

      // Firma
      y += 25;
      doc.setFont("helvetica", "bold");
      doc.text("A T E N T A M E N T E", margenIzq, y);
      y += 7;
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.text("Excelencia en Educación Tecnológica»", margenIzq, y);
      y += 5;
      doc.text("Por la tecnología de hoy y del futuro»", margenIzq, y);

      y += 25;
      doc.line(margenIzq, y, margenIzq + 100, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Juan Carlos Leal Nodal", margenIzq, y);
      y += 5;
      doc.text("Departamento de Actividades Complementarias", margenIzq, y);

      // ✅ AGREGAR CÓDIGO QR
      if (qrCodeDataURL) {
        const qrSize = 35;
        const qrX = pageWidth - qrSize - 20;
        const qrY = pageHeight - qrSize - 35;
        
        doc.addImage(qrCodeDataURL, "PNG", qrX, qrY, qrSize, qrSize);
        
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.text("Escanea para verificar", qrX + qrSize / 2, qrY + qrSize + 5, {
          align: "center",
        });
      }

      // Footer
      const footerY = pageHeight - 20;
      doc.setFontSize(8);
      doc.text(
        "Blvd. Tecnológico #150, Ex Ejido Chapultepec C.P.22780, Ensenada, Baja California",
        pageWidth / 2,
        footerY,
        { align: "center" }
      );
      doc.text(
        "Tel. (646) 1775680 e-mail: dir_ensenada@tecnm.mx | ensenada.tecnm.mx",
        pageWidth / 2,
        footerY + 5,
        { align: "center" }
      );

      doc.save(
        `Constancia_${folio}_${nombreCompleto}.pdf`
      );

      alert(`✅ Constancia generada exitosamente\n\nFolio: ${folio}\nCódigo: ${codigoVerificacion}\nTipo: ${tituloConstancia}`);
      setMostrarModal(false);
    } catch (error) {
      console.error("❌ Error al generar constancia:", error);
      alert("Error al generar constancia. Inténtalo de nuevo.");
    } finally {
      setGenerandoPDF(false);
    }
  };

  const generarQRCode = async (texto) => {
    try {
      const QRCode = (await import("qrcode")).default;
      const qrDataURL = await QRCode.toDataURL(texto, {
        width: 200,
        margin: 1,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      return qrDataURL;
    } catch (error) {
      console.error("Error al generar QR:", error);
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="text-blue-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-800">
              Generación de Constancias
            </h1>
          </div>
          <p className="text-gray-600">
            Busca y selecciona un estudiante inscrito para generar su constancia con folio único y código QR de verificación
          </p>
        </div>

        {/* Buscador */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar por nombre o número de control..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Lista de estudiantes */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <h2 className="text-lg font-semibold text-gray-800">
              Estudiantes inscritos encontrados: {estudiantesFiltrados.length}
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Cargando estudiantes inscritos...
            </div>
          ) : estudiantesFiltrados.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No se encontraron estudiantes inscritos
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      No. Control
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Nombre Completo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Correo
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {estudiantesFiltrados.map((estudiante) => {
                    const nombreCompleto = `${estudiante.alunom || ""} ${
                      estudiante.aluapp || ""
                    } ${estudiante.aluapm || ""}`.trim();

                    return (
                      <tr
                        key={estudiante.aluctr}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {estudiante.aluctr}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {nombreCompleto}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {estudiante.alumai || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {estudiante.tieneActividadAprobada ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                              ✅ Puede generar constancia
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                              ⏳ Sin calificación aprobada
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => seleccionarEstudiante(estudiante)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <FileText size={16} />
                            {estudiante.tieneActividadAprobada ? "Generar Constancia" : "Ver Actividades"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal de edición */}
        {mostrarModal && estudianteSeleccionado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header del modal */}
              <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center gap-3">
                  <Shield className="text-blue-600" size={24} />
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Generar Constancia Verificable
                    </h3>
                    <p className="text-sm text-gray-600">Con folio único y código QR de seguridad</p>
                  </div>
                </div>
                <button
                  onClick={() => setMostrarModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Datos del estudiante */}
              <div className="p-6 bg-blue-50 border-b">
                <h4 className="font-semibold text-gray-700 mb-3">
                  Datos del Estudiante
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">
                      No. Control:
                    </label>
                    <p className="font-semibold text-gray-900">
                      {estudianteSeleccionado.aluctr}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">
                      Nombre Completo:
                    </label>
                    <p className="font-semibold text-gray-900">
                      {`${estudianteSeleccionado.alunom || ""} ${
                        estudianteSeleccionado.aluapp || ""
                      } ${estudianteSeleccionado.aluapm || ""}`.trim()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Selección de actividad */}
              <div className="p-6 border-b bg-gray-50">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Info size={18} className="text-blue-600" />
                  Selecciona la actividad para la constancia
                </h4>
                
                {inscripcionesEstudiante.length === 0 ? (
                  <p className="text-gray-500 text-sm">Cargando actividades...</p>
                ) : (
                  <div className="space-y-2">
                    {inscripcionesEstudiante.map((inscripcion, idx) => {
                      const actividad = inscripcion.actividad;
                      const nombreActividad = actividad?.aconco || actividad?.aticve || "Sin nombre";
                      const creditos = actividad?.acocre || "N/A";
                      const horas = actividad?.acohrs || "N/A";
                      const codigo = actividad?.aticve || "N/A";
                      const proposito = inscripcion.formularioData?.purpose;
                      
                      const calificacion = inscripcion.calificacion || 0;
                      const estaAprobado = calificacion >= 70;
                      const estadoTexto = calificacion > 0 
                        ? (estaAprobado ? "✅ Aprobado" : "❌ Reprobado") 
                        : "⏳ Sin calificar";
                      const estadoColor = calificacion > 0
                        ? (estaAprobado ? "text-green-600" : "text-red-600")
                        : "text-yellow-600";

                      // ✅ Mapeo visual del propósito
                      const propositoTexto = proposito === "creditos" 
                        ? "Créditos" 
                        : proposito === "servicio_social" 
                        ? "Servicio Social" 
                        : "Por Gusto";

                      const propositoColor = proposito === "creditos"
                        ? "bg-blue-100 text-blue-700"
                        : proposito === "servicio_social"
                        ? "bg-green-100 text-green-700"
                        : "bg-purple-100 text-purple-700";

                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            if (estaAprobado) {
                              setInscripcionSeleccionada(inscripcion);
                            }
                          }}
                          className={`p-4 border-2 rounded-lg transition-all ${
                            !estaAprobado 
                              ? "border-gray-300 bg-gray-100 opacity-60 cursor-not-allowed"
                              : inscripcionSeleccionada === inscripcion
                              ? "border-blue-500 bg-blue-50 cursor-pointer"
                              : "border-gray-200 hover:border-blue-300 bg-white cursor-pointer"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <p className="font-semibold text-gray-900">{nombreActividad}</p>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${propositoColor}`}>
                                  {propositoTexto}
                                </span>
                                <span className={`text-sm font-bold ${estadoColor}`}>
                                  {estadoTexto}
                                </span>
                              </div>
                              <div className="flex gap-4 mt-2 text-sm text-gray-600">
                                <span>📋 Código: {codigo}</span>
                                <span>⭐ Créditos: {creditos}</span>
                                <span>🕐 Horas: {horas}</span>
                                {calificacion > 0 && (
                                  <span className="font-semibold">📊 Calificación: {calificacion}</span>
                                )}
                              </div>
                              {!estaAprobado && (
                                <p className="text-xs text-red-600 mt-2">
                                  ⚠️ No se puede generar constancia. {calificacion > 0 ? "Calificación no aprobatoria." : "Esperando calificación del maestro."}
                                </p>
                              )}
                            </div>
                            {inscripcionSeleccionada === inscripcion && estaAprobado && (
                              <span className="text-blue-600 font-semibold">✓ Seleccionada</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Datos de la actividad (no editables) */}
              {inscripcionSeleccionada && (
                <div className="p-6 bg-green-50 border-b">
                  <h4 className="font-semibold text-gray-700 mb-3">
                    Datos de la Actividad (Automáticos)
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Actividad Complementaria
                      </label>
                      <div className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-800">
                        {inscripcionSeleccionada.actividad?.aconco || 
                         inscripcionSeleccionada.actividad?.aticve || 
                         "Sin nombre"}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Código
                        </label>
                        <div className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-800">
                          {inscripcionSeleccionada.actividad?.aticve || "N/A"}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Créditos
                        </label>
                        <div className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-800">
                          {inscripcionSeleccionada.actividad?.acocre || "N/A"}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Horas
                        </label>
                        <div className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-800">
                          {inscripcionSeleccionada.actividad?.acohrs || "N/A"}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Asesoría
                      </label>
                      <div className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-800">
                        Juan Carlos Leal Nodal
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Propósito de Inscripción
                      </label>
                      <div className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-800">
                        {inscripcionSeleccionada.formularioData?.purpose === "creditos"
                          ? "Créditos"
                          : inscripcionSeleccionada.formularioData?.purpose === "servicio_social"
                          ? "Servicio Social"
                          : "Por Gusto"}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ✅ CAMPOS EDITABLES (Solo período y cantidad) */}
              {inscripcionSeleccionada && (
                <div className="p-6 space-y-4">
                  <h4 className="font-semibold text-gray-700 mb-3">
                    Datos Editables
                  </h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Período *
                    </label>
                    <input
                      type="text"
                      value={datosConstancia.periodo}
                      onChange={(e) =>
                        setDatosConstancia({
                          ...datosConstancia,
                          periodo: e.target.value,
                        })
                      }
                      placeholder="Ej: Enero-Junio 2025, Agosto-Diciembre 2024..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* ✅ ACREDITACIÓN: Solo número editable */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Acreditación *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={datosConstancia.cantidadAcreditacion}
                        onChange={(e) =>
                          setDatosConstancia({
                            ...datosConstancia,
                            cantidadAcreditacion: e.target.value,
                          })
                        }
                        placeholder="Ej: 100"
                        min="0"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      <div className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 min-w-[100px] flex items-center justify-center font-medium">
                        {obtenerUnidadAcreditacion(inscripcionSeleccionada.formularioData?.purpose)}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {inscripcionSeleccionada.formularioData?.purpose === "servicio_social"
                        ? "Se acreditarán en Horas (Servicio Social)"
                        : inscripcionSeleccionada.formularioData?.purpose === "creditos"
                        ? "Se acreditarán en Créditos"
                        : ""}
                    </p>
                  </div>

                  {/* Nota de seguridad */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <div className="flex items-start gap-3">
                      <Shield className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                      <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-1">🔒 Sistema de Verificación</p>
                        <p>Esta constancia incluirá un folio único y código QR verificable. Cualquier intento de falsificación será detectado.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer del modal */}
              <div className="p-6 bg-gray-50 border-t flex gap-3 justify-end">
                <button
                  onClick={() => setMostrarModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  disabled={generandoPDF}
                >
                  Cancelar
                </button>
                <button
                  onClick={generarConstancia}
                  disabled={
                    !inscripcionSeleccionada ||
                    !datosConstancia.periodo ||
                    !datosConstancia.cantidadAcreditacion ||
                    generandoPDF ||
                    (inscripcionSeleccionada && (inscripcionSeleccionada.calificacion || 0) < 70)
                  }
                  className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  title={
                    inscripcionSeleccionada && (inscripcionSeleccionada.calificacion || 0) < 70
                      ? "El estudiante debe tener calificación aprobatoria (≥70)"
                      : ""
                  }
                >
                  {generandoPDF ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Generando...
                    </>
                  ) : (
                    <>
                      <Download size={18} />
                      Generar con Folio y QR
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
