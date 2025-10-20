"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Users, Calendar, Search } from "lucide-react";

const AdminPanel = () => {
  const [todasActividades, setTodasActividades] = useState([]);
  const [actividadesOfertadas, setActividadesOfertadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publicando, setPublicando] = useState(false);
  const [busqueda, setBusqueda] = useState(""); //  estado para el buscador

  useEffect(() => {
    cargarActividades();
  }, []);

  const cargarActividades = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/actividades");
      if (response.ok) {
        const actividades = await response.json();
        setTodasActividades(actividades);
      } else {
        alert("Error al cargar actividades");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const agregarAOferta = (actividad) => {
    if (!actividadesOfertadas.find((act) => act.id === actividad.id)) {
      setActividadesOfertadas([...actividadesOfertadas, actividad]);
    }
  };

  const quitarDeOferta = (actividadId) => {
    setActividadesOfertadas(
      actividadesOfertadas.filter((act) => act.id !== actividadId)
    );
  };

  const publicarActividades = async () => {
    if (actividadesOfertadas.length === 0) {
      alert("Selecciona al menos una actividad para ofertar.");
      return;
    }

    if (
      !window.confirm(
        `¿Publicar ${actividadesOfertadas.length} actividades para los estudiantes?`
      )
    ) {
      return;
    }

    try {
      setPublicando(true);

      const ofertas = actividadesOfertadas.map((actividad) => ({
        actividadId: actividad.id,
        semestre: "2024-2",
        activa: true,
      }));

      const response = await fetch("/api/ofertas-semestre/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ofertas }),
      });

      if (response.ok) {
        alert(
          `¡Actividades publicadas! ${actividadesOfertadas.length} actividades están disponibles para los estudiantes.`
        );
        setActividadesOfertadas([]);
      } else {
        alert("Error al publicar actividades");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión");
    } finally {
      setPublicando(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando actividades...</div>;
  }

  // 🔎 Filtrar actividades según la búsqueda
  const actividadesFiltradas = todasActividades.filter((act) =>
    (act.aconco || act.aticve || "")
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Gestionar Actividades
        </h2>
        <p className="text-gray-600">
          Selecciona las actividades que deseas ofertar este semestre
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Panel izquierdo: Catálogo completo */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Catálogo de Actividades ({todasActividades.length})
            </h3>
          </div>

          {/* 🔎 Barra de búsqueda */}
          <div className="relative mb-4">
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

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {actividadesFiltradas.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No se encontraron actividades</p>
              </div>
            ) : (
              actividadesFiltradas.map((actividad) => (
                <div
                  key={actividad.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {actividad.aconco || actividad.aticve}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Código: {actividad.aticve}
                      </p>
                      <p className="text-sm text-gray-600">
                        Clave: {actividad.acocve}
                      </p>
                      <div className="flex gap-4 mt-2 text-sm text-gray-500">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {actividad.acocre} créditos
                        </span>
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          {actividad.acohrs} horas
                        </span>
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          {actividad.depcve} Dpt
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => agregarAOferta(actividad)}
                      disabled={actividadesOfertadas.find(
                        (act) => act.id === actividad.id
                      )}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        actividadesOfertadas.find(
                          (act) => act.id === actividad.id
                        )
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      }`}
                    >
                      {actividadesOfertadas.find(
                        (act) => act.id === actividad.id
                      )
                        ? "Agregada"
                        : "Agregar"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Panel derecho: Actividades seleccionadas */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Oferta del Semestre ({actividadesOfertadas.length})
            </h3>
            <button
              onClick={publicarActividades}
              disabled={actividadesOfertadas.length === 0 || publicando}
              className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                actividadesOfertadas.length > 0 && !publicando
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <Calendar size={20} />
              {publicando ? "Publicando..." : "Publicar Oferta"}
            </button>
          </div>

          {actividadesOfertadas.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <p>No hay actividades seleccionadas</p>
              <p className="text-sm">Agrega actividades del catálogo</p>
            </div>
          ) : (
            <div className="space-y-3">
              {actividadesOfertadas.map((actividad) => (
                <div
                  key={actividad.id}
                  className="border border-green-200 bg-green-50 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {actividad.aconco || actividad.aticve}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Código: {actividad.aticve}
                      </p>
                      <div className="flex gap-4 mt-2 text-sm text-gray-500">
                        <span>Créditos: {actividad.acocre}</span>
                        <span>Horas: {actividad.acohrs}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => quitarDeOferta(actividad.id)}
                      className="text-red-500 hover:text-red-700 p-1 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-500 text-white p-4 rounded-lg">
          <h4 className="font-semibold">Total Actividades</h4>
          <p className="text-2xl font-bold">{todasActividades.length}</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded-lg">
          <h4 className="font-semibold">Ofertadas</h4>
          <p className="text-2xl font-bold">{actividadesOfertadas.length}</p>
        </div>
        <div className="bg-purple-500 text-white p-4 rounded-lg">
          <h4 className="font-semibold">Créditos Totales</h4>
          <p className="text-2xl font-bold">
            {actividadesOfertadas.reduce(
              (sum, act) => sum + (act.acocre || 0),
              0
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
