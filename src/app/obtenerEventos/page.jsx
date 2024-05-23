'use client'
import { ref, push, set } from "firebase/database";
import { dataBase } from "@/config/realTimeRegister"; // Assuming you have a storage reference as well
import { useState } from "react";
import Link from "next/link";

const PostComponent = () => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const obtenerData = (e) => {
    e.preventDefault();
      const ruta = ref(dataBase, "Publicaciones");
      const espacio = push(ruta);
      set(espacio, {
        titulo: titulo,
      descripcion: descripcion,}
      ).then(()=>{alert("Datos ingresados correctamente.")
      setTitulo("");
      setDescripcion("");
      e.target.reset();
      });
  }

  return (
    <div>
      <div style={{ backgroundColor: '#4169e1', color: 'white', padding: '20px' }}>
        <h1 style={{ margin: '0', fontSize: '2em' }}>INFORMATEC</h1>
      </div>
      <div style={{ backgroundColor: '#4169e1', color: 'white', padding: '10px' }}>
        <button style={{ backgroundColor: '#4169e1', color: 'white', padding: '10px', borderRadius: '5px', border: 'none', marginRight: '50px' }}>
          <Link href="../" style={{ color: 'white', textDecoration: 'none' }}>Registrar Estudiantes</Link>
        </button>
        <button style={{ backgroundColor: '#4169e1', color: 'white', padding: '10px', borderRadius: '5px', border: 'none', marginRight: '50px' }}>
          <Link href="/pages" style={{ color: 'white', textDecoration: 'none' }}>Ver Registros</Link>
        </button>
        <button style={{ backgroundColor: '#4169e1', color: 'white', padding: '10px', borderRadius: '5px', border: 'none', marginRight: '50px' }}>
          <Link href="/obtenerEventos" style={{ color: 'white', textDecoration: 'none' }}>Publicar</Link>
        </button>
        <button style={{ backgroundColor: '#4169e1', color: 'white', padding: '10px', borderRadius: '5px', border: 'none', marginRight: '50px' }}>
          <Link href="/Eventos" style={{ color: 'white', textDecoration: 'none' }}>Ver Publicaciones</Link>
        </button>
        <button style={{ backgroundColor: '#4169e1', color: 'white', padding: '10px', borderRadius: '5px', border: 'none', marginRight: '50px' }}>
          <Link href="/vistaInicio" style={{ color: 'white', textDecoration: 'none' }}>Cerrar Sesión</Link>
        </button>
      </div>
      <div style={{ maxWidth: '600px', margin: 'auto', marginTop: '20px', textAlign: 'center' }}>
        <form onSubmit={obtenerData} style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ marginBottom: '15px' }}>
            <input
              onChange={(e) => setTitulo(e.target.value)}
              type="text"
              placeholder='Título'
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', marginBottom: '20px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <textarea
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder='Descripción'
              style={{ width: '100%', minHeight: '190px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', marginBottom: '20px', resize: 'vertical' }}
            />
          </div>
          <button type="submit" style={{ width: '100%', backgroundColor: '#4169e1', color: 'white', padding: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>Aceptar</button>
        </form>
      </div>
    </div>
  );    
};

export default PostComponent;