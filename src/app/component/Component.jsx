'use client'
import { ref, update, remove } from "firebase/database";
import { dataBase } from "@/config/realTimeRegister";
import { useState } from "react";
import Link from "next/link";

const Component = ({ elemento, refreshPage, handleDelete }) => {
  const [newNombre, setNewNombre] = useState(elemento.nombre);
  const [newApellido, setNewApellido] = useState(elemento.apellido);
  const [newNumControl, setNewNumControl] = useState(elemento.numControl);
  const [newActExtra, setNewActExtra] = useState(elemento.extraescolar);
  const [editar, setEditar] = useState(false);

  const actualizar = () => {
    const ruta = ref(dataBase, `Estudiantes/${elemento.key}`);
    update(ruta, {
      nombre: newNombre,
      apellido: newApellido,
      numControl: newNumControl,
      extraescolar: newActExtra,
    }).then(() => {
      alert("Se ha actualizado la información");
      setEditar(false)
      refreshPage()
    });
  };

  const eliminar = () => {
    const ruta = ref(dataBase, `Estudiantes/${elemento.key}`)
    remove(ruta).then(()=>{alert("Se eliminó el registro");
    handleDelete(elemento.key);
})
  }

  handleDelete = () => {
    console.log("hola");
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
              onChange={(e) => setNewNombre(e.target.value)}
              placeholder="Ingresa el nuevo nombre"
              type="text"
              value={newNombre}
              style={{ width:'50%', padding: '8px', borderRadius: '3px', border: 'none', background: '#f9f9f9', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input
              onChange={(e) => setNewApellido(e.target.value)}
              placeholder="Ingresa el nuevo apellido"
              type="text"
              value={newApellido}
              style={{ width:'50%', padding: '8px', borderRadius: '3px', border: 'none', background: '#f9f9f9', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input
              onChange={(e) => setNewNumControl(e.target.value)}
              placeholder="Ingresa el nuevo núm. Control"
              type="text"
              value={newNumControl}
              style={{ width:'50%', padding: '8px', borderRadius: '3px', border: 'none', background: '#f9f9f9', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input
              onChange={(e) => setNewActExtra(e.target.value)}
              placeholder="Ingresa el nueva act. extraescolar"
              type="text"
              value={newActExtra}
              style={{ width:'50%', padding: '8px', borderRadius: '3px', border: 'none', background: '#f9f9f9', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <button onClick={edicion} style={{ marginRight: '10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '3px', padding: '8px 16px', cursor: 'pointer' }}>Cancelar</button>
            <button onClick={actualizar} style={{ marginRight: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '3px', padding: '8px 16px', cursor: 'pointer' }}>Actualizar</button>
            <button onClick={eliminar} handleDelete={handleDelete}style={{ backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '3px', padding: '8px 16px', cursor: 'pointer' }}>Eliminar</button>
          </div>
        </div>
      ) : (
        <div>
          <p>Nombre: {elemento.nombre}</p>
          <p>Núm Control: {elemento.numControl}</p>
          <p>Apellido: {elemento.apellido}</p>
          <p>Act. Extraescolar: {elemento.extraescolar}</p>
          <button onClick={edicion} style={{ backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '3px', padding: '8px 16px', cursor: 'pointer' }}>Actualizar</button>
        </div>
      )}
    </div>
  );
}
export default Component;