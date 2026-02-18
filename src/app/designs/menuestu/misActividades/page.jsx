"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar, List, Plus, Download, RefreshCw } from "lucide-react";

// --- IMPORTACIONES DE COMPONENTES ---
import BloodTypeValidator from "@/app/components/blood";
import { ActividadModal } from "@/app/components/ActividadModal";
import OfferModal from "@/app/components/offterModal";

// --- HOOKS Y ESTILOS ---
import { useHorarioData } from "@/app/components/hooks/useHorarioData";
import "@/styles/alumno/horario.css";
import { MateriasDrawer } from "@/app/components/materiasdrawer";
import { CalendarioView } from "@/app/components/calendario";

export default function HorarioInteligente() {
  const calendarRef = useRef(null);

  const {
    loading,
    studentData,
    inscripciones,
    actividadesPersonales,
    setActividadesPersonales,
    allActivities,
    agrupadasParaLista,
    horasVisibles,
    primeraHora,
    loadData,
  } = useHorarioData();

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMateriasDrawer, setShowMateriasDrawer] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [editingDay, setEditingDay] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    dias: [],
    horaInicio: "08:00",
    horaFin: "09:00",
    ubicacion: "",
    color: "#3b82f6",
  });

  const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const coloresPaleta = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#f472b6",
    "#1e293b",
  ];

  useEffect(() => {
    if (studentData?.numeroControl) {
      const key = `actividades_${studentData.numeroControl}`;
      const guardadas = localStorage.getItem(key);
      setActividadesPersonales(guardadas ? JSON.parse(guardadas) : []);
    }
  }, [studentData?.numeroControl, setActividadesPersonales]);

  const guardarEnStorage = (nuevaLista) => {
    setActividadesPersonales(nuevaLista);
    if (studentData?.numeroControl) {
      localStorage.setItem(
        `actividades_${studentData.numeroControl}`,
        JSON.stringify(nuevaLista),
      );
    }
  };

  // --- LÓGICA DE DESCARGA (RESTAURADA) ---
  const handleDownloadImage = async () => {
    if (typeof window === "undefined" || !calendarRef.current) return;
    try {
      const domtoimage = (await import("dom-to-image-more")).default;
      const original = calendarRef.current;
      const wrapper = document.createElement("div");
      Object.assign(wrapper.style, {
        position: "fixed",
        left: "-5000px",
        top: "0",
        width: "1400px",
        backgroundColor: "white",
        zIndex: "-1",
      });

      const clone = original.cloneNode(true);
      const styleReset = document.createElement("style");
      styleReset.innerHTML = `* { outline: none !important; box-shadow: none !important; border: none !important; } table, th, td { border: 1px solid #e2e8f0 !important; }`;
      clone.appendChild(styleReset);
      clone
        .querySelectorAll(".btn-action-calendar, button")
        .forEach((btn) => btn.remove());

      const header = document.createElement("div");
      header.style.cssText = `width: 100%; padding: 30px 40px; display: flex; justify-content: space-between; align-items: center; border-bottom: 5px solid #fe9e10; background-color: white;`;
      header.innerHTML = `
        <div>
          <h1 style="margin:0;color:#1b396a;font-size:38px;font-weight:900;">HORARIO</h1>
          <p style="margin:5px 0 0 0;color:#fe9e10;font-size:18px;font-weight:700;">${studentData?.carrera || "ESTUDIANTE"}</p>
        </div>
        <div style="text-align:right;">
          <div style="font-size:24px;color:#333;font-weight:800;">${studentData?.nombreCompleto || "MI HORARIO"}</div>
          <div style="font-size:18px;color:#666;">No. Control: ${studentData?.numeroControl || "S/N"}</div>
        </div>
      `;
      wrapper.appendChild(header);
      const container = document.createElement("div");
      container.style.padding = "20px 40px";
      container.appendChild(clone);
      wrapper.appendChild(container);
      document.body.appendChild(wrapper);

      await new Promise((r) => setTimeout(r, 600));
      const dataUrl = await domtoimage.toPng(wrapper, {
        width: 1400,
        height: wrapper.offsetHeight,
      });
      const link = document.createElement("a");
      link.download = `Horario_${studentData?.numeroControl || "Personal"}.png`;
      link.href = dataUrl;
      link.click();
      document.body.removeChild(wrapper);
    } catch (error) {
      console.error("Error al descargar:", error);
    }
  };

  const handleSubmitActivity = (dataOrEvent) => {
    let finalData = dataOrEvent.target ? { ...formData } : dataOrEvent;
    if (dataOrEvent.target) dataOrEvent.preventDefault();
    if (!finalData.nombre || finalData.dias.length === 0) return;

    const nuevasSesiones = finalData.dias.map((dia) => ({
      id: `pers-${finalData.nombre}-${dia}-${Date.now()}`,
      nombre: finalData.nombre,
      ubicacion: finalData.ubicacion,
      color: finalData.color,
      dia,
      horaInicio:
        finalData.horariosEspeciales?.[dia]?.horaInicio || finalData.horaInicio,
      horaFin:
        finalData.horariosEspeciales?.[dia]?.horaFin || finalData.horaFin,
      horariosEspeciales: finalData.horariosEspeciales || null,
    }));

    const listaActualizada = editingActivity
      ? [
          ...actividadesPersonales.filter(
            (a) => a.nombre !== editingActivity.nombre,
          ),
          ...nuevasSesiones,
        ]
      : [...actividadesPersonales, ...nuevasSesiones];

    guardarEnStorage(listaActualizada);
    handleCloseModal();
  };

  const handleSaveEditDay = (actividadActualizada) => {
    if (!editingDay || !editingActivity) return;
    const nuevaLista = actividadesPersonales.map((act) => {
      if (act.nombre === editingActivity.nombre && act.dia === editingDay) {
        return {
          ...act,
          horariosEspeciales: {
            ...(act.horariosEspeciales || {}),
            ...(actividadActualizada.horariosEspeciales || {}),
          },
        };
      }
      return act;
    });
    guardarEnStorage(nuevaLista);
    setShowEditModal(false);
    setEditingActivity(null);
    setEditingDay(null);
  };

  const handleDeleteTotal = (nombre) => {
    if (confirm(`¿Eliminar todas las sesiones de "${nombre}"?`)) {
      guardarEnStorage(
        actividadesPersonales.filter((a) => a.nombre !== nombre),
      );
    }
  };

  const handleRemoveDay = (id, dia) => {
    if (confirm(`¿Quitar la sesión del día ${dia}?`)) {
      guardarEnStorage(actividadesPersonales.filter((a) => a.id !== id));
    }
  };

  const handleEditDay = (actividad, dia) => {
    setEditingActivity(actividad);
    setEditingDay(dia);
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingActivity(null);
    setFormData({
      nombre: "",
      dias: [],
      horaInicio: "08:00",
      horaFin: "09:00",
      ubicacion: "",
      color: "#3b82f6",
    });
  };

  return (
    <div className="horario-page">
      <header className="horario-header">
        <div className="horario-header-content">
          <div className="horario-header-left">
            <Calendar size={50} color="#fe9e10" strokeWidth={2.5} />
            <div>
              <h1 className="horario-welcome-title">Mi Horario</h1>
              <p className="horario-header-subtitle">
                {inscripciones.length} materias inscritas
              </p>
            </div>
          </div>

          <div className="horario-header-actions">
            <button
              className="horario-btn-secondary"
              onClick={() => setShowMateriasDrawer(true)}
            >
              <List size={20} />
              <span className="horario-hide-mobile"> Ver Lista</span>
            </button>

            <button
              className="horario-btn-secondary"
              onClick={handleDownloadImage}
            >
              <Download size={20} />
            </button>

            <button
              className="horario-btn-primary"
              onClick={() => setShowModal(true)}
            >
              <Plus size={20} />
              <span>Agregar Clase</span>
            </button>
          </div>
        </div>
      </header>

      <div
        className="blood-validator-wrapper"
        style={{ margin: "0 2rem 1.5rem" }}
      >
        <BloodTypeValidator
          numeroControl={studentData?.numeroControl}
          onUploadSuccess={() => loadData(studentData.numeroControl)}
        />
      </div>

      <main className="horario-main">
        {loading ? (
          <div className="horario-loading-state">
            <RefreshCw className="horario-animate-spin" size={40} />
          </div>
        ) : (
          <div ref={calendarRef} className="horario-calendario-container">
            <CalendarioView
              diasSemana={diasSemana}
              horasVisibles={horasVisibles}
              primeraHora={primeraHora}
              getActivityForSlot={(dia, hora) =>
                allActivities.find(
                  (act) => act.dia === dia && parseInt(act.horaInicio) === hora,
                )
              }
              getActivitySpan={(act) => {
                const [hI] = act.horaInicio.split(":").map(Number);
                const [hF] = act.horaFin.split(":").map(Number);
                return Math.max(1, hF - hI);
              }}
              onEdit={(act) => {
                const original = agrupadasParaLista.find(
                  (a) => a.nombre === act.nombre,
                );
                setEditingActivity(original || act);
                setFormData({
                  nombre: original?.nombre || act.nombre,
                  dias: original?.diasPresentes || [act.dia],
                  horaInicio: original?.horaInicio || act.horaInicio,
                  horaFin: original?.horaFin || act.horaFin,
                  ubicacion: original?.ubicacion || "",
                  color: original?.color || act.color,
                  horariosEspeciales: original?.horariosEspeciales || {},
                });
                setShowModal(true);
              }}
              onDelete={(id) => {
                const act = allActivities.find((a) => a.id === id);
                if (act) handleDeleteTotal(act.nombre);
              }}
            />
          </div>
        )}
      </main>

      {showMateriasDrawer && (
        <MateriasDrawer
          inscripciones={inscripciones}
          actividadesPersonales={agrupadasParaLista}
          onEdit={handleEditDay}
          onDelete={handleDeleteTotal}
          onRemoveDay={handleRemoveDay}
          onClose={() => setShowMateriasDrawer(false)}
        />
      )}

      <ActividadModal
        show={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmitActivity}
        formData={formData}
        onChange={(e) =>
          setFormData({ ...formData, [e.target.name]: e.target.value })
        }
        onColorSelect={(color) => setFormData({ ...formData, color })}
        colors={coloresPaleta}
        dias={diasSemana}
        isEditing={!!editingActivity}
      />

      {showEditModal && (
        <OfferModal
          item={editingActivity}
          diaAEditar={editingDay}
          onClose={() => {
            setShowEditModal(false);
            setEditingActivity(null);
            setEditingDay(null);
          }}
          onSave={handleSaveEditDay}
        />
      )}
    </div>
  );
}
