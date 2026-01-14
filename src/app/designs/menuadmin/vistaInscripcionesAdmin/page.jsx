"use client";
import React, { useState, useEffect } from "react";
import { Users, ChevronDown, ChevronUp, Search, Filter, X } from "lucide-react";

const InscripcionesPanel = () => {
  const [actividadesOfertadas, setActividadesOfertadas] = useState([]);
  const [inscripciones, setInscripciones] = useState({});
  const [actividadExpandida, setActividadExpandida] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalValidarSangre, setModalValidarSangre] = useState(null);

  // Estados de filtros
  const [busqueda, setBusqueda] = useState("");
  const [filtroSemestre, setFiltroSemestre] = useState("");
  const [filtroSexo, setFiltroSexo] = useState("");
  const [filtroTipoActividad, setFiltroTipoActividad] = useState("");
  const [filtroProposito, setFiltroProposito] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  // ✅ FUNCIÓN PARA VALIDAR (FUERA DE cargarDatos)
  const validarTipoSangre = async (inscripcionId, aluctr) => {
    try {
      const response = await fetch('/api/admin/validar-sangre', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inscripcionId, aluctr }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al validar');
      }
      
      alert(`✅ ${data.mensaje}`);
      setModalValidarSangre(null);
      await cargarDatos();
    } catch (error) {
      alert(`❌ ${error.message}`);
    }
  };

  const cargarDatos = async () => {
    try {
      setLoading(true);

      // Cargar actividades ofertadas
      const resOfertas = await fetch("/api/act-disponibles", {
        cache: 'no-store'
      });
      const ofertas = await resOfertas.json();

      // Cargar inscripciones
      const resInscripciones = await fetch("/api/inscripciones", {
        cache: 'no-store'
      });
      
      if (!resInscripciones.ok) {
        console.error("❌ Error al cargar inscripciones");
        setActividadesOfertadas(Array.isArray(ofertas) ? ofertas : []);
        setInscripciones({});
        return;
      }
      
      const todasInscripciones = await resInscripciones.json();

      // ✅ Validación crítica
      if (!Array.isArray(todasInscripciones)) {
        console.error("❌ todasInscripciones no es array:", typeof todasInscripciones);
        setActividadesOfertadas(Array.isArray(ofertas) ? ofertas : []);
        setInscripciones({});
        return;
      }

      console.log("📊 Inscripciones cargadas:", todasInscripciones.length);

      // Agrupar inscripciones por actividad
      const inscripcionesPorActividad = {};
      todasInscripciones.forEach((inscripcion) => {
        const actId = inscripcion?.actividadId;
        if (actId) {
          if (!inscripcionesPorActividad[actId]) {
            inscripcionesPorActividad[actId] = [];
          }
          inscripcionesPorActividad[actId].push(inscripcion);
        }
      });

      setActividadesOfertadas(Array.isArray(ofertas) ? ofertas : []);
      setInscripciones(inscripcionesPorActividad);
      
    } catch (error) {
      console.error("❌ Error al cargar datos:", error);
      setActividadesOfertadas([]);
      setInscripciones({});
    } finally {
      setLoading(false);
    }
  };

  // Debug: Ver estructura de datos
  useEffect(() => {
    if (Object.keys(inscripciones).length > 0) {
      const primeraInscripcion = Object.values(inscripciones)[0][0];
      console.log("✅ Ejemplo de inscripción:", primeraInscripcion);
      console.log("✅ Estudiante:", primeraInscripcion?.estudiante);
      console.log("✅ Semestre (aluare):", primeraInscripcion?.estudiante?.calnpe);
      console.log("✅ Sexo:", primeraInscripcion?.estudiante?.alusex);
      console.log("✅ Actividad:", primeraInscripcion?.actividad?.aticve);
      console.log("✅ Propósito:", primeraInscripcion?.formularioData?.purpose);
    }
  }, [inscripciones]);

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
    setFiltroProposito("");
  };

  const formatearProposito = (purpose) => {
    if (!purpose) return { texto: "N/A", color: "bg-gray-100 text-gray-700" };

    const mapeo = {
      creditos: { texto: "Créditos", color: "bg-blue-100 text-blue-700" },
      servicio_social: { texto: "Servicio Social", color: "bg-green-100 text-green-700" },
      por_gusto: { texto: "Por Gusto", color: "bg-purple-100 text-purple-700" },
    };

    return mapeo[purpose] || { texto: purpose, color: "bg-gray-100 text-gray-700" };
  };

  const obtenerTipoActividad = (codigo, nombreActividad, descripcion) => {
    const codigoUpper = (codigo || "").toUpperCase().trim();
    const nombreUpper = (nombreActividad || "").toUpperCase();
    const descripcionUpper = (descripcion || "").toUpperCase();

    const textoCompleto = `${nombreUpper} ${descripcionUpper}`;

    if (codigoUpper === "D") return "DEPORTIVA";

    const palabrasDeportivas = [
      "FUTBOL", "SOCCER", "VOLEIBOL", "VOLLEYBALL", "BEISBOL", "BASEBALL",
      "SOFTBOL", "SOFTBALL", "BASQUETBOL", "BASKETBALL", "ATLETISMO PISTA",
      "ATLETISMO CAMPO", "NATACION", "SWIMMING", "TENIS DE MESA", "TENIS ",
      " TENIS", "TENNIS", "AJEDREZ", "CHESS", "ACTIVIDAD DEPORTIVA",
      "EVENTO DEPORTIVO",
    ];

    for (let palabra of palabrasDeportivas) {
      if (textoCompleto.includes(palabra)) return "DEPORTIVA";
    }

    const palabrasExcluir = [
      "TUTORIA", "TUTORIAS", "TALLER TALENTO", "TICS", "TECNOLOGIA",
      "CONGRESO GENERAL", "INVESTIGACION", "RALLY LATINOAMERICANO",
      "RALLY CB", "RALLY DE CIENCIAS", "ENCUENTRO NACIONAL", "ARGOS",
      "CLUB TECNOLOGICO", "EVENTO EXTERNO", "CONCURSO CB", "ANFEI",
      "MOOCS DEPORTIVOS",
    ];

    for (let palabra of palabrasExcluir) {
      if (textoCompleto.includes(palabra)) return "OTRA";
    }

    const palabrasCivicas = [
      "ACT CIVICAS", "ACTIVIDAD CIVICA", "ACTIVIDADES CIVICAS", "ESCOLTA",
      "CENTRO DE ACOPIO", "CARRERA ALBATROS", "COLILLATON",
    ];

    for (let palabra of palabrasCivicas) {
      if (textoCompleto.includes(palabra)) return "CIVICA";
    }

    const palabrasCulturales = [
      "ACT CULTURALES", "ACT ARTISTICAS", "MUSICA", "DANZA FOLCLORICA",
      "DANZA FOLKLORICA", "ARTES VISUALES", "ALTAR DE MUERTOS",
      "CLUB DE LECTURA", "CATRINES", "CATRINAS", "BANDA DE GUERRA",
      "MOOCS CULTURALES",
    ];

    for (let palabra of palabrasCulturales) {
      if (textoCompleto.includes(palabra)) return "CULTURAL";
    }

    if (codigoUpper === "C") return "CULTURAL";

    return "OTRA";
  };

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

    if (filtroSemestre || filtroSexo || filtroProposito) {
      const inscritos = inscripciones[oferta.actividadId] || [];
      const tieneInscripcionesValidas = inscritos.some((inscripcion) => {
        const semestreEstudiante =
          inscripcion.estudiante?.calnpe?.toString();
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
          inscripcion.estudiante?.calnpe?.toString();
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
          inscripcion.estudiante?.calnpe?.toString() || "N/A";
        const proposito = inscripcion.formularioData?.purpose;

        if (numeroControl) {
          estudiantesUnicos.add(numeroControl);

          if (sexo === 1) {
            estudiantesUnicosPorSexo.M.add(numeroControl);
          } else if (sexo === 2) {
            estudiantesUnicosPorSexo.F.add(numeroControl);
          }

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
        .map((i) => i.estudiante?.calnpe)
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

        {/* Desglose por Propósito */}
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

        {/* Lista de actividades con tabla de estudiantes... */}
        {/* (El resto del código de la tabla es igual, solo continúa desde aquí) */}
        
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
                  inscripcion.estudiante?.calnpe?.toString(); 
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
                                
                                

                                return (
                                  <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-900">
                                      {inscripcion.estudiante.aluctr}
                                    </td>
                                    
                                    <td className="px-4 py-3 text-sm text-gray-900">
                                      {nombreCompleto || "Sin nombre"}
                                    </td>
                                    
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                      {inscripcion.estudiante?.calnpe|| "N/A"}
                                    </td>
                                    
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                      {inscripcion.estudiante?.alusex === 1
                                        ? "Masculino"
                                        : inscripcion.estudiante?.alusex === 2
                                        ? "Femenino"
                                        : "N/A"}
                                    </td>
                                    
                                    <td className="px-4 py-3 text-sm">
                                      <span
                                        className={`px-2 py-1 rounded text-xs font-medium ${propositoInfo.color}`}
                                      >
                                        {propositoInfo.texto}
                                      </span>
                                    </td>
                                    
                                    {/* ✅ 6. TIPO DE SANGRE - LÓGICA CORREGIDA */}
    <td className="px-4 py-3 text-sm">
      {(() => {
        const tipoSangreActual = inscripcion.estudiante?.alutsa;
        const tipoSangreSolicitado = inscripcion.tipoSangreSolicitado;
        const sangreValidada = inscripcion.sangreValidada;
        
        // ✅ PRIORIDAD 1: Si hay solicitud pendiente (REVISAR PRIMERO)
        if (tipoSangreSolicitado && !sangreValidada) {
          return (
            <div className="flex flex-col gap-1">
              {/* Mostrar tipo actual si existe */}
              {tipoSangreActual && (
                <span className="px-2 py-1 rounded bg-gray-100 text-gray-500 text-xs">
                  Actual: {tipoSangreActual}
                </span>
              )}
              {/* Botón de validación */}
              <button
                onClick={() => setModalValidarSangre(inscripcion)}
                className="px-3 py-1 rounded bg-yellow-500 text-white text-xs font-bold hover:bg-yellow-600 transition-colors"
              >
                ⚠️ VALIDAR {tipoSangreSolicitado}
              </button>
            </div>
          );
        }
        
        // ✅ PRIORIDAD 2: Si tiene tipo de sangre validado (y no hay solicitud pendiente)
        if (tipoSangreActual) {
          return (
            <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-medium">
              🩸 {tipoSangreActual}
            </span>
          );
        }
        
        // ✅ PRIORIDAD 3: Sin tipo de sangre ni solicitud
        return (
          <span className="px-2 py-1 rounded bg-gray-100 text-gray-500 text-xs font-medium">
            Sin registro
          </span>
        );
      })()}
    </td>
                                    
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

        {/* MODAL VALIDAR TIPO DE SANGRE */}
        {modalValidarSangre && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-auto shadow-2xl">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-bold">🩸 Validar Tipo de Sangre</h3>
                    <p className="text-red-100 text-sm mt-1">Revisa el comprobante antes de aprobar</p>
                  </div>
                  <button
                    onClick={() => setModalValidarSangre(null)}
                    className="text-white hover:bg-red-700 rounded-full w-10 h-10 flex items-center justify-center text-2xl"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                {/* Información del estudiante */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                    👤 Datos del Estudiante
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Nombre:</span>
                      <p className="font-semibold text-gray-900">
                        {`${modalValidarSangre.estudiante.alunom} ${modalValidarSangre.estudiante.aluapp} ${modalValidarSangre.estudiante.aluapm}`}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">No. Control:</span>
                      <p className="font-semibold text-gray-900">
                        {modalValidarSangre.estudiante.aluctr}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tipo de sangre seleccionado */}
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded text-center">
                  <h4 className="font-bold text-red-900 mb-3">Tipo de sangre seleccionado por el estudiante:</h4>
                  <div className="bg-white inline-block px-8 py-4 rounded-lg shadow-md">
                    <p className="text-5xl font-black text-red-600">
                      {modalValidarSangre.tipoSangreSolicitado}
                    </p>
                  </div>
                </div>

                {/* Comprobante */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    📄 Comprobante Subido
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Archivo: <span className="font-medium">{modalValidarSangre.nombreArchivoSangre}</span>
                  </p>
                  
                  {/* Previsualización */}
                  <div className="bg-white p-2 rounded border">
                    {modalValidarSangre.comprobanteSangrePDF?.startsWith('data:application/pdf') ? (
                      <iframe
                        src={modalValidarSangre.comprobanteSangrePDF}
                        className="w-full h-[500px] border-0 rounded"
                        title="Comprobante PDF"
                      />
                    ) : (
                      <img
                        src={modalValidarSangre.comprobanteSangrePDF}
                        alt="Comprobante"
                        className="w-full max-h-[500px] object-contain"
                      />
                    )}
                  </div>

                  <a
                    href={modalValidarSangre.comprobanteSangrePDF}
                    download={modalValidarSangre.nombreArchivoSangre}
                    className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    📥 Descargar Comprobante
                  </a>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 p-6 border-t flex gap-4 justify-end">
                <button
                  onClick={() => setModalValidarSangre(null)}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (confirm(`¿Confirmas que el tipo de sangre ${modalValidarSangre.tipoSangreSolicitado} coincide con el comprobante?\n\nEsto actualizará el registro del estudiante.`)) {
                      validarTipoSangre(modalValidarSangre.id, modalValidarSangre.estudiante.aluctr);
                    }
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-bold shadow-lg"
                >
                  ✅ APROBAR Y VALIDAR
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InscripcionesPanel;