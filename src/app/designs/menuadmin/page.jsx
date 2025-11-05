"use client";
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  CheckCircle,
  TrendingUp,
  Award,
  Clock,
  MapPin,
  Star,
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
  Area,
  AreaChart,
  LineChart,
  Line,
} from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    eventosActivos: 0,
    participantesTotal: 0,
    inscripcionesHoy: 0,
    tasaAsistencia: 0,
  });

  // Simular carga de datos
  useEffect(() => {
    setTimeout(() => {
      setStats({
        eventosActivos: 18,
        participantesTotal: 2847,
        inscripcionesHoy: 142,
        tasaAsistencia: 87,
      });
    }, 500);
  }, []);

  // Datos de participación por mes
  const participacionMensual = [
    { mes: "Ene", participantes: 245, eventos: 12 },
    { mes: "Feb", participantes: 312, eventos: 15 },
    { mes: "Mar", participantes: 398, eventos: 18 },
    { mes: "Abr", participantes: 456, eventos: 21 },
    { mes: "May", participantes: 523, eventos: 19 },
    { mes: "Jun", participantes: 587, eventos: 24 },
  ];

  // Datos por categorías de eventos PTA
  const categoriasPTA = [
    { nombre: "Deportivos", valor: 28, color: "#10b981" },
    { nombre: "Culturales", valor: 22, color: "#3b82f6" },
    { nombre: "Académicos", valor: 18, color: "#f59e0b" },
    { nombre: "Recreativos", valor: 32, color: "#8b5cf6" },
  ];

  // Eventos más populares del PTA
  const eventosMasPopulares = [
    { nombre: "Torneo Futbol", participantes: 324 },
    { nombre: "Festival Verano", participantes: 298 },
    { nombre: "Taller Arte", participantes: 256 },
    { nombre: "Maratón Familia", participantes: 234 },
    { nombre: "Cine al Aire Libre", participantes: 187 },
  ];

  // Participación semanal
  const participacionSemanal = [
    { dia: "Lun", participantes: 156, inscritos: 34 },
    { dia: "Mar", participantes: 198, inscritos: 45 },
    { dia: "Mié", participantes: 234, inscritos: 52 },
    { dia: "Jue", participantes: 212, inscritos: 48 },
    { dia: "Vie", participantes: 267, inscritos: 61 },
    { dia: "Sáb", participantes: 345, inscritos: 89 },
    { dia: "Dom", participantes: 298, inscritos: 76 },
  ];

  // Horarios más populares
  const horariosMasUsados = [
    { hora: "9:00", eventos: 8 },
    { hora: "11:00", eventos: 12 },
    { hora: "14:00", eventos: 6 },
    { hora: "16:00", eventos: 15 },
    { hora: "18:00", eventos: 11 },
  ];

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
              Panel de Control - PTA
            </h2>
            <p className="text-blue-100">
              Gestión y monitoreo de eventos deportivos y recreativos
            </p>
          </div>
          <img
            src="/imagenes/logosin.gif"
            alt="Logo PTA"
            className="w-24 h-24 object-contain bg-white/10 rounded-xl p-2"
          />
        </div>

        {/* Cards de métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                +15%
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.eventosActivos}
            </div>
            <div className="text-gray-600 text-sm">Eventos Activos</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-emerald-500 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-emerald-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                +28%
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.participantesTotal.toLocaleString()}
            </div>
            <div className="text-gray-600 text-sm">Participantes Total</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-amber-500 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-amber-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                +12%
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.inscripcionesHoy}
            </div>
            <div className="text-gray-600 text-sm">Inscripciones Hoy</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                +9%
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.tasaAsistencia}%
            </div>
            <div className="text-gray-600 text-sm">Tasa de Asistencia</div>
          </div>
        </div>

        {/* Gráficas principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Participación Mensual */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">
                Participación Mensual
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={participacionMensual}>
                <defs>
                  <linearGradient
                    id="colorParticipantes"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mes" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "2px solid #3b82f6",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="participantes"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorParticipantes)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Categorías de Eventos */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-emerald-500">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-emerald-600" />
              <h3 className="text-xl font-bold text-gray-900">
                Distribución por Categoría
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoriasPTA}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ nombre, percent }) =>
                    `${nombre} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="valor"
                >
                  {categoriasPTA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "2px solid #10b981",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráficas secundarias */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Participación Semanal */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-500">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-purple-600" />
              <h3 className="text-xl font-bold text-gray-900">
                Actividad Semanal
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={participacionSemanal}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="dia" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "2px solid #8b5cf6",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="participantes"
                  fill="#8b5cf6"
                  radius={[8, 8, 0, 0]}
                  name="Participantes"
                />
                <Bar
                  dataKey="inscritos"
                  fill="#c084fc"
                  radius={[8, 8, 0, 0]}
                  name="Nuevos Inscritos"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Horarios Populares */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-amber-500">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-amber-600" />
              <h3 className="text-xl font-bold text-gray-900">
                Horarios Populares
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={horariosMasUsados}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="hora" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "2px solid #f59e0b",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="eventos" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Eventos Populares */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-rose-500">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-rose-600" />
            <h3 className="text-xl font-bold text-gray-900">
              Top 5 Eventos Más Populares
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={eventosMasPopulares} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis
                dataKey="nombre"
                type="category"
                stroke="#6b7280"
                width={120}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "2px solid #f43f5e",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
              />
              <Bar
                dataKey="participantes"
                fill="#f43f5e"
                radius={[0, 8, 8, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
