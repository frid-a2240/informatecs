"use client";
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  CheckCircle,
  TrendingUp,
  Award,
  Clock,
  GraduationCap,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalActividades: 0,
    totalEstudiantes: 0,
    totalHombres: 0,
    totalMujeres: 0,
    primerSemestre: 0,
    segundoSemestreEnAdelante: 0,
  });

  const [dataPorTipo, setDataPorTipo] = useState([]);
  const [dataPorSexo, setDataPorSexo] = useState([]);
  const [dataPorSemestre, setDataPorSemestre] = useState([]);
  const [dataSemestreAgrupado, setDataSemestreAgrupado] = useState([]);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  // Función para obtener tipo de actividad
  const obtenerTipoActividad = (codigo, nombreActividad, descripcion) => {
    const codigoUpper = (codigo || "").toUpperCase().trim();
    const nombreUpper = (nombreActividad || "").toUpperCase();
    const descripcionUpper = (descripcion || "").toUpperCase();
    const textoCompleto = `${nombreUpper} ${descripcionUpper}`;

    if (codigoUpper === "D") return "DEPORTIVA";

    const palabrasDeportivas = [
      "FUTBOL", "SOCCER", "VOLEIBOL", "VOLLEYBALL", "BEISBOL", "BASEBALL",
      "SOFTBOL", "SOFTBALL", "BASQUETBOL", "BASKETBALL",
      "ATLETISMO", "NATACION", "SWIMMING", "TENIS", "TENNIS", "AJEDREZ", "CHESS"
    ];

    for (let palabra of palabrasDeportivas) {
      if (textoCompleto.includes(palabra)) return "DEPORTIVA";
    }

    const palabrasExcluir = [
      "TUTORIA", "TALLER TALENTO", "TICS", "TECNOLOGIA",
      "CONGRESO", "INVESTIGACION", "RALLY"
    ];

    for (let palabra of palabrasExcluir) {
      if (textoCompleto.includes(palabra)) return "OTRA";
    }

    const palabrasCivicas = [
      "ACT CIVICAS", "ACTIVIDAD CIVICA", "ESCOLTA", 
      "CENTRO DE ACOPIO", "CARRERA ALBATROS"
    ];

    for (let palabra of palabrasCivicas) {
      if (textoCompleto.includes(palabra)) return "CIVICA";
    }

    const palabrasCulturales = [
      "ACT CULTURALES", "ACT ARTISTICAS", "MUSICA", "DANZA",
      "ARTES VISUALES", "ALTAR", "CLUB DE LECTURA", "BANDA DE GUERRA"
    ];

    for (let palabra of palabrasCulturales) {
      if (textoCompleto.includes(palabra)) return "CULTURAL";
    }

    if (codigoUpper === "C") return "CULTURAL";

    return "OTRA";
  };

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);

      // Cargar actividades ofertadas
      const resOfertas = await fetch("/api/act-disponibles");
      const ofertas = await resOfertas.json();

      // Cargar inscripciones
      const resInscripciones = await fetch("/api/inscripciones");
      const todasInscripciones = await resInscripciones.json();

      // Agrupar inscripciones por actividad
      const inscripcionesPorActividad = {};
      todasInscripciones.forEach((inscripcion) => {
        const actId = inscripcion.actividadId;
        if (!inscripcionesPorActividad[actId]) {
          inscripcionesPorActividad[actId] = [];
        }
        inscripcionesPorActividad[actId].push(inscripcion);
      });

      // Calcular estadísticas
      const estudiantesUnicos = new Set();
      const estudiantesUnicosPorSexo = { M: new Set(), F: new Set() };
      const actividadesPorTipo = {
        CIVICA: new Set(),
        CULTURAL: new Set(),
        DEPORTIVA: new Set(),
        OTRA: new Set(),
      };

      let porSemestre = {};
      let contadorPrimerSemestre = 0;
      let contadorSegundoEnAdelante = 0;

      ofertas.forEach((oferta) => {
        const inscritos = inscripcionesPorActividad[oferta.actividadId] || [];
        const tipoActividad = obtenerTipoActividad(
          oferta.actividad?.aticve,
          oferta.actividad?.aconco,
          oferta.actividad?.acodes
        );

        if (inscritos.length > 0) {
          actividadesPorTipo[tipoActividad].add(oferta.actividadId);
        }

        inscritos.forEach((inscripcion) => {
          const numeroControl = inscripcion.estudiante?.aluctr;
          const sexo = inscripcion.estudiante?.alusex;
          const semestre = inscripcion.estudiante?.inscripciones?.calnpe?.toString() || "N/A";

          if (numeroControl) {
            estudiantesUnicos.add(numeroControl);

            if (sexo === 1) {
              estudiantesUnicosPorSexo.M.add(numeroControl);
            } else if (sexo === 2) {
              estudiantesUnicosPorSexo.F.add(numeroControl);
            }

            // Contar por semestre (solo una vez por estudiante)
            if (!porSemestre[`${numeroControl}-${semestre}`]) {
              porSemestre[semestre] = (porSemestre[semestre] || 0) + 1;
              porSemestre[`${numeroControl}-${semestre}`] = true;

              // Contar 1er semestre vs 2do en adelante
              if (semestre === "1") {
                contadorPrimerSemestre++;
              } else if (parseInt(semestre) >= 2 && !isNaN(parseInt(semestre))) {
                contadorSegundoEnAdelante++;
              }
            }
          }
        });
      });

      // Preparar datos para gráficas
      const dataActividades = [
        { tipo: "Cívicas", cantidad: actividadesPorTipo.CIVICA.size, color: "#3b82f6" },
        { tipo: "Culturales", cantidad: actividadesPorTipo.CULTURAL.size, color: "#8b5cf6" },
        { tipo: "Deportivas", cantidad: actividadesPorTipo.DEPORTIVA.size, color: "#f59e0b" },
        { tipo: "Otras", cantidad: actividadesPorTipo.OTRA.size, color: "#6b7280" },
      ];

      const dataSexo = [
        { sexo: "Hombres", cantidad: estudiantesUnicosPorSexo.M.size, color: "#3b82f6" },
        { sexo: "Mujeres", cantidad: estudiantesUnicosPorSexo.F.size, color: "#ec4899" },
      ];

      // Datos de semestre individual (1,2,3,4,5,6)
      const semestreData = Object.entries(porSemestre)
        .filter(([key]) => !key.includes("-") && !isNaN(parseInt(key)))
        .map(([sem, count]) => ({
          semestre: `${sem}°`,
          cantidad: count,
        }))
        .sort((a, b) => parseInt(a.semestre) - parseInt(b.semestre));

      // Datos agrupados: 1er semestre vs 2do+
      const semestreAgrupado = [
        { grupo: "1er Semestre", cantidad: contadorPrimerSemestre, color: "#8b5cf6" },
        { grupo: "2do Semestre+", cantidad: contadorSegundoEnAdelante, color: "#14b8a6" },
      ];

      setStats({
        totalActividades: ofertas.length,
        totalEstudiantes: estudiantesUnicos.size,
        totalHombres: estudiantesUnicosPorSexo.M.size,
        totalMujeres: estudiantesUnicosPorSexo.F.size,
        primerSemestre: contadorPrimerSemestre,
        segundoSemestreEnAdelante: contadorSegundoEnAdelante,
      });

      setDataPorTipo(dataActividades);
      setDataPorSexo(dataSexo);
      setDataPorSemestre(semestreData);
      setDataSemestreAgrupado(semestreAgrupado);

    } catch (error) {
      console.error("❌ Error al cargar estadísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-6">
      <main className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-100 mb-2">
              {new Date().toLocaleDateString("es-MX", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <h2 className="text-3xl font-bold text-white mb-2">
              Estadísticas de Inscripciones
            </h2>
            <p className="text-blue-100">
              Datos en tiempo real de actividades extraescolares
            </p>
          </div>
          <img
            src="/imagenes/logosin.gif"
            alt="Logo"
            className="w-24 h-24 object-contain bg-white/10 rounded-xl p-2"
          />
        </div>

        {/* Cards de métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.totalActividades}
            </div>
            <div className="text-gray-600 text-sm">Actividades Ofertadas</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-emerald-500 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-emerald-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.totalEstudiantes}
            </div>
            <div className="text-gray-600 text-sm">Total Estudiantes Inscritos</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-400 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.totalHombres}
            </div>
            <div className="text-gray-600 text-sm">Hombres</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-pink-500 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-pink-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-pink-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.totalMujeres}
            </div>
            <div className="text-gray-600 text-sm">Mujeres</div>
          </div>
        </div>

        {/* NUEVAS Cards de semestre */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <GraduationCap className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.primerSemestre}
            </div>
            <div className="text-gray-600 text-sm">Estudiantes 1er Semestre</div>
            <p className="text-xs text-gray-500 mt-2">Alumnos inscritos únicamente</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-teal-500 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-teal-100 p-3 rounded-lg">
                <GraduationCap className="w-6 h-6 text-teal-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.segundoSemestreEnAdelante}
            </div>
            <div className="text-gray-600 text-sm">Estudiantes 2do Semestre+</div>
            <p className="text-xs text-gray-500 mt-2">Del 2° al 12° semestre</p>
          </div>
        </div>

        {/* Gráficas principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Actividades por Tipo */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">
                Actividades por Tipo
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dataPorTipo}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="tipo" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "2px solid #3b82f6",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="cantidad" radius={[8, 8, 0, 0]}>
                  {dataPorTipo.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Estudiantes por Sexo */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-pink-500">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-pink-600" />
              <h3 className="text-xl font-bold text-gray-900">
                Estudiantes por Género
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dataPorSexo}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ sexo, cantidad }) => `${sexo}: ${cantidad}`}
                  outerRadius={100}
                  dataKey="cantidad"
                >
                  {dataPorSexo.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "2px solid #ec4899",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráficas de semestre */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Estudiantes por Semestre (Individual) */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-500">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-5 h-5 text-purple-600" />
              <h3 className="text-xl font-bold text-gray-900">
                Estudiantes por Semestre
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dataPorSemestre}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="semestre" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "2px solid #8b5cf6",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="cantidad" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 1er Semestre vs 2do+ (NUEVA GRÁFICA) */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-teal-500">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-teal-600" />
              <h3 className="text-xl font-bold text-gray-900">
                1er Semestre vs 2do Semestre+
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dataSemestreAgrupado}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="grupo" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "2px solid #14b8a6",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="cantidad" radius={[8, 8, 0, 0]}>
                  {dataSemestreAgrupado.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
