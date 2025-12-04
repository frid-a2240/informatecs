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
  const [filtroProposito, setFiltroProposito] = useState(""); // ✅ NUEVO FILTRO
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
        primeraInscripcion?.estudiante?.calnpe
      );
      console.log("✅ Sexo:", primeraInscripcion?.estudiante?.alusex);
      console.log("✅ Actividad:", primeraInscripcion?.actividad?.aticve);
      console.log("✅ Propósito:", primeraInscripcion?.formularioData?.purpose);
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
          "📚 Semestre (calnpe):",
          todasInscripciones[0]?.estudiante?.inscripciones?.calnpe
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
    setFiltroProposito(""); // ✅ LIMPIAR NUEVO FILTRO
  };

  // ✅ FUNCIÓN PARA FORMATEAR PROPÓSITO
  const formatearProposito = (purpose) => {
    if (!purpose) return { texto: "N/A", color: "bg-gray-100 text-gray-700" };

    const mapeo = {
      creditos: { texto: "Créditos", color: "bg-blue-100 text-blue-700" },
      servicio_social: { texto: "Servicio Social", color: "bg-green-100 text-green-700" },
      por_gusto: { texto: "Por Gusto", color: "bg-purple-100 text-purple-700" },
    };

    return mapeo[purpose] || { texto: purpose, color: "bg-gray-100 text-gray-700" };
  };

  // Obtener tipo de actividad basado en el código y descripción
  const obtenerTipoActividad = (codigo, nombreActividad, descripcion) => {
    const codigoUpper = (codigo || "").toUpperCase().trim();
    const nombreUpper = (nombreActividad || "").toUpperCase();
    const descripcionUpper = (descripcion || "").toUpperCase();

    const textoCompleto = `${nombreUpper} ${descripcionUpper}`;

    // 1. DEPORTIVAS
    if (codigoUpper === "D") {
      return "DEPORTIVA";
    }

    const palabrasDeportivas = [
      "FUTBOL",
      "SOCCER",
      "VOLEIBOL",
      "VOLLEYBALL",
      "BEISBOL",
      "BASEBALL",
      "SOFTBOL",
      "SOFTBALL",
      "BASQUETBOL",
      "BASKETBALL",
      "ATLETISMO PISTA",
      "ATLETISMO CAMPO",
      "NATACION",
      "SWIMMING",
      "TENIS DE MESA",
      "TENIS ",
      " TENIS",
      "TENNIS",
      "AJEDREZ",
      "CHESS",
      "ACTIVIDAD DEPORTIVA",
      "EVENTO DEPORTIVO",
    ];

    for (let palabra of palabrasDeportivas) {
      if (textoCompleto.includes(palabra)) {
        return "DEPORTIVA";
      }
    }

    // 2. Excluir actividades
    const palabrasExcluir = [
      "TUTORIA",
      "TUTORIAS",
      "TALLER TALENTO",
      "TICS",
      "TECNOLOGIA",
      "CONGRESO GENERAL",
      "INVESTIGACION",
      "RALLY LATINOAMERICANO",
      "RALLY CB",
      "RALLY DE CIENCIAS",
      "ENCUENTRO NACIONAL",
      "ARGOS",
      "CLUB TECNOLOGICO",
      "EVENTO EXTERNO",
      "CONCURSO CB",
      "ANFEI",
      "MOOCS DEPORTIVOS",
    ];

    for (let palabra of palabrasExcluir) {
      if (textoCompleto.includes(palabra)) {
        return "OTRA";
      }
    }

    // 3. CÍVICAS
    const palabrasCivicas = [
      "ACT CIVICAS",
      "ACTIVIDAD CIVICA",
      "ACTIVIDADES CIVICAS",
      "ESCOLTA",
      "CENTRO DE ACOPIO",
      "CARRERA ALBATROS",
      "COLILLATON",
    ];

    for (let palabra of palabrasCivicas) {
      if (textoCompleto.includes(palabra)) {
        return "CIVICA";
      }
    }

    // 4. CULTURALES
    const palabrasCulturales = [
      "ACT CULTURALES",
      "ACT ARTISTICAS",
      "MUSICA",
      "DANZA FOLCLORICA",
      "DANZA FOLKLORICA",
      "ARTES VISUALES",
      "ALTAR DE MUERTOS",
      "CLUB DE LECTURA",
      "CATRINES",
      "CATRINAS",
      "BANDA DE GUERRA",
      "MOOCS CULTURALES",
    ];

    for (let palabra of palabrasCulturales) {
      if (textoCompleto.includes(palabra)) {
        return "CULTURAL";
      }
    }

    // 5. Si el código es "C"
    if (codigoUpper === "C") {
      return "CULTURAL";
    }

    return "OTRA";
  };

  // Filtrar actividades y sus inscripciones
  const actividadesFiltradas = actividadesOfertadas.filter((oferta) => {
    const nombreActividad = (
      oferta.actividad?.aconco ||
      oferta.actividad?.aticve ||
      ""
    ).toLowerCase();
    const cumpleBusqueda = nombreActividad.includes(busqueda.toLowerCase());

    const tipoActividad = obtenerTipoActividad(
      oferta.actividad?.aticve,
      oferta.actividad?.aconco,
      oferta.actividad?.acodes
    );
    const cumpleTipo =
      !filtroTipoActividad || tipoActividad === filtroTipoActividad;

    if (!cumpleBusqueda || !cumpleTipo) return false;

    // ✅ FILTRO DE PROPÓSITO
    if (filtroSemestre || filtroSexo || filtroProposito) {
      const inscritos = inscripciones[oferta.actividadId] || [];
      const tieneInscripcionesValidas = inscritos.some((inscripcion) => {
        const semestreEstudiante =
          inscripcion.estudiante?.inscripciones?.calnpe?.toString();
        const sexoEstudiante = inscripcion.estudiante?.alusex;
        const propositoEstudiante = inscripcion.formularioData?.purpose;

        const cumpleSemestre =
          !filtroSemestre || semestreEstudiante === filtroSemestre;
        const sexoNumerico =
          filtroSexo === "M" ? 1 : filtroSexo === "F" ? 2 : null;
        const cumpleSexo = !filtroSexo || sexoEstudiante === sexoNumerico;
        const cumpleProposito =
          !filtroProposito || propositoEstudiante === filtroProposito;

        return cumpleSemestre && cumpleSexo && cumpleProposito;
      });
      return tieneInscripcionesValidas;
    }

    return true;
  });

  // Calcular totales
  const calcularTotales = () => {
    let totalActividades = actividadesFiltradas.length;

    const estudiantesUnicos = new Set();
    const estudiantesUnicosPorSexo = { M: new Set(), F: new Set() };
    const actividadesPorTipo = {
      CIVICA: new Set(),
      CULTURAL: new Set(),
      DEPORTIVA: new Set(),
      OTRA: new Set(),
    };

    // ✅ CONTADORES POR PROPÓSITO
    const estudiantesPorProposito = {
      creditos: new Set(),
      servicio_social: new Set(),
      por_gusto: new Set(),
    };

    let porSemestre = {};

    actividadesFiltradas.forEach((oferta) => {
      const inscritos = inscripciones[oferta.actividadId] || [];
      const tipoActividad = obtenerTipoActividad(
        oferta.actividad?.aticve,
        oferta.actividad?.aconco,
        oferta.actividad?.acodes
      );

      const inscritosFiltrados = inscritos.filter((inscripcion) => {
        const semestreEstudiante =
          inscripcion.estudiante?.inscripciones?.calnpe?.toString();
        const sexoEstudiante = inscripcion.estudiante?.alusex;
        const propositoEstudiante = inscripcion.formularioData?.purpose;

        const cumpleSemestre =
          !filtroSemestre || semestreEstudiante === filtroSemestre;
        const sexoNumerico =
          filtroSexo === "M" ? 1 : filtroSexo === "F" ? 2 : null;
        const cumpleSexo = !filtroSexo || sexoEstudiante === sexoNumerico;
        const cumpleProposito =
          !filtroProposito || propositoEstudiante === filtroProposito;

        return cumpleSemestre && cumpleSexo && cumpleProposito;
      });

      if (inscritosFiltrados.length > 0) {
        actividadesPorTipo[tipoActividad].add(oferta.actividadId);
      }

      inscritosFiltrados.forEach((inscripcion) => {
        const numeroControl = inscripcion.estudiante?.aluctr;
        const sexo = inscripcion.estudiante?.alusex;
        const semestre =
          inscripcion.estudiante?.inscripciones?.calnpe?.toString() || "N/A";
        const proposito = inscripcion.formularioData?.purpose;

        if (numeroControl) {
          estudiantesUnicos.add(numeroControl);

          if (sexo === 1) {
            estudiantesUnicosPorSexo.M.add(numeroControl);
          } else if (sexo === 2) {
            estudiantesUnicosPorSexo.F.add(numeroControl);
          }

          // ✅ CONTAR POR PROPÓSITO
          if (proposito && estudiantesPorProposito[proposito]) {
            estudiantesPorProposito[proposito].add(numeroControl);
          }

          if (!porSemestre[`${numeroControl}-${semestre}`]) {
            porSemestre[semestre] = (porSemestre[semestre] || 0) + 1;
            porSemestre[`${numeroControl}-${semestre}`] = true;
          }
        }
      });
    });

    return {
      totalEstudiantes: estudiantesUnicos.size,
      totalActividades,
      porSexo: {
        M: estudiantesUnicosPorSexo.M.size,
        F: estudiantesUnicosPorSexo.F.size,
      },
      porSemestre,
      porTipoActividad: {
        CIVICA: actividadesPorTipo.CIVICA.size,
        CULTURAL: actividadesPorTipo.CULTURAL.size,
        DEPORTIVA: actividadesPorTipo.DEPORTIVA.size,
        OTRA: actividadesPorTipo.OTRA.size,
      },
      porProposito: {
        creditos: estudiantesPorProposito.creditos.size,
        servicio_social: estudiantesPorProposito.servicio_social.size,
        por_gusto: estudiantesPorProposito.por_gusto.size,
      },
    };
  };

  const totales = calcularTotales();

  const semestreOptions = [
    ...new Set(
      Object.values(inscripciones)
        .flat()
        .map((i) => i.estudiante?.inscripciones?.calnpe)
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

        {/* ✅ NUEVA TARJETA: Desglose por Propósito */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Inscripciones por Propósito
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {totales.porProposito.creditos}
              </p>
              <p className="text-sm text-gray-600">Créditos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {totales.porProposito.servicio_social}
              </p>
              <p className="text-sm text-gray-600">Servicio Social</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {totales.porProposito.por_gusto}
              </p>
              <p className="text-sm text-gray-600">Por Gusto</p>
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
              {(filtroSemestre ||
                filtroSexo ||
                filtroTipoActividad ||
                filtroProposito) && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {
                    [
                      filtroSemestre,
                      filtroSexo,
                      filtroTipoActividad,
                      filtroProposito,
                    ].filter(Boolean).length
                  }
                </span>
              )}
            </button>
          </div>

          {/* Panel de filtros */}
          {mostrarFiltros && (
            <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-5 gap-4">
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

              {/* ✅ NUEVO FILTRO DE PROPÓSITO */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Propósito
                </label>
                <select
                  value={filtroProposito}
                  onChange={(e) => setFiltroProposito(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos</option>
                  <option value="creditos">Créditos</option>
                  <option value="servicio_social">Servicio Social</option>
                  <option value="por_gusto">Por Gusto</option>
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
                  inscripcion.estudiante?.inscripciones?.calnpe?.toString();
                const sexoEstudiante = inscripcion.estudiante?.alusex;
                const propositoEstudiante = inscripcion.formularioData?.purpose;

                const cumpleSemestre =
                  !filtroSemestre || semestreEstudiante === filtroSemestre;
                const sexoNumerico =
                  filtroSexo === "M" ? 1 : filtroSexo === "F" ? 2 : null;
                const cumpleSexo =
                  !filtroSexo || sexoEstudiante === sexoNumerico;
                const cumpleProposito =
                  !filtroProposito || propositoEstudiante === filtroProposito;

                return cumpleSemestre && cumpleSexo && cumpleProposito;
              });

              const isExpanded = actividadExpandida === oferta.actividadId;
              const tipoActividad = obtenerTipoActividad(
                oferta.actividad?.aticve,
                oferta.actividad?.aconco,
                oferta.actividad?.acodes
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
      Propósito
    </th>
    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
      Tipo de Sangre
    </th>
    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
      Fecha Inscripción
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

    const propositoInfo = formatearProposito(
      inscripcion.formularioData?.purpose
    );
    
    const tipoSangre = inscripcion.estudiante?.alutsa;

    return (
      <tr key={idx} className="hover:bg-gray-50">
        {/* 1. No. Control */}
        <td className="px-4 py-3 text-sm text-gray-900">
          {inscripcion.estudiante.aluctr}
        </td>
        
        {/* 2. Nombre */}
        <td className="px-4 py-3 text-sm text-gray-900">
          {nombreCompleto || "Sin nombre"}
        </td>
        
        {/* 3. Semestre */}
        <td className="px-4 py-3 text-sm text-gray-600">
          {inscripcion.estudiante?.inscripciones?.calnpe || "N/A"}
        </td>
        
        {/* 4. Sexo */}
        <td className="px-4 py-3 text-sm text-gray-600">
          {inscripcion.estudiante?.alusex === 1
            ? "Masculino"
            : inscripcion.estudiante?.alusex === 2
            ? "Femenino"
            : "N/A"}
        </td>
        
        {/* 5. Propósito */}
        <td className="px-4 py-3 text-sm">
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${propositoInfo.color}`}
          >
            {propositoInfo.texto}
          </span>
        </td>
        
        {/* 6. Tipo de Sangre */}
        <td className="px-4 py-3 text-sm">
          {tipoSangre ? (
            <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-medium">
              🩸 {tipoSangre}
            </span>
          ) : (
            <span className="px-2 py-1 rounded bg-gray-100 text-gray-500 text-xs font-medium">
              Sin validar
            </span>
          )}
        </td>
        
        {/* 7. Fecha Inscripción */}
        <td className="px-4 py-3 text-sm text-gray-600">
          {new Date(inscripcion.fechaInscripcion).toLocaleDateString()}
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
