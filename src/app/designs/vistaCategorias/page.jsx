"use client";
import { useState } from "react";
import NavbarEst from "@/app/components/navbares";
import "./eventos.css";

// Importamos Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  const eventos = [
    {
      id: 1,
      src: "/imagenes/futbol.jpg",
      alt: "Fútbol",
      desc: "Participa en torneos y entrenamientos de fútbol con tu equipo.",
    },
    {
      id: 2,
      src: "/imagenes/basquet.jpg",
      alt: "Básquetbol",
      desc: "Únete a los partidos de básquet y mejora tus habilidades.",
    },
    {
      id: 3,
      src: "/imagenes/softball.jpeg",
      alt: "Softball",
      desc: "Disfruta del softball en un ambiente divertido y competitivo.",
    },
    {
      id: 4,
      src: "/imagenes/volei.jpg",
      alt: "Vóleibol",
      desc: "Entrena vóleibol con estudiantes de todos los niveles.",
    },
    {
      id: 5,
      src: "/imagenes/rugby.jpg",
      alt: "Rugby",
      desc: "Descubre la intensidad y el compañerismo del rugby.",
    },
  ];

  const extraescolares = [
    {
      id: 1,
      src: "/imagenes/ajedrez.png",
      alt: "Ajedrez",
      desc: "Desarrolla tu pensamiento estratégico en el club de ajedrez.",
    },
    {
      id: 2,
      src: "/imagenes/musica.jpg",
      alt: "Música",
      desc: "Explora tu talento musical y participa en ensambles.",
    },
    {
      id: 3,
      src: "/imagenes/guerra.jpg",
      alt: "Banda de guerra",
      desc: "Sé parte de la banda de guerra y representa con orgullo.",
    },
    {
      id: 4,
      src: "/imagenes/voleibol.jpg",
      alt: "Vóleibol",
      desc: "Entrenamientos recreativos y competitivos de vóleibol.",
    },
    {
      id: 5,
      src: "/imagenes/rugby.jpg",
      alt: "Rugby",
      desc: "Practica rugby y fomenta el trabajo en equipo.",
    },
  ];

  return (
    <div className="dashboard-container">
      <NavbarEst open={sidebarOpen} setOpen={setSidebarOpen} />

      <main
        className={`dashboard-main welcome-main ${
          sidebarOpen ? "with-sidebar" : "full-width"
        }`}
      >
        <h1>Explora las actividades que tenemos para ti</h1>
        <p>Elige la que más te guste y regístrate</p>

        {/* Carrusel Eventos */}
        <section className="section">
          <h2 className="section-title">Eventos</h2>
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={20}
            slidesPerView={3}
            breakpoints={{
              320: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {eventos.map((item) => (
              <SwiperSlide key={item.id}>
                <div
                  className="image-container"
                  onClick={() => setSelectedItem(item)}
                >
                  <h3 className="image-title">{item.alt}</h3>
                  <img src={item.src} alt={item.alt} className="image" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* Carrusel Extraescolares */}
        <section className="section">
          <h2 className="section-title">Extraescolares</h2>
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={20}
            slidesPerView={3}
            breakpoints={{
              320: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {extraescolares.map((item) => (
              <SwiperSlide key={item.id}>
                <div
                  className="image-container"
                  onClick={() => setSelectedItem(item)}
                >
                  <h3 className="image-title">{item.alt}</h3>
                  <img src={item.src} alt={item.alt} className="image" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      </main>

      {/* Modal con imagen, descripción y botón de registro */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelectedItem(null)}
            >
              ✖
            </button>
            <img
              src={selectedItem.src}
              alt={selectedItem.alt}
              className="modal-image"
            />
            <h2 className="modal-title">{selectedItem.alt}</h2>
            <p className="modal-description">{selectedItem.desc}</p>
            <button
              className="modal-register"
              onClick={() => alert(`Registro para ${selectedItem.alt}`)}
            >
              Registrarme
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
