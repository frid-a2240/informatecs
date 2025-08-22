"use client";
import React, { useEffect, useState } from "react";
import Footer from "./components/footer";
import Navbar from "./components/navbar";
import TopBar from "./components/topbar";
import Link from "next/link";

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [
    "/imagenes/imaUniversidad(2).png",
    "/imagenes/corre.jpg",
    "/imagenes/guerra.jpg",
  ];

  // Carrusel automático: cambia imagen cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
      <TopBar />

      <div className="homepage-container">
        <header className="header">
          {/* Si no necesitas el <img />, elimínalo */}
        </header>

        <section className="main-title-section">
          <h1>INFORMATEC</h1>
        </section>

        {/* Navbar fuera del carrusel */}
        <Navbar />

        {/* Carrusel */}
        <main className="hero-section">
          <div className="carousel-container">
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Slide ${index + 1}`}
                className={`hero-image ${
                  index === currentSlide ? "active" : ""
                }`}
              />
            ))}
          </div>

          <div className="hero-text-container">
            <div className="hero-text-content">
              <h1 className="main-headline">
                Instituto <br />
                Tecnológico
              </h1>
              <span className="sub-headline">De Ensenada</span>
              <p>
                Te invitamos a participar en clubs, actividades extraescolares y
                eventos.
              </p>

              <Link href="/vistaLogin" className="register-button">
                Registrarse
              </Link>
            </div>
          </div>
        </main>

        {/* Actividades extraescolares */}
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
