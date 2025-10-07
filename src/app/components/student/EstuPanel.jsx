import React, { useState, useEffect } from "react";
import ActividadForm from "./ActividadForm"; // formulario separado

const EstuPanel = ({ activeSection, studentData, setStudentData }) => {
  const [actividadesDisponibles, setActividadesDisponibles] = useState([]);
  const [misActividades, setMisActividades] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedSport, setSelectedSport] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    hasPracticed: "",
    hasIllness: "",
    purpose: "",
    bloodType: "",
  });

  // Cargar actividades disponibles
  useEffect(() => {
    if (activeSection === "activities") cargarActividadesDisponibles();
  }, [activeSection]);

  // Cargar mis actividades
  useEffect(() => {
    if (activeSection === "events") cargarMisActividades();
  }, [activeSection, studentData]);

  const cargarActividadesDisponibles = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/act-disponibles");
      const data = await response.json();
      setActividadesDisponibles(data);
    } catch (error) {
      console.error("Error al cargar actividades:", error);
    } finally {
      setLoading(false);
    }
  };

  const cargarMisActividades = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/inscripciones?aluctr=${studentData.numeroControl}`
      );
      const data = await response.json();
      setMisActividades(data);
    } catch (error) {
      console.error("Error al cargar mis actividades", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInscribirmeClick = (oferta) => {
    setSelectedSport({
      ofertaId: oferta.id,
      actividadId: oferta.actividad.id,
      name: oferta.actividad.aconco || oferta.actividad.aticve,
    });
    setFormData({
      hasPracticed: "",
      hasIllness: "",
      purpose: "",
      bloodType: studentData.bloodType || "",
    });
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSport) {
      alert("Error: no se ha seleccionado actividad");
      return;
    }

    const { hasPracticed, hasIllness, purpose, bloodType } = formData;

    if (!hasPracticed || !hasIllness || !purpose || !bloodType) {
      alert("Por favor completa todas las preguntas");
      return;
    }

    try {
      const dataToSend = {
        aluctr: studentData.numeroControl,
        actividadId: selectedSport.actividadId,
        ofertaId: selectedSport.ofertaId,
        formularioData: { ...formData },
      };

      const response = await fetch("/api/inscripciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (response.ok) {
        setStudentData({ ...studentData, bloodType: formData.bloodType });
        alert(`Inscripción a ${selectedSport.name} registrada exitosamente`);
        setShowForm(false);
        setSelectedSport(null);
        cargarMisActividades();
      } else {
        alert(
          "Error al registrar inscripción: " + (data.error || "Desconocido")
        );
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión al servidor");
    }
  };

  return (
    <div>
      {activeSection === "activities" && !showForm && (
        <div>
          {loading ? (
            <p>Cargando actividades...</p>
          ) : actividadesDisponibles.length === 0 ? (
            <p>No hay actividades disponibles.</p>
          ) : (
            <div style={{ display: "grid", gap: "1rem" }}>
              {actividadesDisponibles.map((oferta) => (
                <div
                  key={oferta.id}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "1rem",
                    cursor: "pointer",
                  }}
                >
                  <h4>{oferta.actividad.aconco || oferta.actividad.aticve}</h4>
                  <p>Código: {oferta.actividad.aticve}</p>
                  <button
                    onClick={() => handleInscribirmeClick(oferta)}
                    style={{
                      marginTop: "0.5rem",
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      border: "none",
                      backgroundColor: "#007bff",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    Inscribirme
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeSection === "events" && (
        <div>
          {loading ? (
            <p>Cargando mis actividades...</p>
          ) : misActividades.length === 0 ? (
            <p>No tienes actividades inscritas.</p>
          ) : (
            <div style={{ display: "grid", gap: "1rem" }}>
              {misActividades.map((inscripcion, index) => (
                <div
                  key={index}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "1rem",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <h4>
                    {inscripcion.actividad?.aconco ||
                      inscripcion.actividad?.aticve}
                  </h4>
                  <p>Código: {inscripcion.actividad?.aticve}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showForm && selectedSport && (
        <ActividadForm
          formData={formData}
          setFormData={setFormData}
          handleFormSubmit={handleFormSubmit}
          selectedSport={selectedSport}
          cancelar={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default EstuPanel;
