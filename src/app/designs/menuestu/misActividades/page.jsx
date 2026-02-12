"use client";

import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import html2canvas from "html2canvas";
import {
  Calendar,
  List,
  Grid,
  Printer,
  Plus,
  Download,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

// Sub-componentes
import BloodTypeValidator from "@/app/components/blood";
import { CalendarioView } from "@/app/components/calendario";
import { ListaView } from "@/app/components/ListaActividades";
import { ActividadModal } from "@/app/components/ActividadModal";

// Estilos
import "@/styles/alumno/horario.css";

/**
 * Componente Principal: Mis Actividades (Horario Inteligente)
 * Gestiona la visualización de materias, actividades personales y validación de sangre.
 */
export default function HorarioInteligente() {
  const calendarRef = useRef(null);

  // --- ESTADOS ---
  const [inscripciones, setInscripciones] = useState([]);
  const [actividadesPersonales, setActividadesPersonales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [view, setView] = useState("horario"); // "horario" | "lista"
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

  // --- FUNCIÓN DE CARGA DE DATOS ---
  // Se usa useCallback para evitar que la función se recree en cada render
  const loadData = useCallback(async (numeroControl) => {
    if (!numeroControl) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/inscripciones?aluctr=${numeroControl}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setInscripciones(data);
      }
    } catch (err) {
      console.error("❌ Error al cargar inscripciones:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- EFECTOS INICIALES ---
  useEffect(() => {
    const stored = localStorage.getItem("studentData");
    if (stored) {
      const parsed = JSON.parse(stored);
      setStudentData(parsed);
      loadData(parsed.numeroControl);
    } else {
      setLoading(false);
    }

    const personalStored = localStorage.getItem("actividadesPersonales");
    if (personalStored) setActividadesPersonales(JSON.parse(personalStored));
  }, [loadData]);

  // --- MANEJADORES DE SANGRE ---
  const handleBloodUploadSuccess = () => {
    // Cuando el documento se sube con éxito, refrescamos los datos del alumno
    if (studentData?.numeroControl) {
      loadData(studentData.numeroControl);
    }
  };

  // --- LÓGICA DE ACTIVIDADES (useMemo) ---
  const allActivities = useMemo(() => {
    const inscritasMapped = inscripciones.flatMap((insc) => {
      const act = insc.actividad || insc;
      const horario = act?.horario;
      if (!horario || !horario.dias) return [];

      const diasArray = Array.isArray(horario.dias)
        ? horario.dias
        : [horario.dias];

      return diasArray.map((dia) => ({
        id: `insc-${insc.id || Math.random()}-${dia}`,
        nombre: act.aconco || act.nombre || "Materia",
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
  }, [inscripciones, actividadesPersonales]);

  // --- MANEJADORES DE MODAL Y ACTIVIDADES ---
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

    const nuevasActividades = formData.dias.map((dia) => ({
      ...formData,
      id: `pers-${Date.now()}-${dia}`,
      dia: dia,
      tipo: "personal",
    }));

    let updatedList;
    if (editingActivity) {
      const baseFiltrada = actividadesPersonales.filter(
        (act) =>
          act.nombre.toLowerCase() !== editingActivity.nombre.toLowerCase(),
      );
      updatedList = [...baseFiltrada, ...nuevasActividades];
    } else {
      updatedList = [...actividadesPersonales, ...nuevasActividades];
    }

    setActividadesPersonales(updatedList);
    localStorage.setItem("actividadesPersonales", JSON.stringify(updatedList));
    resetModal();
  };

  const handleDownloadImage = async () => {
    if (!calendarRef.current) return;
    const canvas = await html2canvas(calendarRef.current, {
      scale: 2,
      backgroundColor: "#f4f7f9",
    });
    const link = document.createElement("a");
    link.download = `Horario_${studentData?.numeroControl || "Alumno"}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  // Configuración de tabla
  const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const horas = Array.from({ length: 14 }, (_, i) => i + 7); // 7 AM a 8 PM

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
                {new Set(actividadesPersonales.map((a) => a.nombre)).size}{" "}
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
            <button
              className="btn-secondary"
              onClick={handleDownloadImage}
              title="Descargar Imagen"
            >
              <Download size={18} />
            </button>
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={18} /> <span>Agregar Clase</span>
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
          onUploadSuccess={handleBloodUploadSuccess}
        />
      </div>

      <main className="horario-main">
        {loading ? (
          <div className="loading-state">
            <RefreshCw className="animate-spin" size={32} />
            <p>Sincronizando tus actividades...</p>
          </div>
        ) : allActivities.length === 0 ? (
          <div className="empty-state">
            <AlertCircle size={64} color="#cbd5e1" />
            <h3>No hay clases registradas</h3>
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              Agregar Actividad
            </button>
          </div>
        ) : view === "horario" ? (
          <div ref={calendarRef} className="calendario-container">
            <CalendarioView
              horas={horas}
              diasSemana={diasSemana}
              getActivityForSlot={(dia, hora) =>
                allActivities.find((act) => {
                  if (act.dia !== dia) return false;
                  const [start] = act.horaInicio.split(":").map(Number);
                  const [end] = act.horaFin.split(":").map(Number);
                  return hora >= start && hora < end;
                })
              }
              getActivitySpan={(act) => {
                const [start] = act.horaInicio.split(":").map(Number);
                const [end] = act.horaFin.split(":").map(Number);
                return Math.max(1, end - start);
              }}
              onEdit={(act) => {
                setEditingActivity(act);
                const sesiones = actividadesPersonales.filter(
                  (a) => a.nombre === act.nombre,
                );
                setFormData({ ...act, dias: sesiones.map((s) => s.dia) });
                setShowModal(true);
              }}
              onDelete={(act) => {
                if (confirm("¿Eliminar todas las sesiones?")) {
                  const updated = actividadesPersonales.filter(
                    (a) => a.nombre !== act.nombre,
                  );
                  setActividadesPersonales(updated);
                  localStorage.setItem(
                    "actividadesPersonales",
                    JSON.stringify(updated),
                  );
                }
              }}
            />
          </div>
        ) : (
          <ListaView
            inscripciones={inscripciones}
            actividadesPersonales={actividadesPersonales}
            expanded={expanded}
            toggleExpand={(idx) => setExpanded(expanded === idx ? null : idx)}
            onEdit={(act) => {}}
            onDelete={(act) => {}}
          />
        )}
      </main>

      <ActividadModal
        show={showModal}
        onClose={resetModal}
        onSubmit={handleSubmitActivity}
        formData={formData}
        onChange={(e) =>
          setFormData({ ...formData, [e.target.name]: e.target.value })
        }
        onColorSelect={(color) => setFormData({ ...formData, color })}
        colors={[
          "#1b396a",
          "#fe9e10",
          "#8eafef",
          "#54be62",
          "#9110b9",
          "#e94aaf",
        ]}
        dias={diasSemana}
        isEditing={!!editingActivity}
      />
    </div>
  );
}
