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
  Clock,
} from "lucide-react";
import "./adminpanel.css";

const AdminPanel = () => {
  const [todasActividades, setTodasActividades] = useState([]);
  const [actividadesOfertadas, setActividadesOfertadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publicando, setPublicando] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [modalHorario, setModalHorario] = useState(null);
  const [horarioForm, setHorarioForm] = useState({
    dias: [],
    horaInicio: "",
    horaFin: "",
    salon: "",
  });

  const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  useEffect(() => {
    cargarActividades();
  }, []);

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

  const abrirModalHorario = (actividad) => {
    setModalHorario(actividad);
    setHorarioForm(
      actividad.horario || { dias: [], horaInicio: "", horaFin: "", salon: "" }
    );
  };

  const toggleDia = (dia) => {
    setHorarioForm((prev) => ({
      ...prev,
      dias: prev.dias.includes(dia)
        ? prev.dias.filter((d) => d !== dia)
        : [...prev.dias, dia],
    }));
  };

  const guardarHorario = async () => {
    if (
      horarioForm.dias.length === 0 ||
      !horarioForm.horaInicio ||
      !horarioForm.horaFin
    ) {
      alert("Completa todos los campos del horario");
      return;
    }

    try {
      // 🟢 Agregamos logs para verificar los datos enviados
      console.log("🕐 Guardando horario...");
      console.log("Actividad ID:", modalHorario?.id);
      console.log("Datos de horario:", horarioForm);

      const response = await fetch(`/api/horario`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: modalHorario.id,
          horario: horarioForm,
        }),
      });

      console.log("Respuesta del servidor:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error del servidor:", errorText);
        throw new Error("Error al guardar horario");
      }

      const data = await response.json();
      console.log("✅ Horario guardado correctamente:", data);

      alert("Horario guardado exitosamente");

      // Actualizar actividades en memoria
      setTodasActividades((prev) =>
        prev.map((act) =>
          act.id === modalHorario.id ? { ...act, horario: horarioForm } : act
        )
      );
      setActividadesOfertadas((prev) =>
        prev.map((act) =>
          act.id === modalHorario.id ? { ...act, horario: horarioForm } : act
        )
      );

      setModalHorario(null);
    } catch (error) {
      console.error("⚠️ Error al intentar guardar horario:", error);
      alert("Error de conexión al guardar horario");
    }
  };

  const publicarActividades = async () => {
    if (actividadesOfertadas.length === 0) {
      alert("Selecciona al menos una actividad para ofertar.");
      return;
    }

    const sinHorario = actividadesOfertadas.filter((act) => !act.horario);
    if (sinHorario.length > 0) {
      if (
        !window.confirm(
          `Hay ${sinHorario.length} actividad(es) sin horario asignado. ¿Deseas continuar?`
        )
      ) {
        return;
      }
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

      alert("¡Actividades publicadas!");
      setActividadesOfertadas([]);
    } catch (error) {
      console.error(error);
      alert("Error de conexión o al publicar actividades");
    } finally {
      setPublicando(false);
    }
  };

  const actividadesFiltradas = todasActividades.filter((act) =>
    (act.aconco ?? act.aticve ?? "")
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
      {/* Modal Horario */}
      {modalHorario && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>🕐 Configurar horario</h3>
            <p>
              {modalHorario.aconco || modalHorario.aticve} — Código:{" "}
              {modalHorario.aticve}
            </p>

            <div className="modal-section">
              <label>Días:</label>
              <div className="dias-grid">
                {diasSemana.map((dia) => (
                  <button
                    key={dia}
                    className={
                      horarioForm.dias.includes(dia) ? "dia activo" : "dia"
                    }
                    onClick={() => toggleDia(dia)}
                  >
                    {dia}
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-section">
              <label>Hora inicio:</label>
              <input
                type="time"
                value={horarioForm.horaInicio}
                onChange={(e) =>
                  setHorarioForm({ ...horarioForm, horaInicio: e.target.value })
                }
              />
            </div>

            <div className="modal-section">
              <label>Hora fin:</label>
              <input
                type="time"
                value={horarioForm.horaFin}
                onChange={(e) =>
                  setHorarioForm({ ...horarioForm, horaFin: e.target.value })
                }
              />
            </div>

            <div className="modal-section">
              <label>Salón o ubicación:</label>
              <input
                type="text"
                value={horarioForm.salon}
                onChange={(e) =>
                  setHorarioForm({ ...horarioForm, salon: e.target.value })
                }
                placeholder="Ej: Aula 301, Cancha 2"
              />
            </div>

            <div className="modal-buttons">
              <button
                className="cancelar"
                onClick={() => setModalHorario(null)}
              >
                Cancelar
              </button>
              <button className="guardar" onClick={guardarHorario}>
                Guardar horario
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card header-card">
        <h2>Gestionar Actividades</h2>
        <p>Selecciona las actividades que deseas ofertar este semestre</p>
      </div>

      <div className="grid-2">
        <div className="card catalogo">
          <h3>Catálogo ({todasActividades.length})</h3>

          <div className="busqueda">
            <input
              type="text"
              placeholder="Buscar actividad..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <Search className="search-icon" size={18} />
          </div>

          <div className="lista-actividades">
            {actividadesFiltradas.length === 0 ? (
              <p>No se encontraron actividades</p>
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
                      <div className="meta">
                        <span>{actividad.acocre} créditos</span>
                        <span>{actividad.acohrs} hrs</span>
                        {actividad.horario && (
                          <span className="con-horario">✓ Con horario</span>
                        )}
                      </div>
                    </div>
                    <div className="botones">
                      <button
                        className="btn-horario"
                        onClick={() => abrirModalHorario(actividad)}
                      >
                        <Clock size={16} /> Horario
                      </button>
                      <button
                        className={agregada ? "agregado" : "agregar"}
                        onClick={() => agregarAOferta(actividad)}
                        disabled={!!agregada}
                      >
                        {agregada ? "Agregada" : "+ Agregar"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="card oferta">
          <div className="flex-between">
            <h3>Oferta ({actividadesOfertadas.length})</h3>
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
              {publicando ? "Publicando..." : "Publicar"}
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
                  {actividad.horario && (
                    <p className="detalle-horario">
                      {actividad.horario.dias.join(", ")} •{" "}
                      {actividad.horario.horaInicio} -{" "}
                      {actividad.horario.horaFin} • {actividad.horario.salon}
                    </p>
                  )}
                </div>
                <button onClick={() => quitarDeOferta(actividad.id)}>
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
