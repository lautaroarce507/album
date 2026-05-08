import React from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="navbar">
      <div className="logo">World Album</div>
      <nav>
        <Link to="/">Album</Link>
        <Link to="/shop">Tienda</Link>
        <Link to="/exchange">Zona de intercambio</Link>
        <Link to="/profile">Perfil</Link>
      </nav>
    </header>
  )
}
