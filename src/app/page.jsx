"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Aos from "aos";
import "aos/dist/aos.css";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Pagination,
  Autoplay,
  Thumbs,
  Navigation,
} from "swiper/modules";

// Importaciones de CSS de Swiper
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/thumbs";

// Importaciones de React Icons - Consolidando la versión Fa6
import {
  FaCalendarCheck,
  FaChalkboardUser,
  FaFootball,
  FaHandHoldingHeart,
  FaUsers,
  FaMasksTheater,
} from "react-icons/fa6";

const HomePage = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const router = useRouter();

  useEffect(() => {
    Aos.init({ duration: 1000, once: true });
  }, []);

  const slides = [
    {
      categoria: "Cultura",
      titulo: "Música y Arte",
      descripcion: "Expresa tu creatividad en nuestros grupos musicales",
      imagen: "/imagenes/musica.jpg",
    },
    {
      categoria: "Deportes",
      titulo: "Voleibol",
      descripcion: "Forma parte del equipo representativo de voleibol",
      imagen: "/imagenes/volei.jpg",
    },
    {
      categoria: "Deportes",
      titulo: "Futbol",
      descripcion: "Forma parte del equipo representativo de futbol",
      imagen: "/imagenes/fut.jpg",
    },
    {
      categoria: "Deportes",
      titulo: "Sofball",
      descripcion: "Desarrolla tus habilidades en la cancha",
      imagen: "/imagenes/softball.jpeg",
    },
    {
      categoria: "Deportes",
      titulo: "Atletismo",
      descripcion: "Participa en competencias y supera tus límites",
      imagen: "/imagenes/corre.jpg",
    },
    {
      categoria: "Deportes",
      titulo: "Voleibol",
      descripcion: "Participa en competencias y supera tus límites",
      imagen: "/imagenes/volei.jpg",
    },
  ];

  return (
    <>
      <Navbar />

      <div className="homepage-container">
        <main className="swiper-container" data-aos="fade-up">
          <div style={{ position: "relative" }}>
            <Swiper
              effect="coverflow"
              grabCursor={true}
              centeredSlides={true}
              slidesPerView="auto"
              loop={true}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              thumbs={{
                swiper:
                  thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
              }}
              navigation={true}
              modules={[
                EffectCoverflow,
                Pagination,
                Autoplay,
                Thumbs,
                Navigation,
              ]}
              className="coverflow-swiper"
            >
              {slides.map((slide, index) => (
                <SwiperSlide key={index} className="coverflow-slide">
                  <div
                    className="coverflow-image"
                    style={{ backgroundImage: `url(${slide.imagen})` }}
                  >
                    <div className="coverflow-overlay">
                      <div className="instituto-headline-block">
                        <h1 className="main-headline">
                          Instituto <br /> Tecnológico
                        </h1>
                        <span className="sub-headline">De Ensenada</span>
                      </div>
                      <div>
                        <a
                          href="/desingn/vistaLogin"
                          className="instituto-boton"
                        >
                          Regístrate
                        </a>
                      </div>

                      {/* Categoría y título */}
                      <span className="coverflow-category">
                        {slide.categoria}
                      </span>
                      <h3 className="coverflow-title">{slide.titulo}</h3>
                      <p className="coverflow-description">
                        {slide.descripcion}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <Swiper
              onSwiper={setThumbsSwiper}
              direction="vertical"
              spaceBetween={12}
              slidesPerView="auto"
              freeMode={true}
              watchSlidesProgress={true}
              modules={[Thumbs]}
              className="thumbnails-swiper"
            >
              {slides.map((slide, index) => (
                <SwiperSlide key={index}>
                  <div className="thumbnail-wrapper">
                    <img src={slide.imagen} alt={slide.titulo} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </main>

        {/* Sección de Actividades */}
        <section className="category-cards-section" data-aos="fade-up">
          <h2 className="section-title">Participa en nuestras actividades</h2>
          <div className="cards-grid">
            <div className="card-item">
              <div className="icon">
                <FaFootball color="white" size={30} />
              </div>
              <h3>Deportes</h3>
              <p>Equipos competitivos</p>
            </div>

            <div className="card-item">
              <div className="icon">
                <FaMasksTheater color="white" size={30} />
              </div>
              <h3>Cultura</h3>
              <p>Eventos artísticos</p>
            </div>

            <div className="card-item">
              <div className="icon">
                <FaUsers color="white" size={30} />
              </div>
              <h3>Clubs</h3>
              <p>Únete a la comunidad</p>
            </div>

            <div className="card-item">
              <div className="icon">
                <FaHandHoldingHeart color="white" size={30} />
              </div>
              <h3>Voluntariado</h3>
              <p>Contribuye a causas sociales</p>
            </div>

            <div className="card-item">
              <div className="icon">
                <FaChalkboardUser color="white" size={30} />
              </div>
              <h3>Talleres</h3>
              <p>Desarrolla nuevas habilidades</p>
            </div>

            <div className="card-item">
              <div className="icon">
                <FaCalendarCheck color="white" size={30} />
              </div>
              <h3>Eventos</h3>
              <p>Todo el año</p>
            </div>
          </div>
        </section>

        <section className="activities-section">
          <h2 data-aos="fade-up">¡Entérate!</h2>
          <div className="activities-content">
            <div className="activity-item" data-aos="fade-right">
              <div className="text-content">
                <h3 className="activity-title">Actividades Extraescolares</h3>
                <p className="activity-description">
                  En el Instituto Tecnológico de Ensenada, ofrecemos una
                  variedad de actividades extraescolares diseñadas para
                  enriquecer tu experiencia educativa. Participa en clubes,
                  talleres y competencias que fortalecerán tus habilidades,
                  ampliarán tu red de amigos y te ayudarán a crecer personal y
                  profesionalmente.
                </p>
                <div className="button-group">
                  <button className="btn-primary">Explorar Actividades</button>
                </div>
              </div>
              <div className="image-content">
                <img
                  src="/imagenes/inie.jpg"
                  alt="Actividades Extraescolares"
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
                  ¡No te pierdas los emocionantes eventos del Instituto
                  Tecnológico de Ensenada! Desde competencias deportivas hasta
                  festivales culturales y tecnológicos, siempre hay algo nuevo
                  por vivir. Conoce las próximas fechas y forma parte de la
                  comunidad que hace del ITE un lugar lleno de energía e
                  innovación.
                </p>
                <div className="button-group">
                  <button className="btn-primary">Explorar Eventos</button>
                </div>
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
