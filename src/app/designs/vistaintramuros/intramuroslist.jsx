// src/app/designs/vistaintramuros/IntramurosList.jsx
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./actividades.css";

import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserTie,
  FaClock,
  FaSearch,
} from "react-icons/fa";

import ModalInscripcion from "./formulariointra";

// ================= CONFIGURACIÓN API =================
const API_PROXY_URL =
  "https://script.google.com/macros/s/AKfycbyLeN9z1JvTmVs9S8cvQSgmZXKO7LIK33pKzR4Ulk4oMeO4zODhKI0iD2hN5dA4DMh1gw/exec";

// ================= FUNCIONES AUXILIARES =================

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return isNaN(date)
    ? "N/A"
    : date.toLocaleDateString("es-MX", { timeZone: "UTC" });
};

const formatTime = (timeString) => {
  if (!timeString) return "N/A";
  const date = new Date(timeString);

  if (isNaN(date)) {
    const match = timeString.match(/^(\d{1,2}):(\d{2})$/);
    return match ? timeString : "N/A";
  }

  return date.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });
};

const getStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case "abierto":
      return "status-open";
    case "en curso":
      return "status-inprogress";
    case "cerrado":
      return "status-closed";
    default:
      return "status-default";
  }
};

// ================= COMPONENTE =================

const IntramurosList = () => {
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalActivo, setModalActivo] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSuccessfulSubmit = (msg) => {
    setModalActivo(null);
    setSuccessMessage(`${msg} Por favor revisa tu correo.`);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handleCloseModal = useCallback(() => {
    setModalActivo(null);
  }, []);

  const fetchActividades = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_PROXY_URL);
      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data?.error) {
        throw new Error(data.error);
      }

      if (Array.isArray(data)) {
        setActividades(data.filter((a) => a?.ID_Actividad));
      } else {
        throw new Error("Formato de datos inválido.");
      }
    } catch (err) {
      setError(err.message || "Error de conexión.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActividades();
  }, [fetchActividades]);

  const filteredActividades = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return actividades;

    return actividades.filter((a) =>
      [a.ID_Actividad, a.Actividad, a.Coordinador, a.Deporte_Area]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [actividades, searchTerm]);

  // ================= RENDER =================

  if (loading) {
    return (
      <div className="intramuros-list-wrapper">
        <div className="alert">⏳ Cargando actividades…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="intramuros-list-wrapper">
        <div className="alert alert-error">⚠️ {error}</div>
        <button className="btn btn-primary" onClick={fetchActividades}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="intramuros-list-wrapper">
      <header className="list-header">
        <div className="list-header">
          <div className="header-left">
            <div className="icon">
              <FaCalendarAlt />
            </div>
            <h2>Registro de Actividades Intramuros</h2>
          </div>
        </div>
      </header>

      {successMessage && (
        <div className="alert alert-success">✅ {successMessage}</div>
      )}

      <div className="search-container">
        <FaSearch className="search-icon" aria-hidden />
        <input
          className="search-input"
          type="text"
          placeholder="Buscar por ID, actividad, coordinador o área…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Buscar actividad"
        />
      </div>

      <div className="table-responsive">
        <table className="intramuros-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Actividad</th>
              <th>Área</th>
              <th>Coordinador</th>
              <th>Fecha / Hora</th>
              <th>Lugar</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filteredActividades.length ? (
              filteredActividades.map((a) => (
                <tr key={a.ID_Actividad}>
                  <td data-label="ID">{a.ID_Actividad}</td>
                  <td data-label="Actividad">{a.Actividad}</td>
                  <td data-label="Área">{a.Deporte_Area}</td>
                  <td data-label="Coordinador">
                    <FaUserTie /> {a.Coordinador || "N/A"}
                  </td>
                  <td data-label="Fecha / Hora">
                    <FaCalendarAlt /> {formatDate(a.Fecha_Inicio)}
                    <br />
                    <FaClock /> {formatTime(a.Hora_Inicio)}
                  </td>
                  <td data-label="Lugar">
                    <FaMapMarkerAlt /> {a.Lugar_Sede}
                  </td>
                  <td data-label="Estado">
                    <span
                      className={`status-badge ${getStatusClass(a.Estado)}`}
                    >
                      {a.Estado || "Desconocido"}
                    </span>
                  </td>
                  <td data-label="Acción">
                    {a.Estado?.toLowerCase() === "abierto" ? (
                      <button
                        className="btn btn-primary"
                        onClick={() => setModalActivo(a)}
                      >
                        Inscribirme
                      </button>
                    ) : (
                      <button className="btn" disabled>
                        {a.Estado || "No disponible"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-results">
                  No se encontraron resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalActivo && (
        <ModalInscripcion
          actividad={modalActivo}
          activityId={modalActivo.ID_Actividad}
          onClose={handleCloseModal}
          onSuccessfulSubmit={handleSuccessfulSubmit}
        />
      )}
    </div>
  );
};

export default IntramurosList;
