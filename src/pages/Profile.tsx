import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function Profile() {
  const navigate = useNavigate()
  const [isRegister, setIsRegister] = useState(false)
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [user, setUser] = useState<any>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  })

  const [login, setLogin] = useState({
    email: '',
    password: ''
  })

  const [register, setRegister] = useState({
    name: '',
    surname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'login' | 'register'
  ) => {
    const { name, value } = e.target

    type === 'login'
      ? setLogin({ ...login, [name]: value })
      : setRegister({ ...register, [name]: value })
  }

  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    if (
      register.password !== register.confirmPassword
    ) {
      return setMessage(
        'Las contraseñas no coinciden'
      )
    }

    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: register.name,
          surname: register.surname,
          username: register.username,
          email: register.email,
          password: register.password,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al registrar usuario');
      }

      const data = await response.json();
      localStorage.setItem('currentUser', JSON.stringify(data));
      setUser(data);
      setMessage(`Usuario registrado correctamente. ¡Bienvenido ${data.name}!`);
      setIsRegister(false);

      setRegister({
        name: '',
        surname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      navigate('/');
    } catch (err: any) {
      setMessage(err.message || 'Error al conectar con el servidor');
    }
  }

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: login.email,
          password: login.password,
        }),
      });

      if (!response.ok) {
        throw new Error('Email o contraseña incorrectos');
      }

      const data = await response.json();
      localStorage.setItem('currentUser', JSON.stringify(data));
      setUser(data);
      setMessage(`Bienvenido ${data.name}`);
      navigate('/');
    } catch (err: any) {
      setMessage(err.message || 'Error al conectar con el servidor');
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    border: '1px solid #ccc',
    boxSizing: 'border-box'
  }

  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({ username: '', email: '' })

  const handleStartEdit = () => {
    setEditData({ username: user.username || '', email: user.email || '' })
    setIsEditing(true)
    setMessage('')
  }

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`${API_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: editData.username, email: editData.email }),
      })

      if (!response.ok) throw new Error('Error al guardar los cambios')

      const updated = await response.json()
      const newUser = { ...user, ...updated }
      localStorage.setItem('currentUser', JSON.stringify(newUser))
      setUser(newUser)
      setIsEditing(false)
      setMessage('¡Perfil actualizado correctamente!')
    } catch (err: any) {
      setMessage(err.message || 'Error al conectar con el servidor')
    }
  }

  if (user) {
    return (
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#f8fafc'
        }}
      >
        <div
          style={{
            width: 400,
            background: '#fff',
            padding: 35,
            borderRadius: 20,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          }}
        >
          {/* Avatar */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{
              width: 72, height: 72,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1e3c72, #2a69ac)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 30, color: 'white', margin: '0 auto 12px'
            }}>
              {(user.name || 'U')[0].toUpperCase()}
            </div>
            <h1 style={{ margin: 0, fontSize: 22, color: '#1e293b' }}>Mi Perfil</h1>
          </div>

          {isEditing ? (
            <>
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Nombre completo</label>
                <div style={{ padding: '10px 14px', background: '#f1f5f9', borderRadius: 8, color: '#64748b', fontSize: 14 }}>
                  {user.name} {user.surname || ''}
                </div>
              </div>
              <div style={{ marginBottom: 12, marginTop: 12 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Usuario</label>
                <input
                  type="text"
                  value={editData.username}
                  onChange={e => setEditData({ ...editData, username: e.target.value })}
                  style={{ ...inputStyle, marginBottom: 0 }}
                  placeholder="Nuevo nombre de usuario"
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Email</label>
                <input
                  type="email"
                  value={editData.email}
                  onChange={e => setEditData({ ...editData, email: e.target.value })}
                  style={{ ...inputStyle, marginBottom: 0 }}
                  placeholder="Nuevo correo electrónico"
                />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={handleSaveEdit}
                  style={{
                    flex: 1, padding: 11, border: 'none', borderRadius: 8,
                    background: '#1e3c72', color: '#fff', fontWeight: 'bold', cursor: 'pointer'
                  }}
                >
                  Guardar Cambios
                </button>
                <button
                  onClick={() => { setIsEditing(false); setMessage('') }}
                  style={{
                    flex: 1, padding: 11, border: '1px solid #e2e8f0', borderRadius: 8,
                    background: '#fff', color: '#64748b', fontWeight: 'bold', cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
              </div>
            </>
          ) : (
            <>
              {[
                { label: 'Nombre', value: `${user.name} ${user.surname || ''}`.trim() },
                { label: 'Usuario', value: user.username || '—' },
                { label: 'Email', value: user.email },
              ].map(({ label, value }) => (
                <div key={label} style={{ marginBottom: 12, padding: '10px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 15, color: '#1e293b', fontWeight: 500 }}>{value}</div>
                </div>
              ))}
              <button
                onClick={handleStartEdit}
                style={{
                  width: '100%', padding: 11, border: 'none', borderRadius: 8,
                  background: '#1e3c72', color: '#fff', fontWeight: 'bold', cursor: 'pointer', marginTop: 8
                }}
              >
                 Editar Perfil
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('currentUser');
                  setUser(null);
                  setMessage('');
                }}
                style={{
                  width: '100%', padding: 11, border: 'none', borderRadius: 8,
                  background: '#dc3545', color: '#fff', fontWeight: 'bold', cursor: 'pointer', marginTop: 10
                }}
              >
                Cerrar Sesión
              </button>
            </>
          )}

          {message && (
            <p style={{ marginTop: 15, textAlign: 'center', color: message.includes('Error') || message.includes('error') ? 'red' : 'green' }}>{message}</p>
          )}
        </div>
      </main>
    )
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#ffffff'
      }}
    >
      <div
        style={{
          width: 350,
          background: '#fff',
          padding: 30,
          borderRadius: 15,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h1 style={{ textAlign: 'center' }}>
          {isRegister
            ? 'Crear Cuenta'
            : 'Iniciar Sesión'}
        </h1>

        <form
          onSubmit={
            isRegister
              ? handleRegister
              : handleLogin
          }
        >
          {isRegister && (
            <>
              {[
                ['name', 'Nombre'],
                ['surname', 'Apellido'],
                ['username', 'Usuario']
              ].map(([name, placeholder]) => (
                <input
                  key={name}
                  type="text"
                  name={name}
                  placeholder={placeholder}
                  value={
                    register[
                      name as keyof typeof register
                    ]
                  }
                  onChange={(e) =>
                    handleChange(e, 'register')
                  }
                  style={inputStyle}
                  required
                />
              ))}
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={
              isRegister
                ? register.email
                : login.email
            }
            onChange={(e) =>
              handleChange(
                e,
                isRegister ? 'register' : 'login'
              )
            }
            style={inputStyle}
            required
          />

          <div style={{ position: 'relative', width: '100%', marginBottom: 15 }}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Contraseña"
              value={
                isRegister
                  ? register.password
                  : login.password
              }
              onChange={(e) =>
                handleChange(
                  e,
                  isRegister ? 'register' : 'login'
                )
              }
              style={{ ...inputStyle, marginBottom: 0, paddingRight: 70 }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 'bold',
                padding: 0,
                color: '#007bff'
              }}
              title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>

          {isRegister && (
            <div style={{ position: 'relative', width: '100%', marginBottom: 15 }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirmar contraseña"
                value={register.confirmPassword}
                onChange={(e) =>
                  handleChange(e, 'register')
                }
                style={{ ...inputStyle, marginBottom: 0, paddingRight: 70 }}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 'bold',
                  padding: 0,
                  color: '#007bff'
                }}
                title={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: 12,
              border: 'none',
              borderRadius: 8,
              background: '#1e3c72',
              color: '#fff',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {isRegister
              ? 'Registrarse'
              : 'Iniciar Sesión'}
          </button>
        </form>

        <p
          onClick={() => {
            setIsRegister(!isRegister)
            setMessage('')
            setShowPassword(false)
            setShowConfirmPassword(false)
          }}
          style={{
            marginTop: 15,
            textAlign: 'center',
            color: '#007bff',
            cursor: 'pointer'
          }}
        >
          {isRegister
            ? '¿Ya tienes cuenta? Inicia sesión'
            : '¿No tienes cuenta? Regístrate'}
        </p>

        {message && (
          <p
            style={{
              textAlign: 'center',
              marginTop: 15,
              color:
                message.includes('incorrectos') ||
                message.includes('coinciden') ||
                message.includes('Error')
                  ? 'red'
                  : 'green'
            }}
          >
            {message}
          </p>
        )}
      </div>
    </main>
  )
}