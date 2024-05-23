'use client'
import { ref, update, remove } from "firebase/database";
import { dataBase } from "@/config/realTimeRegister";
import { useState } from "react";
//import Link from "next/link";

const Component = ({ elemento, refreshPage, handleDelete }) => {
  const [newTitulo, setNewTitulo] = useState(elemento.titulo);
  const [newDescripcion, setNewDescripcion] = useState(elemento.descripcion);
  const [editar, setEditar] = useState(false);

  const actualizar = () => {
    const ruta = ref(dataBase, `Publicaciones/${elemento.key}`);
    update(ruta, {
      titulo: newTitulo,
      descripcion: newDescripcion,
    }).then(() => {
      alert("Se ha actualizado la información");
      setEditar(false)
      refreshPage()
    });
  };

  const eliminar = () => {
    const ruta = ref(dataBase, `Publicaciones/${elemento.key}`)
    remove(ruta).then(()=>{alert("Se eliminó el post");
    handleDelete(elemento.key);
})
  }

  const edicion = () => {
    setEditar(!editar);
  };

  return (
    <div style={{ width:'50%', margin: 'auto', padding: '10px', borderRadius: '5px', boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)', background: 'linear-gradient(to right, #ffffff, #f0f0f0)' }}>
      {editar ? (
        <div>
          <div style={{ marginBottom: '10px' }}>
            <input
              onChange={(e) => setNewTitulo(e.target.value)}
              placeholder="Ingresa el nuevo título"
              type="text"
              value={newTitulo}
              style={{ width:'50%', padding: '8px', borderRadius: '3px', border: 'none', background: '#f9f9f9', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input
              onChange={(e) => setNewDescripcion(e.target.value)}
              placeholder="Ingresa la nueva descripción"
              type="text"
              value={newDescripcion}
              style={{ width:'50%', padding: '8px', borderRadius: '3px', border: 'none', background: '#f9f9f9', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <button onClick={edicion} style={{ marginRight: '10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '3px', padding: '8px 16px', cursor: 'pointer' }}>Cancelar</button>
            <button onClick={actualizar} style={{ marginRight: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '3px', padding: '8px 16px', cursor: 'pointer' }}>Actualizar</button>
            <button onClick={eliminar} style={{ backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '3px', padding: '8px 16px', cursor: 'pointer' }}>Eliminar</button>
          </div>
        </div>
      ) : (
        <div>
          <p>Título: {elemento.titulo}</p>
          <p>Descripción: {elemento.descripcion}</p>
          <button onClick={edicion} style={{ backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '3px', padding: '8px 16px', cursor: 'pointer' }}>Actualizar</button>
        </div>
      )}
    </div>
  );
}
export default Component;