"use client";
import React, { useState, useEffect } from "react";
import { Users, MapPin, Star, ChevronRight } from "lucide-react";

const ActividadesExtracurriculares = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const response = await fetch("/api/act-disponibles");
        if (!response.ok) throw new Error("Error al cargar actividades");
        const data = await response.json();

        // Transformar datos de la API al formato que usa el componente
        const actividadesTransformadas = data.map((item) => ({
          id: item.id,
          titulo: item.actividad.aconco,
          categoria: item.actividad.categoria || "general",
          descripcion:
            item.actividad.descripcion || "Actividad extracurricular",
          imagen:
            item.actividad.imagen ||
            "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80",
          cupo: `${item.capacidad || 0} lugares`,
          nivel: item.nivel || "Todos los niveles",
          precio: item.costo ? `${item.costo}` : "Consultar",
          rating: 4.5,
          activa: item.activa,
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
    { id: "todas", nombre: "Todas", color: "bg-blue-600" },
    { id: "deportes", nombre: "Deportes", color: "bg-green-600" },
    { id: "arte", nombre: "Arte", color: "bg-orange-600" },
    { id: "tecnologia", nombre: "Tecnología", color: "bg-cyan-600" },
    { id: "academico", nombre: "Académico", color: "bg-indigo-600" },
    { id: "general", nombre: "General", color: "bg-gray-600" },
  ];

  const actividadesFiltradas =
    selectedCategory === "todas"
      ? actividades
      : actividades.filter((a) => a.categoria === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando actividades...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold mb-2">
            Error al cargar actividades
          </p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Actividades Extracurriculares
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubre experiencias únicas que potenciarán tu desarrollo
              personal y profesional
            </p>
          </div>
        </div>
      </div>

      {/* Filtros de categorías */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {categorias.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === cat.id
                  ? `${cat.color} text-white shadow-lg scale-105`
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de actividades */}
      <div className="max-w-7xl mx-auto px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {actividadesFiltradas.map((actividad) => (
            <div
              key={actividad.id}
              onMouseEnter={() => setHoveredCard(actividad.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`bg-white rounded-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl cursor-pointer border-2 ${
                hoveredCard === actividad.id
                  ? "border-blue-500 shadow-xl"
                  : "border-gray-200"
              }`}
            >
              {/* Imagen */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={actividad.imagen}
                  alt={actividad.titulo}
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    hoveredCard === actividad.id ? "scale-110" : "scale-100"
                  }`}
                />
                <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-lg flex items-center gap-1 font-bold shadow-md">
                  <Star className="w-4 h-4 fill-current" />
                  {actividad.rating}
                </div>
              </div>

              {/* Contenido */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {actividad.titulo}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {actividad.descripcion}
                </p>

                {/* Detalles */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>{actividad.cupo}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>{actividad.nivel}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-2xl font-bold text-gray-900">
                    {actividad.precio}
                  </span>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md">
                    Inscribirse
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Final */}
      <div className="max-w-4xl mx-auto px-4 pb-16 sm:px-6 lg:px-8">
        <div className="bg-blue-600 rounded-xl p-8 text-center shadow-lg">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿No encuentras lo que buscas?
          </h2>
          <p className="text-blue-100 mb-6">
            Contáctanos y te ayudaremos a encontrar la actividad perfecta para
            ti
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-md">
            Contactar Ahora
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActividadesExtracurriculares;
