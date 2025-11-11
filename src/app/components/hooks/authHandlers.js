// src/components/hooks/useAuthHandlers.js
import { useRouter } from "next/navigation";

export function useAuth(setStep, setFullName, setError, setStudentData) {
  const router = useRouter();

  async function handleLogin(e, matricula, password) {
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matricula, password }),
      });
      const data = await res.json();

      if (res.ok) {
        if (data.requiresVerification) {
          // No se permite el acceso si no ta verificado mi estimado compa
          setError(
            "Tu cuenta no ha sido verificada. Regístrate primero y verifica tu correo."
          );
        } else {
          setFullName(data.nombre || "Usuario");
          setStudentData(data.estudiante);
          setStep("success");
        }
      } else {
        setError(data.message || "Error desconocido");
      }
    } catch {
      setError("Error al conectar con el servidor");
    }
  }

  async function handleSendCode(e, matricula, email) {
    setError("");
    try {
      const res = await fetch("/api/auth/sendCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matricula, correo: email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep("verify");
      } else {
        setError(data.message || "Error enviando el código");
      }
    } catch {
      setError("Error al enviar el código");
    }
  }

  async function handleVerifyCode(e, matricula, code) {
    setError("");
    try {
      const res = await fetch("/api/auth/verifyCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matricula, code }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep("update");
      } else {
        setError(data.message || "Código incorrecto");
      }
    } catch {
      setError("Error verificando el código");
    }
  }

  async function handleUpdatePassword(e, matricula, newPassword) {
    setError("");
    try {
      const res = await fetch("/api/auth/changePass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matricula, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setFullName(data.fullName || matricula);
        setStep("success");
      } else {
        setError(data.message || "Error actualizando la contraseña");
      }
    } catch {
      setError("Error actualizando la contraseña");
    }
  }

  async function handleRegister(e, matricula) {
    setError("");
    try {
      // Registro con contraseña geneeeeeeericA
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matricula, password: "123456" }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.requiresVerification) {
          setStep("askEmail");
        } else {
          setError(
            "Esta cuenta ya está verificada. Inicia sesión con tu nueva contraseña."
          );
        }
      } else {
        setError(data.message || "Error en el registro");
      }
    } catch {
      setError("Error al conectar con el servidor");
    }
  }

  return {
    handleLogin,
    handleSendCode,
    handleVerifyCode,
    handleUpdatePassword,
    handleRegister,
  };
}
