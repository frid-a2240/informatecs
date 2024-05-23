'use client'
import React, { useState} from 'react';
import { useEffect} from 'react';
import { dataBase } from '@/config/realTimeRegister';
import { ref, get, DataSnapshot } from 'firebase/database';
import Component from '../mostrarEventos/page';
import Link from "next/link";

const HomaPage = () => {
    const [publicaciones, setPublicaciones] = useState([]);
    const [refresh, setRefresh] = useState(false);

    useEffect(()=>{
        info();
    },[refresh]);

    const info = () => {
        const ruta = ref(dataBase, "Publicaciones");
         get(ruta).then((snapshot)=>{
            if (snapshot.exists) {
                const data = Object.entries(snapshot.val()).map(([key, value]) => ({
                    key,
                    ...value,
                }));
                setPublicaciones(data);
            }
        });
     };
        
     const refreshPage = () => {
        setRefresh(!refresh)
     }

     const handleDelete = (key) => {
        setPublicaciones((estudiante) => estudiante.filter((alumnos) => alumnos.key !== key));
      }

  return (
    <div> 
        <div>
      <div style={{ backgroundColor: '#4169e1', color: 'white', padding: '20px'}}>
        <h1 style={{ margin: '0', fontSize: '2em' }}>INFORMATEC</h1>
      </div>
      <div style={{ backgroundColor: '#4169e1', color: 'white', padding: '10px', marginBottom: '20px' }}>
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
      </div>
        {
            publicaciones.map((e, key)=>( 
                <div key={key} style={{ border: '4px solid transparent' }}>
                   <Component elemento={e} refreshPage={refreshPage} handleDelete={handleDelete}/>
                </div>
            ))
        }
    </div>
  )
};

export default HomaPage;
