'use client'
import React, { useState} from 'react';
import { dataBase } from '@/config/realTimeRegister';
import { ref, push, set } from 'firebase/database';
import Link from "next/link";

const HomaPage = () => {
  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")
  const [numControl, setNumControl] = useState("")
  const [extraescolar, setExtraescolar] = useState("")

  const obtenerData = (e) => {
    e.preventDefault();
      const ruta = ref(dataBase, "Estudiantes");
      const espacio = push(ruta);
      set(espacio, {
        nombre: nombre, 
        apellido: apellido, 
        numControl:numControl, 
        extraescolar:extraescolar}
      ).then(()=>{alert("Datos ingresados correctamente.")
      setNombre("");
      setApellido("");
      setNumControl("");
      setExtraescolar("");
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
      <div style={{ maxWidth: '400px', margin: 'auto', marginTop: '20px', textAlign: 'center' }}>
        <form onSubmit={obtenerData} style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ marginBottom: '15px' }}>
            <input
              onChange={(e)=>setNombre(e.target.value)}
              type="text"
              placeholder='Nombre'
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', marginBottom: '10px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <input
              onChange={(e)=>setApellido(e.target.value)}
              type="text"
              placeholder='Apellido'
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', marginBottom: '10px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <input
              onChange={(e)=>setNumControl(e.target.value)}
              type="text"
              placeholder='N. Control'
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', marginBottom: '10px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <input
              onChange={(e)=>setExtraescolar(e.target.value)}
              type="text"
              placeholder='Act. Extraescolar'
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', marginBottom: '10px' }}
            />
          </div>
          <button type="submit" style={{ width: '100%', backgroundColor: '#4169e1', color: 'white', padding: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer', marginBottom: '10px' }}>Aceptar</button>
        </form>
      </div>
    </div>
  );  
}  

export default HomaPage;