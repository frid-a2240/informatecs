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
            <Link href="/" className="navbar__link active">
              INICIO
            </Link>
          </li>
          <li>
            <Link href="/designs/vistaEventos" className="navbar__link active">
              EVENTOS
            </Link>
          </li>
          <li>
            <Link href="/vistaExtraescolares" className="navbar__link active">
              EXTRAESCOLARES
            </Link>
          </li>
          <li>
            <Link href="/vistaClub" className="navbar__link active">
              CLUBS
            </Link>
          </li>
          <li>
            <Link href="/VistaHorarios" className="navbar__link active">
              HORARIOS
            </Link>
          </li>
          <li>
            <Link href="/designs/vistaLogin" className="navbar__link active">
              INICIAR SESION
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
