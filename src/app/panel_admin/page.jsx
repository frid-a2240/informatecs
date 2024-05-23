'use client'
import React, { useState } from 'react';
import { dataBase } from '@/config/realTimeRegister';
import { ref, push, set } from 'firebase/database';
import Link from 'next/link';

const HomaPage = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [numControl, setNumControl] = useState("");
  const [extraescolar, setExtraescolar] = useState("");

  const obtenerData = (e) => {
    e.preventDefault();
    const ruta = ref(dataBase, "Estudiantes");
    const espacio = push(ruta);
    set(espacio, {
      nombre: nombre,
      apellido: apellido,
      numControl: numControl,
      extraescolar: extraescolar
    }).then(() => {
      alert("Datos ingresados correctamente.");
      setNombre("");
      setApellido("");
      setNumControl("");
      setExtraescolar("");
      e.target.reset();
    });
  }

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'adminITE' && password === 'tecnologico123') {
      window.location.href = '../';
    } else {
      setError('Nombre de usuario o contraseña incorrectos');
    }
  };

  return (
    <div>
      <div style={{ backgroundColor: '#4169e1', color: 'white', padding: '20px' }}>
        <h1 style={{ margin: '0', fontSize: '2em' }}>INFORMATEC</h1>
      </div>
      <div style={{ backgroundColor: '#4169e1', color: 'white', padding: '10px' }}>
        <button style={{ backgroundColor: '#4169e1', color: 'white', padding: '10px', borderRadius: '5px', border: 'none', marginRight: '50px' }}>
         
        </button>
        <button style={{ backgroundColor: '#4169e1', color: 'white', padding: '10px', borderRadius: '5px', border: 'none', marginRight: '50px' }}>
          
        </button>
        <button style={{ backgroundColor: '#4169e1', color: 'white', padding: '10px', borderRadius: '5px', border: 'none', marginRight: '50px' }}>
         
        </button>
        <button style={{ backgroundColor: '#4169e1', color: 'white', padding: '10px', borderRadius: '5px', border: 'none', marginRight: '50px' }}>
          
        </button>
        <button style={{ backgroundColor: '#4169e1', color: 'white', padding: '10px', borderRadius: '5px', border: 'none', marginRight: '50px' }}>
          
        </button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
        <div style={{ maxWidth: '400px', textAlign: 'center' }}>
          <h2>Formulario Estudiante</h2>
          <form onSubmit={obtenerData} style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ marginBottom: '15px' }}>
              <input
                onChange={(e) => setNombre(e.target.value)}
                type="text"
                placeholder='Nombre'
                value={nombre}
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', marginBottom: '10px' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <input
                onChange={(e) => setApellido(e.target.value)}
                type="text"
                placeholder='Apellido'
                value={apellido}
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', marginBottom: '10px' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <input
                onChange={(e) => setNumControl(e.target.value)}
                type="text"
                placeholder='N. Control'
                value={numControl}
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', marginBottom: '10px' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <input
                onChange={(e) => setExtraescolar(e.target.value)}
                type="text"
                placeholder='Act. Extraescolar'
                value={extraescolar}
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', marginBottom: '10px' }}
              />
            </div>
            <button type="submit" style={{ width: '100%', backgroundColor: '#4169e1', color: 'white', padding: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer', marginBottom: '10px' }}>Aceptar</button>
          </form>
        </div>
        <div style={{ maxWidth: '400px', textAlign: 'center' }}>
          <h2>Formulario Administrador</h2>
          <form onSubmit={handleSubmit} style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>Nombre de usuario:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Contraseña:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
            </div>
            <button type="submit" style={{ width: '100%', backgroundColor: '#4169e1', color: 'white', padding: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>Iniciar sesión</button>
            {error && <p style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>{error}</p>}
          </form>
          <p style={{ textAlign: 'center', marginTop: '20px' }}>¿Olvidaste tu contraseña? <Link href="/recover-password" style={{ color: '#4169e1' }}>Recuperar contraseña</Link></p>
        </div>
      </div>
    </div>
  );
}

export default HomaPage;