"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Info,
  CheckCircle2,
  List,
  Tag,
  Eye,
  Clock3,
  Calendar1Icon,
  User,
} from "lucide-react";
import moment from "moment";
import "moment/locale/es";

// Importaciones de React-Calendar
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// -----------------------------------------------------------
// --- CONFIGURACIÓN DE CONEXIÓN Y PARSEO ---
const API_URL = "/api/intramuros";

// Función de parseo de fecha flexible (CRUCIAL)
const parseDateString = (dateString) => {
  if (!dateString) return null;

  const formats = [
    moment.ISO_8601,
    "YYYY-MM-DD HH:mm:ss",
    "YYYY-MM-DD",
    "DD/MM/YYYY HH:mm:ss",
    "MM/DD/YYYY HH:mm:ss",
    "DD/MM/YYYY",
    "MM/DD/YYYY",
  ];

  const parsedMoment = moment(dateString, formats, true);
  return parsedMoment.isValid() ? parsedMoment.toDate() : null;
};
// -----------------------------------------------------------

const IntramurosCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [calendarDate, setCalendarDate] = useState(new Date());

  // --- FUNCIÓN PARA OBTENER DATOS DE LA API (SIN CAMBIOS) ---
  useEffect(() => {
    // ... (Mantenemos toda la lógica de fetch y parseo. Es correcta.)
    const fetchEvents = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(
            `Error HTTP: ${response.status}. Verifique la Implementación de Google Apps Script.`
          );
        }
        const rawData = await response.json();
        const dataArray = rawData.data || rawData.eventos || rawData;

        if (!Array.isArray(dataArray)) {
          throw new Error(
            "Formato de datos incorrecto. La API no devolvió una lista de eventos."
          );
        }

        const formattedEvents = dataArray
          .map((event) => {
            const startDateTime = parseDateString(event.Fecha_Inicio);
            let endDateTime = event.Fecha_Fin
              ? parseDateString(event.Fecha_Fin)
              : startDateTime
              ? moment(startDateTime).add(1, "hours").toDate()
              : null;

            if (
              !startDateTime ||
              !endDateTime ||
              isNaN(startDateTime.getTime())
            ) {
              return null;
            }

            return {
              title: event.Actividad,
              start: startDateTime,
              end: endDateTime,
              lugar: event.Lugar_Sede,
              descripcion: event.Descripcion_Detalles,
              categoria: event.Categoria,
            };
          })
          .filter((event) => event !== null);

        setEvents(formattedEvents);
        setLoading(false);
      } catch (e) {
        console.error("Error al obtener los eventos:", e);
        setError(`No se pudieron cargar los datos. ${e.message}`);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // FILTRADO DE EVENTOS PARA EL DÍA SELECCIONADO
  const eventsForSelectedDay = useMemo(() => {
    return events.filter((event) =>
      moment(event.start).isSame(calendarDate, "day")
    );
  }, [events, calendarDate]);

  // Lógica para marcar días con eventos
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const dayHasEvent = events.some((event) =>
        moment(event.start).startOf("day").isSame(moment(date).startOf("day"))
      );
      // 'day-with-event' es la clase que marca el día en el calendario
      return dayHasEvent ? "day-with-event" : null;
    }
  };

  // --- FUNCIÓN PARA CAMBIAR LA FECHA Y MOSTRAR EVENTOS ---
  const handleCalendarChange = (date) => {
    setCalendarDate(date);
  };

  // --- LÓGICA DE VISUALIZACIÓN ---
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* SECCIÓN: Encabezado Principal (Hero) - Mantenido */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-12 px-6 shadow-md">
        <div className="max-w-7xl mx-auto">
          {/* ... Contenido del Encabezado ... */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30">
                  <CalendarIcon size={32} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                    Calendario Intramuros
                  </h1>
                  <p className="text-blue-100 font-medium">
                    Instituto Tecnológico de Ensenada
                  </p>
                </div>
              </div>
              <p className="max-w-2xl text-blue-50 text-lg opacity-90">
                Consulta las fechas oficiales de torneos, cierres de inscripción
                y eventos deportivos del campus.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 w-fit">
                <div
                  className={`w-2 h-2 rounded-full animate-pulse ${
                    loading
                      ? "bg-yellow-400"
                      : error
                      ? "bg-red-500"
                      : "bg-green-400"
                  }`}
                ></div>
                <span className="text-sm font-semibold">
                  {loading
                    ? "Cargando datos..."
                    : error
                    ? "Error de conexión"
                    : "Sincronizado desde Google Sheets"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-blue-100 text-sm ml-2">
                <Clock size={16} />
                <span>Zona Horaria: Tijuana (GMT-08:00)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ... Fin de Encabezado ... */}

      <div className="max-w-7xl mx-auto px-4 -mt-8">
        {/* SECCIÓN: Tarjetas de Información Rápida - Mantenido */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              icon: <CalendarIcon className="text-blue-600" />,
              label: "Eventos Cargados",
              val: events.length.toString(),
              bg: "bg-blue-100",
            },
            {
              icon: <CheckCircle2 className="text-green-600" />,
              label: "Conexión API",
              val: loading ? "Conectando..." : error ? "Fallida" : "Exitosa",
              bg: "bg-green-100",
            },
            {
              icon: <MapPin className="text-purple-600" />,
              label: "Ubicación",
              val: "Campus ITE",
              bg: "bg-purple-100",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 flex items-center gap-4 transition-transform hover:scale-[1.02]"
            >
              <div
                className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center`}
              >
                {item.icon}
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                  {item.label}
                </p>
                <p className="text-lg font-bold text-gray-800">{item.val}</p>
              </div>
            </div>
          ))}
        </div>

        {/* SECCIÓN: Contenedor Principal */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="p-4 md:p-8">
            <div className="bg-blue-50 rounded-2xl p-4 mb-8 border border-blue-100 flex items-start gap-4">
              <Info className="text-blue-600 mt-1 shrink-0" size={20} />
              <p className="text-sm text-blue-900 leading-relaxed">
                Selecciona una fecha en el calendario para ver la lista de
                eventos. Los días marcados en azul tienen actividades
                programadas.
              </p>
            </div>

            {/* 🟢 CORRECCIÓN: Grid para expandir el calendario (col-span-3 vs col-span-2) */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Columna 1: CALENDARIO INTERACTIVO (3/5 del ancho) */}
              <div className="lg:col-span-3 relative rounded-2xl p-4 shadow-inner bg-gray-50 flex justify-center">
                {loading && (
                  <div className="text-center p-12 text-blue-600 font-bold">
                    Cargando eventos...
                  </div>
                )}
                {error && (
                  <div className="text-center p-12 text-red-600 font-bold">
                    Error: {error}
                  </div>
                )}
                {!loading && !error && (
                  <Calendar
                    onChange={handleCalendarChange}
                    value={calendarDate}
                    locale="es-ES"
                    tileClassName={tileClassName}
                    next2Label={null}
                    prev2Label={null}
                    className="w-full shadow-lg border-0"
                  />
                )}
              </div>

              {/* Columna 2: DETALLES DE EVENTOS (2/5 del ancho) */}
              <div className="lg:col-span-2 relative p-4 bg-white rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-extrabold text-blue-700 border-b pb-3 mb-4 flex items-center gap-2">
                  <List size={22} />
                  Eventos del {moment(calendarDate).format("dddd, D [de] MMMM")}
                </h3>

                {eventsForSelectedDay.length > 0 ? (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {eventsForSelectedDay.map((event, index) => (
                      <div
                        key={index}
                        className="event-card p-4 border border-gray-200 rounded-xl hover:shadow-md transition duration-200"
                      >
                        <h4 className="text-lg font-bold text-gray-800 mb-2">
                          {event.title}
                        </h4>
                        <div className="mt-1 space-y-1 text-sm text-gray-700">
                          <p className="flex items-center gap-2">
                            <Clock3
                              size={14}
                              className="text-blue-500 shrink-0"
                            />
                            <span className="font-semibold">Horario:</span>{" "}
                            {moment(event.start).format("h:mm A")} -{" "}
                            {moment(event.end).format("h:mm A")}
                          </p>

                          {event.lugar && (
                            <p className="flex items-center gap-2">
                              <MapPin
                                size={14}
                                className="text-purple-500 shrink-0"
                              />
                              <span className="font-semibold">Lugar:</span>{" "}
                              {event.lugar}
                            </p>
                          )}
                          {event.categoria && (
                            <p className="flex items-center gap-2">
                              <Tag
                                size={14}
                                className="text-green-500 shrink-0"
                              />
                              <span className="font-semibold">Categoría:</span>{" "}
                              {event.categoria}
                            </p>
                          )}
                        </div>

                        <div className="mt-3 border-t pt-3">
                          <p className="text-sm text-gray-600 leading-relaxed">
                            <span className="font-bold flex items-center gap-1 mb-1 text-gray-700">
                              <Eye size={14} /> Detalles:
                            </span>
                            {event.descripcion || "Sin detalles adicionales."}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Calendar1Icon
                      size={48}
                      className="mx-auto text-gray-300 mb-3"
                    />
                    <p className="font-semibold">
                      No hay eventos programados para este día.
                    </p>
                    <p className="text-sm text-gray-400">
                      Selecciona otra fecha o verifica los días marcados.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 🟢 CORRECCIÓN: Leyenda Detallada Abajo */}
          <div className="px-8 pb-8 pt-6 border-t border-gray-100 bg-gray-50/50">
            <h3 className="text-lg font-black text-gray-700 mb-5 flex items-center gap-2">
              <Info size={20} className="text-blue-600" />
              Leyenda y Referencia de Actividades
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* 1. Indicador del Calendario (Marcador de Día) */}
              <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/70 day-with-event-legend flex items-center justify-center text-xs font-bold text-white">
                  15
                </div>
                <div>
                  <p className="text-sm font-bold text-blue-800">Día Marcado</p>
                  <p className="text-xs text-gray-500">
                    Indica que hay uno o más eventos programados para esta
                    fecha.
                  </p>
                </div>
              </div>

              {/* 2. Categorías de Eventos */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">
                  <Tag size={14} /> Categoría
                </p>
                <div className="space-y-1 text-xs text-gray-600">
                  <p>
                    Los eventos pueden clasificarse como: **Torneo**, **Liga**,
                    **Registro**.
                  </p>
                  <p>Ayuda a identificar el tipo de actividad rápidamente.</p>
                </div>
              </div>

              {/* 3. Status/Estado */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">
                  <CheckCircle2 size={14} /> Status
                </p>
                <div className="space-y-1 text-xs text-gray-600">
                  <p>
                    Define si la actividad está: **Abierta** (Inscripciones),
                    **En Curso**, o **Finalizada**.
                  </p>
                  <p>
                    Este color (en la tarjeta de la actividad) te indica si
                    puedes participar.
                  </p>
                </div>
              </div>

              {/* 4. Contacto */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">
                  <User size={14} /> Información Adicional
                </p>
                <div className="space-y-1 text-xs text-gray-600">
                  <p>
                    Para detalles de inscripción, bases o dudas, visita la
                    sección de **Contacto**.
                  </p>
                  <p>
                    La **Descripción** del evento puede contener enlaces de
                    registro.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Fin de Leyenda Detallada */}
        </div>
      </div>
    </div>
  );
};

export default IntramurosCalendar;
