import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Album from './components/Album'
import Exchange from './pages/Exchange'
import Profile from './pages/Profile'
import ShopUsuario from './pages/shopusuario'
import Envelopes from './pages/Envelopes'
import Welcome from './pages/Welcome'

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/album" element={<Album />} />
        <Route path="/shop" element={<ShopUsuario />} />
        <Route path="/envelopes" element={<Envelopes />} />
        <Route path="/exchange" element={<Exchange />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}
