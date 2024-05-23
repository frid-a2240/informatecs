'use client'
import React from 'react';
import Link from "next/link";
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { Carousel } from 'react-responsive-carousel'; 

const clubs = [
  { name: "Club de Ajedrez", src: "imagenes/ajedrez.png" },
  { name: "Club de Softbol", src: "imagenes/softball.jpeg" },
  { name: "Club de Futbol", src: "imagenes/fut.jpg" },
  { name: "Club de Atletismo", src: "imagenes/corre.jpg" },
  { name: "Ballet Folclórico", src: "imagenes/vesti.jpg" },
  { name: "Banda de Guerra", src: "imagenes/guerra.jpg" }
];

const Page = () => {
  return (
    <div>
      <div className="bg-blue-950 h-16 w-full flex justify-between items-center px-4">
        <div className="flex">
          <img src="imagenes/imaCorreo.jpg" alt="Logo" className="mr-2 pl-16" />
          <span className="text-white pl-2">informatec@ensenada.tecnm.mx</span>
        </div>
        <div className="flex items-right pr-16">
          <img src="imagenes/imaInsta.jpg" alt="Logo" className="mr-2 pr-3" />
          <img src="imagenes/imaTwitter.jpg" alt="Logo" className="mr-2" />
        </div>
      </div>
      <div className="bg-white text-center p-4">
        <h1 className="text-yellow-500 text-4xl">INFORMATEC</h1>
      </div>
      <div className="bg-blue-950 h-24 w-full text-center pt-8 items-center px-4 space-x-12">
        <Link href='/vistaInicio' className="text-white px-4 py-8 hover:bg-yellow-400 transition-all duration-500">INICIO</Link>
        <Link href='/vistaNovedades' className="text-white px-4 py-8 hover:bg-yellow-400 transition-all duration-500">NOVEDADES</Link>
        <Link href='/vistaEventos' className="text-white px-4 py-8 hover:bg-yellow-400 transition-all duration-500">EVENTOS</Link>
        <Link href='/vistaExtraescolares' className="text-white px-4 py-8 hover:bg-yellow-400 transition-all duration-500">EXTRAESCOLARES</Link>
        <Link href='/vistaClub' className="text-white px-4 py-8 hover:bg-yellow-400 transition-all duration-500">CLUBS</Link>
        <Link href='/vistaCalendario' className="text-white px-4 py-8 hover:bg-yellow-400 transition-all duration-500">CALENDARIO</Link>
        <Link href='/panel_admin' className="bg-yellow-500 text-xl text-white px-8 py-5 rounded-full hover:bg-yellow-600 transition-all duration-300">Registrarse</Link>
      </div>

      <div className="relative w-full max-w-4xl mx-auto mt-8">
        <Carousel
          showThumbs={false}
          showStatus={false}
          infiniteLoop
          useKeyboardArrows
          autoPlay
          renderArrowPrev={(onClickHandler, hasPrev, label) =>
            hasPrev && (
              <button type="button" onClick={onClickHandler} title={label} className="carousel-arrow carousel-arrow-prev">
                ‹
              </button>
            )
          }
          renderArrowNext={(onClickHandler, hasNext, label) =>
            hasNext && (
              <button type="button" onClick={onClickHandler} title={label} className="carousel-arrow carousel-arrow-next">
                ›
              </button>
            )
          }
        >
          {clubs.map((club, index) => (
            <div key={index} className="carousel-image-container">
              <img src={club.src} alt={club.name} className="carousel-image" />
              <p className="legend">{club.name}</p>
            </div>
          ))}
        </Carousel> 
      </div>
       {/* Footer */}
       <div className="bg-blue-950 text-white text-center p-4">
        <h2 className="text-lg font-bold">Contáctanos</h2>
        <p>Dirección: Boulevard Tecnológico No. 150, Ex-ejido Chapultepec, 22780 Ensenada, B.C.</p>
        <p>Correo: informatec@ensenada.tecnm.mx</p>
        <p>© 2024 Todos los Derechos Reservados</p>
      </div>

      <style jsx>{`
        .carousel-image-container {
          max-height: 300px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .carousel-image {
          max-height: 300px;
          object-fit: contain;
        }

        .carousel-arrow {
          position: absolute;
          top: 50%;
          z-index: 2;
          background: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          padding: 10px;
          cursor: pointer;
          transform: translateY(-50%);
        }

        .carousel-arrow-prev {
          left: 15px;
        }

        .carousel-arrow-next {
          right: 15px;
        }
      `}</style>
    </div>
  )
}

export default Page;