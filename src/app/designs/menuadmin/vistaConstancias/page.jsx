"use client";
import { useState, useEffect } from "react";
import { Search, FileText, Download, Edit2, X } from "lucide-react";
import jsPDF from "jspdf";

export default function VistaConstancias() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Datos editables de la constancia
  const [datosConstancia, setDatosConstancia] = useState({
    actividad: "",
    periodo: "",
    asesoria: "",
    acreditacion: "",
  });

  // Cargar estudiantes
  useEffect(() => {
    cargarEstudiantes();
  }, []);

  const cargarEstudiantes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/listaEstudiantes");
      const data = await response.json();
      setEstudiantes(data);
    } catch (error) {
      console.error("Error al cargar estudiantes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar estudiantes por búsqueda
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

  // Seleccionar estudiante y abrir modal
  const seleccionarEstudiante = (estudiante) => {
    setEstudianteSeleccionado(estudiante);
    setMostrarModal(true);
    setDatosConstancia({
      actividad: "",
      periodo: "",
      asesoria: "",
      acreditacion: "",
    });
  };

  // Generar PDF
  const generarConstancia = () => {
    if (!estudianteSeleccionado) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Configurar fuentes
    doc.setFont("helvetica");

    // Header - Logo y títulos (simulado)
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

    // Nombre de la institución
    doc.setFontSize(10);
    doc.text("Instituto Tecnológico de Ensenada", pageWidth - 30, 35, {
      align: "right",
    });

    // Título del documento
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("CONSTANCIA DE ACREDITACIÓN DE ACTIVIDAD", pageWidth - 30, 50, {
      align: "right",
    });
    doc.text("COMPLEMENTARIA", pageWidth - 30, 57, { align: "right" });

    // Cuerpo del documento
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    let y = 80;
    doc.text("A QUIEN CORRESPONDA", 20, y);

    y += 15;
    doc.setFont("helvetica", "bold");
    doc.text("PRESENTE", 20, y);

    y += 15;
    doc.setFont("helvetica", "normal");

    // Nombre completo del estudiante
    const nombreCompleto = `${estudianteSeleccionado.alunom || ""} ${
      estudianteSeleccionado.aluapp || ""
    } ${estudianteSeleccionado.aluapm || ""}`.trim();

    // Texto con datos prellenados
    const texto1 = `Se envía un cordial saludo y a su vez se le extiende la presente constancia al (la) alumno (a): `;
    const texto2 = `, con número de control `;
    const texto3 = `, quien ha participado en la actividad complementaria: `;
    const texto4 = `, en el período `;
    const texto5 = `, bajo la asesoría de `;
    const texto6 = `, obteniendo una acreditación de `;
    const texto7 = ` conforme a las disposiciones del ITE.`;

    const margenIzq = 20;
    const margenDer = pageWidth - 20;
    const anchoTexto = margenDer - margenIzq;

    // Función para escribir texto con wrap
    const escribirTexto = (texto, yPos) => {
      const lineas = doc.splitTextToSize(texto, anchoTexto);
      lineas.forEach((linea) => {
        doc.text(linea, margenIzq, yPos);
        yPos += 7;
      });
      return yPos;
    };

    // Construir el párrafo completo
    const parrafoCompleto = `${texto1}${nombreCompleto}${texto2}${
      estudianteSeleccionado.aluctr
    }${texto3}${datosConstancia.actividad || "_______________"}${texto4}${
      datosConstancia.periodo || "_______________"
    }${texto5}${datosConstancia.asesoria || "_______________"}${texto6}${
      datosConstancia.acreditacion || "_______________"
    }${texto7}`;

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

    // Línea de firma
    y += 25;
    doc.line(margenIzq, y, margenIzq + 100, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Nombre, departamento y firma del responsable", margenIzq, y);

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

    // Descargar PDF
    doc.save(
      `Constancia_${estudianteSeleccionado.aluctr}_${nombreCompleto}.pdf`
    );

    setMostrarModal(false);
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
            Busca y selecciona un estudiante para generar su constancia de
            actividad comentaria y horas servicio social
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
              Estudiantes encontrados: {estudiantesFiltrados.length}
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Cargando estudiantes...
            </div>
          ) : estudiantesFiltrados.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No se encontraron estudiantes
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
                          <button
                            onClick={() => seleccionarEstudiante(estudiante)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <FileText size={16} />
                            Generar Constancia
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
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header del modal */}
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center gap-3">
                  <Edit2 className="text-blue-600" size={24} />
                  <h3 className="text-xl font-bold text-gray-800">
                    Editar Datos de la Constancia
                  </h3>
                </div>
                <button
                  onClick={() => setMostrarModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Datos del estudiante (no editables) */}
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

              {/* Campos editables */}
              <div className="p-6 space-y-4">
                <h4 className="font-semibold text-gray-700 mb-3">
                  Datos de la Actividad (editables)
                </h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Actividad Complementaria *
                  </label>
                  <input
                    type="text"
                    value={datosConstancia.actividad}
                    onChange={(e) =>
                      setDatosConstancia({
                        ...datosConstancia,
                        actividad: e.target.value,
                      })
                    }
                    placeholder="Ej: Fútbol Soccer, Música, Danza Folclórica..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asesoría
                  </label>
                  <input
                    type="text"
                    value={datosConstancia.asesoria}
                    onChange={(e) =>
                      setDatosConstancia({
                        ...datosConstancia,
                        asesoria: e.target.value,
                      })
                    }
                    placeholder="Ej: Mtro. Juan Pérez García, Departamento de Deportes..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Acreditacion
                  </label>
                  <input
                    type="text"
                    value={datosConstancia.acreditacion}
                    onChange={(e) =>
                      setDatosConstancia({
                        ...datosConstancia,
                        acreditacion: e.target.value,
                      })
                    }
                    placeholder="Ej: Mtro. Juan Pérez García, Departamento de Deportes..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Footer del modal */}
              <div className="p-6 bg-gray-50 border-t flex gap-3 justify-end">
                <button
                  onClick={() => setMostrarModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={generarConstancia}
                  disabled={
                    !datosConstancia.actividad ||
                    !datosConstancia.periodo ||
                    !datosConstancia.acreditacion
                  }
                  className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <Download size={18} />
                  Generar y Descargar PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}