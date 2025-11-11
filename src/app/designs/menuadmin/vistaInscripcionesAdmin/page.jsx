// "use client";
// import React, { useState, useEffect } from "react";
// import { Users, ChevronDown, ChevronUp, Search } from "lucide-react";
// import AdminSidebar from "@/app/components/navbaradm";

// const InscripcionesPanel = () => {
//   const [actividadesOfertadas, setActividadesOfertadas] = useState([]);
//   const [inscripciones, setInscripciones] = useState({});
//   const [actividadExpandida, setActividadExpandida] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [busqueda, setBusqueda] = useState("");

//   useEffect(() => {
//     cargarDatos();
//   }, []);

//   const cargarDatos = async () => {
//     try {
//       setLoading(true);

//       // Cargar actividades ofertadas
//       const resOfertas = await fetch("/api/act-disponibles");
//       const ofertas = await resOfertas.json();

//       // Cargar todas las inscripciones
//       const resInscripciones = await fetch("/api/inscripdispo");
//       const todasInscripciones = await resInscripciones.json();

//       // Agrupar inscripciones por actividad
//       const inscripcionesPorActividad = {};
//       todasInscripciones.forEach((inscripcion) => {
//         const actId = inscripcion.actividadId;
//         if (!inscripcionesPorActividad[actId]) {
//           inscripcionesPorActividad[actId] = [];
//         }
//         inscripcionesPorActividad[actId].push(inscripcion);
//       });

//       setActividadesOfertadas(ofertas);
//       setInscripciones(inscripcionesPorActividad);
//     } catch (error) {
//       console.error("Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleActividad = (actividadId) => {
//     setActividadExpandida(
//       actividadExpandida === actividadId ? null : actividadId
//     );
//   };

//   const actividadesFiltradas = actividadesOfertadas.filter((oferta) =>
//     (oferta.actividad.aconco || oferta.actividad.aticve || "")
//       .toLowerCase()
//       .includes(busqueda.toLowerCase())
//   );

//   if (loading) {
//     return <div className="text-center py-8">Cargando inscripciones...</div>;
//   }

//   return (
//     <div className="flex justify-center px-6 py-6 space-y-6">
//       <div className="bg-white rounded-lg shadow-md p-6">
//         <h2 className="text-2xl font-bold text-gray-800 mb-2">
//           Inscripciones por Actividad
//         </h2>
//         <p className="text-gray-600">
//           Lista de estudiantes inscritos en cada actividad
//         </p>
//       </div>

//       <div className="bg-white rounded-lg shadow-md p-4">
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Buscar actividad..."
//             value={busqueda}
//             onChange={(e) => setBusqueda(e.target.value)}
//             className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
//         </div>
//       </div>

//       <div className="space-y-3">
//         {actividadesFiltradas.length === 0 ? (
//           <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
//             No se encontraron actividades ofertadas
//           </div>
//         ) : (
//           actividadesFiltradas.map((oferta) => {
//             const inscritos = inscripciones[oferta.actividadId] || [];
//             const isExpanded = actividadExpandida === oferta.actividadId;

//             return (
//               <div
//                 key={oferta.id}
//                 className="bg-white rounded-lg shadow-md overflow-hidden"
//               >
//                 <button
//                   onClick={() => toggleActividad(oferta.actividadId)}
//                   className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
//                 >
//                   <div className="flex-1 text-left">
//                     <h3 className="font-semibold text-gray-800 text-lg">
//                       {oferta.actividad?.aconco ||
//                         oferta.actividad?.aticve ||
//                         ""}
//                     </h3>
//                     <div className="flex gap-4 mt-1 text-sm text-gray-600">
//                       <span>Código: {oferta.actividad.aticve}</span>
//                       <span>Créditos: {oferta.actividad.acocre}</span>
//                       <span>Horas: {oferta.actividad.acohrs}</span>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <span
//                       className={`px-3 py-1 rounded-full text-sm font-medium ${
//                         inscritos.length > 0
//                           ? "bg-green-100 text-green-800"
//                           : "bg-gray-100 text-gray-600"
//                       }`}
//                     >
//                       <Users size={14} className="inline mr-1" />
//                       {inscritos.length} inscritos
//                     </span>
//                     {isExpanded ? <ChevronUp /> : <ChevronDown />}
//                   </div>
//                 </button>

//                 {/* Lista de estudiantes inscritos */}
//                 {isExpanded && (
//                   <div className="border-t border-gray-200 p-4 bg-gray-50">
//                     {inscritos.length === 0 ? (
//                       <p className="text-center text-gray-500 py-4">
//                         No hay estudiantes inscritos en esta actividad
//                       </p>
//                     ) : (
//                       <div className="overflow-x-auto">
//                         <table className="w-full">
//                           <thead className="bg-gray-100">
//                             <tr>
//                               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
//                                 No. Control
//                               </th>
//                               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
//                                 Nombre
//                               </th>
//                               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
//                                 Fecha Inscripción
//                               </th>
//                               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
//                                 Tipo de Sangre
//                               </th>
//                               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
//                                 Propósito
//                               </th>
//                             </tr>
//                           </thead>
//                           <tbody className="bg-white divide-y divide-gray-200">
//                             {inscritos.map((inscripcion, idx) => {
//                               const nombreCompleto = `${
//                                 inscripcion.estudiante.alunom || ""
//                               } ${inscripcion.estudiante.aluapp || ""} ${
//                                 inscripcion.estudiante.aluapm || ""
//                               }`.trim();

//                               return (
//                                 <tr key={idx} className="hover:bg-gray-50">
//                                   <td className="px-4 py-3 text-sm text-gray-900">
//                                     {inscripcion.estudiante.aluctr}
//                                   </td>
//                                   <td className="px-4 py-3 text-sm text-gray-900">
//                                     {nombreCompleto || "Sin nombre"}
//                                   </td>
//                                   <td className="px-4 py-3 text-sm text-gray-600">
//                                     {new Date(
//                                       inscripcion.fechaInscripcion
//                                     ).toLocaleDateString()}
//                                   </td>
//                                   <td className="px-4 py-3 text-sm text-gray-600">
//                                     {inscripcion.formularioData?.bloodType ||
//                                       "N/A"}
//                                   </td>
//                                   <td className="px-4 py-3 text-sm text-gray-600">
//                                     {inscripcion.formularioData?.purpose ||
//                                       "N/A"}
//                                   </td>
//                                 </tr>
//                               );
//                             })}
//                           </tbody>
//                         </table>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// };

// export default InscripcionesPanel;
"use client";
import React, { useState, useEffect } from "react";
import { Users, ChevronDown, ChevronUp, Search, Filter, X } from "lucide-react";

const InscripcionesPanel = () => {
  const [actividadesOfertadas, setActividadesOfertadas] = useState([]);
  const [inscripciones, setInscripciones] = useState({});
  const [actividadExpandida, setActividadExpandida] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estados de filtros
  const [busqueda, setBusqueda] = useState("");
  const [filtroSemestre, setFiltroSemestre] = useState("");
  const [filtroSexo, setFiltroSexo] = useState("");
  const [filtroTipoActividad, setFiltroTipoActividad] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  // Debug: Ver estructura de datos
  useEffect(() => {
    if (Object.keys(inscripciones).length > 0) {
      const primeraInscripcion = Object.values(inscripciones)[0][0];
      console.log("✅ Ejemplo de inscripción:", primeraInscripcion);
      console.log("✅ Estudiante:", primeraInscripcion?.estudiante);
      console.log(
        "✅ Semestre (aluare):",
        primeraInscripcion?.estudiante?.aluare
      );
      console.log("✅ Sexo:", primeraInscripcion?.estudiante?.alusex);
      console.log("✅ Actividad:", primeraInscripcion?.actividad?.aticve);
    }
  }, [inscripciones]);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      // Cargar actividades ofertadas
      const resOfertas = await fetch("/api/act-disponibles");
      const ofertas = await resOfertas.json();

      // Cargar todas las inscripciones CON datos de estudiantes
      const resInscripciones = await fetch("/api/inscripciones");
      const todasInscripciones = await resInscripciones.json();

      console.log("📊 Inscripciones recibidas:", todasInscripciones.length);
      if (todasInscripciones.length > 0) {
        console.log("📋 Primera inscripción:", todasInscripciones[0]);
        console.log("👤 Estudiante:", todasInscripciones[0]?.estudiante);
        console.log(
          "📚 Semestre (aluare):",
          todasInscripciones[0]?.estudiante?.aluare
        );
        console.log(
          "⚧ Sexo (alusex):",
          todasInscripciones[0]?.estudiante?.alusex
        );
        console.log(
          "🎯 Código actividad:",
          todasInscripciones[0]?.actividad?.aticve
        );
      }

      // Agrupar inscripciones por actividad
      const inscripcionesPorActividad = {};
      todasInscripciones.forEach((inscripcion) => {
        const actId = inscripcion.actividadId;
        if (!inscripcionesPorActividad[actId]) {
          inscripcionesPorActividad[actId] = [];
        }
        inscripcionesPorActividad[actId].push(inscripcion);
      });

      setActividadesOfertadas(ofertas);
      setInscripciones(inscripcionesPorActividad);
    } catch (error) {
      console.error("❌ Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActividad = (actividadId) => {
    setActividadExpandida(
      actividadExpandida === actividadId ? null : actividadId
    );
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setFiltroSemestre("");
    setFiltroSexo("");
    setFiltroTipoActividad("");
  };

  // Obtener tipo de actividad basado en el código y nombre
  const obtenerTipoActividad = (codigo, nombreActividad) => {
    if (!codigo) return "OTRA";
    const codigoUpper = codigo.toUpperCase();

    // D = Deportiva
    if (codigoUpper === "D" || codigoUpper.includes("DEP")) {
      return "DEPORTIVA";
    }

    // C = Cívica o Cultural (distinguir por el nombre)
    if (
      codigoUpper === "C" ||
      codigoUpper.includes("CIV") ||
      codigoUpper.includes("CUL")
    ) {
      const nombreUpper = (nombreActividad || "").toUpperCase();

      // Si el nombre contiene "CULTURAL" es cultural
      if (
        nombreUpper.includes("CULTURAL") ||
        nombreUpper.includes("ARTE") ||
        nombreUpper.includes("MUSICA") ||
        nombreUpper.includes("DANZA") ||
        nombreUpper.includes("TEATRO") ||
        nombreUpper.includes("ALTAR")
      ) {
        return "CULTURAL";
      }

      // Si el nombre contiene "CIVICA" o similares, es cívica
      if (
        nombreUpper.includes("CIVICA") ||
        nombreUpper.includes("CIVICO") ||
        nombreUpper.includes("COMUNITARIA") ||
        nombreUpper.includes("SOCIAL")
      ) {
        return "CIVICA";
      }

      // Por defecto si tiene C, considerarla Cultural
      return "CULTURAL";
    }

    return "OTRA";
  };

  // Filtrar actividades y sus inscripciones
  const actividadesFiltradas = actividadesOfertadas.filter((oferta) => {
    // Filtro por búsqueda de nombre
    const nombreActividad = (
      oferta.actividad?.aconco ||
      oferta.actividad?.aticve ||
      ""
    ).toLowerCase();
    const cumpleBusqueda = nombreActividad.includes(busqueda.toLowerCase());

    // Filtro por tipo de actividad (pasar nombre también)
    const tipoActividad = obtenerTipoActividad(
      oferta.actividad?.aticve,
      oferta.actividad?.aconco
    );
    const cumpleTipo =
      !filtroTipoActividad || tipoActividad === filtroTipoActividad;

    // Si no cumple búsqueda o tipo, excluir
    if (!cumpleBusqueda || !cumpleTipo) return false;

    // Si hay filtros de estudiante, revisar inscripciones
    if (filtroSemestre || filtroSexo) {
      const inscritos = inscripciones[oferta.actividadId] || [];
      const tieneInscripcionesValidas = inscritos.some((inscripcion) => {
        const semestreEstudiante = inscripcion.estudiante?.aluare?.toString(); // 🔥 aluare
        const sexoEstudiante = inscripcion.estudiante?.alusex;

        const cumpleSemestre =
          !filtroSemestre || semestreEstudiante === filtroSemestre;
        const sexoNumerico =
          filtroSexo === "M" ? 1 : filtroSexo === "F" ? 2 : null;
        const cumpleSexo = !filtroSexo || sexoEstudiante === sexoNumerico;

        return cumpleSemestre && cumpleSexo;
      });
      return tieneInscripcionesValidas;
    }

    return true;
  });

  // Calcular totales
  const calcularTotales = () => {
    let totalEstudiantes = 0;
    let totalActividades = actividadesFiltradas.length;
    let porSexo = { M: 0, F: 0 };
    let porSemestre = {};
    let porTipoActividad = { CIVICA: 0, CULTURAL: 0, DEPORTIVA: 0, OTRA: 0 };

    actividadesFiltradas.forEach((oferta) => {
      const inscritos = inscripciones[oferta.actividadId] || [];
      const tipoActividad = obtenerTipoActividad(
        oferta.actividad?.aticve,
        oferta.actividad?.aconco
      );

      const inscritosFiltrados = inscritos.filter((inscripcion) => {
        const semestreEstudiante = inscripcion.estudiante?.alusme?.toString();
        const sexoEstudiante = inscripcion.estudiante?.alusex;

        const cumpleSemestre =
          !filtroSemestre || semestreEstudiante === filtroSemestre;
        const sexoNumerico =
          filtroSexo === "M" ? 1 : filtroSexo === "F" ? 2 : null;
        const cumpleSexo = !filtroSexo || sexoEstudiante === sexoNumerico;

        return cumpleSemestre && cumpleSexo;
      });

      totalEstudiantes += inscritosFiltrados.length;

      // Solo contar en tipo de actividad si hay estudiantes filtrados
      if (inscritosFiltrados.length > 0) {
        porTipoActividad[tipoActividad] += inscritosFiltrados.length;
      }

      inscritosFiltrados.forEach((inscripcion) => {
        const sexo = inscripcion.estudiante?.alusex;
        // 1 = Masculino, 2 = Femenino
        if (sexo === 1) {
          porSexo.M++;
        } else if (sexo === 2) {
          porSexo.F++;
        }

        const semestre = inscripcion.estudiante?.alusme?.toString() || "N/A";
        porSemestre[semestre] = (porSemestre[semestre] || 0) + 1;
      });
    });

    return {
      totalEstudiantes,
      totalActividades,
      porSexo,
      porSemestre,
      porTipoActividad,
    };
  };

  const totales = calcularTotales();

  // Obtener semestres únicos para el select
  const semestreOptions = [
    ...new Set(
      Object.values(inscripciones)
        .flat()
        .map((i) => i.estudiante?.aluare) // 🔥 Cambio: aluare
        .filter((sem) => sem !== null && sem !== undefined)
    ),
  ].sort((a, b) => Number(a) - Number(b));

  if (loading) {
    return <div className="text-center py-8">Cargando inscripciones...</div>;
  }

  return (
    <div className="flex justify-center px-6 py-6">
      <div className="max-w-7xl w-full space-y-6">
        {/* Encabezado */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Inscripciones por Actividad
          </h2>
          <p className="text-gray-600">
            Lista de estudiantes inscritos en cada actividad
          </p>
        </div>

        {/* Tarjetas de Totales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg shadow p-4 border-l-4 border-blue-500">
            <p className="text-sm text-gray-600 mb-1">Total Estudiantes</p>
            <p className="text-3xl font-bold text-blue-700">
              {totales.totalEstudiantes}
            </p>
          </div>

          <div className="bg-green-50 rounded-lg shadow p-4 border-l-4 border-green-500">
            <p className="text-sm text-gray-600 mb-1">Total Actividades</p>
            <p className="text-3xl font-bold text-green-700">
              {totales.totalActividades}
            </p>
          </div>

          <div className="bg-pink-50 rounded-lg shadow p-4 border-l-4 border-pink-500">
            <p className="text-sm text-gray-600 mb-1">Mujeres</p>
            <p className="text-3xl font-bold text-pink-700">
              {totales.porSexo.F}
            </p>
          </div>

          <div className="bg-indigo-50 rounded-lg shadow p-4 border-l-4 border-indigo-500">
            <p className="text-sm text-gray-600 mb-1">Hombres</p>
            <p className="text-3xl font-bold text-indigo-700">
              {totales.porSexo.M}
            </p>
          </div>
        </div>

        {/* Desglose por tipo de actividad */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Inscripciones por Tipo
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {totales.porTipoActividad.CIVICA}
              </p>
              <p className="text-sm text-gray-600">Cívicas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {totales.porTipoActividad.CULTURAL}
              </p>
              <p className="text-sm text-gray-600">Culturales</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {totales.porTipoActividad.DEPORTIVA}
              </p>
              <p className="text-sm text-gray-600">Deportivas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">
                {totales.porTipoActividad.OTRA}
              </p>
              <p className="text-sm text-gray-600">Otras</p>
            </div>
          </div>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Buscar actividad..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>

            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                mostrarFiltros
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Filter size={18} />
              Filtros
              {(filtroSemestre || filtroSexo || filtroTipoActividad) && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {
                    [filtroSemestre, filtroSexo, filtroTipoActividad].filter(
                      Boolean
                    ).length
                  }
                </span>
              )}
            </button>
          </div>

          {/* Panel de filtros */}
          {mostrarFiltros && (
            <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Semestre
                </label>
                <select
                  value={filtroSemestre}
                  onChange={(e) => setFiltroSemestre(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos</option>
                  {semestreOptions.map((sem) => (
                    <option key={sem} value={sem}>
                      {sem}° Semestre
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sexo
                </label>
                <select
                  value={filtroSexo}
                  onChange={(e) => setFiltroSexo(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Actividad
                </label>
                <select
                  value={filtroTipoActividad}
                  onChange={(e) => setFiltroTipoActividad(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas</option>
                  <option value="CIVICA">Cívica</option>
                  <option value="CULTURAL">Cultural</option>
                  <option value="DEPORTIVA">Deportiva</option>
                  <option value="OTRA">Otra</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={limpiarFiltros}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <X size={18} />
                  Limpiar Filtros
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Lista de actividades */}
        <div className="space-y-3">
          {actividadesFiltradas.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
              No se encontraron actividades con los filtros seleccionados
            </div>
          ) : (
            actividadesFiltradas.map((oferta) => {
              const inscritos = inscripciones[oferta.actividadId] || [];
              const inscritosFiltrados = inscritos.filter((inscripcion) => {
                const semestreEstudiante =
                  inscripcion.estudiante?.alusme?.toString();
                const sexoEstudiante = inscripcion.estudiante?.alusex; // Numérico

                const cumpleSemestre =
                  !filtroSemestre || semestreEstudiante === filtroSemestre;
                const sexoNumerico =
                  filtroSexo === "M" ? 1 : filtroSexo === "F" ? 2 : null;
                const cumpleSexo =
                  !filtroSexo || sexoEstudiante === sexoNumerico;

                return cumpleSemestre && cumpleSexo;
              });

              const isExpanded = actividadExpandida === oferta.actividadId;
              const tipoActividad = obtenerTipoActividad(
                oferta.actividad?.aticve,
                oferta.actividad?.aconco
              );

              return (
                <div
                  key={oferta.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <button
                    onClick={() => toggleActividad(oferta.actividadId)}
                    className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-800 text-lg">
                          {oferta.actividad?.aconco ||
                            oferta.actividad?.aticve ||
                            ""}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            tipoActividad === "CIVICA"
                              ? "bg-blue-100 text-blue-700"
                              : tipoActividad === "CULTURAL"
                              ? "bg-purple-100 text-purple-700"
                              : tipoActividad === "DEPORTIVA"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {tipoActividad}
                        </span>
                      </div>
                      <div className="flex gap-4 mt-1 text-sm text-gray-600">
                        <span>Código: {oferta.actividad.aticve}</span>
                        <span>Créditos: {oferta.actividad.acocre}</span>
                        <span>Horas: {oferta.actividad.acohrs}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          inscritosFiltrados.length > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <Users size={14} className="inline mr-1" />
                        {inscritosFiltrados.length} inscritos
                      </span>
                      {isExpanded ? <ChevronUp /> : <ChevronDown />}
                    </div>
                  </button>

                  {/* Lista de estudiantes inscritos */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                      {inscritosFiltrados.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">
                          No hay estudiantes inscritos con los filtros
                          seleccionados
                        </p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                                  No. Control
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                                  Nombre
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                                  Semestre
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                                  Sexo
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                                  Fecha Inscripción
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                                  Tipo de Sangre
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                                  Propósito
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {inscritosFiltrados.map((inscripcion, idx) => {
                                const nombreCompleto = `${
                                  inscripcion.estudiante.alunom || ""
                                } ${inscripcion.estudiante.aluapp || ""} ${
                                  inscripcion.estudiante.aluapm || ""
                                }`.trim();

                                return (
                                  <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-900">
                                      {inscripcion.estudiante.aluctr}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900">
                                      {nombreCompleto || "Sin nombre"}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                      {inscripcion.estudiante?.alusme || "N/A"}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                      {inscripcion.estudiante?.alusex === 1
                                        ? "Masculino"
                                        : inscripcion.estudiante?.alusex === 2
                                        ? "Femenino"
                                        : "N/A"}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                      {new Date(
                                        inscripcion.fechaInscripcion
                                      ).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                      {inscripcion.formularioData?.bloodType ||
                                        "N/A"}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                      {inscripcion.formularioData?.purpose ||
                                        "N/A"}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default InscripcionesPanel;
