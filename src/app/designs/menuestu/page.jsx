"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import NavbarEst from "@/app/components/navbares";
import "./perfil.css";

export default function DashboardPage() {
  const searchParams = useSearchParams();

  const fullName = searchParams.get("name");
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedData = localStorage.getItem("studentData");
    if (savedData) {
      try {
        setStudentData(JSON.parse(savedData));
      } catch (error) {
        console.error("Error al parsear datos del estudiante:", error);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="perfil-right">Cargando información...</div>;
  }

  return (
    <div className="perfil-container">
      <NavbarEst />

      <div className="perfil-card">
        {/* Encabezado */}
        <div className="perfil-encabezado">
          <img
            className="perfil-foto"
            src={studentData?.fotoUrl || "/imagenes/logoelegantee.png"}
            alt="Foto del estudiante"
          />
          <div className="perfil-textos">
            <div className="perfil-bienvenida">Bienvenid@</div>
            <div className="perfil-nombre">
              {studentData?.nombreCompleto || "Estudiante"}
            </div>
            <div className="perfil-ubicacion">
              {studentData?.ubicacion || ""}
            </div>
          </div>
        </div>

        {/* Información Personal */}
        <div className="perfil-right">
          <div className="perfil-coleccion-title">Información Personal</div>
          <p>
            <strong>Número de Control:</strong>{" "}
            {studentData?.numeroControl || "No disponible"}
          </p>
          <p>
            <strong>Nombre Completo:</strong>{" "}
            {studentData?.nombreCompleto || "No disponible"}
          </p>
          {studentData?.fechaNacimiento && (
            <p>
              <strong>Fecha de Nacimiento:</strong>{" "}
              {studentData.fechaNacimiento}
            </p>
          )}
          {studentData?.rfc && (
            <p>
              <strong>RFC:</strong> {studentData.rfc}
            </p>
          )}
          {studentData?.curp && (
            <p>
              <strong>CURP:</strong> {studentData.curp}
            </p>
          )}
          {studentData?.telefono && (
            <p>
              <strong>Teléfono:</strong> {studentData.telefono}
            </p>
          )}
          {studentData?.email && (
            <p>
              <strong>Email:</strong> {studentData.email}
            </p>
          )}
        </div>

        {/* Información Académica */}
        <div className="perfil-right">
          <div className="perfil-coleccion-title">Información Académica</div>
          <p>
            <strong>Carrera:</strong>{" "}
            {studentData?.carrera || "Sin carrera asignada"}
          </p>
          {studentData?.carreraId && (
            <p>
              <strong>ID Carrera:</strong> {studentData.carreraId}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
