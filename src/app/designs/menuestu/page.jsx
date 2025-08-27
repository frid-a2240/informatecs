"use client";
import { useSearchParams } from "next/navigation";
import NavbarEst from "@/app/components/navbares";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const fullName = searchParams.get("name");

  const studentData = {
    numeroControl: "21760457",
    carrera: "Sistemas",
  };

  return (
    <div className="dashboard-container">
      <NavbarEst />

      <div className="dashboard-main">
        <h1>¡Bienvenido, {fullName || "Estudiante"}!</h1>
        <p></p>

        <div className="student-card">
          <div className="student-card-header">Información del Estudiante</div>

          <div className="student-card-content">
            <div className="student-info">
              <span>Número de Control</span>
              <span>{studentData.numeroControl}</span>
            </div>

            <div className="student-info">
              <span>Carrera</span>
              <span>{studentData.carrera}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
