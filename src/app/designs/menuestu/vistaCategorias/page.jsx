"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  X,
  BookOpen,
  Clock,
  Code2,
  Star,
  Inbox,
  ChevronLeft,
  ChevronRight,
  Timer,
} from "lucide-react";
import NavbarEst from "@/app/components/navbares";
import ActividadForm from "@/app/components/formulario";
import "./eventos.css";

const Card = ({ item, isSelected, onClick }) => (
  <div
    className={`card ${isSelected ? "selected" : ""}`}
    onClick={() => onClick(item)}
  >
    <div className="card-header">
      <BookOpen className="icon" /> Asignatura
    </div>
    <h3>{item.actividad.aconco}</h3>
    <p className="description">
      Descubre más sobre esta actividad y sus beneficios.
    </p>
    <div className="card-footer">
      <span>
        <Inbox /> {item.actividad.acodes}
      </span>
      Información
    </div>
  </div>
);

const OfferModal = ({ item, onClose, onRegister }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      <button className="close-btn" onClick={onClose}>
        <X />
      </button>
      {item.actividad.image && (
        <img src={item.actividad.image} alt={item.actividad.aconco} />
      )}
      <h2>{item.actividad.aconco}</h2>
      <div className="modal-content">
        <p>
          Esta actividad forma parte de la oferta del semestre. Conoce sus
          detalles y regístrate para participar.
        </p>
        <div className="info-grid">
          <p>
            <Timer /> Horas: {item.actividad.acohrs}
          </p>
          <p>
            <Code2 /> Código: {item.actividad.acocve}
          </p>
          <p>
            <Star /> Créditos: {item.actividad.acocre}
          </p>
        </div>
      </div>
      <button className="register-btn" onClick={() => onRegister(item)}>
        Registrarme
      </button>
    </div>
  </div>
);

export default function App() {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const [formSport, setFormSport] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    hasPracticed: "",
    hasIllness: "",
    purpose: "",
    bloodType: "",
  });

  const [studentData, setStudentData] = useState(null); // Traer datos del estudiante
  const carouselRef = useRef(null);

  const API_OFERTAS = "/api/act-disponibles";

  // Traer datos del estudiante desde localStorage (como tu ejemplo de perfil)
  useEffect(() => {
    const savedData = localStorage.getItem("studentData");
    if (savedData) {
      setStudentData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    const cargarOfertas = async () => {
      try {
        const res = await fetch(API_OFERTAS);
        const data = await res.json();
        setOfertas(Array.isArray(data) ? data : data.ofertas || []);
      } catch (error) {
        console.error("Error al cargar ofertas:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarOfertas();
  }, []);

  const handleOpen = (item) => {
    setSelectedItem(item);
    setSelectedId(item.id);
  };

  const handleClose = () => {
    setSelectedItem(null);
    setSelectedId(null);
  };

  const handleRegister = (item) => {
    setFormSport({
      ofertaId: item.id,
      actividadId: item.actividad.id,
      name: item.actividad.aconco,
    });
    setFormData({
      hasPracticed: "",
      hasIllness: "",
      purpose: "",
      bloodType: "",
    });
    setShowForm(true);
    handleClose();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formSport || !studentData?.numeroControl) {
      alert("Faltan datos esenciales para la inscripción");
      return;
    }

    const { hasPracticed, hasIllness, purpose, bloodType } = formData;
    if (!hasPracticed || !hasIllness || !purpose || !bloodType) {
      alert("Por favor completa todas las preguntas");
      return;
    }

    const dataToSend = {
      aluctr: studentData.numeroControl,
      actividadId: formSport.actividadId,
      ofertaId: formSport.ofertaId,
      formData: { ...formData },
    };

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/inscripciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      const data = await response.json();

      if (response.ok) {
        setStudentData({ ...studentData, bloodType: formData.bloodType });
        setShowForm(false);
        setFormSport(null);
        alert(`Inscripción a ${formSport.name} registrada exitosamente`);
      } else {
        alert(
          "Error al registrar inscripción: " +
            (data.error || "Error desconocido")
        );
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión al servidor");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollCarousel = (dir) => {
    if (carouselRef.current) {
      const amt = dir === "left" ? -408 : 408;
      carouselRef.current.scrollBy({ left: amt, behavior: "smooth" });
    }
  };

  if (showForm && formSport) {
    return (
      <ActividadForm
        formData={formData}
        setFormData={setFormData}
        handleFormSubmit={handleFormSubmit}
        selectedSport={formSport}
        cancelar={() => setShowForm(false)}
        isSubmitting={isSubmitting}
      />
    );
  }

  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        <h1>Ofertas del Semestre</h1>
        <p className="subtitle">
          Explora las actividades disponibles y regístrate fácilmente
        </p>

        {loading ? (
          <p>Cargando...</p>
        ) : ofertas.length > 0 ? (
          <div className="carousel-container">
            <button
              className="carousel-btn left"
              onClick={() => scrollCarousel("left")}
            >
              <ChevronLeft />
            </button>
            <div ref={carouselRef} className="carousel">
              {ofertas.map((item) => (
                <Card
                  key={item.id}
                  item={item}
                  isSelected={selectedId === item.id}
                  onClick={handleOpen}
                />
              ))}
            </div>
            <button
              className="carousel-btn right"
              onClick={() => scrollCarousel("right")}
            >
              <ChevronRight />
            </button>
          </div>
        ) : (
          <p>No hay ofertas disponibles</p>
        )}

        {selectedItem && (
          <OfferModal
            item={selectedItem}
            onClose={handleClose}
            onRegister={handleRegister}
          />
        )}
      </main>
    </div>
  );
}
