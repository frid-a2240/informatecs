'use client'
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { ref, get } from 'firebase/database';
import { dataBase } from '@/config/realTimeRegister';

const Page = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    const reference = ref(dataBase, "Publicaciones")
    get(reference).then((snapshot) => {
      if (snapshot.exists()) {
        const data = Object.entries(snapshot.val()).map(([key, value]) => ({
          key,
          ...value,
        }));
        setData(data);
      }
    })
  }

  return (
    <div>
      {/* Divs superiores */}
      <div className="bg-blue-950 h-16 w-full flex justify-between items-center px-4">
        <div className="flex">
          {/* Aquí puedes agregar la imagen */}
          <img src="imagenes/imaCorreo.jpg" alt="Logo" className="mr-2 pl-16" />
          <span className="text-white pl-2">informatec@ensenada.tecnm.mx</span>
        </div>
        <div className="flex items-right pr-16">
          {/* Aquí puedes agregar la imagen */}
          <img src="imagenes/imaInsta.jpg" alt="Logo" className="mr-2 pr-3" />
          <img src="imagenes/imaTwitter.jpg" alt="Logo" className="mr-2" />
        </div>
      </div>
      {/* Div blanco con texto "INFORMATEC" */}
      <div className="bg-white text-center p-4">
        <h1 className="text-yellow-500 text-4xl">INFORMATEC</h1>
      </div>
      <div className="bg-blue-950 h-24 w-full text-center pt-8 items-center px-4 space-x-12">
        <Link href='/vistaInicio' className="text-white px-4 py-8 hover:bg-yellow-400 transition-all duration-500">INICIO</Link>
        <Link href='/vistaNovedades' className="text-white px-4 py-8 hover:bg-yellow-400 transition-all duration-500">EVENTOS</Link>
        <Link href='/vistaExtraescolares' className="text-white px-4 py-8 hover:bg-yellow-400 transition-all duration-500">EXTRAESCOLARES</Link>
        <Link href='/vistaClub' className="text-white px-4 py-8 hover:bg-yellow-400 transition-all duration-500">CLUBS</Link>
        <Link href='vistaCalendario' className="text-white px-4 py-8 hover:bg-yellow-400 transition-all duration-500">CALENDARIO</Link>
        <Link href='/panel_admin' className="bg-yellow-500 text-xl text-white px-8 py-5 rounded-full hover:bg-yellow-600 transition-all duration-300">Registrarse</Link>
      </div>

      {/* Contenido agregado, justificado a la izquierda y en la mitad de la pantalla */}
      <div className="w-1/2 mx-auto">
        {
          data.map((element, key) => (
            <div key={key} className="mb-4">
              <p>{element.titulo}</p>
              <p>{element.descripcion}</p>
            </div>
          ))
        }
      </div>
       {/* Footer */}
       <div className="bg-blue-950 text-white text-center p-4">
        <h2 className="text-lg font-bold">Contáctanos</h2>
        <p>Dirección: Boulevard Tecnológico No. 150, Ex-ejido Chapultepec, 22780 Ensenada, B.C.</p>
        <p>Correo: informatec@ensenada.tecnm.mx</p>
        <p>© 2024 Todos los Derechos Reservados</p>
      </div>
    </div>
  )
}

export default Page;