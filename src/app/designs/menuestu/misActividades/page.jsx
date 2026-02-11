"use client";

import React, { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import {
  Calendar,
  List,
  Grid,
  Printer,
  Plus,
  AlertCircle,
  Download,
} from "lucide-react";
import BloodTypeValidator from "@/app/components/blood";

// Estilos actualizados
import "@/styles/alumno/horario.css";

// Sub-componentes
import { CalendarioView } from "@/app/components/calendario";
import { ListaView } from "@/app/components/ListaActividades";
import { ActividadModal } from "@/app/components/ActividadModal";

export default function HorarioInteligente() {
  const calendarRef = useRef(null);

  // --- ESTADOS ---
  const [inscripciones, setInscripciones] = useState([]);
  const [actividadesPersonales, setActividadesPersonales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [view, setView] = useState("horario");
  const [showModal, setShowModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    dias: [],
    horaInicio: "",
    horaFin: "",
    ubicacion: "",
    color: "#1b396a",
  });

  // --- CONFIGURACIÓN ---
  const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const horas = Array.from({ length: 14 }, (_, i) => i + 7);
  const coloresDisponibles = [
    "#1b396a",
    "#fe9e10",
    "#8eafef",
    "#54be62",
    "#9110b9",
    "#e94aaf",
  ];

  // --- EFECTOS ---
  useEffect(() => {
    const stored = localStorage.getItem("studentData");
    if (stored) {
      const parsed = JSON.parse(stored);
      setStudentData(parsed);

      fetch(`/api/inscripciones?aluctr=${parsed.numeroControl}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setInscripciones(data);
        })
        .catch((err) => console.error("Error API:", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    const personalStored = localStorage.getItem("actividadesPersonales");
    if (personalStored) setActividadesPersonales(JSON.parse(personalStored));
  }, []);

  // --- LÓGICA DE NEGOCIO ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetModal = () => {
    setShowModal(false);
    setEditingActivity(null);
    setFormData({
      nombre: "",
      dias: [],
      horaInicio: "",
      horaFin: "",
      ubicacion: "",
      color: "#1b396a",
    });
  };
  const handleSubmitActivity = (e) => {
    e.preventDefault();
    if (formData.dias.length === 0) return alert("Selecciona al menos un día");

    const nombreNormalizado = formData.nombre.trim();

    // Generamos las nuevas entradas para los días seleccionados
    const nuevasActividades = formData.dias.map((diaSeleccionado) => ({
      ...formData,
      nombre: nombreNormalizado,
      // El ID incluye el nombre y el día para ser único por jornada
      id: `pers-${nombreNormalizado}-${diaSeleccionado}-${Date.now()}`,
      dia: diaSeleccionado,
      tipo: "personal",
    }));

    let updatedList;

    if (editingActivity) {
      // LÓGICA DE ACTUALIZACIÓN POR DÍA:
      // Filtramos la lista para quitar SOLAMENTE los registros que coincidan
      // con el nombre Y con los días que estamos enviando ahora.
      // Esto permite que si tenías "Clase" el Viernes y editas Lunes/Martes, el Viernes no se borre.

      const baseFiltrada = actividadesPersonales.filter((act) => {
        const mismoNombre =
          act.nombre.toLowerCase() === editingActivity.nombre.toLowerCase();
        const diaSiendoEditado = formData.dias.includes(act.dia);

        // "Si es la misma materia y es uno de los días que estoy guardando, quítalo para poner el nuevo"
        return !(mismoNombre && diaSiendoEditado);
      });

      updatedList = [...baseFiltrada, ...nuevasActividades];
    } else {
      // Si es nueva, simplemente sumamos
      updatedList = [...actividadesPersonales, ...nuevasActividades];
    }

    // Ordenar opcionalmente por hora para que en la lista salgan en orden
    updatedList.sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

    setActividadesPersonales(updatedList);
    localStorage.setItem("actividadesPersonales", JSON.stringify(updatedList));
    resetModal();
  };

  const handleDeleteActivity = (idOrName) => {
    // Buscamos si el parámetro es un ID o el nombre de la actividad
    const actividadABorrar = actividadesPersonales.find(
      (a) => a.id === idOrName || a.nombre === idOrName,
    );
    if (!actividadABorrar) return;

    // Filtramos por nombre para borrar todos los horarios/días de esa actividad de un golpe
    const updated = actividadesPersonales.filter(
      (act) =>
        act.nombre.toLowerCase() !== actividadABorrar.nombre.toLowerCase(),
    );

    setActividadesPersonales(updated);
    localStorage.setItem("actividadesPersonales", JSON.stringify(updated));
  };

  const handleEditActivity = (activity) => {
    if (!activity) return;
    setEditingActivity(activity);

    // Buscamos todos los registros que compartan el mismo nombre
    const registrosRelacionados = actividadesPersonales.filter(
      (act) => act.nombre.toLowerCase() === activity.nombre.toLowerCase(),
    );

    setFormData({
      nombre: activity.nombre,
      dias: registrosRelacionados.map((act) => act.dia),
      horaInicio: activity.horaInicio,
      horaFin: activity.horaFin,
      ubicacion: activity.ubicacion || "",
      color: activity.color,
    });

    setShowModal(true);
  };

  const getAllActivities = () => {
    const inscritasMapped = inscripciones.flatMap((insc) => {
      const act = insc.actividad || insc;
      const horario = act?.horario;
      if (!horario || !horario.dias) return [];
      const diasArray = Array.isArray(horario.dias)
        ? horario.dias
        : [horario.dias];
      return diasArray.map((dia) => ({
        id: `insc-${insc._id || act.aticve || Math.random()}-${dia}`,
        nombre: act.aconco || act.nombre || "Materia sin nombre",
        dia: dia,
        horaInicio: horario.horaInicio || "07:00",
        horaFin: horario.horaFin || "08:00",
        ubicacion: horario.salon || "Por asignar",
        color: "#1b396a",
        tipo: "inscrita",
      }));
    });

    const personalesMapped = actividadesPersonales.map((act) => ({
      ...act,
      tipo: "personal",
    }));

    return [...inscritasMapped, ...personalesMapped];
  };

  const getActivityForSlot = (dia, hora) => {
    const todas = getAllActivities();
    return todas.find((act) => {
      if (!act || act.dia !== dia) return false;
      const [startHour] = act.horaInicio.split(":").map(Number);
      const [endHour] = act.horaFin.split(":").map(Number);
      return hora >= startHour && hora < endHour;
    });
  };

  const getActivitySpan = (act) => {
    const [start] = act.horaInicio.split(":").map(Number);
    const [end] = act.horaFin.split(":").map(Number);
    return Math.max(1, end - start);
  };

  const handleDownloadImage = async () => {
    if (!calendarRef.current) return;
    try {
      const canvas = await html2canvas(calendarRef.current, {
        scale: 2,
        backgroundColor: "#f4f7f9",
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = `Horario_${studentData?.numeroControl || "Alumno"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="horario-page">
      <header className="horario-header">
        <div className="header-content">
          <div className="header-left">
            <Calendar size={40} color="#fe9e10" />
            <div>
              <h1>Mis Actividades</h1>
              <p className="header-subtitle">
                {inscripciones.length} inscritas •{" "}
                {
                  new Set(
                    actividadesPersonales.map((a) =>
                      a.nombre.toLowerCase().trim(),
                    ),
                  ).size
                }{" "}
                personales
              </p>
            </div>
          </div>
          <div className="header-actions">
            <button
              className="btn-secondary"
              onClick={() => setView(view === "horario" ? "lista" : "horario")}
            >
              {view === "horario" ? <List size={18} /> : <Grid size={18} />}
              <span className="hide-mobile">
                {view === "horario" ? " Lista" : " Horario"}
              </span>
            </button>
            <button className="btn-secondary" onClick={handleDownloadImage}>
              <Download size={18} />
            </button>
            <button className="btn-secondary" onClick={() => window.print()}>
              <Printer size={18} />
            </button>
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={18} /> <span>Agregar Clase</span>
            </button>
          </div>
        </div>
      </header>

      <BloodTypeValidator numeroControl={studentData?.numeroControl} />

      <main className="horario-main">
        {view === "horario" ? (
          <div ref={calendarRef} className="calendario-container">
            <CalendarioView
              horas={horas}
              diasSemana={diasSemana}
              getActivityForSlot={getActivityForSlot}
              getActivitySpan={getActivitySpan}
              onEdit={handleEditActivity}
              onDelete={handleDeleteActivity}
            />
          </div>
        ) : (
          <ListaView
            inscripciones={inscripciones}
            actividadesPersonales={Object.values(
              actividadesPersonales.reduce((acc, act) => {
                const key = act.nombre.trim().toLowerCase();
                if (!acc[key]) {
                  acc[key] = { ...act, diasPresentes: [act.dia] };
                } else if (!acc[key].diasPresentes.includes(act.dia)) {
                  acc[key].diasPresentes.push(act.dia);
                }
                return acc;
              }, {}),
            )}
            expanded={expanded}
            toggleExpand={(idx) => setExpanded(expanded === idx ? null : idx)}
            onEdit={handleEditActivity}
            onDelete={(id) => {
              if (
                window.confirm("¿Deseas eliminar esta actividad por completo?")
              ) {
                handleDeleteActivity(id);
              }
            }}
          />
        )}
      </main>

      <ActividadModal
        show={showModal}
        onClose={resetModal}
        onSubmit={handleSubmitActivity}
        formData={formData}
        onChange={handleInputChange}
        onColorSelect={(color) => setFormData((p) => ({ ...p, color }))}
        colors={coloresDisponibles}
        dias={diasSemana}
        isEditing={!!editingActivity}
      />
    </div>
  );
}
