"use client";

import React, { useState, useEffect } from "react";
import {
  Trash2,
  Users,
  Calendar,
  Search,
  Sparkles,
  Clock,
  User,
  Plus,
  X,
} from "lucide-react";
import "@/styles/admin/adminpanel.css";

const AdminPanel = () => {
  const [modalVerMaestro, setModalVerMaestro] = useState(null);
  const [todasActividades, setTodasActividades] = useState([]);
  const [actividadesOfertadas, setActividadesOfertadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publicando, setPublicando] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  // ✅ UN SOLO MODAL PARA TODO
  const [modalAgregar, setModalAgregar] = useState(null);
  const [busquedaMaestro, setBusquedaMaestro] = useState("");
  const [maestrosEncontrados, setMaestrosEncontrados] = useState([]);
  const [buscandoMaestro, setBuscandoMaestro] = useState(false);
  const [guardando, setGuardando] = useState(false);

  // ✅ FORMULARIO UNIFICADO
  const [formulario, setFormulario] = useState({
    dias: [],
    horaInicio: "",
    horaFin: "",
    salon: "",
    maestroId: null,
    maestroNombre: "",
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

  // ✅ ABRIR MODAL CON DATOS PRECARGADOS
  const abrirModalAgregar = (actividad) => {
    setModalAgregar(actividad);

    // Precargar datos si ya existen
    setFormulario({
      dias: actividad.horario?.dias || [],
      horaInicio: actividad.horario?.horaInicio || "",
      horaFin: actividad.horario?.horaFin || "",
      salon: actividad.horario?.salon || "",
      maestroId: actividad.maestroId || null,
      maestroNombre: actividad.maestro
        ? `${actividad.maestro.pernom} ${actividad.maestro.perapp} ${actividad.maestro.perapm}`.trim()
        : "",
    });

    setBusquedaMaestro("");
    setMaestrosEncontrados([]);
  };

  const toggleDia = (dia) => {
    setFormulario((prev) => ({
      ...prev,
      dias: prev.dias.includes(dia)
        ? prev.dias.filter((d) => d !== dia)
        : [...prev.dias, dia],
    }));
  };

  // ✅ BUSCAR MAESTROS
  const buscarMaestros = async (query) => {
    if (query.length < 2) {
      setMaestrosEncontrados([]);
      return;
    }

    try {
      setBuscandoMaestro(true);
      const response = await fetch(
        `/api/maestros-buscar?q=${encodeURIComponent(query)}`,
      );
      const maestros = await response.json();
      setMaestrosEncontrados(maestros);
    } catch (error) {
      console.error("Error al buscar maestros:", error);
    } finally {
      setBuscandoMaestro(false);
    }
  };

  // ✅ SELECCIONAR MAESTRO
  const seleccionarMaestro = (maestro) => {
    setFormulario((prev) => ({
      ...prev,
      maestroId: maestro.id,
      maestroNombre: maestro.nombreCompleto,
    }));
    setBusquedaMaestro("");
    setMaestrosEncontrados([]);
  };

  // ✅ REMOVER MAESTRO SELECCIONADO
  const removerMaestro = () => {
    setFormulario((prev) => ({
      ...prev,
      maestroId: null,
      maestroNombre: "",
    }));
  };

  // ✅ GUARDAR TODO Y AGREGAR A OFERTA
  const guardarYAgregar = async () => {
    // Validaciones básicas
    if (formulario.dias.length === 0) {
      alert("⚠️ Selecciona al menos un día");
      return;
    }
    if (!formulario.horaInicio || !formulario.horaFin) {
      alert("⚠️ Completa los horarios de inicio y fin");
      return;
    }
    if (!formulario.maestroId) {
      if (!confirm("⚠️ No has asignado un maestro. ¿Deseas continuar?")) {
        return;
      }
    }

    try {
      setGuardando(true);

      // 1. Guardar horario
      console.log("💾 Guardando horario...");
      const horarioResponse = await fetch(`/api/horario`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: modalAgregar.id,
          horario: {
            dias: formulario.dias,
            horaInicio: formulario.horaInicio,
            horaFin: formulario.horaFin,
            salon: formulario.salon,
          },
        }),
      });

      if (!horarioResponse.ok) {
        throw new Error("Error al guardar horario");
      }

      // 2. Asignar maestro (si fue seleccionado)
      if (formulario.maestroId) {
        console.log("👨‍🏫 Asignando maestro...");
        const maestroResponse = await fetch("/api/asignar-maestros", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            actividadId: modalAgregar.id,
            maestroId: formulario.maestroId,
          }),
        });

        if (!maestroResponse.ok) {
          throw new Error("Error al asignar maestro");
        }
      }

      // 3. Actualizar actividad en memoria con los nuevos datos
      const actividadActualizada = {
        ...modalAgregar,
        horario: {
          dias: formulario.dias,
          horaInicio: formulario.horaInicio,
          horaFin: formulario.horaFin,
          salon: formulario.salon,
        },
        maestroId: formulario.maestroId,
        maestro: formulario.maestroId
          ? {
              percve: formulario.maestroId,
              pernom: formulario.maestroNombre.split(" ")[0] || "",
              perapp: formulario.maestroNombre.split(" ")[1] || "",
              perapm: formulario.maestroNombre.split(" ")[2] || "",
            }
          : null,
      };

      // 4. Actualizar en el catálogo
      setTodasActividades((prev) =>
        prev.map((act) =>
          act.id === modalAgregar.id ? actividadActualizada : act,
        ),
      );

      // 5. Agregar a oferta si no está ya
      if (!actividadesOfertadas.find((act) => act.id === modalAgregar.id)) {
        setActividadesOfertadas((prev) => [...prev, actividadActualizada]);
      }

      alert("✅ Actividad configurada y agregada a la oferta");
      setModalAgregar(null);

      // Recargar para asegurar datos actualizados
      await cargarActividades();
    } catch (error) {
      console.error("❌ Error:", error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setGuardando(false);
    }
  };

  const quitarDeOferta = (actividadId) => {
    setActividadesOfertadas(
      actividadesOfertadas.filter((act) => act.id !== actividadId),
    );
  };

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
      .includes(busqueda.toLowerCase()),
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
      {/* ✅ MODAL UNIFICADO: AGREGAR ACTIVIDAD CON TODO */}
      {modalAgregar && (
        <div className="modal-overlay">
          <div className="modal-content modal-agregar">
            <div className="modal-header">
              <div>
                <h3>➕ Configurar y Agregar Actividad</h3>
                <p className="modal-subtitle">
                  {modalAgregar.aconco || modalAgregar.aticve} — Código:{" "}
                  {modalAgregar.aticve}
                </p>
              </div>
              <button
                className="btn-close"
                onClick={() => setModalAgregar(null)}
              >
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              {/* SECCIÓN HORARIO */}
              <div className="seccion-form">
                <h4>
                  <Clock size={20} /> Horario
                </h4>

                <label>Días de la semana:</label>
                <div className="dias-grid">
                  {diasSemana.map((dia) => (
                    <button
                      key={dia}
                      type="button"
                      className={
                        formulario.dias.includes(dia) ? "dia activo" : "dia"
                      }
                      onClick={() => toggleDia(dia)}
                    >
                      {dia}
                    </button>
                  ))}
                </div>

                <div className="grid-2-campos">
                  <div>
                    <label>Hora inicio:</label>
                    <input
                      type="time"
                      value={formulario.horaInicio}
                      onChange={(e) =>
                        setFormulario({
                          ...formulario,
                          horaInicio: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label>Hora fin:</label>
                    <input
                      type="time"
                      value={formulario.horaFin}
                      onChange={(e) =>
                        setFormulario({
                          ...formulario,
                          horaFin: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <label>Salón o ubicación:</label>
                <input
                  type="text"
                  value={formulario.salon}
                  onChange={(e) =>
                    setFormulario({ ...formulario, salon: e.target.value })
                  }
                  placeholder="Ej: Aula 301, Cancha 2"
                />
              </div>

              {/* SECCIÓN MAESTRO */}
              <div className="seccion-form">
                <h4>
                  <User size={20} /> Maestro
                </h4>

                {formulario.maestroId ? (
                  <div className="maestro-seleccionado">
                    <div className="maestro-info">
                      <User size={24} />
                      <div>
                        <strong>{formulario.maestroNombre}</strong>
                        <p>ID: {formulario.maestroId}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-remover-maestro"
                      onClick={removerMaestro}
                    >
                      <X size={16} /> Cambiar
                    </button>
                  </div>
                ) : (
                  <>
                    <label>Buscar por ID o Nombre:</label>
                    <input
                      type="text"
                      value={busquedaMaestro}
                      onChange={(e) => {
                        setBusquedaMaestro(e.target.value);
                        buscarMaestros(e.target.value);
                      }}
                      placeholder="Ej: 88 o César Noel"
                    />

                    {buscandoMaestro && (
                      <p className="texto-cargando">Buscando...</p>
                    )}

                    {maestrosEncontrados.length > 0 && (
                      <div className="lista-maestros">
                        {maestrosEncontrados.map((maestro) => (
                          <div key={maestro.id} className="maestro-item">
                            <div>
                              <strong>{maestro.nombreCompleto}</strong>
                              <p>ID: {maestro.id}</p>
                              <p className="texto-secundario">
                                {maestro.departamento || "Sin departamento"}
                              </p>
                            </div>
                            <button
                              type="button"
                              className="btn-seleccionar"
                              onClick={() => seleccionarMaestro(maestro)}
                            >
                              Seleccionar
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-cancelar"
                onClick={() => setModalAgregar(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-guardar"
                onClick={guardarYAgregar}
                disabled={guardando}
              >
                {guardando ? "Guardando..." : "Guardar y Agregar a Oferta"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ MODAL VER MAESTRO (Para el badge clickeable) */}
      {modalVerMaestro && (
        <div className="modal-overlay" onClick={() => setModalVerMaestro(null)}>
          <div
            className="modal-content modal-small"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>👨‍🏫 Maestro Asignado</h3>
            <p className="materia-modal-title">
              {modalVerMaestro.aconco || modalVerMaestro.aticve}
            </p>
            <p className="codigo-modal">Código: {modalVerMaestro.aticve}</p>

            {modalVerMaestro.maestro ? (
              <div className="maestro-info-box">
                <div className="maestro-avatar">
                  <User size={48} />
                </div>
                <div className="maestro-detalles">
                  <h4>
                    {modalVerMaestro.maestro.pernom}{" "}
                    {modalVerMaestro.maestro.perapp}{" "}
                    {modalVerMaestro.maestro.perapm}
                  </h4>
                  <p>
                    <strong>ID:</strong> {modalVerMaestro.maestro.percve}
                  </p>
                  {modalVerMaestro.maestro.perdce && (
                    <p>
                      <strong>Email:</strong> {modalVerMaestro.maestro.perdce}
                    </p>
                  )}
                  {modalVerMaestro.maestro.perdep && (
                    <p>
                      <strong>Departamento:</strong>{" "}
                      {modalVerMaestro.maestro.perdep}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p>No hay maestro asignado</p>
            )}

            <div className="modal-buttons">
              <button
                className="btn-primary"
                onClick={() => setModalVerMaestro(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="card header-card">
        <h2>Gestionar Actividades</h2>
        <p>
          Configura y selecciona las actividades que deseas ofertar este
          semestre
        </p>
      </div>

      <div className="grid-2">
        {/* CATÁLOGO */}
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
                  (act) => act.id === actividad.id,
                );
                return (
                  <div key={actividad.id} className="actividad-item">
                    <div className="actividad-info">
                      <h4>{actividad.aconco || actividad.aticve}</h4>
                      <p>Código: {actividad.aticve}</p>

                      <div className="meta">
                        <span>{actividad.acocre} créditos</span>
                        <span>{actividad.acohrs} hrs</span>
                        {actividad.horario && (
                          <span className="con-horario">✓ Horario</span>
                        )}
                        {actividad.maestroId && (
                          <span
                            className="con-maestro clickeable"
                            onClick={(e) => {
                              e.stopPropagation();
                              setModalVerMaestro(actividad);
                            }}
                            title="Click para ver maestro"
                          >
                            ✓ Maestro
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ✅ UN SOLO BOTÓN */}
                    <button
                      className={agregada ? "btn-agregado" : "btn-configurar"}
                      onClick={() => {
                        if (!agregada) {
                          abrirModalAgregar(actividad);
                        }
                      }}
                      disabled={!!agregada}
                    >
                      {agregada ? (
                        <>✓ Agregada</>
                      ) : (
                        <>
                          <Plus size={16} /> Configurar y Agregar
                        </>
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* OFERTA */}
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
                      <Clock size={14} /> {actividad.horario.dias.join(", ")} •{" "}
                      {actividad.horario.horaInicio} -{" "}
                      {actividad.horario.horaFin}
                      {actividad.horario.salon &&
                        ` • ${actividad.horario.salon}`}
                    </p>
                  )}
                  {actividad.maestro && (
                    <p className="detalle-maestro">
                      <User size={14} /> {actividad.maestro.pernom}{" "}
                      {actividad.maestro.perapp}
                    </p>
                  )}
                </div>
                <button
                  className="btn-eliminar"
                  onClick={() => quitarDeOferta(actividad.id)}
                >
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
