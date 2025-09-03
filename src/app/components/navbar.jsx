import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <div className="navbar__logo"></div>

        <button
          className="navbar__toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>

        <ul className={`navbar__menu ${isOpen ? "navbar__menu--open" : ""}`}>
          <li>
            <Link href="/" className="navbar__link">
              INICIO
            </Link>
          </li>
          <li>
            <Link href="/designs/vistaEventos" className="navbar__link">
              EVENTOS
            </Link>
          </li>
          <li>
            <Link href="/vistaExtraescolares" className="navbar__link">
              EXTRAESCOLARES
            </Link>
          </li>
          <li>
            <Link href="/vistaClub" className="navbar__link">
              CLUBS
            </Link>
          </li>
          <li>
            <Link href="/VistaHorarios" className="navbar__link">
              HORARIOS
            </Link>
          </li>
          <li>
            <Link href="/vistaCalendario" className="navbar__link">
              CALENDARIO
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
