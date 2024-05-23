'use client'
import React, { useState, useEffect } from 'react';
import { dataBase } from '@/config/realTimeRegister';
import { ref, get } from 'firebase/database';
import Component from '../component/Component';
import Link from "next/link";

const HomePage = () => {
    const [registros, setRegistros] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        obtenerRegistros();
    }, []);

    const obtenerRegistros = () => {
        const ruta = ref(dataBase, "Estudiantes");
        get(ruta).then((snapshot) => {
            if (snapshot.exists()) {
                const data = Object.entries(snapshot.val()).map(([key, value]) => ({
                    key,
                    ...value,
                }));
                setRegistros(data);
            }
        });
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filtrarRegistros = (registros) => {
        return registros.filter(registro => registro.numControl.includes(searchQuery));
    };

    const registrosFiltrados = filtrarRegistros(registros);

    return (
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
            </div>
            <div style={{ margin: 'auto', maxWidth: '600px', textAlign: 'center' }}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Buscar por número de control"
                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', marginBottom: '20px' }}
                />
            </div>
            {
                registrosFiltrados.map((registro, index) => (
                    <div key={index} style={{ border: '4px solid transparent' }}>
                        <Component elemento={registro} />
                    </div>
                ))
            }
        </div>
    );
};

export default HomePage;
