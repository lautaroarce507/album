import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

type Figure = {
  id: number
  name: string
  obtained: boolean
  isGolden: boolean
  isDuplicate: boolean
}

type Trade = {
  id: number
  offeredFigureName: string
  requestedFigureName: string
  status: 'pending' | 'completed' | 'cancelled'
  creator: { id: number; name: string }
  receiver: { id: number; name: string } | null
  createdAt: string
}

const ALL_STICKERS = [
  { name: 'Escudo de Argentina', src: '/assets/3.png', country: 'Argentina' },
  { name: 'Emiliano Martínez', src: '/assets/dibu.png', country: 'Argentina' },
  { name: 'Nahuel Molina', src: '/assets/molina.png', country: 'Argentina' },
  { name: 'Cristian Romero', src: '/assets/romero.png', country: 'Argentina' },
  { name: 'Nicolás Otamendi', src: '/assets/otamendi.png', country: 'Argentina' },
  { name: 'Alexis Mac Allister', src: '/assets/mac%20allister.png', country: 'Argentina' },
  { name: 'Rodrigo De Paul', src: '/assets/de%20paul.png', country: 'Argentina' },
  { name: 'Enzo Fernández', src: '/assets/enzo.png', country: 'Argentina' },
  { name: 'Lionel Messi', src: '/assets/messi.png', country: 'Argentina' },
  { name: 'Julián Álvarez', src: '/assets/julian.png', country: 'Argentina' },
  { name: 'Lautaro Martínez', src: '/assets/lautaro.png', country: 'Argentina' },
  { name: 'Giovanni Simeone', src: '/assets/simeone.png', country: 'Argentina' },
  { name: 'Lionel Scaloni', src: '/assets/scaloni.png', country: 'Argentina' },
  { name: 'Equipo de Argentina', src: '/assets/equipo_argentina.jpg', country: 'Argentina' },
  { name: 'Jugador Leyenda', src: '/assets/leyenda_maradona.jpg', country: 'Argentina' },
  { name: 'Escudo de Países Bajos', src: '/assets/escudo_paises_bajos.png', country: 'Países Bajos' },
  { name: 'Virgil van Dijk', src: '/assets/van%20dijk.png', country: 'Países Bajos' },
  { name: 'Denzel Dumfries', src: '/assets/dumfries.png', country: 'Países Bajos' },
  { name: 'Frenkie de Jong', src: '/assets/de%20jong.png', country: 'Países Bajos' },
  { name: 'Xavi Simons', src: '/assets/simons.png', country: 'Países Bajos' },
  { name: 'Cody Gakpo', src: '/assets/gakpo.png', country: 'Países Bajos' },
  { name: 'Memphis Depay', src: '/assets/depay.png', country: 'Países Bajos' },
  { name: 'Ronald Koeman', src: '/assets/koeman.png', country: 'Países Bajos' },
  { name: 'Tijjani Reijnders', src: '/assets/reijnders.png', country: 'Países Bajos' },
  { name: 'Micky van de Ven', src: '/assets/van%20de%20ven.png', country: 'Países Bajos' },
  { name: 'Bart Verbruggen', src: '/assets/verbruggen.png', country: 'Países Bajos' },
  { name: 'Ryan Gravenberch', src: '/assets/gravenberch.png', country: 'Países Bajos' },
  { name: 'Donyell Malen', src: '/assets/malen.png', country: 'Países Bajos' },
  { name: 'Equipo de Países Bajos', src: '/assets/equipo_paises_bajos.jpg', country: 'Países Bajos' },
  { name: 'Jugador Leyenda', src: '/assets/leyenda_cruyff.jpg', country: 'Países Bajos' },
  { name: 'Escudo de México', src: '/assets/escudo_mexico.png', country: 'México' },
  { name: 'Hirving Lozano', src: '/assets/lozano.png', country: 'México' },
  { name: 'Raúl Jiménez', src: '/assets/jimenez.png', country: 'México' },
  { name: 'Jesús Gallardo', src: '/assets/gallardo.png', country: 'México' },
  { name: 'César Montes', src: '/assets/montes.png', country: 'México' },
  { name: 'Johan Vásquez', src: '/assets/vasquez.png', country: 'México' },
  { name: 'Alexis Vega', src: '/assets/vega.png', country: 'México' },
  { name: 'Israel Reyes', src: '/assets/reyes.png', country: 'México' },
  { name: 'Roberto Alvarado', src: '/assets/alvarado.png', country: 'México' },
  { name: 'Luis Malagón', src: '/assets/malagon.png', country: 'México' },
  { name: 'Marcel Ruiz', src: '/assets/ruiz.png', country: 'México' },
  { name: 'Edson Álvarez', src: '/assets/edison.png', country: 'México' },
  { name: 'Javier Aguirre', src: '/assets/aguirre.png', country: 'México' },
  { name: 'Jugador Leyenda', src: '/assets/leyenda_sanchez.jpg', country: 'México' },
];

const getStickerName = (src: string) => {
  const decoded = decodeURIComponent(src)
  const match = ALL_STICKERS.find(s => s.src === src || s.src === decoded)
  return match ? match.name : 'Jugador Desconocido'
}

export default function Exchange() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [duplicates, setDuplicates] = useState<Record<string, { count: number; isGolden: boolean }>>({})
  const [pendingTrades, setPendingTrades] = useState<Trade[]>([])
  const [myTrades, setMyTrades] = useState<Trade[]>([])
  const [missingStickers, setMissingStickers] = useState<typeof ALL_STICKERS>([])
  const [countryFilter, setCountryFilter] = useState<string>('')
  
  // Form state
  const [selectedOffered, setSelectedOffered] = useState<string>('')
  const [selectedRequested, setSelectedRequested] = useState<string>('')
  
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'market' | 'my-trades'>('market')

  // 1. Fetch current user
  useEffect(() => {
    const saved = localStorage.getItem('currentUser')
    if (saved) {
      setCurrentUser(JSON.parse(saved))
    } else {
      setLoading(false)
    }
  }, [])

  // 2. Fetch all exchange data
  const loadExchangeData = () => {
    if (!currentUser) return

    // Fetch Duplicates
    const fetchDup = fetch(`http://localhost:3000/users/${currentUser.id}/album/duplicates`)
      .then(res => res.json())
      .then((data: Figure[]) => {
        const dupMap: Record<string, { count: number; isGolden: boolean }> = {}
        data.forEach(fig => {
          if (dupMap[fig.name]) {
            dupMap[fig.name].count += 1
          } else {
            dupMap[fig.name] = { count: 1, isGolden: fig.isGolden }
          }
        })
        setDuplicates(dupMap)
      })

    // Fetch Album to find missing stickers
    const fetchAlbum = fetch(`http://localhost:3000/users/${currentUser.id}/album`)
      .then(res => res.json())
      .then((album: { figures: Figure[] }) => {
        const obtainedNames = new Set(
          (album.figures || []).filter(f => f.obtained).map(f => f.name)
        )
        const missing = ALL_STICKERS.filter(s => !obtainedNames.has(s.src))
        setMissingStickers(missing)
      })

    // Fetch Public Pending Trades
    const fetchPublic = fetch('http://localhost:3000/trades')
      .then(res => res.json())
      .then((data: Trade[]) => {
        // filter out current user's proposals so they only see other people's offers in the public market
        setPendingTrades(data.filter(t => t.creator.id !== currentUser.id))
      })

    // Fetch My Trades history
    const fetchMy = fetch(`http://localhost:3000/users/${currentUser.id}/trades`)
      .then(res => res.json())
      .then((data: Trade[]) => {
        setMyTrades(data)
      })

    Promise.all([fetchDup, fetchAlbum, fetchPublic, fetchMy])
      .then(() => setLoading(false))
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }

  useEffect(() => {
    if (currentUser) {
      loadExchangeData()
      const interval = setInterval(loadExchangeData, 5000)
      return () => clearInterval(interval)
    }
  }, [currentUser])

  // 3. Create Trade proposal
  const handleCreateTrade = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOffered || !selectedRequested) {
      Swal.fire({
        icon: 'warning',
        title: 'Faltan datos',
        text: 'Debes seleccionar un cromo para ofrecer y otro para solicitar.',
        confirmButtonColor: '#0f172a',
        background: '#fff',
      })
      return
    }

    if (selectedOffered === selectedRequested) {
      Swal.fire({
        icon: 'warning',
        title: 'Selección inválida',
        text: 'No puedes solicitar el mismo cromo que estás ofreciendo.',
        confirmButtonColor: '#0f172a',
        background: '#fff',
      })
      return
    }

    try {
      const res = await fetch(`http://localhost:3000/users/${currentUser.id}/trades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offeredFigureName: selectedOffered,
          requestedFigureName: selectedRequested
        })
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.message || 'Error al crear la propuesta')
      }

      await Swal.fire({
        icon: 'success',
        title: '¡Publicado!',
        text: '¡Propuesta de intercambio publicada con éxito!',
        confirmButtonColor: '#10b981',
        background: '#fff',
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
      })
      setSelectedOffered('')
      setSelectedRequested('')
      loadExchangeData()
    } catch (err: any) {
      console.error(err)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message,
        confirmButtonColor: '#ef4444',
        background: '#fff',
      })
    }
  }

  // 4. Cancel Trade Proposal
  const handleCancelTrade = async (tradeId: number) => {
    const result = await Swal.fire({
      icon: 'question',
      title: '¿Cancelar propuesta?',
      text: '¿Estás seguro de que deseas cancelar esta propuesta?',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, conservar',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      background: '#fff',
    })
    if (!result.isConfirmed) return
    try {
      const res = await fetch(`http://localhost:3000/users/${currentUser.id}/trades/${tradeId}/cancel`, {
        method: 'POST'
      })
      if (!res.ok) throw new Error('Error al cancelar la propuesta')
      Swal.fire({
        icon: 'info',
        title: 'Propuesta cancelada',
        text: 'La propuesta ha sido cancelada correctamente.',
        confirmButtonColor: '#0f172a',
        background: '#fff',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      })
      loadExchangeData()
    } catch (err: any) {
      console.error(err)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message,
        confirmButtonColor: '#ef4444',
        background: '#fff',
      })
    }
  }

  // 5. Accept Trade
  const handleAcceptTrade = async (tradeId: number) => {
    const result = await Swal.fire({
      icon: 'question',
      title: '¿Confirmar intercambio?',
      text: '¿Confirmas que deseas realizar este intercambio? Se descontará tu cromo repetido.',
      showCancelButton: true,
      confirmButtonText: '¡Sí, intercambiar!',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#64748b',
      background: '#fff',
    })
    if (!result.isConfirmed) return
    try {
      const res = await fetch(`http://localhost:3000/users/${currentUser.id}/trades/${tradeId}/accept`, {
        method: 'POST'
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.message || 'Error al aceptar el intercambio')
      }
      Swal.fire({
        icon: 'success',
        title: '¡Intercambio realizado!',
        text: 'Revisa tu álbum y tu pila de repetidas.',
        confirmButtonColor: '#10b981',
        background: '#fff',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      })
      loadExchangeData()
    } catch (err: any) {
      console.error(err)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message,
        confirmButtonColor: '#ef4444',
        background: '#fff',
      })
    }
  }

  // 6. Delete Trade (completed or cancelled only)
  const handleDeleteTrade = async (tradeId: number) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar propuesta?',
      text: 'Se eliminará permanentemente del historial.',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      background: '#fff',
    })
    if (!result.isConfirmed) return
    try {
      const res = await fetch(`http://localhost:3000/users/${currentUser.id}/trades/${tradeId}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || 'Error al eliminar la propuesta')
      }
      Swal.fire({
        icon: 'success',
        title: 'Eliminada',
        text: 'La propuesta fue eliminada del historial.',
        confirmButtonColor: '#0f172a',
        background: '#fff',
        timer: 1800,
        timerProgressBar: true,
        showConfirmButton: false,
      })
      loadExchangeData()
    } catch (err: any) {
      console.error(err)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message,
        confirmButtonColor: '#ef4444',
        background: '#fff',
      })
    }
  }

  if (!currentUser) {
    return (
      <main style={{ padding: 40, textAlign: 'center' }}>
        <h2>Zona de Intercambio 🔄</h2>
        <p>Por favor, ve a la sección de <strong>Perfil</strong> para iniciar sesión y gestionar tus intercambios.</p>
      </main>
    )
  }

  if (loading) {
    return (
      <main style={{ padding: 40, textAlign: 'center' }}>
        <h2>Cargando mercado de intercambios...</h2>
      </main>
    )
  }

  const duplicatesList = Object.entries(duplicates)

  return (
    <main style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#1e293b', marginBottom: '35px' }}>🔄 Zona de Intercambio</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', alignItems: 'start' }}>
        
        {/* LEFT SECTION: MY DUPLICATES & CREATION FORM */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* PILA DE REPETIDAS */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
              📚 Mi Pila de Repetidas ({duplicatesList.reduce((sum, d) => sum + d[1].count, 0)})
            </h3>
            
            {duplicatesList.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '13px', fontStyle: 'italic', textAlign: 'center', margin: '20px 0' }}>
                No tienes cromos repetidos para intercambiar todavía. ¡Abre más sobres!
              </p>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(75px, 1fr))',
                gap: '14px',
                maxHeight: '260px',
                overflowY: 'auto',
                paddingRight: '6px',
                paddingTop: '10px'
              }}>
                {duplicatesList.map(([src, info]) => {
                  const name = getStickerName(src)
                  return (
                    <div key={src} style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      background: '#f8fafc',
                      padding: '6px',
                      borderRadius: '10px',
                      border: info.isGolden ? '2.5px solid #ffd700' : '1px solid #e2e8f0',
                      gap: '6px'
                    }} title={name}>
                      <img src={src} alt={name} style={{ width: '100%', borderRadius: '6px' }} />
                      <span style={{
                        background: '#e2e8f0',
                        color: '#475569',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        width: '100%',
                        textAlign: 'center',
                        boxSizing: 'border-box'
                      }}>
                        x{info.count}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* CREAR PROPUESTA DE INTERCAMBIO */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
              ➕ Crear Propuesta de Intercambio
            </h3>
            
            <form onSubmit={handleCreateTrade} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '6px' }}>
                  Cromo que ofreces (de tus repetidas):
                </label>
                <select
                  value={selectedOffered}
                  onChange={(e) => setSelectedOffered(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  required
                >
                  <option value="">-- Seleccionar cromo repetido --</option>
                  {duplicatesList.map(([src, info]) => (
                    <option key={src} value={src}>
                      {getStickerName(src)} {info.isGolden ? '(⭐ Dorada)' : ''} (Tenes x{info.count})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '6px' }}>
                  Cromo que buscas:
                </label>
                {/* Country filter */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                  {['', 'Argentina', 'Países Bajos', 'México'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => { setCountryFilter(c); setSelectedRequested('') }}
                      style={{
                        flex: 1,
                        padding: '6px 4px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        borderRadius: '8px',
                        border: '1.5px solid',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        borderColor: countryFilter === c ? '#0f172a' : '#e2e8f0',
                        background: countryFilter === c ? '#0f172a' : '#f8fafc',
                        color: countryFilter === c ? '#fff' : '#475569',
                      }}
                    >
                      {c === '' ? 'Todos' : c === 'Países Bajos' ? '🇳🇱 PB' : c === 'Argentina' ? '🇦🇷 ARG' : '🇲🇽 MEX'}
                    </button>
                  ))}
                </div>
                <select
                  value={selectedRequested}
                  onChange={(e) => setSelectedRequested(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  required
                  disabled={missingStickers.length === 0}
                >
                  <option value="">-- Solo figuritas que te faltan --</option>
                  {missingStickers
                    .filter(s => !countryFilter || s.country === countryFilter)
                    .map((sticker) => (
                      <option key={sticker.src} value={sticker.src}>
                        {sticker.name}
                      </option>
                    ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={duplicatesList.length === 0}
                style={{
                  background: 'linear-gradient(90deg, #10b981, #34d399)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  cursor: 'pointer',
                  marginTop: '10px',
                  opacity: duplicatesList.length === 0 ? 0.5 : 1
                }}
              >
                Publicar Intercambio
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT SECTION: ACTIVE PUBLIC MARKET & MY PROPOSALS LIST */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0',
          minHeight: '400px'
        }}>
          {/* TABS HEADER */}
          <div style={{ display: 'flex', gap: '15px', borderBottom: '1px solid #f1f5f9', marginBottom: '20px', paddingBottom: '10px' }}>
            <button
              onClick={() => setActiveTab('market')}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'market' ? '#0f172a' : '#94a3b8',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: 'pointer',
                borderBottom: activeTab === 'market' ? '3px solid #0f172a' : 'none',
                paddingBottom: '8px',
                paddingLeft: 0,
                paddingRight: 10
              }}
            >
              🤝 Mercado de Intercambios ({pendingTrades.length})
            </button>
            <button
              onClick={() => setActiveTab('my-trades')}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'my-trades' ? '#0f172a' : '#94a3b8',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: 'pointer',
                borderBottom: activeTab === 'my-trades' ? '3px solid #0f172a' : 'none',
                paddingBottom: '8px',
                paddingLeft: 10,
                paddingRight: 10
              }}
            >
              📋 Mis Propuestas ({myTrades.length})
            </button>
          </div>

          {/* TAB 1: PUBLIC MARKET */}
          {activeTab === 'market' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '480px', overflowY: 'auto', paddingRight: '4px' }}>
              {pendingTrades.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '14px', fontStyle: 'italic', textAlign: 'center', marginTop: '40px' }}>
                  No hay propuestas de otros usuarios disponibles en este momento.
                </p>
              ) : (
                pendingTrades.map((trade) => {
                  const hasRequestedDup = !!duplicates[trade.requestedFigureName]
                  return (
                    <div key={trade.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#f8fafc',
                      padding: '16px',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', marginBottom: '8px' }}>
                          👤 Creado por: {trade.creator.name}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          {/* Ofrece */}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                            <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 'bold' }}>Ofrece</span>
                            <img src={trade.offeredFigureName} alt="Ofrecido" style={{ width: '45px', borderRadius: '4px' }} />
                            <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#334155', maxWidth: '75px', textAlign: 'center', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                              {getStickerName(trade.offeredFigureName)}
                            </span>
                          </div>
                          
                          <span style={{ fontSize: '18px' }}>➡️</span>

                          {/* Pide */}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                            <span style={{ fontSize: '10px', color: '#ef4444', fontWeight: 'bold' }}>Pide</span>
                            <img src={trade.requestedFigureName} alt="Pedido" style={{ width: '45px', borderRadius: '4px' }} />
                            <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#334155', maxWidth: '75px', textAlign: 'center', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                              {getStickerName(trade.requestedFigureName)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        {hasRequestedDup ? (
                          <button
                            onClick={() => handleAcceptTrade(trade.id)}
                            style={{
                              background: '#10b981',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px 12px',
                              fontWeight: 'bold',
                              fontSize: '12px',
                              cursor: 'pointer',
                            }}
                          >
                            Realizar Intercambio
                          </button>
                        ) : (
                          <div style={{
                            background: '#e2e8f0',
                            color: '#64748b',
                            borderRadius: '8px',
                            padding: '8px 10px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            maxWidth: '120px'
                          }}>
                            Falta repetida "{getStickerName(trade.requestedFigureName)}"
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}

          {/* TAB 2: MY PROPOSALS */}
          {activeTab === 'my-trades' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '480px', overflowY: 'auto', paddingRight: '4px' }}>
              {myTrades.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '14px', fontStyle: 'italic', textAlign: 'center', marginTop: '40px' }}>
                  No has publicado ninguna propuesta de intercambio aún.
                </p>
              ) : (
                myTrades.map((trade) => {
                  return (
                    <div key={trade.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#f8fafc',
                      padding: '16px',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold' }}>
                            {new Date(trade.createdAt).toLocaleDateString()}
                          </span>
                          {trade.status === 'pending' && (
                            <span style={{ fontSize: '9px', background: '#fef3c7', color: '#d97706', padding: '2px 6px', borderRadius: '8px', fontWeight: 'bold' }}>Pendiente</span>
                          )}
                          {trade.status === 'completed' && (
                            <span style={{ fontSize: '9px', background: '#d1fae5', color: '#059669', padding: '2px 6px', borderRadius: '8px', fontWeight: 'bold' }}>Completado con {trade.receiver?.name}</span>
                          )}
                          {trade.status === 'cancelled' && (
                            <span style={{ fontSize: '9px', background: '#fee2e2', color: '#dc2626', padding: '2px 6px', borderRadius: '8px', fontWeight: 'bold' }}>Cancelado</span>
                          )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                            <span style={{ fontSize: '9px', color: '#64748b' }}>Ofreciste</span>
                            <img src={trade.offeredFigureName} alt="Ofrecido" style={{ width: '40px', borderRadius: '4px' }} />
                            <span style={{ fontSize: '9px', color: '#475569', fontWeight: 'bold' }}>{getStickerName(trade.offeredFigureName)}</span>
                          </div>
                          
                          <span>➡️</span>

                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                            <span style={{ fontSize: '9px', color: '#64748b' }}>Buscabas</span>
                            <img src={trade.requestedFigureName} alt="Pedido" style={{ width: '40px', borderRadius: '4px' }} />
                            <span style={{ fontSize: '9px', color: '#475569', fontWeight: 'bold' }}>{getStickerName(trade.requestedFigureName)}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {trade.status === 'pending' && (
                          <button
                            onClick={() => handleCancelTrade(trade.id)}
                            style={{
                              background: '#dc2626',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px 12px',
                              fontWeight: 'bold',
                              fontSize: '11px',
                              cursor: 'pointer',
                            }}
                          >
                            Cancelar
                          </button>
                        )}
                        {trade.status !== 'pending' && (
                          <button
                            onClick={() => handleDeleteTrade(trade.id)}
                            style={{
                              background: 'none',
                              color: '#94a3b8',
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px',
                              padding: '7px 10px',
                              fontWeight: 'bold',
                              fontSize: '11px',
                              cursor: 'pointer',
                            }}
                          >
                            🗑 Eliminar
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
