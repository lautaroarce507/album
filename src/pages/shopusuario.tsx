import React, { useEffect, useState } from 'react'

type Product = {
  id: string
  name: string
  price: number
  image: string
  description: string
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Figurita Dorada',
    price: 1000, 
    image: '/assets/figurita dorada.png',
    description: 'Fifurita dorada Aleatoria.',
  },
  {
    id: '2',
    name: 'Sobre de figuritas',
    price: 2500,
    image: '/assets/sobre de figuritas.png',
    description: 'Sobre con 7 figuritas.',
  },
]

export default function ShopUsuario() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  
  const [cart, setCart] = useState<Product[]>([])

  useEffect(() => {
    setTimeout(() => {
      setProducts(INITIAL_PRODUCTS)
      setLoading(false)
    }, 500)
  }, [])

  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => [...prevCart, product])
  }

  return (
    <main
      style={{
        padding: '40px 20px',
        background: '#ffffffff',
        minHeight: '100vh',
        fontFamily: 'sans-serif',
        position: 'relative', 
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          background: '#d5c5f7ff', // Gris oscuro
          padding: '8px 16px',
          borderRadius: 8,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer'
        }}
      >
        <span style={{ color: '#ffffffff', fontSize: 16, fontWeight: 'bold' }}>
          🛒 Ver Carrito({cart.length})
        </span>
      </div>

      {loading ? (
        <h2 style={{ color: '#333', textAlign: 'center', marginTop: 60 }}>Cargando productos...</h2>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 30,
            maxWidth: 200, 
            margin: '80px auto 0' 
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                background: 'linear-gradient(to bottom, #a3a3a3, #8c8c8c)', 
                borderRadius: 20,
                boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center', 
                padding: '30px 20px 20px 20px', 
              }}
            >
              {/* Imagen del producto */}
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: '80%',        
                  height: 200,          
                  objectFit: 'contain', 
                  marginBottom: 20,
                  filter: 'drop-shadow(0px 10px 10px rgba(0,0,0,0.2))' 
                }}
              />

              <div style={{ width: '100%', boxSizing: 'border-box' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <h2 style={{ margin: 0, fontSize: 18, color: 'white', fontWeight: 'normal' }}>
                    {product.name}
                  </h2>
                  <span style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>
                    ${product.price}
                  </span>
                </div>

                {/* Descripción */}
                <p
                  style={{
                    color: '#e0e0e0',
                    fontSize: 13,
                    lineHeight: '1.4',
                    marginBottom: 25,
                    textAlign: 'left',
                  }}
                >
                  {product.description}
                </p>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <button
                    onClick={() => handleAddToCart(product)}
                    style={{
                      padding: '10px 20px',
                      background: '#549bf2ff', 
                      border: 'none',
                      borderRadius: 8,
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: 14,
                      transition: 'background 0.2s',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = '#549bf2ff')}
                    onMouseOut={(e) => (e.currentTarget.style.background = '#549bf2ff')}
                  >
                    Agregar a carrito
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}