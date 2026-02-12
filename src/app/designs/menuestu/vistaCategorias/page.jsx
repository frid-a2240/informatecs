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

  const handleFormSubmit = async (formDataFromChild) => {
    if (!studentData?.numeroControl) {
      alert("No se pudo obtener el número de control del alumno");
      return;
    }

    try {
      await submitInscripcion(studentData, null, formDataFromChild);
    } catch (error) {
      console.error("Error en handleFormSubmit:", error);
    }
  };

  if (showForm && formSport) {
    return (
      <div className="ofertas-dashboard-container">
        <main className="ofertas-dashboard-main">
          <div className="ofertas-header-with-mascot">
            <div className="ofertas-header-content">
              <h1>Ofertas del Semestre</h1>
              <p className="ofertas-subtitle">
                Explora las actividades disponibles y regístrate fácilmente
              </p>

              <div className="ofertas-steps-indicator">
                <div className="ofertas-step completed">
                  <div className="ofertas-step-number">1</div>
                  <div className="ofertas-step-label">
                    Seleccionar actividad
                  </div>
                </div>
                <div className="ofertas-step-line completed"></div>
                <div className="ofertas-step active">
                  <div className="ofertas-step-number">2</div>
                  <div className="ofertas-step-label">Llenar formulario</div>
                </div>
                <div className="ofertas-step-line"></div>
                <div className="ofertas-step">
                  <div className="ofertas-step-number">3</div>
                  <div className="ofertas-step-label">
                    Confirmar inscripción
                  </div>
                </div>
              </div>
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
    <div className="ofertas-dashboard-container">
      <main className="ofertas-dashboard-main">
        <div className="ofertas-header-with-mascot">
          <div className="ofertas-header-content">
            <h1>Ofertas del Semestre</h1>
            <p className="ofertas-subtitle">
              Explora las actividades disponibles y regístrate fácilmente
            </p>

            <div className="ofertas-steps-indicator">
              <div className="ofertas-step active">
                <div className="ofertas-step-number">1</div>
                <div className="ofertas-step-label">Seleccionar actividad</div>
              </div>
              <div className="ofertas-step-line completed"></div>
              <div className="ofertas-step">
                <div className="ofertas-step-number">2</div>
                <div className="ofertas-step-label">Llenar formulario</div>
              </div>
              <div className="ofertas-step-line"></div>
              <div className="ofertas-step">
                <div className="ofertas-step-number">3</div>
                <div className="ofertas-step-label">
                  Confirmar en Mis Inscripciones
                </div>
              </div>
            </div>
          </div>

          <div className="ofertas-mascota-container">
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
          <div className="ofertas-carousel-container">
            <button
              className="ofertas-carousel-btn left"
              onClick={() => scrollCarousel("left")}
            >
              <ChevronLeft />
            </button>

            <div ref={carouselRef} className="ofertas-carousel">
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
              className="ofertas-carousel-btn right"
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
