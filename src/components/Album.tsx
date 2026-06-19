import React, { useEffect, useState } from 'react'
import '../../src/styles/album.css'

type Player = {
  filename: string
  fullName: string
}

type Country = {
  name: string
  players: Player[]
}

const countries: Country[] = [
  {
    name: 'Argentina',
    players: [
      { filename: 'dibu.png', fullName: 'Emiliano Martínez' },
      { filename: 'molina.png', fullName: 'Nahuel Molina' },
      { filename: 'romero.png', fullName: 'Cristian Romero' },
      { filename: 'otamendi.png', fullName: 'Nicolás Otamendi' },
      { filename: 'mac allister.png', fullName: 'Alexis Mac Allister' },
      { filename: 'de paul.png', fullName: 'Rodrigo De Paul' },
      { filename: 'enzo.png', fullName: 'Enzo Fernández' },
      { filename: 'messi.png', fullName: 'Lionel Messi' },
      { filename: 'julian.png', fullName: 'Julián Álvarez' },
      { filename: 'lautaro.png', fullName: 'Lautaro Martínez' },
      { filename: 'simeone.png', fullName: 'Giovanni Simeone' },
      { filename: 'scaloni.png', fullName: 'Lionel Scaloni' }
    ]
  },
  {
    name: 'Paises Bajos',
    players: [
      { filename: 'van dijk.png', fullName: 'Virgil van Dijk' },
      { filename: 'dumfries.png', fullName: 'Denzel Dumfries' },
      { filename: 'de jong.png', fullName: 'Frenkie de Jong' },
      { filename: 'simons.png', fullName: 'Xavi Simons' },
      { filename: 'gakpo.png', fullName: 'Cody Gakpo' },
      { filename: 'depay.png', fullName: 'Memphis Depay' },
      { filename: 'koeman.png', fullName: 'Ronald Koeman' },
      { filename: 'reijnders.png', fullName: 'Tijjani Reijnders' },
      { filename: 'van de ven.png', fullName: 'Micky van de Ven' },
      { filename: 'verbruggen.png', fullName: 'Bart Verbruggen' },
      { filename: 'gravenberch.png', fullName: 'Ryan Gravenberch' },
      { filename: 'malen.png', fullName: 'Donyell Malen' }
    ]
  },
  {
    name: 'Mexico',
    players: [
      { filename: 'lozano.png', fullName: 'Hirving Lozano' },
      { filename: 'jimenez.png', fullName: 'Raúl Jiménez' },
      { filename: 'gallardo.png', fullName: 'Jesús Gallardo' },
      { filename: 'montes.png', fullName: 'César Montes' },
      { filename: 'vasquez.png', fullName: 'Johan Vásquez' },
      { filename: 'vega.png', fullName: 'Alexis Vega' },
      { filename: 'reyes.png', fullName: 'Israel Reyes' },
      { filename: 'alvarado.png', fullName: 'Roberto Alvarado' },
      { filename: 'malagon.png', fullName: 'Luis Malagón' },
      { filename: 'ruiz.png', fullName: 'Marcel Ruiz' },
      { filename: 'edison.png', fullName: 'Edson Álvarez' },
      { filename: 'aguirre.png', fullName: 'Javier Aguirre' }
    ]
  }
]

export default function Album() {
  const [unlocked, setUnlocked] = useState<Record<string, { obtained: boolean; isGolden: boolean }>>({})
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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

  async function toggle(src: string) {
    alert('Las figuritas no se pueden desbloquear haciendo clic. Consigue sobres en la Tienda o reclámalos gratis, y ábrelos en la sección de "Sobres". También puedes intercambiar repetidas en la "Zona de Intercambio".');
  }

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
                return (
                  <div key={p.filename} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div className={`card-container ${isGolden ? 'golden' : ''}`}>
                      <img
                        src={src}
                        alt={p.fullName}
                        className={`card ${isUnlocked ? 'unlocked' : 'locked'} ${isGolden ? 'golden' : ''}`}
                        onClick={() => toggle(src)}
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
    </main>
  )
}
