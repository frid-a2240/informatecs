"use client";
import React, { useState, useEffect } from "react";
import {
  Trash2,
  Users,
  Calendar,
  Search,
  Sparkles,
  TrendingUp,
  Award,
} from "lucide-react";
import "./adminpanel.css";
const AdminPanel = () => {
  const [todasActividades, setTodasActividades] = useState([]);
  const [actividadesOfertadas, setActividadesOfertadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publicando, setPublicando] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    cargarActividades();
  }, []);

  // Cargar actividades desde API
  const cargarActividades = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/actividades");
      if (!response.ok) throw new Error("Error al cargar actividades");
      const actividades = await response.json();
      setTodasActividades(actividades);
    } catch (error) {
      console.error(error);
      alert("Error de conexión o al cargar actividades");
    } finally {
      setLoading(false);
    }
  };

  // Agregar actividad a la oferta
  const agregarAOferta = (actividad) => {
    if (!actividadesOfertadas.find((act) => act.id === actividad.id)) {
      setActividadesOfertadas([...actividadesOfertadas, actividad]);
    }
  };

  // Quitar actividad de la oferta
  const quitarDeOferta = (actividadId) => {
    setActividadesOfertadas(
      actividadesOfertadas.filter((act) => act.id !== actividadId)
    );
  };

  // Publicar actividades
  const publicarActividades = async () => {
    if (actividadesOfertadas.length === 0) {
      alert("Selecciona al menos una actividad para ofertar.");
      return;
    }

    if (!confirm(`¿Publicar ${actividadesOfertadas.length} actividades?`))
      return;

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

      if (!response.ok) throw new Error("Error al publicar actividades");

      alert(`¡Actividades publicadas!`);
      setActividadesOfertadas([]);
    } catch (error) {
      console.error(error);
      alert("Error de conexión o al publicar actividades");
    } finally {
      setPublicando(false);
    }
  };

  // Filtrado seguro por nombre o código
  const actividadesFiltradas = todasActividades.filter((act) =>
    (act.aconco || act.aticve || "")
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  if (loading) {
    return (
      <div className="admin-panel">
        <div className="card loading-card">
          <Sparkles size={48} className="loading-icon" />
          <h2>Cargando actividades...</h2>
          <p>Preparando el catálogo completo</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="card header-card">
        <h2>Gestionar Actividades</h2>
        <p>Selecciona las actividades que deseas ofertar este semestre</p>
      </div>

      <div className="grid-2">
        <div className="card catalogo">
          <h3>Catálogo de Actividades ({todasActividades.length})</h3>

          <div className="busqueda">
            <input
              type="text"
              placeholder="Buscar actividad por nombre o código..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <Search className="search-icon" size={18} />
          </div>

          <div className="lista-actividades">
            {actividadesFiltradas.length === 0 ? (
              <div className="sin-actividades">
                <Search size={48} />
                <p>No se encontraron actividades</p>
              </div>
            ) : (
              actividadesFiltradas.map((actividad) => {
                const agregada = actividadesOfertadas.find(
                  (act) => act.id === actividad.id
                );
                return (
                  <div key={actividad.id} className="actividad-item">
                    <div>
                      <h4>{actividad.aconco || actividad.aticve}</h4>
                      <p>Código: {actividad.aticve}</p>
                      <p>Clave: {actividad.acocve}</p>
                      <div className="meta">
                        <span>{actividad.acocre} créditos</span>
                        <span>{actividad.acohrs} hrs</span>
                        <span>{actividad.depcve} Dpt</span>
                      </div>
                    </div>
                    <button
                      className={agregada ? "agregado" : "agregar"}
                      onClick={() => agregarAOferta(actividad)}
                      disabled={!!agregada}
                    >
                      {agregada ? "Agregada" : "+ Agregar"}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="card oferta">
          <div className="flex-between">
            <h3>Oferta del Semestre ({actividadesOfertadas.length})</h3>
            <button
              className={
                actividadesOfertadas.length > 0 && !publicando
                  ? "btn-publicar enabled"
                  : "btn-publicar disabled"
              }
              onClick={publicarActividades}
              disabled={actividadesOfertadas.length === 0 || publicando}
            >
              <Calendar size={20} />
              {publicando ? "Publicando..." : "Publicar Oferta"}
            </button>
          </div>

          {actividadesOfertadas.length === 0 ? (
            <div className="sin-actividades">
              <Users size={48} />
              <p>No hay actividades seleccionadas</p>
            </div>
          ) : (
            actividadesOfertadas.map((actividad) => (
              <div key={actividad.id} className="actividad-oferta">
                <div>
                  <h4>{actividad.aconco || actividad.aticve}</h4>
                  <p>Código: {actividad.aticve}</p>
                  <div className="meta">
                    <span>Créditos: {actividad.acocre}</span>
                    <span>Horas: {actividad.acohrs}</span>
                  </div>
                </div>
                <button
                  onClick={() => quitarDeOferta(actividad.id)}
                  title="Quitar de la oferta"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="estadisticas">
        <div className="card total">
          <TrendingUp size={32} className="stat-icon" />
          <h4>Total Actividades</h4>
          <p>{todasActividades.length}</p>
        </div>
        <div className="card ofertadas">
          <Sparkles size={32} className="stat-icon ofertadas-icon" />
          <h4>Ofertadas</h4>
          <p>{actividadesOfertadas.length}</p>
        </div>
        <div className="card creditos">
          <Award size={32} className="stat-icon creditos-icon" />
          <h4>Créditos Totales</h4>
          <p>
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
