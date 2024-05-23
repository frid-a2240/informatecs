"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';

const HomePage = () => {
  useEffect(() => {
    let index = 0;
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;

    const showSlide = (n) => {
      slides.forEach((slide, i) => {
        slide.style.display = i === n ? 'block' : 'none';
      });
    };

    const nextSlide = () => {
      index = (index + 1) % totalSlides;
      showSlide(index);
    };

    showSlide(index);
    const interval = setInterval(nextSlide, 3000);

    return () => clearInterval(interval);
  }, []);

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
        <Link href='/vistaNovedades' className="text-white px-4 py-8 hover:bg-yellow-400 transition-all duration-500">EVENTOS</Link>
        <Link href='/vistaExtraescolares' className="text-white px-4 py-8 hover:bg-yellow-400 transition-all duration-500">EXTRAESCOLARES</Link>
        <Link href='/vistaClub' className="text-white px-4 py-8 hover:bg-yellow-400 transition-all duration-500">CLUBS</Link>
        <Link href='/vistaCalendario' className="text-white px-4 py-8 hover:bg-yellow-400 transition-all duration-500">CALENDARIO</Link>
        <Link href='/panel_admin' className="bg-yellow-500 text-xl text-white px-8 py-5 rounded-full hover:bg-yellow-600 transition-all duration-300">Registrarse</Link>
      </div>
      <div className="relative">
        <img src="imagenes/imaUniversidad(2).png" className="w-screen h-screen object-cover" />
        <div className="absolute top-0 left-0 flex items-center justify-start w-full h-full">
          <div className="text-white text-left ml-8 pl-10">
            <h1 className="text-4xl md:text-6xl lg:text-8xl pb-3">Instituto <br/>Tecnológico</h1>
            <span className="text-2xl md:text-4xl lg:text-6xl block text-yellow-400 pb-3">De Ensenada</span>
            <p>Te invitamos a participar en clubs, actividades extraescolares y eventos.</p>
          </div>
        </div>
      </div>
      {/* Sección de actividades extraescolares */}
      <div className="bg-gray-100 py-8 px-4 text-center">
        <h2 className="text-yellow-600 text-3xl font-bold mb-4">¿Ya te enteraste?</h2>
        <div className="flex flex-col md:flex-row justify-center items-center">
          <div className="text-left w-full md:w-1/2 md:max-w-md pl-8">
            <h3 className="text-xl font-semibold mb-2 pb-5">Actividades Extraescolares</h3>
            <p className="mb-4 text-base text-justify">
              En el Instituto Tecnológico de Ensenada, ofrecemos una variedad de actividades extraescolares diseñadas para enriquecer la experiencia educativa de nuestros estudiantes. 
              Además, organizamos eventos deportivos y culturales que te permitirán desarrollar tus habilidades y conocer a otros estudiantes con intereses similares. ¡Únete a nosotros y enriquece tu vida estudiantil!
            </p>
          </div>
          <div className="w-full md:w-1/2 md:max-w-md mt-4 md:mt-0 md:ml-4">
            <img src="imagenes/inie.jpg" alt="Actividades Extraescolares" className="object-cover w-full h-48 md:h-auto" />
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center mt-8">
        <div className="w-full md:w-1/2 md:max-w-md mt-4 md:mt-0 md:ml-4">
            <img src="imagenes/inia.jpg" alt="Eventos" className="object-cover w-full h-48 md:h-auto" />
          </div>
          <div className="text-left w-full md:w-1/2 md:max-w-md pl-8">
            <h3 className="text-xl font-semibold mb-2 pb-5">Eventos</h3>
            <p className="mb-4 text-base text-justify">
              ¡No te pierdas los emocionantes eventos que organizamos en el Instituto Tecnológico de Ensenada! Desde competencias deportivas hasta festivales culturales, siempre hay algo en lo que puedes participar. Estos eventos son una excelente oportunidad para divertirte, aprender cosas nuevas y hacer amigos. ¡Ven y sé parte de nuestras actividades, y vive la experiencia al máximo!
            </p>
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

export default HomePage;