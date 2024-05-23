'use client'
import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import Link from "next/link";
import { useState } from 'react';
const localizer = momentLocalizer(moment);

const events = [
  {
    title: 'Dia del Maestro',
    start: new Date(2024, 4, 15),
    end: new Date(2024, 4, 15),
  },
  {
    title: 'Dia del estudiante',
    start: new Date(2024, 4, 23),
    end: new Date(2024, 4, 23),
  },
  {
    title: 'Fin del Curso Escolar',
    start: new Date(2024, 4, 31),
    end: new Date(2024, 4, 31),
  },
  {
    title: 'Dia del Padre',
    start: new Date(2024, 5, 16),
    end: new Date(2024, 5, 16),
  },
  {
    title: 'Inicio Curso Escolar',
    start: new Date(2024, 7, 22),
    end: new Date(2024, 7, 22),
  },
];

const Page = () => {
  const [currentView, setCurrentView] = useState('month');
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
      <div style={{ height: '500px' }}>
      <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ margin: '50px' }}
          views={['month', 'week', 'day', 'agenda']}
          view={currentView} // Establecer la vista actual del calendario
          onView={(view) => setCurrentView(view)} // Manejar el cambio de vista del calendario
        />
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
