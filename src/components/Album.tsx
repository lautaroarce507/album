import React, { useEffect, useState } from 'react'
import '../../src/styles/album.css'

type Player = {
  filename: string
  fullName: string
  position: string
  number?: number
  isDT?: boolean
}

type Country = {
  name: string
  players: Player[]
}

const countries: Country[] = [
  {
    name: 'Argentina',
    players: [
      { filename: '3.png', fullName: 'Escudo de Argentina', position: 'Escudo' },
      { filename: 'dibu.png', fullName: 'Emiliano Martínez', position: 'Arquero', number: 23 },
      { filename: 'molina.png', fullName: 'Nahuel Molina', position: 'Defensor', number: 26 },
      { filename: 'romero.png', fullName: 'Cristian Romero', position: 'Defensor', number: 13 },
      { filename: 'otamendi.png', fullName: 'Nicolás Otamendi', position: 'Defensor', number: 19 },
      { filename: 'mac allister.png', fullName: 'Alexis Mac Allister', position: 'Mediocampista', number: 20 },
      { filename: 'de paul.png', fullName: 'Rodrigo De Paul', position: 'Mediocampista', number: 7 },
      { filename: 'enzo.png', fullName: 'Enzo Fernández', position: 'Mediocampista', number: 24 },
      { filename: 'messi.png', fullName: 'Lionel Messi', position: 'Delantero', number: 10 },
      { filename: 'julian.png', fullName: 'Julián Álvarez', position: 'Delantero', number: 9 },
      { filename: 'lautaro.png', fullName: 'Lautaro Martínez', position: 'Delantero', number: 22 },
      { filename: 'simeone.png', fullName: 'Giovanni Simeone', position: 'Delantero', number: 18 },
      { filename: 'scaloni.png', fullName: 'Lionel Scaloni', position: 'Director Técnico', isDT: true },
      { filename: 'equipo_argentina.jpg', fullName: 'Equipo de Argentina', position: 'Equipo' }
    ]
  },
  {
    name: 'Paises Bajos',
    players: [
      { filename: 'escudo_paises_bajos.png', fullName: 'Escudo de Países Bajos', position: 'Escudo' },
      { filename: 'van dijk.png', fullName: 'Virgil van Dijk', position: 'Defensor', number: 4 },
      { filename: 'dumfries.png', fullName: 'Denzel Dumfries', position: 'Defensor', number: 22 },
      { filename: 'de jong.png', fullName: 'Frenkie de Jong', position: 'Mediocampista', number: 21 },
      { filename: 'simons.png', fullName: 'Xavi Simons', position: 'Mediocampista', number: 7 },
      { filename: 'gakpo.png', fullName: 'Cody Gakpo', position: 'Delantero', number: 11 },
      { filename: 'depay.png', fullName: 'Memphis Depay', position: 'Delantero', number: 10 },
      { filename: 'koeman.png', fullName: 'Ronald Koeman', position: 'Director Técnico', isDT: true },
      { filename: 'reijnders.png', fullName: 'Tijjani Reijnders', position: 'Mediocampista', number: 14 },
      { filename: 'van de ven.png', fullName: 'Micky van de Ven', position: 'Defensor', number: 15 },
      { filename: 'verbruggen.png', fullName: 'Bart Verbruggen', position: 'Arquero', number: 1 },
      { filename: 'gravenberch.png', fullName: 'Ryan Gravenberch', position: 'Mediocampista', number: 8 },
      { filename: 'malen.png', fullName: 'Donyell Malen', position: 'Delantero', number: 18 },
      { filename: 'equipo_paises_bajos.jpg', fullName: 'Equipo de Países Bajos', position: 'Equipo' }
    ]
  },
  {
    name: 'Mexico',
    players: [
      { filename: 'escudo_mexico.png', fullName: 'Escudo de México', position: 'Escudo' },
      { filename: 'lozano.png', fullName: 'Hirving Lozano', position: 'Delantero', number: 22 },
      { filename: 'jimenez.png', fullName: 'Raúl Jiménez', position: 'Delantero', number: 9 },
      { filename: 'gallardo.png', fullName: 'Jesús Gallardo', position: 'Defensor', number: 23 },
      { filename: 'montes.png', fullName: 'César Montes', position: 'Defensor', number: 3 },
      { filename: 'vasquez.png', fullName: 'Johan Vásquez', position: 'Defensor', number: 5 },
      { filename: 'vega.png', fullName: 'Alexis Vega', position: 'Delantero', number: 10 },
      { filename: 'reyes.png', fullName: 'Israel Reyes', position: 'Defensor', number: 2 },
      { filename: 'alvarado.png', fullName: 'Roberto Alvarado', position: 'Mediocampista', number: 25 },
      { filename: 'malagon.png', fullName: 'Luis Malagón', position: 'Arquero', number: 1 },
      { filename: 'ruiz.png', fullName: 'Marcel Ruiz', position: 'Mediocampista', number: 14 },
      { filename: 'edison.png', fullName: 'Edson Álvarez', position: 'Mediocampista', number: 4 },
      { filename: 'aguirre.png', fullName: 'Javier Aguirre', position: 'Director Técnico', isDT: true },
      { filename: 'equipo_mexico.jpg', fullName: 'Equipo de México', position: 'Equipo' }
    ]
  }
]

export default function Album() {
  const [unlocked, setUnlocked] = useState<Record<string, { obtained: boolean; isGolden: boolean }>>({})
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPlayer, setSelectedPlayer] = useState<{
    filename: string
    fullName: string
    position: string
    number?: number
    isDT?: boolean
    src: string
    isUnlocked: boolean
    isGolden: boolean
    country: string
  } | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('currentUser')
    if (saved) {
      const userObj = JSON.parse(saved)
      setCurrentUser(userObj)
      
      // Cargar figuritas del backend
      fetch(`http://localhost:3000/users/${userObj.id}/album`)
        .then((res) => {
          if (!res.ok) throw new Error('Error al cargar álbum')
          return res.json()
        })
        .then((data) => {
          const unlockedMap: Record<string, { obtained: boolean; isGolden: boolean }> = {}
          if (data && data.figures) {
            data.figures.forEach((fig: any) => {
              if (fig.obtained) {
                // El backend guarda el nombre/src, lo recuperamos
                unlockedMap[fig.name] = { obtained: true, isGolden: !!fig.isGolden }
              }
            })
          }
          setUnlocked(unlockedMap)
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  if (!currentUser) {
    return (
      <main style={{ padding: 40, textAlign: 'center' }}>
        <h2>Álbum de Figuritas</h2>
        <p>Por favor, ve a la sección de <strong>Perfil</strong> para registrarte o iniciar sesión y gestionar tu álbum.</p>
      </main>
    )
  }

  if (loading) {
    return (
      <main style={{ padding: 40, textAlign: 'center' }}>
        <h2>Cargando tu álbum...</h2>
      </main>
    )
  }

  return (
    <main style={{ paddingBottom: '60px' }}>
      <div style={{
        maxWidth: '900px',
        margin: '20px auto',
        padding: '16px 20px',
        background: 'rgba(255, 215, 0, 0.08)',
        border: '1px solid rgba(255, 215, 0, 0.25)',
        borderRadius: '12px',
        color: '#b45309',
        fontSize: '14px',
        fontWeight: 'bold',
        textAlign: 'center',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
      }}>
        💡 Las figuritas ya no se pueden desbloquear manualmente haciendo clic. Consigue sobres en la <strong>Tienda</strong>, reclámalos gratis cada 24 horas y ábrelos en la sección <strong>Sobres</strong>, o realiza intercambios de tus repetidas en la <strong>Zona de Intercambio</strong>.
      </div>
      {countries.map((c) => {
        const totalStickers = c.players.length
        const unlockedCount = c.players.filter(p => {
          const src = `/assets/${encodeURIComponent(p.filename)}`
          return !!unlocked[src]?.obtained
        }).length
        const goldenCount = c.players.filter(p => {
          const src = `/assets/${encodeURIComponent(p.filename)}`
          return !!unlocked[src]?.isGolden
        }).length
        const progressPercentage = (unlockedCount / totalStickers) * 100

        return (
          <section className="country-card" key={c.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h2 style={{ margin: 0, color: '#000000' }}>{c.name}</h2>
              <span style={{ fontSize: '15px', color: '#b45309', fontWeight: 'bold' }}>
                ⭐ {goldenCount} Doradas
              </span>
            </div>

            {/* Barra de progreso */}
            <div style={{ marginBottom: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#000000', marginBottom: '6px', fontWeight: 'bold' }}>
                <span>Progreso</span>
                <span>{unlockedCount} / {totalStickers}</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${progressPercentage}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #34d399)', borderRadius: '4px', transition: 'width 0.4s ease-out' }}></div>
              </div>
            </div>

            <div className="player-grid">
              {c.players.map((p) => {
                const src = `/assets/${encodeURIComponent(p.filename)}`
                const figInfo = unlocked[src]
                const isUnlocked = !!figInfo?.obtained
                const isGolden = !!figInfo?.isGolden
                const isTeam = p.position === 'Equipo'

                return (
                  <div key={p.filename} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    gridColumn: isTeam ? 'span 2' : 'span 1'
                  }}>
                    <div className={`card-container ${isGolden ? 'golden' : ''}`}>
                      <img
                        src={src}
                        alt={p.fullName}
                        className={`card ${isUnlocked ? 'unlocked' : 'locked'} ${isGolden ? 'golden' : ''}`}
                        onClick={() => setSelectedPlayer({
                          ...p,
                          src,
                          isUnlocked,
                          isGolden,
                          country: c.name
                        })}
                      />
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', textAlign: 'center', color: '#000000', minHeight: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {p.fullName}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}

      {/* Modal para ver la figurita en grande y con detalles */}
      {selectedPlayer && (
        <div className="modal-overlay" onClick={() => setSelectedPlayer(null)}>
          <div className={`modal-content ${selectedPlayer.isGolden ? 'golden' : ''}`} style={{ maxWidth: selectedPlayer.position === 'Equipo' ? '500px' : '450px' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedPlayer(null)}>
              &times;
            </button>
            <div className="modal-img-container" style={{ width: selectedPlayer.position === 'Equipo' ? '320px' : '200px' }}>
              <div className={`card-container ${selectedPlayer.isGolden ? 'golden' : ''}`}>
                <img
                  src={selectedPlayer.src}
                  alt={selectedPlayer.fullName}
                  className={`card ${selectedPlayer.isUnlocked ? 'unlocked' : 'locked'} ${selectedPlayer.isGolden ? 'golden' : ''}`}
                />
              </div>
            </div>
            <div className="modal-info">
              {selectedPlayer.isUnlocked ? (
                <>
                  <h3>{selectedPlayer.fullName}</h3>
                  <div className="modal-badge-container">
                    <span className="modal-badge country">{selectedPlayer.country}</span>
                    <span className="modal-badge position">{selectedPlayer.position}</span>
                    {selectedPlayer.isDT ? (
                      <span className="modal-badge detail">DT</span>
                    ) : selectedPlayer.number !== undefined ? (
                      <span className="modal-badge detail">N° {selectedPlayer.number}</span>
                    ) : null}
                  </div>
                  <p className="modal-status-text">
                    {selectedPlayer.isGolden
                      ? '✨ ¡Figurita Dorada Obtenida! ✨'
                      : '✅ Obtenida'}
                  </p>
                </>
              ) : (
                <>
                  <h3>🔒 Figurita Bloqueada</h3>
                  <p className="modal-status-text">
                    Consigue esta figurita abriendo sobres en la sección de "Sobres" o realizando intercambios en la "Zona de Intercambio".
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
