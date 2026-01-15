"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./components/navbar";
import Aos from "aos";
import "aos/dist/aos.css";

import Footer from "./components/footer";

// Icons
import {
  FaCalendarCheck,
  FaChalkboardUser,
  FaFootball,
  FaHandHoldingHeart,
  FaUsers,
  FaMasksTheater,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa6";

const HomePage = () => {
  const router = useRouter();

  // Inicialización AOS
  useEffect(() => {
    Aos.init({ duration: 1000, once: true });
  }, []);

  // ITEMS DEL SLIDER
  const [items, setItems] = useState([
    {
      id: 1,
      categoria: "Cultura",
      titulo: "Música y Arte",
      descripcion: "Expresa tu creatividad en nuestros grupos musicales",
      imagen: "/imagenes/musica.jpg",
    },
    {
      id: 2,
      categoria: "Deportes",
      titulo: "Voleibol",
      descripcion: "Forma parte del equipo representativo de voleibol",
      imagen: "/imagenes/volei.jpg",
    },
    {
      id: 3,
      categoria: "Deportes",
      titulo: "Futbol",
      descripcion: "Forma parte del equipo representativo de futbol",
      imagen: "/imagenes/fut.jpg",
    },
    {
      id: 4,
      categoria: "Deportes",
      titulo: "Softball",
      descripcion: "Desarrolla tus habilidades en la cancha",
      imagen: "/imagenes/softball.jpeg",
    },
    {
      id: 5,
      categoria: "Deportes",
      titulo: "Atletismo",
      descripcion: "Participa en competencias y supera tus límites",
      imagen: "/imagenes/corre.jpg",
    },
    {
      id: 6,
      categoria: "Deportes",
      titulo: "Voleibol Rep.",
      descripcion: "Participa en competencias y supera tus límites",
      imagen: "/imagenes/volei.jpg",
    },
  ]);

  // SIGUIENTE
  const handleNext = useCallback(() => {
    setItems((prev) => {
      const arr = [...prev];
      arr.push(arr.shift());
      return arr;
    });
  }, []);

  // ANTERIOR
  const handlePrev = useCallback(() => {
    setItems((prev) => {
      const arr = [...prev];
      arr.unshift(arr.pop());
      return arr;
    });
  }, []);

  // AUTOPLAY BIEN HECHO + CLEANUP
  useEffect(() => {
    const interval = setInterval(handleNext, 6000);
    return () => clearInterval(interval);
  }, [handleNext]);

  return (
    <>
      <Navbar />

      <div className="homepage-wrapper">
        {/* HERO / SLIDER */}
        <div className="hero-container" data-aos="fade-in">
          <div className="hero-slide">
            {items.map((item) => (
              <div
                key={item.id}
                className="item"
                style={{ backgroundImage: `url(${item.imagen})` }}
              >
                <div className="content">
                  <div className="instituto-block">
                    <h1 className="main-headline">
                      Instituto <br /> Tecnológico
                    </h1>
                    <span className="sub-headline">De Ensenada</span>
                  </div>

                  <div className="slide-info">
                    <div className="category-badge">{item.categoria}</div>
                    <div className="name">{item.titulo}</div>
                    <div className="des">{item.descripcion}</div>

                    <button
                      onClick={() => router.push("/designs/vistaLogin")}
                      className="hero-btn"
                    >
                      Registrarse
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hero-buttons">
            <button onClick={handlePrev}>
              <FaAngleLeft />
            </button>
            <button onClick={handleNext}>
              <FaAngleRight />
            </button>
          </div>
        </div>

        {/* SECCIÓN DE TARJETAS */}
        <section className="category-cards-section" data-aos="fade-up">
          <h2 className="section-title">Participa en nuestras actividades!</h2>

          <div className="cards-grid">
            {/* Deportes */}
            <div className="card-item">
              <img
                src="/imagenes/basquet.png"
                alt="Deportes"
                className="card-img"
              />
              <div className="card-content">
                <div className="card-icon">
                  <FaFootball size={32} color="white" />
                </div>
                <h3>Deportes</h3>
                <p>Equipos competitivos</p>
              </div>
            </div>

            {/* Cultura */}
            <div className="card-item">
              <img
                src="/imagenes/albatrocatrin.png"
                alt="Cultura"
                className="card-img"
              />
              <div className="card-content">
                <div className="card-icon">
                  <FaMasksTheater size={32} color="white" />
                </div>
                <h3>Cultura</h3>
                <p>Eventos artísticos</p>
              </div>
            </div>

            {/* Clubs */}
            <div className="card-item">
              <img
                src="/imagenes/albatrobanda.png"
                alt="Clubs"
                className="card-img"
              />
              <div className="card-content">
                <div className="card-icon">
                  <FaUsers size={32} color="white" />
                </div>
                <h3>Clubs</h3>
                <p>Únete a la comunidad</p>
              </div>
            </div>

            {/* Voluntariado */}
            <div className="card-item">
              <img
                src="/imagenes/voluntariado.png"
                alt="Voluntariado"
                className="card-img"
              />
              <div className="card-content">
                <div className="card-icon">
                  <FaHandHoldingHeart size={32} color="white" />
                </div>
                <h3>Voluntariado</h3>
                <p>Contribuye a causas sociales</p>
              </div>
            </div>

            {/* Talleres */}
            <div className="card-item">
              <img
                src="/imagenes/albatroreally.png"
                alt="Talleres"
                className="card-img"
              />
              <div className="card-content">
                <div className="card-icon">
                  <FaChalkboardUser size={32} color="white" />
                </div>
                <h3>Talleres</h3>
                <p>Desarrolla nuevas habilidades</p>
              </div>
            </div>

            {/* Eventos */}
            <div className="card-item">
              <img
                src="/imagenes/eventos.png"
                alt="Eventos"
                className="card-img"
              />
              <div className="card-content">
                <div className="card-icon">
                  <FaCalendarCheck size={32} color="white" />
                </div>
                <h3>Eventos</h3>
                <p>Todo el año</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN DE ACTIVIDADES EXTRAESCOLARES */}
        <section className="activities-section">
          <h2>¡Activa tu Experiencia ITE!</h2>

          <div className="activities-content">
            <div className="activity-item reverse" data-aos="fade-right">
              <div className="text-content">
                <h3 className="activity-title">Actividades Extraescolares</h3>
                <p className="activity-description">
                  En el Instituto Tecnológico de Ensenada, ofrecemos una variedad de
                  actividades extraescolares diseñadas para enriquecer tu experiencia
                  educativa...
                </p>
              </div>

              <div className="image-content">
                <img
                  src="/imagenes/inie.jpg"
                  alt="Actividades"
                  className="activity-image"
                />
              </div>
            </div>

            <div className="activity-item reverse" data-aos="fade-left">
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
                  ¡No te pierdas los emocionantes eventos del Instituto Tecnológico de
                  Ensenada!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN DE ENCUESTA / QR */}
        <section className="activities-section">
          <h2>Actividades de tu interés</h2>

          <p className="activity-description">
            Nos interesa conocer tu opinión y saber qué actividades te llaman más la
            atención como aspirante al Instituto Tecnológico de Ensenada. Tu respuesta
            nos ayudará a ofrecerte opciones acordes a tus gustos e intereses.
          </p>

          <p className="qr-text">
            Si estás navegando desde una computadora, escanea el código QR para responder
            la encuesta desde tu celular. <br />
            Si estás en tu celular, puedes contestarla directamente con el botón.
          </p>

          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://forms.gle/TU_LINK"
            alt="Código QR de la encuesta de intereses para aspirantes"
            className="qr-image"
          />

          <button
            className="hero-btn"
            onClick={() => window.open("https://forms.gle/TU_LINK", "_blank")}
          >
            Contestar encuesta
          </button>

          <small>Encuesta dirigida únicamente a aspirantes de nuevo ingreso</small>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default HomePage;
