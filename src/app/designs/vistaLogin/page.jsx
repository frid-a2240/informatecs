"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaLock, FaChalkboardTeacher } from "react-icons/fa";
import { useAuth } from "@/app/components/hooks/authHandlers";
import "./login.css";

// Importar formularios

import TeacherForm from "@/app/components/TeacherForm";
import AdminForm from "@/app/components/AdminForm";
import RegisterForm from "@/app/components/RegisterForm";
import LoginForm from "@/app/components/loginform";
import AskEmailForm from "@/app/components/AskEmailForm";
import VerifyCodeForm from "@/app/components/hooks/VerifyCodeForm";
import UpdatePasswordForm from "@/app/components/UpdatePasswordForm";
import SchoolRainEffect from "@/app/components/SchoolRainEffect";

const LoginPage = () => {
  const router = useRouter();

  const [step, setStep] = useState("login");
  const [matricula, setMatricula] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [teacherId, setTeacherId] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState("");
  const [adminUser, setAdminUser] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const [particles, setParticles] = useState([]);

  const {
    handleLogin,
    handleRegister,
    handleSendCode,
    handleVerifyCode,
    handleUpdatePassword,
  } = useAuth(setStep, setFullName, setError, setStudentData);

  useEffect(() => {
    const generatedParticles = [...Array(20)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${5 + Math.random() * 10}s`,
    }));
    setParticles(generatedParticles);
  }, []);

  const resetForm = () => {
    setMatricula("");
    setPassword("");
    setTeacherId("");
    setAdminUser("");
    setAdminPassword("");
    setEmail("");
    setCode("");
    setNewPassword("");
    setError("");
    setShowPassword(false);
  };

  // ----------------------
  // Funciones de envío
  // ----------------------
  const onLoginSubmit = (e) => {
    e.preventDefault();
    if (!matricula || !password)
      return setError("Escribe matrícula y contraseña");
    handleLogin(e, matricula, password);
  };
  const onRegisterSubmit = (e) => {
    e.preventDefault();
    if (!matricula || !password)
      return setError("Escribe matrícula y contraseña");
    if (password !== "123456")
      return setError('La contraseña para registro debe ser "123456"');
    handleRegister(e, matricula, password);
  };
  const onTeacherSubmit = (e) => {
    e.preventDefault();
    if (!teacherId || !password)
      return setError("Escribe identificación y contraseña de maestro");
    setError("Funcionalidad de maestros en desarrollo");
  };
  const onAdminSubmit = (e) => {
    e.preventDefault();
    if (!adminUser || !adminPassword)
      return setError("Escribe usuario y contraseña de administrador");
    if (adminUser === "NodalTec" && adminPassword === "eventosadmin2025")
      router.push("/designs/menuadmin");
    else setError("Credenciales de administrador incorrectas");
  };
  const onSendCode = (e) => {
    e.preventDefault();
    handleSendCode(e, matricula, email);
  };
  const onVerifyCode = (e) => {
    e.preventDefault();
    handleVerifyCode(e, matricula, code);
  };
  const onUpdatePassword = (e) => {
    e.preventDefault();
    handleUpdatePassword(e, matricula, newPassword);
  };

  // ----------------------
  // Componente interno de redirección
  // ----------------------

  const RedirectAfterLogin = ({ fullName, studentData }) => {
    const router = useRouter();

    useEffect(() => {
      if (studentData) {
        // 🧩 Aseguramos que los nombres de campo sean los correctos
        const cleanedData = {
          nombreCompleto: studentData.nombreCompleto || "",
          numeroControl: studentData.numeroControl || "",
          ubicacion: studentData.ubicacion || "",
          fotoUrl: studentData.fotoUrl || "",
          fechaNacimiento: studentData.fechaNacimiento || "",
          rfc: studentData.rfc || "",
          curp: studentData.curp || "",
          telefono: studentData.telefono || "",
          email: studentData.email || "",
          sexo: studentData.sexo || "",
          alunac: studentData.alunac || "Sin carrera asignada", // 👈 nombre carrera
          cve: studentData.cve || "N/A", // 👈 clave carrera
          inscripciones: studentData.inscripciones || [],
        };

        // 🗂️ Guardar datos limpios en localStorage
        localStorage.setItem("studentData", JSON.stringify(cleanedData));
        console.log(
          "✅ Datos del estudiante guardados en localStorage:",
          cleanedData
        );

        // 🔁 Redirigir al menú del estudiante
        router.push(`/designs/menuestu?name=${encodeURIComponent(fullName)}`);
      }
    }, [router, fullName, studentData]);

    return null;
  };

  const formSteps = {
    login: (
      <LoginForm
        matricula={matricula}
        setMatricula={setMatricula}
        password={password}
        setPassword={setPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        onSubmit={onLoginSubmit}
      />
    ),
    register: (
      <RegisterForm
        matricula={matricula}
        setMatricula={setMatricula}
        password={password}
        setPassword={setPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        onSubmit={onRegisterSubmit}
      />
    ),
    teacher: (
      <TeacherForm
        teacherId={teacherId}
        setTeacherId={setTeacherId}
        password={password}
        setPassword={setPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        onSubmit={onTeacherSubmit}
      />
    ),
    adm: (
      <AdminForm
        adminUser={adminUser}
        setAdminUser={setAdminUser}
        adminPassword={adminPassword}
        setAdminPassword={setAdminPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        onSubmit={onAdminSubmit}
      />
    ),
    askEmail: (
      <AskEmailForm email={email} setEmail={setEmail} onSubmit={onSendCode} />
    ),
    verify: (
      <VerifyCodeForm code={code} setCode={setCode} onSubmit={onVerifyCode} />
    ),
    update: (
      <UpdatePasswordForm
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        onSubmit={onUpdatePassword}
      />
    ),
    success: (
      <RedirectAfterLogin fullName={fullName} studentData={studentData} />
    ),
  };

  const tabs = [
    { id: "login", label: "Estudiantes", icon: <FaUser /> },
    { id: "register", label: "Registro", icon: <FaUser /> },
    { id: "teacher", label: "Maestros", icon: <FaChalkboardTeacher /> },
    { id: "adm", label: "Admin", icon: <FaLock /> },
  ];

  return (
    <div className="login-container">
      <div className="particles">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: particle.left,
              animationDelay: particle.animationDelay,
              animationDuration: particle.animationDuration,
            }}
          ></div>
        ))}
      </div>

      <div className="form-section">
        <div className="login-header">
          <h1 className="login-title">Eventos ITE</h1>
          <p className="login-subtitle">Sistema de Gestión Académica</p>
        </div>

        <div className="login-card">
          <div className="login-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-button ${
                  step === tab.id ? "tab-active" : "tab-inactive"
                }`}
                onClick={() => {
                  resetForm();
                  setStep(tab.id);
                }}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-container">{formSteps[step]}</div>
        </div>
      </div>

      <div className="logo-section">
        <SchoolRainEffect />
        <div className="divider-enhancer"></div>
        <div className="mascot-container">
          <img
            src="/imagenes/foondoo.gif"
            alt="Logo del sistema Albatros corriendo"
            className="mascot-image"
          />
          <div className="mascot-shadow"></div>
        </div>
        <div className="wave"></div>
        <div className="wave second"></div>
        <div className="wave third"></div>
      </div>
    </div>
  );
};

export default LoginPage;
