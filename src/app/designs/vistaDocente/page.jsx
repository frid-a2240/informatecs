"use client";

import { useState } from "react";
import NavbarEst from "@/app/components/navbares";
import styles from "./inicio.css";
export default function WelcomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div>
      <h1>¡Bienvenido a tu panel!</h1>
      <p>
        En este portal podrás verificar toda tu información personal y académica
        antes de realizar tu inscripción a cualquier evento institucional. Esta
        revisión te permitirá asegurarte de que cumples con los requisitos
        necesarios para participar, evitando inscripciones en actividades para
        las cuales no estás elegible. Te invitamos a consultar cuidadosamente
        tus datos y confirmar que todo esté correcto, garantizando así un
        proceso de registro eficiente y sin inconvenientes. ¡Disfruta de la
        experiencia y participa en los eventos que mejor se ajusten a tu perfil
        académico!
      </p>
    </div>
  );
}
