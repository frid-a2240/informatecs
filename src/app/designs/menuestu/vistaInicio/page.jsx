"use client";
import "@/styles/alumno/inicio.css";
export default function WelcomePage() {
  return (
    <div className="dashboard-container">
      <main className="dashboard-main welcome-main">
        <div className="welcome-card">
          <h1 className="welcome-title">¡Bienvenido a tu panel!</h1>
          <p className="welcome-text">
            En este portal podrás verificar toda tu información personal y
            académica antes de realizar tu inscripción a cualquier evento
            institucional. Esta revisión te permitirá asegurarte de que cumples
            con los requisitos necesarios para participar, evitando
            inscripciones en actividades para las cuales no estás elegible. Te
            invitamos a consultar cuidadosamente tus datos y confirmar que todo
            esté correcto, garantizando así un proceso de registro eficiente y
            sin inconvenientes. ¡Disfruta de la experiencia y participa en los
            eventos que mejor se ajusten a tu perfil académico!
          </p>
        </div>
      </main>
    </div>
  );
}
