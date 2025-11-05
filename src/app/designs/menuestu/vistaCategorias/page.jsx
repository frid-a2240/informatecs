"use client";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ActividadForm from "@/app/components/formulario";
// Importar los hooks personalizados
import "./eventos.css";
import { useStudentData } from "@/app/components/hooks/useStudentData";
import { useOfertas } from "@/app/components/hooks/useOfertas";
import { useModalHandler } from "@/app/components/hooks/useModalHandler";
import { useInscripcion } from "@/app/components/hooks/useInscripcion";
import { useCarousel } from "@/app/components/hooks/useCarousel";
import Card from "@/app/components/card";
import OfferModal from "@/app/components/offterModal";
export default function App() {
  // Hook para datos del estudiante
  const { studentData, updateStudentData } = useStudentData();

  // Hook para ofertas
  const { ofertas, loading, error } = useOfertas("/api/act-disponibles");

  // Hook para control del modal
  const { selectedItem, selectedId, handleOpen, handleClose } =
    useModalHandler();

  // Hook para inscripción
  const {
    formSport,
    showForm,
    isSubmitting,
    formData,
    setFormData,
    iniciarInscripcion,
    cancelarInscripcion,
    submitInscripcion,
  } = useInscripcion();

  // Hook para el carousel
  const { carouselRef, scrollCarousel } = useCarousel(408);

  // Handler para registrar (abre el formulario)
  const handleRegister = (item) => {
    iniciarInscripcion(item);
    handleClose();
  };

  // Handler para enviar formulario
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await submitInscripcion(studentData, (bloodType) => {
      updateStudentData({ bloodType });
    });
  };

  // Mostrar formulario de inscripción
  if (showForm && formSport) {
    return (
      <ActividadForm
        formData={formData}
        setFormData={setFormData}
        handleFormSubmit={handleFormSubmit}
        selectedSport={formSport}
        cancelar={cancelarInscripcion}
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
        ) : error ? (
          <p>Error: {error}</p>
        ) : ofertas.length > 0 ? (
          <div className="carousel-container">
            <button
              className="carousel-btn left"
              onClick={() => scrollCarousel("left")}
              aria-label="Desplazar ofertas a la izquierda"
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
              aria-label="Desplazar ofertas a la derecha"
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
