"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import NavbarEst from "@/app/components/navbares";
import "./perfil.css";

// Definición de un tipo de datos para mayor claridad y seguridad
// Aunque no es TypeScript, ayuda a entender la estructura esperada
const initialStudentData = {
  nombreCompleto: null,
  numeroControl: null,
  ubicacion: null,
  fotoUrl: null,
  fechaNacimiento: null,
  rfc: null,
  curp: null,
  telefono: null,
  email: null,
  carrera: null,
  carreraId: null,
};

export default function DashboardPage() {
  // 💡 Nota: La variable 'fullName' de useSearchParams no se está utilizando
  // para la lógica de carga, por lo que se puede eliminar si no es necesaria.
  // const searchParams = useSearchParams();
  // const fullName = searchParams.get("name");

  const [studentData, setStudentData] = useState(initialStudentData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Nuevo estado para manejo de errores

  // Función para obtener los datos, encapsulada con useCallback
  const fetchStudentData = useCallback(() => {
    try {
      const savedData = localStorage.getItem("studentData");
      if (savedData) {
        const data = JSON.parse(savedData);
        setStudentData(data);
      } else {
        // Si no hay datos, mostrar un mensaje claro
        setError(
          "No se encontraron datos de estudiante en el almacenamiento local."
        );
      }
    } catch (err) {
      console.error("Error al obtener o parsear datos del estudiante:", err);
      setError("Error al procesar la información del estudiante.");
      // Asegurarse de limpiar datos si hay un error de parseo grave
      setStudentData(initialStudentData);
    } finally {
      setLoading(false);
    }
  }, []); // Dependencias vacías: solo se define una vez

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  // Desestructuración para facilitar el uso en el JSX
  const {
    nombreCompleto,
    numeroControl,
    ubicacion,
    fotoUrl,
    fechaNacimiento,
    rfc,
    curp,
    telefono,
    email,
    carrera,
    carreraId,
  } = studentData;

  // --- Renderizado Condicional ---

  if (loading) {
    return (
      <div className="perfil-container perfil-centered">
        {/* Usar una clase para centrar el mensaje de carga */}
        <div className="perfil-loading">Cargando información del perfil...</div>
      </div>
    );
  }

  // Opcional: Mostrar un mensaje si hay error o no hay datos cargados
  if (error) {
    return (
      <div className="perfil-container perfil-centered">
        <div className="perfil-error">{error}</div>
      </div>
    );
  }

  // Definir una constante para el valor por defecto si no existe el dato
  const defaultText = "No disponible";

  // Función auxiliar para renderizar una línea de información si el valor existe
  const InfoLine = ({ label, value }) => {
    if (!value) return null;
    return (
      <p>
        <strong>{label}:</strong> {value}
      </p>
    );
  };

  return (
    <div className="perfil-container">
      <NavbarEst />

      <div className="perfil-card">
        {/* Encabezado */}
        <div className="perfil-encabezado">
          <img
            className="perfil-foto"
            src={fotoUrl || "/imagenes/logoelegantee.png"}
            alt="Foto del estudiante"
            onError={(e) => {
              // Manejo de error de imagen: si la URL falla, usa el logo
              e.currentTarget.onerror = null; // Evita bucle infinito
              e.currentTarget.src = "/imagenes/logoelegantee.png";
            }}
          />
          <div className="perfil-textos">
            <div className="perfil-bienvenida">Bienvenid@</div>
            <div className="perfil-nombre">{nombreCompleto || defaultText}</div>
            <div className="perfil-ubicacion">{ubicacion || ""}</div>
          </div>
        </div>

        {/* Información Personal */}
        <div className="perfil-right">
          <div className="perfil-coleccion-title">Información Personal</div>
          <p>
            <strong>Número de Control:</strong> {numeroControl || defaultText}
          </p>
          <InfoLine label="Nombre Completo" value={nombreCompleto} />
          <InfoLine label="Fecha de Nacimiento" value={fechaNacimiento} />
          <InfoLine label="RFC" value={rfc} />
          <InfoLine label="CURP" value={curp} />
          <InfoLine label="Teléfono" value={telefono} />
          <InfoLine label="Email" value={email} />
        </div>

        {/* Información Académica */}
        <div className="perfil-right">
          <div className="perfil-coleccion-title">Información Académica</div>
          <p>
            <strong>Carrera:</strong> {carrera || "Sin carrera asignada"}
          </p>
          <InfoLine label="ID Carrera" value={carreraId} />
        </div>
      </div>
    </div>
  );
}
