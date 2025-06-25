'use client';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './components/hooks/authHandlers';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


const LoginPage = () => {
  const router = useRouter();

  const [matricula, setMatricula] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState('login'); // login, register, askEmail, verify, update, success
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    handleLogin,
    handleRegister,
    handleSendCode,
    handleVerifyCode,
    handleUpdatePassword,
  } = useAuth(setStep, setFullName, setError);

  // Registro con validación de contraseña genérica
  const onRegisterSubmit = (e) => {
    e.preventDefault();
    if (!matricula || !password) {
      setError('Escribe matrícula y contraseña');
      return;
    }
    if (password !== '123456') {
      setError('La contraseña para registro debe ser "123456"');
      return;
    }
    handleRegister(e, matricula, password);
  };

  // Login submit
  const onLoginSubmit = (e) => {
    e.preventDefault();
    if (!matricula || !password) {
      setError('Escribe matrícula y contraseña');
      return;
    }
    handleLogin(e, matricula, password);
  };

  return (
    <div className="login-container">
      <div className="form-section">
        <div className="wave-overlay">
<svg width="1440" height="560" preserveAspectRatio="none" viewBox="0 0 1440 560">
  <g mask="url(#SvgjsMask1033)" fill="none">
    <path d="M 0,324 C 41.2,292.4 123.6,160.6 206,166 C 288.4,171.4 329.6,380 412,351 C 494.4,322 535.6,22.8 618,21 C 700.4,19.2 741.6,320.6 824,342 C 906.4,363.4 947.6,111 1030,128 C 1112.4,145 1154,413 1236,427 C 1318,441 1399.2,243.8 1440,198L1440 560L0 560z" fill="rgba(27, 57, 106, 1)" />
    <path d="M 0,412 C 48,375.8 144,210.2 240,231 C 336,251.8 384,530.8 480,516 C 576,501.2 624,159.2 720,157 C 816,154.8 864,524.4 960,505 C 1056,485.6 1104,55.2 1200,60 C 1296,64.8 1392,435.2 1440,529L1440 560L0 560z" fill="rgba(34, 100, 171, 0.74)" />
  </g>
  <defs>
    <mask id="SvgjsMask1033">
      <rect width="1440" height="560" fill="#ffffff" />
    </mask>
  </defs>
</svg>

        </div>

        <h1 className="login-title">Eventos ITE</h1>
        <div className="login-tabs">
          <button
            className={step === 'login' || step === 'success' ? 'tab-active' : 'tab-inactive'}
            onClick={() => {
              setStep('login');
              setError('');
              setPassword('');
              setMatricula('');
            }}
          >
            Iniciar Sesión
          </button>
          <button
            className={step === 'register' ? 'tab-active' : 'tab-inactive'}
            onClick={() => {
              setStep('register');
              setError('');
              setPassword('');
              setMatricula('');
            }}
          >
            Registrarse
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}

        {(step === 'login' || step === 'register') && (
          <form
            onSubmit={step === 'login' ? onLoginSubmit : onRegisterSubmit}
            className="login-form"
          >
            <label className="login-label">Matrícula:</label>
            
            <input
              type="text"
              className="login-input "
              value={matricula}
              placeholder='Ingresa tu matricula de estudiante'
              onChange={(e) => setMatricula(e.target.value)}
              required
            />

            <label className="login-label">Contraseña:</label>
            <div className="password-input-container">
            <input
            type={showPassword ? 'text' : 'password'}
            className="login-input password-input"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
            <span
            onClick={() => setShowPassword(!showPassword)}
            className="password-toggle-icon"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              </div>
            {step === 'register' && (
              <p style={{ fontSize: '0.9rem', marginBottom: '12px', color: '#333' }}>
                La contraseña debe ser la genérica: <b>123456</b>. Luego deberás verificar tu correo y cambiarla.
              </p>
            )}

            {step === 'login' && (
              <div className="forgot-password">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setStep('askEmail');
                    setError('');
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            )}

            <button type="submit" className="submit-button">
              {step === 'login' ? 'Iniciar sesión' : 'Registrarse'}
            </button>
          </form>
        )}

        {/* Resto de pasos iguales */}

        {step === 'askEmail' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!email) {
                setError('Escribe tu correo electrónico');
                return;
              }
              handleSendCode(e, matricula, email);
            }}
            className="login-form"
          >
            <label className="login-label">Correo electrónico</label>
            <input
              type="email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="submit-button">
              Enviar código
            </button>
          </form>
        )}

        {step === 'verify' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!code) {
                setError('Escribe el código de verificación');
                return;
              }
              handleVerifyCode(e, matricula, code);
            }}
            className="login-form"
          >
            <label className="login-label">Código de verificación</label>
            <input
              type="text"
              className="login-input"
              value={code}
              placeholder='Ingresa el codigo de 6 digitos enviado a tu correo'
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <button type="submit" className="submit-button">
              Verificar código
            </button>
          </form>
        )}

        {step === 'update' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newPassword) {
                setError('Escribe la nueva contraseña');
                return;
              }
              handleUpdatePassword(e, matricula, newPassword);
            }}
            className="login-form"
          >
            <label className="login-label">Nueva contraseña</label>
            <input
              type="password"
              className="login-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit" className="submit-button">
              Actualizar contraseña
            </button>
          </form>
        )}

         {step === 'success' && (
          <RedirectAfterLogin fullName={fullName} />
        )}
      </div>

      <div className="logo-section">
        <img src="/imagenes/logoevento.png" alt="Logo del sistema" className="logo-img" />
      </div>
    </div>
  );
};

export default LoginPage;

// Componente para redirigir al dashboard
function RedirectAfterLogin({ fullName }) {
  const router = useRouter();

  useEffect(() => {
    router.push(`/designs/menuestu?name=${encodeURIComponent(fullName)}`);
  }, [router, fullName]);

 
}
