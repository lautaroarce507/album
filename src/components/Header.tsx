import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'

export default function Header() {
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const checkUser = () => {
      const saved = localStorage.getItem('currentUser')
      if (saved) {
        setCurrentUser(JSON.parse(saved))
      } else {
        setCurrentUser(null)
      }
    }

    checkUser()
    const interval = setInterval(checkUser, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        <NavLink to="/album" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <img src="/assets/logo.png" alt="World Album" style={{ height: '60px', width: 'auto', objectFit: 'contain' }} />
          <span className="logo-gradient">World Album</span>
        </NavLink>
        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Inicio
          </NavLink>
          <NavLink to="/album" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Álbum
          </NavLink>
          <NavLink to="/shop" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Tienda
          </NavLink>
          <NavLink to="/envelopes" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Sobres
          </NavLink>
          <NavLink to="/exchange" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Intercambio
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            {currentUser ? `👤 ${currentUser.name}` : 'Perfil'}
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
