"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import TopBar from "../components/topbar";

const Page = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Simulamos datos de ejemplo en lugar de Firebase
    const datosDeEjemplo = [
      {
        id: 1,
        titulo: "Evento de Música 🎶",
        descripcion: "Un concierto lleno de energía con bandas locales.",
      },
      {
        id: 2,
        titulo: "Torneo de Ajedrez ♟️",
        descripcion:
          "Competencia abierta para estudiantes y público en general.",
      },
      {
        id: 3,
        titulo: "Exposición de Arte 🎨",
        descripcion: "Muestra de obras de arte realizadas por alumnos.",
      },
    ];
    setData(datosDeEjemplo);
  }, []);

  return (
    <div>
      <TopBar />
      <section className="main-title-section">
        <h1>INFORMATEC</h1>
      </section>

      <Navbar />
      {/* Contenido principal */}
      <div className="w-1/2 mx-auto mt-6">
        {data.map((element) => (
          <div key={element.id} className="mb-6 border-b border-gray-300 pb-4">
            <p className="text-xl font-bold text-blue-950">{element.titulo}</p>
            <p className="text-gray-700">{element.descripcion}</p>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Page;
