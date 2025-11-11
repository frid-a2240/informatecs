"use client";
import React from "react";
import { FaFacebookF, FaXTwitter, FaLinkedinIn } from "react-icons/fa6";
import { GraduationCap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Columna 1 */}
        <div className="footer-section">
          <div className="footer-logo">
            <GraduationCap className="footer-icon" />
            <span className="footer-title">ITE</span>
          </div>
          <p className="footer-text">Instituto Tecnológico de Ensenada</p>

          <div className="footer-social">
            <h3 className="footer-subtitle">Síguenos</h3>
            <div className="footer-social-icons">
              <a href="#" className="social-circle">
                <FaFacebookF />
              </a>
              <a href="#" className="social-circle">
                <FaXTwitter />
              </a>
              <a href="#" className="social-circle">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>

        {/* Columna 2 */}
        <div className="footer-section">
          <h3 className="footer-subtitle">Enlaces</h3>
          <ul className="footer-links">
            <li>
              <a href="/">Inicio</a>
            </li>
            <li>
              <a href="/actividades">Actividades</a>
            </li>
            <li>
              <a href="/eventos">Eventos</a>
            </li>
          </ul>
        </div>

        {/* Columna 3 */}
        <div className="footer-section">
          <h3 className="footer-subtitle">Contacto</h3>
          <ul className="footer-contact">
            <li>Ensenada, B.C.</li>
            <li>
              <a href="mailto:info@ite.edu.mx">info@ite.edu.mx</a>
            </li>
            <li>(646) 123-4567</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Instituto Tecnológico de Ensenada. Todos
        los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
