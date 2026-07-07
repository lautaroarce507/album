import React, { useEffect, useState } from 'react'
import './Welcome.css'

export default function Welcome() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
  }, [])

  return (
    <div className="welcome-container">
      {/* Background image with overlay */}
      <div className="welcome-bg">
        <img
          src="/assets/welcome-collage.jpg"
          alt="World Cup Champions Collage"
          className="welcome-bg-img"
        />
        <div className="welcome-overlay" />
      </div>

      {/* Content */}
      <div className={`welcome-content ${visible ? 'welcome-visible' : ''}`}>
        <p className="welcome-subtitle">Bienvenidos a</p>
        <h1 className="welcome-title">
          <span className="welcome-title-world">World</span>
          <span className="welcome-title-album">Album</span>
        </h1>
      </div>
    </div>
  )
}
