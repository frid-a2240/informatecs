"use client";
import React from "react";
import "./galeria.css"; // Nuevos estilos CSS para este diseño
import Navbar from "@/app/components/navbar";

// --- DATA: Array de Fotos Estudiantiles ---
const studentPhotos = [
  {
    id: 1,
    title: "Victoria en Ajedrez",
    year: "2024",
    imgUrl: "/assets/ajedrez.jpg",
    gridArea: "span 1 / span 2", // Ocupa 2 columnas
  },
  {
    id: 2,
    title: "Club de Programación",
    year: "2023",
    imgUrl: "/assets/robotica.jpg",
    gridArea: "span 2 / span 1", // Ocupa 2 filas
  },
  {
    id: 3,
    title: "Competencia de Baile",
    year: "2024",
    imgUrl: "/assets/baile.jpg",
    gridArea: "span 1 / span 1",
  },
  {
    id: 4,
    title: "Día de Ciencias",
    year: "2024",
    imgUrl: "/assets/ciencia.jpg",
    gridArea: "span 1 / span 2",
  },
  {
    id: 5,
    title: "Graduación ITE",
    year: "2023",
    imgUrl: "/assets/graduacion.jpg",
    gridArea: "span 2 / span 2", // Ocupa 2x2
  },
  // Añade más fotos aquí, variando gridArea para el efecto "roto"
];

// --- COMPONENTE PRINCIPAL DE REACT ---

const StudentPhotoGallery = () => {
  return (
    <section className="student-gallery-section">
      <h1 className="gallery-header-title">Archivo Fotográfico Estudiantil</h1>

      <div className="broken-grid-container">
        {studentPhotos.map((photo) => (
          <div
            key={photo.id}
            className="photo-card"
            // Asignamos el tamaño de la rejilla directamente
            style={{ gridArea: photo.gridArea }}
          >
            <img src={photo.imgUrl} alt={photo.title} className="photo-image" />

            {/* Pie de foto flotante (Overlay) */}
            <div className="photo-caption-overlay">
              <p className="caption-year">{photo.year}</p>
              <h3 className="caption-title">{photo.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StudentPhotoGallery;
