"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "@/app/components/footer";
import TopBar from "@/app/components/topbar";
import Navbar from "@/app/components/navbar";
import styles from "./style.css";
const Page = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
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

      <div className="content-container">
        {data.map((element) => (
          <div key={element.id} className="event-block">
            <p className="title">{element.titulo}</p>
            <p className="description">{element.descripcion}</p>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default Page;
