"use client";
import { useState, useEffect } from "react";
import { 
  FileText, 
  Download, 
  Shield, 
  Calendar, 
  Award,
  ExternalLink,
  Search,
  Filter
} from "lucide-react";
import jsPDF from "jspdf";

export default function MisConstancias() {
  const [constancias, setConstancias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroAnio, setFiltroAnio] = useState("");
  
  // ✅ IMPORTANTE: Obtener número de control del estudiante logueado
  // Ajusta esto según tu sistema de autenticación
  const [numeroControl, setNumeroControl] = useState("");

 useEffect(() => {
  const obtenerNumeroControl = () => {
    // Opción 1: Desde localStorage directo
    let numControl = localStorage.getItem("numeroControl");
    
    // Opción 2: Desde studentData
    if (!numControl) {
      try {
        const studentDataStr = localStorage.getItem("studentData");
        if (studentDataStr) {
          const studentData = JSON.parse(studentDataStr);
          numControl = studentData.numeroControl;
          
          // Guardarlo para la próxima vez
          if (numControl) {
            localStorage.setItem("numeroControl", numControl);
            console.log("✅ Número de control recuperado de studentData:", numControl);
          }
        }
      } catch (error) {
        console.error("❌ Error al parsear studentData:", error);
      }
    }
    
    return numControl;
  };

  const numControl = obtenerNumeroControl();
  
  if (numControl) {
    setNumeroControl(numControl);
    cargarConstancias(numControl);
  } else {
    console.error("❌ No se encontró número de control");
    alert("⚠️ No se pudo obtener tu número de control. Por favor, inicia sesión nuevamente.");
    setLoading(false);
    
    // Opcional: redirigir al login después de 2 segundos
    setTimeout(() => {
      window.location.href = "/designs/vistaLogin";
    }, 2000);
  }
}, []);


  const cargarConstancias = async (numControl) => {
    try {
      setLoading(true);
      
      const response = await fetch(
        `/api/constancias/estudiante?numeroControl=${numControl}`,
        { cache: 'no-store' }
      );

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      if (!Array.isArray(data)) {
        console.error("❌ Respuesta no es array:", data);
        setConstancias([]);
        return;
      }

      setConstancias(data);
      console.log(`✅ Cargadas ${data.length} constancias`);
    } catch (error) {
      console.error("❌ Error al cargar constancias:", error);
      setConstancias([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Función para regenerar PDF desde los datos guardados
  const regenerarConstancia = async (constancia) => {
    try {
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

      // ✅ Título con tipo de liberación
      const tipoLiberacion = constancia.acreditacion?.includes("Horas")
        ? "Liberación de horas"
        : constancia.acreditacion?.includes("Créditos")
        ? "Liberación de créditos"
        : "Constancia de participación";

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("CONSTANCIA DE ACREDITACIÓN DE ACTIVIDAD", pageWidth - 30, 50, {
        align: "right",
      });
      doc.text("COMPLEMENTARIA", pageWidth - 30, 57, { align: "right" });
      
      doc.setFontSize(12);
      doc.text(tipoLiberacion, pageWidth - 30, 64, { align: "right" });

      // Folio y código
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(`Folio: ${constancia.folio}`, 20, 50);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(`Código: ${constancia.codigoVerificacion}`, 20, 55);

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

      const parrafoCompleto = `${texto1}${constancia.nombreCompleto}${texto2}${
        constancia.numeroControl
      }${texto3}${constancia.actividadNombre}${texto4}${
        constancia.periodo
      }${texto5}${texto6}${constancia.acreditacion}${texto7}`;

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

      // ✅ Generar QR
      const urlVerificacion = `${window.location.origin}/verificar/${constancia.folio}`;
      const qrCodeDataURL = await generarQRCode(urlVerificacion);

      if (qrCodeDataURL) {
        const qrSize = 35;
        const qrX = pageWidth - qrSize - 20;
        const qrY = pageHeight - qrSize - 35;
        
        doc.addImage(qrCodeDataURL, "PNG", qrX, qrY, qrSize, qrSize);
        
        doc.setFontSize(7);
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

      doc.save(`Constancia_${constancia.folio}_${constancia.nombreCompleto}.pdf`);
    } catch (error) {
      console.error("❌ Error al regenerar constancia:", error);
      alert("Error al descargar constancia");
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

  // Filtros
  const constanciasFiltradas = constancias.filter((constancia) => {
    const cumpleBusqueda = 
      constancia.actividadNombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      constancia.folio?.toLowerCase().includes(busqueda.toLowerCase());

    const anioConstancia = new Date(constancia.fechaEmision).getFullYear().toString();
    const cumpleAnio = !filtroAnio || anioConstancia === filtroAnio;

    return cumpleBusqueda && cumpleAnio;
  });

  // Obtener años únicos para filtro
  const aniosDisponibles = [...new Set(
    constancias.map(c => new Date(c.fechaEmision).getFullYear())
  )].sort((a, b) => b - a);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando constancias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Award className="text-blue-600" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Mis Constancias
              </h1>
              <p className="text-gray-600">
                Historial de constancias de actividades complementarias
              </p>
            </div>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg shadow p-4 border-l-4 border-blue-500">
            <p className="text-sm text-gray-600 mb-1">Total Constancias</p>
            <p className="text-3xl font-bold text-blue-700">
              {constancias.length}
            </p>
          </div>

          <div className="bg-green-50 rounded-lg shadow p-4 border-l-4 border-green-500">
            <p className="text-sm text-gray-600 mb-1">Actividades Completadas</p>
            <p className="text-3xl font-bold text-green-700">
              {new Set(constancias.map(c => c.actividadId)).size}
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg shadow p-4 border-l-4 border-purple-500">
            <p className="text-sm text-gray-600 mb-1">Último Año</p>
            <p className="text-3xl font-bold text-purple-700">
              {constancias.length > 0 
                ? new Date(constancias[0].fechaEmision).getFullYear()
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Buscador y filtros */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Buscar por actividad o folio..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={filtroAnio}
                onChange={(e) => setFiltroAnio(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Todos los años</option>
                {aniosDisponibles.map((anio) => (
                  <option key={anio} value={anio}>
                    {anio}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lista de constancias */}
        {constanciasFiltradas.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FileText className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No hay constancias disponibles
            </h3>
            <p className="text-gray-500">
              {constancias.length === 0
                ? "Aún no tienes constancias generadas"
                : "No se encontraron constancias con los filtros aplicados"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {constanciasFiltradas.map((constancia) => (
              <div
                key={constancia.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {constancia.actividadNombre}
                      </h3>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                        ✓ Verificada
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Shield className="text-blue-600" size={16} />
                        <span>
                          <strong>Folio:</strong> {constancia.folio}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="text-blue-600" size={16} />
                        <span>
                          <strong>Fecha:</strong>{" "}
                          {new Date(constancia.fechaEmision).toLocaleDateString("es-MX", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Award className="text-blue-600" size={16} />
                        <span>
                          <strong>Período:</strong> {constancia.periodo}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <FileText className="text-blue-600" size={16} />
                        <span>
                          <strong>Acreditación:</strong> {constancia.acreditacion}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">
                        <strong>Código de verificación:</strong>
                      </p>
                      <p className="font-mono text-sm text-gray-700">
                        {constancia.codigoVerificacion}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => regenerarConstancia(constancia)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download size={18} />
                      Descargar PDF
                    </button>

                    <a
                      href={`/verificar/${constancia.folio}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-center"
                    >
                      <ExternalLink size={18} />
                      Verificar
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}