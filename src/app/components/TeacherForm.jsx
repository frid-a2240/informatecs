import React from "react";
import { FaLock, FaChalkboardTeacher } from "react-icons/fa";

const TeacherForm = ({
  teacherId,
  setTeacherId,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  onSubmit,
}) => (
  <form onSubmit={onSubmit} className="login-form">
    <label className="login-label">
      <FaChalkboardTeacher className="inline mr-2" />
      Identificación del Maestro:
    </label>
    <div className="input-with-icon">
      <input
        type="text"
        className="login-input"
        value={teacherId}
        placeholder="Ingresa tu ID de maestro"
        onChange={(e) => setTeacherId(e.target.value)}
        required
      />
    </div>

    <label className="login-label">Contraseña:</label>
    <div className="input-with-icon password-input-container">
      <FaLock className="input-icon-left" />
      <input
        type={showPassword ? "text" : "password"}
        className="login-input with-left-icon"
        value={password}
        placeholder="Ingresa tu contraseña"
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </div>

    <button type="submit" className="submit-button teacher-button">
      Acceso Maestro
    </button>
  </form>
);

export default TeacherForm;
