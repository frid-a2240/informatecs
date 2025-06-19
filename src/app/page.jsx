'use client';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './components/hooks/authHandlers';

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
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 1000" preserveAspectRatio="none">
            <path
              fill="#0055aa"
              fillOpacity="0.1"
              d="
                M0,0
                C30,200 70,300 0,400
                C-30,600 70,700 0,800
                C-30,1000 100,1000 100,1000
                L100,0 Z"
            />
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
            <label className="login-label">Matrícula</label>
            <input
              type="text"
              className="login-input"
              value={matricula}
              placeholder='Ingresa tu matricula de estudiante'
              onChange={(e) => setMatricula(e.target.value)}
              required
            />

            <label className="login-label">Contraseña</label>
            <input
              type="password"
              className="login-input"
              placeholder='Ingresa tu contraseña '
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

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
