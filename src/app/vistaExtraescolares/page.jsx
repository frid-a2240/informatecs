// page.jsx
'use client'
import React, { useEffect } from 'react';
import Link from "next/link";
import './styles.css';

const Page = () => {
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScroll = () => {
    const elements = document.querySelectorAll('.image-container');
    elements.forEach((element) => {
      if (isElementInViewport(element)) {
        element.classList.add('show');
      }
    });
  };

  const isElementInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  return (
    <div>
      <div>
        {/* Encabezado */}
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
        {/* Título */}
        <div className="bg-white text-center p-4">
          <h1 className="text-yellow-500 text-4xl">INFORMATEC</h1>
        </div>
        {/* Enlaces de navegación */}
        <div className="bg-blue-950 h-24 w-full text-center pt-8 items-center px-4 space-x-12">
          <Link href='vistaInicio' className="text-white px-4 py-8 hover:bg-yellow-400 transition-all duration-500">INICIO</Link>
          <Link href='vistaNovedades' className="text-white px-4 py-8 hover:bg-yellow-400 transition-all duration-500">EVENTOS</Link>
          <Link href='vistaExtraescolares' className="text-white px-4 py-8 hover:bg-yellow-400 transition-all duration-500">EXTRAESCOLARES</Link>
          <Link href='/vistaClub' className="text-white px-4 py-8 hover:bg-yellow-400 transition-all duration-500">CLUBS</Link>
          <Link href='/vistaCalendario' className="text-white px-4 py-8 hover:bg-yellow-400 transition-all duration-500">CALENDARIO</Link>
          <Link href='/panel_admin' className="bg-yellow-500 text-xl text-white px-8 py-5 rounded-full hover:bg-yellow-600 transition-all duration-300">Registrarse</Link>
        </div>
      </div>
      {/* Contenido de las imágenes */}
      <div className="image-list">
        <div className="image-container">
          <img src="imagenes/fut.jpg" alt="Imagen 1" />
          <div className="image-overlay">
            <p>Animate a ser parte del equipo de fútbol. ¡Únete a nosotros y vive la pasión del fútbol!</p>
          </div>
        </div>
        <div className="image-container">
          <img src="imagenes/softball.jpeg" alt="Imagen 2" />
          <div className="image-overlay">
            <p>Animate a hacer parte del equipo de softball femenil. Descubre la emoción del softball y forma parte de nuestro equipo.</p>
          </div>
        </div>
        <div className="image-container">
          <img src="imagenes/basquet.jpg" alt="Imagen 3" />
          <div className="image-overlay">
            <p>Únete al equipo de básquetbol. Vive la emoción del básquetbol y forma parte de una gran familia deportiva.</p>
          </div>
        </div>
        <div className="image-container">
          <img src="imagenes/volei.jpg" alt="Imagen 4" />
          <div className="image-overlay">
            <p>Descubre la emoción del voleibol. Únete a nuestro equipo y vive la pasión del voleibol en cada juego.</p>
          </div>
        </div>
        <div className="image-container">
          <img src="imagenes/musica.jpg" alt="Imagen 5" />
          <div className="image-overlay">
            <p>Descubre la emoción de la musica. Únete al taller de musica y vive la pasión de la guitarra en cada cancion.</p>
          </div>
        </div>
      </div>
       {/* Footer */}
       <div className="bg-blue-950 text-white text-center p-4">
        <h2 className="text-lg font-bold">Contáctanos</h2>
        <p>Dirección: Boulevard Tecnológico No. 150, Ex-ejido Chapultepec, 22780 Ensenada, B.C.</p>
        <p>Correo: informatec@ensenada.tecnm.mx</p>
        <p>© 2024 Todos los Derechos Reservados</p>
      </div>
    </div>
  );
};

export default Page;
