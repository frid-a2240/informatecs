"use client";
import React, { useState, useMemo } from "react";
import { Calendar, List, User } from "lucide-react";
// Importamos el archivo CSS personalizado
// NOTA: Asegúrate de que este archivo CSS contenga todas las clases como .tab-button, .section-content-box, etc.
import "./intramuros.css";

// Componentes importados (asegúrate que las rutas sean correctas)

import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import IntramurosCalendar from "./IntramurosCalendar";
import IntramurosList from "./intramuroslist";

const IntramurosPage = () => {
  // Estado para la sección activa: 'calendario', 'actividades', 'contacto'
  const [seccionActiva, setSeccionActiva] = useState("calendario");

  const cambiarSeccion = (seccion) => {
    setSeccionActiva(seccion);
  };

  // Memoización del contenido para evitar re-renderizados innecesarios.
  const contenidoActivo = useMemo(() => {
    // Hemos eliminado el div 'section-header-group' vacío en las secciones que lo tenían.
    switch (seccionActiva) {
      case "calendario":
        return (
          <section id="calendario" className="intramuros-section">
            {/* El componente IntramurosCalendar ya incluye el encabezado */}
            <div className="section-content-box blue-border">
              <IntramurosCalendar />
            </div>
          </section>
        );

      case "actividades":
        return (
          <section id="actividades" className="intramuros-section">
            <div className="section-content-box yellow-border">
              <IntramurosList />
            </div>

            <div className="registration-note note-yellow-accent">
              <div className="note-content-group">
                <div className="note-icon-container">
                  {/* Reemplazar SVG inline con un componente Lucide o un SVG bien definido */}
                  <svg
                    className="note-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="note-text">
                    <strong>Nota:</strong> Cada actividad tiene su propio
                    proceso de inscripción. Haz clic en el botón "Inscribirme"
                    en la actividad que te interese para acceder al formulario
                    correspondiente o contacta directamente al coordinador.
                  </p>
                </div>
              </div>
            </div>
          </section>
        );

      case "contacto":
        return (
          <section id="contacto" className="intramuros-section">
            <div className="section-header-group">
              <div className="header-icon-wrapper">
                <div className="icon-circle icon-blue">
                  <User size={24} />
                </div>
                <h2 className="section-title">Información de Contacto</h2>
              </div>
              <p className="section-subtitle">
                Comunícate con los coordinadores para dudas, inscripciones y
                soporte.
              </p>
            </div>

            <div className="section-content-box blue-border">
              <div className="contact-grid">
                <div className="contact-card blue-border-light">
                  <div className="contact-card-header">
                    <div className="icon-circle icon-blue icon-small">
                      {/* Se mantiene el SVG para este ejemplo */}
                      <svg
                        className="contact-svg-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="card-title">Departamento de Deportes ITE</h3>
                  </div>
                  <p className="card-subtitle-contact">
                    Coordinación general de actividades intramuros
                  </p>
                  <div className="contact-details">
                    <p>
                      <strong>Email:</strong> deportes@ite.edu.mx
                    </p>
                    <p>
                      <strong>Teléfono:</strong> 646-XXX-XXXX
                    </p>
                    <p>
                      <strong>Horario:</strong> Lunes a Viernes 9:00 AM - 5:00
                      PM
                    </p>
                    <p>
                      <strong>Ubicación:</strong> Edificio de Servicios
                      Estudiantiles
                    </p>
                  </div>
                </div>

                <div className="contact-card yellow-border-light">
                  <div className="contact-card-header">
                    <div className="icon-circle icon-yellow icon-small">
                      <svg
                        className="contact-svg-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="card-title">Registro de Actividades</h3>
                  </div>
                  <p className="card-subtitle-contact">
                    Inscripciones y seguimiento de participantes
                  </p>
                  <div className="contact-details">
                    <p>
                      <strong>Email:</strong> registro.deportes@ite.edu.mx
                    </p>
                    <p>
                      <strong>Teléfono:</strong> 646-XXX-XXXX
                    </p>
                    <p>
                      <strong>Horario:</strong> Lunes a Viernes 8:00 AM - 3:00
                      PM
                    </p>
                    <p>
                      <strong>Ubicación:</strong> Oficina de Control Escolar
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  }, [seccionActiva]);

  return (
    <div className="intramuros-page-container">
      <Navbar />
      <div className="header-section">
        <div className="header-content-wrapper">
          {/* Se recomienda usar un componente Lucide en lugar de un span vacío para el ícono */}
          <h1 className="main-title">
            <span className="trophy-icon">🏆</span>
            Actividades Extracurriculares Intramuros ITE
          </h1>
          <p className="main-subtitle">
            Información centralizada sobre torneos, ligas y eventos deportivos
            internos del ITE
          </p>
        </div>
      </div>

      <div className="navigation-tabs-container">
        <div className="tabs-wrapper-outer">
          <div className="tabs-wrapper-inner">
            {/* 1. Botón de Calendario */}
            <button
              onClick={() => cambiarSeccion("calendario")}
              className={`tab-button ${
                seccionActiva === "calendario"
                  ? "tab-active-blue"
                  : "tab-inactive"
              }`}
            >
              <Calendar size={20} />
              Calendario
            </button>

            {/* 2. Botón de Actividades */}
            <button
              onClick={() => cambiarSeccion("actividades")}
              className={`tab-button ${
                seccionActiva === "actividades"
                  ? "tab-active-yellow"
                  : "tab-inactive"
              }`}
            >
              <List size={20} />
              Actividades
            </button>

            {/* 3. 🟢 CORRECCIÓN: Botón de Contacto Añadido 🟢 */}
            <button
              onClick={() => cambiarSeccion("contacto")}
              className={`tab-button ${
                seccionActiva === "contacto"
                  ? "tab-active-green" // Asumiendo un estilo para el contacto
                  : "tab-inactive"
              }`}
            >
              <User size={20} />
              Contacto
            </button>
          </div>
        </div>
      </div>

      <div className="content-container">{contenidoActivo}</div>

      <Footer />
    </div>
  );
};

export default IntramurosPage;
