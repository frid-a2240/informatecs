"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Info,
  List,
  Eye,
  Clock3,
  CalendarDays,
  User,
  Mail,
  Loader2,
  AlertCircle,
} from "lucide-react";

const API_URL = "/api/intramuros"; // Tu endpoint de API

const IntramurosCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // ====================================================================
  // === CORRECCIÓN 1: PARSEO DE FECHAS A OBJETOS UTC ESTRICTO ===
  // ====================================================================
  const parseDateString = (dateString) => {
    if (!dateString) return null;

    let date;

    // Si la API devuelve 'YYYY-MM-DD', la forzamos a medianoche UTC
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // Al añadir 'T00:00:00Z', se crea un objeto Date que está fijado a UTC.
      date = new Date(dateString + "T00:00:00Z");
    } else {
      // Si hay un timestamp completo, usarlo directamente
      date = new Date(dateString);
    }

    return isNaN(date.getTime()) ? null : date;
  };

  // Obtener configuración de estatus
  const getStatusConfig = (status) => {
    const s = status?.toLowerCase().trim();
    if (s === "abierto" || s === "abierta")
      return { class: "st-open", label: "Abierta (Inscripciones)" };
    if (s === "en curso") return { class: "st-progress", label: "En Curso" };
    return { class: "st-closed", label: "Finalizada / Cerrada" };
  };

  // Cargar eventos desde API (Ajustamos las claves a camelCase/minúsculas si vienen así de GAS)
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        const rawData = await response.json();
        const dataArray = rawData.data || rawData.eventos || rawData;

        // NOTA: Asumimos que la API de GAS devuelve las claves en minúsculas/camelCase
        // Si tu GAS devuelve las claves exactas (ej. 'Fecha_Inicio', 'Hora_Inicio'),
        // debes usar ev.Fecha_Inicio y ev.Hora_Inicio aquí. Mantenemos el último formato que enviaste:
        const formatted = dataArray
          .map((ev) => ({
            title: ev.Actividad,
            start: parseDateString(ev.Fecha_Inicio),
            end: parseDateString(ev.Fecha_Fin),
            time: ev.Hora_Inicio, // Hora ya ajustada como string desde GAS
            lugar: ev.Lugar_Sede,
            status: ev.Estado,
            area: ev.Deporte_o_Área,
            coord: ev.Coordinador,
            contact: ev.Contacto,
          }))
          .filter((ev) => ev.start !== null);

        setEvents(formatted);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // ====================================================================
  // === CORRECCIÓN 2: COMPARACIÓN DE FECHAS USANDO MÉTODOS UTC ===
  // ====================================================================
  // Verificar si una fecha local (date) tiene eventos
  const hasEvents = (date) => {
    return events.some((event) => {
      const eventDate = event.start; // Objeto Date/UTC del evento
      return (
        // CRÍTICO: Usar los métodos getUTC* del evento para ignorar la zona horaria del cliente
        eventDate.getUTCFullYear() === date.getFullYear() &&
        eventDate.getUTCMonth() === date.getMonth() &&
        eventDate.getUTCDate() === date.getDate()
      );
    });
  };

  // Obtener eventos del día seleccionado local (selectedDate)
  const selectedDayEvents = useMemo(() => {
    return events.filter((event) => {
      const eventDate = event.start; // Objeto Date/UTC del evento
      return (
        // CRÍTICO: Usar los métodos getUTC* del evento para ignorar la zona horaria del cliente
        eventDate.getUTCFullYear() === selectedDate.getFullYear() &&
        eventDate.getUTCMonth() === selectedDate.getMonth() &&
        eventDate.getUTCDate() === selectedDate.getDate()
      );
    });
  }, [events, selectedDate]);

  // Componente de Calendario personalizado (sin cambios)
  const CustomCalendar = () => {
    const monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    const getDaysInMonth = (date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay();

      const days = [];
      for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null);
      }
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(year, month, i));
      }
      return days;
    };

    const days = getDaysInMonth(currentMonth);

    const prevMonth = () => {
      setCurrentMonth(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
      );
    };

    const nextMonth = () => {
      setCurrentMonth(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
      );
    };

    const isToday = (date) => {
      if (!date) return false;
      const today = new Date();
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    };

    const isSelected = (date) => {
      if (!date) return false;
      return (
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear()
      );
    };

    return (
      <div className="custom-calendar">
        <div className="calendar-header">
          <button onClick={prevMonth} className="nav-btn">
            ‹
          </button>
          <h3>
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <button onClick={nextMonth} className="nav-btn">
            ›
          </button>
        </div>

        <div className="calendar-grid">
          {dayNames.map((day) => (
            <div key={day} className="day-name">
              {day}
            </div>
          ))}

          {days.map((day, index) => (
            <button
              key={index}
              className={`calendar-day ${!day ? "empty" : ""} ${
                isToday(day) ? "today" : ""
              } ${isSelected(day) ? "selected" : ""} ${
                day && hasEvents(day) ? "has-event" : ""
              }`}
              onClick={() => day && setSelectedDate(day)}
              disabled={!day}
            >
              {day ? day.getDate() : ""}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const formatDate = (date) => {
    const days = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    const months = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];

    return `${days[date.getDay()]}, ${date.getDate()} de ${
      months[date.getMonth()]
    }`;
  };

  // ====================================================================
  // === CORRECCIÓN 3: FORMATEO DE FECHAS DE EVENTOS USANDO UTC ===
  // ====================================================================
  const formatDateShort = (date) => {
    // Usamos getUTC* para mostrar el día que se fijó en la API
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="intra-wrapper">
      {/* HEADER */}
      <header className="intra-header">
        <div className="header-inner">
          <div className="title-group">
            <div className="icon-circle">
              <Calendar size={28} />
            </div>
            <div>
              <h1>Calendario Intramuros</h1>
              <p>Instituto Tecnológico de Ensenada</p>
            </div>
          </div>
          <div className="sync-status">
            <div className={`dot ${loading ? "pulse" : "active"}`}></div>
            <span>{loading ? "Sincronizando..." : "Datos en Tiempo Real"}</span>
          </div>
        </div>
      </header>

      <main className="intra-content">
        {error && (
          <div className="error-banner">
            <AlertCircle size={20} />
            <span>Error al cargar eventos: {error}</span>
          </div>
        )}

        <div className="grid-layout">
          {/* CALENDARIO */}
          <section className="cal-section">
            <div className="card">
              {loading ? (
                <div className="loading-state">
                  <Loader2 size={32} className="spinner" />
                  <p>Cargando calendario...</p>
                </div>
              ) : (
                <>
                  <CustomCalendar />
                  <div className="cal-footer">
                    <Info size={16} />
                    <span>Días con punto indican actividades programadas.</span>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* EVENTOS */}
          <section className="events-section">
            <h2 className="section-subtitle">
              <List size={20} />
              Eventos del {formatDate(selectedDate)}
            </h2>

            {loading ? (
              <div className="loading-events">
                <Loader2 size={40} className="spinner" />
                <p>Cargando eventos...</p>
              </div>
            ) : selectedDayEvents.length > 0 ? (
              <div className="event-stack">
                {selectedDayEvents.map((ev, i) => {
                  const conf = getStatusConfig(ev.status);
                  return (
                    <div key={i} className="ev-card">
                      <div className="ev-header">
                        <span className="ev-tag">{ev.area}</span>
                        <span className={`ev-status ${conf.class}`}>
                          {conf.label}
                        </span>
                      </div>

                      <h3 className="ev-title">{ev.title}</h3>

                      <div className="ev-grid-details">
                        <div className="detail">
                          <CalendarDays size={14} />
                          <span>
                            {formatDateShort(ev.start)} al{" "}
                            {formatDateShort(ev.end)}
                          </span>
                        </div>
                        <div className="detail">
                          <Clock3 size={14} />
                          <span>
                            {ev.time || "Hora por definir"}
                            {/* Mostrar la zona horaria ya que la hora fue ajustada por GAS */}
                            {ev.time && (
                              <span
                                style={{
                                  fontSize: "0.8em",
                                  opacity: 0.6,
                                  marginLeft: "4px",
                                }}
                              >
                                (PST/GMT-8)
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="detail">
                          <MapPin size={14} />
                          <span>{ev.lugar}</span>
                        </div>
                        <div className="detail">
                          <User size={14} />
                          <span>{ev.coord}</span>
                        </div>
                        <div className="detail">
                          <Mail size={14} />
                          <span>{ev.contact}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <CalendarDays size={48} opacity={0.3} />
                <p>No hay actividades programadas para esta fecha.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default IntramurosCalendar;
