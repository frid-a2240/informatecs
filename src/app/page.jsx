"use client";
import React, { useEffect, useState } from "react";
import Footer from "./components/footer";
import Navbar from "./components/navbar";
import TopBar from "./components/topbar";
import Link from "next/link";
import { FaFacebook } from "react-icons/fa"; // Importación requerida para el icono de Facebook

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [
    "/imagenes/imaUniversidad(2).png",
    "/imagenes/corre.jpg",
    "/imagenes/guerra.jpg",
    "/imagenes/fut.jpg",
    "/imagenes/musica.jpg",
    "/imagenes/volei.jpg",
    "/imagenes/basquet.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Función para manejar el clic en las miniaturas y puntos
  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  return (
    <>
      <TopBar />

      <div className="homepage-container">
        <section className="main-title-section">
          <h1>Eventos ITE</h1>
        </section>

        <Navbar />

        {/* ==============================================
            SECCIÓN DEL CARRUSEL MODIFICADA (MAGIC SLIDER)
        ============================================== */}
        <main className="magic-slider-hero-section">
          <div className="magic-slider-list">
            {images.map((image, index) => (
              <div
                key={index}
                className={`magic-slider-item ${
                  index === currentSlide ? "active" : ""
                }`}
              >
                <img src={image} alt={`Slide ${index + 1}`} />

                {/* Contenido de texto que va sobre la imagen principal */}
                <div className="magic-slider-content">
                  {/* Aquí colocamos el texto "Instituto Tecnológico De Ensenada" de tu código anterior */}
                  <h1 className="main-headline">
                    Instituto <br />
                    Tecnológico
                  </h1>
                  <span className="sub-headline">De Ensenada</span>
                  <p>
                    Te invitamos a participar en clubs, actividades
                    extraescolares y eventos.
                  </p>
                  <Link href="/designs/vistaLogin" className="register-button">
                    Registrarse
                  </Link>
                </div>
              </div>
            ))}

            {/* Controles de navegación: Puntos y Miniaturas */}
            <div className="magic-slider-controls">
              {/* Miniaturas */}
              <div className="magic-slider-thumbnails">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`thumbnail-item ${
                      index === currentSlide ? "active" : ""
                    }`}
                    onClick={() => handleSlideChange(index)}
                  >
                    <img src={image} alt={`Thumbnail ${index + 1}`} />
                  </div>
                ))}
              </div>

              <div className="carousel-dots">
                {images.map((_, index) => (
                  <span
                    key={index}
                    className={`carousel-dot ${
                      index === currentSlide ? "active" : ""
                    }`}
                    onClick={() => handleSlideChange(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </main>

        <section className="activities-section">
          <h2>¡Entérate!</h2>
          <div className="activities-content">
            <div className="activity-item">
              <div className="text-content">
                <h3 className="activity-title">Actividades Extraescolares</h3>
                <p className="activity-description">
                  En el Instituto Tecnológico de Ensenada, ofrecemos una
                  variedad de actividades extraescolares diseñadas para
                  enriquecer la experiencia educativa de nuestros estudiantes.
                  Además, organizamos eventos deportivos y culturales que te
                  permitirán desarrollar tus habilidades y conocer a otros
                  estudiantes con intereses similares. ¡Únete a nosotros y
                  enriquece tu vida estudiantil!
                </p>
              </div>
              <div className="image-content">
                <img
                  src="/imagenes/inie.jpg"
                  alt="Actividades Extraescolares"
                  className="activity-image"
                />
              </div>
            </div>

            <div className="activity-item reverse">
              <div className="image-content">
                <img
                  src="/imagenes/inia.jpg"
                  alt="Eventos"
                  className="activity-image"
                />
              </div>
              <div className="text-content">
                <h3 className="activity-title">Eventos</h3>
                <p className="activity-description">
                  ¡No te pierdas los emocionantes eventos que organizamos en el
                  Instituto Tecnológico de Ensenada! Desde competencias
                  deportivas hasta festivales culturales, siempre hay algo en lo
                  que puedes participar. Estos eventos son una excelente
                  oportunidad para divertirte, aprender cosas nuevas y hacer
                  amigos. ¡Ven y sé parte de nuestras actividades, y vive la
                  experiencia al máximo!
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default HomePage;
