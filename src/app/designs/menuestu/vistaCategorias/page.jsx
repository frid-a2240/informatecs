import React, { useState, useEffect } from "react";
import {
  Users,
  MapPin,
  Star,
  ChevronRight,
  Award,
  Sparkles,
  Calendar,
} from "lucide-react";

const ActividadesExtracurriculares = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const response = await fetch("/api/act-disponibles");
        if (!response.ok) throw new Error("Error al cargar actividades");
        const data = await response.json();

        // Mapear exactamente como en tu código original
        const actividadesTransformadas = data.map((item) => ({
          id: item.id,
          ofertaId: item.id,
          acocve: item.actividad.acocve,
          titulo: item.actividad.aconco,
          descripcion: item.actividad.acodes,
          categoria: item.actividad.aticve || "general",
          imagen:
            item.actividad.imagen ||
            "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80",
          creditos: item.actividad.acocre,
          horas: item.actividad.acohrs,
          capacidad: item.capacidad,
          inscritos: item.inscritos || 0,
          cuposDisponibles: item.capacidad - (item.inscritos || 0),
          horario: item.horario || "Por definir",
          salon: item.salon || "Por asignar",
          profesor: item.profesor || "Por asignar",
          semestre: item.semestre,
          activa: item.activa,
          rating: 4.5,
        }));

        setActividades(actividadesTransformadas);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchActividades();
  }, []);

  const categorias = [
    {
      id: "todas",
      nombre: "Todas",
      color: "from-blue-500 to-indigo-600",
      icon: "🎯",
    },
    {
      id: "deportes",
      nombre: "Deportes",
      color: "from-green-500 to-emerald-600",
      icon: "⚽",
    },
    {
      id: "arte",
      nombre: "Arte",
      color: "from-pink-500 to-rose-600",
      icon: "🎨",
    },
    {
      id: "tecnologia",
      nombre: "Tecnología",
      color: "from-purple-500 to-violet-600",
      icon: "💻",
    },
    {
      id: "academico",
      nombre: "Académico",
      color: "from-orange-500 to-amber-600",
      icon: "📚",
    },
    {
      id: "general",
      nombre: "General",
      color: "from-cyan-500 to-blue-600",
      icon: "✨",
    },
  ];

  const actividadesFiltradas =
    selectedCategory === "todas"
      ? actividades
      : actividades.filter((a) => a.categoria === selectedCategory);

  const handleOpen = (item) => {
    setSelectedItem(item);
  };

  const handleClose = () => {
    setSelectedItem(null);
  };

  const handleRegister = (item) => {
    // Aquí puedes integrar tu lógica de inscripción
    console.log("Inscribirse en:", item);
    alert(`Inscripción en: ${item.titulo}`);
    handleClose();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-600 mx-auto"></div>
            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-indigo-600 animate-pulse" />
          </div>
          <p className="text-gray-700 text-lg font-semibold mt-6">
            Cargando ofertas del semestre...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-2xl">
          <p className="text-xl font-bold text-red-600 mb-2">
            ⚠️ Error al cargar actividades
          </p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Header con efecto de onda */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJhIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9IiNmZmYiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')]"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-bounce mb-4">
              <Sparkles className="w-12 h-12 text-yellow-300" />
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
              Ofertas del Semestre
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto font-medium">
              Explora las actividades disponibles y regístrate fácilmente
            </p>
            <div className="mt-8 flex justify-center gap-4 flex-wrap">
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-white font-semibold">
                🎓 {actividades.length} Actividades
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-white font-semibold">
                ⭐ Calidad Garantizada
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
              fill="rgb(238, 242, 255)"
            />
          </svg>
        </div>
      </div>

      {/* Filtros con estilo moderno */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 mb-12 relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {categorias.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`group relative px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-110 ${
                  selectedCategory === cat.id
                    ? `bg-gradient-to-r ${cat.color} text-white shadow-xl scale-110`
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="mr-2 text-2xl">{cat.icon}</span>
                {cat.nombre}
                {selectedCategory === cat.id && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid de actividades con animaciones */}
      <div className="max-w-7xl mx-auto px-4 pb-20 sm:px-6 lg:px-8">
        {actividadesFiltradas.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500 font-semibold">
              No hay actividades disponibles en esta categoría
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {actividadesFiltradas.map((actividad, index) => (
              <div
                key={actividad.id}
                onMouseEnter={() => setHoveredCard(actividad.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleOpen(actividad)}
                style={{ animationDelay: `${index * 0.1}s` }}
                className={`group bg-white rounded-3xl overflow-hidden transition-all duration-500 transform hover:-translate-y-4 cursor-pointer shadow-lg hover:shadow-2xl ${
                  hoveredCard === actividad.id ? "ring-4 ring-indigo-400" : ""
                }`}
              >
                {/* Imagen con overlay gradiente */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={actividad.imagen}
                    alt={actividad.titulo}
                    className={`w-full h-full object-cover transition-all duration-700 ${
                      hoveredCard === actividad.id
                        ? "scale-125 rotate-2"
                        : "scale-100"
                    }`}
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${
                      hoveredCard === actividad.id
                        ? "opacity-100"
                        : "opacity-70"
                    }`}
                  ></div>

                  {/* Badge de rating */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full flex items-center gap-2 font-bold shadow-xl transform group-hover:scale-110 transition-transform">
                    <Star className="w-5 h-5 fill-current" />
                    {actividad.rating}
                  </div>

                  {/* Badge de cupos */}
                  {actividad.cuposDisponibles <= 5 &&
                    actividad.cuposDisponibles > 0 && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-xl animate-pulse">
                        🔥 Solo {actividad.cuposDisponibles} cupos
                      </div>
                    )}

                  {actividad.cuposDisponibles === 0 && (
                    <div className="absolute top-4 left-4 bg-gray-800 text-white px-4 py-2 rounded-full font-bold text-sm shadow-xl">
                      ❌ Cupo lleno
                    </div>
                  )}

                  {/* Título superpuesto */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-black text-white drop-shadow-lg">
                      {actividad.titulo}
                    </h3>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {actividad.descripcion}
                  </p>

                  {/* Detalles con iconos */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="bg-indigo-100 p-2 rounded-lg">
                        <Users className="w-5 h-5 text-indigo-600" />
                      </div>
                      <span className="font-semibold">
                        {actividad.cuposDisponibles} de {actividad.capacidad}{" "}
                        disponibles
                      </span>
                    </div>

                    {actividad.creditos && (
                      <div className="flex items-center gap-3 text-gray-700">
                        <div className="bg-pink-100 p-2 rounded-lg">
                          <Award className="w-5 h-5 text-pink-600" />
                        </div>
                        <span className="font-semibold">
                          {actividad.creditos} créditos
                        </span>
                      </div>
                    )}

                    {actividad.horas && (
                      <div className="flex items-center gap-3 text-gray-700">
                        <div className="bg-purple-100 p-2 rounded-lg">
                          <Calendar className="w-5 h-5 text-purple-600" />
                        </div>
                        <span className="font-semibold">
                          {actividad.horas} horas
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Footer con botón */}
                  <div className="flex items-center justify-between pt-6 border-t-2 border-gray-100">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">
                        Semestre
                      </p>
                      <p className="text-lg font-bold text-gray-800">
                        {actividad.semestre}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRegister(actividad);
                      }}
                      disabled={actividad.cuposDisponibles === 0}
                      className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl ${
                        actividad.cuposDisponibles === 0
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
                      }`}
                    >
                      {actividad.cuposDisponibles === 0
                        ? "Lleno"
                        : "Inscríbete"}
                      {actividad.cuposDisponibles > 0 && (
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de detalle */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Imagen del modal */}
            <div className="relative h-64">
              <img
                src={selectedItem.imagen}
                alt={selectedItem.titulo}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all"
              >
                ✕
              </button>
              <h2 className="absolute bottom-6 left-6 text-4xl font-black text-white">
                {selectedItem.titulo}
              </h2>
            </div>

            {/* Contenido del modal */}
            <div className="p-8">
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                {selectedItem.descripcion}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-indigo-50 p-4 rounded-xl">
                  <p className="text-sm text-indigo-600 font-semibold mb-1">
                    Cupos disponibles
                  </p>
                  <p className="text-2xl font-black text-indigo-900">
                    {selectedItem.cuposDisponibles}/{selectedItem.capacidad}
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-xl">
                  <p className="text-sm text-purple-600 font-semibold mb-1">
                    Créditos
                  </p>
                  <p className="text-2xl font-black text-purple-900">
                    {selectedItem.creditos || "N/A"}
                  </p>
                </div>

                <div className="bg-pink-50 p-4 rounded-xl">
                  <p className="text-sm text-pink-600 font-semibold mb-1">
                    Horas
                  </p>
                  <p className="text-2xl font-black text-pink-900">
                    {selectedItem.horas || "N/A"}
                  </p>
                </div>

                <div className="bg-cyan-50 p-4 rounded-xl">
                  <p className="text-sm text-cyan-600 font-semibold mb-1">
                    Semestre
                  </p>
                  <p className="text-2xl font-black text-cyan-900">
                    {selectedItem.semestre}
                  </p>
                </div>
              </div>

              {selectedItem.horario && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 font-semibold mb-1">
                    Horario
                  </p>
                  <p className="text-lg text-gray-800">
                    {selectedItem.horario}
                  </p>
                </div>
              )}

              {selectedItem.salon && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 font-semibold mb-1">
                    Salón
                  </p>
                  <p className="text-lg text-gray-800">{selectedItem.salon}</p>
                </div>
              )}

              {selectedItem.profesor && (
                <div className="mb-6">
                  <p className="text-sm text-gray-500 font-semibold mb-1">
                    Profesor
                  </p>
                  <p className="text-lg text-gray-800">
                    {selectedItem.profesor}
                  </p>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handleClose}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => handleRegister(selectedItem)}
                  disabled={selectedItem.cuposDisponibles === 0}
                  className={`flex-1 px-6 py-4 rounded-xl font-bold transition-all ${
                    selectedItem.cuposDisponibles === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
                  }`}
                >
                  {selectedItem.cuposDisponibles === 0
                    ? "Cupo Lleno"
                    : "Inscribirme Ahora"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Final mejorado */}
      <div className="max-w-5xl mx-auto px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-center overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJhIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9IiNmZmYiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')]"></div>
          </div>
          <div className="relative z-10">
            <Sparkles className="w-16 h-16 text-yellow-300 mx-auto mb-4 animate-bounce" />
            <h2 className="text-4xl font-black text-white mb-4">
              ¿No encuentras lo que buscas?
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Contáctanos y te ayudaremos a encontrar la actividad perfecta para
              ti
            </p>
            <button className="bg-white text-indigo-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105 shadow-xl">
              Contactar Ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActividadesExtracurriculares;
