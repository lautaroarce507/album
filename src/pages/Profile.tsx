import React, { useState } from 'react'

export default function Profile() {
  const [isRegister, setIsRegister] = useState(false)
  const [message, setMessage] = useState('')

  const [user, setUser] = useState<any>(null)

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

  const handleRegister = (
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

    setUser(register)

    setMessage('Usuario registrado correctamente')

    setRegister({
      name: '',
      surname: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
  }

  const handleLogin = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    user &&
    login.email === user.email &&
    login.password === user.password
      ? setMessage(`Bienvenido ${user.name}`)
      : setMessage('Email o contraseña incorrectos')
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    border: '1px solid #ccc',
    boxSizing: 'border-box'
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#ffffff' // <-- Fondo cambiado a blanco
      }}
    >
      <div
        style={{
          width: 350,
          background: '#fff',
          padding: 30,
          borderRadius: 15,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' // <-- Sombra agregada para resaltar el formulario
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

          <input
            type="password"
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
            style={inputStyle}
            required
          />

          {isRegister && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              value={register.confirmPassword}
              onChange={(e) =>
                handleChange(e, 'register')
              }
              style={inputStyle}
              required
            />
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
                message.includes('coinciden')
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