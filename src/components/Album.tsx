import React, { useState } from 'react'
import '../../src/styles/album.css'

type Country = {
  name: string
  images: string[]
}

const countries: Country[] = [
  {
    name: 'Argentina',
    images: [
      'dibu.png','molina.png','romero.png','otamendi.png','mac allister.png','de paul.png','enzo.png','messi.png','julian.png','lautaro.png','simeone.png','scaloni.png'
    ]
  },
  {
    name: 'Paises Bajos',
    images: [
      'van dijk.png','dumfries.png','de jong.png','simons.png','gakpo.png','depay.png','koeman.png','reijnders.png','van de ven.png','verbruggen.png','gravenberch.png','malen.png'
    ]
  },
  {
    name: 'Mexico',
    images: [
      'lozano.png','jimenez.png','gallardo.png','montes.png','vasquez.png','vega.png','reyes.png','alvarado.png','malagon.png','ruiz.png','edison.png','aguirre.png'
    ]
  }
]

export default function Album() {
  const [unlocked, setUnlocked] = useState<Record<string, boolean>>({})

  function toggle(src: string) {
    setUnlocked(prev => ({ ...prev, [src]: true }))
  }

  return (
    <main>
      {countries.map((c) => (
        <section className="country-card" key={c.name}>
          <h2>{c.name}</h2>
          <div className="player-grid">
            {c.images.map((img) => {
              const src = `/assets/${encodeURIComponent(img)}`
              const isUnlocked = !!unlocked[src]
              return (
                <img
                  key={img}
                  src={src}
                  alt={img}
                  className={`card ${isUnlocked ? 'unlocked' : 'locked'}`}
                  onClick={() => toggle(src)}
                />
              )
            })}
          </div>
        </section>
      ))}
    </main>
  )
}
