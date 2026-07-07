import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

type Figure = {
  id: number
  name: string
  obtained: boolean
  isGolden: boolean
  isDuplicate: boolean
}

type RevealItem = {
  figure: Figure
  isDuplicate: boolean
  count?: number
}

// Map image path to player name for better display
const playerNamesMap: Record<string, string> = {
  '/assets/dibu.png': 'Emiliano Martínez',
  '/assets/molina.png': 'Nahuel Molina',
  '/assets/romero.png': 'Cristian Romero',
  '/assets/otamendi.png': 'Nicolás Otamendi',
  '/assets/mac%20allister.png': 'Alexis Mac Allister',
  '/assets/de%20paul.png': 'Rodrigo De Paul',
  '/assets/enzo.png': 'Enzo Fernández',
  '/assets/messi.png': 'Lionel Messi',
  '/assets/julian.png': 'Julián Álvarez',
  '/assets/lautaro.png': 'Lautaro Martínez',
  '/assets/simeone.png': 'Giovanni Simeone',
  '/assets/scaloni.png': 'Lionel Scaloni',
  '/assets/3.png': 'Escudo de Argentina',
  '/assets/equipo_argentina.jpg': 'Equipo de Argentina',
  '/assets/van%20dijk.png': 'Virgil van Dijk',
  '/assets/dumfries.png': 'Denzel Dumfries',
  '/assets/de%20jong.png': 'Frenkie de Jong',
  '/assets/simons.png': 'Xavi Simons',
  '/assets/gakpo.png': 'Cody Gakpo',
  '/assets/depay.png': 'Memphis Depay',
  '/assets/koeman.png': 'Ronald Koeman',
  '/assets/reijnders.png': 'Tijjani Reijnders',
  '/assets/van%20de%20ven.png': 'Micky van de Ven',
  '/assets/verbruggen.png': 'Bart Verbruggen',
  '/assets/gravenberch.png': 'Ryan Gravenberch',
  '/assets/malen.png': 'Donyell Malen',
  '/assets/escudo_paises_bajos.png': 'Escudo de Países Bajos',
  '/assets/equipo_paises_bajos.jpg': 'Equipo de Países Bajos',
  '/assets/lozano.png': 'Hirving Lozano',
  '/assets/jimenez.png': 'Raúl Jiménez',
  '/assets/gallardo.png': 'Jesús Gallardo',
  '/assets/montes.png': 'César Montes',
  '/assets/vasquez.png': 'Johan Vásquez',
  '/assets/vega.png': 'Alexis Vega',
  '/assets/reyes.png': 'Israel Reyes',
  '/assets/alvarado.png': 'Roberto Alvarado',
  '/assets/malagon.png': 'Luis Malagón',
  '/assets/ruiz.png': 'Marcel Ruiz',
  '/assets/edison.png': 'Edson Álvarez',
  '/assets/aguirre.png': 'Javier Aguirre',
  '/assets/escudo_mexico.png': 'Escudo de México',
  '/assets/equipo_mexico.jpg': 'Equipo de México',
  '/assets/leyenda_maradona.jpg': 'Jugador Leyenda',
  '/assets/leyenda_cruyff.jpg': 'Jugador Leyenda',
  '/assets/leyenda_sanchez.jpg': 'Jugador Leyenda'
}

export default function Envelopes() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [envelopeData, setEnvelopeData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeRemaining, setTimeRemaining] = useState<string>('')
  const [canClaim, setCanClaim] = useState(false)
  const [revealedCards, setRevealedCards] = useState<RevealItem[]>([])
  const [isOpening, setIsOpening] = useState(false)

  // 1. Load User
  useEffect(() => {
    const saved = localStorage.getItem('currentUser')
    if (saved) {
      setCurrentUser(JSON.parse(saved))
    } else {
      setLoading(false)
    }
  }, [])

  // 2. Fetch Envelope counts and status
  const fetchEnvelopes = () => {
    if (!currentUser) return
    fetch(`${API_URL}/users/${currentUser.id}/envelopes`)
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar sobres')
        return res.json()
      })
      .then((data) => {
        setEnvelopeData(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }

  useEffect(() => {
    if (currentUser) {
      fetchEnvelopes()
    }
  }, [currentUser])

  // 3. Countdown timer logic for claim free envelope
  useEffect(() => {
    if (!envelopeData || !envelopeData.lastFreeClaim) {
      setCanClaim(true)
      setTimeRemaining('')
      return
    }

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const lastClaim = new Date(envelopeData.lastFreeClaim).getTime()
      const cooldown = 24 * 60 * 60 * 1000 // 24 hours
      const diff = lastClaim + cooldown - now

      if (diff <= 0) {
        setCanClaim(true)
        setTimeRemaining('')
        clearInterval(interval)
      } else {
        setCanClaim(false)
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)
        setTimeRemaining(
          `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        )
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [envelopeData])

  // 4. Claim action
  const handleClaimFree = async () => {
    if (!currentUser || !canClaim) return
    try {
      const response = await fetch(`${API_URL}/users/${currentUser.id}/envelopes/claim`, {
        method: 'POST',
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al reclamar sobre')
      }
      const data = await response.json()
      setEnvelopeData(data.envelope)
      Swal.fire({
        icon: 'success',
        title: '¡Sobre reclamado!',
        text: data.message || '¡Sobre gratis reclamado con éxito!',
        confirmButtonColor: '#ffd700',
        background: '#1e293b',
        color: '#fff',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      })
    } catch (err: any) {
      console.error(err)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message,
        confirmButtonColor: '#ef4444',
        background: '#1e293b',
        color: '#fff',
      })
    }
  }

  // 5. Open action
  const handleOpenEnvelope = async (type: 'normal' | 'golden') => {
    if (!currentUser) return
    setIsOpening(true)
    setRevealedCards([])

    try {
      const response = await fetch(`${API_URL}/users/${currentUser.id}/envelopes/open`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'No se pudo abrir el sobre')
      }

      const cards: RevealItem[] = await response.json()
      
      // Update envelope count locally
      fetchEnvelopes()

      // Group identical cards
      const groupedMap = new Map<string, RevealItem>()
      for (const card of cards) {
        const key = card.figure.name
        if (groupedMap.has(key)) {
          const existing = groupedMap.get(key)!
          existing.count = (existing.count || 1) + 1
          existing.isDuplicate = true
        } else {
          groupedMap.set(key, { ...card, count: 1 })
        }
      }

      // Set revealed cards for animation display
      setRevealedCards(Array.from(groupedMap.values()))
    } catch (err: any) {
      console.error(err)
      Swal.fire({
        icon: 'error',
        title: 'No se pudo abrir el sobre',
        text: err.message,
        confirmButtonColor: '#ef4444',
        background: '#1e293b',
        color: '#fff',
      })
    } finally {
      setIsOpening(false)
    }
  }

  // 6. Open ALL action
  const handleOpenAllEnvelopes = async () => {
    if (!currentUser) return
    setIsOpening(true)
    setRevealedCards([])

    try {
      const response = await fetch(`${API_URL}/users/${currentUser.id}/envelopes/open-all`, {
        method: 'POST'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'No se pudieron abrir los sobres')
      }

      const cards: RevealItem[] = await response.json()
      
      fetchEnvelopes()

      // Group identical cards
      const groupedMap = new Map<string, RevealItem>()
      for (const card of cards) {
        const key = card.figure.name
        if (groupedMap.has(key)) {
          const existing = groupedMap.get(key)!
          existing.count = (existing.count || 1) + 1
          existing.isDuplicate = true
        } else {
          groupedMap.set(key, { ...card, count: 1 })
        }
      }

      setRevealedCards(Array.from(groupedMap.values()))
    } catch (err: any) {
      console.error(err)
      Swal.fire({
        icon: 'error',
        title: 'No se pudieron abrir los sobres',
        text: err.message,
        confirmButtonColor: '#ef4444',
        background: '#1e293b',
        color: '#fff',
      })
    } finally {
      setIsOpening(false)
    }
  }

  if (!currentUser) {
    return (
      <main style={{ padding: 40, textAlign: 'center' }}>
        <h2>Sección de Sobres 📦</h2>
        <p>Por favor, ve a la sección de <strong>Perfil</strong> para iniciar sesión y gestionar tus sobres.</p>
      </main>
    )
  }

  if (loading) {
    return (
      <main style={{ padding: 40, textAlign: 'center' }}>
        <h2>Cargando tus sobres...</h2>
      </main>
    )
  }

  return (
    <main style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#1e293b', marginBottom: '40px' }}>📦 Mis Sobres</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '40px' }}>
        
        {/* FREE CLAIM CARD */}
        <div style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          borderRadius: '20px',
          padding: '30px',
          color: 'white',
          boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          justifyContent: 'space-between',
          minHeight: '260px'
        }}>
          <div>
            <span style={{ fontSize: '40px', marginBottom: '10px', display: 'block' }}>🎁</span>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>Sobre Diario Gratis</h3>
            <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.4' }}>Reclama un sobre común gratis cada 24 horas para desbloquear nuevas figuras de la Copa.</p>
          </div>
          
          <div style={{ width: '100%', marginTop: '20px' }}>
            {canClaim ? (
              <button
                onClick={handleClaimFree}
                style={{
                  background: 'linear-gradient(90deg, #ffd700, #ff8c00)',
                  color: '#0f172a',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px 20px',
                  fontWeight: '800',
                  fontSize: '15px',
                  cursor: 'pointer',
                  width: '100%',
                  boxShadow: '0 0 15px rgba(255, 215, 0, 0.4)',
                  transition: 'transform 0.2s',
                }}
              >
                Reclamar sobre gratuito
              </button>
            ) : (
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '14px 20px',
                fontSize: '14px',
                color: '#94a3b8',
                fontWeight: 'bold',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                Siguiente reclamo en: <span style={{ color: '#ffd700', fontFamily: 'monospace', fontSize: '15px' }}>{timeRemaining}</span>
              </div>
            )}
          </div>
        </div>

        {/* INVENTORY CARD */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '260px'
        }}>
          <div>
            <h3 style={{ margin: '0 0 20px 0', color: '#1e293b', fontSize: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>📦 Inventario</h3>
            
            {/* Common envelope row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '28px' }}>✉️</span>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#334155' }}>Sobres Comunes</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Contiene 7 figuritas</div>
                </div>
              </div>
              <span style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>{envelopeData?.normalCount || 0}</span>
            </div>

            {/* Golden envelope row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '28px' }}>✨</span>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#b45309' }}>Sobres Dorados</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Contiene 1 dorada garantizada</div>
                </div>
              </div>
              <span style={{ fontSize: '22px', fontWeight: '800', color: '#ffd700', textShadow: '0px 1px 2px rgba(0,0,0,0.2)' }}>{envelopeData?.goldenCount || 0}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button
              onClick={() => handleOpenEnvelope('normal')}
              disabled={isOpening || !envelopeData?.normalCount}
              style={{
                flex: 1,
                background: '#0f172a',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                opacity: envelopeData?.normalCount ? 1 : 0.4,
              }}
            >
              Abrir Común
            </button>
            <button
              onClick={() => handleOpenEnvelope('golden')}
              disabled={isOpening || !envelopeData?.goldenCount}
              style={{
                flex: 1,
                background: 'linear-gradient(135deg, #ffd700, #ff8c00)',
                color: '#0f172a',
                border: 'none',
                borderRadius: '10px',
                padding: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                opacity: envelopeData?.goldenCount ? 1 : 0.4,
              }}
            >
              Abrir Dorado
            </button>
          </div>

          <div style={{ marginTop: '12px' }}>
            <button
              onClick={handleOpenAllEnvelopes}
              disabled={isOpening || (!envelopeData?.normalCount && !envelopeData?.goldenCount)}
              style={{
                width: '100%',
                background: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                opacity: (!envelopeData?.normalCount && !envelopeData?.goldenCount) ? 0.4 : 1,
              }}
            >
              Abrir Todos los Sobres 💥
            </button>
          </div>
        </div>
      </div>

      {/* OPENING ANIMATION OVERLAY / REVEALED CARDS AREA */}
      {isOpening && (
        <div style={{ textAlign: 'center', margin: '40px 0', padding: '40px', background: '#f8fafc', borderRadius: '20px', border: '2px dashed #cbd5e1' }}>
          <div style={{ fontSize: '40px', animation: 'spin 1.5s linear infinite' }}>📦</div>
          <h3 style={{ marginTop: '15px', color: '#475569' }}>Abriendo sobre y barajando figuritas...</h3>
        </div>
      )}

      {revealedCards.length > 0 && (
        <div style={{
          background: 'linear-gradient(to bottom, #1e293b, #0f172a)',
          borderRadius: '24px',
          padding: '30px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          marginTop: '30px',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
            <h2 style={{ color: 'white', margin: 0, fontSize: '22px' }}>🎉 Contenido de tu Sobre</h2>
            <button
              onClick={() => setRevealedCards([])}
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '13px'
              }}
            >
              Listo / Guardar
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
            gap: '20px',
            justifyItems: 'center'
          }}>
            {revealedCards.map((item, index) => {
              const decodedPath = decodeURIComponent(item.figure.name)
              const name = playerNamesMap[item.figure.name] || playerNamesMap[decodedPath] || 'Jugador'
              return (
                <div key={index} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '12px',
                  borderRadius: '14px',
                  border: item.figure.isGolden ? '2px solid #ffd700' : '1px solid rgba(255,255,255,0.1)',
                  boxShadow: item.figure.isGolden ? '0 0 15px rgba(255,215,0,0.3)' : 'none',
                  animation: `revealCard 0.5s ease-out ${index * 0.1}s both`,
                }}>
                  <div className={`card-container ${item.figure.isGolden ? 'golden' : ''}`} style={{ width: '85px', position: 'relative' }}>
                    <img
                      src={item.figure.name}
                      alt={name}
                      style={{
                        width: '100%',
                        borderRadius: '8px',
                        border: item.figure.isGolden ? '2px solid #ffd700' : 'none',
                        boxShadow: item.figure.isGolden ? '0 0 10px rgba(255,215,0,0.5)' : 'none',
                      }}
                    />
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: 'white',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    maxWidth: '85px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {name}
                  </div>
                  {item.count && item.count > 1 && (
                    <div style={{
                      background: 'rgba(255,255,255,0.1)',
                      color: '#e2e8f0',
                      fontWeight: 'bold',
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      width: '100%',
                      textAlign: 'center',
                      boxSizing: 'border-box'
                    }}>
                      x{item.count}
                    </div>
                  )}
                  {item.isDuplicate ? (
                    <span style={{ fontSize: '10px', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '2px 6px', borderRadius: '8px', fontWeight: 'bold' }}>
                      Repetida
                    </span>
                  ) : (
                    <span style={{ fontSize: '10px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '2px 6px', borderRadius: '8px', fontWeight: 'bold' }}>
                      NUEVA!
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Style animations directly */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes revealCard {
          0% {
            opacity: 0;
            transform: scale(0.7) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}} />
    </main>
  )
}
