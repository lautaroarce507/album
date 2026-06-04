import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Album from './components/Album'
import Shop from './pages/shopusuario'
import Exchange from './pages/Exchange'
import Profile from './pages/Profile'
import ShopUsuario from './pages/shopusuario'

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Album />} />
        <Route path="/shop" element={<ShopUsuario />} />
        <Route path="/exchange" element={<Exchange />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}
