"use client";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ActividadForm from "@/app/components/forms/formulario";
import "@/styles/alumno/eventos.css";
import { useStudentData } from "@/app/components/hooks/useStudentData";
import { useOfertas } from "@/app/components/hooks/useOfertas";
import { useModalHandler } from "@/app/components/hooks/useModalHandler";
import { useInscripcion } from "@/app/components/hooks/useInscripcion";
import { useCarousel } from "@/app/components/hooks/useCarousel";
import Card from "@/app/components/card";
import OfferModal from "@/app/components/offterModal";
import Image from "next/image";

export default function App() {
  const { studentData } = useStudentData(); 
  const { ofertas, loading, error } = useOfertas("/api/act-disponibles");

  const { selectedItem, selectedId, handleOpen, handleClose } =
    useModalHandler();

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

  const { carouselRef, scrollCarousel } = useCarousel(408);

  /* ===============================
     REGISTRAR ACTIVIDAD
     =============================== */
  const handleRegister = (item) => {
    if (!studentData?.numeroControl) {
      alert("No se pudo obtener el número de control del alumno");
      return;
    }

    iniciarInscripcion(item, studentData.numeroControl); // ✅ CORREGIDO
    handleClose();
  };

  /* ===============================
     ENVIAR FORMULARIO
     =============================== */
  const handleFormSubmit = async (formDataFromChild) => {
    if (!studentData?.numeroControl) {
      alert("No se pudo obtener el número de control del alumno");
      return;
    }

    try {
      await submitInscripcion(
        studentData,
        null,
        formDataFromChild
      );
    } catch (error) {
      console.error("Error en handleFormSubmit:", error);
    }
  };

  /* ===============================
     VISTA FORMULARIO (PASO 2)
     =============================== */
  if (showForm && formSport) {
    return (
      <div className="dashboard-container">
        <main className="dashboard-main">
          <div className="header-with-mascot">
            <div className="header-content">
              <h1>Ofertas del Semestre</h1>
              <p className="subtitle">
                Explora las actividades disponibles y regístrate fácilmente
              </p>

              <div className="steps-indicator">
                <div className="step completed">
                  <div className="step-number">1</div>
                  <div className="step-label">Seleccionar actividad</div>
                </div>
                <div className="step-line completed"></div>
                <div className="step active">
                  <div className="step-number">2</div>
                  <div className="step-label">Llenar formulario</div>
                </div>
                <div className="step-line"></div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-label">Confirmar inscripción</div>
                </div>
              </div>
            </div>

            <div className="mascot-container">
              <Image
                src="/imagenes/eventos.png"
                alt="Mascota Albatros"
                width={180}
                height={180}
              />
            </div>
          </div>

          <ActividadForm
            formData={formData}
            setFormData={setFormData}
            handleFormSubmit={handleFormSubmit}
            selectedSport={formSport}
            cancelar={cancelarInscripcion}
            isSubmitting={isSubmitting}
          />
        </main>
      </div>
    );
  }

  /* ===============================
     VISTA PRINCIPAL (PASO 1)
     =============================== */
  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        <div className="header-with-mascot">
          <div className="header-content">
            <h1>Ofertas del Semestre</h1>
            <p className="subtitle">
              Explora las actividades disponibles y regístrate fácilmente
            </p>

            <div className="steps-indicator">
              <div className="step active">
                <div className="step-number">1</div>
                <div className="step-label">Seleccionar actividad</div>
              </div>
              <div className="step-line"></div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-label">Llenar formulario</div>
              </div>
              <div className="step-line"></div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-label">Confirmar en Mis Inscripciones</div>
              </div>
            </div>
          </div>

          <div className="mascot-container">
            <Image
              src="/imagenes/eventos.png"
              alt="Mascota Albatros"
              width={180}
              height={180}
            />
          </div>
        </div>

        {loading ? (
          <p>Cargando...</p>
        ) : error ? (
          <p>Error: {error}</p>
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
